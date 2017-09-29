/*global define, jQuery, console, alert, document, navigator, window, FB*/
define(['Augment',
    'Instance',
    'GlobalData',
    'utils/CookieUtils',
    'utils/LanguageUtils',
    'services/ShareService',
    'hbs!views/shareinner/templates/ShareInnerView',
    'hbs!views/share/templates/EmailShareView'
], function (augment, instance, GlobalData, CookieUtils, LanguageUtils, ShareService, tplShareInnerView, tplEmailShareView) {

    'use strict';
    var ShareInnerView = augment(instance, function () {
        var shareInnerView = this;
        this.init = function () {
            var shareInner = this;
            jQuery(window).resize(function () {
                shareInner.windowResize();
                shareInner.modalHeight();

            });
            jQuery('#s2id_tagPicker').perfectScrollbar();
        };
        this.requestData = {};
        this.addToDiv = function () {

            var divId = "scrPrivareShare";
            for (var i = 0; i < shareInnerView.shareInnerData.images.length; i++) {
                shareInnerView.shareInnerData.images[i].name = shareInnerView.shareInnerData.s3URL + shareInnerView.shareInnerData.images[i].name.replace("/spreads/", "/thumbs/");
                shareInnerView.shareInnerData.images[i].shareAllImagesLength = shareInnerView.shareInnerData.images.length + "";
            }
            var innerHtml = tplShareInnerView({
                shareAllImages: shareInnerView.shareInnerData.images,
                shareTitle: shareInnerView.title,
                selectDeslectInstructions: LanguageUtils.valueForKey("selectDeslectInstructions"),
                next: LanguageUtils.valueForKey("next")
            });
            jQuery('#' + divId).empty();
            jQuery('#' + divId).html(innerHtml);
            this.changeScreen();
        };
        this.showMessage = function () {
            jQuery('#okModal').modal('show');
            shareInnerView.messageMiddle('okModal');
            if (((jQuery(window).width()) < 768) && (jQuery(window).height()) < (jQuery(window).width())) {
                jQuery('#okModal .modal-content').css('margin-top', "15%");
            }
            jQuery('#okModal .share-text').text("Cover spreads can't be deslected");
            jQuery('#okModal #ok_shared').hide();
            jQuery('#okModal #ok_same').show();
            jQuery('#okModal #ok_same').click(function () {
                jQuery('#okModal').modal('hide');
            });
        };
        this.changeScreen = function () {

            ShareInnerView.modalHeight();
            jQuery('#shareModal #shareDialog .modal-body').perfectScrollbar();
            jQuery('#scrPrivareShare').show();
            jQuery(".share-checkBox").click(function () {
                if (jQuery(this).parent().hasClass("active")) {
                    jQuery(this).parent().removeClass("active");
                    jQuery(this).parent().siblings(".overlayBtn").removeClass("overlay");
                    jQuery(".back-cover .overlayBtn").show();
                }
                else {
                    jQuery(this).parent().addClass("active");
                    jQuery(this).parent().siblings(".overlayBtn").addClass("overlay");
                }
            });
            jQuery(".share-checkBox.coverCheck").click(function () {
                jQuery(this).parent().addClass("active");
                jQuery(".share-checkBox.coverCheck").prop('checked', true);
                ShareInnerView.showMessage();
            });

            jQuery(".overlayBtn").click(function () {
                if (jQuery(this).siblings(".share-checkImg").hasClass("active")) {
                    jQuery(this).siblings(".share-checkImg").removeClass("active");
                    jQuery(this).siblings(".share-checkImg").children().prop('checked', false);
                    jQuery(this).removeClass("overlay");
                } else {
                    jQuery(this).siblings(".share-checkImg").addClass("active");
                    jQuery(this).siblings(".share-checkImg").children().prop('checked', true);
                    jQuery(this).addClass("overlay");
                }
            });
            jQuery(".back-cover .overlayBtn").click(function () {
                ShareInnerView.showMessage();
                jQuery(this).siblings(".share-checkImg").addClass("active");
                jQuery(this).siblings(".share-checkImg").children().prop('checked', true);
                jQuery(this).addClass("overlay");
            });
            jQuery('#privateShareNext').click(function () {
                shareInnerView.storeShareInfoRequestManage();
                jQuery('body').addClass('page-loaded');
                jQuery('body > .pageload').fadeIn();
            });
            jQuery('.fb-share').click(function () {
                FB.ui({
                    method: 'share',
                    href: 'https://developers.facebook.com/docs/',
                }, function () {

                });
            });
            jQuery('#PrivareShareBack').click(function () {
                jQuery('#alertModal').modal('show');
                shareInnerView.messageMiddle('alertModal');
                if (((jQuery(window).width()) < 768) && (jQuery(window).height()) < (jQuery(window).width())) {
                    jQuery('#alertModal .modal-content').css('margin-top', "15%");
                }

            });

            jQuery('#shareCancel').click(function () {
                jQuery('#alertModal').modal('hide');
            });

            jQuery('#shareCancel').click(function () {
                jQuery('#alertModal').modal('hide');
            });

            jQuery('#ok_shareBack').click(function () {
                if (shareInnerView.infoView === true) {
                    jQuery('#alertModal').modal('hide');
                    jQuery('#shareModal').modal('hide');
                    jQuery('#shaereInfo').hide();
                    jQuery("#InfoModal").modal('show');

                } else {
                    jQuery('#alertModal').modal('hide');
                    jQuery('#scrPrivareShare').hide();
                    jQuery('#scr1').show();
                    ShareInnerView.modalHeight();
                }

            });
            ShareInnerView.imageContainer();
        };
        this.modalHeight = function () {
            var deskDevice, bodyHeight, deskWidth, modalWidth, coverHeight, bodyHeightScr1;
            if ((window.innerHeight < 767) && (jQuery(window).width() < 767)) {
                var smallDevice = (window.innerHeight - 130);
                var smallDeviceWidth = jQuery(window).width();
                var contentWidth = smallDeviceWidth * 0.70;
                coverHeight = contentWidth - 40;
                if ((jQuery(window).height() < jQuery(window).width())) {
                    contentWidth = smallDeviceWidth * 0.40;
                    coverHeight = contentWidth - 40;
                    jQuery('.sc1-content').css('width', contentWidth + "px");
                    jQuery('#shareCover').css('min-height', coverHeight + "px");
                }
                //                var smallDeviceFirstScreen = (window.innerHeight - 55);
                jQuery('#shareModal > .modal-dialog > .modal-content').height(window.innerHeight);
                jQuery('#shareModal > .modal-dialog > .modal-content .modal-body').css("max-height", smallDevice + 'px');
                jQuery('#shareModal > .modal-dialog > .modal-content#scr1 .modal-body').css("max-height", '100%');
                jQuery('.sc1-content').css('width', contentWidth + "px");
                jQuery('#shareCover').css('min-height', coverHeight + "px");
            }

            else if ((jQuery(window).width() > 767) && (jQuery(window).height() < 950)) {
                deskDevice = 568;
                bodyHeight = deskDevice - 124;
                bodyHeightScr1 = deskDevice;
                deskWidth = deskDevice * 0.7;
                modalWidth = deskWidth * 0.65;
                coverHeight = modalWidth - 40;
                jQuery('#shareModal > .modal-dialog > .modal-content').css("height", deskDevice + "px");
                jQuery('#shareModal > .modal-dialog > .modal-content').css("width", deskWidth + "px");
                jQuery('#shareModal > .modal-dialog > .modal-content .modal-body').css("max-height", bodyHeight + "px");
                jQuery('#shareModal > .modal-dialog > .modal-content#scr1 .modal-body').css("max-height", bodyHeightScr1 + "px");
                jQuery('#shareDialog').css('width', deskWidth + "px");
                jQuery('.sc1-content').css('width', modalWidth + "px");
                jQuery('#shareCover').css('height', coverHeight + "px");
            }
            else {
                deskDevice = (jQuery(window).height()) * 0.6;
                bodyHeight = deskDevice - 124;
                bodyHeightScr1 = deskDevice;
                deskWidth = deskDevice * 0.7;
                modalWidth = deskWidth * 0.65;
                coverHeight = modalWidth - 40;
                jQuery('#shareModal > .modal-dialog > .modal-content').css("height", deskDevice + "px");
                jQuery('#shareModal > .modal-dialog > .modal-content').css("width", deskWidth + "px");
                jQuery('#shareModal > .modal-dialog > .modal-content .modal-body').css("max-height", bodyHeight + "px");
                jQuery('#shareModal > .modal-dialog > .modal-content#scr1 .modal-body').css("max-height", bodyHeightScr1 + "px");
                jQuery('#shareDialog').css('width', deskWidth + "px");
                jQuery('.sc1-content').css('width', modalWidth + "px");
                jQuery('#shareCover').css('height', coverHeight + "px");
            }
        };
        this.storeShareInfoRequestManage = function () {
            var mode;
            if (shareInnerView.title === "Copy Link") {
                mode = "CP";
            }
            if (shareInnerView.title === "Email Share") {
                mode = "EM";
            }
            if (shareInnerView.title === "Share Privately") {
                mode = "EM";
            }
            if (shareInnerView.title === "Facebook") {
                mode = "FB";
            }

            shareInnerView.requestData.customer_id = CookieUtils.getCookie("custId");
            shareInnerView.requestData.imagecaption = shareInnerView.shareData.cover_caption;
            shareInnerView.requestData.tracking_id = shareInnerView.shareData.pb_tracking_id;

            shareInnerView.requestData.share_type = "S";
            shareInnerView.requestData.share_mode = mode;
            var promise = ShareService.storeShareInfo(shareInnerView.requestData);
            promise.then(function (data) {
                jQuery('body').removeClass("mobModal");
                jQuery('body').addClass('page-loaded').removeClass('page-loading');
                jQuery('body > .pageload').fadeOut();
                if (data.int_status_code === 1) {
                    shareInnerView.storeShareInfoResponseData = data.arr_data;
                    if (shareInnerView.title === "Share Privately") {
                        var sharer = CookieUtils.getCookie("custName");
                        var storyName = ShareInnerView.storeShareInfoResponseData.imagecaption;

                        if (navigator.userAgent.match(/Android/i)) {
                            document.location = "sms:?body=Check out " + sharer + "'s story " + storyName + " on Photogurus at " + ShareInnerView.storeShareInfoResponseData.previewurl;
                        } else {
                            document.location = "sms:/open?addresses=&body=Check out " + sharer + "'s story " + storyName + " on Photogurus at " + ShareInnerView.storeShareInfoResponseData.previewurl;
                        }

//                        jQuery('#scr1').hide();
//                        jQuery('#scrPrivareShare').hide();
//                        jQuery('#shareModal').modal('show');
//                        jQuery('#scrPrivareShareSend').show();
                    }
                    if (shareInnerView.title === "Copy Link") {
                        var mobile = 0;
                        if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i))) {
                            mobile = 1;
                        }
                        if (mobile) {
                            console.log('mambo');
                            jQuery('#okModal #ok_shared').show().text('Cancel');
                            jQuery('#okModal #ok_same').hide();
                            jQuery('#okModal').modal('show');
                            shareInnerView.messageMiddle('okModal');
                            jQuery('.share-text').show().text("Please press and hold the link to copy it");
                            jQuery('#safariLink,#safariCopyLinkContainer').show();
                            jQuery('#okModal .modal-body > div').css("margin-bottom", "15px");
                            jQuery('#scrPrivareShareSend').hide();
                            jQuery('#scrPrivareShare').show();
                            jQuery('#safariLink').attr('href', data.arr_data.previewurl);
                            jQuery('#safariLink').text(data.arr_data.previewurl);
                            jQuery('#scrPrivareShare').hide();
                            jQuery('#scrPrivareShareSend').hide();
                            jQuery("#safariLink").click(function () {console.log('captured');
                                var pixel_params = null;
                                pixel_params = {'Share_type' : 'Copy link'};
                                //Fb Pixel
                                GlobalData.ec.recordFBPixelEvent('trackCustom', 'StoryShare', pixel_params);
                                jQuery('.modal').modal('hide');
                                return false;
                            });
                        } else {
                            jQuery('#scrPrivareShare').hide();
                            jQuery('#okModal').modal('show');
                            shareInnerView.messageMiddle('okModal');
                            if (((jQuery(window).width()) < 768) && (jQuery(window).height()) < (jQuery(window).width())) {
                                jQuery('#okModal .modal-content').css('margin-top', "15%");
                            }
                            jQuery('#okModal .share-text').hide();
                            //                        jQuery('.share-text').show().text("use ctrl");
                            jQuery('#okModal .copy-link').show();
                            jQuery('#okModal .copy-link button').hide();
                            jQuery('#okModal .copy-link input').val(data.arr_data.previewurl);

                            if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
                                jQuery('.share-text').show().text("Please select link and use ctrl+c to copy the link");
                                jQuery('#okModal .modal-body > div').css("margin-bottom", "15px");
                                jQuery('#scrPrivareShareSend').hide();
                                jQuery('#scrPrivareShare').show();
                                var copyTextarea = document.querySelector('.copy-link input');
                                copyTextarea.select();
                            }

                            jQuery('#okModal #ok_shared').hide();
                            jQuery('#okModal #ok_same').show().text('Copy');
                            jQuery('#okModal #ok_same').click(function () {
                                var copyTextarea = document.querySelector('.copy-link input');
                                copyTextarea.select();
                                try {
                                    var successful = document.execCommand('copy');
                                    var msg = successful ? 'successful' : 'unsuccessful';
                                    if (msg === 'unsuccessful') {
                                        if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
//                                        jQuery('.modal').modal('hide');
                                        }
                                    } else {
                                        jQuery('#okModal').modal('hide');
                                        jQuery('#errorMessageModal').modal('show');
                                        shareInnerView.messageMiddle('errorMessageModal');
                                        jQuery('#errorMessageModal .modal-header').hide();
                                        jQuery('#errorMessageModal .share-text').text("Link copied!");
                                        jQuery('#errorMessageModal #errorMessageModalOKBtn').click(function () {
                                            var pixel_params = null;
                                            pixel_params = {'Share_type' : 'Copy link'};
                                            //Fb Pixel
                                            GlobalData.ec.recordFBPixelEvent('trackCustom', 'StoryShare', pixel_params);
                                            jQuery('.modal').modal('hide');
                                        });
                                    }
                                } catch (err) {
                                }
                            });
                            jQuery('#scrPrivareShare').hide();
                            jQuery('#scrPrivareShareSend').hide();
                        }
                    }

                    if (shareInnerView.title === "Email Share") {
                        var mobile = 0;
                        /*if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/Android/i))) {
                            mobile = 1;
                        }*///commenting this mobile detection snippet, as it should work same like web as asked by Priya
                        if (mobile) {
                            ShareInnerView.emailTemplateCretion();
                            //                            var storyURL = jQuery('#MessageId').attr("data-url");
                            var storyName = ShareInnerView.storeShareInfoResponseData.imagecaption;
                            var email = jQuery('#EmailAndMobileId').val();
                            var subject = jQuery('#SubjectId').val();
                            //                    var emailBody = "%3Chtml%20xmlns%3D%22http:%2F%2Fwww.w3.org%2F1999%2Fxhtml%22%3E%3C%2Fhead%3E%3Cbody%3EPlease%20%3Ca%20href%3D%22http:%2F%2Fwww.w3.org%22%3Eclick%3C%2Fa%3E%20me%3C%2Fbody%3E%3C%2Fhtml%3E";
                            var emailBodyIOS = jQuery('#mailBody').html();
                            //                    var emailBodyAndroidLink = $(".andr").html();
                            var part = encodeURI('<a href="'+ShareInnerView.storeShareInfoResponseData.previewurl+'" target="_blank">View my photo story now.</a>');
                            var emailBodyAndroid = "Hi, %0D%0A%0D%0AHave a look at my story " + storyName + ", made for me by Photogurus.%0D%0A%0D%0AView my photo story now.%0D%0A%0D%0AYou can also paste this link " + ShareInnerView.storeShareInfoResponseData.previewurl + ".%0D%0A%0D%0AThank You%0D%0A" + shareInnerView.shareData.story_owner_name + "";
                            //var emailBodyAndroid = "Hi, %0D%0A%0D%0AHave a look at my story " + storyName + ", made for me by Photogurus.%0D%0A%0D%0AYou can also paste this link " + ShareInnerView.storeShareInfoResponseData.previewurl + "%0D%0A%0D%0A Thank You";

                            //                    var attach = 'path';
                            //if (navigator.userAgent.match(/Android/i)) {
                            if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i))) {
                                document.location = "mailto:" + email + "?subject=" + subject + "&body=" + emailBodyIOS;
                            } else {
                                console.dir(shareInnerView.shareData);
                                document.location = "mailto:" + email + "?subject=" + subject + "&body=" + emailBodyAndroid + "&attachment=" + shareInnerView.shareData.coverurl;
                            }
                        } else {
                            jQuery('#scr1').hide();
                            jQuery('#scrPrivareShare').hide();
                            jQuery('#scrEmailShareSend').show();
                        }

                    }
                } else {
                    alert("fail" + data.str_status_message);
                }
            }).fail(function () {

            });
        };
        this.emailTemplateCretion = function () {
            var divId = "shareScreenModal";
            var senderEmail = CookieUtils.getCookie("custEmail");
            if (CookieUtils.getCookie("custEmail") === 'null') {
                senderEmail = CookieUtils.getCookie("custName");
            }
            var innerHtml = tplEmailShareView({
                coverURL: ShareInnerView.shareData.coverurl,
                senderemail: senderEmail,
                story_caption: ShareInnerView.shareData.cover_caption,
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
                downloadURL: GlobalData.appDownloadLink
            });
            jQuery('#mailBody').empty();
            jQuery('#mailBody').html(innerHtml);
        };

        this.facebookGetProfileDetails = function (requestData, facebookData) {
            var promise = ShareService.getfacebookprivacyDetails(requestData);
            promise.then(function (data) {
                if (data.int_status_code === 1) {
                    shareInnerView.facebookPrivacyDetails = data.arr_data;
                    for (var i = 0; i < shareInnerView.facebookPrivacyDetails.length; i++) {
                        if (shareInnerView.facebookPrivacyDetails[0] === "FRIENDS") {
                            jQuery("#tags, #ShareFriendsDiv, #ShareFriendslabel, .fb-hr").show();
                        }
                        if (shareInnerView.facebookPrivacyDetails[0] === "SELF") {
                            jQuery("#tags, #ShareFriendsDiv, #ShareFriendslabel, .fb-hr").hide();
                            jQuery("#ShareSelf").parent().addClass('active');
                            jQuery("#ShareSelf").attr("checked", "checked");
                        }
                    }
                    jQuery('#scr1').hide();
                    jQuery('#scrPrivareShare').hide();
                    jQuery('#scrPrivareShare').hide();
                    jQuery('#scrFacebookShareSend').show();
                    FB.api(
                            "/" + facebookData.authResponse.userID + "/friendlists",
                            function (response) {
                                if (response && !response.error) {
                                }
                            }
                    );
                    FB.api(
                            "/" + facebookData.authResponse.userID + "/taggable_friends",
                            function (response) {
                                var friendsData = response.data;
                                function sortResults (prop, asc) {
                                    friendsData = friendsData.sort(function (a, b) {
                                        if (asc) {
                                            return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
                                        } else {
                                            return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
                                        }
                                    });
                                }
                                sortResults('name', true);
                                for (var i = 0; i < friendsData.length; i++) {
                                    var friendList = '<option value=' + friendsData[i].id + '>' + friendsData[i].name + '</option>';
                                    jQuery('#tagPicker').append(friendList);
                                }
                                shareInnerView.shareListloaded = 1;
                                if (response && !response.error) {
                                }
                            }
                    );
                }
            }).fail(function () {

            });
        };

        this.windowResize = function () {
            jQuery(".col-xs-6.shareImg").height(((jQuery(".col-xs-6.shareImg").width()) / 2) + 10).css("background", "#dedede");
            jQuery(".back-cover").height((jQuery(".back-cover").width()) + 10).css("background", "#dedede");
        };
        this.imageContainer = function () {
            jQuery(".col-xs-6.shareImg").height(((jQuery(".col-xs-6.shareImg").width()) / 2) + 10).css("background", "#dedede");
            jQuery(".back-cover").height((jQuery(".back-cover").width()) + 10).css("background", "#dedede");
        };
        this.messageMiddle = function (modalName) {
            var msgContent = ((jQuery(window).height()) - (181)) / 2;
            jQuery('#' + modalName + ' .modal-dialog').css('margin-top', msgContent + 'px');
        };
    });
    return ShareInnerView;
});