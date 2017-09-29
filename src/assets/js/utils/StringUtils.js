/*global define*/

define(['Augment', 'Instance'], function (augment, instance) {
    'use strict';

    var StringUtils = augment(instance, function () {


        this.splitNotificationText = function (string, title) {
            var n = string.lastIndexOf(title);
            var text = {
                start: string.slice(0, n),
                title: title,
                end: string.slice(n + title.length)
            };

            return text;
        };
        this.splitSpecialNotificationText = function (string, title) {
            var n = string.lastIndexOf(title);
            var nameN;
            nameN = string.lastIndexOf('liked');
            if (nameN === -1) {
                nameN = string.lastIndexOf('has commented');
                if (nameN === -1) {
                    nameN = string.lastIndexOf('shared');
                }
            }
            if (nameN === -1) {
                nameN = 0;
            }
            var text = {
                name: string.slice(0, nameN),
                start: string.slice(nameN, n),
                title: title,
                end: string.slice(n + title.length)
            };

            return text;
        };

        this.placeHolderCall = function () {
//            $('[placeholder]').focus(function () {
//                var input = $(this);
//                if (input.val() == input.attr('placeholder')) {
//                    input.val('');
//                    input.removeClass('placeholder');
//                }
//            }).blur(function () {
//                var input = $(this);
//                if (input.val() == '' || input.val() == input.attr('placeholder')) {
//                    input.addClass('placeholder');
//                    input.val(input.attr('placeholder'));
//                }
//            }).blur();
        };
    });

    return StringUtils;
});


