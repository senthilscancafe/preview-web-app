/*global define, jQuery*/

define(['Augment',
    'Instance',
    'GlobalData',
    'PubSub',
    'utils/CookieUtils',
    'services/PrintService',
    'hbs/underscore',
    'hbs!views/print/templates/PrintOrderDetailsView'
], function (augment, instance, GlobalData, PubSub, CookieUtils, PrintService, _, tplPrintOrderDetailsView) {
    'use strict';

    var PrintOrderDetailsView = augment(instance, function () {
        var printOrderDetailsView = this;

        this.addToDiv = function () {
            jQuery('.pageload').fadeIn();
            if (_.isUndefined(GlobalData.printData)) {
                GlobalData.printData = Lockr.get('printData');
            }
            var divClass = "printContainer";
            var innerHtml = tplPrintOrderDetailsView({
                heading: 'Order #' + GlobalData.printData.selectedOrderDetails.invoice_id,
                orderDetails: GlobalData.printData.selectedOrderDetails,
            });
            jQuery('.' + divClass).empty();
            jQuery('.' + divClass).html(innerHtml);
            jQuery('.page-loading').css('overflow', 'auto');
            printOrderDetailsView.preloader();
        };

        this.preloader = function () {
            jQuery('body > .pageload').fadeOut();
            window.onbeforeunload = null;
            jQuery('.feedbackLink').click(printOrderDetailsView.redirectToFeedback);
            jQuery('.trackShipLink').click(printOrderDetailsView.trackShipLink);
        };

        this.trackShipLink = function (event) {
            event.stopPropagation();
            GlobalData.ec.recordClickEvent('Print_Order_Details', 'click', 'Track_Button');
            window.open(GlobalData.printData.selectedOrderDetails.shippingTrackingURL, '_blank');
        };

        this.redirectToFeedback = function (event) {
            event.stopPropagation();
            GlobalData.printData.redirectURL = '#/print/order/feedback';
            printOrderDetailsView.redirectToPages();
        };

        this.redirectToPages = function () {
            Lockr.set('printData', GlobalData.printData);
            location.hash = GlobalData.printData.redirectURL;
        };

    });

    return PrintOrderDetailsView;
});