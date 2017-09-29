/*global define, jQuery*/

define(['Augment',
    'Instance',
    'GlobalData',
    'PubSub',
    'utils/CookieUtils',
    'hbs!views/print/templates/PrintTermAndConditionView'
], function (augment, instance, GlobalData, PubSub, CookieUtils, tplPrintTermAndConditionView) {
    'use strict';

    var PrintTermAndConditionView = augment(instance, function () {
        var printTermAndConditionView = this;

        this.addToDiv = function () {
            jQuery('body > .pageload').fadeIn();
            var innerHtml = '';
            var divId = "termAndCondtionContainer";
            jQuery('#' + divId).empty();
            innerHtml = tplPrintTermAndConditionView();
            jQuery('#' + divId).html(innerHtml);
            printTermAndConditionView.preloader();
            printTermAndConditionView.messageMiddle();
        };

        this.preloader = function () {
            jQuery('body > .pageload').fadeOut();

        };
        this.messageMiddle = function () {
            var deskDevice, bodyHeight, deskWidth;
            deskDevice = 600;
            bodyHeight = deskDevice - 50;
            deskWidth = deskDevice * 0.7;

            //jQuery('#termConditionModal > .modal-dialog > .modal-content').css("height", deskDevice + "px");
            //jQuery('#termConditionModal > .modal-dialog > .modal-content').css("width", deskWidth + "px");
            jQuery('#termConditionModal > .modal-dialog > .modal-content .modal-body').css("max-height", bodyHeight + "px");
            jQuery('#termConditionModal > .modal-dialog > .modal-content .modal-body').css("overflow-y", "scroll");
            jQuery('#termConditionModal').css("overflow", "hidden");
            //jQuery('.modal-open').css("overflow", "hidden");
            //fix to help terms modal to scroll only
            jQuery('.modal-body').on( 'mousewheel DOMMouseScroll', function ( e ) {
                var e0 = e.originalEvent,
                    delta = e0.wheelDelta || -e0.detail;

                this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
                e.preventDefault();
            });
            
            //jQuery('#termConditionModal').css('width', deskWidth + "px");

            //jQuery('#termConditionModal .modal-body').height(jQuery(window).height() - 200);
            // var msgContent = ((jQuery(window).height()) - jQuery('#termConditionModal .modal-content').height()) / 2;
            // jQuery('#messageModal .modal-dialog').css('margin-top', msgContent + 'px');
        };
    });

    return PrintTermAndConditionView;
});