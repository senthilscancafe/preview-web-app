/*global define, jQuery*/

define(['Augment',
    'Instance',
    'GlobalData',
    'PubSub',
    'utils/CookieUtils',
    'services/PrintService',
    'views/messages/MessagesView',
    'hbs/underscore',
    'lockr',
    'hbs!views/print/templates/PrintDeliveryOptionView'
], function (augment, instance, GlobalData, PubSub, CookieUtils, PrintService, MessagesView, _, Lockr, tplPrintDeliveryOptionView) {
    'use strict';

    var PrintDeliveryOptionView = augment(instance, function () {
        var printDeliveryOptionView = this;
        var messagesView = '';
        this.deliverySelectedOption = null;
        this.deliveryOption = {};

        this.addToDiv = function () {
            if (_.isUndefined(GlobalData.printData)) {
                if(_.isUndefined(Lockr.get('storyData')) || _.isUndefined(Lockr.get('printData'))){
                    console.log('print flow data invalid');
                    if(!_.isUndefined(Lockr.get('storyDataBKP')) && !_.isUndefined(Lockr.get('printDataBKP'))){
                        Lockr.set('storyData', Lockr.get('storyDataBKP'));
                        Lockr.set('printData', Lockr.get('printDataBKP'));
                        Lockr.rm('storyDataBKP');
                        Lockr.rm('printDataBKP');
                        GlobalData.printData = Lockr.get('printData');
                        GlobalData.storyData = Lockr.get('storyData');
                    }else{
                        window.onbeforeunload = null;
                        location.hash = '#/dashboard';
                        return true;
                    }
                }
                GlobalData.printData = Lockr.get('printData');
                GlobalData.storyData = Lockr.get('storyData');
            }
            printDeliveryOptionView.deliveryOptions();
            messagesView = MessagesView.create();
        };

        this.preloader = function () {
            jQuery('body > .pageload').fadeOut();
            jQuery('#saveDeliveryData').click(printDeliveryOptionView.saveDeliveryData);
            jQuery('.address-line-separator:first').hide();
            jQuery('.printDeliveryOptionElements .shareRadio').click(printDeliveryOptionView.selectDeliveryOptionAddress);


            if (GlobalData.printData.deliveryOption) {
                jQuery('.printRadio.active').removeClass('active');
                jQuery('#' + GlobalData.printData.deliveryOption.id).addClass('active');
                printDeliveryOptionView.deliverySelectedOption = jQuery('.printRadio.active').attr('id');
            }else{
                //default radio btn selected
                //console.log(jQuery('.printRadio:first').attr('id'));
                jQuery('.printRadio.active').removeClass('active');
                var id = jQuery('.printRadio:first').attr('id');
                jQuery('#' + id).addClass('active');
                printDeliveryOptionView.deliverySelectedOption = id;
            }
        };

        this.getSelectedDeliveryData = function () {
            if (_.isUndefined(GlobalData.printData.deliveryList)) {
                console.log('GlobalData.printData.deliveryList undefined');
            } else {
                for (var i = 0; i < GlobalData.printData.deliveryList.length; i++) {
                    if (GlobalData.printData.deliveryList[i].id == printDeliveryOptionView.deliverySelectedOption) {
                        printDeliveryOptionView.deliveryOption = GlobalData.printData.deliveryList[i];
                        //GlobalData.printData.deliveryOption = GlobalData.printData.deliveryList[i];
                    }
                }
            }
        };

        this.saveDeliveryData = function (event) {
            //jQuery('body > .pageload').fadeIn();
            event.stopPropagation();
            //get the selection delivery option
            printDeliveryOptionView.getSelectedDeliveryData();
            //console.dir(GlobalData.printData.deliveryOption);
            console.dir(printDeliveryOptionView);
            //return false;
            
            
            //Following code is for the user who tries to come from summary screen
            if(GlobalData.printData.summaryModify){
                

                //TODO:call update cart API if there is a change in delivery option, for now calling for any case
                //console.dir(GlobalData.printData.cartData);
                if (!_.isUndefined(GlobalData.printData.cart_id)) {
                    var dataSrc = GlobalData.printData;
                    var requestData = null;
                    var promise = null;

                    requestData = {
                    "user_id": CookieUtils.getCookie("custId"),
                    "spreads": dataSrc.pageInfo.spreadList,
                    "book_price": dataSrc.pageInfo.amount, //TODO: update with realtime values from pageView
                    "discount_amount": null, //just for API compatibility, no need of this param
                    "address_id": dataSrc.shippingAddress.address_id,
                    "state": dataSrc.selectedCard.billingAddress.region,
                    "delivery_option_id": printDeliveryOptionView.deliveryOption.id,
                    "productId": dataSrc.bookData.id,
                    "order_id": GlobalData.storyData.id,
                    "shipping_price": printDeliveryOptionView.deliveryOption.price,
                    "cart_id": dataSrc.cart_id,
                    "promoType": 0,
                    "ship_to_zip_code": dataSrc.shippingAddress.zip,
                    "couponCode": (_.isUndefined(dataSrc.coupon)) ? null : dataSrc.coupon.couponCode,
                    "pageCount": dataSrc.pageInfo.pageCount, //TODO: update with realtime values from pageView
                    };
                    console.dir(requestData);
                    promise = PrintService.updateCart(requestData);
                    $.when(promise)
                        .done(function (obj) {
                            if (obj.arr_data !== null && obj.int_status_code !== 0) {
                                delete GlobalData.printData.summaryModify;
                                GlobalData.printData.cart_id = (_.isUndefined(obj.arr_data.cart_id)) ? '' : obj.arr_data.cart_id;
                                GlobalData.printData.cartData = obj.arr_data;
                                GlobalData.printData.deliveryOption = printDeliveryOptionView.deliveryOption;
                                GlobalData.printData.redirectURL = '#/print/order/summary';
                                printDeliveryOptionView.redirectToPages();
                            } else {
                                console.log('deliveryOptionView updateCart API response is null');
                                messagesView.addToDiv();
                                jQuery('.dialog-with-head').modal('show');
                                messagesView.messageMiddle();
                                jQuery('#dialog-with-head-header').find('h4').text('Error!');
                                jQuery('#dialog-with-head-content').text(obj.str_status_message);
                                jQuery('#dialog-with-head-action').parent().css("display","block");
                                jQuery('#dialog-with-head-action').text('Ok');
                                jQuery('#dialog-with-head-action').click(function(event){
                                    event.stopPropagation();
                                    jQuery('.dialog-with-head').modal('hide');
                                });
                            }
                        });
                }
            
            }else{
                GlobalData.printData.deliveryOption = printDeliveryOptionView.deliveryOption;
                GlobalData.printData.redirectURL = '#/print/card';
                printDeliveryOptionView.redirectToPages();
            }
            
            
        };

        this.selectDeliveryOptionAddress = function () {
            jQuery('.printRadio.active').removeClass('active');
            jQuery(this).addClass('active');
            printDeliveryOptionView.deliverySelectedOption = jQuery('.printRadio.active').attr('id');
        };

        this.deliveryOptions = function () {
            var requestData = {
                print_partner_id: GlobalData.printData.bookData.printPartnerId
            };
            var promise = PrintService.deliveryOptions(requestData);
            var deliveryOptions = null;
            $.when(promise)
                .done(function (obj) {
                    //console.log(obj);
                    if (obj.arr_data !== null && obj.int_status_code !== 0) {
                        deliveryOptions = obj.arr_data;
                        deliveryOptions.sort(function (a, b) { //ascending order of price
                            return a.price - b.price;
                        });
                        //console.dir(deliveryOptions);
                        
                        var divClass = "printContainer";
                        var innerHtml = tplPrintDeliveryOptionView({
                            deliveryOptions: deliveryOptions,
                            submitLabel: 'Continue'
                        });
                        jQuery('.' + divClass).empty();
                        jQuery('.' + divClass).html(innerHtml);
                         jQuery('.page-loading').css('overflow', 'auto');

                        printDeliveryOptionView.preloader();
                        //console.dir(obj.arr_data.deliveryoptions);
                        GlobalData.printData.deliveryList = deliveryOptions;
                    } else {
                        console.log('API response is null');
                    }
                });
        };

        this.redirectToPages = function () {
            Lockr.set('printData', GlobalData.printData);
            location.hash = GlobalData.printData.redirectURL;
        };

    });

    return PrintDeliveryOptionView;
});