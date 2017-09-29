/*global define, jQuery*/

define(['Augment',
    'Instance',
    'GlobalData',
    'PubSub',
    'views/messages/MessagesView',
    'utils/CookieUtils',
    'services/PrintService',
    'hbs/underscore',
    'lockr',
    'braintree',
    'hostedFields',
    'dataCollector',
    'hbs!views/print/templates/PrintCardAddView'
], function (augment, instance, GlobalData, PubSub, MessagesView, CookieUtils, PrintService, _, Lockr, Braintree, hostedFields, dataCollector, tplPrintCardAddView) {
    'use strict';

    var PrintCardAddView = augment(instance, function () {
        var printCardAddView = this;
        var messagesView = '';
        this.ClientTokenToInitBT = null;
        this.BtInstance = null;
        this.hostedFieldsInstance = null;
        this.cardName = null;
        this.addToDiv = function () {
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
            printCardAddView.getClientTokenToInitBT();

            messagesView = MessagesView.create();
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
                            printCardAddView.ClientTokenToInitBT = obj.arr_data.token;
                            printCardAddView.initializeBT();
                        } else {
                            console.log('pgClientToken API response is null');
                        }
                    });
            }
        };

        this.initializeBT = function () {
            //var form = document.querySelector('#checkout-form');
            //var submit = document.querySelector('input[type="submit"]');
            //console.log(printCardAddView.ClientTokenToInitBT);
            Braintree.create({
                authorization: printCardAddView.ClientTokenToInitBT
            }, function (clientErr, clientInstance) {
                if (clientErr) {
                    console.error(clientErr);
                    return;
                }
                //console.log(Braintree, clientInstance);
                // This example shows Hosted Fields, but you can also use this
                // client instance to create additional components here, such as
                // PayPal or Data Collector.
                printCardAddView.BtInstance = clientInstance;
                printCardAddView.preloader();
                printCardAddView.prepareHostedFields();
                printCardAddView.collectDeviceData();

            });
        };

        this.prepareHostedFields = function () {
            hostedFields.create({
                client: printCardAddView.BtInstance,
                styles: {
                    // Style all elements
                    'input': {
                        //'font-size': '14px'
                        
                    },
                    'input.invalid': {
                        'color': 'red'
                    },
                    'input.valid': {
                        'color': 'black'
                    },
                    // Styling a specific field
                    '.number': {
                        'font-family': 'arial',
                        'font-size': '15px',
                        'color': '#323232'
                    },
                    '.cvv': {
                        'font-family': 'arial',
                        'font-size': '15px',
                        'color': '#323232'
                    },
                    '.expirationMonth': {
                        'font-family': 'arial',
                        'font-size': '15px',
                        'color': '#323232'
                    },
                    '.expirationYear': {
                        'font-family': 'arial',
                        'font-size': '15px',
                        'color': '#323232'
                    }
                },
                fields: {
                    number: {
                        selector: '#card-number',
                        placeholder: 'Card number'
                    },
                    cvv: {
                        selector: '#cvv',
                        placeholder: 'Security code'
                        //type: 'password'
                    },
                    expirationMonth: {
                        selector: '#expiration-month',
                        placeholder: 'Month',
                        select: {
                            options: [
                                '01',
                                '02',
                                '03',
                                '04',
                                '05',
                                '06',
                                '07',
                                '08',
                                '09',
                                '10',
                                '11',
                                '12'
                            ]
                        }
                    },
                    expirationYear: {
                        selector: '#expiration-year',
                        placeholder: 'Year',
                        select: true
                    }
                }
            }, function (hostedFieldsErr, hostedFieldsInstance) {
                if (hostedFieldsErr) {
                    console.error(hostedFieldsErr);
                    return;
                }

                printCardAddView.hostedFieldsInstance = hostedFieldsInstance;
                /*
                function getFieldStatus(){
                    var state = hostedFieldsInstance.getState();
                    var formValid = Object.keys(state.fields).every(function (key) {
                    return state.fields[key].isValid;
                    });
                    if (formValid) {
                    // Tokenize Hosted Fields
                    //console.log('formValid');
                    //jQuery('#cardDataSubmit').removeClass('disabled').click(printCardAddView.submitCardDetails);
                    } else {
                    // Let the customer know their fields are invalid
                    //console.log('formINValid');
                    }
                }
                hostedFieldsInstance.on('blur', function (event) {
                    getFieldStatus();
                });
                hostedFieldsInstance.on('focus', function (event) {
                    getFieldStatus();
                });
                */
                jQuery('#cardDataSubmit').removeClass('disabled').click(printCardAddView.submitCardDetails);
            });
        };

        this.collectDeviceData = function () {
            dataCollector.create({
                client: printCardAddView.BtInstance,
                kount: true
            }, function (err, dataCollectorInstance) {
                if (err) {
                    console.dir(err);
                    // Handle error in creation of data collector
                    return;
                }
                // At this point, you should access the dataCollectorInstance.deviceData value and provide it
                // to your server, e.g. by injecting it into your form as a hidden input.
                jQuery('body > .pageload').fadeOut();
                var deviceData = dataCollectorInstance.deviceData;
                GlobalData.printData.deviceData = deviceData;
                console.dir(deviceData);
            });
        };

        this.sendCardDetails = function () {
            //use shipping address as billing address

            //deviceData information
            //Object.assign(obj1, obj2);
            var dataSrc = GlobalData.printData;
            var requestData = {};
            requestData.customer_id = CookieUtils.getCookie("custId");
            requestData.pg_customer_id = dataSrc.pg_customer_id;
            requestData.nonce = dataSrc.temp.nonce;
            requestData.cardholder_name = printCardAddView.cardName;
            requestData.billing_details_customer_name = dataSrc.shippingAddress.address_firstname; //+ ' ' + dataSrc.shippingAddress.address_lastname;
            requestData.street_address = dataSrc.shippingAddress.address1;
            requestData.extended_address = dataSrc.shippingAddress.address2;
            requestData.postal_code = dataSrc.shippingAddress.zip;
            requestData.device_data = dataSrc.deviceData;

            requestData.country_code_alpha2 = 'US';
            requestData.country_code_alpha3 = 'USA';
            requestData.country_code_numeric = '840';
            requestData.country = dataSrc.shippingAddress.country;
            requestData.city = dataSrc.shippingAddress.city;
            requestData.state = dataSrc.shippingAddress.state;

            //console.dir(requestData);
            console.log(JSON.stringify(requestData));
            var promise = PrintService.addCard(requestData);

            $.when(promise)
                .done(function (obj) {
                    console.dir(obj);
                    if (obj.arr_data !== null && obj.int_status_code !== 0) {
                        GlobalData.printData.pg_customer_id = (_.isUndefined(obj.arr_data.pg_customer_id)) ? '' : obj.arr_data.pg_customer_id;
                        GlobalData.printData.selectedCard = obj.arr_data.payment_method;
                        //console.dir(GlobalData.printData);
                        printCardAddView.continuePayment();
                    } else {
                        console.log('addCard API response is null');
                        jQuery('body > .pageload').fadeOut();
                        /*messagesView.addToDiv();
                        jQuery('.alertDialog').modal('show');
                        jQuery('#displayText').text(obj.str_status_message);
                        */
                        messagesView.addToDiv();
                        jQuery('.dialog-with-head').modal('show');
                        messagesView.messageMiddle();
                        //jQuery('#dialog-with-head-header').find('h4').text('Too many cards added!');
                        //jQuery('#dialog-with-head-content').text('You have exceeded the limit of the number of cards that can be added to an account. Please select an existing card.');
                        jQuery('#dialog-with-head-header').find('h4').text('Incorrect Address!');
                        jQuery('#dialog-with-head-content').text(obj.str_status_message);
                        jQuery('#dialog-with-head-action').parent().css("display","block");
                        jQuery('#dialog-with-head-action').text('Ok');
                        jQuery('#dialog-with-head-action').click(function(event){
                            event.stopPropagation();
                            jQuery('.dialog-with-head').modal('hide');
                            GlobalData.printData.redirectURL = '#/print/card';
                            printCardAddView.redirectToPages();
                        });
                    }
                });
        };

        this.continuePayment = function () {
            //call createCart API (if new transaction) or updateCart API (if walking through same transaction)  
            var dataSrc = GlobalData.printData;
            var requestData = null;
            var promise = null;
            if (_.isUndefined(GlobalData.printData.cart_id)) {
                requestData = {
                    "user_id": CookieUtils.getCookie("custId"),
                    "spreads": dataSrc.pageInfo.spreadList,
                    "book_price": dataSrc.pageInfo.amount, //TODO: realtime value from 
                    "discount_amount": null, //will always be 0 at this point
                    "address_id": dataSrc.shippingAddress.address_id,
                    "state": dataSrc.selectedCard.billingAddress.region,
                    "delivery_option_id": dataSrc.deliveryOption.id,
                    "productId": dataSrc.bookData.id,
                    "order_id": GlobalData.storyData.id,
                    "shipping_price": dataSrc.deliveryOption.price
                };
                console.dir(requestData);
                promise = PrintService.createCart(requestData);
                $.when(promise)
                    .done(function (obj) {
                        if (obj.arr_data !== null && obj.int_status_code !== 0) {
                            GlobalData.printData.cart_id = (_.isUndefined(obj.arr_data.cart_id)) ? '' : obj.arr_data.cart_id;
                            GlobalData.printData.cartData = obj.arr_data;

                            GlobalData.printData.redirectURL = '#/print/order/summary';
                            printCardAddView.redirectToPages();
                        } else {
                            console.log('printCardAddView createCart API response is null');
                            messagesView.addToDiv();
                            jQuery('.alertDialog').modal('show');
                            jQuery('#displayText').text(obj.str_status_message);
                        }
                    });
            } else {

                requestData = {
                    "user_id": CookieUtils.getCookie("custId"),
                    "spreads": dataSrc.pageInfo.spreadList,
                    "book_price": dataSrc.pageInfo.amount, //TODO: update with realtime values from pageView
                    "discount_amount": null, //just for API compatibility, no need of this param
                    "address_id": dataSrc.shippingAddress.address_id,
                    "state": dataSrc.selectedCard.billingAddress.region,
                    "delivery_option_id": dataSrc.deliveryOption.id,
                    "productId": dataSrc.bookData.id,
                    "order_id": GlobalData.storyData.id,
                    "shipping_price": dataSrc.deliveryOption.price,
                    "cart_id": dataSrc.cart_id,
                    "coupon_code": (_.isUndefined(dataSrc.couponCode)) ? null : dataSrc.couponCode,
                    "pageCount": dataSrc.pageInfo.pageCount, //TODO: update with realtime values from pageView

                };
                console.dir(requestData);
                promise = PrintService.updateCart(requestData);
                $.when(promise)
                    .done(function (obj) {
                        if (obj.arr_data !== null && obj.int_status_code !== 0) {
                            GlobalData.printData.cart_id = (_.isUndefined(obj.arr_data.cart_id)) ? '' : obj.arr_data.cart_id;
                            GlobalData.printData.cartData = obj.arr_data;

                            GlobalData.printData.redirectURL = '#/print/order/summary';
                            printCardAddView.redirectToPages();
                        } else {
                            console.log('printCardAddView updateCart API response is null');
                            messagesView.addToDiv();
                            jQuery('.alertDialog').modal('show');
                            jQuery('#displayText').text(obj.str_status_message);
                        }
                    });
            }



        };

        this.submitCardDetails = function (event) {
            jQuery('body > .pageload').fadeIn();
            event.stopPropagation();
            //console.dir(GlobalData.printData);
            //console.dir(printCardAddView.hostedFieldsInstance);
            GlobalData.printData.temp = {};
            var state = printCardAddView.hostedFieldsInstance.getState();
            var formValid = Object.keys(state.fields).every(function (key) {
                //console.log(state.fields[key]);
                return state.fields[key].isValid;
            });
            if (formValid) {
                // Tokenize Hosted Fields
                console.log('formValid');
            } else {
                // Let the customer know their fields are invalid
                console.log('Hosted fields are invalid');
                jQuery('body > .pageload').fadeOut();

                messagesView.addToDiv();
                jQuery('.dialog-with-head').modal('show');
                messagesView.messageMiddle();
                jQuery('#dialog-with-head-header').find('h4').text('Incorrect card information!');
                jQuery('#dialog-with-head-content').text('Please check your card details.');
                jQuery('#dialog-with-head-action').parent().css("display", "block");
                jQuery('#dialog-with-head-action').text('Ok');
                jQuery('#dialog-with-head-action').click(function(event){console.log('aaaaa');
                    event.stopPropagation();
                    jQuery('.dialog-with-head').modal('hide');
                    GlobalData.ec.recordClickEvent('Print_Card_Add', 'click', 'Invalid_Card_Details');
                });
                return;
            }
            //if(_.isUndefined($.trim($('#card-name').val()))){
            printCardAddView.cardName = $.trim($('#card-name').val());
            if (printCardAddView.cardName.length === 0) {
                console.log('Card name cannot be blank');
                jQuery('body > .pageload').fadeOut();
                /*messagesView.addToDiv();
                jQuery('.alertDialog').modal('show');
                jQuery('#displayText').text('Card name cannot be blank');*/
                //formValid = false;
                messagesView.addToDiv();
                jQuery('.dialog-with-head').modal('show');
                messagesView.messageMiddle();
                jQuery('#dialog-with-head-header').find('h4').text('Incorrect card information!');
                jQuery('#dialog-with-head-content').text('Card name cannot be blank.');
                jQuery('#dialog-with-head-action').parent().css("display","block");
                jQuery('#dialog-with-head-action').text('Ok');
                jQuery('#dialog-with-head-action').click(function(event){console.log('bbbbbb');
                    event.stopPropagation();
                    jQuery('.dialog-with-head').modal('hide');
                    GlobalData.ec.recordClickEvent('Print_Card_Add', 'click', 'Card_Name_Empty');
                });
                return;
            } else {
                GlobalData.printData.temp.cardName = printCardAddView.cardName;
            }

            if (formValid) {
                printCardAddView.hostedFieldsInstance.tokenize(function (tokenizeErr, payload) {
                    if (tokenizeErr) {
                        console.error(tokenizeErr);
                        jQuery('body > .pageload').fadeOut();

                        messagesView.addToDiv();
                        jQuery('.dialog-with-head').modal('show');
                        messagesView.messageMiddle();
                        jQuery('#dialog-with-head-header').find('h4').text('Incorrect card information!');
                        jQuery('#dialog-with-head-content').text('Please check your card details.');
                        jQuery('#dialog-with-head-action').parent().css("display", "block");
                        jQuery('#dialog-with-head-action').text('Ok');
                        jQuery('#dialog-with-head-action').click(function(event){console.log('cccc');
                            event.stopPropagation();
                            jQuery('.dialog-with-head').modal('hide');
                            GlobalData.ec.recordClickEvent('Print_Card_Add', 'click', 'Card_Validation_Failed');
                        });
                        return;
                    }

                    // If this was a real integration, this is where you would
                    // send the nonce to your server.
                    console.log('Got a nonce: ' + payload.nonce);
                    GlobalData.printData.temp.nonce = payload.nonce;

                    if ($('#select-address').is(':checked')) {
                        console.log('shipping address to be used as billing address');
                        printCardAddView.sendCardDetails();
                    } else {
                        GlobalData.printData.action = 'add';
                        GlobalData.printData.redirectURL = '#/print/billing/address';
                        printCardAddView.redirectToPages();
                    }
                });
            }
        };

        this.preloader = function () {
            //jQuery('body > .pageload').fadeOut();
            var divClass = "printContainer";
            console.log(GlobalData.printData);
            var innerHtml = tplPrintCardAddView({
                heading: 'Add a Card',
                blockLabel1: 'Enter your credit card information',
                blockLabel2: 'Expiration date',
                note1: 'Information secured by ',
                note3: '(A PayPal Company)',
                note2: 'You can review this order before you pay.',
                selectAddress: 'Use shipping address as the billing address',
                // streetAddress: GlobalData.printData.shippingAddress.address1,
                // postalCode: GlobalData.printData.shippingAddress.zip,
                cardName: 'Name on card'
            });
            jQuery('.' + divClass).empty();
            jQuery('.' + divClass).html(innerHtml);
            jQuery('.page-loading').css('overflow', 'auto');
            jQuery('.printFormPrimaryBtn').addClass('disabled');
            $("#select-address").attr("checked", "checked");


        };

        this.redirectToPages = function () {
            Lockr.set('printData', GlobalData.printData);
            location.hash = GlobalData.printData.redirectURL;
        };

    });

    return PrintCardAddView;
});