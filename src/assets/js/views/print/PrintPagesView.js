/*global define, jQuery*/

define(['Augment',
    'Instance',
    'GlobalData',
    'PubSub',
    'utils/ObjectHandling',
    'utils/CookieUtils',
    'views/messages/MessagesView',
    'services/PrintService',
    'hbs/underscore',
    'lockr',
    'hbs!views/print/templates/PrintPagesView'
], function (augment, instance, GlobalData, PubSub, ObjectHandling, CookieUtils, MessagesView, PrintService, _, Lockr, tplPrintPagesView) {
    'use strict';

    var PrintPagesView = augment(instance, function () {
        var printPagesView = this;
        var messagesView = '';
        var numberOfSpreadsSelcted = [];
        printPagesView.amount = 0;
        printPagesView.spreadId = 0;
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
            printPagesView.getProductDetailsData();
            messagesView = MessagesView.create();
        };

        this.getProductDetailsData = function () {
            var requestData = {
                tracking_id: GlobalData.storyData.pb_tracking_id
            };
            var promiseOrderInfo = PrintService.getProductDetails(requestData);
            printPagesView.pageCount = 1;
            $.when(promiseOrderInfo)
                .done(function (data) {
                    printPagesView.productDetailsData = data.arr_data;
                    if (printPagesView.productDetailsData.images) {
                        printPagesView.prepareImageURL();
                        printPagesView.addBlankPage();
                        printPagesView.addPageCount();
                        printPagesView.renderHTML();
                        printPagesView.pageSelectionHistory();
                    } else {
                        messagesView.addToDiv();
                        jQuery('.noImagesFound').modal('show');
                        messagesView.messageMiddle();
                        jQuery('body > .pageload').fadeOut();
                    }

                });
        };

        this.prepareImageURL = function () {
            for (var i = 0; i < printPagesView.productDetailsData.images.length; i++) {
                printPagesView.productDetailsData.images[i].name = printPagesView.productDetailsData.s3URL + printPagesView.productDetailsData.images[i].name;
            }
        };

        this.addBlankPage = function () {
            var nummberOfSpreadToadd = 11 - printPagesView.productDetailsData.images.length;
            var tempLastSpread = printPagesView.productDetailsData.images.pop();
            for (var j = 0; j <= nummberOfSpreadToadd; j++) {
                printPagesView.productDetailsData.images.push({
                    name: "https://imgd.photogurus.com/assets/images/bookBlankPageImage.png",
                    pageType: "blank",

                });
            }
            printPagesView.productDetailsData.images.push(tempLastSpread);
        };

        this.addPageCount = function () {
            var pageNumber = 0;
            for (var i = 0; i < printPagesView.productDetailsData.images.length; i++) {
                if (i === 0) {
                    printPagesView.productDetailsData.images[i].pageType = 'cover';
                } else if (i === printPagesView.productDetailsData.images.length - 1) {
                    printPagesView.productDetailsData.images[i].pageType = 'cover';
                } else {
                    if (printPagesView.productDetailsData.images[i].pageType) {
                        pageNumber++;
                        printPagesView.productDetailsData.images[i].pageLeft = pageNumber;
                        pageNumber++;
                        printPagesView.productDetailsData.images[i].pageRight = pageNumber;
                        printPagesView.pageCount++;
                    } else {
                        printPagesView.productDetailsData.images[i].pageType = 'spread';
                        pageNumber++;
                        printPagesView.productDetailsData.images[i].pageLeft = pageNumber;
                        pageNumber++;
                        printPagesView.productDetailsData.images[i].pageRight = pageNumber;
                        printPagesView.pageCount++;
                    }
                }

            }
        };
        this.renderHTML = function () {
            printPagesView.productDetailsData.images = ObjectHandling.convertArrTOObj(printPagesView.productDetailsData.images);
            GlobalData.printData.pageData = printPagesView.productDetailsData;
            var divClass = "printOuterBox";
            console.log(GlobalData.storyData);
            var innerHtml = tplPrintPagesView({
                note: 'All selected pages will be printed. You can unselect the set of 2 pages (spread) that you don’t wish to print.',
                bookData: GlobalData.printData.bookData,
                storyData: GlobalData.storyData,
                pageData: printPagesView.productDetailsData,
                //pageCount: (_.isUndefined(GlobalData.printData.pageInfo))? GlobalData.storyData.noofpages : ((GlobalData.printData.pageInfo.pageCount > GlobalData.printData.bookData.min_spreads * 2)? GlobalData.printData.pageInfo.pageCount : GlobalData.printData.bookData.min_spreads * 2)
                pageCount: (_.isUndefined(GlobalData.printData.pageInfo))? GlobalData.storyData.noofpages : ((GlobalData.printData.pageInfo.pageCount > GlobalData.printData.bookData.min_spreads * 2)? GlobalData.printData.pageInfo.pageCount : GlobalData.storyData.noofpages)
            });
            jQuery('.' + divClass).empty();
            jQuery('.' + divClass).html(innerHtml);
            jQuery('.page-loading').css('overflow', 'auto');
            printPagesView.preloader();
        };

        this.preloader = function () {
            if (GlobalData.storyData.reOrder || !_.isUndefined(GlobalData.printData.pageInfo)) {// in case of reorder OR in case back button
                var spreadListLength = Object.keys(GlobalData.printData.pageInfo.spreadList).length;
                printPagesView.calculateAmountTotalPages(spreadListLength);

            } else {
                printPagesView.calculateAmountTotalPages();
            }

            printPagesView.countPages();
            printPagesView.conditionalUnselectionProcessMsg();

            jQuery('#collectPagesBtn').click(printPagesView.collectPages);
            jQuery('.pagesContainer').perfectScrollbar({
                wheelPropagation: true,
                suppressScrollX: true
            });
            jQuery('body > .pageload').fadeOut();
            jQuery('.pageSelection').click(printPagesView.selectPagesProcess);
            jQuery('.spreadSelection').click(printPagesView.selectPagesProcess);
            jQuery('.blankSpreadSelection').click(printPagesView.selectPagesProcess);
            jQuery('.coverSelection').click(printPagesView.selectPagesProcess);
            jQuery("img.lazy").lazyload({
                container: $(".pagesContainer")
            });
            PubSub.subscribe('AMOUNT_CALCULATION', function (name, data) {
                printPagesView.amountCalculation(data);
            });
            printPagesView.maxSpreadUIManagment();

            if (jQuery('.spreadContainer').length > 12) {
                jQuery('.printInnerShadow').show();
            } else {
                jQuery('.printInnerShadow').hide();
            }

        };

        this.collectPages = function (e) {
            //get the information of selected spreads in this screen
            //GlobalData.printData.pageInfo [will contain selected spread ids, page count, amount]
            if (!(jQuery(this).hasClass('disabled'))) {
                printPagesView.spreadList = [];
                
                $(".spreadContainer.selectedCover.frontCover").map(function () {
                    printPagesView.spreadList.push(this.id);
                    return;
                });

                $(".spreadContainer.spreadBox.selected").map(function () {
                    printPagesView.spreadList.push(this.id);
                    return;
                });

                $(".spreadContainer.selectedCover.backCover").map(function () {
                    printPagesView.spreadList.push(this.id);
                    return;
                });

                var pageCount = ((printPagesView.spreadList.length - 2) * 2);
                //console.log(pageCount);
                if (pageCount < 20) {
                    pageCount = 20;
                }


                printPagesView.spreadList = ObjectHandling.convertArrTOObj(printPagesView.spreadList);
                GlobalData.printData.pageInfo = {
                    spreadList: printPagesView.spreadList,
                    pageCount: pageCount,
                    amount: printPagesView.amount //calculation is not added yet

                };
                GlobalData.printData.redirectURL = '#/print/shipping';
                printPagesView.redirectToPages();
            }
        };

        this.pageSelectionHistory = function () {
            if (GlobalData.printData.pageInfo) {
                if (GlobalData.printData.pageInfo.spreadList) {
                    console.log(GlobalData.printData.pageInfo);
                    var spreadList = GlobalData.printData.pageInfo.spreadList;
                    jQuery('.spreadBox').removeClass('selected').addClass('deSelected');
                    jQuery('.spreadBox .spreadSelection').hide();

                    for (var key in spreadList) {
                        if (spreadList.hasOwnProperty(key)) {
                            jQuery('#' + spreadList[key]).addClass('selected').children('.spreadSelection').show();
                        }
                    }
                }
            }
            printPagesView.amountCalculation();
            printPagesView.maxSpreadUIManagment();
        };

        this.selectPagesProcess = function (event) {
            event.stopPropagation();
            printPagesView.selectionCase = 'select';
            console.log(jQuery(this));
            if (jQuery(this).hasClass('coverSelection')) {
                printPagesView.currentPageType = 'deselect';
                if (jQuery(this).hasClass('coverSelection')) {
                    messagesView.addToDiv();
                    jQuery('.coverImageSelection').modal('show');
                    messagesView.messageMiddle();
                }
            }else if(jQuery(this).hasClass('blankSpreadSelection')){
                printPagesView.currentPageType = 'deselect';
                if (jQuery(this).hasClass('blankSpreadSelection')) {
                    messagesView.addToDiv();
                    jQuery('.blankSpreadAlert').modal('show');
                    messagesView.messageMiddle();
                }
            } 
            else {
                printPagesView.countPages();
                if (jQuery(this).parent('.spreadContainer').hasClass('selected')) {
                    if ((numberOfSpreadsSelcted.length * 2) <= (GlobalData.printData.bookData.min_spreads * 2)) {
                        
                        printPagesView.spreadId = jQuery(this).parent('.spreadContainer').attr('id');
                        console.log(printPagesView.spreadId);
                        printPagesView.amountCalculation('basePrice');
                        messagesView.addToDiv();
                        jQuery('.dialog-with-head').modal('show');
                        messagesView.messageMiddle();
                        jQuery('#dialog-with-head-header').find('h4').text('Blank pages!');
                        jQuery('#dialog-with-head-content').text("Minimum book size is 20 pages. If you don't select more pages, your book will have blank pages.");
                        jQuery('.multiAction').show();
                        jQuery('#dialog-with-head-left-action').text('Proceed');
                        jQuery('#dialog-with-head-right-action').text('Cancel');
                        
                        jQuery('#dialog-with-head-left-action').click(function (event) {
                            event.stopPropagation();
                            jQuery('.dialog-with-head').modal('hide');
                            jQuery('#'+printPagesView.spreadId).addClass('deselected').removeClass('selected');
                            jQuery('#'+printPagesView.spreadId).children('.spreadSelection').hide();
                        });

                        jQuery('#dialog-with-head-right-action').click(function (event) {
                            event.stopPropagation();
                            jQuery('.dialog-with-head').modal('hide');
                            //PubSub.publish("AMOUNT_CALCULATION", 'increment');
                        });

                    } else {
                        jQuery(this).parent('.spreadContainer').addClass('deselected').removeClass('selected');
                        jQuery(this).parent('.spreadContainer').children('.spreadSelection').hide();
                        printPagesView.amountCalculation('decrement');
                    }
                    // if()

                } else {
                    jQuery(this).parent('.spreadContainer').addClass('selected').removeClass('deselected');
                    jQuery(this).parent('.spreadContainer').children('.spreadSelection').show();
                    if ((numberOfSpreadsSelcted.length * 2) >= (GlobalData.printData.bookData.min_spreads * 2)) {
                        printPagesView.amountCalculation('increment');
                    }
                }
                printPagesView.maxSpreadUIManagment();
            }

        };

        this.maxSpreadUIManagment = function () {
            console.log("total spread:" + numberOfSpreadsSelcted.length + "  max spread:" + GlobalData.printData.bookData.max_spreads);
            if ((numberOfSpreadsSelcted.length) > (GlobalData.printData.bookData.max_spreads)) {
                var maxPageSet = numberOfSpreadsSelcted.length - GlobalData.printData.bookData.max_spreads;
                jQuery(".pageInfoText").hide();
                jQuery(".maxInfoText").show();
                jQuery('#maxSpreadMsg').text(maxPageSet + " set");
                jQuery('#collectPagesBtn').addClass('disabled');
                jQuery('#bookPriceSection').hide();
            } else {
                jQuery('#collectPagesBtn').removeClass('disabled');
                jQuery(".pageInfoText").show();
                jQuery(".maxInfoText").hide();
                jQuery('#bookPriceSection').show();

            }
        };

        this.countPages = function () {
            numberOfSpreadsSelcted = [];
            $(".spreadContainer.spreadBox.selected").map(function () {
                numberOfSpreadsSelcted.push(this.id);
                return;
            });
        };

        this.conditionalUnselectionProcessMsg = function () {
            if (GlobalData.storyData.noofpages > (numberOfSpreadsSelcted.length * 2)) {
                jQuery("#conditionalUnselectedMsg").show();
            } else {
                jQuery("#conditionalUnselectedMsg").hide();
            }
        };

        this.amountCalculation = function (value) {
            switch (value) {
                case 'basePrice':
                    printPagesView.amount = GlobalData.printData.bookData.baseprice;
                    break;
                case 'increment':
                    printPagesView.amount = parseFloat(printPagesView.amount) + parseFloat(GlobalData.printData.bookData.incremental_unit_price);
                    break;
                case 'decrement':
                    printPagesView.amount = parseFloat(printPagesView.amount) - parseFloat(GlobalData.printData.bookData.incremental_unit_price);
                    break;
            }
            printPagesView.countPages();
            printPagesView.conditionalUnselectionProcessMsg();
            if ((numberOfSpreadsSelcted.length * 2) >= (GlobalData.printData.bookData.min_spreads * 2)) {
                jQuery('#updateSelectedPagesCount').text((numberOfSpreadsSelcted.length * 2) + " pages");
            }
            jQuery('#bookTotalPrice').text((parseFloat(printPagesView.amount).toFixed(2)));
        };
        this.calculateAmountTotalPages = function (value) {
            printPagesView.spreadList = [];
            $(".spreadContainer.spreadBox.selected").map(function () {
                printPagesView.spreadList.push(this.id);
                return;
            });


            var pageCount = 0;
            if (value) {
                pageCount = value - 2;
            } else {
                pageCount = printPagesView.spreadList.length;
            }
            var incrementalPages = pageCount - GlobalData.printData.bookData.min_spreads;
            if (incrementalPages > 0) {
                printPagesView.amount = parseFloat(GlobalData.printData.bookData.baseprice) + (parseFloat(GlobalData.printData.bookData.incremental_unit_price) * incrementalPages);
            } else {
                printPagesView.amount = parseFloat(GlobalData.printData.bookData.baseprice);
            }

            jQuery('#bookTotalPrice').text((parseFloat(printPagesView.amount).toFixed(2)));
        };

        this.redirectToPages = function () {
            Lockr.set('printData', GlobalData.printData);
            location.hash = GlobalData.printData.redirectURL;
        };
    });

    return PrintPagesView;
});