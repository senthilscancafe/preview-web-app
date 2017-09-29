/*global define, jQuery*/

define(['Augment',
    'Instance',
    'GlobalData',
    'PubSub',
    'utils/CookieUtils',
    'services/PrintService',
    'hbs/underscore',
    'lockr',
    'hbs!views/print/templates/PrintShippingView'
], function (augment, instance, GlobalData, PubSub, CookieUtils, PrintService, _, Lockr, tplPrintShippingView) {
    'use strict';

    var PrintShippingView = augment(instance, function () {
        var printShippingView = this;

        this.addToDiv = function () {
            jQuery('body > .pageload').fadeIn();
            if (_.isUndefined(GlobalData.printData)) {
                if (_.isUndefined(Lockr.get('storyData')) || _.isUndefined(Lockr.get('printData'))) {
                    console.log('print flow data invalid');
                    if (!_.isUndefined(Lockr.get('storyDataBKP')) && !_.isUndefined(Lockr.get('printDataBKP'))) {
                        Lockr.set('storyData', Lockr.get('storyDataBKP'));
                        Lockr.set('printData', Lockr.get('printDataBKP'));
                        Lockr.rm('storyDataBKP');
                        Lockr.rm('printDataBKP');
                        GlobalData.printData = Lockr.get('printData');
                        GlobalData.storyData = Lockr.get('storyData');
                    } else {
                        window.onbeforeunload = null;
                        location.hash = '#/dashboard';
                        return true;
                    }
                }
                GlobalData.printData = Lockr.get('printData');
                GlobalData.storyData = Lockr.get('storyData');
            }
            printShippingView.listShippingAddress();
        };

        this.preloader = function () {
            jQuery('body > .pageload').fadeOut();
            jQuery('.addShippingAddress').click(printShippingView.addShippingAddress);
            jQuery('.editShippingAddress').click(printShippingView.editShippingAddress);
            jQuery('.deleteShippingAddress').click(printShippingView.deleteShippingAddress);
            jQuery('.thisShippingAddress').click(printShippingView.thisShippingAddress);
            jQuery('.shippingAddressRadio').click(printShippingView.selectShippingAddress);
            // PubSub.subscribe('SELECT_SHIPPING_ADDRESS', function (name) {
                //printShippingView.getSelectedAddress();
            // });

        };

        this.selectShippingAddress = function () {
            jQuery('.shippingAddressRadio.active').removeClass('active');
            jQuery(this).addClass('active');
            this.shippingAddressId = jQuery('.shippingAddressRadio.active').attr('id');
            jQuery('.ShippingActionElementsBox').hide();
            //jQuery('.shppingListOuterBox#' + this.shippingAddressId + ' .ShippingActionElementsBox').show();//removed id because of duplicacy
            jQuery(this).closest('.shppingListOuterBox').find('.ShippingActionElementsBox').show();
        };

        this.addShippingAddress = function (event) {
            if (event) {
                event.stopPropagation();
            }
            GlobalData.printData.redirectURL = '#/print/shipping/add';
            GlobalData.printData.action = 'add';
            printShippingView.redirectToPages();
            CookieUtils.setCookie("HashPath", "#/print/shipping/address");
        };

        this.editShippingAddress = function (event) {
            event.stopPropagation();
            GlobalData.printData.temp = {};
            GlobalData.printData.redirectURL = '#/print/shipping/edit';
            GlobalData.printData.action = 'edit';
            GlobalData.printData.temp.address_id = jQuery('.shippingAddressRadio.active').attr('id');
            CookieUtils.setCookie("HashPath", "#/print/shipping/address");
            printShippingView.redirectToPages();
        };

        this.deleteShippingAddress = function (event) {
            event.stopPropagation();
            GlobalData.ec.recordClickEvent('Print_Shipping_Address_List', 'click', 'Delete_Shipping_Address');
            jQuery('body > .pageload').fadeIn();
            var requestData = {
                customer_id: CookieUtils.getCookie("custId"),
                address_id: jQuery('.shippingAddressRadio.active').attr('id')
            };
            var promise = PrintService.deleteShippingDetails(requestData);

            $.when(promise)
                .done(function (obj) {
                    if (obj.arr_data !== null && obj.int_status_code !== 0) {
                        //GlobalData.printData.redirectURL = '#/print/shipping';
                        //printShippingView.redirectToPages();
                        //printShippingView.addToDiv();
                        printShippingView.listShippingAddress();
                    } else {
                        console.log('API response is null');
                    }
                });
        };

        this.thisShippingAddress = function (event) {
            event.stopPropagation();
            printShippingView.getSelectedAddress();
            GlobalData.printData.redirectURL = '#/print/deliveryoption';
            if (GlobalData.printData.summaryModify) {
                console.log('landed here');
                delete GlobalData.printData.summaryModify;
                GlobalData.printData.redirectURL = '#/print/order/summary';
            }
            printShippingView.redirectToPages();
        };

        this.getSelectedAddress = function () {

            if (_.isUndefined(GlobalData.printData.shippingList)) {
                console.log('GlobalData.printData.deliveryList undefined');
            } else {
                console.log(GlobalData.printData.shippingList);
                for (var i = 0; i < GlobalData.printData.shippingList.length; i++) {
                    if (GlobalData.printData.shippingList[i].address_id == jQuery('.shippingAddressRadio.active').attr('id')) {
                        console.log(GlobalData.printData.shippingList[i]);
                        GlobalData.printData.shippingAddress = GlobalData.printData.shippingList[i];
                        //CookieUtils.setCookie("printData", JSON.stringify(GlobalData.printData), GlobalData.expireDays);
                        break;
                    }
                }
            }
            //CookieUtils.setCookie("shippingId", jQuery('.shippingAddressRadio.active').attr('id'), GlobalData.expireDays);
        };

        this.listShippingAddress = function () {
            this.cutomerID = CookieUtils.getCookie("custId");
            if (_.isUndefined(this.cutomerID)) {
                console.log('customer id is undefined');
            } else {
                var requestData = {
                    account_id: CookieUtils.getCookie("custId")
                };
                var promise = PrintService.getShippingDetails(requestData);

                $.when(promise)
                    .done(function (obj) {
                        if (obj.arr_data !== null && obj.int_status_code !== 0) {
                            if (obj.arr_data.data.length === 1 && _.isNull(obj.arr_data.data[0].address_id)) {
                                //show add shipping address
                                printShippingView.addShippingAddress();
                            } else {
                                var divClass = "printContainer";
                                var innerHtml = tplPrintShippingView({
                                    heading: 'Select Shipping Address',
                                    shippingList: obj.arr_data.data,
                                    addShippingAddress: 'Add a new address',
                                    //editShippingAddress : 'Edit',
                                    //deleteShippingAddress : 'Delete',
                                    //thisShippingAddress : 'Ship to this address'
                                });
                                jQuery('.' + divClass).empty();
                                jQuery('.' + divClass).html(innerHtml);
                                jQuery('.page-loading').css('overflow', 'auto');

                                GlobalData.printData.shippingList = obj.arr_data.data;

                                //to denote selected
                                //if (GlobalData.printData.shippingList.length > 0) {
                                if (!_.isUndefined(GlobalData.printData.shippingAddress)) {
                                    jQuery('#' + GlobalData.printData.shippingAddress.address_id).addClass('active');
                                    jQuery('#' + GlobalData.printData.shippingAddress.address_id).parent().parent().find('.ShippingActionElementsBox').show();
                                } else {
                                    jQuery('.shippingAddressRadio:first').addClass('active');
                                    jQuery('.ShippingActionElementsBox:first').show();
                                }

                                printShippingView.preloader();
                            }

                        } else {
                            console.log('API response is null');
                        }
                    });
            }
        };

        this.redirectToPages = function () {
            Lockr.set('printData', GlobalData.printData);
            if (GlobalData.printData.redirectURL === '#/print/shipping/add' || GlobalData.printData.redirectURL === '#/print/shipping/edit') {
                location.hash = '#/print/shipping/address';
            }
            if (GlobalData.printData.redirectURL === '#/print/deliveryoption') {
                location.hash = '#/print/deliveryoption';
            }
            if (GlobalData.printData.redirectURL === '#/print/shipping') {
                location.hash = '#/print/shipping';
            }
            if (GlobalData.printData.redirectURL === '#/print/order/summary') { //in case of altering shipping from summary
                location.hash = '#/print/order/summary';
            }
        };
    });

    return PrintShippingView;
});