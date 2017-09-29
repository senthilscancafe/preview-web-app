/*global define, jQuery*/

define(['Augment',
    'Instance',
    'GlobalData',
    'PubSub',
    'utils/CookieUtils',
    'services/PrintService',
    'views/messages/MessagesView',
    'hbs/underscore',
    'lockr',
    'hbs!views/print/templates/PrintCardView'
], function (augment, instance, GlobalData, PubSub, CookieUtils, PrintService, MessagesView, _, Lockr, tplPrintCardView) {
    'use strict';

    var PrintCardView = augment(instance, function () {
        var printCardView = this;
        var messagesView = '';
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
            if (GlobalData.storyData.reOrder) {
                printCardView.listPaymentCardsReOrder();
            } else {
                printCardView.listPaymentCards();
            }
            messagesView = MessagesView.create();
        };

        this.preloader = function () {
            if (GlobalData.printData.selectedCard) {
                jQuery('.cardRadio.active').removeClass('active');
                jQuery('#' + GlobalData.printData.selectedCard.billingAddress.billingAddressId).addClass('active');
                printCardView.selectedCard = jQuery('.cardRadio.active').attr('id');
                jQuery('#continuePayment').removeClass('disabled').off("click").on("click", printCardView.continuePayment);
            }
            jQuery('body > .pageload').fadeOut();
            jQuery('.addCard').click(printCardView.addCard);
            jQuery('.cardRadio').click(printCardView.selectCardOption);
        };


        this.selectCardOption = function () {
            jQuery('.cardRadio.active').removeClass('active');
            jQuery(this).addClass('active');
            printCardView.selectedCard = jQuery('.cardRadio.active').attr('id');
            //printCardView.getSelectedCardData();
            jQuery('#continuePayment').removeClass('disabled').off("click").on("click", printCardView.continuePayment);
        };

        this.getSelectedCardData = function () {
            if (_.isUndefined(GlobalData.printData.cardList)) {
                console.log('GlobalData.printData.cardList undefined');
            } else {
                for (var i = 0; i < GlobalData.printData.cardList.length; i++) {
                    if (GlobalData.printData.cardList[i].billingAddress.billingAddressId === printCardView.selectedCard) {
                        GlobalData.printData.selectedCard = GlobalData.printData.cardList[i];
                    }
                }
            }
        };

        this.continuePayment = function (event) {
            console.log('called');
            printCardView.getSelectedCardData();
            event.stopPropagation();
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
                            printCardView.redirectToPages();
                        } else {
                            console.log('printCardView createCart API response is null');
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
                            printCardView.redirectToPages();
                        } else {
                            console.log('printCardView updateCart API response is null');
                        }
                    });
            }
        };

        this.addCard = function (event) {
            if (event) {
                event.stopPropagation();
            }
            GlobalData.printData.redirectURL = '#/print/card/add';
            printCardView.redirectToPages();
        };

        this.listPaymentCards = function () {
            //if card exist then show list else add card page
            var requestData = {
                customer_id: CookieUtils.getCookie("custId")
            };
            var promise = PrintService.listPaymentCards(requestData);
            $.when(promise)
                .done(function (obj) {

                    if (obj.arr_data === null && obj.int_status_code === 1) {
                        printCardView.addCard();
                    }
                    
                    if (obj.arr_data !== null && obj.int_status_code === 1) {
                        GlobalData.printData.pg_customer_id = (_.isUndefined(obj.arr_data.pg_customer_id)) ? '' : obj.arr_data.pg_customer_id;
                        GlobalData.printData.cardList = obj.arr_data.payment_method;
                        console.log(GlobalData.printData.cardList);
                        var divClass = "printContainer";
                        var innerHtml = tplPrintCardView({
                            heading: 'Select Card',
                            submitLabel: 'Continue',
                            cardList: GlobalData.printData.cardList,
                            addCard: 'Add a new card'
                        });
                        jQuery('.' + divClass).empty();
                        jQuery('.' + divClass).html(innerHtml);
                        /*if (GlobalData.printData.cardList.length > 0) {
                            jQuery('.cardRadio:first').addClass('active');
                        }*/
                        jQuery('.page-loading').css('overflow', 'auto');
                        jQuery('.printFormPrimaryBtn').addClass('disabled');                         
                        printCardView.preloader();
                    } 
                    
                    if (obj.arr_data !== null && obj.int_status_code === 0) {
                        console.log('listPaymentCards API response is null');
                        jQuery('body > .pageload').fadeOut();
                        messagesView.addToDiv();
                        jQuery('.dialog-with-head').modal('show');
                        messagesView.messageMiddle();
                        jQuery('#dialog-with-head-header').find('h4').text('Error');
                        jQuery('#dialog-with-head-content').text(obj.str_status_message);
                        jQuery('#dialog-with-head-action').parent().css("display","block");
                        jQuery('#dialog-with-head-action').text('Ok');
                        jQuery('#dialog-with-head-action').click(function(event){
                            event.stopPropagation();
                            jQuery('.dialog-with-head').modal('hide');
                            GlobalData.printData.redirectURL = '#/print/deliveryoption';
                            printCardView.redirectToPages();
                        });
                    }
                });
        };

        this.listPaymentCardsReOrder = function () {
            //if card exist then show list else add card page
            var requestData = {
                customer_id: CookieUtils.getCookie("custId"),
                print_order_id: GlobalData.printData.print_order_id
            };
            var promise = PrintService.listPaymentCardsReOrder(requestData);
            $.when(promise)
                .done(function (obj) {

                    if (obj.arr_data === null && obj.int_status_code === 1) {
                        printCardView.addCard();
                    }

                    if (obj.arr_data !== null && obj.int_status_code === 1) {
                        GlobalData.printData.pg_customer_id = (_.isUndefined(obj.arr_data.pg_customer_id)) ? '' : obj.arr_data.pg_customer_id;
                        GlobalData.printData.cardList = obj.arr_data.payment_method;
                        console.log(GlobalData.printData.cardList);
                        var divClass = "printContainer";
                        var innerHtml = tplPrintCardView({
                            heading: 'Select Card',
                            submitLabel: 'Continue',
                            cardList: GlobalData.printData.cardList,
                            addCard: 'Add a new card'
                        });
                        jQuery('.' + divClass).empty();
                        jQuery('.' + divClass).html(innerHtml);
                        jQuery('.printFormPrimaryBtn').addClass('disabled');

                        //to make the card selected which was used to place order previously
                        GlobalData.printData.selectedCard = {
                            billingAddress: {
                                billingAddressId: GlobalData.printData.cardList[0].billingAddress.billingAddressId
                            }
                        };

                        printCardView.preloader();
                    } 
                    
                    if (obj.arr_data !== null && obj.int_status_code === 0) {
                        console.log('listPaymentCardsReOrder API response is null');
                        jQuery('body > .pageload').fadeOut();
                        messagesView.addToDiv();
                        jQuery('.dialog-with-head').modal('show');
                        messagesView.messageMiddle();
                        jQuery('#dialog-with-head-header').find('h4').text('Error');
                        jQuery('#dialog-with-head-content').text(obj.str_status_message);
                        jQuery('#dialog-with-head-action').parent().css("display","block");
                        jQuery('#dialog-with-head-action').text('Ok');
                        jQuery('#dialog-with-head-action').click(function(event){
                            event.stopPropagation();
                            jQuery('.dialog-with-head').modal('hide');
                            GlobalData.printData.redirectURL = '#/print/deliveryoption';
                            printCardView.redirectToPages();
                        });
                    }
                });


        };


        this.redirectToPages = function () {
            Lockr.set('printData', GlobalData.printData);
            location.hash = GlobalData.printData.redirectURL;
        };

    });

    return PrintCardView;
});