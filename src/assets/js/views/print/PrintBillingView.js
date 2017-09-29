/*global define, jQuery*/

define(['Augment',
    'Instance',
    'GlobalData',
    'PubSub',
    'utils/CookieUtils',
    'services/PrintService',
    'hbs/underscore',
    'lockr',
    'hbs!views/print/templates/PrintBillingView'
], function (augment, instance, GlobalData, PubSub, CookieUtils, PrintService, Lockr, _, tplPrintBillingView) {
    'use strict';

    var PrintBillingView = augment(instance, function () {
        var printBillingView = this;
        this.addToDiv = function () {
            if (_.isUndefined(GlobalData.printData)) {
                if(_.isUndefined(Lockr.get('storyData')) || _.isUndefined(Lockr.get('printData'))){
                    console.log('print flow data invalid');
                    if(!_.isUndefined(Lockr.get('storyDataBKP')) && !_.isUndefined(Lockr.get('printDataBKP'))){
                        Lockr.set('storyData', Lockr.get('storyDataBKP'));
                        Lockr.set('printData', Lockr.get('printDataBKP'));
                        Lockr.rm('storyDataBKP');
                        Lockr.rm('printDataBKP');
                        GlobalData.printData = Lockr.get('printData');
                        GlobalData.storyData = Lockr.get('storyData');
                    }else{
                        window.onbeforeunload = null;
                        location.hash = '#/dashboard';
                        return true;
                    }
                }
                GlobalData.printData = Lockr.get('printData');
                GlobalData.storyData = Lockr.get('storyData');
            }
            var divClass = "printContainer";
            var innerHtml = tplPrintBillingView({

            });
            jQuery('.' + divClass).empty();
            jQuery('.' + divClass).html(innerHtml);
             jQuery('.page-loading').css('overflow', 'auto');
            printBillingView.preloader();
        };

        this.preloader = function () {
            jQuery('body > .pageload').fadeOut();
        };
    });

    return PrintBillingView;
});