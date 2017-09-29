/*global define, jQuery*/

define(['Augment',
    'Instance',
    'GlobalData',
    'PubSub',
    'utils/ObjectHandling',
    'utils/CookieUtils',
    'services/PrintService',
    'hbs/underscore',
    'hbs!views/print/templates/PrintOrderView'
], function (augment, instance, GlobalData, PubSub, ObjectHandling, CookieUtils, PrintService, _, tplPrintOrderView) {
    'use strict';

    var PrintOrderView = augment(instance, function () {
        var printOrderView = this;
        this.printOrderId = null;
        this.addToDiv = function () {
            Lockr.rm('storyData');
            Lockr.rm('printData');
            Lockr.rm('storyDataBKP');
            Lockr.rm('printDataBKP');
            GlobalData.printData = {};
            jQuery('.pageload').fadeIn();
            printOrderView.listPrintedOrders();
        };

        this.preloader = function () {
            jQuery('body > .pageload').fadeOut();
            window.onbeforeunload = null;
            jQuery('.orderDetails').click(printOrderView.showOrderDetails);
            jQuery('.reOrderPhotoBook').click(printOrderView.reOrderPhotoBook);
        };

        this.showOrderDetails = function (event) {
            event.stopPropagation();
            printOrderView.printOrderId = $(this).closest('.orderBlock').attr('id');
            printOrderView.getSelectedOrderDetails();
            GlobalData.printData.redirectURL = '#/print/order/details';
            printOrderView.redirectToPages();
        };

        this.reOrderPhotoBook = function (event) {
            event.stopPropagation();
            GlobalData.ec.recordClickEvent('Print_My_Orders', 'click', 'Re_order_Button');
            printOrderView.printOrderId = $(this).closest('.orderBlock').attr('id');
            //console.log(printOrderView.printOrderId);
            printOrderView.getSelectedOrderDetails();
            //console.dir(GlobalData.printData.selectedOrderDetails);
            GlobalData.orderData = GlobalData.printData.selectedOrderDetails;
            GlobalData.orderData.reOrder = true;
            for (var i = 0; i < GlobalData.dashboardData.length; i++) {
                if (GlobalData.dashboardData[i].id === GlobalData.printData.selectedOrderDetails.order_id) {
                    GlobalData.orderData.story_belongsto = GlobalData.dashboardData[i].story_belongsto;
                }
            }
            //console.dir(GlobalData.orderData);
            GlobalData.printData = {};
            Lockr.rm('storyData');
            Lockr.rm('printData');
            Lockr.rm('storyDataBKP');
            Lockr.rm('printDataBKP');
            GlobalData.printData.redirectURL = "#/print/books";
            printOrderView.redirectToPages();
        };

        this.getSelectedOrderDetails = function () {

            if (_.isUndefined(GlobalData.printData.printedOrders)) {
                console.log('GlobalData.printData.printedOrders undefined');
            } else {
                for (var i = 0; i < Object.keys(GlobalData.printData.printedOrders).length; i++) {
                    if (GlobalData.printData.printedOrders[i].id === printOrderView.printOrderId) {
                        GlobalData.printData.selectedOrderDetails = GlobalData.printData.printedOrders[i];
                    }
                }
            }
        };

        this.listPrintedOrders = function () {
            this.cutomerID = CookieUtils.getCookie("custId");
            if (_.isUndefined(this.cutomerID)) {
                console.log('customer id is undefined');
            } else {
                var requestData = {
                    customer_id: CookieUtils.getCookie("custId")
                };
                var promise = PrintService.listPrintedOrders(requestData);
                var divClass = null;
                var innerHtml = null;

                $.when(promise)
                    .done(function (obj) {
                        if (obj.arr_data !== null && obj.int_status_code !== 0) {
                            obj.arr_data.data = ObjectHandling.convertArrTOObj(obj.arr_data.data);
                            GlobalData.printData.printedOrders = obj.arr_data.data;
                            divClass = "printContainer";

                            innerHtml = tplPrintOrderView({
                                heading: 'My Orders',
                                printedOrdersList: obj.arr_data.data,
                            });
                            jQuery('.' + divClass).empty();
                            jQuery('.' + divClass).html(innerHtml);
                            jQuery('.reOrderHr:last').hide();
                            jQuery('.page-loading').css('overflow', 'auto');
                            printOrderView.preloader();
                        } else {
                            console.log('listPrintedOrders API response is null');
                            divClass = "printContainer";
                            innerHtml = tplPrintOrderView({
                                heading: 'My Orders',
                                printedOrdersList: false,
                            });
                            jQuery('.' + divClass).empty();
                            jQuery('.' + divClass).html(innerHtml);
                            
                            printOrderView.preloader();
                        }
                    });


            }
        };

        this.redirectToPages = function () {
            Lockr.set('printData', GlobalData.printData);
            location.hash = GlobalData.printData.redirectURL;
        };

    });

    return PrintOrderView;
});