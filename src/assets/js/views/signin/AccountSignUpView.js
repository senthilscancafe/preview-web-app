/*global define, jQuery, location, FB, window, amazon */
define(['Augment',
    'Instance',
    'PubSub',
    'GlobalData',
    'utils/StringUtils',
    'utils/CookieUtils',
    'utils/LanguageUtils',
    'services/UserService',
    'hbs!views/signin/templates/AccountSignUpView'
], function (augment, instance, PubSub, GlobalData, StringUtils, CookieUtils, LanguageUtils, UserService, tplAccountSignUpView) {

    'use strict';
    var AccountSignUpView = augment(instance, function () {
        var accountSignUp = this;
        this.mobileFlag = false;
        this.clickDisabled = false;

        this.addToDiv = function () {
            var divId = "appSignInDiv";
            var innerHtml = tplAccountSignUpView({
                label: "Please sign in with label",
                accountsignup: LanguageUtils.valueForKey("accountsignup"),
                acceptance: LanguageUtils.valueForKey("acceptance"),
                terms: LanguageUtils.valueForKey("terms"),
                privacy: LanguageUtils.valueForKey("privacy"),
                andOur: LanguageUtils.valueForKey("andOur"),
                signupUppderCase: LanguageUtils.valueForKey("signupUppderCase"),
                loginUpperCase: LanguageUtils.valueForKey("loginUpperCase"),
                alreadyhaveaccount: LanguageUtils.valueForKey("alreadyhaveaccount"),
                loginLowerCase: LanguageUtils.valueForKey("loginLowerCase"),
                signupLowerCase: LanguageUtils.valueForKey("signupLowerCase"),
                email: LanguageUtils.valueForKey("email"),
                emailaddress: LanguageUtils.valueForKey("emailaddress"),
                mobile: LanguageUtils.valueForKey("mobile"),
                confirmpassword: LanguageUtils.valueForKey("confirmpassword"),
                password: LanguageUtils.valueForKey("password"),
                baseUrl: GlobalData.baseUrl2,
                imageBase: GlobalData.imageBase
            });
            jQuery('#' + divId).empty();
            jQuery('.mainContainer').hide();
            jQuery('#' + divId).html(innerHtml);
            this.preloader();
        };
        this.preloader = function () {
            clearInterval(GlobalData.checkStatus);
            StringUtils.placeHolderCall();
            if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/Android/i))) {
                jQuery("#signUpTitle").text("Signup");
            }
            //google service initialisation.
            /*amazon login/sign up*/
            window.onAmazonLoginReady = function () {
                amazon.Login.setClientId('amzn1.application-oa2-client.a0d65aa5087f48cb98c9eef2063faae4');
            };
            PubSub.publish('LOAD_CLOUD_JS_FILES');
            document.getElementById('amazonLogin').onclick = function (event) {
                event.stopPropagation();
                //stop fast clicks
                if (AccountSignUpView.clickDisabled) {
                    return;
                }
                AccountSignUpView.clickDisabled = true;
                setTimeout(function () {
                    AccountSignUpView.clickDisabled = false;
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
                        accountSignUp.requestForSocialSignup('AMAZON');
                    });
                });
                //                return false;
            };

            GlobalData.GoogleServiceInitialisation();
            CookieUtils.deleteAllCookies();
            CookieUtils.delete_cookie("authToken");
            CookieUtils.delete_cookie("custId");
            CookieUtils.delete_cookie("is_verified");
            jQuery("#signUpEmailDiv").hide();
            jQuery("#signUpMobileDiv").hide();
            jQuery('body').addClass('page-loaded').removeClass('page-loading');
            jQuery('body > .pageload').fadeOut();
            if (jQuery(window).width() < 1025) {
                jQuery('body').css('background', '#323232');
            } else {
                jQuery('body').css('background', '#dedede');
            }
            jQuery('.telephone-input').intlTelInput({ //autoFormat: false,
                autoHideDialCode: false,
                //                defaultCountry: 'auto',
                initialCountry: 'auto',
                nationalMode: false,
                numberType: "MOBILE",
                autoPlaceholder: true,
                //onlyCountries: ['us', 'ch', 'ca', 'do'],
                preferredCountries: ['us'],
                responsiveDropdown: true,
                preventInvalidNumbers: true,
                preventInvalidDialCodes: true,
                geoIpLookup: function (callback) {
                    jQuery.get("http://ipinfo.io", function () {}, "jsonp").always(function (resp) {
                        var countryCode = (resp && resp.country) ? resp.country : "";
                        callback(countryCode);
                    });
                }
            });

            var telInput = jQuery("#mobile");
            telInput.trigger("change");
            var mobileData = telInput.intlTelInput("getSelectedCountryData");
            jQuery('.selected-flag .iti-flag').text(mobileData.iso2).css("text-transform", "uppercase");
            telInput.on("keypress", function () {
                var mobileData = jQuery("#mobile").intlTelInput("getSelectedCountryData");
                jQuery('.selected-flag .iti-flag').text(mobileData.iso2).css("text-transform", "uppercase");
            });
            jQuery('.back-arrow').click(function () {
                window.location.href = GlobalData.mainPage;
            });
            jQuery('#mobile').keypress(function () {
                jQuery(".delMob").show();
                if ((jQuery('#mobile').val()) === "") {
                    jQuery(".del").hide();
                    jQuery(".delMob").show();
                } else {
                    jQuery(".del").show();
                    jQuery(".delMob").hide();
                }
            });
            jQuery('#email').keypress(function () {
                jQuery(".delEmail").show();
                if ((jQuery('#email').val()) === "") {
                    jQuery(".del").hide();
                    jQuery(".delEmail").show();
                } else {
                    jQuery(".del").show();
                    jQuery(".delEmail").hide();
                }

            });
            jQuery('#email').focus(function () {
                jQuery(".delMob").hide();
                jQuery(".delEmail").css("display", "block");
                jQuery(".del").hide();
            });
            jQuery(".delEmail").click(function () {
                jQuery('#signUpEmailDiv').hide();
                jQuery('#signUpMobileDiv').hide();
                jQuery('#mobileAndEmailDiv').show();
            });
            jQuery(".delMob").click(function () {
                jQuery('#signUpEmailDiv').hide();
                jQuery('#signUpMobileDiv').hide();
                jQuery('#mobileAndEmailDiv').show();
            });
            jQuery('#mobile').focus(function () {
                jQuery(".delMob").show();
                jQuery(".delEmail").hide();
                jQuery(".del").hide();
            });
            jQuery("#password").focus(function () {
                jQuery(".del").hide();
            });
            jQuery(".del").on('click', function () {
                jQuery('#email, #mobile').val("");
                jQuery('#email, #mobile').focus();
            });

            jQuery("#emailTemp").focus(function () {
                jQuery('#email').focus();
            });
            jQuery("#mobileTemp").focus(function () {
                jQuery('#mobile').focus();
            });
            jQuery('#loginTop').click(function () {
                GlobalData.ec.recordClickEvent('SignUp_view', 'loginTopButtonClicked');
                location.hash = '#/login';
            });
            jQuery('#login').click(function () {
                GlobalData.ec.recordClickEvent('SignUp_view', 'loginBottomButtonClicked');
                location.hash = '#/login';
            });
            jQuery('#signupTop').click(function () {
                GlobalData.ec.recordClickEvent('SignUp_view', 'signupTopButtonClicked');
                location.hash = '#/accountsignup';
            });
            /* for signup and login side menu*/
            jQuery('#loginSide').click(function () {
                GlobalData.ec.recordClickEvent('Login_view', 'loginTopButtonClicked');
                location.hash = "/login";
            });
            jQuery('#signupSide').click(function () {
                GlobalData.ec.recordClickEvent('Login_view', 'signupTopButtonClicked');
                location.hash = '#/accountsignup';
            });
            /* for signup and login side menu*/
            jQuery('#termOfServices').click(function () {
                GlobalData.ec.recordClickEvent('SignUp_view', 'termsButtonClicked');
                location.hash = '#/termofservices';
            });
            jQuery('#policy').click(function () {
                GlobalData.ec.recordClickEvent('SignUp_view', 'policyButtonClicked');
                location.hash = '#/policy';
            });

            jQuery('#signUp').click(AccountSignUpView.requestForAccountRegistration);
            jQuery("#emailTemp").focusin(AccountSignUpView.showEmailSignUpView);
            jQuery("#mobileTemp").focusin(AccountSignUpView.showMobileSignUpView);

            jQuery("#facebookLogin").click(AccountSignUpView.requestForFBLogin);
            jQuery("#googlePlusLogin").click(AccountSignUpView.requestForGooglePlusLogin);
            jQuery('.logo-img-box').on('click', function () {
                document.location.href = GlobalData.base;
            });
            jQuery('.logo-img-box').on('click', function () {
                document.location.href = GlobalData.base;
            });
            PubSub.unsubscribe('GOOGLE_LOGGED_IN');
            PubSub.subscribe('GOOGLE_LOGGED_IN', function () {
                AccountSignUpView.requestForSocialSignup("GOOGLE");
            });
            PubSub.unsubscribe('FACEBOOK_LOGGED_IN');
            PubSub.subscribe('FACEBOOK_LOGGED_IN', function () {
                AccountSignUpView.requestForSocialSignup("FACEBOOK");
            });
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
                console.log(response);
                jQuery('#facebookLogin').removeAttr('disabled');
                GlobalData.statusChangeCallback(response);
            });
        };
        /* Google plus login*/
        this.requestForGooglePlusLogin = function (event) {
            event.stopPropagation();
            //stop fast clicks
            if (AccountSignUpView.clickDisabled) {
                return;
            }
            AccountSignUpView.clickDisabled = true;
            setTimeout(function () {
                AccountSignUpView.clickDisabled = false;
            }, 500);

            GlobalData.ec.recordClickEvent('SignUp_view', 'googleButtonClicked');
            GlobalData.onLoadCallback();
            GlobalData.GoogleServiceLogin();
        };

        /*      Redirection           */
        this.requestForFBLogin = function (event) {
            event.stopPropagation();
            //stop fast clicks
            if (AccountSignUpView.clickDisabled) {
                return;
            }
            AccountSignUpView.clickDisabled = true;
            setTimeout(function () {
                AccountSignUpView.clickDisabled = false;
            }, 500);

            GlobalData.ec.recordClickEvent('SignUp_view', 'facebookButtonClicked');
            AccountSignUpView.checkLoginState();
        };

        this.requestForAccountRegistration = function () {
            jQuery('body').addClass('page-loaded');
            jQuery('body > .pageload').fadeIn();
            GlobalData.ec.recordClickEvent('SignUp_view', 'signupButtonClicked');
            var validationFlag = AccountSignUpView.validation();
            var promise = "";
            var requestdata = '';
            var pixel_params = null;
            var getGeoLocationPromise = null;
            if (validationFlag === 1 && !accountSignUp.mobileFlag) {
                
                getGeoLocationPromise = getGeoLocation();
                getGeoLocationPromise.then(function(data) {
                    if(data.country_code){
                        requestdata = {
                            name: accountSignUp.name,
                            email: accountSignUp.email,
                            password: accountSignUp.password,
                            firstname: accountSignUp.name,
                            lastname: "",
                            apimode: 'web',
                            repassword: accountSignUp.password,
                            is_private: "1",
                            region_code: data.country_code,
                            language_code: GlobalData.userLanguage
                        };
                        return requestdata;
                    }else{
                        return Promise.reject('Could not retrieve user country code');
                    }
                    
                }).then(function(requestdata) {
	                return UserService.userRegistration(requestdata);
                }).then(function(data) {
                    pixel_params = {'Registration_type':'Email signup'};

                    var response = {};
                    response.data = data;
                    response.pixel_params = pixel_params;
                    response.google_analytics = 'Email_signup_successful';

                    AccountSignUpView.handleOutput(response);
                }).catch(function(e) {
                    jQuery('body').addClass('page-loaded').removeClass('page-loading');
                    jQuery('body > .pageload').fadeOut();
                    console.log(jQuery('#error'));
                    jQuery('#error').text(e);
                });
            } 
            else if (validationFlag === 1 && accountSignUp.mobileFlag) {
                if (jQuery("#mobile").intlTelInput("isValidNumber")) {
                    var mobileNumber = jQuery("#mobile").intlTelInput("getNumber").split("+" + jQuery("#mobile").intlTelInput("getSelectedCountryData").dialCode);

                    getGeoLocationPromise = getGeoLocation();
                    getGeoLocationPromise.then(function(data) {
                        if(data.country_code){
                            requestdata = {
                                fullname: accountSignUp.name,
                                country_code: "+" + jQuery("#mobile").intlTelInput("getSelectedCountryData").dialCode,
                                mobile_number: mobileNumber[1],
                                password: accountSignUp.password,
                                region_code: data.country_code,
                                language_code: GlobalData.userLanguage
                            };
                            return requestdata;
                        }else{
                            return Promise.reject('Could not retrieve user country code');
                        }
                        
                    }).then(function(requestdata) {
                        return UserService.userMobileSignUp(requestdata);
                    }).then(function(data) {
                        pixel_params = {'Registration_type':'Mobile signup'};

                        var response = {};
                        response.data = data;
                        response.pixel_params = pixel_params;
                        response.google_analytics = 'Mobile_signup_successful';

                        AccountSignUpView.handleOutput(response);
                    }).catch(function(e) {
                        jQuery('body').addClass('page-loaded').removeClass('page-loading');
                        jQuery('body > .pageload').fadeOut();
                        console.log(jQuery('#error'));
                        jQuery('#error').text(e);
                    });
                } 
                else {
                    validationFlag = 0;
                    jQuery('body').addClass('page-loaded').removeClass('page-loading');
                    jQuery('body > .pageload').fadeOut();
                    jQuery('#error').text("Mobile number is invalid");
                    jQuery('#mobile').focus();
                }
            }
        };

        this.handleOutput = function (response){
            if (response.data.int_status_code === 0) {
                jQuery('#error').text(response.data.str_status_message);
                jQuery('body').addClass('page-loaded').removeClass('page-loading');
                jQuery('body > .pageload').fadeOut();
            } else {
                //Fb Pixel
                GlobalData.ec.recordFBPixelEvent('track', 'CompleteRegistration', response.pixel_params);

                //Google Analytics
                GlobalData.ec.recordClickEvent('SignUp_view', response.google_analytics);

                GlobalData.sessionToken = response.data.arr_data.session_token;
                GlobalData.userData = response.data.arr_data;
                if (CookieUtils.getCookie("authToken") === "") {
                    CookieUtils.setCookie("authToken", GlobalData.userData.customer_token, GlobalData.expireDays);
                    CookieUtils.setCookie("custId", GlobalData.userData.id, GlobalData.expireDays);
                    CookieUtils.setCookie("mobile_number", GlobalData.userData.mobile_number, GlobalData.expireDays);
                    CookieUtils.setCookie("is_verified", GlobalData.userData.is_verified, GlobalData.expireDays);
                    CookieUtils.setCookie("custEmail", GlobalData.userData.email, GlobalData.expireDays);
                    CookieUtils.setCookie("custprimaryemail", GlobalData.userData.primaryemail, GlobalData.expireDays);
                    CookieUtils.setCookie("custsecondary_email", GlobalData.userData.secondary_email, GlobalData.expireDays);
                    CookieUtils.setCookie("sessionKey", GlobalData.userData.session_token, GlobalData.expireDays);
                }
                location.hash = '#/dashboard';
                //jQuery('body').addClass('page-loaded').removeClass('page-loading');
                //jQuery('body > .pageload').fadeOut();
            }
        };

        this.requestForSocialSignup = function (loginType) {
            jQuery('body').addClass('page-loaded');
            jQuery('body > .pageload').fadeIn();
            var promise = "";
            var requestdata = "";
            var pixel_params = null;
            var getGeoLocationPromise = null;

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
                    AccountSignUpView.handleOutputForSocialSignup(response);
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
                            firstname: GlobalData.googleData.name.givenName,
                            lastname: GlobalData.googleData.name.familyName,
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
                    AccountSignUpView.handleOutputForSocialSignup(response);
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
                    AccountSignUpView.handleOutputForSocialSignup(response);
                }).catch(function(e) {
                    jQuery('body').addClass('page-loaded').removeClass('page-loading');
                    jQuery('body > .pageload').fadeOut();
                    jQuery('#error').text(e);
                });
            }
        };

        this.handleOutputForSocialSignup = function (response) {
            //console.dir(response);
            GlobalData.userData = response.data.arr_data;
            if (response.data.int_status_code === 0) {
                    jQuery('body').addClass('page-loaded').removeClass('page-loading');
                    jQuery('body > .pageload').fadeOut();
                    jQuery('#error').text(response.data.str_status_message);
                    jQuery('#passowrd').val("");
            } else {
                var loginTypecheckList = ['FACEBOOK', 'GOOGLE', 'AMAZON'];
                if(!GlobalData.userData.is_existing_customer && (jQuery.inArray(response.loginType, loginTypecheckList) !== -1)){
                    //Fb Pixel
                    GlobalData.ec.recordFBPixelEvent('track', 'CompleteRegistration', response.pixel_params);
                    //Google Analytics
                    GlobalData.ec.recordClickEvent('SignUp_view', response.google_analytics); //its SignUp_view because is_existing_customer is false

                }
                

                jQuery('#error').hide();
                if (CookieUtils.getCookie("authToken") === "") {
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
                    CookieUtils.setCookie("isPasswordSet", GlobalData.userData.is_password_set, GlobalData.expireDays);
                    if (response.loginType === "GOOGLE" || response.loginType === "FACEBOOK" || response.loginType === "AMAZON") {

                        CookieUtils.setCookie("is_verified", 1, GlobalData.expireDays);
                    }
                }
                location.hash = '#/dashboard';
                //jQuery('body').addClass('page-loaded').removeClass('page-loading');
                //jQuery('body > .pageload').fadeOut();
            }
        };

        this.validation = function () {
            jQuery('body').addClass('page-loaded').removeClass('page-loading');
            jQuery('body > .pageload').fadeOut();
            accountSignUp.name = jQuery('#name').val();
            accountSignUp.email = jQuery('#email').val();
            accountSignUp.mobile = jQuery('#mobile').val();
            accountSignUp.password = jQuery('#password').val();
            accountSignUp.confirmPassword = jQuery('#confirmPassword').val();
            var emailfilter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            var mobileNumberWithCountryCode = jQuery('#mobile').val().split(/ (.*)/);
            var mob_number = "";
            if (mobileNumberWithCountryCode.length > 1) {
                mob_number = mobileNumberWithCountryCode[1].replace(/[- +]/ig, "");
            }
            var validationFlag = 1;
            if (accountSignUp.name === "") {
                validationFlag = 0;
                jQuery('#error').text("Name is empty");
                jQuery('#name').focus();
            } else if (accountSignUp.email === "" && !accountSignUp.mobileFlag) {
                validationFlag = 0;
                jQuery('#error').text("Email is empty");
                jQuery('#email').focus();
            } else if (!emailfilter.test(accountSignUp.email) && !accountSignUp.mobileFlag) {
                validationFlag = 0;
                jQuery('#error').text("Email is invalid");
                jQuery('#email').focus();
            } else if (mob_number.length <= 7 && accountSignUp.email === "") {
                validationFlag = 0;
                jQuery('#error').text("Mobile Number is invalid");
                jQuery('#mobile').focus();
            } else if (accountSignUp.password === "") {
                validationFlag = 0;
                jQuery('#error').text("Password is empty");
                jQuery('#password').focus();
            } else if (accountSignUp.password.length < 6) {
                validationFlag = 0;
                jQuery('#error').text("Password length should be greater than 6");
                jQuery('#password').val('');
                jQuery('#confirmPassword').val('');
                jQuery('#password').focus();
            } else if (accountSignUp.password.length > 10) {
                validationFlag = 0;
                jQuery('#error').text("Password length should be less than 10");
                jQuery('#password').focus();
                jQuery('#password').val('');
                jQuery('#confirmPassword').val('');
            } else if (accountSignUp.confirmPassword === "") {
                validationFlag = 0;
                jQuery('#error').text("Confirm password is empty");
                jQuery('#confirmPassword').focus();
            } else if (accountSignUp.password !== accountSignUp.confirmPassword) {
                validationFlag = 0;
                jQuery('#error').text("Please enter the same password as above");
                jQuery('#confirmPassword').focus();
                jQuery('#confirmPassword').val('');
            }
            return validationFlag;
        };

        this.showEmailSignUpView = function () {
            jQuery('#mobileAndEmailDiv').hide();
            jQuery('#signUpEmailDiv').show();
            jQuery('#signUpTitle').text("Email Signup");
            accountSignUp.mobileFlag = false;
        };
        this.showMobileSignUpView = function () {
            jQuery('#mobileAndEmailDiv').hide();
            jQuery('#signUpMobileDiv').show();
            jQuery("#mobile").focus(function () {
                if (this.setSelectionRange) {
                    var len = jQuery(this).val().length;
                    this.setSelectionRange(len, len);
                } else {
                    jQuery(this).val(jQuery(this).val());
                }

            });

            jQuery("#mobile").focus();
            jQuery('#signUpTitle').text("Mobile Signup");
            accountSignUp.mobileFlag = true;

        };

    });
    jQuery(window).resize(function () {
        if (jQuery(window).width() < 1025) {
            jQuery('body').css('background', '#323232');
        } else {
            jQuery('body').css('background', '#dedede');
        }
    });

    return AccountSignUpView;
});