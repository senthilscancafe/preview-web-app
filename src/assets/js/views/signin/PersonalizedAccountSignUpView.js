/*global define, jQuery, location, FB, window, amazon*/
define(['Augment',
    'Instance',
    'GlobalData',
    'PubSub',
    'utils/StringUtils',
    'utils/CookieUtils',
    'services/UserService',
    'hbs!views/signin/templates/PersonalizedAccountSignUpView'
], function (augment, instance, GlobalData, PubSub, StringUtils, CookieUtils, UserService, tplPersonalizedAccountSignUpView) {

    'use strict';

    var PersonalizedAccountSignUpView = augment(instance, function () {
        var personalizedAccountSignUp = this;
        personalizedAccountSignUp.branchData = "";
        var code = "";
        var isoCode = "US";
        if ((CookieUtils.getCookie("country_codeDeep").length) < 4) {
            code = CookieUtils.getCookie("country_codeDeep");
            var countryData = jQuery.fn.intlTelInput.getCountryData();
            for (var i = 0; i < countryData.length; i++) {
                if (countryData[i].dialCode === code) {
                    isoCode = countryData[i].iso2;
                    break;
                }
            }
        }

        this.addToDiv = function () {
            clearInterval(GlobalData.checkStatus);
            PersonalizedAccountSignUpView.branch();
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
                        PersonalizedAccountSignUpView.requestForLogin('AMAZON');
                    });
                });

                //                return false;
            };
            StringUtils.placeHolderCall();
            jQuery('body').addClass('page-loaded').removeClass('page-loading');
            jQuery('body > .pageload').fadeOut();
            var telInput, mobileData;
            if (CookieUtils.getCookie("publicShare")) {
                jQuery('.telephone-input').intlTelInput({
                    nationalMode: false,
                    numberType: "MOBILE",
                    autoPlaceholder: true,
                    responsiveDropdown: true,
                    preventInvalidNumbers: true,
                    preventInvalidDialCodes: true
                });

                telInput = jQuery("#personalizedPhone");
                telInput.trigger("change");
                mobileData = telInput.intlTelInput("getSelectedCountryData");
                jQuery('.selected-flag .iti-flag').text(mobileData.iso2).css("text-transform", "uppercase");
                telInput.on("change", function () {
                    var mobileData = jQuery("#personalizedPhone").intlTelInput("getSelectedCountryData");
                    jQuery('.selected-flag .iti-flag').text(mobileData.iso2).css("text-transform", "uppercase");
                });
            } else {

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

                var telInput = jQuery("#personalizedPhone");
                telInput.trigger("change");
                var mobileData = telInput.intlTelInput("getSelectedCountryData");
                jQuery('.selected-flag .iti-flag').text(mobileData.iso2).css("text-transform", "uppercase");
                telInput.on("keypress", function () {
                    var mobileData = jQuery("#personalizedPhone").intlTelInput("getSelectedCountryData");
                    jQuery('.selected-flag .iti-flag').text(mobileData.iso2).css("text-transform", "uppercase");
                });
            }


            jQuery('.personalizedLogin').click(PersonalizedAccountSignUpView.showLogin);
            jQuery('#termOfServices').click(PersonalizedAccountSignUpView.showTermOfServices);
            jQuery('#policy').click(PersonalizedAccountSignUpView.showPolicy);
            jQuery('#emailTemp').focus(PersonalizedAccountSignUpView.emailFocus);
            jQuery('#mobileTemp').focus(PersonalizedAccountSignUpView.phoneFocus);
            jQuery('#termOfServices').click(PersonalizedAccountSignUpView.showTermOfServices);
            jQuery('#policy').click(PersonalizedAccountSignUpView.showPolicy);
            jQuery("#emailTemp").focusin(PersonalizedAccountSignUpView.showEmailSignUpView);
            jQuery("#mobileTemp").focusin(PersonalizedAccountSignUpView.showMobileSignUpView);
            jQuery('#personalizedSubmit').click(PersonalizedAccountSignUpView.requestForAccountRegistration);

            jQuery('#personalizedEmail').focus(function () {
                jQuery(".delMob").hide();
                jQuery(".delEmail").css("display", "block");
                jQuery(".del").hide();
            });
            jQuery(".delEmail").click(function () {
                jQuery('#signUpEmailDiv').hide();
                jQuery('#signUpMobileDiv').hide();
                jQuery('#mobileAndEmailDiv, #orDiv').show();
            });
            jQuery(".delMob").click(function () {
                jQuery('#signUpEmailDiv').hide();
                jQuery('#signUpMobileDiv').hide();
                jQuery('#mobileAndEmailDiv').show();
            });
            jQuery('#personalizedPhone').focus(function () {
                jQuery(".delMob").show();
                jQuery(".delEmail").hide();
                jQuery(".del").hide();
            });
            jQuery('#personalizedPhone').keypress(function () {
                jQuery(".delMob").show();
                if ((jQuery('#personalizedPhone').val()) === "") {
                    jQuery(".del").hide();
                    jQuery(".delMob").show();
                } else {
                    jQuery(".del").show();
                    jQuery(".delMob").hide();
                }
            });
            jQuery('#personalizedEmail').keypress(function () {
                jQuery(".delEmail").show();
                if ((jQuery('#personalizedEmail').val()) === "") {
                    jQuery(".del").hide();
                    jQuery(".delEmail").show();
                } else {
                    jQuery(".del").show();
                    jQuery(".delEmail").hide();
                }

            });
            jQuery(".del").on('click', function () {
                jQuery('#personalizedEmail, #personalizedPhone').val("");
                jQuery('#personalizedEmail, #personalizedPhone').focus();
            });
            jQuery("#emailTemp").focus(function () {
                jQuery('#personalizedEmail').focus();
            });
            jQuery("#mobileTemp").focus(function () {
                jQuery('#personalizedPhone').focus();
            });
            jQuery('.logo-img-box').on('click', function () {
                document.location.href = GlobalData.base;
            });
        };


        this.emailFocus = function () {
            if (CookieUtils.getCookie('image_contribution_token')) {
                $('#personalizedEmail').prop("disabled", false);
            }
            //            jQuery('#personalizedEmail').parent().addClass("col-xs-12").removeClass("col-xs-5");
            //            jQuery('#personalizedPhone').parent().hide();
            //            jQuery('#orDiv').hide();
        };
        this.phoneFocus = function () {
            //            jQuery('#personalizedPhone').parent().parent().addClass("col-xs-12").removeClass("col-xs-6").css({
            //                'padding-left': '0',
            //                'padding-bottom': '20px'
            //            });
            //            jQuery('#personalizedEmail').parent().hide();
            //            jQuery('#orDiv').hide();
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
                innerHtml = tplPersonalizedAccountSignUpView({
                    label: "Please sign in with label",
                    sharer: CookieUtils.getCookie("story_owner_name"),
                    storyName: CookieUtils.getCookie("story_cover_caption"),
                    sharerText: shareText,
                    signInText: 'Sign up to continue.',
                    storyCover: profilePic,
                    imageBase: GlobalData.imageBase
                });
            } else {
                innerHtml = tplPersonalizedAccountSignUpView({
                    label: "Please sign in with label",
                    sharer: CookieUtils.getCookie("sharer_nameDeep"),
                    sharerText: ' has built their stunning photo story here, you can too!',
                    storyCover: CookieUtils.getCookie("storyCoverDeep"),
                    imageBase: GlobalData.imageBase
                });
            }
            jQuery('#' + divId).empty();
            jQuery('#SideBarDiv,#NavBarDiv,#dashbaordUIView,#verifyScrModal,#shareScreenModal,#infoScreenModal,#dashbaordUIView').empty();
            jQuery('.mainContainer').hide();
            //            jQuery('.mainContainer').removeClass('app');
            //            jQuery('.mainContainer').empty();
            jQuery('#' + divId).html(innerHtml);
            personalizedAccountSignUp.preloader();
            console.log(CookieUtils.getCookie('image_contribution_token'));


            if (CookieUtils.getCookie("publicShare")) {
                CookieUtils.setCookie("usernameDeep", "", GlobalData.expireDays);
                jQuery("#personalizedEmail, #personalizedPhone").removeAttr("disabled");
                jQuery(".btn-google,.btn-facebook,.btn-amazon").off().css({
                    "opacity": "1",
                    "cursor": "pointer"
                });
                jQuery('#signUpEmailDiv, #signUpMobileDiv').hide();
            } else {
                jQuery(".btn-google,.btn-facebook,.btn-amazon").off().css({
                    "opacity": "1",
                    "cursor": "pointer"
                });
                jQuery('#signUpEmailDiv, #signUpMobileDiv').show();
                jQuery('#mobileAndEmailDiv').hide();
                jQuery('#signUpEmailDiv').show();
                jQuery('#personalizedEmail').attr("disabled", "disabled");
                jQuery('#signUpMobileDiv').hide();
                if (CookieUtils.getCookie("event_type") === "story_image_contribution_copy_link") {
                    jQuery('#mobileAndEmailDiv').show();
                    jQuery('#signUpEmailDiv').hide();
                    jQuery('#signUpMobileDiv').hide();
                    jQuery('.personalized img').css({
                        'border-radius': '50%',
                        'margin-top': '5px',
                        'width': '90px'
                    });
                } else if (CookieUtils.getCookie("login_typeDeep") === "email") {
                    personalizedAccountSignUp.mobileFlag = false;
                    jQuery('#personalizedEmail').val(CookieUtils.getCookie("usernameDeep"));
                } else {
                    jQuery('#mobileAndEmailDiv').hide();
                    jQuery('#signUpEmailDiv').hide();
                    jQuery('#signUpMobileDiv').show();
                    personalizedAccountSignUp.mobileFlag = true;
                    var mob = CookieUtils.getCookie("usernameDeep");

                    var phoneNumber = "+" + code + " " + mob;
                    jQuery('#personalizedPhone').val(phoneNumber);
                }
            }
            jQuery("#facebookLogin").click(personalizedAccountSignUp.requestForFBLogin);
            jQuery("#googlePlusLoginAcSignUp").click(personalizedAccountSignUp.requestForGooglePlusLogin);
            PubSub.subscribe('GOOGLE_LOGGED_IN', function () {
                personalizedAccountSignUp.requestForLogin("GOOGLE");
            });
            PubSub.subscribe('FACEBOOK_LOGGED_IN', function () {
                personalizedAccountSignUp.requestForLogin("FACEBOOK");
            });

        };
        this.showLogin = function () {
            location.hash = '#/personalizedaccountlogin';
        };
        this.showTermOfServices = function () {
            location.hash = '#/termofservices';
        };
        this.showPolicy = function () {
            location.hash = '#/policy';
        };
        this.requestForGooglePlusLogin = function () {
            GlobalData.onLoadCallback();
            GlobalData.GoogleServiceLogin();
        };
        this.requestForFBLogin = function () {
            personalizedAccountSignUp.checkLoginState();
        };
        this.checkLoginState = function () {
            FB.getLoginStatus(function (response) {
                jQuery('#facebookLogin').removeAttr('disabled');
                GlobalData.statusChangeCallback(response);
            });
        };
        this.requestForLogin = function (loginType) {
            jQuery('body').addClass('page-loaded');
            jQuery('body > .pageload').fadeIn();
            var promise = "";
            var requestData = "";
            if (loginType === 'EMAIL') {
                requestData = {
                    email: jQuery('#emailOrMobile').val(),
                    password: jQuery('#password').val(),
                    is_private: 0
                };
                promise = UserService.userLogin(requestData);
            }
            if (loginType === 'MOBILE') {
                requestData = {
                    mobile_number: jQuery('#emailOrMobile').val(),
                    password: jQuery('#password').val(),
                    expiryhours: "24",
                    is_private: 0
                };
                promise = UserService.userMobileLogin(requestData);
            }
            if (loginType === "FACEBOOK") {
                requestData = {
                    email_id: GlobalData.facebookData.email,
                    firstname: GlobalData.facebookData.first_name,
                    lastname: GlobalData.facebookData.last_name,
                    account_type: "facebook",
                    is_private: 0
                };
                promise = UserService.userSocialLogin(requestData);
            }
            if (loginType === "GOOGLE") {
                requestData = {
                    email_id: GlobalData.googleData.emails[0].value,
                    firstname: GlobalData.googleData.displayName,
                    lastname: GlobalData.googleData.displayName,
                    account_type: "google",
                    is_private: 0
                };
                promise = UserService.userSocialLogin(requestData);
            }
            if (loginType === "AMAZON") {
                requestData = {
                    email_id: GlobalData.amazonData.email,
                    firstname: GlobalData.amazonData.name,
                    lastname: "",
                    account_type: "amazon",
                    is_private: 0
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
        this.requestForAccountRegistration = function () {
            var validationFlag = PersonalizedAccountSignUpView.validation();
            var promise = "";
            var apiRequestFlag = 0;
            var requestdata = '';
            if (validationFlag === 1 && !personalizedAccountSignUp.mobileFlag) {
                requestdata = {
                    firstname: personalizedAccountSignUp.name,
                    lastname: "",
                    email: personalizedAccountSignUp.email,
                    password: personalizedAccountSignUp.password,
                    repassword: personalizedAccountSignUp.password,
                    apimode: 'web',
                    is_private: 0,
                    name: personalizedAccountSignUp.name
                };
                apiRequestFlag = 1;
                promise = UserService.userRegistration(requestdata);
            } else if (validationFlag === 1 && personalizedAccountSignUp.mobileFlag) {
                if (jQuery("#personalizedPhone").intlTelInput("isValidNumber")) {
                    var mobileNumber = jQuery("#personalizedPhone").intlTelInput("getNumber").split("+" + jQuery("#personalizedPhone").intlTelInput("getSelectedCountryData").dialCode);
                    requestdata = {
                        fullname: personalizedAccountSignUp.name,
                        country_code: "+" + jQuery("#personalizedPhone").intlTelInput("getSelectedCountryData").dialCode,
                        mobile_number: mobileNumber[1],
                        password: personalizedAccountSignUp.password,
                        is_private: 0
                    };
                    apiRequestFlag = 1;
                    promise = UserService.userMobileSignUp(requestdata);

                } else {
                    validationFlag = 0;
                    jQuery('body').addClass('page-loaded').removeClass('page-loading');
                    jQuery('body > .pageload').fadeOut();
                    jQuery('#error').text("Mobile number is invalid");
                    jQuery('#personalizedPhone').focus();
                }

            }
            if (apiRequestFlag === 1) {
                jQuery('body').addClass('page-loaded');
                jQuery('body > .pageload').fadeIn();
                promise.then(function (data) {
                    if (data.int_status_code === 0) {
                        jQuery('#error').text(data.str_status_message);
                        jQuery('body').addClass('page-loaded').removeClass('page-loading');
                        jQuery('body > .pageload').fadeOut();
                    } else {
                        GlobalData.userData = data.arr_data;
                        GlobalData.sessionToken = data.arr_data.session_token;
                        CookieUtils.setCookie("custMob", GlobalData.userData.mobile_number, GlobalData.expireDays);
                        CookieUtils.setCookie("custprimaryemail", GlobalData.userData.primaryemail, GlobalData.expireDays);
                        CookieUtils.setCookie("custsecondary_email", GlobalData.userData.secondary_email, GlobalData.expireDays);
                        CookieUtils.setCookie("is_verified", GlobalData.userData.is_verified, GlobalData.expireDays);
                        CookieUtils.setCookie("sessionKey", GlobalData.userData.session_token, GlobalData.expireDays);
                        if (CookieUtils.getCookie("authToken") === "") {
                            CookieUtils.setCookie("authToken", GlobalData.userData.customer_token, GlobalData.expireDays);
                            CookieUtils.setCookie("custId", GlobalData.userData.id, GlobalData.expireDays);
                            CookieUtils.setCookie("is_verified", GlobalData.userData.is_verified, GlobalData.expireDays);
                        }
                        if (CookieUtils.getCookie('publicShare')) {
                            window.location.hash = '#/dashboard';
                            jQuery('.mainContainer').addClass('app');
                            //                        window.location.hash = 
                        } else {
                            var stringURL = window.location.href;
                            stringURL = stringURL.split("?");
                            window.location.href = stringURL[0] + "#/dashboard";
                        }
                        jQuery('body').addClass('page-loaded').removeClass('page-loading');
                        jQuery('body > .pageload').fadeOut();
                    }

                }).fail(function (data) {
                    jQuery('body').addClass('page-loaded').removeClass('page-loading');
                    jQuery('body > .pageload').fadeOut();
                    jQuery('#error').text(data.str_status_message);
                });
            }

        };
        this.validation = function () {
            jQuery('body').addClass('page-loaded').removeClass('page-loading');
            jQuery('body > .pageload').fadeOut();
            personalizedAccountSignUp.name = jQuery('#personalizedName').val();
            personalizedAccountSignUp.email = jQuery('#personalizedEmail').val();
            personalizedAccountSignUp.mobile = jQuery('#personalizedPhone').val();
            personalizedAccountSignUp.password = jQuery('#personalizedPass').val();
            personalizedAccountSignUp.confirmPassword = jQuery('#personalizedConfirmPass').val();
            var emailfilter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            var mobileNumberWithCountryCode;
            if (jQuery('#personalizedPhone').val() === "" || jQuery('#personalizedPhone').val() === undefined) {
                mobileNumberWithCountryCode = "";
            } else {
                mobileNumberWithCountryCode = jQuery('#personalizedPhone').val().split(/ (.*)/);
            }
            var mob_number = "";
            if (mobileNumberWithCountryCode.length > 1) {
                mob_number = mobileNumberWithCountryCode[1].replace(/[- +]/ig, "");
            }
            var validationFlag = 1;
            if (personalizedAccountSignUp.name === "") {
                validationFlag = 0;
                jQuery('#error').text("Name is empty");
                jQuery('#name').focus();
            } else if (personalizedAccountSignUp.email === "" && !personalizedAccountSignUp.mobileFlag && (jQuery('#personalizedPhone').val() === "")) {
                validationFlag = 0;
                jQuery('#error').text("Email is empty");
                jQuery('#personalizedEmail').focus();
            } else if (!emailfilter.test(personalizedAccountSignUp.email) && !personalizedAccountSignUp.mobileFlag && (jQuery('#personalizedPhone').val() === "")) {
                validationFlag = 0;
                jQuery('#error').text("Email is invalid");
                jQuery('#personalizedEmail').focus();
            } else if (mob_number.length <= 7 && personalizedAccountSignUp.email === "") {
                validationFlag = 0;
                jQuery('#error').text("Mobile Number is invalid");
                jQuery('#personalizedPhone').focus();
            } else if (personalizedAccountSignUp.password === "") {
                validationFlag = 0;
                jQuery('#error').text("Password is empty");
                jQuery('#password').focus();
            } else if (personalizedAccountSignUp.password.length < 6) {
                validationFlag = 0;
                jQuery('#error').text("Password length should be greater than 6");
                jQuery('#password').val('');
                jQuery('#confirmPassword').val('');
                jQuery('#password').focus();
            } else if (personalizedAccountSignUp.password.length > 10) {
                validationFlag = 0;
                jQuery('#error').text("Password length should be less than 10");
                jQuery('#password').focus();
                jQuery('#password').val('');
                jQuery('#confirmPassword').val('');
            } else if (personalizedAccountSignUp.confirmPassword === "") {
                validationFlag = 0;
                jQuery('#error').text("Confirm password is empty");
                jQuery('#confirmPassword').focus();
            } else if (personalizedAccountSignUp.password !== personalizedAccountSignUp.confirmPassword) {
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
            personalizedAccountSignUp.mobileFlag = false;

        };
        this.showMobileSignUpView = function () {
            jQuery('#mobileAndEmailDiv').hide();
            jQuery('#signUpMobileDiv').show();
            jQuery('#signUpTitle').text("Mobile Signup");
            personalizedAccountSignUp.mobileFlag = true;

        };
        this.showTermOfServices = function () {
            location.hash = '#/termofservices';
        };
        this.showPolicy = function () {
            location.hash = '#/policy';
        };
    });

    return PersonalizedAccountSignUpView;
});