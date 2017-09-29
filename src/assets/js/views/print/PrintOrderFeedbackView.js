/*global define, jQuery*/

define(['Augment',
    'Instance',
    'GlobalData',
    'PubSub',
    'utils/CookieUtils',
    'services/PrintService',
    'views/messages/MessagesView',
    'hbs/underscore',
    'xss',
    'hbs!views/print/templates/PrintOrderFeedbackView'
], function (augment, instance, GlobalData, PubSub, CookieUtils, PrintService, MessagesView, _, xss, tplPrintOrderFeedbackView) {
    'use strict';

    var PrintOrderFeedbackView = augment(instance, function () {
        var printOrderFeedbackView = this;
        var messagesView = '';
        this.rating = null;
        this.feedbackMessage = null;
        this.addToDiv = function () {
            jQuery('.pageload').fadeIn();
            if (_.isUndefined(GlobalData.printData)) {
                GlobalData.printData = Lockr.get('printData');
            }
            console.dir(GlobalData.printData.selectedOrderDetails);
            var divClass = "printContainer";
            var innerHtml = tplPrintOrderFeedbackView({
                heading: 'Feedback',
                orderDetails: GlobalData.printData.selectedOrderDetails,
                submitLabel: 'Send'
            });
            jQuery('.' + divClass).empty();
            jQuery('.' + divClass).html(innerHtml);
            jQuery('.page-loading').css('overflow', 'auto');
            
            printOrderFeedbackView.rating = null;
            
            $('#feedbackPageRating').barrating('show', {
                theme: 'fontawesome-stars',
                allowEmpty: false,
                //showValues: true,
                //showSelectedRating: false,
                //emptyValue:'',
                //initialRating: null,
                hoverState: false,
                onSelect: function (value, text, event) {
                    if (typeof (event) !== 'undefined') {
                        // rating was selected by a user
                        //console.log(event.target);
                        printOrderFeedbackView.rating = $(event.target).data('rating-value');
                        jQuery('#saveFeedbackData').removeClass('disabled').off('click').on("click", printOrderFeedbackView.saveFeedback);
                    } else {
                        // rating was selected programmatically
                        // by calling `set` method
                    }
                }
            });

            if(GlobalData.printData.selectedOrderDetails.rating !== '0'){
                $('#feedbackPageRating').barrating('set', parseInt(GlobalData.printData.selectedOrderDetails.rating));
                $('#feedbackPageRating').barrating('readonly', true);
                //printOrderFeedbackView.rating = parseInt(GlobalData.printData.selectedOrderDetails.rating);
            }
            printOrderFeedbackView.preloader();
            messagesView = MessagesView.create();

            //enable disable submit button
            $("#feedbackMessage").bind("keyup change", function (event) {
                event.stopPropagation();
                var charLength = $.trim($(this).val()).length;
                console.log(charLength , printOrderFeedbackView.rating);
                
                if(GlobalData.printData.selectedOrderDetails.rating !== '0'){//second time in feedback screen
                    jQuery('#saveFeedbackData').removeClass('disabled').off('click').on("click", printOrderFeedbackView.saveFeedback);
                    if (charLength === 0) {
                        jQuery('#saveFeedbackData').addClass('disabled').off("click", printOrderFeedbackView.saveFeedback);
                    }
                }else{
                    //first time in feedback screen
                    if (charLength === 0) {
                        //At least one input is empty
                        if (!_.isNull(printOrderFeedbackView.rating)) {
                            jQuery('#saveFeedbackData').removeClass('disabled').off('click').on("click", printOrderFeedbackView.saveFeedback);
                        }else{
                            jQuery('#saveFeedbackData').addClass('disabled').off("click", printOrderFeedbackView.saveFeedback);
                        }
                    } else {
                        if (!_.isNull(printOrderFeedbackView.rating)) {
                            jQuery('#saveFeedbackData').removeClass('disabled').off('click').on("click", printOrderFeedbackView.saveFeedback);
                        }else{
                            jQuery('#saveFeedbackData').addClass('disabled').off("click", printOrderFeedbackView.saveFeedback);
                        }
                    }
                }
                
            });
        };

        this.preloader = function () {
            jQuery('body > .pageload').fadeOut();
            window.onbeforeunload = null;
            //jQuery('#saveFeedbackData').click(printOrderFeedbackView.saveFeedback);
            jQuery('#saveFeedbackData').addClass('disabled').off("click", printOrderFeedbackView.saveFeedback);
        };

        this.saveFeedback = function (event) {
            event.stopPropagation();
            GlobalData.ec.recordClickEvent('Print_Feedback', 'click', 'Feedback_Submit_Button');
            var requestData = printOrderFeedbackView.validation();
            //console.dir(requestData);
            if (requestData) {
                var promise = PrintService.postFeedbackDetails(requestData);
                $.when(promise)
                    .done(function (obj) {
                        console.dir(obj);
                        if (obj.arr_data !== null && obj.int_status_code !== 0) {
                            //update the globalObject with current rating
                            GlobalData.printData.selectedOrderDetails.rating = (_.isNull(requestData.rating))?GlobalData.printData.selectedOrderDetails.rating : requestData.rating.toString();
                            console.dir(GlobalData.printData.selectedOrderDetails);
                            messagesView.addToDiv();
                            jQuery('.dialog-without-head').modal('show');
                            messagesView.messageMiddle();
                            jQuery('#dialog-without-head-content').text('Thank you for your feedback.');
                            jQuery('#dialog-without-head-action').parent().css("display", "block");
                            jQuery('#dialog-without-head-action').text('Ok');
                            jQuery('#dialog-without-head-action').click(function (event) {
                                event.stopPropagation();
                                jQuery('.dialog-without-head').modal('hide');
                                GlobalData.printData.redirectURL = '#/print/order/details';
                                printOrderFeedbackView.redirectToPages();
                            });

                        } else {
                            console.log('saveFeedback API response is null');
                            messagesView.addToDiv();
                            jQuery('.alertDialog').modal('show');
                            jQuery('#displayText').text('Oops! something went wrong.');
                        }
                    });
            }
        };

        this.validation = function () {
            //XSS filter
            var options = {
                whiteList: [], // empty, means filter out all tags
                //stripIgnoreTag:     true,      // filter out all HTML not in the whilelist
                stripIgnoreTagBody: true, // the script tag is a special case, we need to filter out its content
            };
            printOrderFeedbackView.feedbackMessage = xss($.trim($('#feedbackMessage').val()), options);

            if(GlobalData.printData.selectedOrderDetails.rating === '0'){
                if (_.isUndefined(printOrderFeedbackView.rating) || _.isNull(printOrderFeedbackView.rating)) {
                    messagesView.addToDiv();
                    jQuery('.dialog-without-head').modal('show');
                    messagesView.messageMiddle();
                    jQuery('#dialog-without-head-content').text('Please select a rating to send feedback.');
                    jQuery('#dialog-without-head-action').parent().css("display", "block");
                    jQuery('#dialog-without-head-action').text('Ok');
                    return false;
                }
            }

            if(GlobalData.printData.selectedOrderDetails.rating !== '0'){
                if (printOrderFeedbackView.feedbackMessage.length === 0 || _.isNull(printOrderFeedbackView.feedbackMessage)) {
                    messagesView.addToDiv();
                    jQuery('.alertDialog').modal('show');
                    jQuery('#displayText').text('Message field cannot be blank.');
                    return false;
                }
            }
            
            console.log('rating ' + printOrderFeedbackView.rating);

            var data = null;
            data = {
                "category_id": 1,
                "customer_id": CookieUtils.getCookie("custId"),
                "issuedesc": printOrderFeedbackView.feedbackMessage,
                "order_id": GlobalData.printData.selectedOrderDetails.order_id,
                "print_order_id": GlobalData.printData.selectedOrderDetails.id,
                "rating": printOrderFeedbackView.rating,
            };
            return data;
        };

        this.redirectToPages = function () {
            location.hash = GlobalData.printData.redirectURL;
        };

    });

    return PrintOrderFeedbackView;
});