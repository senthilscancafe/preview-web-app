/*global define, jQuery, location, window,tabsThis, console*/
define(['Augment',
    'Instance',
    'GlobalData',
    'services/UserService',
    'utils/CookieUtils',
    'views/verification/VerificationView',
    'hbs!views/help/templates/Help'
], function (augment, instance, GlobalData, UserService, CookieUtils, VerificationView, tplHelp) {

    'use strict';

    var Help = augment(instance, function () {
        var help = this;
        this.temp = true;
        this.init = function () {
            var tabsThis = this;
            var help = this;
            this.temp = true;
            jQuery(window).resize(function () {
                //                Help.preloader();
                Help.mainContentHeight();
                if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/Android/i))) {
                    Help.mobileHeader(tabsThis);
                    Help.resizeMob();
                } else {
                    Help.DeskHeader();
                    Help.resizeDesk();
                }
            });
        };
        this.addToDiv = function () {
            var divId = "appSignInDiv";
            console.log(GlobalData.imageBase);
            var innerHtml = tplHelp({
                terms: GlobalData.terms,
                imageBase: GlobalData.imageBase,
                baseURL: GlobalData.baseUrl2
            });
            jQuery('#' + divId).empty();
            //            jQuery('.mainContainer').removeClass('app');
            jQuery('.mainContainer').hide();
            jQuery('#' + divId).html(innerHtml);
            jQuery('.home-icon').show();
            this.preloader();

        };
        this.preloader = function () {
            //            jQuery("body").scrollTop(300);
            jQuery('body').addClass('page-loaded').removeClass('page-loading');
            jQuery('body > .pageload').fadeOut();
            jQuery('body.page-loaded').css("background", "#dedede");
            jQuery('.navbar-nav').hide();
            jQuery('.loginHeader').show();
            jQuery('.home-icon, .logoPhotogurus>img').click(function () {
                location.hash = "/dashboard";
                jQuery('.home-icon').hide();
                jQuery('body').addClass('page-loaded');
                jQuery('body > .pageload').fadeIn();
            });
            if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/Android/i))) {
                Help.resizeMob();

            } else {
                Help.resizeDesk();

            }
            //            jQuery('.ui-accordion-content').hide();
            Help.mainContentHeight();
            jQuery(".accordion4help").accordion({
                heightStyle: "content",
                collapsible: true,
                active: false,
                alwaysOpen: true
            });

            jQuery('#clearBtn').click(Help.clearFields);
            //            jQuery('#sendBtn').click(Help.sendForm);
            //            jQuery('.panel-heading a').on('click', function(e) {
            //                if (jQuery(this).parents('.panel').children('.panel-collapse').hasClass('in')) {
            //                    e.preventDefault();
            //                    e.stopPropagation();
            //                }
            //                jQuery(".panel-title").css("color", "#818181");
            //                jQuery(this).parent(".panel-title").css("color", "#4b4b4b");
            //            });
            jQuery(".helpfeedback").click(function () {
                console.log('checkpoint 1');
                jQuery(".tab-pane").removeClass("active");
                jQuery(".tab-pane#tab6").addClass("active");
                jQuery(".tabs>li>a").css({
                    "color": "#818181",
                    "font-weight": "100"
                });
                jQuery(".tabs>li>a>span").removeClass("active-arrow");
                jQuery(".feedback-tab a").children(".normal-arrow").addClass("active-arrow");
                jQuery(".feedback-tab a").css({
                    "color": "#4b4b4b",
                    "font-weight": "600"
                });

            });
            jQuery('.accordion4help_heading').click(function () {
                if (jQuery(this).children('.accordion4help_heading_num').hasClass("active")) {
                    console.log('checkpoint 2');
                    jQuery(this).children('.accordion4help_heading_num').removeClass("active");
                    jQuery('.accordion4help_heading').css("color", "#818181");
                } else {
                    console.log('checkpoint 3');
                    jQuery('.accordion4help_heading').children('.accordion4help_heading_num').removeClass("active");
                    jQuery(this).children('.accordion4help_heading_num').addClass("active");
                    jQuery('.accordion4help_heading').css("color", "#818181");
                    jQuery(this).css("color", "#4b4b4b");
                }
            });
            jQuery(".tabs a").click(function () {
                var tabsThis = this;
                jQuery(".accordion4help").accordion({
                    heightStyle: "content",
                    collapsible: true,
                    active: false,
                    alwaysOpen: true
                });
                console.log('checkpoint 4');
                jQuery(".accordion4help_heading_num").removeClass("active");
                jQuery('.accordion4help_heading').css("color", "#818181");
                jQuery(".tabs>li>a>span").removeClass("active-arrow");
                jQuery(".tabs>li>a").css({
                    "color": "#818181",
                    "font-weight": "100"
                });
                jQuery(this).children(".normal-arrow").addClass("active-arrow");
                jQuery(this).css({
                    "color": "#4b4b4b",
                    "font-weight": "600"
                });

                if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/Android/i))) {
                    Help.mobileHeader(tabsThis);
                } else {
                    Help.DeskHeader();
                }
                help.temp = true;
            });
            jQuery(".sendCode").click(function () {

                if (parseInt(CookieUtils.getCookie("is_verified"))) {

                } else {
                    Help.showVerifyPopup();
                }
            });
            jQuery(".uploadeButton").click(function () {
                if (parseInt(CookieUtils.getCookie("is_verified"))) {
                    location.hash = "/uploader";
                }
            });
            jQuery('.backIcon').click(function () {console.log('called');
                jQuery('.left-help-bar').show();
                jQuery('.top-icon').hide();
                jQuery('.home-icon').show();
                jQuery('.mob-help-header').text("Help");
                console.log('checkpoint 5');
                jQuery(".tabs,.tab-pane").removeClass("active");
                jQuery(".tabs>li>a").css({
                    "color": "#818181",
                    "font-weight": "100"
                });
                jQuery(".tabs>li>a>span").removeClass("active-arrow");
                jQuery("body").scrollTop(0);
                help.temp = false;
            });
            jQuery('#feedback_options').ddslick({
                onSelected: function () {
                    //callback function: do something with selectedData;
                }
            });
            jQuery("#filter").keypress(function () {
                jQuery(".innerPpara_wraper").hide();
                jQuery("#cancel-help-search").show();

            });
            jQuery("#filter").keyup(function () {
                // Retrieve the input field text and reset the count to zero
                var filter = jQuery(this).val(),
                    count = 0;
                jQuery(".accordion4help").accordion({
                    heightStyle: "content",
                    collapsible: true,
                    active: false,
                    alwaysOpen: true
                });

                // Loop through the comment list
                jQuery(".accordion4help_heading").each(function () {

                    // If the list item does not contain the text phrase fade it out
                    if (jQuery(this).text().search(new RegExp(filter, "i")) < 0) {
                        jQuery(this).fadeOut();

                        // Show the list item if the phrase matches and increase the count by 1
                    } else {
                        jQuery(".tab-pane").addClass("active");
                        console.log('checkpoint 6');
                        jQuery(".tab-pane#tab6").removeClass("active");
                        jQuery(this).show();
                        jQuery(".left-help-bar").hide();
                        jQuery(".tab-content").addClass("removeBorder");
                        jQuery('.accordion4help_heading').children('.accordion4help_heading_num').removeClass("active");
                        jQuery('.accordion4help_heading').css("color", "#818181");
                        count++;

                    }

                });
                if (jQuery('.accordion4help_heading:visible').length === 0) {
                    jQuery('.noResult').show();
                    jQuery(".searchedResult").hide();
                } else {
                    jQuery(".searchedResult span").text(jQuery(this).val());
                    jQuery(".searchedResult").show();
                    jQuery('.noResult').hide();
                }
                // Update the count
                var numberItems = count;
                jQuery("#filter-count").text("Number of Comments = " + numberItems);
            });
            jQuery('#cancel-help-search').click(Help.showQuestions);
            jQuery("#send_feedback").click(Help.sendFeedback);
            jQuery("#filter").keyup(function () {
                if (!this.value) {
                    Help.showQuestions();
                }
            });

            jQuery('.appInstallID').click(function () {
                if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/Android/i))) {
                    Help.foundDeviceLink();
                } else {
                    alert("This feature is not availble on desktop");
                }
            });
        };

        this.foundDeviceLink = function () {
            if ((navigator.userAgent.match(/Android/i))) {
                isAndroid = 1;
                window.location.href = 'https://play.google.com/store/apps/details?id=com.photogurus';
            } else if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i))) {
                window.location.href = 'https://itunes.apple.com/us/app/photogurus/id799452318?ls=1&mt=8';
            }
        };

        this.mobileHeader = function (tabsThis) {
            jQuery('.left-help-bar').hide();
            jQuery('.top-icon').show();
            jQuery(".home-icon").hide();
            jQuery('.mob-help-header').text(jQuery(tabsThis).text());
            Help.mainContentHeight();
            //console.log(jQuery(tabsThis).html());
            //console.log(jQuery(tabsThis).attr('href'));
            
            /*if (jQuery(tabsThis).parent(".firstTab").hasClass("active")) {
                jQuery('#tab1').addClass("active");
            }*/

            jQuery(jQuery(tabsThis).attr('href')).addClass("active");
        };
        this.showVerifyPopup = function () {
            var verificationView = VerificationView.create();
            verificationView.addToDiv();
            jQuery('#verifyModal').modal('show');

        };
        this.DeskHeader = function () {
            jQuery('.left-help-bar').show();
            jQuery(".home-icon").show();
        };
        this.resizeMob = function () {
            
            
                console.log('checkpoint 7');
                //console.log($('.tab-pane').parent().find('.active').attr('id'));
                //console.log($('.tab-pane').parent().find('.active').length);
                /*if($('.tab-pane').parent().find('.active').length > 0){
                    $('#'+$('.tab-pane').parent().find('.active').attr('id')).text();
                }*/
                //nav tabs
                if($('.nav-sidebar').find('.active').length > 0){
                    //console.log($('.nav-sidebar').find('.active > a').text());
                    jQuery('.mob-help-header').text($('.nav-sidebar').find('.active > a').text());
                }else{
                    jQuery('.mob-help-header').text("Help");
                }
                // if ($('.tab-pane').parent().find('.active')) {
                //     console.log('test '+jQuery(this).html());
                // }
                //jQuery(".tabs,.tab-pane").removeClass("active");
                jQuery(".tabs>li>a").css({
                    "color": "#818181",
                    "font-weight": "100"
                });
                jQuery(".tabs>li>a>span").removeClass("active-arrow");
                //jQuery(".firstTab a>span").addClass("active-arrow");
                //jQuery('#tab1').addClass("active");
console.log(help.temp);
                if(!help.temp){
                    help.temp = true;
                    console.log('made true');
                jQuery('.left-help-bar').show();
                jQuery('.left-help-bar').show();
                jQuery('.top-icon').hide();
                jQuery('.home-icon').show();
                jQuery('.mob-help-header').text("Help");
            }
            
        };
        this.resizeDesk = function () {
            console.log('checkpoint 8');
            jQuery(".tabs,.tab-pane").removeClass("active");
            jQuery(".tabs>li>a").css({
                "color": "#818181",
                "font-weight": "100"
            });
            jQuery(".firstTab a").css({
                "color": "#4b4b4b",
                "font-weight": "600"
            });
            jQuery(".tabs>li>a>span").removeClass("active-arrow");
            jQuery(".firstTab a>span").addClass("active-arrow");
            jQuery('#tab1').addClass("active");
        };
        this.showQuestions = function () {
            jQuery("#filter").val("");
            jQuery(".searchedResult,.noResult").hide();
            jQuery(".left-help-bar").show();
            jQuery(".tab-content").removeClass("removeBorder");
            console.log('checkpoint 9');
            jQuery(".tab-pane").removeClass("active");
            jQuery("#tab1").addClass("active");
            jQuery(".accordion4help_heading").show();
            jQuery("#cancel-help-search").hide();
            jQuery(".tabs>li>a").css({
                "color": "#818181",
                "font-weight": "100"
            });
            jQuery(".tabs>li.firstTab>a").css({
                "color": "#4b4b4b",
                "font-weight": "600"
            });
        };
        this.mainContentHeight = function () {
            var minHeight;
            jQuery('body').css("background-color", "#ffffff");
            if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/Android/i))) {
                minHeight = jQuery(window).height() - ((jQuery('.loginHeader').height()));
                //jQuery('.tab-content').css("min-height", minHeight + "px");
            } else {
                minHeight = jQuery(window).height() - ((jQuery('.loginHeader').height()) + jQuery('.help-search-container').height());
                jQuery('.tab-content').css("min-height", minHeight + "px");
            }
        };

        this.clearFields = function () {
            jQuery('#contact_customer_care_form .form-control').val("");
            jQuery('#helperror').hide();
            jQuery('#contact_customer_care_form .form-control').removeAttr("disabled", "disabled");
        };
        this.sendFeedback = function () {
            jQuery('#helperror').hide();
            var message = jQuery.trim(jQuery("textarea#message").val());
            var category = parseInt(jQuery(".dd-selected-value").val());
            if (message === "") {
                jQuery('#helperror').show().text("Please enter your message");
                jQuery("textarea#message").focus();
                return false;
            }
            jQuery('#helperror').hide();
            var requestData = {
                "customer_id": CookieUtils.getCookie("custId"),
                "issuedesc": message,
                "category_id": category
            };
            var promise = UserService.updateFeedbackInfo(requestData);
            promise.then(function (data) {
                if (data.int_status_code === 0) {
                    jQuery('#helperror').show().text("We are unable to receive your message. Please try after some time");
                } else {
                    jQuery('#helperror').show().text("Thank you for your message. We will get back to you shortly.");
                    jQuery('textarea#message').val("");
                }
            });
        };
        //        this.sendForm = function() {
        //            jQuery('#helperror').hide();
        //            var name = jQuery.trim(jQuery("input#customername").val());
        //            if (name === "") {
        //                jQuery('#helperror').show().text("Please Enter your name");
        //                jQuery("input#customername").focus();
        //                return false;
        //            }
        //            var email = jQuery.trim(jQuery("input#email").val());
        //            if (email === "") {
        //                jQuery('#helperror').show().text("Please Enter your Email");
        //                jQuery("input#email").focus();
        //                return false;
        //            }
        //            var x = jQuery.trim(jQuery("input#email").val());
        //            var atpos = x.indexOf("@");
        //            var dotpos = x.lastIndexOf(".");
        //            if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= x.length) {
        //                jQuery('#helperror').show().text("Please Enter valid Email");
        //                jQuery("input#email").focus();
        //                return false;
        //            }
        //            var message = jQuery.trim(jQuery("textarea#message").val());
        //            if (message === "") {
        //                jQuery('#helperror').show().text("Please Enter your message");
        //                jQuery("textarea#message").focus();
        //                return false;
        //            }
        //            jQuery('#helperror').hide();
        //            var requestData = {
        //                "customername": name,
        //                "email": email,
        //                "issuedesc": message
        //            };
        //            var promise = UserService.updateHelpInfo(requestData);
        //            promise.then(function(data) {
        //                if (data.int_status_code === 0) {
        //                    jQuery('#helperror').show().text("We are unable to receive your message, Please try after some time");
        //                } else {
        //                    jQuery('#helperror').show().text("Thank you for your message.We will get back to you shortly.");
        //                    jQuery('#contact_customer_care_form .form-control').attr("disabled", "disabled");
        //                }
        //            });
        //
        //
        //        };
    });

    return Help;
});