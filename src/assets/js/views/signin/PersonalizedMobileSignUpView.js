/*global define, jQuery, location*/
define(['Augment',
    'Instance',
    'GlobalData',
    'utils/StringUtils',
    'hbs!views/signin/templates/PersonalizedMobileSignUpView'
], function (augment, instance, GlobalData, StringUtils, tplPersonalizedMobileSignUpView) {

    'use strict';

    var PersonalizedMobileSignUpView = augment(instance, function () {

        this.addToDiv = function () {
            var divId = "appSignInDiv";
            var innerHtml = tplPersonalizedMobileSignUpView({
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
//            jQuery('.telephone-input').intlTelInput({//autoFormat: false,
//                //autoHideDialCode: false,
//                //defaultCountry: "jp",
//                nationalMode: false,
//                //onlyCountries: ['us', 'ch', 'ca', 'do'],
//                //preferredCountries: ['cn', 'jp'],
//                responsiveDropdown: true,
//                //preventInvalidNumbers: true,
//                preventInvalidDialCodes: true,
//                utilsScript: "assets/js/thirdparty/theme/utils.js"});
            jQuery('#login').click(PersonalizedMobileSignUpView.showLogin);
            jQuery('#termOfServices').click(PersonalizedMobileSignUpView.showTermOfServices);
            jQuery('#policy').click(PersonalizedMobileSignUpView.showPolicy);
            jQuery('.logo-img-box').on('click', function () {
                document.location.href = GlobalData.base;
            });
            PubSub.publish('LOAD_CLOUD_JS_FILES');
        };
        this.showLogin = function () {
            location.hash = '#/login';
        };
        this.showTermOfServices = function () {
            location.hash = '#/termofservices';
        };
        this.showPolicy = function () {
            location.hash = '#/policy';
        };

    });

    return PersonalizedMobileSignUpView;
});