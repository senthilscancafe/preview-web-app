/*global define, jQuery, window, navigator*/

define(['Augment',
    'Instance',
    'GlobalData',
    'PubSub',
    'utils/LanguageUtils',
    'hbs/underscore',
    'hbs!views/messages/templates/MessagesView'
], function (augment, instance, GlobalData, PubSub, LanguageUtils, _, tplMessagesView) {

    'use strict';

    var MessagesView = augment(instance, function () {
        var msgUtils = getLocalizationValues();
        //        var infoView = this;
        this.addToDiv = function (printReamainigPages, printSpreadsMore) {
            var innerHtml = '';
            var divId = "messageModalCon";
            if (!_.isUndefined(printSpreadsMore)) {
                innerHtml = tplMessagesView({
                    reamainigPages: printReamainigPages,
                    printNumberOfPagesMoreNote1: LanguageUtils.valueForKey('printNumberOfPagesMoreNote1'),
                    printNumberOfPagesMoreNote2: LanguageUtils.valueForKey('printNumberOfPagesMoreNote2'),
                    printNumberOfPagesMoreNote3: LanguageUtils.valueForKey('printNumberOfPagesMoreNote3'),
                    name: printSpreadsMore.name,
                    uncheckNumber: printSpreadsMore.uncheckNumber,

                });
            } else {
                var minimumPages = '';
                if (GlobalData.printData) {
                    if (GlobalData.printData.bookData) {
                        minimumPages = GlobalData.printData.bookData.min_spreads * 2;
                    }
                }
                innerHtml = tplMessagesView({
                    reamainigPages: printReamainigPages,
                    printCoverImageNote: LanguageUtils.valueForKey('printCoverImageNote'),
                    printBlankImageNote: LanguageUtils.valueForKey('printBlankImageNote'),
                    printSpreadSelectionNote1: LanguageUtils.valueForKey('printSpreadSelectionNote1'),
                    printSpreadSelectionNote2: LanguageUtils.valueForKey('printSpreadSelectionNote2'),
                    minimumSpreadCount: minimumPages
                });

            }

            jQuery('#' + divId).empty();
            jQuery('#' + divId).html(innerHtml);
            this.sendtoStore();

        };

        this.sendtoStore = function () {
            jQuery('#closeUploadWarningMessageModal').click(function () {
                jQuery('.ongoing-uploader-message').modal('hide');
            });
            jQuery('#ok_back').click(function () {
                jQuery('#alertFirstModal').modal('hide');
                jQuery('#privateMobileCheck').hide();
                jQuery('#scrPrivareShareSend').show();
            });
            jQuery('#timeOutReloadPage').click(function () {
                document.location.reload();
            });
            
            jQuery('.mobileFeature #confirm_download').click(function () {
                GlobalData.ec.recordClickEvent('Dashboard_view', 'DashboardConfirmAppDownloadButtonClicked');
                if ((navigator.userAgent.match(/Android/i))) {
                    window.location.href = GlobalData.playStoreLink;
                } else if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i))) {
                    window.location.href = GlobalData.appStoreLink;
                } else {
                    window.location.href = GlobalData.storeLink;
                }

            });

            jQuery('.pg-mobile-editor-dialog #pg-mobile-editor-download').click(function (event) {
                event.stopPropagation();
                if ((navigator.userAgent.match(/Android/i))) {
                    window.location.href = GlobalData.playStoreEditorLink;
                } else if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i))) {
                    window.location.href = GlobalData.appStoreEditorLink;
                } else {
                    window.location.href = GlobalData.storeLink;
                }

            });

            jQuery('.mobileFeature #closeMessageModal').click(function () {
                jQuery('#messageModal').modal('hide');
            });
            jQuery('#yes_delete').click(function () {
                jQuery('#upload_progress').empty();
            });
            jQuery('#yes_back').click(function () {
                PubSub.publish('LOGOUT_UPLOAD');
            });
            jQuery('#refreshDashboardDataConfirmBtn').click(function () {
                console.log("photoStoryStatusMsg:" + GlobalData.photoStoryStatusMsg);
                GlobalData.photoStoryStatusMsg = "";
                console.log("photoStoryStatusMsg:" + GlobalData.photoStoryStatusMsg);
                delete GlobalData.photoStoryStatusMsg;
                PubSub.publish('UPDATE_TRANSFER_IN_PROGRESS_STORY');
            });
            jQuery(".dashUpdateBtn").click(function () {
                PubSub.publish('UPDATE_DASH_MD_MC');
            });
            jQuery("#messageModal #printContinue").click(function () {
                jQuery('.printBookMinimumSpreads').modal('hide');
                jQuery('.printBookMaximumSpreads').modal('hide');
                location.hash = '#/print/pages';
            });
            jQuery("#messageModal #cancelPrints").click(function () {
                jQuery('.printBookMinimumSpreads').modal('hide');
                jQuery('.printBookMaximumSpreads').modal('hide');
                setTimeout(function () {
                    location.hash = '#/dashboard';
                }, 200);

            });
            jQuery("#messageModal #cancelSelection").click(function () {
                jQuery(GlobalData.spreadDeselectedDiv).parent('.spreadContainer').addClass('selected').removeClass('deselected');
                jQuery(GlobalData.spreadDeselectedDiv).parent('.spreadContainer').children('.spreadSelection').show();
                PubSub.publish("AMOUNT_CALCULATION", 'increament');

            });

            jQuery("#messageModal #redirectToDashboard").click(function () {
                jQuery('.noImagesFound').modal('hide');
                location.hash = '#/print/books';
            });
        };
        this.messageMiddle = function () {
            var msgContent = ((jQuery(window).height()) - (181)) / 2;
            jQuery('#messageModal .modal-dialog').css('margin-top', msgContent + 'px');
        };
    });

    return MessagesView;
});