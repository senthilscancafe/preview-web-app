/*global define, jQuery*/
define(['Augment',
    'Instance',
    'GlobalData',
    'services/UserService',
    'utils/StringUtils',
    'utils/LanguageUtils',
    'views/errorMessage/ErrorMessage',
    'hbs!views/signin/templates/ChangePasswordView'
], function (augment, instance, GlobalData,UserService, StringUtils, LanguageUtils, ErrorMessage, tplChangePasswordView) {

    'use strict';

    var ChangePasswordView = augment(instance, function () {
        this.init = function () {
            jQuery(window).resize(function () {
                ChangePasswordView.errorMiddle();
            });
        };
        var changePassword = this;
        this.addToDiv = function () {
            var divId = "appSignInDiv";
            var innerHtml = tplChangePasswordView({
                loginLowerCase: LanguageUtils.valueForKey("loginLowerCase"),
                signupLowerCase: LanguageUtils.valueForKey("signupLowerCase"),
                confirmpassword: LanguageUtils.valueForKey("confirmpassword"),
                newpassword: LanguageUtils.valueForKey("newpassword"),
                changepassword: LanguageUtils.valueForKey("changepassword"),
                changeyourpassword: LanguageUtils.valueForKey("changeyourpassword"),
                passwordchanged: LanguageUtils.valueForKey("passwordchanged"),
                imageBase:GlobalData.imageBase
            });
            jQuery('#' + divId).empty();
            jQuery('.mainContainer').removeClass('app');
            jQuery('.mainContainer').empty();
            jQuery('#' + divId).html(innerHtml);
            this.preloader();
            jQuery('#changePass').click(ChangePasswordView.requestforchangepassword);
            

        };
        this.preloader = function () {
            jQuery('body').addClass('page-loaded').removeClass('page-loading');
            jQuery('body > .pageload').fadeOut();
             jQuery('.logo-img-box').on('click', function () {                
                document.location.href = GlobalData.base;
            });

        };
        this.requestforchangepassword = function () {
            var validationFlag = ChangePasswordView.validation();
            if (validationFlag === 1) {
                var tokenString = window.location.hash;
                var newToken = tokenString.split("/").pop();
                var requestdata = {
                    newPassword: changePassword.newPassword,
                    confirmPassword: changePassword.confirmPassword,
                    token: newToken
                };
                var promise = UserService.resetPassword(requestdata);
                promise.then(function (data) {
                    if (data.int_status_code === 0) {
                        jQuery('#passowd-error').show().text(data.str_status_message);
                    } else {
                        var errorMessage = ErrorMessage.create();
                        errorMessage.addToDiv();
                        jQuery('#messageModal.errorMessageModal').modal('show');
                        jQuery('#messageModal.errorMessageModal p').text(LanguageUtils.valueForKey('passwordchanged'));
                        jQuery('#messageModal.errorMessageModal button').click(function () {
                            location.hash = "/login";
                        });
                        ChangePasswordView.errorMiddle();
                    }
                }).fail(function (data) {
                    jQuery('#passowd-error').show().text(data.str_status_message);
                });
            }
        };
        this.validation = function () {
            changePassword.newPassword = jQuery('#newPass').val();
            changePassword.confirmPassword = jQuery('#confirmPass').val();
            var validationFlag = 1;
            if (changePassword.newPassword === "") {
                validationFlag = 0;
                jQuery('#passowd-error').show().text("Password is empty");
                jQuery('#changePassword.newPassword').focus();
            } else if (changePassword.newPassword.length < 6) {
                validationFlag = 0;
                jQuery('#passowd-error').show().text("Password length should be greater than 6");
                jQuery('#passowrd').focus();
            } else if (changePassword.newPassword.length > 10) {
                validationFlag = 0;
                jQuery('#passowd-error').show().text("Password length should be less than 10");
                jQuery('#passowrd').focus();
            } else if (changePassword.confirmPassword === "") {
                validationFlag = 0;
                jQuery('#passowd-error').show().text("Confirm password is empty");
                jQuery('#confirmPassword').focus();
            } else if (changePassword.newPassword !== changePassword.confirmPassword) {
                validationFlag = 0;
                jQuery('#passowd-error').show().text("Please enter the same password as above");
                jQuery('#changePassword.confirmPassword').focus();
            }
            return validationFlag;
        };
        this.errorMiddle = function () {
            var msgContent = ((jQuery(window).height()) - (181)) / 2;
            jQuery('#messageModal.errorMessageModal .modal-dialog').css('margin-top', msgContent + 'px');
        };
    });

    return ChangePasswordView;
});