/*global define, console, currentENV*/

define(['Augment',
    'Instance',
    'Router',
    'GlobalData',
    'utils/MobileValidationUtils',
    'services/MultilingualService',
    'utils/LanguageUtils',
], function (augment, instance, router, GlobalData, MobileValidationUtils, MultilingualService, LanguageUtils) {
    'use strict';

    var App = augment(instance, function () {
            this.initiate = function () {
                GlobalData.setConfig(currentENV);
                this.loadLanguageAndStartupApp();
            };

            this.loadLanguageAndStartupApp = function () {
                var values = MultilingualService.getLocalizationValues();
                LanguageUtils.setValues(values);
                this.startAppication();
            };

            this.startAppication = function () {
                MobileValidationUtils.getCurrentCountryCodeINT();
                router.mapRoutes();
                console.log("Application Started");
            };
        }),
        APP = App.create();

    return APP;
});