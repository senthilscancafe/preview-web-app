/*global define*/
define(['hbs/handlebars'],
    function (Handlebars) {
        'use strict';

        var helperDef = function (obj, operator, value, options) {
            var result = false;
            switch (operator) {
                case "===":
                    {
                        result = (obj === value);
                        break;
                    }
                case "!==":
                    {
                        result = (obj !== value);
                        break;
                    }
                case '==':
                    return (obj == value) ? options.fn(this) : options.inverse(this);
                case '===':
                    return (obj === value) ? options.fn(this) : options.inverse(this);
                case '<':
                    return (obj < value) ? options.fn(this) : options.inverse(this);
                case '<=':
                    return (obj <= value) ? options.fn(this) : options.inverse(this);
                case '>':
                    return (obj > value) ? options.fn(this) : options.inverse(this);
                case '>=':
                    return (obj >= value) ? options.fn(this) : options.inverse(this);
                case '&&':
                    return (obj && value) ? options.fn(this) : options.inverse(this);
                case '||':
                    return (obj || value) ? options.fn(this) : options.inverse(this);
            }

            return (result) ? options.fn(this) : options.inverse(this);
        };

        Handlebars.registerHelper("compare", helperDef);

        return helperDef;
    });