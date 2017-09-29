/*global define, jQuery */
define(['Augment',
    'Instance',
    'GlobalData',
    'PubSub'
], function (augment, instance, GlobalData, PubSub) {
    'use strict';

    var UploadProgressUtils = augment(instance, function () {
        var uploadProgressUtils = this;
        var currentFileUploadProgressDiv = '';
        var previousElements = '';
        var currentFileUploadProgressDivToHide = '';
        this.lastImageUploadDate = '';
        this.currentImageUploadDate = '';


        this.onGoingUploadDaysCount = function () {
            var timeDiff = Math.abs(uploadProgressUtils.lastImageUploadDate.getTime() - uploadProgressUtils.currentImageUploadDate.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            return diffDays;
        };

        this.fileUploadToShelf = function () {
            if (GlobalData.fileUploadData.onGoingUpload) {
                jQuery('#upload_progress').show();
            } else {
                jQuery('#upload_progress').empty();
            }
            jQuery('.allFileUploadProcessBar .progress-bar').css('width', GlobalData.fileUploadData.progressRelatedData.progress + '%');
            jQuery('.uploader-count').text(GlobalData.fileUploadData.progressRelatedData.fileUploadedandTotalStr);
            jQuery('.showRemainingTime').text('(Time remaining ' + GlobalData.fileUploadData.progressRelatedData.timeRemaining + ')');
            jQuery('.uploadingStoryName').text(GlobalData.fileUploadData.title);
            if (GlobalData.fileUploadData.uploadCompleted) {
                jQuery('#upload_progress').empty();
            }
        };
        this.indivdualfileUploadToShelf = function (progress, s) {
            if (navigator.onLine) {
                uploadProgressUtils.currentImageUploadDate = new Date();
                jQuery('.default-text').show();
                jQuery('.warning-no-network,.warning-bad-network').hide();
                jQuery('.no-network-icon').addClass('uploading-icon').removeClass('no-network-icon');
                $('.uploader-details-modal .progress').hide();
                if (jQuery.type(progress) !== "number") {
                    jQuery(".image-name:contains(" + progress.files[0].name + ")").next().show();
                    currentFileUploadProgressDiv = jQuery(".image-name:contains(" + progress.files[0].name + ")").next().children();
                    currentFileUploadProgressDivToHide = jQuery(".image-name:contains(" + progress.files[0].name + ")").parent().parent();
                    previousElements = jQuery(".image-name:contains(" + progress.files[0].name + ")").parent().parent().prevAll();
                    currentFileUploadProgressDiv.width(1);
                } else {
                    currentFileUploadProgressDiv.width(progress + '%');
                    if (progress === 100) {

                    }

                }
            }

        };
        this.fileUploadFinished = function () {
            if (GlobalData.fileUploadData.uploadCompleted) {
                if (document.location.hash !== "#/uploader") {
                    jQuery(".pageload").show();
                    jQuery('.modal').modal('hide');
                    jQuery('.modal-backdrop.fade.in').remove();
                    jQuery('#uploader-details-modal').modal('hide');
                }
                GlobalData.fileUploadData = {};
                GlobalData.fileUploadData.onGoingUpload = 2;
                if (GlobalData.uploadType === 'singleUserSingleDeviceDesignMyStory') {
                    GlobalData.uploadType = '';
                    PubSub.publish("UPDATE_TRANSFER_IN_PROGRESS_STORY");
                }

                jQuery('#upload_progress').empty();
                window.onbeforeunload = null;
                //                document.location.reload();
            }
        };
        this.singleFileUploadDone = function (count) {
            uploadProgressUtils.lastImageUploadDate = new Date();
            previousElements.hide();
            currentFileUploadProgressDivToHide.hide();
        };
        this.noNetworkConnection = function (count) {
            jQuery('.default-text').hide();
            jQuery('.warning-no-network').show();
            jQuery('.uploading-icon').addClass('no-network-icon').removeClass('uploading-icon');
        };

        this.uploadStartedInformDashboard = function () {
            //            PubSub.publish('UPLOADING_STARTED_CHECK_DASHBOARD_PROCESS');
        };


    });

    return UploadProgressUtils;
});