/*global define, jQuery */

define(['Augment',
    'Instance',
    'PubSub',
    'GlobalData',
    'utils/CookieUtils',
    'services/UserService',
    'utils/LanguageUtils',
    'hbs!views/changePasswordInner/templates/ChangePasswordInnerView'
], function (augment, instance, PubSub, GlobalData, CookieUtils, UserService, LanguageUtils, tplChangePasswordInnerView) {

    'use strict';

    var ChangePasswordInnerView = augment(instance, function () {
        var changePassword = this;
        this.addToDiv = function () {
            var divId = "infoScreenModal";
            var innerHtml = tplChangePasswordInnerView({});
            jQuery('#' + divId).empty();
            jQuery('#' + divId).html(innerHtml);

            if (parseInt(CookieUtils.getCookie("isPasswordSet")) === 0) {
                jQuery("#oldPass").hide();
            } else {
                jQuery("#oldPass").show();
            }
            jQuery('#changePass').click(ChangePasswordInnerView.requestforchangepassword);
        };
        this.requestforchangepassword = function () {
            GlobalData.ec.recordClickEvent('Profile_view', 'ProfileChangePasswordButtonClicked');
            var validationFlag = ChangePasswordInnerView.validation();
            if (validationFlag === 1) {

                var requestdata = {
                    oldPassword: changePassword.oldPassword,
                    newPassword: changePassword.newPassword,
                    confirmPassword: changePassword.confirmPassword,
                    userid: CookieUtils.getCookie("custId"),
                    is_password_set: parseInt(CookieUtils.getCookie("isPasswordSet"))
                };

                var promise = UserService.userChangePassowrd(requestdata);
                promise.then(function (data) {
                    if (data.int_status_code === 0) {
                        jQuery('#passowd-error').show();
                        jQuery("#oldPass,#newPass,#confirmPass").val('');
                        jQuery('#passowd-error').text(data.str_status_message);
                    } else {
                        jQuery('.password-form').text(LanguageUtils.valueForKey('passwordchanged')).css("text-align", "center");
                    }
                }).fail(function (data) {
                    jQuery('#passowd-error').show();
                    jQuery("#oldPass,#newPass,#confirmPass").val('');
                    jQuery('#passowd-error').text(data.str_status_message);
                });
            }
        };
        this.validation = function () {
            changePassword.oldPassword = jQuery('#oldPass').val();
            changePassword.newPassword = jQuery('#newPass').val();
            changePassword.confirmPassword = jQuery('#confirmPass').val();
            var validationFlag = 1;
            if (changePassword.oldPassword === "") {
                validationFlag = 0;
                jQuery('#passowd-error').show().text(LanguageUtils.valueForKey('changePasswordOldFieldEmpty'));
                jQuery('#oldPass').focus();
                if (parseInt(CookieUtils.getCookie("isPasswordSet")) === 0) {
                    validationFlag = 1;
                    jQuery('#passowd-error').show().text(" ");
                }
            } else if (changePassword.newPassword === "") {
                validationFlag = 0;
                jQuery('#passowd-error').show().text(LanguageUtils.valueForKey('changePasswordNewFieldEmpty'));
                jQuery('#changePassword.newPassword').focus();
            } else if (changePassword.confirmPassword === "") {
                validationFlag = 0;
                jQuery('#passowd-error').show().text(LanguageUtils.valueForKey('changePasswordConfirmFieldEmpty'));
                jQuery('#confirmPassword').focus();
            } else if (changePassword.newPassword.length < 6) {
                validationFlag = 0;
                jQuery('#passowd-error').show().text(LanguageUtils.valueForKey('changePasswordInvalidLength'));
                jQuery('#passowrd').focus();
            } else if (changePassword.newPassword.length > 10) {
                validationFlag = 0;
                jQuery('#passowd-error').show().text(LanguageUtils.valueForKey('changePasswordInvalidLength'));
                jQuery('#passowrd').focus();
            } else if (changePassword.newPassword !== changePassword.confirmPassword) {
                validationFlag = 0;
                jQuery('#passowd-error').show().text(LanguageUtils.valueForKey('changePasswordNotSame'));
                jQuery('#changePassword.confirmPassword').focus();
            }
            return validationFlag;
        };
    });

    return ChangePasswordInnerView;
});