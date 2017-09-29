/*global define, jQuery*/
define(['Augment',
    'Instance',
    'GlobalData',
    'utils/StringUtils',
    'hbs!views/signin/templates/EmailSignUpView'
], function (augment, instance, GlobalData, StringUtils, tplEmailSignUpView) {

    'use strict';

    var EmailSignUpView = augment(instance, function () {

        this.addToDiv = function () {
            var divId = "appSignInDiv";
            var innerHtml = tplEmailSignUpView({
                label: "Please sign in with label",
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
            jQuery.getScript("https://apis.google.com/js/api.js", function (data, textStatus, jqxhr) {
                console.log(jqxhr.status); // 200
                jQuery("#googlePlusLogin").removeClass("disabled");
            });
            jQuery('.logo-img-box').on('click', function () {
                document.location.href = GlobalData.base;
            });
        };

    });

    return EmailSignUpView;
});