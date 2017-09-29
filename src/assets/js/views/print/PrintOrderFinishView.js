/*global define, jQuery*/

define(['Augment',
    'Instance',
    'GlobalData',
    'PubSub',
    'utils/CookieUtils',
    'services/PrintService',
    'hbs/underscore',
    'lockr',
    'hbs!views/print/templates/PrintOrderFinishView'
], function (augment, instance, GlobalData, PubSub, CookieUtils, PrintService, _, Lockr, tplPrintOrderFinishView) {
    'use strict';

    var PrintOrderFinishView = augment(instance, function () {
        var PrintOrderFinishView = this;
        this.addToDiv = function () {
            //console.dir(GlobalData.printData.printedOrders);

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
            
            if (!_.isUndefined(GlobalData.printData.printedOrders)) {//this object gets populated when user jumps from 'thanyou' to 'my orders' page
                window.onbeforeunload = null;
                location.hash = '#/dashboard';
                return true;
            }
            

            var divClass = "printContainer";
            var innerHtml = tplPrintOrderFinishView({
                printOrderNum: GlobalData.printData.printOrderPlacedId
            });
            jQuery('.' + divClass).empty();
            jQuery('.' + divClass).html(innerHtml);
            jQuery('.page-loading').css('overflow', 'auto');
            PrintOrderFinishView.preloader();
            jQuery('#myOrders').click(PrintOrderFinishView.myOrders);

            /*window.onhashchange = function() {
                console.dir(window.location);
                if(window.location.hash === '#/print/order/summary'){
                    window.location.href = location.pathname;
                }
            
            };*/

            /*var hashChange = true;
            $(window).on('hashchange', function (e) {
                if (hashChange) {
                    if (confirm("change hash?")) {
                        //call code that affect the page
                        if(window.location.hash === '#/print/order/summary'){
                            window.location.href = location.pathname;
                        }
                    } else {
                        e.preventDefault(); //prevent the default behaviour
                        window.history.back(); //move to previous state ,remove hash
                        hashChange = false;
                        //do something else
                    }
                } else {
                    hashChange = true;
                }
            });*/
        };

        this.preloader = function () {
            jQuery('body > .pageload').fadeOut();
            CookieUtils.delete_cookie('HashPath');
            CookieUtils.delete_cookie("prePath");
            //clear localstorage and globaldata, no way back
            Lockr.rm('storyData');
            Lockr.rm('printData');
            delete GlobalData.printData;
            delete GlobalData.storyData;
            // CookieUtils.delete_cookie("printData");
        };

        this.myOrders = function (event) {
            event.stopPropagation();
            GlobalData.ec.recordClickEvent('Print_Thank_You', 'click', 'My_Orders_Button');
            window.onbeforeunload = null;
            //GlobalData.printData.redirectURL = '#/print/order';
            PrintOrderFinishView.redirectToPages();
        };

        this.redirectToPages = function () {
            //Lockr.set('printData', GlobalData.printData);
            //location.hash = GlobalData.printData.redirectURL;
            location.hash = '#/print/order';
        };
    });

    return PrintOrderFinishView;
});