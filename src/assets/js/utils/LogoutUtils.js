/*global define, document*/

define(['Augment',
    'Instance',
    'utils/CookieUtils',
    'services/UserService',
], function (augment, instance, CookieUtils, UserService) {
    'use strict';
    var Logout = augment(instance, function () {

        this.clearSession = function () {
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
            }).fail(function () {
            });

        };

    });
    return Logout;
});