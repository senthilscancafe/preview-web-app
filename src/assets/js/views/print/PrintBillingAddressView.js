/*global define, jQuery*/

define(['Augment',
    'Instance',
    'GlobalData',
    'PubSub',
    'utils/CookieUtils',
    'services/PrintService',
    'views/messages/MessagesView',
    'xss',
    'hbs/underscore',
    'lockr',
    'hbs!views/print/templates/PrintBillingAddressView'
], function (augment, instance, GlobalData, PubSub, CookieUtils, PrintService, MessagesView, xss, _, Lockr, tplPrintBillingAddressView) {
    'use strict';

    var PrintBillingAddressView = augment(instance, function () {
        var printBillingAddressView = this;
        this.payload = null;
        var messagesView = '';
        printBillingAddressView.stateList = {
            "AL": "ALABAMA",
            "AK": "ALASKA",
            "AZ": "ARIZONA",
            "AR": "ARKANSAS",
            "CA": "CALIFORNIA",
            "CO": "COLORADO",
            "CT": "CONNECTICUT",
            "DE": "DELAWARE",
            "FL": "FLORIDA",
            "GA": "GEORGIA",
            "HI": "HAWAII",
            "ID": "IDAHO",
            "IL": "ILLINOIS",
            "IN": "INDIANA",
            "IA": "IOWA",
            "KS": "KANSAS",
            "KY": "KENTUCKY",
            "LA": "LOUISIANA",
            "ME": "MAINE",
            "MD": "MARYLAND",
            "MA": "MASSACHUSETTS",
            "MI": "MICHIGAN",
            "MN": "MINNESOTA",
            "MS": "MISSISSIPPI",
            "MO": "MISSOURI",
            "MT": "MONTANA",
            "NE": "NEBRASKA",
            "NV": "NEVADA",
            "NH": "NEW HAMPSHIRE",
            "NJ": "NEW JERSEY",
            "NM": "NEW MEXICO",
            "NY": "NEW YORK",
            "NC": "NORTH CAROLINA",
            "ND": "NORTH DAKOTA",
            "OH": "OHIO",
            "OK": "OKLAHOMA",
            "OR": "OREGON",
            "PA": "PENNSYLVANIA",
            "RI": "RHODE ISLAND",
            "SC": "SOUTH CAROLINA",
            "SD": "SOUTH DAKOTA",
            "TN": "TENNESSEE",
            "TX": "TEXAS",
            "UT": "UTAH",
            "VT": "VERMONT",
            "VA": "VIRGINIA",
            "WA": "WASHINGTON",
            "WV": "WEST VIRGINIA",
            "WI": "WISCONSIN",
            "WY": "WYOMING"
        };
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
            
            if (!_.isUndefined(GlobalData.printData)) {
                if (GlobalData.printData.action === 'edit') {
                    printBillingAddressView.editMode();
                } else {
                    printBillingAddressView.addMode();
                }
            }
            messagesView = MessagesView.create();

            //enable disable submit button
            $(":input").bind("keyup change", function(event) {
                event.stopPropagation();
                //console.log('dwdwdw '+$(this).val());
                printBillingAddressView.activateSubmitButton();
                
            });
        };

        this.activateSubmitButton = function (){
            var empty = $('.printFormBody').find("input").not( "#billingAddress2" ).filter(function() {
                return this.value === "";
            });
            if(empty.length) {
                //At least one input is empty
                jQuery('#saveBillingData').addClass('disabled').off( "click", printBillingAddressView.submitCardDetails );
            }else{
                jQuery('#saveBillingData').removeClass('disabled').off("click").on( "click", printBillingAddressView.submitCardDetails );
            }
        };

        this.preloader = function () {
            jQuery('body > .pageload').fadeOut();
            //$("#saveBillingData").click(printBillingAddressView.submitCardDetails);
        };

        this.submitCardDetails = function (event) {
            event.stopPropagation();
            var promise = null;
            var billData = null;
            var dataSrc = GlobalData.printData;
            var requestData = {};
            var words = null;
            var firstName = null;
            var lastName = null;

            if (GlobalData.printData.action === 'edit') {
                console.log('billing address updation');
                billData = printBillingAddressView.validation();
                console.dir(billData);
                if (billData) {
                    requestData.pg_customer_id = dataSrc.pg_customer_id;
                    requestData.pg_billing_address_id = dataSrc.selectedCard.billingAddress.billingAddressId;
                    requestData.name = billData.customerfirstname;
                    requestData.street_address = billData.address1;
                    requestData.extended_address = billData.address2;
                    requestData.country_name = billData.country;
                    requestData.locality = billData.city;
                    requestData.region = billData.state;
                    requestData.postal_code = billData.zip;
                    console.dir(requestData);
                    //build firstName and lastName
                    words = requestData.name.split(' ');
                    firstName = words[0];
                    lastName = words.slice(1, words.length).join(' ');

                    promise = PrintService.putBillingDetails(requestData);

                    $.when(promise)
                        .done(function (obj) {
                            console.dir(obj);
                            if (obj.arr_data !== null && obj.int_status_code !== 0) {
                                //update selected card data billing address in GlobalData
                                GlobalData.printData.selectedCard.billingAddress.firstName = firstName;
                                GlobalData.printData.selectedCard.billingAddress.lastName = lastName;
                                GlobalData.printData.selectedCard.billingAddress.streetAddress = requestData.street_address;
                                GlobalData.printData.selectedCard.billingAddress.extendedAddress = requestData.extended_address;
                                GlobalData.printData.selectedCard.billingAddress.locality = requestData.locality;
                                GlobalData.printData.selectedCard.billingAddress.region = requestData.region;
                                GlobalData.printData.selectedCard.billingAddress.postalCode = requestData.postal_code;

                                GlobalData.printData.redirectURL = '#/print/order/summary';
                                printBillingAddressView.redirectToPages();
                            } else {
                                console.log('putBillingDetails API response is null');
                                messagesView.addToDiv();
                                jQuery('.alertDialog').modal('show');
                                jQuery('#displayText').text(obj.str_status_message);
                            }
                        });
                }

            } else {
                billData = printBillingAddressView.validation();
                console.dir(billData);
                if (billData) {
                    requestData.customer_id = CookieUtils.getCookie("custId");
                    requestData.pg_customer_id = dataSrc.pg_customer_id;
                    requestData.nonce = dataSrc.temp.nonce;
                    requestData.cardholder_name = dataSrc.temp.cardName;
                    requestData.billing_details_customer_name = billData.customerfirstname;
                    requestData.street_address = billData.address1;
                    requestData.extended_address = billData.address2;
                    requestData.postal_code = billData.zip;
                    requestData.device_data = dataSrc.deviceData;

                    requestData.country_code_alpha2 = 'US';
                    requestData.country_code_alpha3 = 'USA';
                    requestData.country_code_numeric = '840';
                    requestData.country = billData.country;
                    requestData.city = billData.city;
                    requestData.state = billData.state;

                    //console.dir(requestData);
                    console.log(JSON.stringify(requestData));
                    promise = PrintService.addCard(requestData);

                    $.when(promise)
                        .done(function (obj) {
                            console.dir(obj);
                            if (obj.arr_data !== null && obj.int_status_code !== 0) {
                                GlobalData.printData.pg_customer_id = (_.isUndefined(obj.arr_data.pg_customer_id)) ? '' : obj.arr_data.pg_customer_id;
                                GlobalData.printData.selectedCard = obj.arr_data.payment_method;
                                //console.dir(GlobalData.printData);
                                printBillingAddressView.continuePayment();
                            } else {
                                console.log('submitCardDetails addCard API response is null');
                                
                                
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
                                    printBillingAddressView.redirectToPages();
                                });
                                
                            }
                        });
                }
            }
        };

        this.validation = function () {
            //XSS filter
            var options = {
                whiteList: [], // empty, means filter out all tags
                //stripIgnoreTag:     true,      // filter out all HTML not in the whilelist
                stripIgnoreTagBody: true, // the script tag is a special case, we need to filter out its content
            };
            printBillingAddressView.billingName = xss($.trim($('#billingName').val()), options);
            printBillingAddressView.billingAddress1 = xss($.trim($('#billingAddress1').val()), options);
            printBillingAddressView.billingAddress2 = xss($.trim($('#billingAddress2').val()), options);
            printBillingAddressView.billingCity = xss($.trim($('#billingCity').val()), options);
            printBillingAddressView.billingState = xss($.trim($('#billingState').val()), options);
            printBillingAddressView.billingZIP = xss($.trim($('#billingZIP').val()), options);
            printBillingAddressView.billingCountry = xss($.trim($('#billingCountry').val()), options);

            var obj = null;
            $('.errorLabel').css({
                'display': 'none'
            });
            if (printBillingAddressView.billingName.length === 0) {
                obj = $("#billingName").parent().find("label.errorLabel");
                obj.text('Full name field cannot be blank.').show();
                return false;
            }
            if (printBillingAddressView.billingAddress1.length === 0) {
                obj = $("#billingAddress1").parent().find("label.errorLabel");
                obj.text(' Address line 1 field cannot be blank.').show();
                return false;
            }

            if (printBillingAddressView.billingCity.length === 0) {
                obj = $("#billingCity").parent().find("label.errorLabel");
                obj.text('City field cannot be blank.').show();
                return false;
            }
            if (printBillingAddressView.billingState.length === 0) {
                obj = $("#billingState").parent().find("label.errorLabel");
                obj.text('State/Province/Region cannot be blank.').show();
                return false;
            }

            //consider state entered as uppercase always
            printBillingAddressView.billingState = printBillingAddressView.billingState.toUpperCase();

            var stateListName = _.values(printBillingAddressView.stateList);
            if (!(printBillingAddressView.billingState in printBillingAddressView.stateList) && !_.contains(stateListName, printBillingAddressView.billingState)) {
                obj = $("#billingState").parent().find("label.errorLabel");
                obj.text('Please enter a valid state.').show();
                return false;
            }

            if (printBillingAddressView.billingZIP.length === 0) {
                obj = $("#billingZIP").parent().find("label.errorLabel");
                obj.text('ZIP field cannot be blank.').show();
                return false;
            }

            var isValidZIP = /^\d{5}(?:-\d{4})?$/.test(printBillingAddressView.billingZIP);
            if (!isValidZIP) {
                obj = $("#billingZIP").parent().find("label.errorLabel");
                obj.text('Please enter a valid zip code.').show();
                return false;
            }

            /*if(printBillingAddressView.billingPhone.length === 0){
                obj = $("#billingPhone").parent().find("label.errorLabel");
                obj.text('Phone number cannot be blank').show();
                return false;
            }
            var isValidPhone =/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/.test(printBillingAddressView.billingPhone);
            if(!isValidPhone){
                obj = $("#billingPhone").parent().find("label.errorLabel");
                obj.text('Please enter a valid phone number').show();
                return false;
            }*/

            var data = null;
            data = {
                "customerfirstname": printBillingAddressView.billingName,
                "address1": printBillingAddressView.billingAddress1,
                "address2": printBillingAddressView.billingAddress2,
                "city": printBillingAddressView.billingCity,
                "address_type": "2",
                "state": printBillingAddressView.billingState,
                "country": printBillingAddressView.billingCountry,
                "zip": printBillingAddressView.billingZIP,
                "userid": CookieUtils.getCookie("custId"),
                "apimode": "web",
                //"address_id":"197",
                //"phone" : printBillingAddressView.billingPhone,
                //"customerlastname":"testlastname"// not used
            };
            return data;
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
                            printBillingAddressView.redirectToPages();
                        } else {
                            console.log('printBillingAddressView createCart API response is null');
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
                    "promoType": 0,
                    "ship_to_zip_code": dataSrc.shippingAddress.zip,
                    "couponCode": (_.isUndefined(dataSrc.coupon)) ? null : dataSrc.coupon.couponCode,
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
                            printBillingAddressView.redirectToPages();
                        } else {
                            console.log('printBillingAddressView updateCart API response is null');
                            messagesView.addToDiv();
                            jQuery('.alertDialog').modal('show');
                            jQuery('#displayText').text(obj.str_status_message);
                        }
                    });
            }
        };

        this.addMode = function () {
            var divClass = "printContainer";
            var innerHtml = tplPrintBillingAddressView({
                heading: 'Billing Address',
                submitLabel: 'Continue',
                country: 'United States'
            });
            jQuery('.' + divClass).empty();
            jQuery('.' + divClass).html(innerHtml);
            jQuery('#saveBillingData').addClass('disabled');
            jQuery('.page-loading').css('overflow', 'auto');
            printBillingAddressView.preloader();
        };

        this.editMode = function () {
            var dataSrc = GlobalData.printData;

            var divClass = "printContainer";
            printBillingAddressView.payload = {
                heading: 'Billing Address',
                submitLabel: 'Continue',
                country: 'United States',
                name : dataSrc.selectedCard.billingAddress.firstName +' '+ dataSrc.selectedCard.billingAddress.lastName,
                address1 : dataSrc.selectedCard.billingAddress.streetAddress,
                address2 : dataSrc.selectedCard.billingAddress.extendedAddress,
                city : dataSrc.selectedCard.billingAddress.locality,
                state : dataSrc.selectedCard.billingAddress.region,
                zip : dataSrc.selectedCard.billingAddress.postalCode,
            };
            var innerHtml = tplPrintBillingAddressView(printBillingAddressView.payload);
            jQuery('.' + divClass).empty();
            jQuery('.' + divClass).html(innerHtml);
            jQuery('#saveBillingData').removeClass('disabled').off("click").on( "click", printBillingAddressView.submitCardDetails );
            printBillingAddressView.preloader();

            console.clear();
            //todo: make a function for delete keys
            delete printBillingAddressView.payload.heading;
            delete printBillingAddressView.payload.submitLabel;
            delete printBillingAddressView.payload.address2;
            delete printBillingAddressView.payload.country;
            console.dir(printBillingAddressView.payload);
            _.any(_.values(printBillingAddressView.payload), function (v) {
                //console.log(v);
                console.log(_(v).isEmptyORUndefinedORNull());
                if(_(v).isEmptyORUndefinedORNull()) {
                    //At least one input is empty
                    console.log(v);
                    jQuery('#saveBillingData').addClass('disabled').off( "click", printBillingAddressView.submitCardDetails );
                }
            });
        };

        this.redirectToPages = function () {
            Lockr.set('printData', GlobalData.printData);
            location.hash = GlobalData.printData.redirectURL;
        };
    });

    return PrintBillingAddressView;
});