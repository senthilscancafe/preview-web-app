/*global define*/

define(['Augment', 'Instance', 'hbs/underscore'], function (augment, instance, _) {
    'use strict';

    var UnderscoreMixinUtils = augment(instance, function () {
        
        _.mixin({
            isEmptyORUndefinedORNull: function(value){
                return (_.isUndefined(value) || _.isNull(value) || value.trim().length === 0);
            },
            isCommaSeparated: function(data){
                //remove last comma from data, mainly used in address area where user entered data already has a comma in the end
                var rawData = data;
                var sanitizedData = null;
                
                sanitizedData = rawData;
                if(!_.isEmptyORUndefinedORNull(rawData)){
                    //_(v).isEmptyORUndefinedORNull()
                    var lastCharater = rawData.charAt(rawData.length - 1);
                    if(lastCharater === ','){
                        sanitizedData = rawData.trim().replace(/,{1,}$/, '');
                    }
                }

                return sanitizedData;
            },
            isJSON: function(str) {
                try {
                    JSON.parse(str);
                } catch (e) {
                    return false;
                }
                return true;
            }
        });

        this.roundUp = function (rawData) {
            //dollar amount upto 2 decimal digits rounded up [ if the amount is 29.90667676, it will have to be rounded up to be 29.91, but not 30.00.]
            var z = Number(Math.round(parseFloat(rawData)+'e2')+'e-2');
            var sanitizedData = z.toFixed(Math.max(2, (z.toString().split('.')[1] || []).length));

            return sanitizedData;
        };

    });

    return UnderscoreMixinUtils;
});


