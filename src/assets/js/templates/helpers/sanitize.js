/*global define*/
define(['hbs/handlebars', 'hbs/underscore', 'utils/UnderscoreMixinUtils', 'libphonenumber'],
    function (Handlebars, _, UnderscoreMixinUtils, libphonenumber) {
        'use strict';

        var helperDef = function (data, params) {
            //console.log(params);
            if(!_.isJSON(params)){
                // It is JSON
                console.log('Not a valid json param');
            }
            var options = jQuery.parseJSON(params);
            var rawData = data;
            var sanitizedData = null;
            
            switch (options.formatType) {
                case 1: 
                //remove last comma from data, mainly used in address area where user entered data already has a comma in the end
                    
                    sanitizedData = rawData;
                    if(!_.isEmptyORUndefinedORNull(rawData)){
                        //_(v).isEmptyORUndefinedORNull()
                        var lastCharater = rawData.charAt(rawData.length - 1);
                        if(lastCharater === ','){
                            sanitizedData = rawData.trim().replace(/,{1,}$/, '');
                        }
                    }
                    
                    break;
                
                case 2: 
                //smart way to shorten long strings with javascript
                    String.prototype.trunc = function( n, useWordBoundary ){
                                                if (this.length <= n) { return this; }
                                                var subString = this.substr(0, n);
                                                return (useWordBoundary ? subString.substr(0, subString.lastIndexOf(' ')) 
                                                    : subString) + "...";
                                                };
                    sanitizedData = rawData.trunc(options.limit, options.wordBoundary);
                    break;
                
                case 3: 
                //dollar amount upto 2 decimal digits rounded up [ if the amount is 29.90667676, it will have to be rounded up to be 29.91, but not 30.00.]
                    var z = Number(Math.round(parseFloat(rawData)+'e2')+'e-2');
                    sanitizedData = z.toFixed(Math.max(2, (z.toString().split('.')[1] || []).length));
                    break;
                
                case 4: 
                //show page count, exclude covers
                    var pageCount = (parseInt(rawData) -2 )*2;
                    sanitizedData = (pageCount < 20)? 20 : pageCount;
                    break;
                
                case 5: 
                //Format phone numbers as xxx-xxx-xxxx
                    /*var s2 = (""+parseInt(rawData)).replace(/\D/g, '');
                    var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
                    sanitizedData = (!m) ? null : m[1] + "-" + m[2] + "-" + m[3];*/
                    var parsed_number = libphonenumber.parse(rawData, 'US'); //TODO: get the contrycodestr dynamically, look in MobileValidationUtils.getCurrentCountryCodeINT() or GlobalData.CURRENTCOUNTRYCODE
                    //console.log(libphonenumber);
                    sanitizedData = libphonenumber.format(parsed_number, 'International');
                    break;
                default:
                //TODO
                    sanitizedData = rawData;
            }

            return sanitizedData;
        };

        Handlebars.registerHelper("sanitize", helperDef);

        return helperDef;
    });