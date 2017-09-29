/*global define, document*/

define(['Augment', 'Instance'], function (augment, instance) {
    'use strict';

    var CookieUtils = augment(instance, function () {

        this.setCookie = function (cname, cvalue, exdays) {
            var d = new Date();
            // (number*days)
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            var co = cname + "=" + cvalue + ";";
            co += "path=/;";
            co += expires;
            document.cookie = co;
        };
        this.getCookie = function (cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) === 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        };
        this.delete_cookie = function (name) {
            document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        };

        this.deleteAllCookies = function () {
            var cookies = document.cookie.split(";");
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i];
                var eqPos = cookie.indexOf("=");
                var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            }
        };

    });

    return CookieUtils;
});