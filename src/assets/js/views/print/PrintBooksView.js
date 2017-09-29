/*global define, jQuery*/

define(['Augment',
    'Instance',
    'GlobalData',
    'PubSub',
    'utils/ObjectHandling',
    'utils/CookieUtils',
    'services/PrintService',
    'views/messages/MessagesView',
    'hbs/underscore',
    'lockr',
    'hbs!views/print/templates/PrintBooksView'
], function (augment, instance, GlobalData, PubSub, ObjectHandling, CookieUtils, PrintService, MessagesView, _, Lockr, tplPrintBooksView) {
    'use strict';

    var PrintBooksView = augment(instance, function () {
        var printBooksView = this;
        var messagesView = '';
        this.addToDiv = function () {
            jQuery('body > .pageload').fadeIn();
            //prepare storyData from orderData
            console.dir(GlobalData.orderData);
            if (!_.isUndefined(GlobalData.orderData)) {
                GlobalData.storyData = {};
                GlobalData.storyData.id = _.isUndefined(GlobalData.orderData.order_id) ? GlobalData.orderData.id : GlobalData.orderData.order_id;
                GlobalData.storyData.pb_tracking_id = GlobalData.orderData.pb_tracking_id;
                GlobalData.storyData.noofpages = _.isUndefined(GlobalData.orderData.noofpages) ? GlobalData.orderData.no_of_spreads : GlobalData.orderData.noofpages;
                GlobalData.storyData.webcoverurl = _.isUndefined(GlobalData.orderData.webcoverurl) ? GlobalData.orderData.cover_url : GlobalData.orderData.webcoverurl;
                GlobalData.storyData.cover_caption = GlobalData.orderData.cover_caption;
                //console.log(GlobalData.storyData.noofpages);
                GlobalData.storyData.noofpages = ((((GlobalData.storyData.noofpages - 2) * 2) < 20 && GlobalData.orderData.reOrder)? 20 : ((GlobalData.storyData.noofpages - 2) * 2));
                GlobalData.storyData.noofSpreads = (GlobalData.storyData.noofpages / 2);
                GlobalData.storyData.reOrder = (GlobalData.orderData.reOrder) ? true : false;
                GlobalData.storyData.story_belongsto = GlobalData.orderData.story_belongsto;
                if (GlobalData.storyData.reOrder) {
                    GlobalData.printData.pageInfo = {
                        spreadList: ObjectHandling.convertArrTOObj(GlobalData.orderData.selectedspreads.split(','))
                    };

                    GlobalData.printData.shippingAddress = {
                        address_id: GlobalData.orderData.address_id
                    };

                    GlobalData.printData.deliveryOption = {
                        id: GlobalData.orderData.delivery_option_id
                    };
                    GlobalData.printData.print_order_id = GlobalData.orderData.id;
                }
                Lockr.set('storyData', GlobalData.storyData);
                printBooksView.getProductData();
            } else {
                console.log('GlobalData.orderData is not defined, taking order data from localstorage');
                if(_.isUndefined(GlobalData.storyData)){
                    GlobalData.storyData = {};
                }
                if(_.isUndefined(GlobalData.printData)){
                    GlobalData.printData = {};
                }
                if(_.isUndefined(Lockr.get('storyData'))){
                    console.log('print flow data invalid, storyData not found');
                    if(!_.isUndefined(Lockr.get('storyDataBKP'))){
                        Lockr.set('storyData', Lockr.get('storyDataBKP'));
                        Lockr.rm('storyDataBKP');
                        GlobalData.storyData = Lockr.get('storyData');
                    }else{
                        window.onbeforeunload = null;
                        location.hash = '#/dashboard';
                        return true;
                    }
                }
                GlobalData.storyData = Lockr.get('storyData');
                //GlobalData.printData = Lockr.get('printData');//not required
                //console.log(GlobalData.printData);
            }
            messagesView = MessagesView.create();
            printBooksView.getProductData();
        };

        this.getProductData = function () {
            if(!_.isUndefined(GlobalData.storyData)){
                var requestData = {
                    tracking_id: GlobalData.storyData.pb_tracking_id
                };
                var promiseOrderInfo = PrintService.getProducts(requestData);
                $.when(promiseOrderInfo)
                    .done(function (data) {
                        //console.log('--------');
                        //console.dir(data);
                        printBooksView.productData = data.arr_data.details;
                        var divClass = "printOuterBox";
                        var innerHtml = tplPrintBooksView({
                            firstBookInfo: printBooksView.productData[0],
                            secondBookInfo: printBooksView.productData[1],
                            noofpages: GlobalData.storyData.noofpages,
                            webCoverUrl: GlobalData.storyData.webcoverurl
                        });
                        jQuery('.' + divClass).empty();
                        jQuery('.' + divClass).html(innerHtml);
                        printBooksView.preloader();
                    });
            }
        };

        this.preloader = function () {
             jQuery('.page-loading').css('overflow', 'auto');
            jQuery('body > .pageload').fadeOut();
            jQuery('.books #select5x5Btn').click(function (event) {
                event.stopPropagation();
                GlobalData.ec.recordClickEvent('Print_Book_Size', 'click', 'PG_5x5');
                if(!_.isUndefined(GlobalData.printData.bookData)){
                    if(GlobalData.printData.bookData.id === '2' && !_.isUndefined(GlobalData.printData.coupon)){
                        console.log('should cleanup 1');
                        delete GlobalData.printData.coupon;
                    }
                }
                printBooksView.redirectToPages(printBooksView.productData[0]);
            });
            jQuery('.books #select8x8Btn').click(function (event) {
                event.stopPropagation();
                GlobalData.ec.recordClickEvent('Print_Book_Size', 'click', 'PG_8x8');
                if(!_.isUndefined(GlobalData.printData.bookData)){
                    if(GlobalData.printData.bookData.id === '1' && !_.isUndefined(GlobalData.printData.coupon)){
                        console.log('should cleanup 2');
                        delete GlobalData.printData.coupon;
                    }
                }
                printBooksView.redirectToPages(printBooksView.productData[1]);
            });
        };

        this.addMessageBox = function (bookSizeData) {
            var remainingBlankSpread = 0;
            GlobalData.printData.bookData = bookSizeData;
            if (GlobalData.storyData.noofSpreads > bookSizeData.max_spreads) {
                var uncheckNumberOfSets = GlobalData.storyData.noofSpreads - bookSizeData.max_spreads;
                var printBookMaximumSpreadsData = {
                    name: bookSizeData.subcategory + ' ' + bookSizeData.category,
                    uncheckNumber: uncheckNumberOfSets
                };
                messagesView.addToDiv(remainingBlankSpread, printBookMaximumSpreadsData);
                jQuery('.printBookMaximumSpreads').modal('show');
            } else if (GlobalData.storyData.noofSpreads < bookSizeData.min_spreads) {
                remainingBlankSpread = (bookSizeData.min_spreads - GlobalData.storyData.noofSpreads);
                messagesView.addToDiv(remainingBlankSpread);
                jQuery('.printBookMinimumSpreads').modal('show');
            }
            messagesView.messageMiddle();
        };

        this.redirectToPages = function (bookSizeData) {
            if (GlobalData.storyData.noofSpreads > bookSizeData.max_spreads || GlobalData.storyData.noofSpreads < bookSizeData.min_spreads) {
                printBooksView.addMessageBox(bookSizeData);
                GlobalData.printData.redirectURL = '#/print/books';
            } else {
                GlobalData.printData.redirectURL = '#/print/pages';
            }
            GlobalData.printData.bookData = bookSizeData;
            Lockr.set('printData', GlobalData.printData);
            location.hash = GlobalData.printData.redirectURL;
        };
    });

    return PrintBooksView;
});