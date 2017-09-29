/*global define, jQuery, location*/
define(['Augment',
    'Instance',
    'GlobalData',
    'utils/StringUtils',
    'hbs!views/signin/templates/PersonalizedEmailSignUpView'
], function (augment, instance, GlobalData, StringUtils, tplPersonalizedEmailSignUpView) {

    'use strict';

    var PersonalizedEmailSignUpView = augment(instance, function () {

        this.addToDiv = function () {
            var divId = "appSignInDiv";
            var innerHtml = tplPersonalizedEmailSignUpView({
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
            jQuery('#login').click(PersonalizedEmailSignUpView.showLogin);
            jQuery('#termOfServices').click(PersonalizedEmailSignUpView.showTermOfServices);
            jQuery('#policy').click(PersonalizedEmailSignUpView.showPolicy);
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

    return PersonalizedEmailSignUpView;
});