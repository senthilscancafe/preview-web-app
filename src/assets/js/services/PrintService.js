/*global define, jQuery*/

define(['Augment',
    'Instance',
    'GlobalData',
    'utils/CookieUtils',
    'utils/LogoutUtils',
    'lockr',
    'views/messages/MessagesView',
], function (augment, instance, GlobalData, CookieUtils, LogoutUtils, Lockr, MessagesView) {
    'use strict';

    var PrintService = augment(instance, function () {
            var printService = this;
            var messagesView = '';
            this.init = function () {
                messagesView = MessagesView.create();
            };

            this.sessionOut = function () {
                jQuery('.pageload').hide();
                messagesView.addToDiv();
                jQuery('.dialog-with-head').modal('show');
                messagesView.messageMiddle();
                jQuery('#dialog-with-head-header').find('h4').text('Session Expired!');
                jQuery('#dialog-with-head-content').text("Looks like you have been logged out. Please login again to continue.");
                jQuery('#dialog-with-head-action').parent().show();
                jQuery('#dialog-with-head-action').text('OK');
                jQuery('#dialog-with-head-action').click(function (event) {
                    Lockr.rm('storyData');
                    Lockr.rm('printData');
                    Lockr.rm('storyDataBKP');
                    Lockr.rm('printDataBKP');
                    window.onbeforeunload = null;
                    window.location.hash = '#/login';
                });
            };

            this.getProducts = function (dashdata) {
                if (CookieUtils.getCookie('custId') === 'undefined' || dashdata.tracking_id === "" || dashdata.tracking_id === 'undefined') {
                    printService.sessionOut();
                } else {
                    var deferred = jQuery.Deferred();
                    var url = GlobalData.baseUrlNew + '/customers/print-orders/product/' + CookieUtils.getCookie('custId');
                    jQuery.ajax({
                        url: url,
                        dataType: "json",
                        contentType: "application/json",
                        type: "GET",
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('x-api-session-key', CookieUtils.getCookie("sessionKey"));
                            xhr.setRequestHeader('version', 2);
                        }
                    }).done(function (data) {
                        if (data.int_status_code === 2) {
                            if (data.str_status_message === "Invalid Session key. Please Login again") {
                                printService.sessionOut();
                            }
                        } else {
                            deferred.resolve(data);
                        }
                    }).fail(function (jqXHR, textStatus, errorThrown) {

                        deferred.reject(jqXHR, textStatus, errorThrown);
                    });
                    return deferred.promise();
                }
            };


            this.getProductDetails = function (dashdata) {
                if (CookieUtils.getCookie('custId') === 'undefined' || dashdata.tracking_id === "" || dashdata.tracking_id === 'undefined') {
                    printService.sessionOut();
                } else {
                    var deferred = jQuery.Deferred();
                    var url = GlobalData.baseUrlNew + '/customers/orders/' + dashdata.tracking_id;
                    jQuery.ajax({
                        url: url,
                        dataType: "json",
                        contentType: "application/json",
                        type: "GET",
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('x-api-session-key', CookieUtils.getCookie("sessionKey"));
                            xhr.setRequestHeader('version', 1);
                        }
                    }).done(function (data) {
                        if (data.int_status_code === 2) {
                            if (data.str_status_message === "Invalid Session key. Please Login again") {
                                printService.sessionOut();
                            }
                        } else {
                            deferred.resolve(data);
                        }
                    }).fail(function (jqXHR, textStatus, errorThrown) {

                        deferred.reject(jqXHR, textStatus, errorThrown);
                    });
                    return deferred.promise();
                }
            };


            this.getShippingDetails = function (dashdata) {
                if (CookieUtils.getCookie('custId') === 'undefined' || dashdata.account_id === 'undefined' || dashdata.account_id === "") {
                    printService.sessionOut();
                } else {
                    var deferred = jQuery.Deferred();
                    var url = GlobalData.baseUrlNew + '/customers/shipping-address/' + dashdata.account_id;
                    jQuery.ajax({
                        url: url,
                        dataType: "json",
                        contentType: "application/json",
                        type: "GET",
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('x-api-session-key', CookieUtils.getCookie("sessionKey"));
                            xhr.setRequestHeader('version', 1);
                        }
                    }).done(function (data) {
                        if (data.int_status_code === 2) {
                            if (data.str_status_message === "Invalid Session key. Please Login again") {
                                printService.sessionOut();
                            }
                        } else {
                            deferred.resolve(data);
                        }
                    }).fail(function (jqXHR, textStatus, errorThrown) {

                        deferred.reject(jqXHR, textStatus, errorThrown);
                    });
                    return deferred.promise();
                }
            };

            //request params: {"customerfirstname":"Sateesh TestSC","address1":"Test","address2":"Testsc","city":"BANGALORE","address_type":"2","state":"BANGALORE","country":"INDIA","zip":"560066","userid":"5695","apimode":"mobile","address_id":"197","phone":"7345551212","customerlastname":"testlastname"}
            //used for both add(remove address_id param) and edit
            this.putShippingDetails = function (addressInfo) {
                if (CookieUtils.getCookie('custId') === 'undefined') {
                    printService.sessionOut();
                } else {
                    var deferred = jQuery.Deferred();
                    var url = GlobalData.baseUrlNew + '/customers/shipping-address';
                    jQuery.ajax({
                        url: url,
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify(addressInfo),
                        type: "PUT",
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('x-api-session-key', CookieUtils.getCookie("sessionKey"));
                            xhr.setRequestHeader('version', 1);
                        }
                    }).done(function (data) {
                        if (data.int_status_code === 2) {
                            if (data.str_status_message === "Invalid Session key. Please Login again") {
                                printService.sessionOut();
                            }
                        } else {
                            deferred.resolve(data);
                        }
                    }).fail(function (jqXHR, textStatus, errorThrown) {

                        deferred.reject(jqXHR, textStatus, errorThrown);
                    });
                    return deferred.promise();
                }
            };

            //request params: {"address_id" : 6828,"customer_id" : 1501}
            this.deleteShippingDetails = function (requestData) {
                if (CookieUtils.getCookie('custId') === 'undefined') {
                    printService.sessionOut();
                } else {
                    var deferred = jQuery.Deferred();
                    var url = GlobalData.baseUrlNew + '/customers/shipping-address/mark-deletion';
                    jQuery.ajax({
                        url: url,
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify(requestData),
                        type: "PUT",
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('x-api-session-key', CookieUtils.getCookie("sessionKey"));
                            xhr.setRequestHeader('version', 1);
                        }
                    }).done(function (data) {
                        if (data.int_status_code === 2) {
                            if (data.str_status_message === "Invalid Session key. Please Login again") {
                                printService.sessionOut();
                            }
                        } else {
                            deferred.resolve(data);
                        }
                    }).fail(function (jqXHR, textStatus, errorThrown) {

                        deferred.reject(jqXHR, textStatus, errorThrown);
                    });
                    return deferred.promise();
                }
            };


            this.deliveryOptions = function (dashdata) {
                if (CookieUtils.getCookie('custId') === 'undefined') {
                    printService.sessionOut();
                } else {
                    var deferred = jQuery.Deferred();
                    var url = GlobalData.baseUrlNew + '/customers/print-orders/ship-methods/'+dashdata.print_partner_id;
                    jQuery.ajax({
                        url: url,
                        dataType: "json",
                        contentType: "application/json",
                        type: "GET",
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('x-api-session-key', CookieUtils.getCookie("sessionKey"));
                            xhr.setRequestHeader('version', 2);
                        }
                    }).done(function (data) {
                        if (data.int_status_code === 2) {
                            if (data.str_status_message === "Invalid Session key. Please Login again") {
                                printService.sessionOut();
                            }
                        } else {
                            deferred.resolve(data);
                        }
                    }).fail(function (jqXHR, textStatus, errorThrown) {

                        deferred.reject(jqXHR, textStatus, errorThrown);
                    });
                    return deferred.promise();
                }
            };

            this.listPaymentCards = function (dashdata) {
                if (CookieUtils.getCookie('custId') === 'undefined' || dashdata.customer_id === "" || dashdata.customer_id === 'undefined') {
                    printService.sessionOut();
                } else {
                    var deferred = jQuery.Deferred();
                    var url = GlobalData.baseUrlNew + '/customers/print-orders/pg/' + dashdata.customer_id;
                    jQuery.ajax({
                        url: url,
                        dataType: "json",
                        contentType: "application/json",
                        type: "GET",
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('x-api-session-key', CookieUtils.getCookie("sessionKey"));
                            xhr.setRequestHeader('version', 1);
                        }
                    }).done(function (data) {
                        if (data.int_status_code === 2) {
                            if (data.str_status_message === "Invalid Session key. Please Login again") {
                                printService.sessionOut();
                            }
                        } else {
                            deferred.resolve(data);
                        }
                    }).fail(function (jqXHR, textStatus, errorThrown) {

                        deferred.reject(jqXHR, textStatus, errorThrown);
                    });
                    return deferred.promise();
                }
            };

            this.listPaymentCardsReOrder = function (dashdata) {
                if (CookieUtils.getCookie('custId') === 'undefined' || dashdata.print_order_id === "" || dashdata.print_order_id === 'undefined') {
                    printService.sessionOut();
                } else {
                    var deferred = jQuery.Deferred();
                    var url = GlobalData.baseUrlNew + '/customers/print-orders/pg/re-order/' + dashdata.customer_id + '/' + dashdata.print_order_id;
                    jQuery.ajax({
                        url: url,
                        dataType: "json",
                        contentType: "application/json",
                        type: "GET",
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('x-api-session-key', CookieUtils.getCookie("sessionKey"));
                            xhr.setRequestHeader('version', 1);
                        }
                    }).done(function (data) {
                        if (data.int_status_code === 2) {
                            if (data.str_status_message === "Invalid Session key. Please Login again") {
                                printService.sessionOut();
                            }
                        } else {
                            deferred.resolve(data);
                        }
                    }).fail(function (jqXHR, textStatus, errorThrown) {

                        deferred.reject(jqXHR, textStatus, errorThrown);
                    });
                    return deferred.promise();
                }
            };

            //request params: {"customer_id":"5695"}
            this.pgClientToken = function (requestData) {
                if (CookieUtils.getCookie('custId') === 'undefined') {
                    printService.sessionOut();
                } else {
                    var deferred = jQuery.Deferred();
                    var url = GlobalData.baseUrlNew + '/customers/print-orders/pg/token';
                    jQuery.ajax({
                        url: url,
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify(requestData),
                        type: "POST",
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('x-api-session-key', CookieUtils.getCookie("sessionKey"));
                            xhr.setRequestHeader('version', 1);
                        }
                    }).done(function (data) {
                        if (data.int_status_code === 2) {
                            if (data.str_status_message === "Invalid Session key. Please Login again") {
                                printService.sessionOut();
                            }
                        } else {
                            deferred.resolve(data);
                        }
                    }).fail(function (jqXHR, textStatus, errorThrown) {

                        deferred.reject(jqXHR, textStatus, errorThrown);
                    });
                    return deferred.promise();
                }
            };

            this.addCard = function (requestData) {
                if (CookieUtils.getCookie('custId') === 'undefined') {
                    printService.sessionOut();
                } else {
                    var deferred = jQuery.Deferred();
                    var url = GlobalData.baseUrlNew + '/customers/print-orders/pg/payment-method';
                    jQuery.ajax({
                        url: url,
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify(requestData),
                        type: "POST",
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('x-api-session-key', CookieUtils.getCookie("sessionKey"));
                            xhr.setRequestHeader('version', 1);
                        }
                    }).done(function (data) {
                        if (data.int_status_code === 2) {
                            if (data.str_status_message === "Invalid Session key. Please Login again") {
                                printService.sessionOut();
                            }
                        } else {
                            deferred.resolve(data);
                        }
                    }).fail(function (jqXHR, textStatus, errorThrown) {

                        deferred.reject(jqXHR, textStatus, errorThrown);
                    });
                    return deferred.promise();
                }
            };

            /*
                Request Payload
                {
                "user_id": "19",
                "spreads": [
                    "612924",
                    "612925",
                    "612926",
                    "612927",
                    "612928",
                    "612929",
                    "612930"
                ],
                "book_price": "40",
                "discount_amount": "0",
                "address_id": "6980",
                "state":"NY",
                "delivery_option_id":"5",
                "productId":"2",
                "order_id": "990000230",
                "shipping_price":"0.01"
                }
                
                Response
                {
                "arr_data": {
                    "bookprice": "40",
                    "shipping_price": 0.01,
                    "tax": "0.00",
                    "discount_amount": 0,
                    "order_total": "40.01",
                    "cart_id": 726
                },
                "int_status_code": 1,
                "str_status_message": "",
                "str_function_name": "Createcart"
                }
            */

            this.createCart = function (requestData) {
                if (CookieUtils.getCookie('custId') === 'undefined') {
                    printService.sessionOut();
                } else {
                    var deferred = jQuery.Deferred();
                    var url = GlobalData.baseUrlNew + '/customers/print-orders';
                    jQuery.ajax({
                        url: url,
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify(requestData),
                        type: "POST",
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('x-api-session-key', CookieUtils.getCookie("sessionKey"));
                            xhr.setRequestHeader('version', 1);
                        }
                    }).done(function (data) {
                        if (data.int_status_code === 2) {
                            if (data.str_status_message === "Invalid Session key. Please Login again") {
                                printService.sessionOut();
                            }
                        } else {
                            deferred.resolve(data);
                        }
                    }).fail(function (jqXHR, textStatus, errorThrown) {

                        deferred.reject(jqXHR, textStatus, errorThrown);
                    });
                    return deferred.promise();
                }
            };

            this.updateCart = function (requestData) {
                if (CookieUtils.getCookie('custId') === 'undefined') {
                    printService.sessionOut();
                } else {
                    var deferred = jQuery.Deferred();
                    var url = GlobalData.baseUrlNew + '/customers/print-orders';
                    jQuery.ajax({
                        url: url,
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify(requestData),
                        type: "PUT",
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('x-api-session-key', CookieUtils.getCookie("sessionKey"));
                            xhr.setRequestHeader('version', 1);
                        }
                    }).done(function (data) {
                        if (data.int_status_code === 2) {
                            if (data.str_status_message === "Invalid Session key. Please Login again") {
                                printService.sessionOut();
                            }
                        } else {
                            deferred.resolve(data);
                        }
                    }).fail(function (jqXHR, textStatus, errorThrown) {

                        deferred.reject(jqXHR, textStatus, errorThrown);
                    });
                    return deferred.promise();
                }
            };

            //place order from summary page
            //{"cart_id":718,"device_data":{"device_session_id":"d8fa8e2a0e722f7ce4ac8d46173842b5","fraud_merchant_id":"600000"},"payment_method_token":"jb36py","transactionAmount":"15.00"}
            this.placeOrder = function (requestData) {
                if (CookieUtils.getCookie('custId') === 'undefined') {
                    printService.sessionOut();
                } else {
                    var deferred = jQuery.Deferred();
                    var url = GlobalData.baseUrlNew + '/customers/print-orders/place-order';
                    jQuery.ajax({
                        url: url,
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify(requestData),
                        type: "PUT",
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('x-api-session-key', CookieUtils.getCookie("sessionKey"));
                            xhr.setRequestHeader('version', 1);
                        }
                    }).done(function (data) {
                        if (data.int_status_code === 2) {
                            if (data.str_status_message === "Invalid Session key. Please Login again") {
                                printService.sessionOut();
                            }
                        } else {
                            deferred.resolve(data);
                        }
                    }).fail(function (jqXHR, textStatus, errorThrown) {

                        deferred.reject(jqXHR, textStatus, errorThrown);
                    });
                    return deferred.promise();
                }
            };

            this.listPrintedOrders = function (dashdata) {
                if (CookieUtils.getCookie('custId') === 'undefined' || dashdata.customer_id === "" || dashdata.customer_id === 'undefined') {
                    printService.sessionOut();
                } else {
                    var deferred = jQuery.Deferred();
                    var url = GlobalData.baseUrlNew + '/customers/printed-orders-all/' + dashdata.customer_id;
                    jQuery.ajax({
                        url: url,
                        dataType: "json",
                        contentType: "application/json",
                        type: "GET",
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('x-api-session-key', CookieUtils.getCookie("sessionKey"));
                            xhr.setRequestHeader('version', 1);
                        }
                    }).done(function (data) {
                        if (data.int_status_code === 2) {
                            if (data.str_status_message === "Invalid Session key. Please Login again") {
                                printService.sessionOut();
                            }
                        } else {
                            deferred.resolve(data);
                        }
                    }).fail(function (jqXHR, textStatus, errorThrown) {

                        deferred.reject(jqXHR, textStatus, errorThrown);
                    });
                    return deferred.promise();
                }
            };

            ///customer_id/product_id/ship_id/promo_type/page_count
            this.listCoupons = function (dashdata) {
                if (CookieUtils.getCookie('custId') === 'undefined' || dashdata === "" || dashdata === 'undefined') {
                    printService.sessionOut();
                } else {
                    var deferred = jQuery.Deferred();
                    var url = GlobalData.baseUrlNew + '/customers/print-orders/coupons/' + dashdata.customer_id + '/' + dashdata.product_id + '/' + dashdata.ship_id + '/' + dashdata.promo_type + '/' + dashdata.page_count;
                    jQuery.ajax({
                        url: url,
                        dataType: "json",
                        contentType: "application/json",
                        type: "GET",
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('x-api-session-key', CookieUtils.getCookie("sessionKey"));
                            xhr.setRequestHeader('version', 1);
                        }
                    }).done(function (data) {
                        if (data.int_status_code === 2) {
                            if (data.str_status_message === "Invalid Session key. Please Login again") {
                                printService.sessionOut();
                            }
                        } else {
                            deferred.resolve(data);
                        }
                    }).fail(function (jqXHR, textStatus, errorThrown) {

                        deferred.reject(jqXHR, textStatus, errorThrown);
                    });
                    return deferred.promise();
                }
            };

            this.putBillingDetails = function (addressInfo) {
                if (CookieUtils.getCookie('custId') === 'undefined') {
                    printService.sessionOut();
                } else {
                    var deferred = jQuery.Deferred();
                    var url = GlobalData.baseUrlNew + '/customers/print-orders/pg/billing-address';
                    jQuery.ajax({
                        url: url,
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify(addressInfo),
                        type: "PUT",
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('x-api-session-key', CookieUtils.getCookie("sessionKey"));
                            xhr.setRequestHeader('version', 1);
                        }
                    }).done(function (data) {
                        if (data.int_status_code === 2) {
                            if (data.str_status_message === "Invalid Session key. Please Login again") {
                                printService.sessionOut();
                            }
                        } else {
                            deferred.resolve(data);
                        }
                    }).fail(function (jqXHR, textStatus, errorThrown) {

                        deferred.reject(jqXHR, textStatus, errorThrown);
                    });
                    return deferred.promise();
                }
            };

            this.postFeedbackDetails = function (requestData) {
                if (CookieUtils.getCookie('custId') === 'undefined') {
                    printService.sessionOut();
                } else {
                    var deferred = jQuery.Deferred();
                    var url = GlobalData.baseUrlNew + '/feedback';
                    jQuery.ajax({
                        url: url,
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify(requestData),
                        type: "POST",
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('x-api-session-key', CookieUtils.getCookie("sessionKey"));
                            xhr.setRequestHeader('version', 1);
                        }
                    }).done(function (data) {
                        if (data.int_status_code === 2) {
                            if (data.str_status_message === "Invalid Session key. Please Login again") {
                                printService.sessionOut();
                            }
                        } else {
                            deferred.resolve(data);
                        }
                    }).fail(function (jqXHR, textStatus, errorThrown) {

                        deferred.reject(jqXHR, textStatus, errorThrown);
                    });
                    return deferred.promise();
                }
            };

            this.getOrderDetails = function (dashdata) {
                if (CookieUtils.getCookie('custId') === 'undefined' || dashdata.print_order_id === "" || dashdata.print_order_id === 'undefined') {
                    printService.sessionOut();
                } else {
                    var deferred = jQuery.Deferred();
                    var url = GlobalData.baseUrlNew + '/customers/printed-orders/' + dashdata.print_order_id;
                    jQuery.ajax({
                        url: url,
                        dataType: "json",
                        contentType: "application/json",
                        type: "GET",
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('x-api-session-key', CookieUtils.getCookie("sessionKey"));
                            xhr.setRequestHeader('version', 1);
                        }
                    }).done(function (data) {
                        if (data.int_status_code === 2) {
                            if (data.str_status_message === "Invalid Session key. Please Login again") {
                                printService.sessionOut();
                            }
                        } else {
                            deferred.resolve(data);
                        }
                    }).fail(function (jqXHR, textStatus, errorThrown) {

                        deferred.reject(jqXHR, textStatus, errorThrown);
                    });
                    return deferred.promise();
                }
            };

        }),
        printService = PrintService.create();

    return printService;
});