/*global define, jQuery*/

define(['Augment',
    'Instance',
    'GlobalData',
    'PubSub',
    'utils/CookieUtils',
    'services/PrintService',
    'views/messages/MessagesView',
    'utils/UnderscoreMixinUtils',
    'hbs/underscore',
    'braintree',
    'dataCollector',
    'views/print/PrintTermAndConditionView',
    'hbs!views/print/templates/PrintOrderSummaryView'
], function (augment, instance, GlobalData, PubSub, CookieUtils, PrintService, MessagesView, UnderscoreMixinUtils, _, Braintree, dataCollector, PrintTermAndConditionView, tplPrintOrderSummaryView) {
    'use strict';

    var PrintOrderSummaryView = augment(instance, function () {
        var PrintOrderSummaryView = this;
        var messagesView = '';
        this.ClientTokenToInitBT = null;
        this.BtInstance = null;
        this.addToDiv = function () {
            CookieUtils.setCookie("prePath", '#/print/order/summary');
            jQuery('body > .pageload').fadeIn();
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
            console.log(GlobalData.storyData);
            console.log(GlobalData.printData);
            PrintOrderSummaryView.getClientTokenToInitBT();
            var dataSrc = GlobalData.printData;
            var divClass = "printContainer";
            var templateData = {
                //Block 1
                webCoverUrl: GlobalData.storyData.webcoverurl,
                orderTitle: GlobalData.storyData.cover_caption,
                orderSize: GlobalData.printData.bookData.name,
                note1: 'By placing your order,',
                note1a: 'you agree to Photogurus',
                note2: 'Terms and Conditions',
                placeOrder: 'Place your order',
                orderNoPages: GlobalData.printData.pageInfo.pageCount+' pages',

                //Block 2
                heading1: 'Order Summary',
                shippingTo: 'Shipping to: ',
                //shippingAddressGistName: dataSrc.shippingAddress.address_firstname + ', ',
                shippingAddressGist: ((!_(dataSrc.shippingAddress.address1).isEmptyORUndefinedORNull()) ? _(dataSrc.shippingAddress.address1).isCommaSeparated() + ', ' : '') + '...',
                estimatedDeliveryDate: 'Estimated delivery: ',

                item1Label: 'Book price: ',
                item1Val: dataSrc.cartData.bookprice,
                item2Label: 'Shipping: ',
                item2Val: dataSrc.cartData.shipping_price,
                item3Label: 'Tax: ',
                item3Val: dataSrc.cartData.tax,
                item4Label: 'Order total: ',
                item4Val: dataSrc.cartData.order_total,

                //Block 3
                heading2: 'Shipping Address',
                shippingAddressDetail:
                    ((!_(dataSrc.shippingAddress.address1).isEmptyORUndefinedORNull()) ? _(dataSrc.shippingAddress.address1).isCommaSeparated() + ', ' : '') +
                    ((!_(dataSrc.shippingAddress.address2).isEmptyORUndefinedORNull()) ? _(dataSrc.shippingAddress.address2).isCommaSeparated() + ', ' : '') +
                    ((!_(dataSrc.shippingAddress.city).isEmptyORUndefinedORNull()) ? _(dataSrc.shippingAddress.city).isCommaSeparated() + ', ' : '') +
                    dataSrc.shippingAddress.state + ' ' +
                    dataSrc.shippingAddress.zip + ', ' +
                    dataSrc.shippingAddress.country,
                shippingAddressDetailPhone: dataSrc.shippingAddress.phone,
                //Block 4
                heading3: 'Payment Information',
                subHeading1: 'Payment method',
                //paymentDetails: dataSrc.selectedCard.cardType + ' ending in ' + (dataSrc.selectedCard.maskedNumber).replace(/.(?=.{4})/g, '*'),
                paymentDetails: dataSrc.selectedCard.cardType + ' ending in ' + (dataSrc.selectedCard.maskedNumber).slice(-4),
                subHeading2: 'Billing address',
                billingAddressDetailName: dataSrc.selectedCard.billingAddress.firstName + ' ' +
                    ((!_(dataSrc.selectedCard.billingAddress.lastName).isEmptyORUndefinedORNull()) ? _(dataSrc.selectedCard.billingAddress.lastName).isCommaSeparated() + ', ' : ''),
                billingAddressDetail: 
                    ((!_(dataSrc.selectedCard.billingAddress.streetAddress).isEmptyORUndefinedORNull()) ? _(dataSrc.selectedCard.billingAddress.streetAddress).isCommaSeparated() + ', ' : '') +
                    ((!_(dataSrc.selectedCard.billingAddress.extendedAddress).isEmptyORUndefinedORNull()) ? _(dataSrc.selectedCard.billingAddress.extendedAddress).isCommaSeparated() + ', ' : '') +
                    dataSrc.selectedCard.billingAddress.locality + ', ' +
                    dataSrc.selectedCard.billingAddress.region + ' ' +
                    dataSrc.selectedCard.billingAddress.postalCode + ', ' +
                    dataSrc.selectedCard.billingAddress.countryName,
                //Block 5
                heading4: 'Shipment Details',
                deliveryOption: dataSrc.deliveryOption.delivery_type,
                estimatedDeliveryByDate: dataSrc.deliveryOption.ship_by_date
            };
            if (dataSrc.shippingAddress.address_lastname) {
                templateData.shippingName = dataSrc.shippingAddress.address_firstname + ' ' + dataSrc.shippingAddress.address_lastname + ', ';
                templateData.shippingAddressGistName = dataSrc.shippingAddress.address_firstname + ' ' + dataSrc.shippingAddress.address_lastname + ', ';
            } else {
                templateData.shippingName = dataSrc.shippingAddress.address_firstname + ',';
                templateData.shippingAddressGistName = dataSrc.shippingAddress.address_firstname + ',';
            }


            if (!_.isUndefined(GlobalData.printData.coupon)) {
                //handle discount data
                templateData.discountRequested = {
                    "item5Label": "Discount:",
                    "item5Val": UnderscoreMixinUtils.roundUp(dataSrc.cartData.discount_amount)
                };
            } else {
                templateData.discountRequested = false;
            }
            console.log('~~~~~~');
            console.dir(templateData);
            var innerHtml = tplPrintOrderSummaryView(templateData);
            jQuery('.' + divClass).empty();
            jQuery('.' + divClass).html(innerHtml);
            jQuery('.page-loading').css('overflow', 'auto');
            messagesView = MessagesView.create();
        };

        this.preloader = function () {
            jQuery('body > .pageload').fadeOut();
            jQuery('.placeOrder').click(PrintOrderSummaryView.placeOrder);
            jQuery('.discountLink, .discount').click(PrintOrderSummaryView.availDiscount);
            jQuery('.selecteddeliveryOption').click(PrintOrderSummaryView.redirectToDelivery);
            jQuery('.selectedCard').click(PrintOrderSummaryView.redirectToCard);
            jQuery('.selectedBilling').click(PrintOrderSummaryView.redirectToBilling);
            jQuery('.selectedShipping').click(PrintOrderSummaryView.redirectToShipping);
            jQuery('.termAndConditionModalLink').click(PrintOrderSummaryView.openTermConditionPopup);
        };
        this.openTermConditionPopup = function () {
            var printTermAndConditionView = PrintTermAndConditionView.create();
            printTermAndConditionView.addToDiv();
            //jQuery('.page-loading').css('overflow', 'hidden');
            jQuery('.termAndConditionModal').modal('show');
            jQuery('.sDcloseIcon').click(function(){
                jQuery('.termAndConditionModal').modal('hide');
                //jQuery('.page-loading').css('overflow', 'auto');
            });
            
        };

        this.getClientTokenToInitBT = function () {
            if (_.isUndefined(GlobalData.storyData)) {
                console.log('GlobalData.storyData undefined');
            } else {
                var requestData = {
                    customer_id: CookieUtils.getCookie("custId")
                };
                var promise = PrintService.pgClientToken(requestData);

                $.when(promise)
                    .done(function (obj) {
                        if (obj.arr_data !== null && obj.int_status_code !== 0) {
                            PrintOrderSummaryView.ClientTokenToInitBT = obj.arr_data.token;
                            PrintOrderSummaryView.initializeBT();
                        } else {
                            console.log('API response is null');
                        }
                    });
            }
        };

        this.initializeBT = function () {
            //var form = document.querySelector('#checkout-form');
            //var submit = document.querySelector('input[type="submit"]');
            //console.log(PrintOrderSummaryView.ClientTokenToInitBT);
            Braintree.create({
                authorization: PrintOrderSummaryView.ClientTokenToInitBT
            }, function (clientErr, clientInstance) {
                if (clientErr) {
                    console.error(clientErr);
                    return;
                }
                //console.log(Braintree, clientInstance);
                // This example shows Hosted Fields, but you can also use this
                // client instance to create additional components here, such as
                // PayPal or Data Collector.
                PrintOrderSummaryView.BtInstance = clientInstance;
                //PrintOrderSummaryView.preloader();
                PrintOrderSummaryView.collectDeviceData();

            });
        };

        this.collectDeviceData = function () {
            dataCollector.create({
                client: PrintOrderSummaryView.BtInstance,
                kount: true
            }, function (err, dataCollectorInstance) {
                if (err) {
                    console.dir(err);
                    // Handle error in creation of data collector
                    return;
                }
                // At this point, you should access the dataCollectorInstance.deviceData value and provide it
                // to your server, e.g. by injecting it into your form as a hidden input.
                var deviceData = dataCollectorInstance.deviceData;
                GlobalData.printData.deviceData = deviceData;
                console.dir(deviceData);
                PrintOrderSummaryView.preloader();
            });
        };

        this.redirectToShipping = function (event) {
            event.stopPropagation();
            GlobalData.ec.recordClickEvent('Print_Summary', 'click', 'Shipping_Address_Changed');
            GlobalData.printData.redirectURL = '#/print/shipping';
            GlobalData.printData.summaryModify = true;
            PrintOrderSummaryView.redirectToPages();
        };

        this.redirectToCard = function (event) {
            event.stopPropagation();
            GlobalData.ec.recordClickEvent('Print_Summary', 'click', 'Payment_Card_Changed');
            GlobalData.printData.redirectURL = '#/print/card';
            PrintOrderSummaryView.redirectToPages();
        };
        this.redirectToBilling = function (event) {
            event.stopPropagation();
            GlobalData.ec.recordClickEvent('Print_Summary', 'click', 'Billing_Address_Changed');
            GlobalData.printData.action = 'edit';
            GlobalData.printData.redirectURL = '#/print/billing/address';
            PrintOrderSummaryView.redirectToPages();
        };

        this.redirectToDelivery = function (event) {
            event.stopPropagation();
            GlobalData.ec.recordClickEvent('Print_Summary', 'click', 'Delivery_Option_Changed');
            GlobalData.printData.redirectURL = '#/print/deliveryoption';
            GlobalData.printData.summaryModify = true;
            PrintOrderSummaryView.redirectToPages();
        };

        this.placeOrder = function (event) {
            event.stopPropagation();
            jQuery('body > .pageload').fadeIn();
            GlobalData.ec.recordClickEvent('Print_Summary', 'click', 'Place_Order');

            var dataSrc = GlobalData.printData;
            var requestData = null;
            var promise = null;
            if (!_.isUndefined(GlobalData.printData.cart_id)) {
                requestData = {
                    "cart_id": dataSrc.cart_id,
                    "device_data": dataSrc.deviceData,
                    "payment_method_token": dataSrc.selectedCard.paymentToken,
                    "transactionAmount": dataSrc.cartData.order_total
                };
                //console.dir(requestData);
                promise = PrintService.placeOrder(requestData);
                $.when(promise)
                    .done(function (obj) {
                        console.log('placeOrder');
                        console.dir(obj);
                        if (obj.arr_data !== null && obj.int_status_code !== 0) {
                            GlobalData.printData.printOrderPlacedId = (_.isUndefined(obj.arr_data.data.invoice_id)) ? '' : obj.arr_data.data.invoice_id;
                            GlobalData.printData.redirectURL = '#/print/order/finish';
                            window.onbeforeunload = null;

                            var type = null;
                            type = 'Owner';
                            if(GlobalData.storyData.story_belongsto !== 'Owner'){
                                type = 'Recipient';
                            }
                            var pixel_params = null;
                            pixel_params = {
                                            Book_type: dataSrc.bookData.book_size,
                                            User_role: type,
                                            value: dataSrc.cartData.order_total,
                                            currency: 'USD'
                                            };
                            //Fb Pixel
                            GlobalData.ec.recordFBPixelEvent('track', 'Purchase', pixel_params);

                            PrintOrderSummaryView.redirectToPages();
                        } else {
                            console.log('placeOrder API response is null');
                            GlobalData.ec.recordClickEvent('Print_Summary', 'click', 'Place_Order_Failed');
                            
                            jQuery('body > .pageload').fadeOut();
                            messagesView.addToDiv();
                            jQuery('.dialog-with-head').modal('show');
                            messagesView.messageMiddle();
                            jQuery('#dialog-with-head-header').find('h4').text('Error');
                            jQuery('#dialog-with-head-content').text('Oops! something went wrong.');
                            jQuery('#dialog-with-head-action').parent().css("display","block");
                            jQuery('#dialog-with-head-action').text('Ok');
                            jQuery('#dialog-with-head-action').click(function(event){
                                event.stopPropagation();
                                jQuery('.dialog-with-head').modal('hide');
                            });
                        }
                    });
            } else {
                jQuery('body > .pageload').fadeOut();
                console.log('cart_id is undefined');
                messagesView.addToDiv();
                jQuery('.dialog-with-head').modal('show');
                messagesView.messageMiddle();
                jQuery('#dialog-with-head-header').find('h4').text('Error');
                jQuery('#dialog-with-head-content').text('Oops! something went wrong.');
                jQuery('#dialog-with-head-action').parent().css("display","block");
                jQuery('#dialog-with-head-action').text('Ok');
                jQuery('#dialog-with-head-action').click(function(event){
                    event.stopPropagation();
                    jQuery('.dialog-with-head').modal('hide');
                });
            }
        };

        this.availDiscount = function (event) {
            if (event) {
                event.stopPropagation();
            }
            GlobalData.ec.recordClickEvent('Print_Summary', 'click', 'Have_A_Coupon');
            GlobalData.printData.redirectURL = '#/print/order/discount';
            PrintOrderSummaryView.redirectToPages();
        };

        this.redirectToPages = function () {
            Lockr.set('printData', GlobalData.printData);
            location.hash = GlobalData.printData.redirectURL;
        };
    });

    return PrintOrderSummaryView;
});