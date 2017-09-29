/*global define, jQuery, location, alert, window, console, branch*/
define(['Augment',
    'Instance',
    'PubSub',
    'branch',
    'GlobalData',
    'utils/CookieUtils',
    'services/UserService'
], function (augment, instance, PubSub, branch, GlobalData, CookieUtils, UserService) {

    'use strict';

    var DeepLink = augment(instance, function () {
        var deeplink = this;
        var user_id, authtoken, login_id, account_id, sharee_id, story_cover_pic, login_type, sharer_name, share_token, country_code, communication_token, story_id, ownstory_tracking_id, public_id;
        var cust_ID = CookieUtils.getCookie("custId");
        var stringURL = window.location.href;
        stringURL = stringURL.split("?");
        this.init = function () {
            console.log("in deeplink init");
            this.preloader();
        };
        deeplink.branchData = "";

        this.preloader = function () {
            GlobalData.GoogleServiceInitialisation();
            jQuery('#dashbaordUIView').empty();
            jQuery('#NavBarDiv').empty();
            jQuery('#SideBarDiv').empty();
            DeepLink.branch();
            branch.init(
                GlobalData.branchIOKey
            );
            branch.data(
                function (err, inputdata) {
                    var data = JSON.parse(inputdata.data);
                    user_id = data.user_id;
                    authtoken = data.token;
                    share_token = data.share_token;
                    login_id = data.login_id;
                    account_id = data.account_id;
                    sharee_id = data.sharee_id;
                    story_cover_pic = data.story_cover_pic;
                    login_type = data.login_type;
                    sharer_name = data.sharer_name;
                    country_code = data.country_code;
                    communication_token = data.communication_token;
                    story_id = data.story_id;
                    ownstory_tracking_id = data.tracking_id;
                    public_id = data.login_id;
                    if (data.event_type === "verify_account") {
                        DeepLink.verificationAccouunt();
                    }
                    if (data.event_type === "private_share") {
                        DeepLink.privateVerificationAccouunt();
                    }
                    if (data.event_type === "public_share") {
                        DeepLink.publicStory();
                    }
                    if (data.event_type === "copy_link") {
                        DeepLink.copylink();
                    }
                    if (data.event_type === "story_updated") {
                        DeepLink.ownStoryReady();
                    }
                    if (data.event_type === "story_image_contribution_copy_link") {
                        GlobalData.contributionStory = data;
                        DeepLink.contributionLink();
                    }

                }
            );
        };
        this.branch = function () {
            console.log('inside branch');

        };
        this.copylink = function () {
            var str = communication_token;
            var encodedString = window.btoa(str);
            CookieUtils.setCookie("copylink", 1, GlobalData.expireDays);
            window.location.href = GlobalData.flipbookBaseURL + encodedString;
        };

        this.contributionLink = function () {
            //            $('.pageload').hide();
            //            if ((navigator.userAgent.match(/Android/i)) || (navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i))) {
            //                jQuery('#messageModal').modal('show');
            //                console.log("in mobile");
            //            } else {
            //                console.log("in desktop");
            //                jQuery('#messageModal').modal('show');
            //                jQuery('.ot-btn').hide();
            //                jQuery('#ok_back').show();
            //                jQuery('#ok_back').css('border', 'none');
            //                jQuery('#ok_back').click(function () {
            //                    window.location.href = 'https://www.photogurus.com/?page=send_link';
            //                });
            //            }
            //            jQuery('.mobileFeature #confirm_download').click(function () {
            //                if ((navigator.userAgent.match(/Android/i))) {
            //                    window.location.href = "https://play.google.com/store/apps/details?id=com.photogurus";
            //                } else if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i))) {
            //                    window.location.href = "https://itunes.apple.com/us/app/photogurus/id799452318?ls=1&mt=8";
            //                } else {
            //                    window.location.href = 'https://www.photogurus.com/?page=send_link';
            //                }
            //
            //            });
        };

        this.publicStory = function () {
            if (cust_ID) {
                var requestData = {
                    "communication_token": communication_token,
                    "story_id": story_id,
                    "user_id": cust_ID
                };
                var promise = UserService.connectStory(requestData);
                promise.then(function (data) {
                    if (data.int_status_code === 0) {
                        alert("Please try again.");
                    } else {
                        CookieUtils.setCookie("publicLogged", 1, GlobalData.expireDays);
                        CookieUtils.setCookie("publicLogged_comm_token", communication_token, GlobalData.expireDays);
                        window.location.href = stringURL[0] + "#/dashboard";
                    }
                }).fail(function () {

                });
            } else {
                CookieUtils.setCookie("communication_token", communication_token, GlobalData.expireDays);
                CookieUtils.setCookie("story_id", story_id, GlobalData.expireDays);
                CookieUtils.setCookie("storyCoverDeep", story_cover_pic, GlobalData.expireDays);
                CookieUtils.setCookie("share_tokenDeep", share_token, GlobalData.expireDays);
                CookieUtils.setCookie("country_codeDeep", country_code, GlobalData.expireDays);
                CookieUtils.setCookie("sharer_nameDeep", sharer_name, GlobalData.expireDays);
                var str = communication_token;
                var encodedString = window.btoa(str);
                window.location.href = GlobalData.flipbookBaseURL + encodedString;
            }
        };

        this.ownStoryReady = function () {
            CookieUtils.setCookie("ownStoryTrackingDeep", ownstory_tracking_id, GlobalData.expireDays);
            CookieUtils.setCookie("ownStoryDeep", 1, GlobalData.expireDays);
            if (cust_ID === user_id) {
                window.location.href = stringURL[0] + "#/dashboard";
            } else {
                if (cust_ID) {
                    DeepLink.ownStory();
                    PubSub.publish('LOGOUT');
                    CookieUtils.delete_cookie("isRememberMe");
                    location.hash = "#/login";
                } else {
                    DeepLink.ownStory();
                    PubSub.publish('LOGOUT');
                    CookieUtils.delete_cookie("isRememberMe");
                    location.hash = "#/login";
                }
            }
        };
        this.contributionLink = function () {
            if (!GlobalData.mobileDevice) {
                if (parseInt(cust_ID)) {
                    CookieUtils.setCookie("event_type", GlobalData.contributionStory.event_type, GlobalData.expireDays);
                    CookieUtils.setCookie("image_contribution_token", GlobalData.contributionStory.image_contribution_token, GlobalData.expireDays);
                    CookieUtils.setCookie("story_id", GlobalData.contributionStory.story_id, GlobalData.expireDays);
                    window.location.href = stringURL[0] + "#/dashboard";
                } else {
                    CookieUtils.deleteAllCookies();
                    CookieUtils.setCookie("event_type", GlobalData.contributionStory.event_type, GlobalData.expireDays);
                    CookieUtils.setCookie("image_contribution_token", GlobalData.contributionStory.image_contribution_token, GlobalData.expireDays);
                    CookieUtils.setCookie("should_show_personalized_page", GlobalData.contributionStory.should_show_personalized_page, GlobalData.expireDays);
                    CookieUtils.setCookie("story_cover_caption", GlobalData.contributionStory.story_cover_caption, GlobalData.expireDays);
                    CookieUtils.setCookie("story_owner_id", GlobalData.contributionStory.story_owner_id, GlobalData.expireDays);
                    CookieUtils.setCookie("story_owner_name", GlobalData.contributionStory.story_owner_name, GlobalData.expireDays);
                    CookieUtils.setCookie("story_owner_pic_url", GlobalData.contributionStory.story_owner_pic_url, GlobalData.expireDays);
                    CookieUtils.setCookie("story_id", GlobalData.contributionStory.story_id, GlobalData.expireDays);
                    location.hash = "#/personalizedaccountlogin";
                }
            } else {
                console.log(GlobalData.mobileDevice);
                CookieUtils.deleteAllCookies();
                CookieUtils.setCookie("event_type", GlobalData.contributionStory.event_type, GlobalData.expireDays);
                CookieUtils.setCookie("image_contribution_token", GlobalData.contributionStory.image_contribution_token, GlobalData.expireDays);
                CookieUtils.setCookie("should_show_personalized_page", GlobalData.contributionStory.should_show_personalized_page, GlobalData.expireDays);
                CookieUtils.setCookie("story_cover_caption", GlobalData.contributionStory.story_cover_caption, GlobalData.expireDays);
                CookieUtils.setCookie("story_owner_id", GlobalData.contributionStory.story_owner_id, GlobalData.expireDays);
                CookieUtils.setCookie("story_owner_name", GlobalData.contributionStory.story_owner_name, GlobalData.expireDays);
                CookieUtils.setCookie("story_owner_pic_url", GlobalData.contributionStory.story_owner_pic_url, GlobalData.expireDays);
                CookieUtils.setCookie("story_id", GlobalData.contributionStory.story_id, GlobalData.expireDays);
                location.hash = "#/install";

            }
        };


        this.ownStory = function () {
            CookieUtils.setCookie("usernameDeep", login_id, GlobalData.expireDays);
            CookieUtils.setCookie("ownStoryDeep", 1, GlobalData.expireDays);
            CookieUtils.setCookie("storyCoverDeep", story_cover_pic, GlobalData.expireDays);
            //              CookieUtils.setCookie("storyCoverDeep", story_cover_pic, 1);
        };
        this.privateVerificationAccouunt = function () {
            if ((sharee_id)) {
                if (parseInt(cust_ID) === parseInt(sharee_id)) {
                    DeepLink.existingUserCookie();
                    window.location.href = stringURL[0] + "#/dashboard";
                } else {
                    if (parseInt(cust_ID)) {
                        DeepLink.existingUserCookie();
                        PubSub.publish('LOGOUT');
                        location.hash = "#/personalizedaccountlogin";
                    } else {
                        DeepLink.existingUserCookie();
                        location.hash = "#/personalizedaccountlogin";
                    }
                }
            } else {
                CookieUtils.deleteAllCookies();
                CookieUtils.setCookie("usernameDeep", login_id, GlobalData.expireDays);
                CookieUtils.setCookie("login_typeDeep", login_type, GlobalData.expireDays);
                CookieUtils.setCookie("storyCoverDeep", story_cover_pic, GlobalData.expireDays);
                CookieUtils.setCookie("personalizedNewUserDeep", 1, GlobalData.expireDays);
                CookieUtils.setCookie("share_tokenDeep", share_token, GlobalData.expireDays);
                CookieUtils.setCookie("country_codeDeep", country_code, GlobalData.expireDays);
                CookieUtils.setCookie("sharer_nameDeep", sharer_name, GlobalData.expireDays);
                location.hash = "#/personalizedaccountsignup";
            }

        };
        this.existingUserCookie = function () {
            CookieUtils.setCookie("usernameDeep", login_id, GlobalData.expireDays);
            CookieUtils.setCookie("authTokenDeepShare", authtoken, GlobalData.expireDays);
            CookieUtils.setCookie("share_tokenDeep", share_token, GlobalData.expireDays);
            CookieUtils.setCookie("storyCoverDeep", story_cover_pic, GlobalData.expireDays);
            //                        CookieUtils.setCookie("custIdDeep", user_id, 1);
            CookieUtils.setCookie("shareeIDDeep", sharee_id, GlobalData.expireDays);
            CookieUtils.setCookie("accountIdDeepShare", account_id, GlobalData.expireDays);
            CookieUtils.setCookie("sharer_nameDeep", sharer_name, GlobalData.expireDays);
            CookieUtils.setCookie("personalizedExistingUserDeep", 1, GlobalData.expireDays);
        };
        this.verificationAccouunt = function () {
            if (parseInt(cust_ID) === parseInt(user_id)) {
                DeepLink.verifyUser();
            } else {
                if (parseInt(cust_ID)) {
                    CookieUtils.setCookie("usernameDeep", login_id, GlobalData.expireDays);
                    CookieUtils.setCookie("authTokenDeep", authtoken, GlobalData.expireDays);
                    CookieUtils.setCookie("custIdDeep", user_id, GlobalData.expireDays);
                    CookieUtils.setCookie("accountIdDeep", account_id, GlobalData.expireDays);
                    CookieUtils.setCookie("verrifyuserDeep", 1, GlobalData.expireDays);
                    PubSub.publish('LOGOUT');
                    CookieUtils.delete_cookie("isRememberMe");
                    location.hash = "#/login";
                } else {
                    DeepLink.verifyUser();
                }
            }
        };
        this.verifyUser = function () {
            var requestData = {
                "user_id": user_id,
                "account_id": account_id,
                "token": authtoken
            };
            var promise = UserService.verifyAccountByUserId(requestData);
            promise.then(function (data) {
                if (data.int_status_code === 0) {
                    alert("Please try again.");
                } else {
                    if (data.str_status_message === "Your account has already been verified") {
                        CookieUtils.setCookie("verifyalreadyDeep", 1, GlobalData.expireDays);
                        DeepLink.verifyCookies();
                    } else {
                        DeepLink.verifyCookies();
                    }
                }
            }).fail(function () {

            });

        };
        this.verifyCookies = function () {
            CookieUtils.setCookie("authToken", authtoken, GlobalData.expireDays);
            CookieUtils.setCookie("custId", user_id, GlobalData.expireDays);
            CookieUtils.setCookie("custEmail", login_id, GlobalData.expireDays);
            CookieUtils.setCookie('is_verified', 1, GlobalData.expireDays);
            CookieUtils.setCookie('verifyByLink', 1, GlobalData.expireDays);
            window.location.href = stringURL[0] + "#/dashboard";
        };
    });



    return DeepLink;
});