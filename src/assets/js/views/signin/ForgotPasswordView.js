/*global define, jQuery, location*/
define(['Augment',
    'Instance',
    'GlobalData',
    'utils/LanguageUtils',
    'utils/StringUtils',
    'services/UserService',
    'hbs!views/signin/templates/ForgotPasswordView'
], function (augment, instance, GlobalData, LanguageUtils, StringUtils, UserService, tplForgotPasswordView) {

    'use strict';

    var ForgotPasswordView = augment(instance, function () {

        this.addToDiv = function () {
            var divId = "appSignInDiv";
            var innerHtml = tplForgotPasswordView({
                forgotyourpassword: LanguageUtils.valueForKey("forgotyourpassword"),
                forgotpasswordInstuctions: LanguageUtils.valueForKey("forgotpasswordInstuctions"),
                resetpassword: LanguageUtils.valueForKey("resetpassword"),
                loginLowerCase: LanguageUtils.valueForKey("loginLowerCase"),
                signupLowerCase: LanguageUtils.valueForKey("signupLowerCase"),
                emailormobile: LanguageUtils.valueForKey("emailormobile"),
                imageBase: GlobalData.imageBase
            });
            jQuery('#' + divId).empty();
            jQuery('.mainContainer').removeClass('app');
            jQuery('.mainContainer').empty();
            jQuery('#' + divId).html(innerHtml);
            this.preloader();

        };
        this.preloader = function () {
            StringUtils.placeHolderCall();
            jQuery('body').addClass('page-loaded').removeClass('page-loading');
            jQuery('body > .pageload').fadeOut();
            jQuery('#resetPassword').click(ForgotPasswordView.checkEmailOrMobile);
            jQuery('#signupTop').click(function () {
                GlobalData.ec.recordClickEvent('ForgotPassword_view', 'signupTopButtonClicked');
                location.hash = '#/accountsignup';
            });
            jQuery('#loginTop').click(function () {
                GlobalData.ec.recordClickEvent('ForgotPassword_view', 'loginTopButtonClicked');
                location.hash = "/login";
            });
            jQuery('.logo-img-box').on('click', function () {
                document.location.href = GlobalData.base;
            });
        };
        this.checkEmailOrMobile = function () {
            GlobalData.ec.recordClickEvent('ForgotPassword_view', 'ResetPasswordButtonClicked');
            var testresults;
            var isEmail = 0;
            var mobile = 0;

            function checkemail() {
                var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                if (filter.test(jQuery('#email').val())) {
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
            var test = isValidPhonenumber(jQuery('#email').val());
            var emailAndMobile = jQuery('#email').val();
            if (test) {

            }
            if (isEmail === 1) {
                ForgotPasswordView.requestForPassword("EMAIL");
            }
            if (mobile) {
                ForgotPasswordView.requestForPassword("MOBILE");
            }
            if (mobile === false && isEmail === 0) {
                var items = emailAndMobile.trim();
                var phonenoFilter = /^[0-9_+-]*$/;
                if (phonenoFilter.test(items)) {
                    jQuery('#error').text(LanguageUtils.valueForKey("invalidMobile"));
                } else {
                    jQuery('#error').text(LanguageUtils.valueForKey("invalidEmail"));
                }


                if (emailAndMobile.length === 0) {
                    jQuery('#error').text("Please Enter Email Address or Mobile Number");
                }
            }

        };

        this.requestForPassword = function () {
            jQuery('body').addClass('page-loaded');
            jQuery('body > .pageload').fadeIn();
            var requestData = jQuery('#email').val();
            var promise = UserService.userForgotPassowrd(requestData);
            promise.then(function (data) {
                jQuery('body').addClass('page-loaded').removeClass('page-loading');
                jQuery('body > .pageload').fadeOut();
                if (data.int_status_code === 0) {
                    jQuery('body').addClass('page-loaded').removeClass('page-loading');
                    jQuery('body > .pageload').fadeOut();
                    jQuery('.messages').html(data.str_status_message);
                    jQuery('#email').val("");
                } else {
                    jQuery('#error').hide();
                    jQuery('.messages').text(data.arr_data.msg);
                    jQuery('#email').val("");
                }
            }).fail(function () {

            });
        };
    });

    return ForgotPasswordView;
});