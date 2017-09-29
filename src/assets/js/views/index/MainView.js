/*global define, jQuery, location*/
define(['Augment',
    'Instance',
    'PubSub',
    'GlobalData',
    'utils/CookieUtils',
    'services/DashboardService',
    'services/ContributionService',
    'services/UserService',
    'views/navbar/NavBarView',
    'views/sidebar/SideBarView',
    'views/dashboard/DashboardView',
    'views/verification/VerificationView',
    'hbs!views/index/templates/MainView'
], function (augment, instance, PubSub, GlobalData, CookieUtils, DashboardService, ContributionService, UserService, NavBarView, SideBarView, DashboardView, VerificationView) {

    'use strict';

    var MainView = augment(instance, function () {
        var mainView = this;

        this.addToDiv = function () {
            jQuery('.mainContainer').show();
            jQuery('#dashbaordUIView').show();
            jQuery('#uploaderContainer').hide();
            // jQuery('#appSignInDiv').empty();
            jQuery('body').addClass('page-loaded');
            jQuery('body > .pageload').fadeIn();
            this.preloader();
        };
        this.preloader = function () {
            CookieUtils.delete_cookie("shareLoadLoginCookie");
            if (CookieUtils.getCookie("authToken") !== "" && CookieUtils.getCookie("custId") !== "") {
                if (CookieUtils.getCookie("event_type") === "story_image_contribution_copy_link") {
                    MainView.contributorStoryConnect();
                } else if (CookieUtils.getCookie('publicShare')) {
                    jQuery('#appSignInDiv').empty();
                    MainView.publicStoryConnect();
                } else {
                    GlobalData.historyLastURL = '';
                    jQuery('#appSignInDiv').empty();
                    mainView.initialiseDashboard();
                }
            } else {
                location.hash = "/login";
            }
            jQuery('#confirm_download').click(function (event) {
                event.stopPropagation();
                if ((navigator.userAgent.match(/Android/i))) {
                    window.location.href = "https://play.google.com/store/apps/details?id=com.photogurus";
                } else if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i))) {
                    window.location.href = "https://itunes.apple.com/us/app/photogurus/id799452318?ls=1&mt=8";
                } else {
                    window.location.href = 'https://www.photogurus.com/?page=send_link';
                }

            });
            jQuery('#cancel_btn').click(function () {
                jQuery('#messageModal').modal('hide');
                jQuery('.modal-backdrop').hide();
                jQuery('#appSignInDiv').remove();
                jQuery('#messageModal').remove();
                $('.modal-open').removeClass('modal-open');
                jQuery('body > .pageload').fadeIn();
                mainView.initialiseDashboard();
            });

        };

        this.deleteCookiesReleatedToSharedLinkOfContributor = function () {
            CookieUtils.delete_cookie("event_type");
            CookieUtils.delete_cookie("image_contribution_token");
            CookieUtils.delete_cookie("should_show_personalized_page");
            CookieUtils.delete_cookie("story_cover_caption");
            CookieUtils.delete_cookie("story_owner_id");
            CookieUtils.delete_cookie("story_owner_name");
            CookieUtils.delete_cookie("story_owner_pic_url");
        };

        this.contributorStoryConnect = function () {
            var requestData = {
                image_contribution_token: CookieUtils.getCookie("image_contribution_token"),
                invitee_customer_id: CookieUtils.getCookie("custId")
            };
            mainView.deleteCookiesReleatedToSharedLinkOfContributor();
            GlobalData.storyIdByLink = CookieUtils.getCookie("story_id");
            CookieUtils.setCookie("is_verified", 1, GlobalData.expireDays);
            var promise = ContributionService.connectContributionStory(requestData);
            promise.then(function (data) {
                if (data.int_status_code === 1) {
                    if (data.arr_data.order_status === '50') {
                        if (GlobalData.storyIdByLink) {
                            mainView.checkContributorDashModule();
                        }
                    }
                } else {
                    mainView.initialiseDashboard();
                    setTimeout(function () {
                        PubSub.publish("CONTRIBUTOR_FAIL_MESSAGES", data.str_status_message);
                    }, 5000);

                }

            }).fail(function () {
                alert("dashboard data api is failed");
            });
        };

        this.checkContributorDashModule = function () {
            var requestData = {
                order_id: GlobalData.storyIdByLink,
                customer_id: CookieUtils.getCookie("custId")
            };
            var promise = ContributionService.getContributLinkDashModule(requestData);
            promise.then(function (data) {
                if (data.int_status_code === 0) {
                    alert("Get order status is failed"); //
                } else {
                    console.log(data.arr_data);
                    DashboardView.multiDeviceData = data.arr_data;
                    mainView.setContributorLinkDataToLinkForRedirectionToUploader();
                    mainView.checkOrderStatus();
                }
            }).fail(function () {
                alert("dashboard data api is failed");
            });
        };

        this.setContributorLinkDataToLinkForRedirectionToUploader = function () {
            CookieUtils.delete_cookie("story_id");
            GlobalData.fileUploadData = {};
            GlobalData.multiDevice = {};
            GlobalData.multiDevice.addMorePhotos = 1;
            GlobalData.multiDevice.orderId = DashboardView.multiDeviceData.id;
            GlobalData.multiDevice.DesignRequestType = 1;
            GlobalData.multiDevice.title = DashboardView.multiDeviceData.cover_caption;
            GlobalData.multiDevice.previousCount = DashboardView.multiDeviceData.total_transferred_count;
            GlobalData.multiDevice.design_request_type_name = DashboardView.multiDeviceData.design_request_type_name;
            GlobalData.multiDevice.belongsTo = DashboardView.multiDeviceData.story_belongsto;
            GlobalData.multiDevice.byLink = 1;
            var multiDevice = JSON.stringify(GlobalData.multiDevice);
            CookieUtils.setCookie("multidevice", multiDevice, GlobalData.expireDays);
        };
        this.checkOrderStatus = function () {
            if (DashboardView.multiDeviceData.order_status === "50" && parseInt(GlobalData.multiDevice.previousCount) < 2000) {
                if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/Android/i) || jQuery(window).width() < 1010)) {
                    // alert("This functinality is only available on our app. Please download the app.");
                    jQuery('body > .pageload').fadeOut();
                    jQuery('#messageModal').modal('show');
                    mainView.messageMiddle();
                } else {
                    location.hash = '/uploader';
                }
            } else {
                DashboardView.updateDashboardData();
                GlobalData.multiDevice = {};
                CookieUtils.delete_cookie('multidevice');
                location.hash = '/dashboard';
                mainView.initialiseDashboard();
            }
        };
        this.messageMiddle = function () {
            var msgContent = ((jQuery(window).height()) - (181)) / 2;
            jQuery('#messageModal .modal-dialog').css('margin-top', msgContent + 'px');
        };

        this.initialiseDashboard = function () {
             jQuery('#MainViewDiv').show();
            jQuery('#printlayout').css('display','none');
            var requestData = CookieUtils.getCookie("custId");
            if (DashboardView.dashboardData !== undefined) {
                DashboardView.userData = GlobalData.userData;
                VerificationView.userData = GlobalData.userData;
                DashboardView.create();
                var navBar = NavBarView.create();
                navBar.addToDiv();
                jQuery('.navbar-nav').show();
                $('.loginHeader,.home-icon').hide();
                //                            VerificationView.create();
                var sideBar = SideBarView.create();
                sideBar.addToDiv();
                jQuery('.app').css("background", "#fff");
                jQuery('body').addClass('page-loaded').removeClass('page-loading');
                jQuery('body > .pageload').fadeOut();
                console.log('---',CookieUtils.getCookie("is_verified"));
                if (parseInt(CookieUtils.getCookie("is_verified")) === 1) {
                    jQuery('#verfiyAccount').hide();
                } else {
                    jQuery('#verfiyAccount').show();
                }
            } else {
                var promise = DashboardService.dashboardData(requestData);
                promise.then(function (data) {
                    DashboardView.dashboardData = data.arr_data;
                    GlobalData.dashboardData = data.arr_data;
                    var navBar = NavBarView.create();
                    navBar.addToDiv();
                    jQuery('#NavBarDiv').show();
                    jQuery('.navbar-nav').show();
                    if (data.int_status_code === 0) {} else {
                        DashboardView.userData = GlobalData.userData;
                        VerificationView.userData = GlobalData.userData;
                        DashboardView.create();
                        $('.loginHeader,.home-icon').hide();
                        //                            VerificationView.create();
                        var sideBar = SideBarView.create();
                        sideBar.addToDiv();
                        jQuery('.app').css("background", "#fff");
                        jQuery('body').addClass('page-loaded').removeClass('page-loading');
                        jQuery('body > .pageload').fadeOut();
                        console.log('$$$',CookieUtils.getCookie("is_verified"));
                        if (parseInt(CookieUtils.getCookie("is_verified")) === 1) {
                            jQuery('#verfiyAccount').hide();
                        } else {
                            jQuery('#verfiyAccount').show();

                        }
                    }
                }).fail(function () {});
            }

        };
        this.publicStoryConnect = function () {
            var requestData = {
                "communication_token": CookieUtils.getCookie("communication_token"),
                "story_id": CookieUtils.getCookie("story_id"),
                "user_id": CookieUtils.getCookie("custId")
            };
            var promise = UserService.connectStory(requestData);
            promise.then(function (data) {
                var requestData = CookieUtils.getCookie("custId");
                var promise = DashboardService.dashboardData(requestData);
                promise.then(function (data) {
                    DashboardView.dashboardData = data.arr_data;
                    GlobalData.dashboardData = data.arr_data;
                    var promiseRequestData = CookieUtils.getCookie("custId");
                    var profilePromise = DashboardService.getprofileDetails(promiseRequestData);
                    profilePromise.then(function (data) {
                        if (data.int_status_code === 0) {} else {
                            DashboardView.userData = data.arr_data;
                            VerificationView.userData = data.arr_data;
                            DashboardView.create();
                            var navBar = NavBarView.create();
                            var sideBar = SideBarView.create();
                            sideBar.addToDiv();
                            navBar.addToDiv();
                            jQuery('.app').css("background", "#fff");

                            if (parseInt(CookieUtils.getCookie("is_verified")) === 1) {
                                jQuery('#verfiyAccount').hide();
                            } else {
                                jQuery('#verfiyAccount').show();

                            }

                        }

                    }).fail(function () {

                    });


                }).fail(function () {

                });
            }).fail(function () {

            });
            CookieUtils.delete_cookie('publicShare');
            CookieUtils.delete_cookie('communication_token');
            CookieUtils.delete_cookie('story_id');
            CookieUtils.delete_cookie('share_tokenDeep');
            CookieUtils.delete_cookie('country_codeDeep');
            CookieUtils.delete_cookie('storyCoverDeep');
            CookieUtils.delete_cookie('sharer_nameDeep');
            CookieUtils.delete_cookie('usernameDeep');
        };
        this.getProfileInfo = function () {

        };
    });
    return MainView;
});