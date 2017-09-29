/*global define, jQuery*/

define(['Augment',
    'Instance',
    'GlobalData',
    'PubSub',
    'utils/CookieUtils',
    'views/messages/MessagesView',
    'services/PrintService',
    'hbs/underscore',
    'lockr',
    'hbs!views/print/templates/PrintView'
], function (augment, instance, GlobalData, PubSub, CookieUtils, MessagesView, PrintService, _, Lockr, tplPrintView) {
    'use strict';

    var PrintView = augment(instance, function () {
        var printView = this;
        var messagesView = '';
        this.addToDiv = function () {
            jQuery('#MainViewDiv').hide();
            jQuery('#printlayout').show();
            var divId = "printlayout";
            var innerHtml = tplPrintView({
                imageBase: GlobalData.imageBase,
            });
            jQuery('#' + divId).empty();
            jQuery('#' + divId).html(innerHtml);
            jQuery('#upload_progress,#NavBarDiv').css('display', 'none');
            messagesView = MessagesView.create();
            printView.preloader();
            jQuery(window).scrollTop(0);
        };

        this.preloader = function () {
            // jQuery('body > .pageload').fadeOut();           
            jQuery('#printlayout.main-content').height(jQuery(window).height());
            jQuery('.printBackIcon').click(printView.backButtonFlow);

            printView.handlePGLogoAction();

            jQuery('#printlayout .home-icon').click(function (event) {
                event.stopPropagation();
                GlobalData.ec.recordClickEvent('Print_Thank_You', 'click', 'Home_Button');
                printView.flushPrintData();

            });
            if (location.hash === '#/print/order/finish') {
                printView.finishOrderPageUIManagement();

            }
            if (location.hash === '#/print/order') {
                CookieUtils.setCookie("HashPath", '#/print/order');
            }



            PubSub.subscribe('CLEAR_PRINT_DATA', function (name) {
                printView.flushPrintData();
            });

            // window.onbeforeunload = function (event) {
            //     GlobalData.printData = Lockr.get('printData');
            //     GlobalData.storyData = Lockr.get('storyData');
            //     Lockr.flush();
            //     var message = 'Important: Please click on \'Save\' button to leave this page.';
            //     if (typeof event == 'undefined') {
            //         event = window.event;
            //     }
            //     if (event) {
            //         event.returnValue = message;
            //     }
            //     return message;
            // };

            ///////////////////////////////////////
            if (location.hash.indexOf("print") !== -1) { //only for print flow urls
                var timeout;
                var warning = function () {
                    Lockr.set('storyDataBKP', Lockr.get('storyData'));
                    Lockr.set('printDataBKP', Lockr.get('printData'));
                    Lockr.rm('storyData');
                    Lockr.rm('printData');
                    timeout = setTimeout(function () {
                        //alert('You stayed');
                        Lockr.set('storyData', Lockr.get('storyDataBKP'));
                        Lockr.set('printData', Lockr.get('printDataBKP'));
                        Lockr.rm('storyDataBKP');
                        Lockr.rm('printDataBKP');
                    }, 1000);
                    return "Cancel print order?";
                };

                var noTimeout = function () {
                    clearTimeout(timeout);
                };

                window.onbeforeunload = warning;
                window.unload = noTimeout;
            } else {
                window.onbeforeunload = null;
            }
            ///////////////////////////////////////

            ///////// kill print session when triggered from multiple tabs in single browser ///////
            window.addEventListener('storage', function (storageEvent) {
                console.log(storageEvent);
                /*console.log(storageEvent);
                var newVal = JSON.parse(storageEvent.newValue);
                var oldVal = JSON.parse(storageEvent.oldValue);
                console.dir(JSON.parse(storageEvent.newValue));
                console.dir(JSON.parse(storageEvent.oldValue));*/
                //jQuery('.existing-print-session').modal('hide');

                if (location.hash.indexOf("print") !== -1 && (storageEvent.key === 'storyData' || storageEvent.key === 'printData')) {


                    jQuery('.dialog-without-head').modal('show');
                    messagesView.messageMiddle();
                    jQuery('#dialog-without-head-content').text('It looks like you have started a photo book order in another tab. This session will be closed.');
                    jQuery('#dialog-without-head-action').parent().css("display", "block");
                    jQuery('#dialog-without-head-action').text('OK');
                    jQuery('#dialog-without-head-action').click(function (event) {
                        $('.modal-backdrop').remove();
                        window.onbeforeunload = null;
                        location.hash = '#/dashboard';
                    });

                    /*$('.modal-backdrop').remove();
                    $('.existing-print-session').remove();
                    //console.log('called storage event');
                    messagesView.addToDiv();
                    jQuery('.existing-print-session').modal('show');
                    messagesView.messageMiddle();
                    jQuery('#existing-print-session-content').text('This session of print flow has expired.');

                    
                    jQuery("#existing-print-session-action").click(function (event) {
                        $('.modal-backdrop').remove();
                        window.onbeforeunload = null;
                        location.hash = '#/dashboard';
                    });*/
                }
            }, false);
        };

        this.managePrevieAndDashboardRedirections = function () {
            console.log(CookieUtils.getCookie("printFromPreview"));
            if (CookieUtils.getCookie("printFromPreview") === '1') {
                CookieUtils.delete_cookie('printFromPreview');
                CookieUtils.delete_cookie('orderId');
                var previewURL = CookieUtils.getCookie("previewURL");
                CookieUtils.delete_cookie('previewURL');
                location.href = previewURL;
            } else {
                location.hash = '#/dashboard';
            }
        };

        this.handlePGLogoAction = function () {
            jQuery('#printlayout .logoPhotogurus').click(function (event) {
                event.stopPropagation();

                if (location.hash === '#/print/order' || location.hash === '#/print/order/details' || location.hash === '#/print/order/feedback' || location.hash === '#/print/order/finish') {
                    window.onbeforeunload = null;
                    printView.managePrevieAndDashboardRedirections();
                } else {
                    if (!_.isUndefined(Lockr.get('printData'))) {
                        //this check has been added for
                        //Click on PG logo needs to show the user an alert message (on all pages except when user has just been on select book size page). On tap of Yes, we should show a loader while the dashboard is loading.
                        messagesView.addToDiv();
                        jQuery('.outFromPrintModule').modal('show');
                        messagesView.messageMiddle();
                        jQuery("#messageModal #outFromPrint").click(function (event) {
                            event.stopPropagation();
                            //console.log(location.hash);
                            switch (location.hash) {
                                case '#/print/books':
                                    GlobalData.ec.recordClickEvent('Print_Book_Size', 'click', 'PG_Logo');
                                    break;
                                case '#/print/pages':
                                    GlobalData.ec.recordClickEvent('Print_Page_Selection', 'click', 'PG_Logo');
                                    break;
                                case '#/print/shipping':
                                    GlobalData.ec.recordClickEvent('Print_Shipping_Address_List', 'click', 'PG_Logo');
                                    break;
                                case '#/print/shipping/address':
                                    if (_.isUndefined(GlobalData.printData)) {
                                        GlobalData.printData = Lockr.get('printData');
                                        if (_.isUndefined(GlobalData.printData)) {
                                            console.log('print flow data invalid, printData not found');
                                            window.onbeforeunload = null;
                                            printView.managePrevieAndDashboardRedirections();
                                        }
                                    }
                                    if (GlobalData.printData.action === 'edit') {
                                        GlobalData.ec.recordClickEvent('Print_Shipping_Address_Edit', 'click', 'PG_Logo');
                                    } else {
                                        GlobalData.ec.recordClickEvent('Print_Shipping_Address_Add', 'click', 'PG_Logo');
                                    }
                                    break;
                                case '#/print/deliveryoption':
                                    GlobalData.ec.recordClickEvent('Print_Delivery_Options', 'click', 'PG_Logo');
                                    break;
                                case '#/print/card':
                                    GlobalData.ec.recordClickEvent('Print_Card_List', 'click', 'PG_Logo');
                                    break;
                                case '#/print/card/add':
                                    GlobalData.ec.recordClickEvent('Print_Card_List', 'click', 'PG_Logo');
                                    break;
                                case '#/print/billing/address':
                                    if (_.isUndefined(GlobalData.printData)) {
                                        GlobalData.printData = Lockr.get('printData');
                                        if (_.isUndefined(GlobalData.printData)) {
                                            console.log('print flow data invalid, printData not found');
                                            window.onbeforeunload = null;
                                            printView.managePrevieAndDashboardRedirections();
                                        }
                                    }
                                    if (GlobalData.printData.action === 'edit') {
                                        GlobalData.ec.recordClickEvent('Print_Billing_Address_Edit', 'click', 'PG_Logo');
                                    } else {
                                        GlobalData.ec.recordClickEvent('Print_Billing_Address_Add', 'click', 'PG_Logo');
                                    }
                                    break;
                                case '#/print/order/summary':
                                    GlobalData.ec.recordClickEvent('Print_Summary', 'click', 'PG_Logo');
                                    break;
                                case '#/print/order/discount':
                                    GlobalData.ec.recordClickEvent('Print_Discount', 'click', 'PG_Logo');
                                    break;
                                default:
                                    console.log('case not found');
                            }
                            printView.flushPrintData();
                        });
                    } else {
                        printView.flushPrintData();
                    }

                }
            });
        };

        this.flushPrintData = function () {
            jQuery('.outFromPrintModule').modal('hide');
            CookieUtils.delete_cookie('HashPath');
            CookieUtils.delete_cookie("prePath");
            Lockr.rm('storyData');
            Lockr.rm('printData');
            jQuery('body > .pageload').fadeOut();
            $('.modal-open').removeClass('modal-open');
            $('.modal-backdrop').removeClass('modal-backdrop fade in');
            window.onbeforeunload = null;
            printView.managePrevieAndDashboardRedirections();
        };
        this.backButtonFlow = function () {
            console.log(CookieUtils.getCookie("prePath"), CookieUtils.getCookie("HashPath"));
            var previousPath = CookieUtils.getCookie("HashPath");
            if (previousPath === '#/print/shipping/address') {
                CookieUtils.setCookie("HashPath", '#/print/shipping');
                window.location.hash = '#/print/shipping';
            } else {
                var prePath = CookieUtils.getCookie("prePath");
                switch (location.hash) {
                    case '#/print/shipping/address':
                        //PubSub.publish('SELECT_SHIPPING_ADDRESS');
                        if (!_.isUndefined(GlobalData.printData.temp)) {
                            delete GlobalData.printData.temp;
                            //TODO:clear temp object from localstorage
                        }
                        CookieUtils.setCookie("HashPath", '#/print/order/summary');
                        window.location.hash = '#/print/order/summary';
                        break;
                    case '#/print/books':
                        GlobalData.ec.recordClickEvent('Print_Book_Size', 'click', 'Back_Button');
                        if (previousPath === '#/print/order') {
                            CookieUtils.delete_cookie('HashPath');
                            CookieUtils.setCookie("HashPath", '#/print/order');
                            window.onbeforeunload = null;
                            Lockr.rm('storyData');
                            Lockr.rm('printData');
                            window.location.hash = '#/print/order';
                        } else {
                            CookieUtils.delete_cookie('HashPath');
                            CookieUtils.delete_cookie("prePath");
                            CookieUtils.setCookie("HashPath", '#/dashboard');
                            Lockr.rm('storyData');
                            Lockr.rm('printData');
                            window.onbeforeunload = null;
                            printView.managePrevieAndDashboardRedirections();
                        }
                        break;
                    case '#/dashboard':
                        CookieUtils.delete_cookie('HashPath');
                        CookieUtils.delete_cookie("prePath");
                        CookieUtils.setCookie("HashPath", '#/dashboard');
                        Lockr.rm('storyData');
                        Lockr.rm('printData');
                        window.onbeforeunload = null;
                        printView.managePrevieAndDashboardRedirections();
                        break;
                    case '#/print/pages':
                        //console.log(typeof(Object.keys(GlobalData.printData.pageData.images).length));
                        if (!_.isUndefined(GlobalData.printData.pageInfo) && (Object.keys(GlobalData.printData.pageData.images).length !== Object.keys(GlobalData.printData.pageInfo.spreadList).length)) {
                            messagesView.addToDiv();
                            jQuery('.dialog-with-head').modal('show');
                            messagesView.messageMiddle();
                            jQuery('#dialog-with-head-header').find('h4').text('Go back?');
                            jQuery('#dialog-with-head-content').text("If you go back you will lose the page selection.");
                            jQuery('.multiAction').show();
                            jQuery('#dialog-with-head-left-action').text('Yes');
                            jQuery('#dialog-with-head-right-action').text('No');
                            jQuery('#dialog-with-head-left-action').click(function (event) {
                                jQuery('#dialog-with-head-header').modal('hide');
                                delete GlobalData.printData.pageData;
                                delete GlobalData.printData.pageInfo;
                                CookieUtils.setCookie("HashPath", '#/print/books');
                                window.location.hash = '#/print/books';
                            });
                        } else {
                            CookieUtils.setCookie("HashPath", '#/print/books');
                            window.location.hash = '#/print/books';
                        }
                        break;
                    case '#/print/shipping':
                        if (prePath === '#/print/order/summary') {
                            console.log(GlobalData.printData.shippingAddress);
                            CookieUtils.setCookie("HashPath", location.hash);
                            window.location.hash = prePath;
                        } else {
                            CookieUtils.setCookie("prePath", '#/print/pages');
                            CookieUtils.setCookie("HashPath", location.hash);
                            window.location.hash = '#/print/pages';
                        }
                        break;
                    case '#/print/deliveryoption':
                        if (prePath === '#/print/order/summary') {
                            CookieUtils.setCookie("HashPath", location.hash);
                            window.location.hash = prePath;
                        } else {
                            CookieUtils.setCookie("prePath", '#/print/shipping');
                            CookieUtils.setCookie("HashPath", '#/print/shipping');
                            console.log(GlobalData.printData.shippingAddress);
                            window.location.hash = '#/print/shipping';
                        }
                        break;
                    case '#/print/card':
                        if (prePath === '#/print/order/summary') {
                            CookieUtils.setCookie("HashPath", location.hash);
                            window.location.hash = prePath;
                        } else {
                            CookieUtils.setCookie("prePath", '#/print/deliveryoption');
                            CookieUtils.setCookie("HashPath", '#/print/deliveryoption');
                            window.location.hash = '#/print/deliveryoption';
                        }
                        break;
                    case '#/print/card/add':
                        CookieUtils.setCookie("HashPath", '#/print/card');
                        window.location.hash = '#/print/card';
                        break;
                    case '#/print/order/summary':
                        CookieUtils.setCookie("prePath", '#/print/card');
                        CookieUtils.setCookie("HashPath", '#/print/order/summary');
                        window.location.hash = '#/print/card';
                        break;
                    case '#/print/order/finish':
                        CookieUtils.setCookie("prePath", '#/print/order/finish');
                        CookieUtils.setCookie("HashPath", '#/dashboard');
                        window.onbeforeunload = null;
                        printView.managePrevieAndDashboardRedirections();
                        break;
                    case '#/print/order':
                        GlobalData.ec.recordClickEvent('Print_My_Orders', 'click', 'Back_Button');
                        if (prePath === '#/profile') {
                            CookieUtils.setCookie("prePath", '#/profile');
                            CookieUtils.setCookie("HashPath", '#/profile');
                            Lockr.rm('storyData');
                            Lockr.rm('printData');
                            window.location.hash = '#/profile';
                        } else {
                            CookieUtils.setCookie("prePath", '#/dashboard');
                            CookieUtils.setCookie("HashPath", '#/dashboard');
                            Lockr.rm('storyData');
                            Lockr.rm('printData');
                            window.onbeforeunload = null;
                            printView.managePrevieAndDashboardRedirections();
                        }

                        break;
                    default:
                        CookieUtils.setCookie("HashPath", location.hash);
                        window.history.back();

                }

            }

        };

        this.finishOrderPageUIManagement = function () {
            if (location.hash === '#/print/order/finish') {
                window.onbeforeunload = null;
                jQuery('.printBackIcon').hide();
                jQuery('.home-icon').show();
            } else {
                jQuery('.printBackIcon').show();
                jQuery('.home-icon').hide();
            }
        };

    });

    return PrintView;
});