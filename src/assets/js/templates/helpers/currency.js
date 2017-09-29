/*global define*/
define(['hbs/handlebars', 'currencyFormatter'],
    function (Handlebars, currencyFormatter) {
        'use strict';

        var helperDef = function (amount, currency) {
            var num = Number(amount);
            
            num = parseFloat(num.toFixed(2));
            //console.log(typeof(num));
            //var formattedNumber = num.toLocaleString('en-US', {style: 'currency', currency: currency});
            //var formattedNumber = '$'+num;
            //2 decimal points and return floatval
            //console.log(typeof(formattedNumber));
            //http://openexchangerates.github.io/accounting.js/
            var formattedNumber = currencyFormatter.formatMoney(num); 
            return formattedNumber;
        };

        Handlebars.registerHelper("currency", helperDef);

        return helperDef;
    });