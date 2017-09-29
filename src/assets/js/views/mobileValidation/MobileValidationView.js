/*global define, jQuery, window,intlTelInputUtils */

define(['Augment',
    'Instance',
    'GlobalData',
    'utils/CookieUtils',
    'utils/MobileValidationUtils',
    'services/ShareService',
    'views/messages/MessagesView',
    'hbs!views/mobileValidation/templates/MobileValidationView'
], function (augment, instance, GlobalData, CookieUtils, MobileValidationUtils, ShareService, MessagesView, tplMobileValidationView) {

    'use strict';
    var MobileValidationView = augment(instance, function () {
        var mobileValidationView = this;
        this.init = function () {
            jQuery(window).resize(function () {
                mobileValidationView.messageMiddle();
            });
        };
        mobileValidationView.mobileData = "";
        this.addToDiv = function (data, shareMobiledata, emailValues, previewURL, imagecaption) {
            var mobileValView = this;
            mobileValidationView.mobileData = data;
            mobileValidationView.shareMobile = shareMobiledata;
            mobileValidationView.shareEmail = emailValues;
            mobileValidationView.countryName = '';
            mobileValidationView.previewURL = previewURL;
            mobileValidationView.imagecaption = imagecaption;
            var divId = "privateMobileCheck";
            var innerHtml = tplMobileValidationView({
                mobileData: mobileValidationView.mobileData
            });
            jQuery('#' + divId).empty();
            jQuery('#' + divId).html(innerHtml);

            var telInput = jQuery(".mobile-number");
            telInput.trigger("change");
            var mobileData = telInput.intlTelInput("getSelectedCountryData");
            jQuery('.selected-flag .iti-flag').text(mobileData.iso2).css("text-transform", "uppercase");
            telInput.on("change", function () {
                var mobileData = jQuery(this).intlTelInput("getSelectedCountryData");
                jQuery(this).siblings('.flag-dropdown').children('.selected-flag').children('.iti-flag').text(mobileData.iso2).css("text-transform", "uppercase");
            });
            //
            telInput.focusout(function () {
                mobileValView.checkNumbers();
            });

            this.changeScreen();
        };

        this.changeScreen = function () {
            //            jQuery(".mobile-number").intlTelInput();
            jQuery('.telephone-input').intlTelInput({
                autoFormat: false,
                autoHideDialCode: true,
                nationalMode: false,
                numberType: "MOBILE",
                autoPlaceholder: false,
                //                onlyCountries: ['us', 'ch', 'ca', 'do'],
                //                preferredCountries: [mobileValidationView.countryName],
                responsiveDropdown: true,
                preventInvalidNumbers: false,
                preventInvalidDialCodes: false
            });
            var telInput = jQuery(".mobile-number");
            telInput.trigger("change");
            var mobileData = telInput.intlTelInput("getSelectedCountryData");
            jQuery('.selected-flag .iti-flag').text(mobileData.iso2).css("text-transform", "uppercase");
            telInput.on("change", function () {
                var mobileData = jQuery(this).intlTelInput("getSelectedCountryData");
                jQuery(this).siblings('.flag-dropdown').children('.selected-flag').children('.iti-flag').text(mobileData.iso2).css("text-transform", "uppercase");
            });

            jQuery('#PrivareMobileBack').click(function () {
                var messagesView = MessagesView.create();
                messagesView.addToDiv();
                jQuery('#messageModal').modal('show');
                mobileValidationView.messageMiddle('messageModal');
                jQuery('#ok_back').show();
                mobileValidationView.messageMiddle('ok_back');
                jQuery('#back_text').show();
                jQuery('#phoneNumber').val('');
                jQuery('#confirm_download, #download_text').hide();
                mobileValidationView.messageMiddle();

            });
            jQuery(".delIcon").on("click", function () {
                if (jQuery('#sharemobileForm').children().length === 1) {
                    jQuery('#privateMobileCheck').hide();
                    jQuery('#scrPrivareShareSend').show();
                    jQuery(this).parents(".form-group").remove();
                } else {
                    jQuery(this).parents(".form-group").remove();
                }
            });
        };

        this.checkNumbers = function () {
            jQuery(".error").text('').hide();
            var share_mobiles = [];
            var share_ALL_mobiles = [];
            var isAllMobileNoValid = true;
            jQuery('.mobile-number').each(function () {
                var thisInput = this;
                var mobileItem = jQuery(this).val();

                mobileItem = mobileItem.trim();
                if (mobileItem.startsWith("+")) {
                    mobileItem = "+" + mobileItem.substring(1).replace(/[^a-zA-Z0-9]/g, '');
                } else {
                    mobileItem = mobileItem.replace(/[^a-zA-Z0-9]/g, '');
                    mobileItem = MobileValidationUtils.getCurrentCountryCodeINT() + mobileItem;
                }

                jQuery(thisInput).val(mobileItem);
                var mobileData = {
                    country_code: countryCode,
                    mobile: mobileNumber
                };

                var mobileDetails = MobileValidationUtils.parseMobileData(mobileItem);

                if ((mobileDetails.isValid === "true") && (mobileDetails.numberType === "MOBILE" || mobileDetails.numberType === "FIXED_LINE_OR_MOBILE")) {
                    var formatmobile = mobileDetails.formatRFC3966;
                    if (formatmobile !== undefined && formatmobile !== null && formatmobile.length > 5) {
                        var number = formatmobile.substring(5);
                        var countryCode = number.split(/-(.+)?/)[0];
                        var mobileNumber = number.split(/-(.+)?/)[1].replace(/[- +]/ig, "");
                        // Check for nexmo support the country
                        mobileData.country_code = countryCode;
                        mobileData.mobile = mobileNumber;

                        if (MobileValidationUtils.doesWeSupportCountry(countryCode)) {
                            share_mobiles.push(mobileData);
                        } else {
                            // Nexmo doesn't support the country code.
                            mobileData.errorMsg = "Sorry, we don't support sending SMS to this number. Please delete to proceed.";
                            isAllMobileNoValid = false;
                        }

                    } else {
                        // Invalid format code
                        mobileData.mobile = mobileItem;
                        mobileData.errorMsg = "Invalid format code";
                        isAllMobileNoValid = false;
                    }
                } else {
                    // Invalid mobile no
                    mobileData.mobile = mobileItem;
                    mobileData.errorMsg = "Please enter valid mobile number";
                    isAllMobileNoValid = false;
                }

                if (!isAllMobileNoValid) {
                    jQuery(".error").text('');
                    jQuery(thisInput).parents('.form-group').find(".error").text(mobileData.errorMsg);
                    jQuery(thisInput).parents('.form-group').find(".error").show();
                }

                if (isAllMobileNoValid) {
                    jQuery("#privateMobileFormNext").removeClass('disabled');
                } else {
                    jQuery("#privateMobileFormNext").addClass('disabled');
                }
            });
            jQuery("#privateMobileFormNext").off('click');
            jQuery("#privateMobileFormNext").on('click', function () {
                jQuery(".error").hide();
                jQuery('body').addClass('page-loaded');
                jQuery('body > .pageload').fadeIn();
                var requestData = {
                    groups: [],
                    share_mobiles: share_mobiles,
                    customer_id: mobileValidationView.shareMobile.customer_id,
                    share_emails: mobileValidationView.shareEmail,
                    tracking_id: mobileValidationView.shareMobile.tracking_id,
                    token: mobileValidationView.shareMobile.token,
                    emailsubject: mobileValidationView.shareMobile.emailsubject,
                    emailcontent: mobileValidationView.shareMobile.emailcontent,
                    share_id: mobileValidationView.shareMobile.share_id,
                };

                if (!(navigator.userAgent.match(/iPhone/i)) && !(navigator.userAgent.match(/iPad/i)) && !(navigator.userAgent.match(/iPod/i)) && !(navigator.userAgent.match(/Android/i))) {
                    requestData.apimode = "web";
                }
                var mobileNumber = '';
                for (var i = 0; i < share_mobiles.length; i++) {
                    if (i < share_mobiles.length - 1) {
                        if (navigator.userAgent.match(/Android/i)) {
                            mobileNumber = mobileNumber + '+' + share_mobiles[i].country_code + share_mobiles[i].mobile + ',';
                        } else {
                            mobileNumber = mobileNumber + '{+' + share_mobiles[i].country_code + share_mobiles[i].mobile + '},';
                        }
                    } else {
                        mobileNumber = mobileNumber + '+' + share_mobiles[i].country_code + share_mobiles[i].mobile;
                    }
                }
                //                mobileNumber=mobileNumber+",";
                var sharer = CookieUtils.getCookie("custName");
                var storyName = mobileValidationView.imagecaption;
                if (navigator.userAgent.match(/Android/i)) {
                    document.location = "sms:" + mobileNumber + "?body=Check out " + sharer + "'s story " + storyName + " on Photogurus at " + mobileValidationView.previewURL;
                } else {
                    document.location = "sms:/open?addresses=" + mobileNumber + "&body=Check out " + sharer + "'s story " + storyName + " on Photogurus at " + mobileValidationView.previewURL;
                }
                var promise = ShareService.postemailgroupShare(requestData);
                promise.then(function (data) {
                    jQuery('body').addClass('page-loaded').removeClass('page-loading');
                    jQuery('body > .pageload').fadeOut();
                    if (data.int_status_code === 0) {
                        jQuery('#errorMessageModal').modal('show');
                        mobileValidationView.messageMiddle('ok_back');
                        jQuery('#errorMessageModal .share-text').text(data.str_status_message);
                    } else {
                        jQuery('#okModal').modal('show');
                        mobileValidationView.messageMiddle('okModal');
                        jQuery('#okModal .share-text').text("Your story has been shared.");
                        jQuery('#okModal #ok_shared').show();
                        jQuery('#okModal #ok_same').hide();
                        jQuery('.scrForm .form-control').val("");
                    }
                }).fail(function () {});
            });
        };

        this.messageMiddle = function (modalName) {
            var msgContent = ((jQuery(window).height()) - (181)) / 2;
            jQuery('#' + modalName + ' .modal-dialog').css('margin-top', msgContent + 'px');
        };
    });
    return MobileValidationView;
});