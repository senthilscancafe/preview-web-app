/*global define*/
define(['hbs/handlebars', 'moment'],
    function (Handlebars, moment) {
        'use strict';

        var helperDef = function (dateVal, formatType) {
            var rawDate = dateVal;
            var format = null;
            var formattedDate = null;

            switch (formatType) {
                case 1: 
                    format = 'MM/DD/YYYY';
                    formattedDate = moment(rawDate).format(format);
                    break;
                case 2: 
                    format = 'DD/MM/YYYY';
                    formattedDate = moment(rawDate).format(format);
                    break;
                default:
                    format = 'MMMM Do YYYY, h:mm:ss a';
                    formattedDate = moment(rawDate).format(format);
            }

            return formattedDate;
        };

        Handlebars.registerHelper("formatDate", helperDef);

        return helperDef;
    });