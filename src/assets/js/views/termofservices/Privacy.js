/*global define, jQuery*/
define(['Augment',
    'Instance',
    'GlobalData',
    'hbs!views/termofservices/templates/Privacy'
], function (augment, instance, GlobalData, tplPrivacy) {

    'use strict';

    var Privacy = augment(instance, function () {

        this.addToDiv = function () {
            var divId = "appSignInDiv";
            var innerHtml = tplPrivacy({
                imageBase: GlobalData.imageBase,
                baseURL: GlobalData.baseUrl2
            });

            jQuery('#' + divId).empty();
            jQuery('.mainContainer').removeClass('app');
            jQuery('.mainContainer').empty();
            jQuery('#' + divId).html(innerHtml);
            this.preloader();

        };
        this.preloader = function () {
            jQuery('body').addClass('page-loaded').removeClass('page-loading');
            jQuery('body > .pageload').fadeOut();
            clearInterval(GlobalData.checkStatus);
            jQuery('#signUp').click(function () {
                location.hash = "/accountsignup";
            });
            jQuery('#login').click(function () {
                location.hash = "/login";
            });
        };

    });

    return Privacy;
});