/*global define, jQuery, location, FB, window, amazon*/
define(['Augment',
    'Instance',
    'PubSub',
    'GlobalData',
    'utils/StringUtils',
    'utils/CookieUtils',
    'services/UserService',
    'hbs!views/signin/templates/ForgotPasswordView',
    'hbs!views/signin/templates/PersonalizedAccountLoginView'
], function (augment, instance, PubSub, GlobalData, StringUtils, CookieUtils, UserService, ForgotPasswordView, tplPersonalizedAccountLoginView) {

    'use strict';

    var PersonalizedAccountLoginView = augment(instance, function () {
        var personalizedaccountLogin = this;
        personalizedaccountLogin.branchData = "";
        this.email = false;
        this.mobile = false;
        this.addToDiv = function () {
            clearInterval(GlobalData.checkStatus);
            personalizedaccountLogin.branch();
        };

        this.preloader = function () {
            window.onAmazonLoginReady = function () {
                amazon.Login.setClientId('amzn1.application-oa2-client.a0d65aa5087f48cb98c9eef2063faae4');
            };
            PubSub.publish('LOAD_CLOUD_JS_FILES');
            document.getElementById('amazonLogin').onclick = function () {
                GlobalData.ec.recordClickEvent('SignUp_view', 'amazonButtonClicked');
                var options = {
                    scope: 'profile'
                };
                amazon.Login.authorize(options, function (response) {
                    if (response.error) {
                        return;
                    } else {
                        jQuery('body').addClass('page-loaded');
                        jQuery('body > .pageload').fadeIn();
                    }
                    amazon.Login.retrieveProfile(response.access_token, function (response) {
                        GlobalData.amazonData = {};
                        GlobalData.amazonData.name = response.profile.Name;
                        GlobalData.amazonData.email = response.profile.PrimaryEmail;
                        GlobalData.amazonData.custId = response.profile.CustomerId;
                        personalizedaccountLogin.requestForLogin('AMAZON');
                    });
                });
                jQuery.getScript("https://apis.google.com/js/api.js", function (data, textStatus, jqxhr) {
                    console.log(jqxhr.status); // 200
                    jQuery("#googlePlusLogin").removeClass("disabled");
                });
                //                return false;
            };
            //google service initialisation.
            StringUtils.placeHolderCall();
            if (jQuery(window).width() < 1025) {
                jQuery('body').css('background', '#323232');
            } else {
                jQuery('body').css('background', '#dedede');
            }
            GlobalData.GoogleServiceInitialisation();
            CookieUtils.delete_cookie("is_verified");
            CookieUtils.delete_cookie("authToken");
            CookieUtils.delete_cookie("custId");
            CookieUtils.delete_cookie("custName");
            CookieUtils.delete_cookie("custProfilePic");
            CookieUtils.delete_cookie("custEmail");
            CookieUtils.delete_cookie("isRememberMe");
            CookieUtils.delete_cookie("verify");
            //            if (CookieUtils.getCookie("authToken") !== "") {
            //                location.hash = "/dashboard";
            //            }
            jQuery('#dashbaordUIView').empty();
            jQuery('#NavBarDiv').empty();
            jQuery('#SideBarDiv').empty();
            jQuery('body').addClass('page-loaded').removeClass('page-loading');
            jQuery('body > .pageload').fadeOut();
            jQuery('#forgotPassword').click(PersonalizedAccountLoginView.showForgotPassword);
            jQuery('.personalizedSignup').click(PersonalizedAccountLoginView.showSignUp);
            jQuery('#loginId').click(PersonalizedAccountLoginView.checkEmailOrMobile);
            jQuery('.form-layout#login').keypress(function (e) {
                var key = e.which;
                if (key === 13) // the enter key code
                {
                    PersonalizedAccountLoginView.checkEmailOrMobile();

                }
            });
            jQuery("#facebookLogin").click(PersonalizedAccountLoginView.requestForFBLogin);
            jQuery("#googlePlusLogin").click(PersonalizedAccountLoginView.requestForGooglePlusLogin);
            //            if (!(jQuery("#emailOrMobile").is(":focus"))) {
            //                jQuery(".del").css("visibility", "hidden");
            //            }
            PubSub.subscribe('GOOGLE_LOGGED_IN', function () {
                PersonalizedAccountLoginView.requestForLogin("GOOGLE");
            });
            PubSub.subscribe('FACEBOOK_LOGGED_IN', function () {
                PersonalizedAccountLoginView.requestForLogin("FACEBOOK");
            });

            jQuery(".login-checkBox").click(function () {
                if (jQuery(this).parent().hasClass("active")) {
                    jQuery(this).parent().removeClass("active");
                } else {
                    jQuery(this).parent().addClass("active");
                }
            });
            jQuery('.logo-img-box').on('click', function () {
                document.location.href = GlobalData.base;
            });
        };

        this.branch = function () {
            var divId = "appSignInDiv";
            var innerHtml = "";
            var profilePic = "";
            if (CookieUtils.getCookie("story_owner_pic_url") === '' || CookieUtils.getCookie("story_owner_pic_url") === null) {
                profilePic = "assets/images/user_pic_profilepic.png";
            } else {
                profilePic = CookieUtils.getCookie("story_owner_pic_url");
            }
            if (CookieUtils.getCookie("event_type") === "story_image_contribution_copy_link") {
                var shareText = ' invited you to add photos to their story ';
                innerHtml = tplPersonalizedAccountLoginView({
                    label: "Please sign in with label",
                    sharer: CookieUtils.getCookie("story_owner_name"),
                    storyName: CookieUtils.getCookie("story_cover_caption"),
                    sharerText: shareText,
                    signInText: 'Login to continue.',
                    storyCover: profilePic,
                    imageBase: GlobalData.imageBase
                });
            } else {
                innerHtml = tplPersonalizedAccountLoginView({
                    label: "Please sign in with label",
                    sharer: CookieUtils.getCookie("sharer_nameDeep"),
                    sharerText: ' has built their stunning photo story here, you can too!',
                    storyCover: CookieUtils.getCookie("storyCoverDeep"),
                    login: CookieUtils.getCookie("usernameDeep"),
                    imageBase: GlobalData.imageBase
                });
            }

            jQuery('#SideBarDiv,#NavBarDiv,#dashbaordUIView,#verifyScrModal,#shareScreenModal,#infoScreenModal,#dashbaordUIView').empty();
            jQuery('.mainContainer').hide();
            jQuery('#' + divId).html(innerHtml);
            if (CookieUtils.getCookie("publicShare")) {
                jQuery("#password").focus(function () {
                    jQuery(".del").css("display", "none");
                });
                jQuery(".del").on('click', function () {
                    jQuery("#emailOrMobile, #password").val("");
                });
                jQuery('#emailOrMobile').keypress(function () {
                    jQuery(".del").css("display", "block");
                });
                jQuery('#emailOrMobile').focus(function () {
                    jQuery(".del").css("display", "block");
                });
                CookieUtils.setCookie("usernameDeep", "", GlobalData.expireDays);
                jQuery(".btn-google,.btn-facebook,.btn-amazon").off().css({
                    "opacity": "1",
                    "cursor": "pointer"
                });
                jQuery('#emailOrMobile').removeAttr("disabled");
            } else {

                jQuery('.personalized img').css({
                    'border-radius': '50%',
                    'margin-top': '5px',
                    'width': '90px'
                });
                jQuery(".btn-google,.btn-facebook,.btn-amazon").off().css({
                    "opacity": "1",
                    "cursor": "pointer"
                });

                if (CookieUtils.getCookie("event_type") === "story_image_contribution_copy_link") {
                    jQuery('#emailOrMobile').attr("disabled", false);
                } else {
                    jQuery('#emailOrMobile').attr("disabled", "disabled");
                }

            }
            personalizedaccountLogin.preloader();
            //                        if (data.login_type === "email") {
            //                            personalizedaccountLogin.emailFocus();
            //                            jQuery('#personalizedEmail').val(data.login_id);
            //                        }
            //                        else {
            //                            personalizedaccountLogin.phoneFocus();
            //                            jQuery('#personalizedPhone').val(data.login_id);
            //                        }


        };
        this.checkLoginState = function () {
            FB.getLoginStatus(function (response) {
                jQuery('#facebookLogin').removeAttr('disabled');
                GlobalData.statusChangeCallback(response);
            });
        };

        /* Google plus login*/
        this.requestForGooglePlusLogin = function () {
            GlobalData.onLoadCallback();
            GlobalData.GoogleServiceLogin();
        };

        /*      Redirection           */
        this.requestForFBLogin = function () {
            PersonalizedAccountLoginView.checkLoginState();
        };
        this.showForgotPassword = function () {
            location.hash = '#/forgotpassword';
        };
        this.showSignUp = function () {
            location.hash = '#/personalizedaccountsignup';
        };
        this.checkEmailOrMobile = function () {
            GlobalData.ec.recordClickEvent('Login_view', 'loginButtonClicked');
            var testresults;
            var isEmail = 0;
            var mobile = 0;

            function checkemail() {
                var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                if (filter.test(jQuery('#emailOrMobile').val())) {
                    isEmail = 1;
                    testresults = true;
                } else {
                    testresults = false;
                    isEmail = 0;
                }
                return (testresults);
            }

            function isValidPhonenumber(value) {
                var check = checkemail();
                if (check) {
                    return true;
                } else {
                    mobile = (/^\d{7,}$/).test(value.replace(/[\s()+\-\.]|ext/gi, ''));

                    return mobile;
                }
            }
            var test = isValidPhonenumber(jQuery('#emailOrMobile').val());
            if (test) {

            }
            if (isEmail === 1) {
                PersonalizedAccountLoginView.requestForLogin("EMAIL");
            }
            if (mobile) {
                PersonalizedAccountLoginView.requestForLogin("MOBILE");
            }
            if (mobile === false && isEmail === 0) {
                jQuery('#error').text("Username is Invalid");
            }

        };

        /*         promises    */
        this.requestForLogin = function (loginType) {
            jQuery('body').addClass('page-loaded');
            jQuery('body > .pageload').fadeIn();
            var promise = "";
            var requestData = "";
            if (loginType === 'EMAIL') {
                requestData = {
                    email: jQuery('#emailOrMobile').val(),
                    password: jQuery('#password').val()
                };
                promise = UserService.userLogin(requestData);
            }
            if (loginType === 'MOBILE') {
                requestData = {
                    mobile_number: jQuery('#emailOrMobile').val(),
                    password: jQuery('#password').val(),
                    expiryhours: "24"
                };
                promise = UserService.userMobileLogin(requestData);
            }
            if (loginType === "FACEBOOK") {
                requestData = {
                    email_id: GlobalData.facebookData.email,
                    firstname: GlobalData.facebookData.first_name,
                    lastname: GlobalData.facebookData.last_name,
                    account_type: "facebook"
                };
                promise = UserService.userSocialLogin(requestData);
            }
            if (loginType === "GOOGLE") {
                requestData = {
                    email_id: GlobalData.googleData.emails[0].value,
                    firstname: GlobalData.googleData.displayName,
                    lastname: GlobalData.googleData.displayName,
                    account_type: "google"
                };
                promise = UserService.userSocialLogin(requestData);
            }
            if (loginType === "AMAZON") {
                requestData = {
                    email_id: GlobalData.amazonData.email,
                    firstname: GlobalData.amazonData.name,
                    lastname: "",
                    account_type: "amazon"
                };
                promise = UserService.userSocialLogin(requestData);
            }
            promise.then(function (data) {
                GlobalData.userData = data.arr_data;
                if (data.int_status_code === 0) {
                    jQuery('body').addClass('page-loaded').removeClass('page-loading');
                    jQuery('body > .pageload').fadeOut();
                    jQuery('#error').text(data.str_status_message);
                } else {

                    CookieUtils.setCookie("custMob", GlobalData.userData.mobile_number, GlobalData.expireDays);
                    CookieUtils.setCookie("custprimaryemail", GlobalData.userData.primaryemail, GlobalData.expireDays);
                    CookieUtils.setCookie("custsecondary_email", GlobalData.userData.secondary_email, GlobalData.expireDays);
                    CookieUtils.setCookie("is_verified", GlobalData.userData.is_verified, GlobalData.expireDays);

                    CookieUtils.setCookie("sessionKey", GlobalData.userData.session_token, GlobalData.expireDays);
                    if (CookieUtils.getCookie("authToken") === "") {
                        CookieUtils.setCookie("authToken", GlobalData.userData.customer_token, GlobalData.expireDays);
                        CookieUtils.setCookie("custId", GlobalData.userData.id, GlobalData.expireDays);
                        CookieUtils.setCookie("custName", GlobalData.userData.customer_name, GlobalData.expireDays);
                        CookieUtils.setCookie("custProfilePic", GlobalData.userData.user_picture_path, GlobalData.expireDays);
                        CookieUtils.setCookie("custEmail", GlobalData.userData.email, GlobalData.expireDays);

                        CookieUtils.setCookie("isPasswordSet", GlobalData.userData.is_password_set, GlobalData.expireDays);

                    }
                    if (CookieUtils.getCookie('publicShare')) {
                        CookieUtils.setCookie("is_verified", GlobalData.userData.is_verified, GlobalData.expireDays);
                        window.location.hash = '#/dashboard';
                        jQuery('body').addClass('page-loaded').removeClass('page-loading');
                        jQuery('body > .pageload').fadeOut();
                    } else {
                        var stringURL = window.location.href;
                        stringURL = stringURL.split("?");
                        window.location.href = stringURL[0] + "#/dashboard";
                        jQuery('body').addClass('page-loaded').removeClass('page-loading');
                        jQuery('body > .pageload').fadeOut();

                    }
                }

            }).fail(function (data) {
                jQuery('#error').text(data.str_status_message);
            });
        };

    });
    jQuery(window).resize(function () {
        if (jQuery(window).width() < 1025) {
            jQuery('body').css('background', '#323232');
        } else {
            jQuery('body').css('background', '#dedede');
        }
    });


    return PersonalizedAccountLoginView;
});