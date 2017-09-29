/*global define, jQuery, location, FB, window, amazon*/
define(['Augment',
    'Instance',
    'PubSub',
    'GlobalData',
    'utils/CookieUtils',
    'utils/LanguageUtils',
    'utils/StringUtils',
    'services/UserService',
    'hbs!views/signin/templates/SignInView'
], function (augment, instance, PubSub, GlobalData, CookieUtils, LanguageUtils, StringUtils, UserService, tplSignInView) {

    'use strict';
    var SignInView = augment(instance, function () {

        this.email = false;
        this.mobile = false;
        this.clickDisabled = false;
        this.addToDiv = function () {
            var divId = "appSignInDiv";
            var innerHtml = tplSignInView({
                loginLowerCase: LanguageUtils.valueForKey("loginLowerCase"),
                loginUpperCase: LanguageUtils.valueForKey("loginUpperCase"),
                signupLowerCase: LanguageUtils.valueForKey("signupLowerCase"),
                signupUppderCase: LanguageUtils.valueForKey("signupUppderCase"),
                accountlogin: LanguageUtils.valueForKey("accountlogin"),
                forgotpassword: LanguageUtils.valueForKey("forgotpassword"),
                donthaveaccount: LanguageUtils.valueForKey("donthaveaccount"),
                rememberme: LanguageUtils.valueForKey("rememberme"),
                password: LanguageUtils.valueForKey("password"),
                emailormobile: LanguageUtils.valueForKey("emailormobile"),
                baseUrl: GlobalData.baseUrl2,
                imageBase: GlobalData.imageBase
            });
            jQuery('#' + divId).empty();
            jQuery('.mainContainer').hide();
            jQuery('#' + divId).html(innerHtml);
            this.preloader();
        };

        this.preloader = function () {
            if (CookieUtils.getCookie("custEmail") !== undefined || CookieUtils.getCookie("custEmail") !== '') {
                jQuery('#emailOrMobile').val(CookieUtils.getCookie("custEmail"));
            } else if (CookieUtils.getCookie("custMob") !== undefined || CookieUtils.getCookie("custMob") !== '') {
                jQuery('#emailOrMobile').val(CookieUtils.getCookie("custMob"));
            } else {
                jQuery('#emailOrMobile').val('');
            }

            if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/Android/i))) {
                jQuery("#loginHeader").text("Login");
            }
            //Amazon
            window.onAmazonLoginReady = function () {
                amazon.Login.setClientId('amzn1.application-oa2-client.a0d65aa5087f48cb98c9eef2063faae4');
            };

            document.getElementById('amazonLogin').onclick = function (event) {
                event.stopPropagation();
                //stop fast clicks
                if (SignInView.clickDisabled) {
                    return;
                }
                SignInView.clickDisabled = true;
                setTimeout(function () {
                    SignInView.clickDisabled = false;
                }, 500);
                
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
                        SignInView.requestForLogin('AMAZON');
                    });
                });
                //                return false;
            };
            //google service initialisation.
            var signView = this;
            clearInterval(GlobalData.checkStatus);
            StringUtils.placeHolderCall();
            if (jQuery(window).width() < 1025) {
                jQuery('body').css('background', '#323232');
            } else {
                jQuery('body').css('background', '#dedede');
            }

            if (CookieUtils.getCookie("usernameDeep")) {
                jQuery('#emailOrMobile').val(CookieUtils.getCookie("usernameDeep")).css("background", "transparent");
            }

            jQuery('.back-arrow').click(function () {
                window.location.href = GlobalData.mainPage;
            });
            GlobalData.GoogleServiceInitialisation();
            if ((CookieUtils.getCookie("isRememberMe"))) {
                location.hash = "/dashboard";
            } else {
                CookieUtils.delete_cookie('authToken');
                CookieUtils.delete_cookie('custId');
                CookieUtils.delete_cookie('custName');
                CookieUtils.delete_cookie('custProfilePic');
                CookieUtils.delete_cookie('custEmail');
                CookieUtils.delete_cookie('publicShare');
            }



            jQuery('#dashbaordUIView').empty();
            jQuery('#NavBarDiv').empty();
            jQuery('#SideBarDiv').empty();
            jQuery('body').addClass('page-loaded').removeClass('page-loading');
            jQuery('body > .pageload').fadeOut();
            jQuery('#forgotPassword').click(function () {
                GlobalData.ec.recordClickEvent('ResetPassword', 'forgotPasswordLink');
                signView.showForgotPassword();
            });
            jQuery('#signupTop').click(function () {
                GlobalData.ec.recordClickEvent('Login_view', 'signupTopButtonClicked');
                signView.showSignUp();
            });
            jQuery('#signupSide').click(function () {
                GlobalData.ec.recordClickEvent('Login_view', 'signupTopButtonClicked');
                signView.showSignUp();
            });
            jQuery('#signUp').click(function () {
                GlobalData.ec.recordClickEvent('Login_view', 'signupBottomButtonClicked');
                signView.showSignUp();
            });
            jQuery('#loginTop').click(function () {
                GlobalData.ec.recordClickEvent('Login_view', 'loginTopButtonClicked');
                location.hash = "/login";
            });
            jQuery('#loginSide').click(function () {
                GlobalData.ec.recordClickEvent('Login_view', 'loginTopButtonClicked');
                location.hash = "/login";
            });
            jQuery('#loginId').click(signView.checkEmailOrMobile);
            jQuery('.form-layout#login').keypress(function (e) {
                var key = e.which;
                if (key === 13) // the enter key code
                {
                    signView.checkEmailOrMobile();

                }
            });
            jQuery("#facebookLogin").click(signView.requestForFBLogin);
            jQuery("#googlePlusLogin").click(signView.requestForGooglePlusLogin);

            PubSub.unsubscribe('GOOGLE_LOGGED_IN');
            PubSub.subscribe('GOOGLE_LOGGED_IN', function () {
                signView.requestForLogin("GOOGLE");
            });
            PubSub.unsubscribe('FACEBOOK_LOGGED_IN');
            PubSub.subscribe('FACEBOOK_LOGGED_IN', function () {
                signView.requestForLogin("FACEBOOK");
            });

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
            PubSub.publish('LOAD_CLOUD_JS_FILES');

            jQuery('#hamburger-menu, .left_close_bt').sidr();
            jQuery('.session-wrapper, #signupSide, #loginSide').click(function () {
                if (jQuery('#sidr').css('display') === "block") {
                    jQuery('.left_close_bt').click(function (event) {
                        event.stopPropagation();
                    });
                    jQuery('.left_close_bt').click();
                }
            });

        };



        this.checkLoginState = function () {
            FB.getLoginStatus(function (response) {
                jQuery('#facebookLogin').removeAttr('disabled');
                GlobalData.statusChangeCallback(response);
            });
        };

        /* Google plus login*/
        this.requestForGooglePlusLogin = function (event) {
            event.stopPropagation();
            //stop fast clicks
            if (SignInView.clickDisabled) {
                return;
            }
            SignInView.clickDisabled = true;
            setTimeout(function () {
                SignInView.clickDisabled = false;
            }, 500);
            //            GlobalData.ec.recordClickEvent('Login_view', 'googleButtonClicked');
            GlobalData.onLoadCallback();
            GlobalData.GoogleServiceLogin();
        };

        /*      Redirection           */
        this.requestForFBLogin = function (event) {
            event.stopPropagation();
            //stop fast clicks
            if (SignInView.clickDisabled) {
                return;
            }
            SignInView.clickDisabled = true;
            setTimeout(function () {
                SignInView.clickDisabled = false;
            }, 500);
            console.dir(event);
            //            GlobalData.ec.recordClickEvent('Login_view', 'facebookButtonClicked');

            SignInView.checkLoginState();
        };
        this.showForgotPassword = function () {
            //            GlobalData.ec.recordClickEvent('Login_view', 'forgotButtonClicked');
            location.hash = '#/forgotpassword';
        };
        this.showSignUp = function () {
            location.hash = '#/accountsignup';
        };


        this.checkEmailOrMobile = function () {
            GlobalData.ec.recordClickEvent('Login_view', 'loginButtonClicked');
            var testresults;
            var isEmail = 0;
            var mobile = 0;

            function checkemail() {
                var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                if (filter.test(jQuery('#emailOrMobile').val().replace(/ /g, ''))) {
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
            var test = isValidPhonenumber(jQuery('#emailOrMobile').val().replace(/ /g, ''));
            var emailAndMobile = jQuery('#emailOrMobile').val().replace(/ /g, '');
            if (test) {

            }
            if (isEmail === 1) {
                SignInView.requestForLogin("EMAIL");
            }
            if (mobile) {
                SignInView.requestForLogin("MOBILE");
            }
            if (mobile === false && isEmail === 0) {
                var items = emailAndMobile.trim();
                var phonenoFilter = /^[0-9_+-]*$/;
                if (phonenoFilter.test(items)) {
                    jQuery('#error').text("Mobile number is invalid");
                } else {
                    jQuery('#error').text("Email Address is invalid");
                }


                if (emailAndMobile.length === 0) {
                    jQuery('#error').text("Please Enter Email Address or Mobile Number");
                }
            }

        };

        /*         promises    */
        this.requestForLogin = function (loginType) {
            jQuery('body').addClass('page-loaded');
            jQuery('body > .pageload').fadeIn();
            var promise = "";
            var requestdata = "";
            var pixel_params = null;
            var getGeoLocationPromise = null;

            if (loginType === 'EMAIL') {

                getGeoLocationPromise = getGeoLocation();
                getGeoLocationPromise.then(function(data) {
                    if(data.country_code){
                        requestdata = {
                            email: jQuery('#emailOrMobile').val(),
                            password: jQuery('#password').val(),
                            expiryhours: 24,
                            region_code: data.country_code,
                            language_code: GlobalData.userLanguage
                        };
                        return requestdata;
                    }else{
                        return Promise.reject('Could not retrieve user country code');
                    }
                    
                }).then(function(requestdata) {
                    return UserService.userLogin(requestdata);
                }).then(function(data) {
                    pixel_params = {'Registration_type':'Email login'};
                    
                    var response = {};
                    response.data = data;
                    response.pixel_params = pixel_params;
                    response.loginType = loginType;
                    SignInView.handleOutputForLogin(response);
                }).catch(function(e) {
                    jQuery('body').addClass('page-loaded').removeClass('page-loading');
                    jQuery('body > .pageload').fadeOut();
                    jQuery('#error').text(e);
                });

            }
            if (loginType === 'MOBILE') {

                getGeoLocationPromise = getGeoLocation();
                getGeoLocationPromise.then(function(data) {
                    if(data.country_code){
                        requestdata = {
                            mobile_number: jQuery('#emailOrMobile').val().replace(/ /g, ''),
                            password: jQuery('#password').val(),
                            expiryhours: "24",
                            region_code: data.country_code,
                            language_code: GlobalData.userLanguage
                        };
                        return requestdata;
                    }else{
                        return Promise.reject('Could not retrieve user country code');
                    }
                    
                }).then(function(requestdata) {
                    return UserService.userMobileLogin(requestdata);
                }).then(function(data) {
                    pixel_params = {'Registration_type':'Mobile login'};
                    
                    var response = {};
                    response.data = data;
                    response.pixel_params = pixel_params;
                    response.loginType = loginType;
                    SignInView.handleOutputForLogin(response);
                }).catch(function(e) {
                    jQuery('body').addClass('page-loaded').removeClass('page-loading');
                    jQuery('body > .pageload').fadeOut();
                    jQuery('#error').text(e);
                });

            }
            if (loginType === "FACEBOOK") {

                getGeoLocationPromise = getGeoLocation();
                getGeoLocationPromise.then(function(data) {
                    if(data.country_code){
                        requestdata = {
                            email_id: GlobalData.facebookData.email,
                            firstname: GlobalData.facebookData.first_name,
                            lastname: GlobalData.facebookData.last_name,
                            account_type: "facebook",
                            name: GlobalData.facebookData.name,
                            region_code: data.country_code,
                            language_code: GlobalData.userLanguage
                        };
                        return requestdata;
                    }else{
                        return Promise.reject('Could not retrieve user country code');
                    }
                    
                }).then(function(requestdata) {
                    return UserService.userSocialAccount(requestdata);
                }).then(function(data) {
                    pixel_params = {'Registration_type':'Facebook'};
                    
                    var response = {};
                    response.data = data;
                    response.pixel_params = pixel_params;
                    response.google_analytics = 'FB_signup_successful';
                    response.loginType = loginType;
                    SignInView.handleOutputForLogin(response);
                }).catch(function(e) {
                    jQuery('body').addClass('page-loaded').removeClass('page-loading');
                    jQuery('body > .pageload').fadeOut();
                    jQuery('#error').text(e);
                });

            }
            if (loginType === "GOOGLE") {

                getGeoLocationPromise = getGeoLocation();
                getGeoLocationPromise.then(function(data) {
                    if(data.country_code){
                        requestdata = {
                            email_id: GlobalData.googleData.emails[0].value,
                            firstname: GlobalData.googleData.displayName,
                            lastname: GlobalData.googleData.displayName,
                            account_type: "google",
                            name: GlobalData.googleData.displayName,
                            region_code: data.country_code,
                            language_code: GlobalData.userLanguage
                        };
                        return requestdata;
                    }else{
                        return Promise.reject('Could not retrieve user country code');
                    }
                    
                }).then(function(requestdata) {
                    return UserService.userSocialAccount(requestdata);
                }).then(function(data) {
                    pixel_params = {'Registration_type':'Google'};
                    
                    var response = {};
                    response.data = data;
                    response.pixel_params = pixel_params;
                    response.google_analytics = 'Google_signup_successful';
                    response.loginType = loginType;
                    SignInView.handleOutputForLogin(response);
                }).catch(function(e) {
                    jQuery('body').addClass('page-loaded').removeClass('page-loading');
                    jQuery('body > .pageload').fadeOut();
                    jQuery('#error').text(e);
                });
            }
            if (loginType === "AMAZON") {

                getGeoLocationPromise = getGeoLocation();
                getGeoLocationPromise.then(function(data) {
                    if(data.country_code){
                        requestdata = {
                            email_id: GlobalData.amazonData.email,
                            firstname: GlobalData.amazonData.name,
                            lastname: "",//amazon does not give last name
                            account_type: "amazon",
                            name: GlobalData.amazonData.name,
                            region_code: data.country_code,
                            language_code: GlobalData.userLanguage
                        };
                        return requestdata;
                    }else{
                        return Promise.reject('Could not retrieve user country code');
                    }
                    
                }).then(function(requestdata) {
                    return UserService.userSocialAccount(requestdata);
                }).then(function(data) {
                    pixel_params = {'Registration_type':'Amazon'};
                    
                    var response = {};
                    response.data = data;
                    response.pixel_params = pixel_params;
                    response.google_analytics = 'Amazon_signup_successful';
                    response.loginType = loginType;
                    SignInView.handleOutputForLogin(response);
                }).catch(function(e) {
                    jQuery('body').addClass('page-loaded').removeClass('page-loading');
                    jQuery('body > .pageload').fadeOut();
                    jQuery('#error').text(e);
                });
            }
            
        };

        this.handleOutputForLogin = function (response) {
            GlobalData.userData = response.data.arr_data;

            if (response.data.int_status_code === 0) {
                jQuery('body').addClass('page-loaded').removeClass('page-loading');
                jQuery('body > .pageload').fadeOut();
                jQuery('#error').html(response.data.str_status_message);
                jQuery('#password').val("");
            } else {
                var loginTypecheckList = ['FACEBOOK', 'GOOGLE', 'AMAZON'];
                if(!GlobalData.userData.is_existing_customer && (jQuery.inArray(response.loginType, loginTypecheckList) !== -1)){
                    //Fb Pixel
                    GlobalData.ec.recordFBPixelEvent('track', 'CompleteRegistration', response.pixel_params);
                    //Google Analytics
                    GlobalData.ec.recordClickEvent('SignUp_view', response.google_analytics); //its SignUp_view because is_existing_customer is false
                }

                if (CookieUtils.getCookie("authToken") === "") {
                    if (jQuery('#loginCheck').is(':checked')) {
                        CookieUtils.setCookie("isRememberMe", 1, GlobalData.expireDays);
                    }
                    CookieUtils.setCookie("authToken", GlobalData.userData.customer_token, GlobalData.expireDays);
                    CookieUtils.setCookie("custId", GlobalData.userData.id, GlobalData.expireDays);
                    CookieUtils.setCookie("custName", GlobalData.userData.customer_name, GlobalData.expireDays);
                    CookieUtils.setCookie("custProfilePic", GlobalData.userData.user_picture_path, GlobalData.expireDays);
                    CookieUtils.setCookie("custEmail", GlobalData.userData.email, GlobalData.expireDays);
                    CookieUtils.setCookie("custMob", GlobalData.userData.mobile_number, GlobalData.expireDays);
                    CookieUtils.setCookie("custprimaryemail", GlobalData.userData.primaryemail, GlobalData.expireDays);
                    CookieUtils.setCookie("custsecondary_email", GlobalData.userData.secondary_email, GlobalData.expireDays);
                    CookieUtils.setCookie("is_verified", GlobalData.userData.is_verified, GlobalData.expireDays);
                    CookieUtils.setCookie("sessionKey", GlobalData.userData.session_token, GlobalData.expireDays);

                    CookieUtils.setCookie("mobile_number", GlobalData.userData.mobile_number, GlobalData.expireDays);

                    CookieUtils.setCookie("isPasswordSet", GlobalData.userData.is_password_set, GlobalData.expireDays);
                    if (response.loginType === "GOOGLE" || response.loginType === "FACEBOOK" || response.loginType === "AMAZON") {

                        CookieUtils.setCookie("is_verified", 1, GlobalData.expireDays);
                    }
                    CookieUtils.delete_cookie("usernameDeep");
                    CookieUtils.delete_cookie("sharer_nameDeep");
                    CookieUtils.delete_cookie("shareeIDDeep");
                    CookieUtils.delete_cookie("storyCoverDeep");
                    //CookieUtils.delete_cookie("ownStoryDeep");
                    CookieUtils.delete_cookie("personalizedNewUserDeep");
                    CookieUtils.delete_cookie("personalizedExistingUserDeep");
                }
                jQuery('#error').hide();
                if (CookieUtils.getCookie("usernameDeep") || CookieUtils.getCookie("custIdDeep")) {
                    var stringURL = window.location.href;
                    stringURL = stringURL.split("?");
                    window.location.href = stringURL[0] + "#/dashboard";
                }
                location.hash = '#/dashboard';
            }
        };
    });


    jQuery(window).resize(function () {
        if (jQuery(window).width() < 1025) {
            jQuery('body').css('background', '#323232');
        } else {
            jQuery('body').css('background', '#dedede');
        }
    });


    return SignInView;
});