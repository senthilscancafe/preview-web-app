/*global define*/

define(['Augment', 'Instance'], function (augment, instance) {
    'use strict';

    var DateUtils = augment(instance, function () {


        this.timestamp10ToFormattedDate = function (timestamp) {
            var dateObj = new Date(timestamp * 1000);
            var dateStr = dateObj.toString('MMM d');
            dateStr += " at ";
            dateStr += dateObj.toString('hh:mm tt');
            return  dateStr;
        };

    });

    return DateUtils;
});

