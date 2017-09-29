/*global define, jQuery, location, window, setTimeout, currentVersion*/

define(['Augment',
    'Instance',
    'PubSub',
    'GlobalData',
    'utils/LanguageUtils',
    'utils/CookieUtils',
    'services/UserService',
    'views/dashboard/DashboardView',
    'views/messages/MessagesView',
    'views/verification/VerificationView',
    'hbs!views/sidebar/templates/SideBarView'
], function (augment, instance, PubSub, GlobalData, LanguageUtils, CookieUtils, UserService, DashboardView, MessagesView, VerificationView, tplSideBarView) {

    'use strict';
    var SideBarView = augment(instance, function () {
        this.addToDiv = function () {

            var sideBarView = this;
            var divId = "SideBarDiv";
            var imagedata;
            if (DashboardView.userData.user_picture_path === null || DashboardView.userData.user_picture_path === undefined || DashboardView.userData.user_picture_path === '') {
                imagedata = 'assets/images/icon_user_profile_left_menu.png';
            } else {
                imagedata = DashboardView.userData.user_picture_path;
                //imagedata = CookieUtils.getCookie('custProfilePic') + '?v=' + Math.random();
            }


            if (CookieUtils.getCookie('custProfilePic')) {
                imagedata = CookieUtils.getCookie('custProfilePic') + '?v=' + Math.random();
            }
            /*
            if(CookieUtils.getCookie('custProfilePic') !== '' || CookieUtils.getCookie('custProfilePic') != undefined || CookieUtils.getCookie('custProfilePic') !== null) {
                imagedata = CookieUtils.getCookie('custProfilePic') + '?v=' + Math.random();
            }  
            */

            var emailText = '';
            if (CookieUtils.getCookie('custEmail') !== "null" && CookieUtils.getCookie('custEmail') !== "") {
                emailText = CookieUtils.getCookie('custEmail');
            } else {
                emailText = CookieUtils.getCookie('mobile_number');
            }

            var innerHtml = tplSideBarView({
                version: currentVersion,
                email: emailText,
                name: CookieUtils.getCookie('custName'),
                proflieImage: imagedata,
                startNewStory: GlobalData.baseUrlForHTMLUploader,
                StartANewPhotostory: LanguageUtils.valueForKey("StartANewPhotostory"),
                ViewallPhotostories: LanguageUtils.valueForKey("ViewAllPhotostories"),
                ViewMyPhotostories: LanguageUtils.valueForKey("ViewMyPhotostories"),
                ViewSharedPhotostories: LanguageUtils.valueForKey("ViewSharedPhotostories"),
                Settings: LanguageUtils.valueForKey("Settings"),
                Help: LanguageUtils.valueForKey("Help"),
                Logout: LanguageUtils.valueForKey("Logout"),
                searchphotostory: LanguageUtils.valueForKey("searchphotostory"),
                EditProfile: LanguageUtils.valueForKey("EditProfile")
            });
            jQuery('#' + divId).empty();
            jQuery('#' + divId).html(innerHtml);
            SideBarView.preloader();
            jQuery(window).resize(function () {
                sideBarView.messageMiddle();
            });
        };
        this.preloader = function () {
            var sideBarView = this;
            var messagesView = MessagesView.create();
            messagesView.addToDiv();
            messagesView.messageMiddle();
            //            PubSub.publish('PROFILE_DATA');
            PubSub.subscribe('LOGOUT', function () {
                jQuery('body').addClass('page-loaded');
                jQuery('body > .pageload').fadeIn();
                SideBarView.logout();
            });
            PubSub.subscribe('LOGOUT_UPLOAD', function () {
                jQuery('body').addClass('page-loaded');
                jQuery('body > .pageload').fadeIn();
                cancelPhotostory(GlobalData.baseUrlNew, GlobalData.fileUploadData.cancelUploadInputAPIData, CookieUtils.getCookie("sessionKey"), function successCallback() {
                    SideBarView.logout('upload-cancel');
                });
            });
            jQuery("#logoutIcon").click(function () {
                GlobalData.ec.recordClickEvent('Dashboard_view', 'SidebarLogoutClicked');
                GlobalData.GoogleServiceInitialisation();
                if (GlobalData.fileUploadData.onGoingUpload === 1) {
                    var messagesView = MessagesView.create();
                    messagesView.addToDiv();
                    jQuery('#messageModal').modal('show');
                    jQuery('#messageModal .up-btn, #stopUploading').show();
                    jQuery('#messageModal .ot-btn, #download_text, #back_text').hide();
                    messagesView.messageMiddle();
                } else {
                    jQuery('body').addClass('page-loaded');
                    jQuery('body > .pageload').fadeIn();
                    SideBarView.logout();
                }
            });
            jQuery('#allPhotoIcon').click(SideBarView.showAllStories);
            jQuery('.search-input').keypress(function () {
                jQuery(".deleteSearch").show();
            });
            jQuery(".deleteSearch").click(function () {
                jQuery('.search-input').val("");
                jQuery(".deleteSearch").hide();
            });
            this.showVerifyPopup = function () {
                var verificationView = VerificationView.create();
                verificationView.addToDiv();
                jQuery('#verifyModal').modal('show');

            };
            jQuery('#plusIcon').click(function () {
                GlobalData.ec.recordClickEvent('Dashboard_view', 'SidebarCreateStoryClicked');
                var mobile = 0;
                if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/Android/i))) {
                    mobile = 1;
                }
                var verfication = CookieUtils.getCookie('is_verified');
                if ((mobile === 0) && (parseInt(verfication) === 0)) {
                    jQuery('#plusIcon').removeAttr("href");
                    SideBarView.showVerifyPopup();
                }
                if (mobile) {
                    jQuery('#plusIcon').removeAttr("href");
                    setTimeout(function () {
                        jQuery('#messageModal.mobileFeature').modal('show');
                    }, 1000);
                } else if (GlobalData.fileUploadData.onGoingUpload === 1) {
                    var messagesView = MessagesView.create();
                    messagesView.addToDiv();
                    messagesView.messageMiddle();
                    jQuery('.ongoing-uploader-message').modal('show');
                } else if (!parseInt(CookieUtils.getCookie('is_verified'))) {
                    //                    DashboardView.showVerifyPopup();
                } else {
                    CookieUtils.delete_cookie(('multidevice'));
                    delete GlobalData.multiDevice;
                    GlobalData.fileUploadData = {};
                    location.hash = '/uploader';
                }
                //                var verfication = CookieUtils.getCookie('is_verified');
                //                verfication = parseInt(verfication);
                //                if ((jQuery(window).width() > 1025) && (verfication === 0)) {
                //                    jQuery('#plusIcon').removeAttr("href");
                //                    SideBarView.showVerifyPopup();
                //                }
                //                if (jQuery(window).width() < 1025) {
                //                    jQuery('#plusIcon').removeAttr("href");
                //                    setTimeout(function() {
                //                        var messagesView = MessagesView.create();
                //                        messagesView.addToDiv();
                //                        jQuery('#messageModal').modal('show');
                //                        sideBarView.messageMiddle();
                //                    }, 800);
                //
                //                }

            });
            jQuery('#allPhotoIcon').click(function () {
                jQuery('body').addClass('page-loaded');
                jQuery('body > .pageload').fadeIn();
                GlobalData.ec.recordClickEvent('Dashboard_view', 'AllPhotoStoriesButtonClicked');
                DashboardView.showAllPhotoStory();
                setTimeout(function () {
                    DashboardView.showAllPhotoStory();
                    jQuery('body').addClass('page-loaded').removeClass('page-loading');
                    jQuery('body > .pageload').fadeOut();
                }, 1000);

            });
            jQuery('#myPhotoIcon').click(function () {
                jQuery('body').addClass('page-loaded');
                jQuery('body > .pageload').fadeIn();
                GlobalData.ec.recordClickEvent('Dashboard_view', 'MyPhotoStoriesButtonClicked');
                setTimeout(function () {
                    DashboardView.showOwnPhotoStory();
                    jQuery('body').addClass('page-loaded').removeClass('page-loading');
                    jQuery('body > .pageload').fadeOut();
                }, 1000);


            });
            jQuery('#sharedPhotoIcon').click(function () {
                jQuery('body').addClass('page-loaded');
                jQuery('body > .pageload').fadeIn();
                GlobalData.ec.recordClickEvent('Dashboard_view', 'SharedStoriesButtonClicked');
                setTimeout(function () {
                    DashboardView.showSharedPhotoStory();
                    jQuery('body').addClass('page-loaded').removeClass('page-loading');
                    jQuery('body > .pageload').fadeOut();
                }, 1000);

            });
            jQuery("#editProfile, #profileIcon>img").click(function () {

                GlobalData.ec.recordClickEvent('Dashboard_view', 'SidebarEditProfileButtonClicked');
                if (GlobalData.mobileDevice) {
                    setTimeout(function () {
                        jQuery(".mainContainer").removeClass("offscreen move-left move-right");
                        jQuery(".app").removeClass('offscreen');

                        jQuery('#messageModal.mobileFeature').modal('show');
                    }, 800);
                } else {
                    jQuery('body').addClass('page-loaded');
                    jQuery('body > .pageload').fadeIn();
                    /*jQuery('body').addClass('page-loaded');
                    jQuery('body > .pageload').fadeIn();*/
                    location.hash = "#/profile";
                    jQuery(window).scrollTop(0);
                    jQuery(".mainContainer").removeClass("offscreen move-left move-right");
                    jQuery(".hamburger-icon").trigger("click");

                }
            });
            jQuery("#helpIcon").click(function () {
                GlobalData.ec.recordClickEvent('Dashboard_view', 'SidebarEditHelpButtonClicked');
                location.hash = "#/help";
                jQuery(window).scrollTop(0);
                jQuery(".mainContainer").removeClass("offscreen move-left move-right");
                jQuery(".hamburger-icon").trigger("click");
            });


            jQuery('body').click(function (e) {

                if (jQuery(e.target).closest('#notificationBell ').length === 0) {
                    jQuery("#notificationBell .notifiaction-container, #notificationBell #up_point").hide();
                }

            });
            jQuery('.navItems').click(function () {
                setTimeout(function () {
                    jQuery(".mainContainer").removeClass("offscreen move-left move-right");
                    jQuery(".app").removeClass('offscreen');
                }, 500);
                jQuery(".hamburger-icon").trigger("click");
            });
            //            jQuery('.search-form').click(function (e) {
            //                e.stopPropagation();
            //                jQuery(".mainContainer").removeClass("offscreen");
            //                 GlobalData.ec.recordClickEvent('Dashboard_view', 'SearchedPhotostoriesClicked');
            //
            //            });
            jQuery('.leftSearch').keypress(function (e) {

                var key = e.which;
                if (key === 13) // the enter key code
                {
                    jQuery('body').addClass('page-loaded');
                    jQuery('body > .pageload').fadeIn();
                    setTimeout(function () {
                        jQuery(".mainContainer").removeClass("offscreen  move-left");
                        DashboardView.showFilteredData(jQuery(".leftSearch > input").val());
                        jQuery('#searchMessage').show();
                        GlobalData.ec.recordClickEvent('Dashboard_view', 'SearchedPhotostoriesClicked');
                        jQuery(".hamburger-icon").trigger("click");
                        jQuery('body').addClass('page-loaded').removeClass('page-loading');
                        jQuery('body > .pageload').fadeOut();
                    }, 2000);



                }
            });
            jQuery(".sidebar-panel .hamburger-icon").click(function () {
                jQuery('.leftSearch input').val("");
                // sideBarView.toggleMenu();
                jQuery('.app').removeClass('move-left move-right');
                jQuery('.app').removeClass('offscreen');
                GlobalData.isOffscreenOpen = false;

            });
            this.messageMiddle = function () {
                var msgContent = ((jQuery(window).height()) - (181)) / 2;
                jQuery('#messageModal .modal-dialog').css('margin-top', msgContent + 'px');
            };
            this.downloadApp = function () {

            };
        };


        this.toggleMenu = function () {
            if (this.isOffscreenOpen) {
                jQuery('.app').removeClass('move-left move-right');
                setTimeout(function () {
                    jQuery('.app').removeClass('offscreen');
                }, 150);
            } else {
                jQuery('.app').addClass('offscreen ' + this.offscreenDirectionClass);
            }
            this.isOffscreenOpen = !this.isOffscreenOpen;
            this.rapidClickFix();
        };

        this.rapidClickFix = function () {
            var navBarView = this;
            setTimeout(function () {
                navBarView.rapidClickCheck = false;
            }, 150);
        };

        this.logout = function (uploadCancel) {
            jQuery('body').addClass('page-loaded');
            jQuery('body > .pageload').fadeIn();
            var requestData = CookieUtils.getCookie("sessionKey");
            var promise = UserService.logoutUser(requestData);
            promise.then(function () {
                CookieUtils.delete_cookie('authToken');
                CookieUtils.delete_cookie('custId');
                CookieUtils.delete_cookie('custName');
                CookieUtils.delete_cookie('custProfilePic');
                CookieUtils.delete_cookie('custEmail');
                CookieUtils.delete_cookie('is_verified');
                CookieUtils.delete_cookie('verify');
                CookieUtils.delete_cookie('sessionKey');
                CookieUtils.delete_cookie("isRememberMe");
                CookieUtils.deleteAllCookies();
                window.onbeforeunload = null;
                window.onunload = null;
                var interval_id = window.setInterval("", 9999);
                for (var i = 1; i < interval_id; i++) {
                    window.clearInterval(i);
                }
                document.location.reload();
            }).fail(function () {});

        };

    });



    return SideBarView;
});