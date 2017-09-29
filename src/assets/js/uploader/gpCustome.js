/*global define, $, jQuery, window, console*/
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function () {
    //    alert("wait");
    window.opener.jQuery("#GPModal").modal('show');
    window.close();

    //    jQuery(".loggedOut").modal('show');
    var setCookie = function (cname, cvalue, exdays) {
        var d = new Date();
        // (number*days)
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        var co = cname + "=" + cvalue + ";";
        co += "path=/;";
        co += expires;
        document.cookie = co;
    };
    var accessToken = getCookie('gAccessToken');
    var refreshToken = getCookie('gRefreshToken');
    //    var accessToken = getCookie('gAccessToken');
    //    var accessToken = getCookie('gAccessToken');
    setCookie('gAccessToken', accessToken, 1);
    setCookie('gRefreshToken', refreshToken, 1);
    //    setCookie('gAccessToken', accessToken, 1);
    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ')
                c = c.substring(1);
            if (c.indexOf(name) == 0)
                return c.substring(name.length, c.length);
        }
        return "";
    }
});