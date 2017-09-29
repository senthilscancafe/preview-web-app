/*global define, jQuery */

define(['Augment',
    'Instance',
    'GlobalData',
    'services/ContributionService',
    'utils/LanguageUtils',
    'views/messages/MessagesView',
    'hbs!views/uploadProgress/templates/UploadProgressView'
], function (augment, instance, GlobalData, ContributionService, LanguageUtils, MessagesView, tplUploadProgressView) {

    'use strict';
    var UploadProgressView = augment(instance, function () {
        var uploadProgressView = this;
        uploadProgressView.fileProgressHtmlData = [];
        this.addToDiv = function () {
            var divId = "upload_progress";
            this.fileUploadDataManage();
            if (GlobalData.fileUploadData.designRequestType === 1) {
                uploadProgressView.uploadingStoryRequestText = 'Saving photos for ';
            } else {
                uploadProgressView.uploadingStoryRequestText = 'Uploading photos for ';

            }
            var innerHtml = tplUploadProgressView({
                uploadFileData: uploadProgressView.fileProgressHtmlData,
                badNetwork: LanguageUtils.valueForKey('uploadPaused'),
                noNetwork: LanguageUtils.valueForKey('noNetwork'),
                uploadTitleRequestType: uploadProgressView.uploadingStoryRequestText,
                storyName: GlobalData.fileUploadData.title
            });
            jQuery('#' + divId).empty();
            jQuery('#' + divId).html(innerHtml);

            this.initScrollbars();
            this.preloader();
        };
        this.preloader = function () {
            jQuery('.warning-bad-network,.warning-no-network').hide();
            jQuery('body').addClass('page-loaded').removeClass('page-loading');
            jQuery('body > .pageload').fadeOut();
            jQuery('#uploader-details-modal .modal-body').perfectScrollbar();
            jQuery('#uploader-cancel-btn').click(UploadProgressView.closeModalBtn);
            jQuery('.uploader-modal-close').click(UploadProgressView.deleteUploadBtn);
        };
        this.fileUploadDataManage = function () {
            if (GlobalData.fileUploadData.my_computer > 0) {
                uploadProgressView.fileProgressHtmlData = [];
                for (var fileCount = 0; fileCount < GlobalData.fileUploadData.customerDeviceData.length; fileCount++) {
                    uploadProgressView.fileProgressHtmlData.push({
                        fileName: GlobalData.fileUploadData.customerDeviceData[fileCount].files[0].name,
                        className: 'progressBar' + fileCount
                    });
                }
            }
        };
        this.initScrollbars = function () {
            if (jQuery('.app').hasClass('layout-small-menu') || jQuery('.app').hasClass('layout-static-sidebar') || jQuery('.app').hasClass('layout-boxed')) {
                return;
            }
            jQuery('.no-touch #uploader-details-modal.modal-body').perfectScrollbar({
                wheelPropagation: true,
                suppressScrollX: true
            });
        };
        this.closeModalBtn = function () {
            GlobalData.ec.recordClickEvent('Story_abandoned', 'UserUploadCancelButtonClicked');
            var messagesView = MessagesView.create();
            messagesView.addToDiv();
            jQuery('#messageModal.uploader-message').modal('show');
            messagesView.messageMiddle();
            console.dir(GlobalData);
            if(GlobalData.uploadType ==='singleUserSingleDeviceDesignMyStory'){
                jQuery('.uploader-message .modal-header h4').text('Cancel upload?');
                jQuery('.uploader-message .modal-body p').text('Your story will be deleted if this upload is cancelled.');
                jQuery('.uploader-message #yes_delete').text('Proceed');
                jQuery('.uploader-message #no_delete').text('Don\'t Cancel');
            }
            jQuery('#yes_delete').click(function () {
                jQuery('body > .pageload').fadeIn();
                UploadProgressView.imageSetId = {
                    image_set_id: GlobalData.imageSetListId
                };

                var promise = ContributionService.cancelImageSetData(JSON.stringify(UploadProgressView.imageSetId));
                promise.then(function () {
                    document.location.reload();
                }).fail(function () {

                });

                GlobalData.fileUploadData = {};
                GlobalData.fileUploadData.onGoingUpload = 0;
                jQuery('#upload_progress').empty();
                jQuery('.modal').modal('hide');
                window.onbeforeunload = null;
                // there were many request in queue so we need to reload ( if possible to stop request then remove. performance will increase.)
            });
        };

        this.deleteUploadBtn = function () {
            jQuery('.modal').modal('hide');

        };
        this.uploadStatus = function () {

            var uploadVal = 0;
            if (uploadVal === 1) {
                jQuery('.default-text,.warning-no-network').hide();
                jQuery('.warning-bad-network').show();
                jQuery('.uploading-icon').css("background-position", "-246px -372px");
            } else if (uploadVal === 2) {
                jQuery('.default-text,.warning-bad-network').hide();
                jQuery('.warning-no-network').show();
                jQuery('.uploading-icon').css("background-position", "-246px -372px");
            } else {
                jQuery('.warning-bad-network,.warning-no-network').hide();
                jQuery('.default-text').show();
                jQuery('.uploading-icon').css("background-position", "-247px -337px");
            }
        };

    });



    return UploadProgressView;
});