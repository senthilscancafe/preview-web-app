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
    'hbs!views/print/templates/PrintOrderDiscountView'
], function (augment, instance, GlobalData, PubSub, CookieUtils, PrintService, MessagesView, _, Lockr, tplPrintOrderDiscountView) {
    'use strict';

    var PrintOrderDiscountView = augment(instance, function () {
        var printOrderDiscountView = this;
        var messagesView = '';
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
            printOrderDiscountView.listCoupons();
            messagesView = MessagesView.create();
        };

        this.preloader = function () {
            jQuery('body > .pageload').fadeOut();

            //keep both button disabled initially
            jQuery('#applyDiscount, #removeDiscount').addClass('disabled');
            jQuery('#removeDiscount').hide();
            //if user wants to remove discount, populate data in text field and enable remove discount button
            if (!_.isUndefined(GlobalData.printData.coupon)) {
                jQuery('#discount-code').val(GlobalData.printData.coupon.couponCode);
                jQuery('#removeDiscount').show();
                jQuery('#removeDiscount').removeClass('disabled').unbind().click(printOrderDiscountView.removeDiscount);
                //make radio button checked
                //console.log(jQuery('.couponCode').length);
                if(jQuery('.couponCode').length !== 0){
                    jQuery('.couponCode').each(function() {
                        console.log( $(this).text() );
                        if($(this).text() === GlobalData.printData.coupon.couponCode){
                            console.log();
                            $(this).closest('.discountContainer').find('.shareRadio').addClass('active')
                        }
                    });
                }
                
            }

            var discountRequest = null;
            $("#discount-code").keyup(function (event) {
                event.stopPropagation();
                discountRequest = $.trim(jQuery('#discount-code').val());
                if (discountRequest.length !== 0) {
                    jQuery('#applyDiscount').removeClass('disabled').unbind().click(printOrderDiscountView.applyDiscount);
                } else {
                    jQuery('#applyDiscount, #removeDiscount').addClass('disabled').off('click');
                }
            });

            jQuery('.discountContainer').click(printOrderDiscountView.selectDiscountCode);

        };


        this.selectDiscountCode = function () {
            jQuery('#applyDiscount').removeClass('disabled').unbind().click(printOrderDiscountView.applyDiscount);
            jQuery('.discountContainer .active').removeClass('active');
            jQuery(this).find('.shareRadio').addClass('active');
            jQuery('#discount-code').val(jQuery(this).find('.couponCode').text());

        };

        this.applyDiscount = function (event) {
            event.stopPropagation();
            GlobalData.ec.recordClickEvent('Print_Discount', 'click', 'Apply_Discount');
            var dataSrc = GlobalData.printData;
            var requestData = null;
            var promise = null;
            var discountRequest = $.trim(jQuery('#discount-code').val());
            if (discountRequest.length !== 0) {
                if (!_.isUndefined(GlobalData.printData.cart_id)) {
                    requestData = {
                        "address_id": dataSrc.shippingAddress.address_id,
                        "book_price": dataSrc.pageInfo.amount,
                        "cart_id": dataSrc.cart_id,
                        "couponCode": discountRequest,
                        "delivery_option_id": dataSrc.deliveryOption.id,
                        "order_id": GlobalData.storyData.id,
                        "pageCount": dataSrc.pageInfo.pageCount,
                        "productId": dataSrc.bookData.id,
                        "promoType": 0,
                        "ship_to_zip_code": dataSrc.shippingAddress.zip,
                        "shipping_price": dataSrc.deliveryOption.price,
                        "spreads": dataSrc.pageInfo.spreadList,
                        "state": dataSrc.selectedCard.billingAddress.region,
                        "user_id": CookieUtils.getCookie("custId"),
                    };

                    promise = PrintService.updateCart(requestData);
                    $.when(promise)
                        .done(function (obj) {
                            console.dir(obj);
                            if (obj.arr_data !== null && obj.int_status_code !== 0) {
                                GlobalData.printData.coupon = {};
                                GlobalData.printData.cart_id = (_.isUndefined(obj.arr_data.cart_id)) ? '' : obj.arr_data.cart_id;
                                GlobalData.printData.cartData = obj.arr_data;
                                GlobalData.printData.coupon.couponCode = discountRequest;
                                GlobalData.printData.redirectURL = '#/print/order/summary';
                                //GlobalData.ec.recordClickEvent('Print_Discount', 'API', 'Coupon_Success');
                                printOrderDiscountView.redirectToPages();
                            } else {
                                console.log('applyDiscount updateCart API response is null');

                                messagesView.addToDiv();
                                jQuery('.dialog-with-head').modal('show');
                                messagesView.messageMiddle();
                                jQuery('#dialog-with-head-header').find('h4').text('Incorrect coupon code!');
                                jQuery('#dialog-with-head-content').text(obj.str_status_message);
                                jQuery('#dialog-with-head-action').parent().css("display","block");
                                jQuery('#dialog-with-head-action').text('Ok');
                                jQuery('#dialog-with-head-action').click(function(event){
                                    event.stopPropagation();
                                    jQuery('.dialog-with-head').modal('hide');
                                    GlobalData.ec.recordClickEvent('Print_Discount', 'click', 'Coupon_Invalid');
                                });
                            }
                        });
                } else {
                    console.log('cart_id is not defined');
                }
            } else {
                console.log('Please provide discount code.');
            }
        };

        this.removeDiscount = function (event) {
            event.stopPropagation();
            var dataSrc = GlobalData.printData;
            var requestData = null;
            var promise = null;
            var discountRequest = $.trim(jQuery('#discount-code').val());
            if (discountRequest.length !== 0) {
                if (!_.isUndefined(GlobalData.printData.cart_id)) {
                    requestData = {
                        "address_id": dataSrc.shippingAddress.address_id,
                        "book_price": dataSrc.pageInfo.amount,
                        "cart_id": dataSrc.cart_id,
                        "delivery_option_id": dataSrc.deliveryOption.id,
                        "order_id": GlobalData.storyData.id,
                        "pageCount": dataSrc.pageInfo.pageCount,
                        "productId": dataSrc.bookData.id,
                        "promoType": dataSrc.pageInfo.pageCount,
                        "ship_to_zip_code": dataSrc.shippingAddress.zip,
                        "shipping_price": dataSrc.deliveryOption.price,
                        "spreads": dataSrc.pageInfo.spreadList,
                        "state": dataSrc.selectedCard.billingAddress.region,
                        "user_id": CookieUtils.getCookie("custId")
                    };

                    promise = PrintService.updateCart(requestData);
                    $.when(promise)
                        .done(function (obj) {
                            console.dir(obj);
                            if (obj.arr_data !== null && obj.int_status_code !== 0) {
                                GlobalData.printData.cart_id = (_.isUndefined(obj.arr_data.cart_id)) ? '' : obj.arr_data.cart_id;
                                GlobalData.printData.cartData = obj.arr_data;
                                delete GlobalData.printData.coupon;
                                GlobalData.printData.redirectURL = '#/print/order/summary';
                                printOrderDiscountView.redirectToPages();
                            } else {
                                console.log('RemoveDiscount updateCart API response is null');
                                messagesView.addToDiv();
                                jQuery('.alertDialog').modal('show');
                                jQuery('#displayText').text(obj.str_status_message);
                            }
                        });
                } else {
                    console.log('cart_id is not defined');
                }
            } else {
                console.log('Please provide discount code.');
            }
        };

        this.listCoupons = function () {
            if (!_.isUndefined(GlobalData.printData)) {
                var dataSrc = GlobalData.printData;
                var requestData = {
                    customer_id: CookieUtils.getCookie("custId"),
                    product_id: dataSrc.bookData.id,
                    ship_id: dataSrc.deliveryOption.id,
                    promo_type: 2, // 1: Regular, 2: Marketting
                    page_count: dataSrc.pageInfo.pageCount,
                };
                var promise = PrintService.listCoupons(requestData);
                var divClass = null;
                var innerHtml = null;
                $.when(promise)
                    .done(function (obj) {
                        if (obj.arr_data !== null && obj.int_status_code !== 0) {
                            GlobalData.printData.couponsList = obj.arr_data.data;
                            divClass = "printContainer";
                            innerHtml = tplPrintOrderDiscountView({
                                heading: 'Discount Code',
                                submitLabel1: 'Apply',
                                submitLabel2: 'Remove',
                                couponsList: GlobalData.printData.couponsList,
                            });
                            jQuery('.' + divClass).empty();
                            jQuery('.' + divClass).html(innerHtml);
                            //jQuery('#removeDiscount').show();
                            printOrderDiscountView.preloader();
                        } else {
                            console.log('API response is null');
                            divClass = "printContainer";
                            innerHtml = tplPrintOrderDiscountView({
                                heading: 'Discount Code',
                                submitLabel1: 'Apply',
                                submitLabel2: 'Remove',
                                couponsList: false,
                            });
                            jQuery('.' + divClass).empty();
                            jQuery('.' + divClass).html(innerHtml);
                            jQuery('.page-loading').css('overflow', 'auto');
                            printOrderDiscountView.preloader();
                        }
                    });
            }

        };

        this.redirectToPages = function () {
            Lockr.set('printData', GlobalData.printData);
            location.hash = GlobalData.printData.redirectURL;
        };
    });

    return PrintOrderDiscountView;
});