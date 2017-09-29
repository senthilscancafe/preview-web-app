/*global define, jQuery*/

define(['Augment', 'Instance'], function (augment, instance) {
    'use strict';

    var LanguageUtils = augment(instance, function () {

        this.values = null;

        this.setValues = function (v) {
            this.values = v;
        };

        this.valueForKey = function (key) {
            var value = "";
            var langUtiles = this;
            jQuery.each(langUtiles.values, function (k, v) {
                if (k === key) {
                    value = v;
                }
            });
            return value;
        };

    });

    return LanguageUtils;
});

