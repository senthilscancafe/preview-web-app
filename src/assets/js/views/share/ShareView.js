/*global define, jQuery, window*/

define(['Augment',
    'Instance',
    'PubSub',
    'GlobalData',
    'utils/CookieUtils',
    'utils/LanguageUtils',
    'utils/MobileValidationUtils',
    'services/ShareService',
    'views/shareinner/ShareInnerView',
    'views/mobileValidation/MobileValidationView',
    'hbs!views/share/templates/ShareView'
], function (augment, instance, PubSub, GlobalData, CookieUtils, LanguageUtils, MobileValidationUtils, ShareService, ShareInnerView, MobileValidationView, tplShareView, tplEmailShareView) {
    'use strict';
    var ShareView = augment(instance, function () {
        var shareView = this;
        this.tempData = "";
        this.facebookData = "";
        this.init = function () {
            var shareview = this;
            jQuery(window).resize(function () {
                shareview.modalHeight();
            });
        };
        shareView.postemailgroupShareData = "";
        this.addToDiv = function () {
            var divId = "shareScreenModal";
            var senderEmail = CookieUtils.getCookie("custEmail");
            if (CookieUtils.getCookie("custEmail") === 'null') {
                senderEmail = CookieUtils.getCookie("custName");
            }

            var innerHtml = tplShareView({
                coverURL: ShareView.shareData.coverurl,
                senderemail: senderEmail,
                story_caption: ShareView.shareData.cover_caption,
                Share: LanguageUtils.valueForKey("Share"),
                PrivateShare: LanguageUtils.valueForKey("PrivateShare"),
                EmailorMobileNumber: LanguageUtils.valueForKey("EmailorMobileNumber"),
                SeparateEmailaddressesOrMobile: LanguageUtils.valueForKey("SeparateEmailaddressesOrMobile"),
                SeprateEmailaddresses: LanguageUtils.valueForKey("SeprateEmailaddresses"),
                Subject: LanguageUtils.valueForKey("Subject"),
                Message: LanguageUtils.valueForKey("Message"),
                Requireslogin: LanguageUtils.valueForKey("Requireslogin"),
                Checkoutmystory: LanguageUtils.valueForKey("Checkoutmystory"),
                hello: LanguageUtils.valueForKey("hello"),
                textareaMessageStart: LanguageUtils.valueForKey("textareaMessageStart"),
                textareaMessageEnd: LanguageUtils.valueForKey("textareaMessageEnd"),
                From: LanguageUtils.valueForKey("From"),
                ToEmail: LanguageUtils.valueForKey("ToEmail"),
                withFriends: LanguageUtils.valueForKey("withFriends"),
                Tagyourfriends: LanguageUtils.valueForKey("Tagyourfriends"),
                SelectWhoCanSee: LanguageUtils.valueForKey("SelectWhoCanSee"),
                Friends: LanguageUtils.valueForKey("Friends"),
                Self: LanguageUtils.valueForKey("Self"),
                shared_to_all_flag: ShareView.shareData.shared_to_all_contributor_flag,
                design_request_type: ShareView.shareData.design_request_type
            });
            jQuery('#' + divId).empty();
            jQuery('#' + divId).html(innerHtml);

            if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/Android/i))) {
                jQuery('.mobileShareScreen').show();
                jQuery('.desktopShareScreen').hide();
            } else {
                jQuery('.mobileShareScreen').hide();
                jQuery('.desktopShareScreen').show();
            }

            this.changeScreen();
        };
        this.changeScreen = function () {
            ShareView.modalHeight();
            var location;
            jQuery('#privateMobileCheck').hide();
            jQuery('#shareModal .modal-body').perfectScrollbar();
            jQuery("#scr1 .close").click(function () {
                jQuery('body').removeClass("mobModal");
            });
            jQuery('.fb').click(function () {
                GlobalData.ec.recordClickEvent('Share_view', 'FacebookShareClicked');
                ShareInnerView.title = "Facebook";
                jQuery('.shareType').text("Facebook Share");
                //ShareView.getshareFBScreenDetails();
                FB.getLoginStatus(function (response) {
                    //UploaderView.statusChangeCallback(response);
                    ShareView.getshareFBScreenDetails1(response);
                });
                
                jQuery('body').addClass('page-loaded');
                jQuery('body > .pageload').fadeIn();
            });
            jQuery('.pvt_share').click(function () {
                GlobalData.ec.recordClickEvent('Share_view', 'PrivateShareClicked');
                ShareInnerView.title = "Share Privately";
                jQuery('.shareType').text("Text Message Share");
                ShareView.getshareScreenDetails();
                jQuery('body').addClass('page-loaded');
                jQuery('body > .pageload').fadeIn();
            });
            jQuery('.email-button').click(function () {
                GlobalData.ec.recordClickEvent('Share_view', 'EmailShareClicked');
                ShareInnerView.title = "Email Share";
                jQuery('.shareType').text("Email Share");
                ShareView.getshareScreenDetails();
                jQuery('body').addClass('page-loaded');
                jQuery('body > .pageload').fadeIn();
            });
            jQuery('.share-button').click(function () {
                GlobalData.ec.recordClickEvent('Share_view', 'CopyLinkShareClicked');
                ShareInnerView.title = "Copy Link";
                jQuery('.shareType').text("Copy Link");
                ShareView.getshareScreenDetails();
                jQuery('body').addClass('page-loaded');
                jQuery('body > .pageload').fadeIn();
            });
            jQuery('#privateShareNext').click(function () {
                jQuery('#scrPrivareShare').hide();
                jQuery('.shareType').text("Text Message Share");
                jQuery('#scrPrivareShareSend').show();
            });
            jQuery('#privateShareFormNext').click(function () {
                jQuery('body').addClass('page-loaded');
                jQuery('body > .pageload').fadeIn();
                jQuery(".mobile-number").intlTelInput();
                var shareID = jQuery('#phoneNumber').val();
                var myarray = shareID.split(',');
                var errorItems = [];
                var mobileItems = [];
                var emailItems = [];
                var validFlag = 1;
                var share_mobiles = [];
                var share_ALL_mobiles = [];
                for (var i = 0; i < myarray.length; i++) {
                    var items = myarray[i].trim();
                    var Emailfilter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                    if (Emailfilter.test(items)) {
                        jQuery('body').addClass('page-loaded').removeClass('page-loading');
                        jQuery('body > .pageload').fadeOut();
                        ShareView.showModal();
                        jQuery('#okModal .share-text').text("Please enter mobile number");
                        return;
                    } else {
                        items = items.trim();
                        if (items.startsWith("+")) {
                            items = "+" + items.substring(1).replace(/[^a-zA-Z0-9]/g, '');
                        } else {
                            items = items.replace(/[^a-zA-Z0-9]/g, '');
                        }
                        var phonenoFilter = /^[0-9_@+-]*$/;
                        if (phonenoFilter.test(items)) {
                            mobileItems.push(items);
                        } else {
                            errorItems.push(items);
                        }

                    }
                }
                var recipients = jQuery('#phoneNumber').val();
                var subject = jQuery('#shareSubjectId').val();
                if (recipients === "") {
                    jQuery('body').addClass('page-loaded').removeClass('page-loading');
                    jQuery('body > .pageload').fadeOut();
                    ShareView.showModal();
                    jQuery('#okModal .share-text').text("Please enter mobile number");
                    return;
                } else if (subject === "") {
                    jQuery('body').addClass('page-loaded').removeClass('page-loading');
                    jQuery('body > .pageload').fadeOut();
                    ShareView.showModal();
                    jQuery('#okModal .share-text').text("Please Enter Subject");
                    return;
                }

                var emailValues = emailItems + "";
                var errorValues = errorItems + "";
                if (errorValues.length > 0) {
                    jQuery('body').addClass('page-loaded').removeClass('page-loading');
                    jQuery('body > .pageload').fadeOut();
                    ShareView.showModal();
                    if (errorValues.length === 1) {
                        jQuery('#okModal .share-text').html("Below phone number is invalid <br>" + errorValues);
                    } else {
                        jQuery('#okModal .share-text').html("Below phone number are invalid <br>" + errorValues);
                    }
                    return;
                }
                if (mobileItems.length > 0) {
                    jQuery('body').addClass('page-loaded').removeClass('page-loading');
                    jQuery('body > .pageload').fadeOut();
                    var isAllMobileNoValid = true;
                    for (var j = 0; j < mobileItems.length; j++) {

                        if (!mobileItems[j].startsWith("+")) {
                            mobileItems[j] = MobileValidationUtils.getCurrentCountryCodeINT() + mobileItems[j];
                        }
                        var mobileData = {
                            country_code: countryCode,
                            mobile: mobileNumber
                        };
                        jQuery('#phoneNumber').val(mobileItems[j]);
                        var mobileDetails = MobileValidationUtils.parseMobileData(mobileItems[j]);
                        // Check valid mobile no 
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
                                mobileData.mobile = mobileItems[j];
                                mobileData.errorMsg = "Invalid format code";
                                isAllMobileNoValid = false;
                            }
                        } else {
                            // Invalid mobile no
                            mobileData.mobile = mobileItems[j];
                            mobileData.errorMsg = "Please enter valid mobile number";
                            isAllMobileNoValid = false;
                        }

                        share_ALL_mobiles.push(mobileData);
                    }

                    jQuery('#phoneNumber').val(mobileItems);
                    if (isAllMobileNoValid) {
                        requestData = {
                            groups: [],
                            share_mobiles: share_mobiles,
                            customer_id: CookieUtils.getCookie("custId"),
                            share_emails: emailValues,
                            tracking_id: ShareView.shareData.pb_tracking_id,
                            token: ShareInnerView.storeShareInfoResponseData.fbdbtoken,
                            emailsubject: jQuery('#shareSubjectId').val(),
                            emailcontent: jQuery('#shareMessageId').val(),
                            share_id: ShareInnerView.storeShareInfoResponseData.share_id,                            
                        };
                        
                        if (!(navigator.userAgent.match(/iPhone/i)) && !(navigator.userAgent.match(/iPad/i)) && !(navigator.userAgent.match(/iPod/i)) && !(navigator.userAgent.match(/Android/i))) {
                            requestData.apimode = "web";
                        }
                        jQuery('body').addClass('page-loaded');
                        jQuery('body > .pageload').fadeIn();
                        var promise = ShareService.postemailgroupShare(requestData);
                        var mobileNumber = '';
                        for (var ii = 0; ii < share_mobiles.length; ii++) {
                            if (ii < share_mobiles.length - 1) {
                                if (navigator.userAgent.match(/Android/i)) {
                                    mobileNumber = mobileNumber + '+' + share_mobiles[ii].country_code + share_mobiles[ii].mobile + ',';
                                } else {
                                    mobileNumber = mobileNumber + '{+' + share_mobiles[ii].country_code + share_mobiles[ii].mobile + '},';
                                }
                            } else {
                                mobileNumber = mobileNumber + '+' + share_mobiles[ii].country_code + share_mobiles[ii].mobile;
                            }
                        }
//                mobileNumber=mobileNumber+",";
                        var sharer = CookieUtils.getCookie("custName");
                        var storyName = ShareInnerView.storeShareInfoResponseData.imagecaption;
                        if (navigator.userAgent.match(/Android/i)) {
                            document.location = "sms:" + mobileNumber + "?body=Check out " + sharer + "'s story " + storyName + " on Photogurus at " + ShareInnerView.storeShareInfoResponseData.previewurl;
                        } else {
                            document.location = "sms:/open?addresses=" + mobileNumber + "&body=Check out " + sharer + "'s story " + storyName + " on Photogurus at " + ShareInnerView.storeShareInfoResponseData.previewurl;
                        }
                        promise.then(function (data) {
                            jQuery('body').addClass('page-loaded').removeClass('page-loading');
                            jQuery('body > .pageload').fadeOut();
                            if (data.int_status_code === 0) {
                                jQuery('#errorMessageModal').modal('show');
                                jQuery('#errorMessageModal .share-text').text(data.str_status_message);
                            } else {
                                jQuery('#okModal').modal('show');
                                jQuery('#okModal .share-text').text("Your story has been shared.");
                                jQuery('#okModal #ok_shared').show();
                                jQuery('#okModal #ok_same').hide();
                            }
                        }).fail(function () {

                        });

                    } else {
                        var requestData = {
                            groups: [],
                            customer_id: CookieUtils.getCookie("custId"),
                            tracking_id: ShareView.shareData.pb_tracking_id,
                            token: ShareInnerView.storeShareInfoResponseData.fbdbtoken,
                            emailsubject: jQuery('#shareSubjectId').val(),
                            emailcontent: jQuery('#shareMessageId').val(),
                            share_id: ShareInnerView.storeShareInfoResponseData.share_id
                        };
                        var shareMobiledata = [];
                        shareMobiledata = requestData;
                        var mobileValidationView = MobileValidationView.create();
                        mobileValidationView.addToDiv(share_ALL_mobiles, shareMobiledata, emailValues, ShareInnerView.storeShareInfoResponseData.previewurl, ShareInnerView.storeShareInfoResponseData.imagecaption);
                        jQuery('#scrPrivareShareSend').hide();
                        jQuery("#privateMobileCheck").show();
                        ShareView.modalHeight();
                        jQuery('#privateMobileCheck .modal-body').perfectScrollbar();
                    }

                } else {

                    requestData = {
                        groups: [],
                        share_mobiles: [],
                        customer_id: CookieUtils.getCookie("custId"),
                        share_emails: emailValues,
                        tracking_id: ShareView.shareData.pb_tracking_id,
                        token: ShareInnerView.storeShareInfoResponseData.fbdbtoken,
                        emailsubject: jQuery('#shareSubjectId').val(),
                        emailcontent: jQuery('#shareMessageId').val(),
                        share_id: ShareInnerView.storeShareInfoResponseData.share_id,                        
                    };
                    if (!(navigator.userAgent.match(/iPhone/i)) && !(navigator.userAgent.match(/iPad/i)) && !(navigator.userAgent.match(/iPod/i)) && !(navigator.userAgent.match(/Android/i))) {
                        requestData.apimode = "web";
                    }
                    var promise = ShareService.postemailgroupShare(requestData);
                    var sharer = CookieUtils.getCookie("custName");
                    var storyName = ShareInnerView.storeShareInfoResponseData.imagecaption;
                    var mobileNumber = '';
                    for (var ij = 0; ij < share_mobiles.length; ij++) {
                        if (ij < share_mobiles.length - 1) {
                            if (navigator.userAgent.match(/Android/i)) {
                                mobileNumber = mobileNumber + '+' + share_mobiles[ij].country_code + share_mobiles[ij].mobile + ',';
                            } else {
                                mobileNumber = mobileNumber + '{+' + share_mobiles[ij].country_code + share_mobiles[ij].mobile + '},';
                            }
                        } else {
                            mobileNumber = mobileNumber + '+' + share_mobiles[ij].country_code + share_mobiles[ij].mobile;
                        }
                    }
//                mobileNumber=mobileNumber+",";
                    var sharer = CookieUtils.getCookie("custName");
                    var storyName = ShareInnerView.storeShareInfoResponseData.imagecaption;
                    if (navigator.userAgent.match(/Android/i)) {
                        document.location = "sms:" + mobileNumber + "?body=Check out " + sharer + "'s story " + storyName + " on Photogurus at " + ShareInnerView.storeShareInfoResponseData.previewurl;
                    } else {
                        document.location = "sms:/open?addresses=" + mobileNumber + "&body=Check out " + sharer + "'s story " + storyName + " on Photogurus at " + ShareInnerView.storeShareInfoResponseData.previewurl;
                    }
                    promise.then(function (data) {
                        jQuery('body').addClass('page-loaded').removeClass('page-loading');
                        jQuery('body > .pageload').fadeOut();
                        if (data.int_status_code === 0) {
                            jQuery('#errorMessageModal').modal('show');
                            jQuery('#errorMessageModal .share-text').text(data.str_status_message);
                        } else {
                            jQuery('#okModal').modal('show');
                            jQuery('#okModal .share-text').text("Your story has been shared.");
                            jQuery('#okModal #ok_shared').show();
                            jQuery('#okModal #ok_same').hide();
                            //                        jQuery('#okModal #ok_same').click(function() {
                            //                            jQuery('#shareModal').modal('hide');
                            //                        });
                        }


                    }).fail(function () {

                    });
                }

            });
            jQuery(".share-checkBox").click(function () {
                if (jQuery(this).parent().hasClass("active")) {
                    jQuery(this).parent().removeClass("active");
                } else {
                    jQuery(this).parent().addClass("active");
                }
            });
            jQuery(".share-radio").click(function () {
                if (jQuery(".share-radio").parent().hasClass("active")) {
                    jQuery(".share-radio").parent().removeClass("active");
                }
                jQuery(this).parent().addClass("active");
            });
            jQuery(".overlay").click(function () {
                if (jQuery(this).siblings(".share-checkImg").hasClass("active")) {
                    jQuery(this).siblings(".share-checkImg").removeClass("active");
                } else {
                    jQuery(this).siblings(".share-checkImg").addClass("active");
                }
            });
            jQuery('.tag-icon').click(function () {
                jQuery('body').addClass('page-loaded');
                jQuery('body > .pageload').fadeIn();
                if (ShareInnerView.shareListloaded === 1) {
                    jQuery('body').addClass('page-loaded').removeClass('page-loading');
                    jQuery('body > .pageload').fadeOut();
                    jQuery('.tag-icon').css("border-bottom", "1px solid #a2a2a2");
                    jQuery('.with-text, #s2id_tagPicker, .placeholder-text').show();
                    jQuery('#tagPicker').select2('open');
                }
            });

            jQuery('#tagPicker').select2({
                closeOnSelect: false
            });

            jQuery('#PrivareShareBack, #PrivareShareBackForm, #privateShareBackForm').click(function () {
                jQuery('#alertModal').modal('show');
                shareView.messageMiddle('alertModal');
                if (((jQuery(window).width()) < 768) && (jQuery(window).height()) < (jQuery(window).width())) {
                    jQuery('#alertModal .modal-content').css('margin-top', "15%");
                }
            });
            jQuery('#ok_shareBack').click(function () {
                if (ShareView.infoView === true) {
                    jQuery('#alertModal').modal('hide');
                    jQuery('#shareModal').modal('hide');
                    jQuery('#shaereInfo').hide();
                    jQuery('#scrPrivareShareSend, #scrFacebookShareSend, #scrEmailShareSend').hide();
                    jQuery("#InfoModal").modal('show');
                    ShareView.infoView = false;
                } else {
                    jQuery('#alertModal').modal('hide');
                    jQuery('#scrPrivareShareSend, #scrFacebookShareSend, #scrEmailShareSend ,#scrPrivareShare').hide();
                    jQuery('#scr1').show();
                }

            });
            jQuery('#cancel_back').click(function () {
                jQuery('#alertModal').modal('hide');
            });

            jQuery('#ok_shared').click(function () {
                jQuery('.modal').modal('hide');
            });

            jQuery('#errorMessageModalOKBtn').click(function () {
                jQuery('#errorMessageModal').modal('hide');
            });

            jQuery('#privateShareNext').on('click', function () {
                if (jQuery('#privateShareNext').hasClass("facebookTags")) {
                    jQuery('#scrPrivareShare').hide();
                    jQuery('#scrPrivareShareSend').hide();
                    jQuery('#scrFacebookShareSend').show();
                }
            });
            jQuery('#facebookShareFormNext').click(function () {
                jQuery('body').addClass('page-loaded');
                jQuery('body > .pageload').fadeIn();
                var privacyDeatil = ShareInnerView.facebookPrivacyDetails[0];
                var privacyDeatils;
                if ((privacyDeatil === "FRIENDS") && (jQuery('#ShareFriends').is(':checked'))) {
                    privacyDeatils = "ALL_FRIENDS";
                } else if ((privacyDeatil === "FRIENDS") && (jQuery('#ShareSelf').is(':checked'))) {
                    privacyDeatils = "SELF";
                } else {
                    privacyDeatils = ShareInnerView.facebookPrivacyDetails[0];
                }

                var tagValue = jQuery('#tagPicker').val();
                var tagValues;
                if (tagValue === '' || tagValue === null || tagValue === undefined) {
                    tagValues = tagValue;
                } else {
                    tagValues = tagValue.toString();
                }
                var custId = CookieUtils.getCookie("custId");
                var custID = parseInt(custId);
                var requestData = {
                    access_token: ShareInnerView.facebookData.authResponse.accessToken,
                    imageids: shareView.imageIdsData.toString(),
                    order_id: shareView.shareInnerData.order_id,
                    privacy: privacyDeatils,
                    comment: jQuery("#facebookCommentId").val(),
                    customer_id: custID,
                    cover_caption: ShareInnerView.shareData.cover_caption,
                    tracking_id: ShareInnerView.shareData.pb_tracking_id,
                    picture: shareView.shareInnerData.images[0].name,
                    tags: tagValues
                };

                var promise = ShareService.facebookShare(requestData);
                promise.then(function (data) {
                    console.dir(data);
                    jQuery('body').addClass('page-loaded').removeClass('page-loading');
                    jQuery('body > .pageload').fadeOut();
                    if (data.int_status_code === 1) {
                        jQuery('#okModal').modal('show');
                        if (((jQuery(window).width()) < 768) && (jQuery(window).height()) < (jQuery(window).width())) {
                            jQuery('#okModal .modal-content').css('margin-top', "15%");
                        }
                        
                        jQuery('#okModal .modal-header').hide();
                        jQuery('#okModal .share-text').text("Your story has been shared.");
                        jQuery('#okModal #ok_shared').show();
                        jQuery('#okModal #ok_same').hide();
                        var pixel_params = null;
                        pixel_params = {'Share_type' : 'Facebook'};
                        //Fb Pixel
                        GlobalData.ec.recordFBPixelEvent('trackCustom', 'StoryShare', pixel_params);
                        jQuery('.modal').modal('hide');
                    } else {
                        jQuery('#okModal').modal('show');
                        if (((jQuery(window).width()) < 768) && (jQuery(window).height()) < (jQuery(window).width())) {
                            jQuery('#okModal .modal-content').css('margin-top', "15%");
                        }
                        jQuery('#okModal .modal-header h4').text('Unable to share!');
                        jQuery('#okModal .share-text').text("We are unable to share this story on Facebook. Please try again after some time.");
                        jQuery('#okModal #ok_shared').show();
                        jQuery('#okModal #ok_same').hide();
                    }

                });
            });

            jQuery('#privateEmailFormNext').click(function () {
                var mobile = 0;
                /*if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/Android/i))) {
                    mobile = 1;
                }*///commenting this mobile detection snippet, as it should work same like web as asked by Priya
                if ((mobile === 0)) {
                    var requestData = {
                        groups: [],
                        //                    share_mobiles: [],
                        customer_id: CookieUtils.getCookie("custId"),
                        share_emails: jQuery('#EmailAndMobileId').val(),
                        tracking_id: ShareView.shareData.pb_tracking_id,
                        token: ShareInnerView.storeShareInfoResponseData.fbdbtoken,
                        emailsubject: jQuery('#SubjectId').val(),
                        emailcontent: jQuery('#MessageId').val(),
                        share_id: ShareInnerView.storeShareInfoResponseData.share_id
                    };
                    //if (!(navigator.userAgent.match(/iPhone/i)) && !(navigator.userAgent.match(/iPad/i)) && !(navigator.userAgent.match(/iPod/i)) && !(navigator.userAgent.match(/Android/i))) {
                        requestData.apimode = "web";// to use mandrilservice
                    //}
                    jQuery('body').addClass('page-loaded');
                    jQuery('body > .pageload').fadeIn();
                    var promise = ShareService.postemailgroupShare(requestData);
                    promise.then(function (data) {
                        jQuery('body').addClass('page-loaded').removeClass('page-loading');
                        jQuery('body > .pageload').fadeOut();
                        if (data.int_status_code === 0) {
                            jQuery('#errorMessageModal').modal('show');
                            shareView.messageMiddle('errorMessageModal');
                            jQuery('#errorMessageModal .modal-header h4').text('Error!');
                            jQuery('#errorMessageModal .share-text').text(data.str_status_message);
                        } else {
                            jQuery('#okModal').modal('show');
                            shareView.messageMiddle('okModal');
                            jQuery('#okModal .modal-header').hide();
                            jQuery('#okModal .share-text').text("Your story has been shared.");
                            jQuery('#okModal #ok_shared').show();
                            jQuery('#okModal #ok_same').hide();
                            var pixel_params = null;
                            pixel_params = {'Share_type' : 'Email'};
                            //Fb Pixel
                            GlobalData.ec.recordFBPixelEvent('trackCustom', 'StoryShare', pixel_params);
                        }
                    }).fail(function () {

                    });
                }
                if (mobile) {
                    var validEmail = 0;
                    var shareID = jQuery('#EmailAndMobileId').val();
                    var myarray = shareID.split(',');
                    for (var i = 0; i < myarray.length; i++) {
                        var items = myarray[i].trim();
                        var Emailfilter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                        if (Emailfilter.test(items)) {
                            if (items === CookieUtils.getCookie("custEmail")) {
                                ShareView.showModal();
                                jQuery('#okModal .share-text').text("You can't share to your own email address");
                                break;
                            } else {
                                validEmail = 1;
                            }

                        } else {
                            validEmail = 0;
                            break;
                        }
                    }
                    if (validEmail === 0) {
                        ShareView.showModal();
                        if (shareID === "") {
                            jQuery('#okModal .share-text').text("Please enter email id");
                        } else {
                            jQuery('#okModal .share-text').text("Please enter valid email id");
                        }
                    }

                    if (validEmail) {

                        var requestData = {
                            groups: [],
                            //                    share_mobiles: [],
                            customer_id: CookieUtils.getCookie("custId"),
                            share_emails: jQuery('#EmailAndMobileId').val(),
                            tracking_id: ShareView.shareData.pb_tracking_id,
                            token: ShareInnerView.storeShareInfoResponseData.fbdbtoken,
                            emailsubject: jQuery('#SubjectId').val(),
                            emailcontent: jQuery('#MessageId').val(),
                            share_id: ShareInnerView.storeShareInfoResponseData.share_id
                        };

                        if (!(navigator.userAgent.match(/iPhone/i)) && !(navigator.userAgent.match(/iPad/i)) && !(navigator.userAgent.match(/iPod/i)) && !(navigator.userAgent.match(/Android/i))) {
                            requestData.apimode = "web";
                        }
                        jQuery('body').addClass('page-loaded');
                        jQuery('body > .pageload').fadeIn();
                        var session = CookieUtils.getCookie("sessionKey");
                        var promise = ShareService.postemailgroupShareMobile(requestData, session);
                        ShareView.emailTemplateCretion();
                        //                            var storyURL = jQuery('#MessageId').attr("data-url");
                        var storyName = ShareInnerView.storeShareInfoResponseData.imagecaption;
                        var email = jQuery('#EmailAndMobileId').val();
                        var subject = jQuery('#SubjectId').val();
                        //                    var emailBody = "%3Chtml%20xmlns%3D%22http:%2F%2Fwww.w3.org%2F1999%2Fxhtml%22%3E%3C%2Fhead%3E%3Cbody%3EPlease%20%3Ca%20href%3D%22http:%2F%2Fwww.w3.org%22%3Eclick%3C%2Fa%3E%20me%3C%2Fbody%3E%3C%2Fhtml%3E";
                        var emailBodyIOS = jQuery('#mailBody').html();
                        //                    var emailBodyAndroidLink = $(".andr").html();
                        var emailBodyAndroid = "Hi, %0D%0A%0D%0AHave a look at my story " + storyName + ", made for me by Photogurus.%0D%0A%0D%0AUse this link " + ShareInnerView.storeShareInfoResponseData.previewurl + "%0D%0A%0D%0A Thank You";

                        //                    var attach = 'path';
                        if (navigator.userAgent.match(/Android/i)) {
                            //document.location = "mailto:" + email + "?subject=" + subject + "&body=" + emailBodyAndroid + "&attachment=" + ShareView.shareData.coverurl;
                            console.log('Android1');
                            console.log(emailBodyIOS);
                            document.location = "mailto:" + email + "?subject=" + subject + "&body=" + emailBodyIOS;
                        } else {
                            console.log('IOS1');
                            console.log(emailBodyIOS);
                            document.location = "mailto:" + email + "?subject=" + subject + "&body=" + emailBodyIOS;
                        }
                        promise.then(function (data) {
                            jQuery('body').addClass('page-loaded').removeClass('page-loading');
                            jQuery('body > .pageload').fadeOut();
                            if (data.int_status_code === 0) {
                                jQuery('#errorMessageModal').modal('show');
                                shareView.messageMiddle('errorMessageModal');
                                jQuery('#errorMessageModal .share-text').text(data.str_status_message);
                            } else {
                                jQuery('#okModal').modal('show');
                                shareView.messageMiddle('okModal');
                                jQuery('#okModal .share-text').text("Your story has been shared.");
                                jQuery('#okModal #ok_shared').show();
                                jQuery('#okModal #ok_same').hide();
                            }
                        }).fail(function () {

                        });
                    }


                }
            });
            
            jQuery('.btn-sharewithcontributors').click(function() {
                var requestData = {                    
                    customer_id: CookieUtils.getCookie("custId"),
                    order_id: ShareView.shareData.id
                };
                
                jQuery('body').addClass('page-loaded');
                jQuery('body > .pageload').fadeIn();
                var session = CookieUtils.getCookie("sessionKey");
                var promise = ShareService.shareContributor(requestData, session);
                
                promise.then(function (data) {
                    jQuery('body').addClass('page-loaded').removeClass('page-loading');
                    jQuery('body > .pageload').fadeOut();
                    if (data.int_status_code === 0) {
                        jQuery('#errorMessageModal').modal('show');
                        shareView.messageMiddle('errorMessageModal');
                        jQuery('#errorMessageModal .share-text').text(data.str_status_message);
                    } else {
                        jQuery('#okModal').modal('show');
                        shareView.messageMiddle('okModal');
                        jQuery('#okModal .share-text').text("Your story has been shared.");
                        jQuery('#okModal #ok_shared').show();
                        jQuery('#okModal #ok_same').hide();
                        
                        PubSub.publish("UPDATE_DASHBOARD_NO_CONDITION");
                    }
                }).fail(function () {

                });
            });
        };

        this.emailTemplateCretion = function () {
            var divId = "shareScreenModal";
            var senderEmail = CookieUtils.getCookie("custEmail");
            if (CookieUtils.getCookie("custEmail") === 'null') {
                senderEmail = CookieUtils.getCookie("custName");
            }
            var innerHtml = tplEmailShareView({
                coverURL: ShareView.shareData.coverurl,
                senderemail: senderEmail,
                story_caption: ShareView.shareData.cover_caption,
                Share: LanguageUtils.valueForKey("Share"),
                PrivateShare: LanguageUtils.valueForKey("PrivateShare"),
                EmailorMobileNumber: LanguageUtils.valueForKey("EmailorMobileNumber"),
                SeparateEmailaddressesOrMobile: LanguageUtils.valueForKey("SeparateEmailaddressesOrMobile"),
                SeprateEmailaddresses: LanguageUtils.valueForKey("SeprateEmailaddresses"),
                Subject: LanguageUtils.valueForKey("Subject"),
                Message: LanguageUtils.valueForKey("Message"),
                Requireslogin: LanguageUtils.valueForKey("Requireslogin"),
                Checkoutmystory: LanguageUtils.valueForKey("Checkoutmystory"),
                hello: LanguageUtils.valueForKey("hello"),
                textareaMessageStart: LanguageUtils.valueForKey("textareaMessageStart"),
                textareaMessageEnd: LanguageUtils.valueForKey("textareaMessageEnd"),
                From: LanguageUtils.valueForKey("From"),
                ToEmail: LanguageUtils.valueForKey("ToEmail"),
                withFriends: LanguageUtils.valueForKey("withFriends"),
                Tagyourfriends: LanguageUtils.valueForKey("Tagyourfriends"),
                SelectWhoCanSee: LanguageUtils.valueForKey("SelectWhoCanSee"),
                Friends: LanguageUtils.valueForKey("Friends"),
                Self: LanguageUtils.valueForKey("Self"),
                previewURL: ShareInnerView.storeShareInfoResponseData.previewurl,
                shared_to_all_flag: ShareView.shareData.shared_to_all_contributor_flag
            });
            jQuery('#mailBody').empty();
            jQuery('#mailBody').html(innerHtml);
        }
        this.messageMiddle = function (modalName) {
            var msgContent = ((jQuery(window).height()) - (181)) / 2;
            jQuery('#' + modalName + ' .modal-dialog').css('margin-top', msgContent + 'px');
        };

        this.modalHeight = function () {
            var deskDevice, bodyHeight, deskWidth, modalWidth, formHeight, coverHeight, bodyHeightScr1;
            if (jQuery(window).width() < 768) {
                var smallDevice = (window.innerHeight - 130);
                var smallDeviceWidth = jQuery(window).width();
                var contentWidth = smallDeviceWidth * 0.70;
                if ((jQuery(window).height() < jQuery(window).width())) {
                    contentWidth = smallDeviceWidth * 0.40;
                    jQuery('.sc1-content').css('width', contentWidth + "px");
                }
                jQuery('#shareModal > .modal-dialog > .modal-content').height(window.innerHeight);
                jQuery('#shareModal > .modal-dialog > .modal-content .modal-body').css("max-height", smallDevice + 'px');
                jQuery('#shareModal > .modal-dialog > .modal-content#scr1 .modal-body').css("max-height", '100%');
                jQuery('.sc1-content').css('width', contentWidth + "px");
            } else if ((jQuery(window).width() > 767) && (jQuery(window).height() < 950)) {
                if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/Android/i))) {

                    deskDevice = (jQuery(window).height()) * 0.7;
                    bodyHeight = deskDevice - 124;
                    bodyHeightScr1 = deskDevice;
                    deskWidth = deskDevice * 0.7;
                    modalWidth = deskWidth * 0.7;
                    formHeight = deskDevice - 160;
                    coverHeight = modalWidth;
                    jQuery('#shareModal > .modal-dialog > .modal-content').css("height", deskDevice + "px");
                    jQuery('#shareModal > .modal-dialog > .modal-content').css("width", deskWidth + "px");
                    jQuery('#scr1 .modal-body').css({"max-height": bodyHeight + "px", 'padding-left': '0px', 'padding-right': '0px'});
                    jQuery('#shareModal > .modal-dialog > .modal-content#scr1').css("height", bodyHeightScr1 + "px");
                    jQuery('#shareModal > .modal-dialog > .modal-content#scr1 .modal-body').css("max-height", bodyHeightScr1 + "px");
                    jQuery('.scrForm').perfectScrollbar();
                    jQuery('.scrForm').height(formHeight + "px");
                    jQuery('#shareDialog').css('width', deskWidth + "px");
                    jQuery('.sc1-content').css('width', modalWidth - 60 + "px");
                    jQuery('#shareCover').css('height', modalWidth - 60 + "px");


                } else {
//                    deskDevice = 500;
//                    bodyHeight = deskDevice - 124;
//                    bodyHeightScr1 = deskDevice;
//                    deskWidth = deskDevice * 0.7;
//                    modalWidth = deskWidth * 0.7;
//                    formHeight = deskDevice - 160;
//                    coverHeight = modalWidth;
//                    jQuery('#shareModal > .modal-dialog > .modal-content').css("height", deskDevice + "px");
//                    jQuery('#shareModal > .modal-dialog > .modal-content').css("width", deskWidth + "px");
//                    jQuery('#scr1 .modal-body').css({"max-height": bodyHeight + "px", 'padding-left': '0px', 'padding-right': '0px'});
//                    jQuery('#shareModal > .modal-dialog > .modal-content#scr1').css("height", bodyHeightScr1 + "px");
//                    jQuery('#shareModal > .modal-dialog > .modal-content#scr1 .modal-body').css("max-height", bodyHeightScr1 + "px");
//                    jQuery('.scrForm').perfectScrollbar();
//                    jQuery('.scrForm').height(formHeight + "px");
//                    jQuery('#shareDialog').css('width', deskWidth + "px");
//                    jQuery('.sc1-content').css('width', modalWidth + "px");
//                    jQuery('#shareCover').css('height', coverHeight - 40 + "px");
                    deskDevice = 568;
                    bodyHeight = deskDevice - 50;
                    bodyHeightScr1 = 482;
                    deskWidth = deskDevice * 0.7;
                    modalWidth = deskWidth * 0.7;
                    coverHeight = modalWidth;
                    jQuery('#shareModal > .modal-dialog > .modal-content').css("height", deskDevice + "px");
                    jQuery('#shareModal > .modal-dialog > .modal-content').css("width", deskWidth + "px");
                    jQuery('#shareModal > .modal-dialog > .modal-content .modal-body').css("max-height", bodyHeight + "px");
                    jQuery('#scr1 .modal-body').css({"max-height": bodyHeight + "px", 'padding-left': '0px', 'padding-right': '0px'});
//                jQuery('#shareModal > .modal-dialog > .modal-content#scr1').css("height", bodyHeightScr1 + "px");
                    jQuery('#shareModal > .modal-dialog > .modal-content#scr1').css("height", 550 + "px");
                    jQuery('#shareModal > .modal-dialog > .modal-content#scr1 .modal-body').css("max-height", bodyHeight + "px");
                    jQuery('#shareModal > .modal-dialog > .modal-content#scr1 .modal-body').css("width", modalWidth + "px");
                    jQuery('#shareDialog').css('width', deskWidth + "px");
                    jQuery('.sc1-content').css('width', modalWidth + "px");
                    jQuery('#shareCover').css('height', coverHeight + "px");
                }

            } else {
//                deskDevice = (jQuery(window).height()) * 0.6;
                if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/Android/i))) {

                    deskDevice = (jQuery(window).height()) * 0.6;
                    bodyHeight = deskDevice - 124;
                    bodyHeightScr1 = deskDevice;
                    deskWidth = deskDevice * 0.7;
                    modalWidth = deskWidth * 0.7;
                    formHeight = deskDevice - 160;
                    coverHeight = modalWidth;
                    jQuery('#shareModal > .modal-dialog > .modal-content').css("height", deskDevice + "px");
                    jQuery('#shareModal > .modal-dialog > .modal-content').css("width", deskWidth + "px");
                    jQuery('#scr1 .modal-body').css({"max-height": bodyHeight + "px", 'padding-left': '0px', 'padding-right': '0px'});
                    jQuery('#shareModal > .modal-dialog > .modal-content#scr1').css("height", 560 + "px");
                    jQuery('#shareModal > .modal-dialog > .modal-content#scr1 .modal-body').css("max-height", bodyHeightScr1 + "px");
                    jQuery('.scrForm').perfectScrollbar();
                    jQuery('.scrForm').height(formHeight + "px");
                    jQuery('#shareDialog').css('width', deskWidth + "px");
                    jQuery('.sc1-content').css('width', modalWidth - 60 + "px");
                    jQuery('#shareCover').css('height', modalWidth - 60 + "px");


                } else {
                    deskDevice = 568;
                    bodyHeight = deskDevice - 50;
                    bodyHeightScr1 = 482;
                    deskWidth = deskDevice * 0.7;
                    modalWidth = deskWidth * 0.7;
                    coverHeight = modalWidth;
                    jQuery('#shareModal > .modal-dialog > .modal-content').css("height", deskDevice + "px");
                    jQuery('#shareModal > .modal-dialog > .modal-content').css("width", deskWidth + "px");
                    jQuery('#shareModal > .modal-dialog > .modal-content .modal-body').css("max-height", bodyHeight + "px");
                    jQuery('#scr1 .modal-body').css({"max-height": bodyHeight + "px", 'padding-left': '0px', 'padding-right': '0px'});
//                jQuery('#shareModal > .modal-dialog > .modal-content#scr1').css("height", bodyHeightScr1 + "px");
                    jQuery('#shareModal > .modal-dialog > .modal-content#scr1').css("height", 550 + "px");
                    jQuery('#shareModal > .modal-dialog > .modal-content#scr1 .modal-body').css("max-height", bodyHeight + "px");
                    jQuery('#shareModal > .modal-dialog > .modal-content#scr1 .modal-body').css("width", modalWidth + "px");
                    jQuery('#shareDialog').css('width', deskWidth + "px");
                    jQuery('.sc1-content').css('width', modalWidth + "px");
                    jQuery('#shareCover').css('height', coverHeight + "px");
                }
            }


        };
        this.showModal = function () {
            jQuery('#okModal').modal('show');
            shareView.messageMiddle('okModal');
            jQuery('#okModal #ok_shared').hide();
            jQuery('#okModal #ok_same').show();
            jQuery('#ok_same').click(function () {
                jQuery('#okModal').modal('hide');
            });
        };
        jQuery('#shareCancel').click(function () {
            jQuery('#alertModal').modal('hide');
        });
        this.getshareScreenDetails = function (fromInfo) {
            if (fromInfo === true) {
                ShareInnerView.title = "Share Privately";
                ShareView.infoView = true;
            }
            ShareInnerView.shareData = ShareView.shareData;
            jQuery('#scrPrivareShare .next-btn').removeClass("facebookTags").removeClass("shareLinks");
            jQuery('body').addClass('page-loaded').removeClass('page-loading');
            jQuery('body > .pageload').fadeOut();
            ShareInnerView.storeShareInfoRequestManage();
            jQuery('body').addClass('page-loaded');
            jQuery('body > .pageload').fadeIn();
        };

        this.getshareFBScreenDetails = function (fromInfo) {
            if (ShareInnerView.title === "Facebook") {
                FB.getLoginStatus(function (response) {
                    console.log('niladri '+response.status);
                    if (response.status !== "connected") {
                        FB.login(function (response) {
                            if (response.authResponse) {
                                ShareInnerView.facebookData = response;
                                var requestDataFB = response.authResponse.accessToken;                                                 
                                var requestData = ShareView.shareData.pb_tracking_id;
                                var promise = ShareService.getOrderData(requestData);
                                promise.then(function (data) {
                                    ShareView.shareInnerData = data.arr_data;
                                    shareView.imageIdsData = [];
                                    jQuery.each(ShareView.shareInnerData.images, function (index, value) {
                                        shareView.imageIdsData.push(value.page_id);
                                    });
                                    if (fromInfo === true) {
                                        shareView.title = "Share Privately";
                                        ShareView.infoView = true;
                                    }
                                    ShareInnerView.shareData = ShareView.shareData;
                                    jQuery('#scrPrivareShare .next-btn').removeClass("facebookTags").removeClass("shareLinks");
                                    ShareInnerView.storeShareInfoRequestManage();
                                    ShareInnerView.facebookGetProfileDetails(requestDataFB, ShareInnerView.facebookData);
                                }).fail(function () {

                                });
                                //                                });
                            } else {
                                jQuery('body').removeClass('page-loaded');
                                jQuery('body > .pageload').fadeOut();
                            }
                        }, {scope: 'user_friends, publish_actions, status_update, read_stream, manage_friendlists,read_custom_friendlists'});
                    } else {
                        var requestDataFB = '';
                        if (response.authResponse !== null) {
                            ShareInnerView.facebookData = response;
                            requestDataFB = response.authResponse.accessToken;
                            var requestData = ShareView.shareData.pb_tracking_id;
                            var promise = ShareService.getOrderData(requestData);
                            promise.then(function (data) {
                                ShareView.shareInnerData = data.arr_data;
                                shareView.imageIdsData = [];
                                jQuery.each(ShareView.shareInnerData.images, function (index, value) {
                                    shareView.imageIdsData.push(value.page_id);
                                });
                                if (fromInfo === true) {
                                    shareView.title = "Share Privately";
                                    ShareView.infoView = true;
                                }
                                ShareInnerView.shareData = ShareView.shareData;
                                jQuery('#scrPrivareShare .next-btn').removeClass("facebookTags").removeClass("shareLinks");
                                ShareInnerView.storeShareInfoRequestManage();
                                ShareInnerView.facebookGetProfileDetails(requestDataFB, ShareInnerView.facebookData);
                            }).fail(function () {

                            });
                        }
                    }
                });
            }


        };

        this.checkFBPermission = function (deferred) {
            shareView.tempData = "";
            FB.api('/me/permissions', function (response) {
                console.log('called checkFBPermission');
                var declined = ["user_friends"];
                console.dir(response);
                if (typeof (response.data) === "undefined") {
                    declined = ["user_friends"]; //if no permissions set
                } else {
                    for (var i = 0; i < response.data.length; i++) {
                        if (response.data[i].permission === 'user_friends' && response.data[i].status === 'granted') {
                            declined = [];
                        }
                    }
                }
                shareView.tempData = declined;
                deferred.resolve();
            });
        };

        this.actionBasedOnFBPermission = function (){
            shareView.tempData = "";
            var deferred = $.Deferred();
            window.fb_loaded = deferred.promise();
            shareView.checkFBPermission(deferred);
            $.when(fb_loaded).then(function () {
                var declinedPermissions = shareView.tempData;
                console.dir(declinedPermissions);
                if (declinedPermissions.length === 0) {
                    console.dir(shareView.facebookData);
                    console.log('if part');
                    ShareInnerView.facebookData = shareView.facebookData;
                    var requestDataFB = shareView.facebookData.authResponse.accessToken;
                    var requestData = ShareView.shareData.pb_tracking_id;
                    var promise = ShareService.getOrderData(requestData);
                    promise.then(function (data) {
                        ShareView.shareInnerData = data.arr_data;
                        shareView.imageIdsData = [];
                        jQuery.each(ShareView.shareInnerData.images, function (index, value) {
                            shareView.imageIdsData.push(value.page_id);
                        });
                        ShareInnerView.shareData = ShareView.shareData;
                        jQuery('#scrPrivareShare .next-btn').removeClass("facebookTags").removeClass("shareLinks");
                        ShareInnerView.storeShareInfoRequestManage();
                        ShareInnerView.facebookGetProfileDetails(requestDataFB, ShareInnerView.facebookData);
                    }).fail(function () {

                    });
                } else {
                    console.log('else part');
                }
            });
        };

        this.getshareFBScreenDetails1 = function (response) {
            shareView.facebookData = response;
            console.dir(shareView.facebookData);
            if (shareView.facebookData.status === 'connected') {
                console.log('am here 1');
                shareView.actionBasedOnFBPermission();

            } else if (shareView.facebookData.status === 'not_authorized') {
                console.log('am here 2');
                // The person is logged into Facebook, but not your app.
                FB.login(function (response) {
                    //console.dir(response);
                    shareView.facebookData = response;
                    if (response && !response.error && response.status === 'connected') {
                        if (response.authResponse !== null) {
                            ShareInnerView.facebookData = response;
                            var requestDataFB = response.authResponse.accessToken;
                            var requestData = ShareView.shareData.pb_tracking_id;
                            var promise = ShareService.getOrderData(requestData);
                            promise.then(function (data) {
                                ShareView.shareInnerData = data.arr_data;
                                shareView.imageIdsData = [];
                                jQuery.each(ShareView.shareInnerData.images, function (index, value) {
                                    shareView.imageIdsData.push(value.page_id);
                                });
                                ShareInnerView.shareData = ShareView.shareData;
                                jQuery('#scrPrivareShare .next-btn').removeClass("facebookTags").removeClass("shareLinks");
                                ShareInnerView.storeShareInfoRequestManage();
                                ShareInnerView.facebookGetProfileDetails(requestDataFB, ShareInnerView.facebookData);
                            }).fail(function () {

                            });
                        }
                    }
                }, {
                    scope: 'user_friends, publish_actions, status_update, read_stream, manage_friendlists,read_custom_friendlists',
                    auth_type: 'rerequest',
                    return_scopes: true
                });

            } else {
                console.log('am here 3');
                //jQuery(".facebookModalCheck #FBAlbums").empty();
                //jQuery(".facebookModalCheck #FBAlbumsPhotos").empty();
                FB.login(function (response) {
                    facebookData = response;
                    //jQuery(".dynamicLoadingMessage").text("Connecting to facebook");
                    if (response && !response.error && response.status === 'connected') {
                        shareView.actionBasedOnFBPermission();
                    }
                }, {
                    scope: 'user_friends, publish_actions, status_update, read_stream, manage_friendlists,read_custom_friendlists',
                });
            }
        };
    });
    return ShareView;
});