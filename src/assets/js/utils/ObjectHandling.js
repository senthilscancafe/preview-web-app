/*global define*/

define(['Augment', 'Instance'], function (augment, instance) {
    'use strict';

    var ObjectHandling = augment(instance, function () {


        this.copyObject = function (source, deep) {
            var o, prop, type;
            if (typeof source !== 'object' || source === null) {
                // What do to with functions, throw an error?
                o = source;
                return o;
            }

            o = new source.constructor();
            for (prop in source) {

                if (source.hasOwnProperty(prop)) {
                    type = typeof source[prop];
                    if (deep && type === 'object' && source[prop] !== null) {
                        o[prop] = this.copy(source[prop]);
                    } else {
                        o[prop] = source[prop];
                    }
                }
            }
            return o;
        };

        this.convertArrTOObj = function(arr){
            var res = arr.reduce(function(acc, cur, i) {
                acc[i] = cur;
                return acc;
                }, {});
            return res;
        };

    });

    return ObjectHandling;
});


