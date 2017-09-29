/*global define, jQuery*/

define(['Augment',
    'Instance',
    'hbs!views/errorMessage/templates/ErrorMessage'
], function(augment, instance, tplErrorMessage) {

    'use strict';

    var ErrorMessage = augment(instance, function() {
//        var infoView = this;
        this.addToDiv = function() {
            var divId = "messageModalCon";
            var innerHtml = tplErrorMessage({});
            jQuery('#' + divId).empty();
            jQuery('#' + divId).html(innerHtml);
            this.sendtoStore();

        };
        this.sendtoStore = function() {
            
        };
    });

    return ErrorMessage;
});