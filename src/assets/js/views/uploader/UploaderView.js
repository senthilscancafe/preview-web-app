/*global define, jQuery, window, console, alert, FB, OneDrive, getLocalizationValues, Dropbox, loadFBAlbums, currentVersion, window, createUUID, get_browser_info, createOrder, finishOrder, loadFBJS, $, index, convertSCMDtoMCMD, saveStory*/

define(['Augment',
    'Instance',
    'GlobalData',
    'PubSub',
    'utils/ObjectHandling',
    'utils/UploadProgressUtils',
    'utils/CookieUtils',
    'services/ContributionService',
    'views/uploader/GoogleView',
    'views/uploader/FlickrView',
    'views/uploader/AmazonView',
    'views/uploader/ContributorEmailShareView',
    'hbs!views/uploader/templates/UploaderView'
], function (augment, instance, GlobalData, PubSub, ObjectHandling, UploadProgressUtils, CookieUtils, ContributionService, GoogleView, FlickrView, AmazonView, ContributorEmailShareView, tplUploaderView) {
    'use strict';
    var UploaderView = augment(instance, function () {

        var uploaderView = this;
        uploaderView.msgUtils = getLocalizationValues();
        var googleView = '';
        var flickrView = '';
        var myip = '';
        var mcCounter = 0;
        var dropboxCounter = 0;
        var fbCounter = 0;
        var uploadFinished = 0;
        var photolength = 0;
        var trackingIdForFinish = 0;
        var fileToUploadCount = 0;
        var fileUploaddedCount = 0;
        var dbDataArray = [];
        var totalCount = 0;
        var flickerCounter = 0;
        var orderIdForFinish = 0;
        var imageSetIdsForFinish = 0;
        var fileUploaddedCount = 0;
        var mclengthWithoutDuplicate = 0;
        var gpCounter = 0;
        var acCounter = 0;
        var childWin = "";
        var customerId = "";
        var authToken = "";
        var isValidImage = false;
        var notDuplicate = "";
        var locationSearch = location.search.split("=");
        var lazyLoadingCount = 0;
        var finalCount = 0;
        var maxFiles = 1000;
        var fbAlbumText = '';
        var fileSize = 0;
        var mcFileTypeFlag = 0;
        var failedfileCount = 0;
        var msgUtils = getLocalizationValues();
        var maxFileLimit = 0; // max file upload limit for order type
        this.networkStatus = "success";
        this.Dropbox = '';
        this.tempData = "";
        this.init = function () {
            GlobalData.fileUploadData.onGoingUpload = 0;
            GlobalData.fileUploadData.uploadCompleted = false;

            if (uploaderView.Dropbox !== '') {
                //                console.log(Dropbox);
                uploaderView.dropboxInitEvent();
            } else {
                //                console.log(Dropbox);
                uploaderView.loadJSFiles();
            }
            var loadedDropboxFiles = setInterval(function () {
                if (Dropbox !== '') {
                    uploaderView.dropboxInitEvent();
                    clearInterval(loadedDropboxFiles);
                }
            }, 1000);
        };

        this.loadJSFiles = function () {
            var jsElm = document.createElement("script");
            jQuery(jsElm).attr({
                'data-app-Key': 'j3mpyddure4mibv',
                'type': 'application/javascript',
                'id': 'dropboxjs',
                'src': 'https://www.dropbox.com/static/api/2/dropins.js'
            });
            //console.log(jsElm);
            document.body.appendChild(jsElm);
        };

        this.addToDiv = function () {
            var divId = "uploaderContainer";
            var innerHtml = tplUploaderView({
                imageBase: GlobalData.imageBase
            });
            jQuery('#dashbaordUIView').empty();
            jQuery('#dashbaordUIView').css({
                'padding': '0px'
            });
            jQuery('#upload_progress').css({
                'margin': '0px auto'
            });
            jQuery('#upload_progress').css({
                'padding': '0px'
            });
            jQuery('#MainViewDiv.main-content').css('padding-top', '0px');
            jQuery('#uploaderContainer').show();
            jQuery('#' + divId).empty();
            jQuery('#' + divId).html(innerHtml);
            this.preloader();

        };

        this.preloader = function () {
            googleView = '';
            flickrView = '';
            mcCounter = 0;
            dropboxCounter = 0;
            uploadFinished = 0;
            photolength = 0;
            totalCount = 0;
            flickerCounter = 0;
            trackingIdForFinish = 0;
            orderIdForFinish = 0;
            imageSetIdsForFinish = 0;
            fileToUploadCount = 0;
            fileUploaddedCount = 0;
            dbDataArray = [];
            mclengthWithoutDuplicate = 0;
            gpCounter = 0;
            acCounter = 0;
            childWin = "";
            customerId = "";
            authToken = "";
            isValidImage = false;
            notDuplicate = "";
            locationSearch = location.search.split("=");
            lazyLoadingCount = 0;
            finalCount = 0;
            maxFiles = 1000;
            fileSize = 0;
            mcFileTypeFlag = 0;
            failedfileCount = 0;
            GlobalData.fileUploadData = {};
            uploaderView.loadAmazonSDK();
            GlobalData.historyLastURL = '/uploader';

            function getCookie(cname) {
                var name = cname + "=";
                var ca = document.cookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) === ' ') {
                        c = c.substring(1);
                    }
                    if (c.indexOf(name) === 0) {
                        return c.substring(name.length, c.length);
                    }
                }
                return "";
            }


            var multiDevice = getCookie('multidevice');
            if (multiDevice !== '') {
                GlobalData.multiDevice = JSON.parse(multiDevice);
            }
            if (GlobalData.multiDevice !== undefined) {
                var msgUtils = getLocalizationValues();
                if (parseInt(GlobalData.multiDevice.previousCount) >= 1000 && parseInt(GlobalData.multiDevice.previousCount) <= 2000) {
                    GlobalData.multiDevice.previousCount = GlobalData.multiDevice.previousCount % 1000;
                    uploaderView.imageLimit = maxFiles - parseInt(GlobalData.multiDevice.previousCount);
                    maxFiles = uploaderView.imageLimit;
                } else {
                    if (GlobalData.multiDevice.design_request_type_name === 'MCMD') {
                        if (parseInt(GlobalData.multiDevice.previousCount) < 1000) {
                            uploaderView.imageLimit = maxFiles;
                        }

                    } else {
                        uploaderView.imageLimit = maxFiles - parseInt(GlobalData.multiDevice.previousCount);
                        maxFiles = uploaderView.imageLimit;
                    }
                }
                jQuery('#imageRemains').text(uploaderView.imageLimit);
                if (GlobalData.multiDevice.addMorePhotos) {
                    jQuery('.otherDeviceBox').hide();
                    jQuery('#finishId').fadeOut();
                    //console.log(GlobalData.multiDevice);
                    if (GlobalData.multiDevice.design_request_type_name === 'MCMD' && GlobalData.multiDevice.belongsTo === 'contributor') {
                        GlobalData.belongsTo = 'contributor';
                        jQuery(".upArrow").show().text('');
                        jQuery(".indicationContributor").text(msgUtils.contributor1stVisitText);
                        jQuery(".friendsBox").fadeOut();
                        jQuery('#saveAndDesignId,.sourceFlagImg').hide();
                        jQuery('#contributorFinishId').show();
                        jQuery(".sourceFlagImg").hide();
                        if (GlobalData.multiDevice.previousCount === "") {
                            jQuery(".indicationContributor,.upArrowFlagImg").show();
                        } else {
                            if (parseInt(GlobalData.multiDevice.previousCount) >= 1000) {
                                jQuery("#saveAndDesignUpload").addClass('disabled_btn');
                            }
                            jQuery('.indicationContributor').text('Add up to ' + uploaderView.imageLimit + ' photos from any source above.');
                            jQuery(".sourceFlagImg").hide();
                            jQuery(".indicationContributor").hide();
                            jQuery('#contributorFinishId').show();
                            jQuery(".upArrow").show();
                        }
                        jQuery('#contributorFinishId').show();
                    } else if (GlobalData.multiDevice.design_request_type_name === 'MCMD' && GlobalData.multiDevice.belongsTo === 'Owner') {
                        GlobalData.belongsTo = 'owner';
                        GlobalData.orderInfo = {};
                        GlobalData.orderInfo.order_id = GlobalData.multiDevice.orderId;
                        GlobalData.orderInfo.title = GlobalData.multiDevice.title;
                        //                        jQuery(".friendsBox").fadeOut();                    
                        if (parseInt(GlobalData.multiDevice.previousCount) >= 1000) {
                            jQuery("#saveAndDesignUpload").addClass('disabled_btn');
                        }
                        jQuery('.indicationContributor').text('Add up to ' + uploaderView.imageLimit + ' photos from any source above.');
                        jQuery(".sourceFlagImg,.AddUptoText").hide();
                        jQuery(".upArrow").show();
                        jQuery(".indicationContributor").hide();

                    } else if (GlobalData.multiDevice.design_request_type_name === 'SCMD' && GlobalData.multiDevice.belongsTo === 'Owner') {
                        GlobalData.belongsTo = 'owner';
                        GlobalData.orderInfo = {};
                        GlobalData.orderInfo.order_id = GlobalData.multiDevice.orderId;
                        GlobalData.orderInfo.title = GlobalData.multiDevice.title;
                        //                        jQuery(".friendsBox").fadeOut();
                        if (parseInt(GlobalData.multiDevice.previousCount) >= 1000) {
                            jQuery("#saveAndDesignUpload").addClass('disabled_btn');
                        }
                        jQuery('#imageRemains').text(uploaderView.imageLimit);
                        jQuery(".sourceFlagImg").hide();
                        jQuery('#contributorFinishId').hide();
                        jQuery(".upArrow").show();
                        jQuery(".indicationContributor").hide();
                    }
                } else {
                    jQuery('.otherDeviceBox').show();
                    jQuery('#finishId').fadeIn();
                }
            } else {
                jQuery("#contributorFinishId,#saveAndDesignId").hide();
                jQuery(".sourceFlagImg").fadeIn();
            }
            jQuery('#page-content-wrapper').css('background', '#fff');
            jQuery('body').addClass('page-loaded').removeClass('page-loading');
            jQuery('body > .pageload').fadeOut();
            jQuery(".loadingPhotogurusBody").hide();
            jQuery('#NavBarDiv').hide();
            jQuery('.loginHeader,.home-icon').show();
            jQuery('#uploaderContainer .logoPhotogurus,#uploaderContainer .loginHeader .home-icon').click(function () {
                if (jQuery('.mycomputerImages').length > 0) {
                    jQuery('.loseSelectionModal').modal('show');
                } else {
                    jQuery('.home-icon').hide();
                    jQuery('body').addClass('page-loaded');
                    jQuery('body > .pageload').fadeOut();
                    uploaderView.redirectToDashboard();
                }
            });
            jQuery('.loseSelectionModal #redirectionToDashboardBtn').click(function () {
                jQuery('.home-icon').hide();
                facebookInitialisationFlag = 0;
                googleView.reset();
                flickrView.reset();
                AmazonView.reset();
                fbCounter = 0;
                delete GlobalData.multiDevice;
                delete GlobalData.orderInfo;
                location.hash = "/dashboard";
            });
            googleView = GoogleView.create();
            googleView.addToDiv();
            flickrView = FlickrView.create();
            flickrView.addToDiv();
            var amazonView = AmazonView.create();
            amazonView.addToUploader();

            loadFBJS();
            customerId = locationSearch[1];

            if (customerId === "" || customerId === undefined) {
                customerId = getCookie("custId");
                authToken = getCookie("authToken");
                if (customerId === "" || authToken === "") {
                    window.location = '#/dashboard';
                }
            }


            var msgUtils = getLocalizationValues();
            jQuery(".designStart .modal-body p #firstText").text(msgUtils.uploadStarted);
            jQuery(".errorMessageModal .modal-header h4").text('Super!');
            jQuery(".errorMessageModal .modal-body p #firstText").text(msgUtils.addedPhoto);
            jQuery(".errorMessageModal .modal-body p #secondText").text(msgUtils.submit);
            jQuery(".errorMessageModal #confirm_download").text(msgUtils.ok);
            jQuery(".errorMessageModal .closeModal").text('No');
            jQuery(".designStart .modal-body p #firstText").text(msgUtils.gotyourstory);
            jQuery(".designStart .modal-body p #secondText").text(msgUtils.now);
            jQuery(".designStart #redirectBaseURLId").text(msgUtils.ok);
            jQuery("#max1000Text").text(msgUtils.max1000Text);
            jQuery(".add_photo_title").text(msgUtils.pleaseAddPhotosFrom);
            uploaderView.applyCustomeScrollToCollection();
            /*Get cookie*/

            jQuery("#title").val('');
            jQuery("#subtitle").val('');
            jQuery("#specialInstruction").val('');
            jQuery(".loadingPhotogurusBody").hide();
            var winHeight = jQuery(window).height() - 460;
            if (winHeight > 191) {
                jQuery(".collection_box").css("min-height", winHeight + "px");
            } else {
                jQuery(".collection_box").css("min-height", "191px");
            }

            jQuery(window).resize(function () {
                var winHeight = jQuery(window).height() - 460;
                jQuery(".collection_box").css("min-height", winHeight + "px");
                jQuery(".collection_box").css("max-height", winHeight + "px");
                var msgContent = ((jQuery(window).height()) - (300)) / 2;
                jQuery('.messageModal .modal-dialog').css('margin-top', msgContent + 'px');
            });
            var msgContent = ((jQuery(window).height()) - (300)) / 2;
            jQuery('.messageModal .modal-dialog').css('margin-top', msgContent + 'px');

            jQuery("#menu-toggle").click(function (e) {
                e.preventDefault();
                jQuery("#wrapper").toggleClass("toggled");
            });
            jQuery(".closeMenu").click(function (e) {
                e.preventDefault();
                jQuery("#wrapper").toggleClass("toggled");
            });
            /*-----------lazy loading----------*/
            function getLazyLoadingImageCount() {

                var imageContainerHeight = jQuery(".collection_box").height();
                if (imageContainerHeight > 400) {
                    finalCount = imageContainerHeight / 120;
                    finalCount = finalCount * 9;
                } else {
                    finalCount = 36;
                }
            }

            jQuery('.blank-box').text(currentVersion);
            getLazyLoadingImageCount();
            jQuery(".successMessageBox").css("visibility", "hidden");
            var url = '',
                uploadButton = jQuery('<button/>')
                .addClass('button delete')
                .prop('disabled', true)
                .text('Delete...')
                .on('click', function () {

                    console.log("delete");
                    var jQuerythis = jQuery(this),
                        data = jQuerythis.data();
                    data.files.splice(index, 1);
                    jQuery(this).off('click').text('Delete...').on('click', function () {
                        jQuerythis.remove();
                        data.abort();
                    });
                    jQuerythis.remove();
                    data.context.remove();
                    data.abort();
                });

            var inputField = jQuery("#title");
            jQuery("#createOrder").addClass('disabled_btn');
            var title = jQuery.trim(inputField.val());
            if (title.length <= 0) {
                jQuery("#createOrder").addClass('disabled_btn');
            } else {
                jQuery("#createOrder").removeClass('disabled_btn');
            }

            inputField.keyup(function (e) {
                var titleVal = jQuery.trim(jQuery(this).val());
                if (titleVal.length === 0) {
                    if (e.keyCode === 32 || e.keyCode === 8 || e.keyCode === 46) {
                        jQuery("#createOrder").addClass('disabled_btn');
                    } else {
                        jQuery("#createOrder").removeClass('disabled_btn');
                    }
                } else {
                    jQuery("#createOrder").removeClass('disabled_btn');
                }
            });
            jQuery('#fileupload').fileupload({
                    url: url,
                    dataType: 'json',
                    autoUpload: false,
                    sequentialUploads: true,
                    acceptFileTypes: /(\.|\/)(jpe?g|png)$/i,
                    loadImageFileTypes: /(\.|\/)(jpe?g|png)$/i,
                    maxFileSize: 25000000,
                    disableImageResize: true,
                    disableImagePreview: true,
                    disableImageLoad: true,
                    dataArray: new Array(),
                    singleFileUploads: true,
                    limitConcurrentUploads: 1,
                    bitrateInterval: 10000,
                    previewThumbnail: false,
                    maxRetries: 3,
                    retryTimeout: 300000,
                    disableImageHead: false,
                    disableExif: false,
                    disableExifThumbnail: false,
                    disableExifSub: false,
                    previewOrientation: false,
                    beforeSend: function (xhr, data) {
                        xhr.setRequestHeader('x-api-session-key', CookieUtils.getCookie("sessionKey"));
                        xhr.setRequestHeader('version', 1);
                    },
                    formData: {
                        order_id: 'default',
                        sequence: 'default'
                    }
                }).on('fileuploadadd', function (e, data) {
                    //console.log('fileuploadadd');
                    var jQuerythis = jQuery(this),
                        that = jQuerythis.data('blueimp-fileupload') || jQuerythis.data('fileupload'),
                        options = that.options;
                    jQuery(".sourceFlagImg").hide();
                    fileUploaddedCount = 0;
                    if (data.files[0]['size'] < 100000000) {
                        jQuery.each(data.files, function (index, file) {
                            notDuplicate = true;

                            if ((file.type === "image/jpeg" || file.type === "image/png") && notDuplicate) {
                                isValidImage = true;
                                options.dataArray.push(data);
                                photolength = parseInt(data.originalFiles.length);
                                mclengthWithoutDuplicate = options.dataArray.length;
                                //mclengthWithoutDuplicate = options.dataArray.length;
                                lazyLoadingCount++;
                                var titleText = data.files[0].name;
                                jQuery('#files').append("<div class='col-xs-4 mycomputerImages mc' data-lastModified=" + data.files[0].lastModified + " data-toggle='tooltip' ><div class='mcIcon'></div><div class='generalTextName'>" + data.files[0].name + "</div><div class='deleteIcon delete spriteImage'></div></div>");
                                var toolEle = jQuery("#files").find("[data-lastModified='" + data.files[0].lastModified + "']");
                                toolEle.attr('title', titleText);
                                uploaderView.counterUpdate();
                            } else {
                                mcFileTypeFlag++;
                            }
                        });
                        if (mcFileTypeFlag > 0) {
                            jQuery('.fileType').modal('hide');
                            jQuery('.fileType .modal-body p').text(msgUtils.fileTypeAllow);
                            jQuery('.fileType').modal('show');
                        }

                    } else {
                        fileSize++;
                        if (fileSize > 0) {
                            jQuery('.fileSizeExceeded').modal('hide');
                            jQuery('.fileSizeExceeded .modal-body p').text(msgUtils.photoSizeLimit + fileSize + msgUtils.filesRemoved);
                            jQuery('.fileSizeExceeded').modal('show');
                        }
                    }
                    if (isValidImage === false) {

                        return;
                    }
                }).on('fileuploadprocessalways', function (e, data) {
                    //console.log('fileuploadprocessalways');
                    var isValidImage = false;
                    jQuery.each(data.files, function (index, file) {
                        if (file.type === "image/jpeg" || file.type === "image/png") {
                            isValidImage = true;
                        }
                    });
                    if (isValidImage === false) {
                        return;
                    }

                    if (notDuplicate) {
                        var index = data.index;
                        var file = data.files[index];
                    }
                }).on('fileuploadstart', function () {
                    //console.log('fileuploadstart');
                }).on('fileuploadcompleted', function () {
                    //console.log('fileuploadcompleted');

                }).on('fileuploadstop', function () {
                    //console.log('fileuploadstop');
                    if (navigator.onLine) {
                        if ((GlobalData.fileUploadData.cloudCount + fileUploaddedCount) === GlobalData.fileUploadData.totalCount) {
                            jQuery('#progress .progress-bar').css('width', 100 + '%');
                            var uploadedStr = (GlobalData.fileUploadData.cloudCount + fileUploaddedCount) + " / " + GlobalData.fileUploadData.totalCount;
                            GlobalData.fileUploadData.progressRelatedData.fileUploadedandTotalStr = uploadedStr;
                            GlobalData.fileUploadData.progressRelatedData.progress = 100;
                            UploadProgressUtils.fileUploadToShelf();
                            UploaderView.finishOrderCall();
                        }
                    }
                }).on('fileuploadprocessstart', function () {
                    //console.log('fileuploadprocessstart');
                }).on('fileuploadprocessstop', function () {
                    //console.log('fileuploadprocessstop');
                    jQuery(".loadingPhotogurusBody").hide();
                    fileSize = 0;
                }).on('fileuploadprogress', function (e, data) {
                    //console.log('fileuploadprogress');
                    UploadProgressUtils.indivdualfileUploadToShelf(data);
                }).on('fileuploadprogressall', function (e, data) {
                    //console.log('fileuploadprogressall');
                    var progress = (GlobalData.fileUploadData.cloudCount + fileUploaddedCount) / (GlobalData.fileUploadData.totalCount) * (100);
                    jQuery('#progress .progress-bar').css('width', progress + '%');
                    var remaningTime = calculateRemainingTime((data.total - data.loaded), data.bitrate);
                    var uploadedStr = (GlobalData.fileUploadData.cloudCount + fileUploaddedCount) + " / " + GlobalData.fileUploadData.totalCount;
                    if (fileUploaddedCount > 0) {
                        jQuery("#progressCounter").text(uploadedStr);
                    }
                    jQuery("#progressEstTime").text("(Time remaining: " + remaningTime + ")");
                    GlobalData.fileUploadData.progressRelatedData = {};
                    GlobalData.fileUploadData.progressRelatedData.timeRemaining = remaningTime;
                    GlobalData.fileUploadData.progressRelatedData.fileUploadedandTotalStr = uploadedStr;
                    GlobalData.fileUploadData.progressRelatedData.progress = progress;
                    UploadProgressUtils.fileUploadToShelf();
                    if (fileUploaddedCount === GlobalData.fileUploadData.totalCount) {
                        jQuery('#progress .progress-bar').css('width', 100 + '%');
                        var uploadedStr = (GlobalData.fileUploadData.cloudCount + fileUploaddedCount) + " / " + GlobalData.fileUploadData.totalCount;
                        GlobalData.fileUploadData.progressRelatedData.fileUploadedandTotalStr = uploadedStr;
                        GlobalData.fileUploadData.progressRelatedData.progress = 100;
                        fileUploaddedCount = 0;
                        UploadProgressUtils.fileUploadToShelf();
                        UploaderView.finishOrderCall();
                    }
                }).on('fileuploadprogress', function (e, data) {
                    //console.log('fileuploadprogress');
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    var s = data.state();
                    UploadProgressUtils.indivdualfileUploadToShelf(progress, s);

                }).on('fileuploadsend', function () {
                    //console.log('fileuploadsend');
                    if (GlobalData.fileUploadData.retryTransfer === -1) {
                        //call API to get updated story name
                        console.dir(GlobalData);
                        var requestData = {
                            order_id: GlobalData.fileUploadData.orderData.orderId
                        };
                        var promiseOrderInfo = '';
                        if (GlobalData.belongsTo === "contributor" || GlobalData.belongsTo === "owner") {
                            promiseOrderInfo = ContributionService.getOrderInformation(requestData);
                            console.log('orderinfo API called');
                            $.when(promiseOrderInfo)
                                .done(function (obj1) {
                                    if (obj1.arr_data !== null && obj1.int_status_code !== 0) {
                                        jQuery('.stopTransfer').modal({
                                            backdrop: 'static',
                                            keyboard: false
                                        });

                                        jQuery('#stopTransferText').text(obj1.arr_data.story_owner_name + ' has already sent the story ' + obj1.arr_data.cover_caption + ' for design, so no more photos will be uploaded.');

                                        jQuery(".stopTransferModal").click(function (event) {
                                            event.stopPropagation();
                                            jQuery('.stopTransfer').modal('hide');
                                            jQuery('body > .pageload').fadeIn();
                                            GlobalData.fileUploadData.onGoingUpload = 3; // dont show progressbar, update the story status on dashboard 
                                            //location.hash = "/dashboard";
                                            //UploaderView.redirectToDashboard();
                                            facebookInitialisationFlag = 0;
                                            googleView.reset();
                                            flickrView.reset();
                                            AmazonView.reset();
                                            delete GlobalData.multiDevice;
                                            delete GlobalData.orderInfo;
                                            //location.hash = "/dashboard";
                                            window.onbeforeunload = null;
                                            window.onunload = null;
                                            document.location.reload();
                                        });
                                    } else {
                                        console.log('API response is null');
                                    }
                                });
                        } else {
                            console.log('orderinfo api not called');
                        }

                        return false;
                    }
                }).on('fileuploaddone', function () {
                    //console.log('fileuploaddone');
                    fileUploaddedCount++;
                    if (fileUploaddedCount > 0) {
                        UploadProgressUtils.singleFileUploadDone(fileUploaddedCount);
                    }
                }).on('fileuploadfail', function (e, data) {
                    //console.log('fileuploadfail');
                    if (data.textStatus === "error") {
                        jQuery("#progressEstTime").text("Please check network connection. Uploading is Paused!");
                        UploadProgressUtils.noNetworkConnection();
                        var retryAfter30 = setInterval(function () {
                            if (navigator.onLine) {
                                data.submit().success(function () {
                                    clearInterval(retryAfter30);
                                });
                            }
                        }, 30000);
                    } else {
                        mcCounter = parseInt(mcCounter) - 1;
                        totalCount = totalCount - 1;
                        if (totalCount === 0) {
                            jQuery(".sourceFlagImg").fadeIn("slow");
                        }
                        jQuery("#totalCountHidden").val(totalCount);
                        jQuery("#myComputerPhotoCounter").text(mcCounter + " Photos Added");
                        jQuery("#totalCount").text(msgUtils.total + totalCount + ' photos selected');
                        if (mcCounter === 1) {
                            jQuery("#myComputerPhotoCounter").text(mcCounter + msgUtils.photoAdded);
                        }
                        if (totalCount === 1) {
                            jQuery("#totalCount").text(msgUtils.total + totalCount + msgUtils.photoSelected);
                        }
                        jQuery("#myComputerPhotoCounter").css("visibility", "visible");
                        jQuery("#totalCount").css("visibility", "visible");
                        if (mcCounter === 0) {
                            jQuery("#myComputerPhotoCounter").css("visibility", "hidden");
                        }
                        if (totalCount === 0) {
                            jQuery("#totalCount").text('');
                        }
                    }


                }).prop('disabled', !jQuery.support.fileInput)
                .parent().addClass(jQuery.support.fileInput ? undefined : 'disabled');

            jQuery('#fileupload').change(function () {
                mcFileTypeFlag = 0;
            });
            jQuery('#fileupload').click(function () {
                fileSize = 0;
            });

            function customScrollToApplyMCPreview() {
                var scrollUploadImageLength = 0;
                if (jQuery('.collection_box').find(".mCSB_dragger").position().top > 250) {
                    var data = jQuery('#fileupload').fileupload('option').dataArray;
                    finalCount = parseInt(finalCount);
                    if (data.length > finalCount) {

                        if (data.length > (finalCount + 38)) {
                            scrollUploadImageLength = finalCount + 38;
                        } else {
                            scrollUploadImageLength = data.length;
                        }
                        for (lazyLoadingCount; lazyLoadingCount < scrollUploadImageLength; lazyLoadingCount++) {
                            finalCount = lazyLoadingCount;
                            data[finalCount].context = jQuery('<div/>').appendTo('#files');
                            data[finalCount].context.addClass('preview-img mc');
                            data[finalCount].uuid = createUUID();
                            data[finalCount].uploadDone = false;
                            photolength = parseInt(data[finalCount].originalFiles.length);

                            var nodeLoading = jQuery('<div/>').append(jQuery('<div/>').addClass('loading-photogurus'));
                            var node = jQuery('<div/>').append(jQuery('<div/>').addClass('file-title'));
                            if (data[finalCount].files[0].preview) {
                                nodeLoading.prepend(data[finalCount].files[0].preview);
                            }
                            nodeLoading.appendTo(data[finalCount].context);
                            node.appendTo(data[finalCount].context);


                            var node2 = jQuery('<div/>').addClass("delete-button-div").append(uploadButton.clone(true).data(data[finalCount]));
                            node2.appendTo(data[finalCount].context);
                            node2.find(".delete").click(function () {
                                for (var i = 0; i < options.dataArray.length; i++) {
                                    if (options.dataArray[i].files[0].lastModified === data[finalCount].files[0].lastModified && options.dataArray[i].files[0].name === data[finalCount].files[0].name) {

                                        options.dataArray.splice(i, 1);
                                        break;
                                    }
                                }
                            });

                        }
                    }

                }

            }

            jQuery("#facebookUpload").on('click', function () {
                GlobalData.ec.recordClickEvent('Story_origin', 'FacebookButtonClicked');

                if (jQuery("#facebookUpload").hasClass("fbdisable")) {} else {
                    //check what is the connedtion status with Facebook
                    FB.getLoginStatus(function (response) {

                        UploaderView.statusChangeCallback(response);
                    });


                }
            });
            jQuery(".fbClose").click(function () {
                jQuery("#myModal").modal("hide");
            });
            /* add fb photos to main collection page*/

            jQuery('#myModal').on('hide', function (e) {
                var fbSelectionCount = jQuery('.facebookModalCheck #FBAlbumsPhotos .selected').length;
                if (fbSelectionCount > 0) {
                    e.preventDefault();
                }
            });
            jQuery("#myModal #addfbphotos").click(function (e) {
                e.preventDefault();
                var fbSelectionCount = jQuery('.facebookModalCheck #FBAlbumsPhotos .selected').length;
                if (fbSelectionCount > 0) {
                    var fbourldata = [];
                    var checkedValues = [];
                    var dupsCount = 0;
                    jQuery('#FBAlbumsPhotos label.selected').map(function () {
                        checkedValues.push(this.children[0].value);
                        fbourldata.push(jQuery(this.children[0]).data("ourl"));
                    }).get();
                    var fbDataArray = [];
                    jQuery('#files .fb').each(function () {
                        fbDataArray.push(jQuery(this).data("ourl"));
                    });
                    for (var j = 0; j < checkedValues.length; j++) {
                        for (var i = 0; i < fbDataArray.length; i++) {
                            if (fbourldata[j] === fbDataArray[i]) {
                                var index = fbourldata.indexOf(fbourldata[j]);
                                var index1 = checkedValues.indexOf(checkedValues[j]);
                                if (index > -1 && index1 > -1) {
                                    dupsCount++;
                                    fbourldata.splice(index, 1);
                                    checkedValues.splice(index1, 1);
                                }
                            }
                        }
                    }
                    for (var i = 0; i < checkedValues.length; i++) {
                        var fbFileName = checkedValues[i].split('/');
                        fbFileName = fbFileName[fbFileName.length - 1];
                        fbFileName = fbFileName.split('?');
                        fbFileName = fbFileName[0];

                        jQuery('#files').append('<div class="col-xs-4 mycomputerImages preview-img fb" data-ourl=' + fbourldata[i] + ' data-toggle="tooltip" title=' + fbFileName + '><div class="facebookSmallIcon"></div><div class="generalTextName">' + fbFileName + '</div><div class="deleteIcon delete spriteImage"></div></div>');

                    }
                    jQuery('input:checkbox').removeAttr('checked');
                    totalCount = parseInt(jQuery("#totalCountHidden").val());
                    fbCounter = fbCounter + checkedValues.length;
                    jQuery("#fbPhotoCounter").text(fbCounter + " Photos added");
                    totalCount = totalCount + checkedValues.length;
                    jQuery("#totalCountHidden").val(totalCount);
                    jQuery("#totalCountHidden").val(totalCount);
                    jQuery("#totalCount").text(msgUtils.total + totalCount + ' photos selected');
                    if (fbCounter === 1) {
                        jQuery("#fbPhotoCounter").text(fbCounter + msgUtils.photoAdded);
                    }
                    if (totalCount === 1) {
                        jQuery("#totalCount").text(msgUtils.total + totalCount + msgUtils.photoSelected);
                    }
                    jQuery("#fbPhotoCounter").css("visibility", "visible");
                    jQuery("#totalCount").css("visibility", "visible");
                    checkedValues = [];
                    jQuery(".fb-albums-focus").removeClass("fb-albums-focus");
                    jQuery(".choose").show();
                    jQuery(".rightArrow").removeClass("rightArrow");
                    if (dupsCount > 0) {
                        jQuery('#myModal').modal('hide');
                        jQuery(".duplicateAlert .modal-body p").text(dupsCount + " duplicates have been removed from your selection");
                        jQuery(".duplicateAlert").modal("show");
                    } else {
                        jQuery(".facebookModalCheck .backFBModal").addClass('closeFBModal').removeClass('backFBModal');
                        jQuery('#myModal').modal('hide');
                    }
                    jQuery('.facebookModalCheck #closeFBAlbumList').hide();
                }
            });

            jQuery(".facebookModalCheck #FBAlbumsPhotos").hide();
            jQuery(".facebookModalCheck #addfbphotos").hide();
            jQuery('#files').on('click', '.preview-img.fb .delete', function () {
                fbCounter = fbCounter - 1;
                jQuery("#fbPhotoCounter").text(fbCounter + " Photos added");
                totalCount = totalCount - 1;
                jQuery("#totalCountHidden").val(totalCount);
                if (totalCount > 0) {
                    jQuery("#totalCount").text(msgUtils.total + totalCount + ' photos selected');
                    jQuery("#fbPhotoCounter").css("visibility", "visible");
                } else {
                    jQuery("#totalCount").text('');
                }
                if (fbCounter < 1) {
                    jQuery("#fbPhotoCounter").css("visibility", "hidden");
                }
                if (fbCounter === 1) {
                    jQuery("#fbPhotoCounter").text(fbCounter + msgUtils.photoAdded);
                }
                if (totalCount === 1) {
                    jQuery("#totalCount").text(msgUtils.total + totalCount + msgUtils.photoSelected);
                }
                if (totalCount === 0) {
                    jQuery(".sourceFlagImg").fadeIn("slow");
                }

                jQuery("#totalCount").css("visibility", "visible");
                jQuery(this).parent().remove();
            });
            jQuery('#files').on('click', '.preview-img-db .delete', function () {
                dropboxCounter = dropboxCounter - 1;
                jQuery("#dbPhotoCounter").text(dropboxCounter + " Photos added");
                totalCount = totalCount - 1;
                jQuery("#totalCountHidden").val(totalCount);
                if (totalCount > 0) {
                    jQuery("#totalCount").text(msgUtils.total + totalCount + ' photos selected');
                    jQuery("#dbPhotoCounter").css("visibility", "visible");
                } else {
                    jQuery("#totalCount").text('');
                }
                if (dropboxCounter < 1) {
                    jQuery("#dbPhotoCounter").css("visibility", "hidden");
                }
                if (dropboxCounter === 1) {
                    jQuery("#dbPhotoCounter").text(dropboxCounter + msgUtils.photoAdded);
                }
                if (totalCount === 1) {
                    jQuery("#totalCount").text(msgUtils.total + totalCount + msgUtils.photoSelected);
                }
                if (totalCount == 0) {
                    jQuery(".sourceFlagImg").fadeIn("slow");
                }
                jQuery("#totalCount").css("visibility", "visible");
                jQuery(this).parent().remove();
            });
            jQuery('#files').on('click', '.preview-img-flicker .delete', function () {
                flickerCounter = parseInt(jQuery("#flickerCountHidden").val());
                totalCount = parseInt(jQuery("#totalCountHidden").val());
                flickerCounter = flickerCounter - 1;
                totalCount = totalCount - 1;
                jQuery("#totalCountHidden").val(totalCount);
                jQuery("#flickerCountHidden").val(flickerCounter);
                jQuery("#flickerPhotoCounter").text(flickerCounter + " Photos added");
                if (totalCount > 0) {
                    jQuery("#totalCount").text(msgUtils.total + totalCount + ' photos selected');
                    jQuery("#flickerPhotoCounter").css("visibility", "visible");
                } else {
                    jQuery("#totalCount").text('');
                }
                if (flickerCounter < 1) {
                    jQuery("#flickerPhotoCounter").css("visibility", "hidden");
                }
                if (flickerCounter === 1) {
                    jQuery("#flickerPhotoCounter").text(flickerCounter + msgUtils.photoAdded);
                }
                if (totalCount === 1) {
                    jQuery("#totalCount").text(msgUtils.total + totalCount + msgUtils.photoSelected);
                }
                if (totalCount === 0) {
                    jQuery(".sourceFlagImg").fadeIn("slow");
                }
                jQuery("#totalCount").css("visibility", "visible");
                jQuery(this).parent().remove();
            });
            jQuery('#files').on('click', '.preview-img-gp .delete', function () {
                gpCounter = parseInt(jQuery("#gpCountHidden").val());
                totalCount = parseInt(jQuery("#totalCountHidden").val());
                gpCounter = gpCounter - 1;
                totalCount = totalCount - 1;
                jQuery("#totalCountHidden").val(totalCount);
                jQuery("#gpCountHidden").val(gpCounter);
                jQuery("#GPhotoCounter").text(gpCounter + " Photos added");
                if (totalCount > 0) {
                    jQuery("#totalCount").text(msgUtils.total + totalCount + ' photos selected');
                    jQuery("#GPhotoCounter").css("visibility", "visible");
                } else {
                    jQuery("#totalCount").text('');
                }
                if (gpCounter < 1) {
                    jQuery("#GPhotoCounter").css("visibility", "hidden");
                }
                if (gpCounter === 1) {
                    jQuery("#GPhotoCounter").text(gpCounter + msgUtils.photoAdded);
                }
                if (totalCount === 1) {
                    jQuery("#totalCount").text(msgUtils.total + totalCount + msgUtils.photoSelected);
                }
                if (totalCount === 0) {
                    jQuery(".sourceFlagImg").fadeIn("slow");
                }
                jQuery("#totalCount").css("visibility", "visible");
                jQuery(this).parent().remove();
            });
            jQuery('#files').on('click', '.preview-img-ac .delete', function () {
                acCounter = parseInt(jQuery("#acCountHidden").val());
                totalCount = parseInt(jQuery("#totalCountHidden").val());
                acCounter = acCounter - 1;
                totalCount = totalCount - 1;
                jQuery("#totalCountHidden").val(totalCount);
                jQuery("#acCountHidden").val(acCounter);
                jQuery("#ACPhotoCounter").text(acCounter + " Photos added");
                if (totalCount > 0) {
                    jQuery("#totalCount").text(msgUtils.total + totalCount + ' photos selected');
                    jQuery("#ACPhotoCounter").css("visibility", "visible");
                } else {
                    jQuery("#totalCount").text('');
                }
                if (acCounter < 1) {
                    jQuery("#ACPhotoCounter").css("visibility", "hidden");
                }
                if (acCounter === 1) {
                    jQuery("#ACPhotoCounter").text(acCounter + msgUtils.photoAdded);
                }
                if (totalCount === 1) {
                    jQuery("#totalCount").text(msgUtils.total + totalCount + msgUtils.photoSelected);
                }
                if (totalCount === 0) {
                    jQuery(".sourceFlagImg").fadeIn("slow");
                }
                jQuery("#totalCount").css("visibility", "visible");
                jQuery(this).parent().remove();
            });
            jQuery('#files').on('click', '.mc .delete', function () {
                var currentFileName = jQuery(this).parent().text();
                var dataArray = jQuery('#fileupload').fileupload('option').dataArray;
                for (var i = 0; i < dataArray.length; i++) {
                    if (dataArray[i].files[0].name === currentFileName) {
                        dataArray.splice(i, 1);
                        break;
                    }
                }
                jQuery(this).parent().remove();
                //mclengthWithoutDuplicate = jQuery('#fileupload').fileupload('option').dataArray;
                mclengthWithoutDuplicate = dataArray.length;
                uploaderView.counterUpdate();
            });
            jQuery(".facebookModalCheck .modal-body-right").on('click', '.fb-albums', function () {
                jQuery(".loadingPhotogurusBody,.facebookModalCheck #FBAlbumsPhotos,.facebookModalCheck #importSelectFlickerPhotosId,.facebookModalCheck .closeFBModal,.facebookModalCheck #addfbphotos,.facebookModalCheck .choose,.facebookModalCheck #closeFBAlbumList").show();
                jQuery(".facebookModalCheck .fb-albums-focus").removeClass("fb-albums-focus");
                jQuery(".facebookModalCheck #FBAlbums,.facebookModalCheck #import").hide();
                jQuery(".facebookModalCheck .rightArrow").removeClass("rightArrow");
                var albumId = jQuery(this).data("albumId");
                console.log(albumId);
                var numberOfphotosDiv = jQuery(this);
                var numberOfphotos = numberOfphotosDiv[0].children;
                numberOfphotos = parseInt(numberOfphotos[2].textContent);
                loadPhotos(albumId, numberOfphotos);
                jQuery(".modal-body-right").mCustomScrollbar({
                    setTop: 0
                });
            });

            /* whole fb album photos are added to the main collection page*/

            jQuery(".facebookAlbumSelectionModal").on('click', '.backFBModal', function () {
                var fbSelectionCount = jQuery('.facebookModalCheck #FBAlbumsPhotos .selected').length;
                if (fbSelectionCount > 0) {
                    jQuery('.loseSelectionFBModal').modal('show');
                } else {
                    uploaderView.FBAlbumScreen();
                }

            });
            jQuery(".facebookAlbumSelectionModal").on('click', '#closeFBAlbumList', function () {
                var fbSelectionCount = jQuery('.facebookModalCheck #FBAlbumsPhotos .selected').length;
                if (fbSelectionCount > 0) {
                    jQuery('.loseSelectionFBCloseModal').modal('show');
                } else {
                    uploaderView.closeFBModalWindow();
                }

            });
            jQuery('.loseSelectionFBModal #redirectionToFBAlbumBtn').click(uploaderView.FBAlbumScreen);
            jQuery(".facebookAlbumSelectionModal,.loseSelectionFBCloseModal").on('click', '.closeFBModal ,#redirectionToUploadFBAlbumBtn', uploaderView.closeFBModalWindow);

            /*checkbox*/
            jQuery('.input_class_checkbox').each(function () {
                jQuery(this).hide().after('<div class="class_checkbox" />');
            });

            var lastChecked = null;
            var jQuerychkboxes = jQuery('.class_checkbox');
            jQuerychkboxes.on('click', function (e) {
                jQuery(this).toggleClass('checked').prev().prop('checked', jQuery(this).is('.checked'));
                if (!lastChecked) {
                    lastChecked = this;
                    return;
                }
                if (e.shiftKey) {
                    var start = jQuerychkboxes.index(this);
                    var end = jQuerychkboxes.index(lastChecked);
                    jQuerychkboxes.slice(Math.min(start, end), Math.max(start, end) + 1).prop('checked', lastChecked.checked);
                }
                lastChecked = this;
            });


            /*-----------------------------One Drive ------------------------------*/
            //            var oneDriveSelectedImagesData = [];
            //            jQuery("#oneDrive").click(function () {
            //                OneDrive.open(odOptions);
            //            });
            //            var odOptions = {
            //                clientId: "43455d38-85ff-4b15-b61c-0577148efdbc",
            //                action: "download",
            //                multiSelect: true,
            //                openInNewWindow: true,
            //                advanced: {},
            //                success: function (files) {
            //                    for (var odCounter = 0; odCounter < files.value.length; odCounter++) {
            //                        jQuery('#files').append("<div class='col-xs-4 mycomputerImages mc' data-toggle='tooltip' ><div class='odIcon'></div><div class='generalTextName'>" + files.value[odCounter].name + "</div><div class='deleteIcon delete spriteImage'></div></div>");
            //                    }
            //                    jQuery(".sourceFlagImg").hide();
            //                },
            //                cancel: function () {
            //                },
            //                error: function (e) {
            //                }
            //            };


            /*-----------------------------One Drive end-----------------------------*/
            jQuery('.popup-modal').magnificPopup({
                type: 'inline',
                preloader: false,
                focus: '#username',
                modal: true
            });
            jQuery(document).on('click', '.popup-modal-dismiss', function (e) {
                e.preventDefault();
                jQuery.magnificPopup.close();
            });
            jQuery(".closeModal").click(function () {
                jQuery.magnificPopup.close();
            });

            jQuery("#title").focusin(function () {
                var titleVal = jQuery.trim(jQuery(this).val());
                console.log('focusin' + titleVal.length);
                if (titleVal.length <= 0) {
                    jQuery("#createOrder").addClass('disabled_btn');
                    jQuery("#createOrder").off('click keypress', submitOrderForm);
                } else {
                    jQuery("#createOrder").removeClass('disabled_btn');
                    jQuery("#createOrder").on('click keypress', submitOrderForm);
                }
            });
            jQuery("#title").focusout(function () {
                var titleVal = jQuery.trim(jQuery(this).val());
                console.log('focusout' + titleVal.length);
                if (titleVal.length <= 0) {
                    jQuery("#createOrder").addClass('disabled_btn');
                    jQuery("#createOrder").off('click keypress', submitOrderForm);
                } else {
                    jQuery("#createOrder").removeClass('disabled_btn');
                    jQuery("#createOrder").on('click keypress', submitOrderForm);
                }
            });


            var orderSubmitFunc = function (type) {
                //console.log('orderSubmitFunc ' + type);
                var data = '';
                if (type === 'updateStory') {
                    data = uploaderView.validateOrderDetails(type);
                } else {
                    data = uploaderView.validateOrderDetails(type);
                }
                //console.dir(data);
                var methodType = "POST";
                if (type !== 'saveStory' || type !== 'multiDeviceStory' || type !== 'multiContributor') {
                    if (data === null || jQuery("#createOrder").hasClass('disabled_btn')) {
                        return;
                    }
                } else {}
                if (type === 'updateStory' || type === 'saveStory') {
                    methodType = "PUT";
                    jQuery("#uploadPhotoTitle").text(GlobalData.fileUploadData.title);
                }
                var sessionToken = CookieUtils.getCookie("sessionKey");

                if (type === 'updateStory') {
                    if (jQuery("#totalCountHidden").val() === '0') {
                        data.image_set_source = '';
                        data = JSON.stringify(data);
                        //console.log(GlobalData.baseUrlNew);
                        //console.log(data);
                        createOrder(GlobalData.baseUrlNew, data, methodType, function orderSuccess(orderId, imageSetIdList) {
                            //uploaderView.transferImages(orderId, imageSetIdList);
                            GlobalData.multiDevice = {};
                            jQuery.magnificPopup.close();
                            GlobalData.noImage = 1;
                            GlobalData.uploadType = 'multideviceDesignMyStory';
                            //console.log(GlobalData.uploadType);
                            GlobalData.fileUploadData.onGoingUpload = 3; // no images update the story status on dashboard
                            uploaderView.redirectToDashboard();

                        }, sessionToken);
                    } else {
                        data = JSON.stringify(data);
                        createOrder(GlobalData.baseUrlNew, data, methodType, function orderSuccess(orderId, imageSetIdList) {
                            GlobalData.multiDevice = {};
                            uploaderView.showLoaderIcon();
                            jQuery.magnificPopup.close();
                            GlobalData.uploadType = 'multideviceDesignMyStory';
                            //console.log(GlobalData.uploadType);
                            uploaderView.transferImages(orderId, imageSetIdList);
                        }, sessionToken);
                    }
                } else if (type === 'SCMDtoMCMDconvertion') {
                    if (GlobalData.multiDevice.design_request_type_name === 'SCMD') {
                        data = {
                            "order_id": GlobalData.multiDevice.orderId
                        };
                        data = JSON.stringify(data);
                        methodType = "PUT";
                        convertSCMDtoMCMD(GlobalData.baseUrlNew, data, methodType, function orderSuccess(respData) {
                            if (respData.int_status_code == 1) {
                                //jQuery("#copyLinkInput").val(GlobalData.multiDevice.copyLink);
                                /*GlobalData.multiDevice = {};
                                 GlobalData.noImage = 1;
                                 GlobalData.uploadType = 'multiContributor';
                                 GlobalData.fileUploadData.onGoingUpload = 3;// no images update the story status on dashboard 
                                 uploaderView.multiContributor = {};
                                 uploaderView.multiContributor.invitation_link = GlobalData.multiDevice.copyLink;*/
                                /*GlobalData.orderInfo = {};
                                 GlobalData.orderInfo.order_id = GlobalData.multiDevice.orderId;
                                 GlobalData.orderInfo.title = GlobalData.multiDevice.title;*/
                            } else {
                                console.log("oops! something went wrong");
                            }
                        }, sessionToken);
                    }

                    if (jQuery("#totalCountHidden").val() === '0') {
                        //console.log('am here ' + GlobalData.multiDevice.copyLink);
                        jQuery("#copyLinkInput").val(GlobalData.multiDevice.copyLink);
                        uploaderView.multiContributor = {};
                        uploaderView.multiContributor.invitation_link = GlobalData.multiDevice.copyLink;
                        GlobalData.orderInfo = {};
                        GlobalData.orderInfo.order_id = GlobalData.multiDevice.orderId;
                        GlobalData.orderInfo.title = GlobalData.multiDevice.title;
                        GlobalData.multiDevice = {};
                        GlobalData.noImage = 1;
                        GlobalData.uploadType = 'multiContributor';
                        GlobalData.fileUploadData.onGoingUpload = 3; // no images update the story status on dashboard 
                        jQuery(".inviteFriendsToAddPhotosModal").modal('show');

                    } else {
                        var data = uploaderView.validateOrderDetails('SCMDtoMCMDconvertion');
                        //console.log('Raw data for create imageset');
                        //console.dir(data);
                        //console.log('am here 1 ' + GlobalData.multiDevice.copyLink);
                        var sessionToken = CookieUtils.getCookie("sessionKey");
                        createImageSet(GlobalData.baseUrlNew, data, sessionToken, function imageSetSuccess(data) {
                            //console.log('image set created');
                            data = data.arr_data;
                            jQuery("#copyLinkInput").val(GlobalData.multiDevice.copyLink);
                            uploaderView.multiContributor = {};
                            uploaderView.multiContributor.invitation_link = GlobalData.multiDevice.copyLink;
                            GlobalData.orderInfo = {};
                            GlobalData.orderInfo.order_id = GlobalData.multiDevice.orderId;
                            GlobalData.orderInfo.title = GlobalData.multiDevice.title;
                            GlobalData.multiDevice = {};
                            GlobalData.uploadType = 'multiContributor';
                            jQuery(".inviteFriendsToAddPhotosModal").modal('show');
                            uploaderView.transferImages(data.order_id, data.image_set_source_info);
                        }, function errorCallback(data) {
                            console.log("not able to create image set please check again.");
                        });
                    }

                } else if (type === 'multiContributor') {
                    if (jQuery("#totalCountHidden").val() === '0') {
                        //console.log('am here');
                        data.image_set_source = '';
                        //                        data = JSON.stringify(data);
                        createOrder(GlobalData.baseUrlNew, data, methodType, function orderSuccess(orderId, imageSetIdList, respData) {
                            //uploaderView.transferImages(orderId, imageSetIdList);
                            GlobalData.cover_name = data.cover_caption;
                            GlobalData.multiDevice = {};
                            GlobalData.multiDevice.design_request_type_name = 'MCMD';
                            GlobalData.noImage = 1;
                            GlobalData.uploadType = 'multiContributor';
                            //console.log(GlobalData.uploadType);
                            GlobalData.fileUploadData.onGoingUpload = 3; // no images update the story status on dashboard                            
                            uploaderView.multiContributor = {};
                            uploaderView.multiContributor.invitation_link = respData.invitation_link;
                            jQuery("#copyLinkInput").val(uploaderView.multiContributor.invitation_link);
                            jQuery('.pageload').fadeOut();
                            jQuery(".inviteFriendsModal").modal('hide');
                            jQuery("#savingPhotosMsg").text("");
                            jQuery("#copySaveText").text("");
                            jQuery(".inviteFriendsToAddPhotosModal").modal('show');
                            GlobalData.orderInfo = {};
                            GlobalData.orderInfo.order_id = respData.order_id;
                            GlobalData.orderInfo.title = data.cover_caption;
                            //                            uploaderView.redirectToDashboard();
                        }, sessionToken);
                    } else {
                        //                        data = JSON.stringify(data);
                        createOrder(GlobalData.baseUrlNew, data, methodType, function orderSuccess(orderId, imageSetIdList, respData) {

                            GlobalData.orderInfo = {};
                            GlobalData.orderInfo.order_id = respData.order_id;
                            GlobalData.orderInfo.title = data.cover_caption;

                            GlobalData.multiDevice = {};
                            GlobalData.multiDevice.design_request_type_name = 'MCMD';
                            GlobalData.uploadType = 'multiContributor';
                            //console.log(GlobalData.uploadType);
                            uploaderView.multiContributor = {};
                            uploaderView.multiContributor.invitation_link = respData.invitation_link;
                            jQuery("#copyLinkInput").val(uploaderView.multiContributor.invitation_link);

                            jQuery(".inviteFriendsModal").modal('hide');
                            jQuery(".inviteFriendsToAddPhotosModal").modal('show');
                            jQuery('.pageload').fadeOut();
                            jQuery("#savingPhotosMsg").text("We will save your photos now.");
                            jQuery("#copySaveText").text("We will save your photos now.");
                            GlobalData.orderInfo = {};
                            GlobalData.orderInfo.order_id = respData.order_id;
                            GlobalData.orderInfo.title = data.cover_caption;
                            uploaderView.transferImages(orderId, imageSetIdList);
                        }, sessionToken);
                    }

                } else {

                    if(type === 'multiDeviceStory'){
                        if(jQuery("#totalCountHidden").val() === '0'){
                            data.image_set_source = '';
                            createOrder(GlobalData.baseUrlNew, data, methodType, function orderSuccess(orderId) {
                                GlobalData.multiDevice = {};
                                GlobalData.uploadType = '';
                                GlobalData.uploadType = 'multideviceSaveStory';
                                GlobalData.fileUploadData.onGoingUpload = 3; // no images update the story status on dashboard
                                jQuery(".loadingPhotogurusBody").hide();
                                jQuery(".otherDeviceModal").modal("hide");
                                jQuery('.multiDeviceWithoutImage').modal('show');
                                jQuery('.multiDeviceWithoutImageClose').click(function (event) {
                                    event.stopPropagation();
                                    jQuery('.multiDeviceWithoutImage').modal('hide');
                                    UploaderView.redirectToDashboard();
                                });
                            }, sessionToken);

                        }else{
                            createOrder(GlobalData.baseUrlNew, data, methodType, function orderSuccess(orderId, imageSetIdList) {
                                GlobalData.multiDevice = {};
                                GlobalData.uploadType = '';
                                GlobalData.uploadType = 'multideviceSaveStory';
                                uploaderView.transferImages(orderId, imageSetIdList);
                            }, sessionToken);
                        }

                    }else{
                        createOrder(GlobalData.baseUrlNew, data, methodType, function orderSuccess(orderId, imageSetIdList) {
                            GlobalData.multiDevice = {};
                            GlobalData.uploadType = '';
                            GlobalData.uploadType = 'singleUserSingleDeviceDesignMyStory';
                            if (type === 'saveStory') {
                                GlobalData.uploadType = 'multideviceSaveStory';
                            }
                            //console.log('else part in orderSubmit ' + GlobalData.uploadType);
                            jQuery.magnificPopup.close();
                            uploaderView.transferImages(orderId, imageSetIdList);
                        }, sessionToken);
                    }
                }
            };

            /*jQuery("#createOrder").on('click keypress', function orderSubmit(event) {
                console.log('am here');
                GlobalData.ec.recordClickEvent('Story_origin', 'CreateOrderButtonClicked');
                event.stopPropagation();
                getIp(function getIpSuccess(ip) {
                    myip = ip;
                    if (GlobalData.multiDevice !== undefined) {
                        if (GlobalData.multiDevice.DesignRequestType === 1) {
                            orderSubmitFunc('updateStory');
                        }
                    } else {
                        uploaderView.showLoaderIcon(); //show loader icon until you redirected to dashboard
                        GlobalData.photoStoryStatusMsg = "DesignNow";
                        orderSubmitFunc();

                    }

                });
            });*/

            var submitOrderForm = function (event) {
                console.log(jQuery("#totalCountHidden").val(), typeof(jQuery("#totalCountHidden").val()));
                if(jQuery("#totalCountHidden").val()){
                    console.log('am here');
                    var pixel_params = null;
                    pixel_params = {'Photo_count' : jQuery("#totalCountHidden").val()};
                    //Fb Pixel
                    GlobalData.ec.recordFBPixelEvent('track', 'AddToWishlist', pixel_params);
                }
                //debugger;
                GlobalData.ec.recordClickEvent('Story_origin', 'CreateOrderButtonClicked');
                event.stopPropagation();
                getIp(function getIpSuccess(ip) {
                    myip = ip;
                    if (GlobalData.multiDevice !== undefined) {
                        if (GlobalData.multiDevice.DesignRequestType === 1) {
                            orderSubmitFunc('updateStory');
                        }
                    } else {
                        uploaderView.showLoaderIcon(); //show loader icon until you redirected to dashboard
                        GlobalData.photoStoryStatusMsg = "DesignNow";
                        orderSubmitFunc();

                    }

                });
            };

            jQuery('#specialInstruction').focusout(function () {
                jQuery("#createOrder").focus();
                jQuery("#createOrder").css({
                    'outline': '1px solid #DBA204'
                });
            });
            jQuery('#createOrder').focusout(function () {
                jQuery("#createOrder").css({
                    'outline': '0px solid #DBA204'
                });
            });

            jQuery('#startCreatingOrder').click(function () {
                jQuery.magnificPopup.open({
                    items: {
                        src: '#photoStoryPopup'
                    },
                    type: 'inline'
                });
                jQuery("#createOrder").off('click keypress');//initially turned off
            });




            jQuery('#finishId').click(function () {
                var totalCount = jQuery("#totalCountHidden").val();
                if (totalCount > 19 && totalCount < 1001) {
                    uploaderView.showLoaderIcon();
                    setTimeout(function () {
                        uploaderView.countDuplicatesFromMyComputer("FinishOrder");
                    }, 500);
                } else {
                    limitFor20Image();
                }
            });
            jQuery(".check20Finish").on('click', '.dupMessageBtn', function () {
                var totalCount = jQuery("#totalCountHidden").val();
                if (totalCount > 19) {
                    jQuery(".errorMessageModal").modal("show");
                }
            });
            jQuery(".loggedOut").on('click', '.loggedOutFromFacebook', function () {
                FB.login(function (response) {
                    jQuery(".dynamicLoadingMessage").text("Connecting to facebook");
                    if (response && !response.error && response.status === 'connected') {
                        jQuery(".facebookModalCheck #FBAlbums").empty();
                        jQuery(".facebookModalCheck #FBAlbumsPhotos").empty();
                        jQuery(".dynamicLoadingMessage").text("loading facebook album...");
                        jQuery(".loadingPhotogurusBody").show();

                        loadFBAlbums();
                        jQuery('#myModal').modal('show');
                        jQuery(".loadingPhotogurusBody").hide();
                    }
                }, {
                    scope: 'public_profile,user_photos'
                });
            });

            totalCount = jQuery("#totalCountHidden").val();
            if (totalCount < 20) {
                //                jQuery('#startUpload.primary_btn').addClass('disabled_btn');
            } else {
                //                jQuery('#startUpload.primary_btn').removeClass('disabled_btn');
            }
            jQuery('#flickerpopup').click(function () {
                GlobalData.ec.recordClickEvent('Story_origin', 'FlickrButtonClicked');
                var w = 900;
                var h = 369;
                var title = "Photo gurus Flicker Login";
                var left = (screen.width / 2) - (w / 2);
                var top = (screen.height / 2) - (h / 2);
                childWin = window.open(GlobalData.htmlUploaderFlickrOauthARL, title, 'toolbar=no,scrollbars=1,resizable=1,  location=yes, directories=no, status=no, menubar=no,copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
                return childWin;
            });
            jQuery("#myModal").on('click', '#FBAlbums .fb-albums', function () {
                jQuery('.facebookModalCheck .saveFbPhots').css({
                    'color': '#7e7e7e'
                });
                jQuery(".facebookModalCheck .choose").hide();
                jQuery(".facebookModalCheck .fb-albums-focus").removeClass("fb-albums-focus");
                jQuery(".facebookModalCheck .rightArrow").removeClass("rightArrow");
                var albumId = jQuery(this).data('albumId');
                jQuery(".facebookModalCheck #selPhototsFB").data("albumId", albumId);
                jQuery(".facebookModalCheck #allfbAlbumPhoto").data("albumId", albumId);
                var fbAlbumText = this.children[1].textContent;
                jQuery(".facebookModalCheck #fbInnerTitle").text(fbAlbumText);
                jQuery('.facebookModalCheck .fbphotosSelectionCount').show();
                jQuery('.facebookModalCheck .fbphotosSelectionCount').text("0 photos selected");
            });
            jQuery(".googlePhotoBox").click(function () {
                GlobalData.ec.recordClickEvent('Story_origin', 'GooglePhotosButtonClicked');
                var w = 900;
                var h = 369;
                var title = "Photo gurus Google Photo Login";
                var left = (screen.width / 2) - (w / 2);
                var top = (screen.height / 2) - (h / 2);
                var childWin = window.open(GlobalData.htmlUploaderGPOauthURL, title, 'titlebar=no, toolbar=no, location=yes, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=900, height=369, top=' + top + ', left=' + left);

                var timer = setInterval(checkChild, 500);

                function checkChild() {
                    if (childWin.closed) {
                        clearInterval(timer);
                    }
                }
                return childWin;
            });

            function indicationHideShow() {
                jQuery(".sourceFlagImg").hide();
                jQuery(".loadingPhotogurusBody").hide();
            }

            jQuery(".limitIndication").hide();

            function limitFor20Image() {
                //console.log(maxFiles);
                var totalCount = jQuery("#totalCountHidden").val();

                if (totalCount < 20) {
                    jQuery(".limitIndication").text(msgUtils.select + " " + (20 - totalCount) + " " + msgUtils.mores);
                    jQuery(".limitIndication").show();
                    jQuery(".indicationFlip").hide();
                    if (totalCount == 0) {
                        jQuery(".limitIndication").hide();
                    }
                    if (totalCount == 19) {
                        jQuery(".limitIndication").text(msgUtils.select + " " + (20 - totalCount) + " " + msgUtils.more);
                    }
                } else if (totalCount > maxFiles) {
                    jQuery(".limitCrossed").show();
                    //console.log((parseInt(totalCount) - maxFiles));
                    jQuery("#numberOfFilesToRemove").text(msgUtils.remove + (parseInt(totalCount) - maxFiles) + msgUtils.photosToContinue);
                } else {
                    jQuery(".limitCrossed").hide();
                    jQuery(".limitIndication").hide();
                    jQuery(".indicationFlip").show();
                }
            }

            function updateLimit() {
                var totalCount = jQuery("#totalCountHidden").val();
                if (totalCount < 20) {
                    //console.log(20 - totalCount);
                    jQuery(".limitIndication").text(msgUtils.select + " " + (20 - totalCount) + " " + msgUtils.mores);
                    if (totalCount == 0) {
                        jQuery(".limitIndication").hide();
                    }
                    if (totalCount == 19) {
                        //console.log(20 - totalCount);
                        jQuery(".limitIndication").text(msgUtils.select + " " + (20 - totalCount) + " " + msgUtils.more);
                    }
                } else if (totalCount > maxFiles) {
                    jQuery(".limitCrossed").show();
                    //console.log((parseInt(totalCount) - maxFiles));
                    jQuery("#numberOfFilesToRemove").text(msgUtils.remove + (parseInt(totalCount) - maxFiles) + msgUtils.photosToContinue);
                } else {
                    jQuery(".limitCrossed").hide();
                    jQuery(".limitIndication").hide();
                    jQuery(".indicationFlip").show();
                }
            }

            jQuery(".indicationFlip").hide();
            jQuery("#totalCount").bind("DOMSubtreeModified", function () {
                var totalCount = parseInt(jQuery("#totalCountHidden").val());
                jQuery('.upArrow').hide();
                indicationHideShow();
                uploaderView.enabledOtherDevice();
                if (GlobalData.multiDevice !== undefined) {
                    if (GlobalData.multiDevice.DesignRequestType === 1 && GlobalData.multiDevice.design_request_type_name !== 'MCMD') {
                        if (parseInt(jQuery("#totalCountHidden").val()) > maxFiles) {
                            jQuery('#saveAndDesignUpload').addClass('disabled_btn');
                            jQuery(".limitCrossed").show();

                            //console.log((parseInt(totalCount) - maxFiles));
                            jQuery("#numberOfFilesToRemove").text(msgUtils.remove + (parseInt(totalCount) - maxFiles) + msgUtils.photosToContinue);
                        } else if (parseInt(jQuery("#totalCountHidden").val()) > 0 && parseInt(jQuery("#totalCountHidden").val()) <= maxFiles) {
                            jQuery('#saveAndDesignUpload').removeClass('disabled_btn');
                            uploaderView.imageLimit = 1000 - parseInt(GlobalData.multiDevice.previousCount);
                            var limit20Image = parseInt(GlobalData.multiDevice.previousCount) + parseInt(jQuery("#totalCountHidden").val());
                            jQuery(".limitCrossed").hide();
                            if (limit20Image > 20) {
                                jQuery("#designMyStoryId").addClass("disabled");
                            } else {
                                jQuery("#designMyStoryId").removeClass("disabled");
                            }
                        } else if (parseInt(jQuery("#totalCountHidden").val()) === 0) {
                            jQuery("#saveAndDesignUpload").addClass('disabled_btn');
                        }
                    } else if (GlobalData.multiDevice.DesignRequestType === 1 && GlobalData.multiDevice.design_request_type_name === 'MCMD' && GlobalData.multiDevice.belongsTo === 'contributor') {
                        if (parseInt(jQuery("#totalCountHidden").val()) > maxFiles) {
                            jQuery('#contributorUpload').addClass('disabled_btn');
                            jQuery(".limitCrossed").show();

                            //console.log((parseInt(totalCount) - maxFiles));
                            jQuery("#numberOfFilesToRemove").text(msgUtils.remove + (parseInt(totalCount) - maxFiles) + msgUtils.photosToContinue);
                        } else if (parseInt(jQuery("#totalCountHidden").val()) > 0 && parseInt(jQuery("#totalCountHidden").val()) <= maxFiles) {
                            jQuery('#contributorUpload').removeClass('disabled_btn');
                            uploaderView.imageLimit = 1000 - parseInt(GlobalData.multiDevice.previousCount);
                            var limit20Image = parseInt(GlobalData.multiDevice.previousCount) + parseInt(jQuery("#totalCountHidden").val());
                            jQuery(".limitCrossed").hide();
                        } else if (parseInt(jQuery("#totalCountHidden").val()) === 0) {
                            jQuery("#contributorUpload").addClass("disabled_btn");

                        }

                    } else if (GlobalData.multiDevice.DesignRequestType === 1 && GlobalData.multiDevice.design_request_type_name === 'MCMD' && GlobalData.multiDevice.belongsTo === 'Owner') {
                        jQuery('#contributorFinishId').hide();
                        if (parseInt(jQuery("#totalCountHidden").val()) > maxFiles) {
                            jQuery('#saveAndDesignUpload').addClass('disabled_btn');
                            jQuery(".limitCrossed").show();
                            //console.log((parseInt(totalCount) - maxFiles));
                            jQuery("#numberOfFilesToRemove").text(msgUtils.remove + (parseInt(totalCount) - maxFiles) + msgUtils.photosToContinue);
                        } else if (parseInt(jQuery("#totalCountHidden").val()) > 0 && parseInt(jQuery("#totalCountHidden").val()) <= maxFiles) {
                            jQuery('#saveAndDesignUpload').removeClass('disabled_btn');
                            uploaderView.imageLimit = 1000 - parseInt(GlobalData.multiDevice.previousCount);
                            var limit20Image = parseInt(GlobalData.multiDevice.previousCount) + parseInt(jQuery("#totalCountHidden").val());
                            jQuery(".limitCrossed").hide();
                        } else if (parseInt(jQuery("#totalCountHidden").val()) === 0) {
                            jQuery("#saveAndDesignUpload").addClass('disabled_btn');
                        }

                    }
                } else {
                    updateLimit();
                }

            });

            jQuery('#redirectBaseURLId,.home').click(function () {
                uploaderView.redirectToDashboard();
            });
            /* other device event */
            jQuery('.otherDeviceBox').click(uploaderView.otherDevicePopup);
            jQuery('#closeSavePopup').click(uploaderView.closeSaveStoryPopup);

            var saveInputField = jQuery("#savetitle");
            jQuery("#saveStory").addClass('saveStoryDisabled');
            var saveTitle = jQuery.trim(saveInputField.val());
            if (saveTitle.length <= 0) {
                jQuery("#saveStory").addClass('saveStoryDisabled');
            } else {
                jQuery("#saveStory").removeClass('saveStoryDisabled');
            }
            saveInputField.keyup(uploaderView.saveStoryInputKeysup);
            saveInputField.mouseover(uploaderView.saveStoryInputKeysup);
            saveInputField.change(uploaderView.saveStoryInputKeysup);
            saveInputField.on('paste input', uploaderView.saveStoryInputKeysup);

            jQuery("#saveStory").click(function (e) {
                if (!$(this).hasClass('saveStoryDisabled')) {
                    if (totalCount <= 0) {
                        console.log('caseMD: ' + totalCount);
                        GlobalData.fileUploadData.onGoingUpload = 0;
                    }
                    uploaderView.showLoaderIcon();
                    getIp(function getIpSuccess(ip) {
                        myip = ip;
                        orderSubmitFunc('multiDeviceStory');
                    });
                }
            });
            jQuery('#saveAndDesignUpload').click(uploaderView.showSaveAndDesignPopup);
            jQuery('#startUpdatingOrder').click(uploaderView.updateOrderAPIcall);
            jQuery('#designMyStoryId').click(uploaderView.designMyStory);
            jQuery('.check20 #dupsRemovedOK').click(uploaderView.saveStoryPopup);
            jQuery('#dupsRemovedFinishOK').click(uploaderView.finishStoryPopup);
            jQuery('.otherDeviceBoxDisabled').click(uploaderView.imageSelectionPopup);
            jQuery('#closeSDPopup').click(function () {
                jQuery('.saveAndDesignPopup').modal('hide');
            });
            /* multi contributor event */
            jQuery(".friendsBox").click(function (event) {
                GlobalData.ec.recordClickEvent('Story_origin', 'FriendsButtonClicked');
                event.stopPropagation();

                //console.dir(GlobalData.multiDevice);

                if (GlobalData.multiDevice !== undefined) {
                    if (GlobalData.multiDevice.design_request_type_name === 'SCMD' || GlobalData.multiDevice.design_request_type_name === 'MCMD') {
                        //console.log('Conversion area');
                        jQuery("#title").val(GlobalData.multiDevice.title);
                        getIp(function getIpSuccess(ip) {
                            myip = ip;
                            orderSubmitFunc('SCMDtoMCMDconvertion');
                        });
                    } else {
                        //console.log('seems someone has clicked outside of invite email popup');
                        jQuery("#friendsTitle").val("");
                        jQuery(".inviteFriendsModal").modal('show');
                        jQuery("#inviteFriendsNextBtn").addClass('saveStoryDisabled');
                    }
                } else {
                    jQuery("#friendsTitle").val("");
                    jQuery(".inviteFriendsModal").modal('show');
                    jQuery("#inviteFriendsNextBtn").addClass('saveStoryDisabled');
                }
            });

            jQuery("#closeIFPopup").click(uploaderView.hideInviteFriendsPopup);
            jQuery("#inviteFriendsNextBtn").click(function (event) {
                event.stopPropagation();
                if (!$(this).hasClass('saveStoryDisabled')) {
                    if (totalCount <= 0) {
                        console.log('case:MC ' + totalCount);
                        GlobalData.fileUploadData.onGoingUpload = 0;
                    }
                    jQuery('.pageload').fadeIn();
                    getIp(function getIpSuccess(ip) {
                        myip = ip;
                        orderSubmitFunc('multiContributor');
                    });

                    //                    jQuery(".inviteFriendsToAddPhotosModal").modal('show');
                }
            });
            jQuery("#closeIFAddPhotosPopup").click(uploaderView.hideInviteFriendsToAddPhotosPopup);
            jQuery(".email-button i").click(uploaderView.showContributorEmailSharePopup);
            jQuery(".share-button i").click(uploaderView.showContributorCopyLinkSharePopup);
            jQuery("#copyLinkBtn").click(uploaderView.showCopiedLinkSuccessMessage);
            jQuery("#linkCopiedSuccessBtn").click(uploaderView.copySuccessAction);
            jQuery('#contributorUpload').click(uploaderView.showContributorFinishPopup);
            jQuery('#finishContributionId').click(uploaderView.contributeImages);
            jQuery('#addPhotosFromAnotherDevice').click(uploaderView.contributeImagesNowAndInFuture);
            jQuery('#alertImageCountBtn').click(uploaderView.imageCountExceeded);
            var friendsTitleField = jQuery("#friendsTitle");
            jQuery("#inviteFriendsNextBtn").addClass('saveStoryDisabled');
            var saveTitle = jQuery.trim(saveInputField.val());
            if (saveTitle.length <= 0) {
                jQuery("#inviteFriendsNextBtn").addClass('saveStoryDisabled');
            } else {
                jQuery("#inviteFriendsNextBtn").removeClass('saveStoryDisabled');
            }
            friendsTitleField.keyup(uploaderView.friendsTitleInputKeysup);
            friendsTitleField.mouseover(uploaderView.friendsTitleInputKeysup);
            friendsTitleField.change(uploaderView.friendsTitleInputKeysup);
            friendsTitleField.on('paste input', uploaderView.friendsTitleInputKeysup);

            PubSub.unsubscribe("REDIRECT_TO_DASHBOARD");
            PubSub.subscribe("REDIRECT_TO_DASHBOARD", function () {
                uploaderView.redirectToDashboard();
            });

        };
        /*  multi contributor features methods */
        this.copySuccessAction = function () {
            jQuery('.pageload').fadeIn();
            uploaderView.redirectToDashboard();
        };

        this.imageCountExceeded = function () {
            uploaderView.redirectToDashboard();
        }

        this.contributorServiceDataCreation = function (finishval) {
            return {
                "order_id": GlobalData.multiDevice.orderId,
                "invitee_customer_id": customerId,
                "current_session_total_images_count": jQuery("#totalCountHidden").val(),
                "finish_contribution_flag": finishval
            };
        }
        this.contributeImages = function () {
            jQuery(".loadingPhotogurusBody").show();
            var requestData = uploaderView.contributorServiceDataCreation("1");
            var promise = ContributionService.contributeImages(requestData);
            promise.then(function (data) {
                //jQuery(".loadingPhotogurusBody").hide();
                if (data.int_status_code === 1) {
                    uploaderView.updateOrderAPIcall();
                } else {
                    alert("Not able to send notification to the story owner");
                }

            }).fail(function () {

            });
        };

        this.contributeImagesNowAndInFuture = function () {
            jQuery(".loadingPhotogurusBody").show();
            var requestData = uploaderView.contributorServiceDataCreation("0");
            var promise = ContributionService.contributeImages(requestData);
            promise.then(function (data) {
                //jQuery(".loadingPhotogurusBody").hide();
                if (data.int_status_code === 1) {
                    uploaderView.updateOrderAPIcall();
                } else {
                    alert("Not able to send notification to the story owner");
                }

            }).fail(function () {

            });

        };

        this.showContributorFinishPopup = function () {
            if (!(jQuery(this).hasClass('disabled_btn'))) {
                jQuery('.pageload').show();
                var requestData = {
                    order_id: GlobalData.multiDevice.orderId
                };
                var promiseOrderInfoForValidate = '';

                promiseOrderInfoForValidate = ContributionService.getOrderInformation(requestData);

                $.when(promiseOrderInfoForValidate)
                    .done(function (obj) {
                        //console.dir(obj);   
                        GlobalData.currentOrderInfo = {};
                        GlobalData.currentOrderInfo = obj.arr_data;
                        //console.dir(GlobalData.orderInfo.currentOrderInfo);

                        if (GlobalData.currentOrderInfo.design_request_type_name === 'SCMD') {
                            maxFileLimit = 1000;
                        } else {
                            maxFileLimit = 2000;
                        }

                        if (GlobalData.currentOrderInfo.total_transferred_count < maxFileLimit && GlobalData.currentOrderInfo.order_status == "50") {
                            jQuery('.pageload').hide();
                            jQuery('#contributorFinishPopup').modal('show');
                            jQuery('.confirmationBoxTextForDevice').text(uploaderView.msgUtils.addPhotosFromDevice);
                            var msgContent = (jQuery(window).height() - jQuery('#contributorFinishPopup .modal-dialog').height()) / 2;
                            jQuery('#contributorFinishPopup .modal-dialog').css('margin-top', msgContent + 'px');
                        } else if (GlobalData.currentOrderInfo.order_status !== "50") {
                            jQuery('.pageload').hide();
                            var msg_text = GlobalData.currentOrderInfo.story_owner_name + ' has already sent the story ' + GlobalData.currentOrderInfo.cover_caption + ' for design, so no more photos will be uploaded';
                            jQuery('.alertImageCount').modal('show');
                            jQuery('#displayTextError').html(msg_text);
                        } else if (GlobalData.currentOrderInfo.total_transferred_count >= maxFileLimit) {
                            jQuery('.pageload').hide();
                            var msg_text = 'No more photos can be added to the story.';
                            jQuery('.alertImageCount').modal('show');
                            jQuery('#displayTextError').html(msg_text);
                        }

                    });
            }

        };

        this.showCopiedLinkSuccessMessage = function () {
            console.dir(GlobalData);
            jQuery(".linkCopiedAndSaveSuccessModal .modal-header h4").text('Link copied.');
            jQuery('.pageload').fadeIn();
            jQuery(".copyLinkModal").modal('hide');
            jQuery('.copy-text').fadeOut();
            var copyTextarea = null;
            var hasImage = false;
            console.log(GlobalData.fileUploadData.totalCount);
            if(GlobalData.fileUploadData.totalCount){
                hasImage = true;
            }
            if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
                jQuery(".linkCopiedAndSaveSuccessModal").modal({
                    backdrop: 'static',
                    keyboard: false
                });
                jQuery(".linkCopiedAndSaveSuccessModal p:first").text('Tap on the story draft to add photos anytime.');
                if(hasImage){
                    jQuery(".linkCopiedAndSaveSuccessModal p:first").text('We will save your photos now. No need to wait.');
                }
                jQuery('.copy-text').fadeIn().text("Please select link and use ctrl+c to copy the link");
                copyTextarea = document.querySelector('#copyLinkInput');
                copyTextarea.select();
            }

            copyTextarea = document.querySelector('#copyLinkInput');
            copyTextarea.select();
            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
                if (msg === 'unsuccessful') {
                    if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
                        //                                        jQuery('.modal').modal('hide');
                    }
                } else {
                    jQuery(".linkCopiedAndSaveSuccessModal").modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                    //                    jQuery('#errorMessageModal').modal('show');
                    jQuery(".linkCopiedAndSaveSuccessModal p:first").text('Tap on the story draft to add photos anytime.');
                    if(hasImage){
                        jQuery(".linkCopiedAndSaveSuccessModal p:first").text('We will save your photos now. No need to wait.');
                    }
                    jQuery('#errorMessageModal .copy-text').text("Link copied to the clipboard.");
                    jQuery('#errorMessageModal #errorMessageModalOKBtn').click(function () {
                        jQuery('.modal').modal('hide');
                    });
                }
            } catch (err) {}
            jQuery('.pageload').fadeOut();
        };
        this.checkFBPermission = function (deferred) {
            UploaderView.tempData = "";
            FB.api('/me/permissions', function (response) {
                console.log('called checkFBPermission');
                var declined = ["user_photos"];
                console.dir(response);
                if (typeof (response.data) === "undefined") {
                    declined = ["user_photos"]; //if no permissions set
                } else {
                    for (var i = 0; i < response.data.length; i++) {
                        if (response.data[i].permission === 'user_photos' && response.data[i].status === 'granted') {
                            declined = [];
                        }
                    }
                }
                UploaderView.tempData = declined;
                deferred.resolve();
            });
        };
        this.actionBasedOnFBPermission = function () {
            UploaderView.tempData = "";
            var deferred = $.Deferred();
            window.fb_loaded = deferred.promise();
            UploaderView.checkFBPermission(deferred);
            $.when(fb_loaded).then(function () {
                var declinedPermissions = UploaderView.tempData;
                console.dir(declinedPermissions);
                if (declinedPermissions.length === 0) {
                    jQuery(".dynamicLoadingMessage").text("loading facebook album...");
                    jQuery(".loadingPhotogurusBody").show();
                    jQuery('#FBAlbums').empty();
                    loadFBAlbums();
                    jQuery('#myModal').modal('show');
                    uploaderView.facebookModalAlignment();
                } else {
                    jQuery('#messageModal.fbPermissionDialog').modal('show');
                    jQuery('#messageModal #reinitiateFBDialog').unbind("click");
                    jQuery('#messageModal #reinitiateFBDialog').on('click', function (event) {
                        event.stopPropagation();
                        jQuery('#messageModal.fbPermissionDialog').modal('hide');
                        FB.login(function (response) {
                            facebookData = response;
                            //console.dir(response);
                            if (response && !response.error && response.status === 'connected') {
                                if (response.authResponse !== null) {
                                    //console.log(response.authResponse.grantedScopes);
                                    //var permissions = response.authResponse.grantedScopes.split(",");
                                    //if (permissions.indexOf("email") !== -1) {
                                    jQuery(".dynamicLoadingMessage").text("loading facebook album...");
                                    jQuery(".loadingPhotogurusBody").show();
                                    jQuery('#FBAlbums').empty();
                                    loadFBAlbums();
                                    jQuery('#myModal').modal('show');
                                    uploaderView.facebookModalAlignment();
                                    /*} else {
                                        alert('Please allow access to the photos associated with your Facebook account');
                                    }*/
                                }
                            }
                        }, {
                            scope: 'email, public_profile, user_photos',
                            auth_type: 'rerequest',
                            return_scopes: true
                        });

                    });
                }
            });
        }

        this.statusChangeCallback = function (response) {
            facebookData = response;
            console.log('getLoginStatus value is');
            console.dir(facebookData);
            jQuery(".facebookModalCheck .back ,#FBAlbumsPhotos,.facebookModalCheck #addfbphotos").hide();
            jQuery(".facebookModalCheck #FBAlbums,.facebookModalCheck #import").show();


            if (facebookData.status === 'connected') {
                console.log('am here 1');
                UploaderView.actionBasedOnFBPermission();

            } else if (facebookData.status === 'not_authorized') {
                console.log('am here 2');
                // The person is logged into Facebook, but not your app.
                // document.getElementById('status').innerHTML = 'Please log ' + 'into this app.';
                //UploaderView.actionBasedOnFBPermission();
                FB.login(function (response) {
                    //console.dir(response);
                    facebookData = response;
                    if (response && !response.error && response.status === 'connected') {
                        if (response.authResponse !== null) {
                            jQuery(".dynamicLoadingMessage").text("loading facebook album...");
                            jQuery(".loadingPhotogurusBody").show();
                            jQuery('#FBAlbums').empty();
                            loadFBAlbums();
                            jQuery('#myModal').modal('show');
                            uploaderView.facebookModalAlignment();
                        }
                    }
                }, {
                    scope: 'email, public_profile, user_photos',
                    auth_type: 'rerequest',
                    return_scopes: true
                });

            } else {
                console.log('am here 3');
                jQuery(".facebookModalCheck #FBAlbums").empty();
                jQuery(".facebookModalCheck #FBAlbumsPhotos").empty();
                FB.login(function (response) {
                    facebookData = response;
                    jQuery(".dynamicLoadingMessage").text("Connecting to facebook");
                    if (response && !response.error && response.status === 'connected') {
                        UploaderView.actionBasedOnFBPermission();
                    }
                }, {
                    scope: 'email, public_profile, user_photos',
                });
            }

            jQuery('.facebookModalCheck .fbphotosSelectionCount').hide();
        };
        this.dropboxInitEvent = function () {
            /*-------------------------------------------Drop box chooser option-------------------------------*/
            var options = {
                // Required. Called when a user selects an item in the Chooser.
                success: function (files) {
                    var dups = 0;
                    for (var j = 0; j < files.length; j++) {
                        for (var i = 0; i < dbDataArray.length; i++) {
                            if (files[j] !== undefined) {
                                if (files[j].link === dbDataArray[i]) {
                                    dups++;
                                    files.splice(j, 1);
                                }

                            }

                        }
                    }
                    jQuery.each(files, function (index, photo) {
                        dbDataArray.push(photo.link);
                        var baseThumbnail = photo.thumbnailLink.split('?')[0];
                        jQuery('#files').append('<div class="col-xs-4 mycomputerImages preview-img-db" data-orignalURL=' + photo.link + ' data-toggle="tooltip" title=' + photo.name + '><div class="dropboxSmallIcon"></div><div class="generalTextName">' + photo.name + '</div><div class="deleteIcon delete spriteImage"></div></div>');
                    });
                    dropboxCounter = dropboxCounter + files.length;
                    totalCount = parseInt(jQuery("#totalCountHidden").val());
                    totalCount = totalCount + files.length;
                    jQuery("#totalCountHidden").val(totalCount);
                    jQuery("#totalCountHidden").val(totalCount);
                    jQuery(".sourceFlagImg").hide();
                    if (dropboxCounter === 1) {
                        jQuery("#dbPhotoCounter").text(dropboxCounter + msgUtils.photoAdded);
                    } else {
                        jQuery("#dbPhotoCounter").text(dropboxCounter + " Photos added");
                    }
                    if (totalCount === 1) {
                        jQuery("#totalCount").text(msgUtils.total + totalCount + msgUtils.photoSelected);
                    }
                    jQuery("#dbPhotoCounter").css("visibility", "visible");
                    jQuery("#totalCount").text(msgUtils.total + totalCount + ' photos selected');
                    if (dups > 0) {
                        jQuery('.duplicateAlert .modal-body p').text(dups + " duplicates have been removed from your selection");
                        jQuery('.duplicateAlert').modal('show');

                    }
                },
                cancel: function () {},
                linkType: "direct",
                multiselect: true,
                extensions: ['.jpg', '.png', '.jpeg']
            };

            if (Dropbox) {
                var button = Dropbox.createChooseButton(options);
                jQuery("#dropbox").append(button);
            }
            /*-----------------------------Drop box chooser end ------------------------------*/
        };

        this.showContributorCopyLinkSharePopup = function () {
            jQuery(".copyLinkModal").modal({
                backdrop: 'static',
                keyboard: false
            });
            jQuery(".inviteFriendsToAddPhotosModal").modal('hide');
        };

        this.showContributorEmailSharePopup = function () {
            var contributorEmailShareView = ContributorEmailShareView.create();
            contributorEmailShareView.addToDiv();
            jQuery(".inviteFriendsToAddPhotosModal").modal('hide');
        };

        this.hideInviteFriendsToAddPhotosPopup = function () {
            jQuery(".inviteFriendsToAddPhotosModal").modal('hide');
            uploaderView.showLoaderIcon();
            uploaderView.redirectToDashboard(); //need to confirm from Priya, whether copy link is required
        };


        this.showInviteFriendsToAddPhotosPopup = function () {

        };


        this.hideInviteFriendsPopup = function () {
            jQuery(".inviteFriendsModal").modal('hide');
        };

        /* multidevice features methods */
        this.imageSelectionPopup = function () {
            if (parseInt(jQuery("#totalCountHidden").val()) < 1) {
                jQuery(".noPhotosSelected").modal('show');
                jQuery('#selectImageId').text(msgUtils.noPhotosSelectedText);
            }
        };

        this.showLoaderIcon = function () {
            jQuery(".loadingPhotogurusBody").show();
        };
        
        

        this.saveStoryPopup = function () {
            if (parseInt(jQuery("#totalCountHidden").val()) <= maxFiles) {
                jQuery(".otherDeviceModal").modal("show");
                jQuery("#savetitle").focus();
                //jQuery(".otherDeviceModal #otherDeviceText1").text(msgUtils.otherDeviceMsg1);
                //jQuery(".otherDeviceModal #otherDeviceText2").text(msgUtils.otherDeviceMsg2);
            } else {
                jQuery(".otherDeviceModal").modal("hide");
                uploaderView.closeSaveStoryPopup();
            }
        };

        this.finishStoryPopup = function () {
            if (parseInt(jQuery("#totalCountHidden").val()) > 19) {
                jQuery(".errorMessageModal").modal("show");
            }
        };

        this.counterUpdate = function () {
            var tempDataFB = [];
            var tempDataFL = [];
            var tempDataGP = [];
            var tempDataDB = [];
            var tempDataAC = [];

            jQuery('#files .preview-img-flicker').each(function () {
                tempDataFL.push(jQuery(this).data("orignalurl"));
            });
            jQuery('#files .preview-img-gp').each(function () {
                tempDataGP.push(jQuery(this).data("orignalurl"));
            });
            jQuery('#files .fb').each(function () {
                tempDataFB.push(encodeURIComponent(jQuery(this).data("ourl")));
            });
            jQuery('#files .preview-img-db').each(function () {
                tempDataDB.push(encodeURIComponent(jQuery(this).data("orignalurl")));
            });
            jQuery('#files .preview-img-ac').each(function () {
                tempDataAC.push(encodeURIComponent(jQuery(this).data("orignalurl")));
            });
            mcCounter = jQuery('#fileupload').fileupload('option').dataArray.length;
            totalCount = parseInt(jQuery("#totalCountHidden").val());
            totalCount = tempDataFL.length + tempDataFB.length + mcCounter + tempDataGP.length + tempDataDB.length + tempDataAC.length;
            jQuery("#totalCountHidden").val(totalCount);
            jQuery("#totalCount").text(msgUtils.total + totalCount + msgUtils.photosSelected);
            jQuery("#myComputerPhotoCounter").text(mcCounter + " Photos Added");
            if (mcCounter === 1) {
                jQuery("#myComputerPhotoCounter").text(mcCounter + msgUtils.photoAdded);
            }

            if (totalCount == 0) {
                jQuery("#totalCount").text('');
            }
            if (totalCount === 1) {
                jQuery("#totalCount").text(msgUtils.total + totalCount + msgUtils.photoSelected);
            }
            jQuery("#totalCountHidden").val(totalCount);
            jQuery("#myComputerPhotoCounter").css("visibility", "visible");
            if (mcCounter == 0) {
                jQuery("#myComputerPhotoCounter").text(mcCounter + msgUtils.photoAdded);
                jQuery("#myComputerPhotoCounter").css('visibility', 'hidden');
            }
            jQuery("#totalCount").css("visibility", "visible");
        };

        this.countDuplicatesFromMyComputer = function (orderType) {
            var dataArray = jQuery('#fileupload').fileupload('option').dataArray;
            var dupsCount = 0;
            dataArray.sort(function (a, b) {
                var textA = a.files[0].name.toUpperCase();
                var textB = b.files[0].name.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
            for (var i = 0; i < dataArray.length - 1;) {
                if (dataArray[i].files[0].name === dataArray[i + 1].files[0].name) {
                    dupsCount++;
                    dataArray.splice(i, 1);
                } else {
                    i++;
                }
            }
            var seen = {};
            jQuery('.mycomputerImages').each(function () {
                var txt = jQuery(this).text();
                if (seen[txt]) {
                    jQuery(this).remove();
                } else {
                    seen[txt] = true;
                }

            });
            uploaderView.counterUpdate();

            if (orderType === 'FinishOrder') {
                if (dupsCount > 0) {
                    jQuery(".loadingPhotogurusBody").hide();
                    jQuery(".check20Finish .modal-body p").text(dupsCount + " duplicates have been removed from your selection");
                    jQuery(".check20Finish").modal("show");
                } else {
                    jQuery(".loadingPhotogurusBody").hide();
                    jQuery(".errorMessageModal").modal("show");
                }
            } else {
                if (dupsCount > 0) {
                    jQuery(".loadingPhotogurusBody").hide();
                    jQuery(".check20 .modal-body p").text(dupsCount + " duplicates have been removed from your selection");
                    jQuery(".check20").modal("show");
                } else {
                    uploaderView.saveStoryPopup();
                }
            }
        };

        this.finishOrderCall = function () {
            var finishOrderData = {
                order_id: orderIdForFinish,
                image_set_source: {
                    "image_set_ids": imageSetIdsForFinish
                }
            };
            finishOrder(GlobalData.baseUrlNew, finishOrderData, CookieUtils.getCookie("sessionKey"), function () {
                GlobalData.fileUploadData.uploadCompleted = true;
                GlobalData.fileUploadData.onGoingUpload = 2;
                UploadProgressUtils.fileUploadFinished();
            }, function () {

            });
        }
        this.designMyStory = function (e) {
            if (!($(this).hasClass("disabled"))) {
                jQuery.magnificPopup.open({
                    items: {
                        src: '#photoStoryPopup'
                    },
                    type: 'inline'
                });
                jQuery('#title').val(GlobalData.multiDevice.title);
                jQuery('#title').focus();
            }
        };

        this.updateOrderAPIcall = function () {
            //console.log('updateOrderAPIcall');
            jQuery(".loadingPhotogurusBody").show();
            var data = uploaderView.validateOrderDetails('saveStory');
            var sessionToken = CookieUtils.getCookie("sessionKey");
            createImageSet(GlobalData.baseUrlNew, data, sessionToken, function imageSetSuccess(data) {
                GlobalData.storyUpdate = "saveMore";
                data = data.arr_data;
                GlobalData.fileUploadData.title = GlobalData.multiDevice.title;
                //GlobalData.fileUploadData.storyOwnerName = GlobalData.multiDevice.storyOwnerName;
                //console.dir(GlobalData.fileUploadData);
                GlobalData.multiDevice = {};
                //jQuery(".loadingPhotogurusBody").hide();
                //console.log('loading image has been commented here');
                GlobalData.uploadType = 'multideviceSaveUpdateStory';
                if (data !== null) {
                    uploaderView.transferImages(data.order_id, data.image_set_source_info);
                } else {
                    UploaderView.redirectToDashboard();
                }
            }, function errorCallback(data) {
                alert("not able to create order please check again.");
            });
        };

        this.validateOrderDetails = function (type) {
            var data = null;
            var title = '';
            if (type === 'multiDeviceStory') {
                title = jQuery.trim(jQuery("#savetitle").val());
            } else if (type === 'multiContributor') {
                title = jQuery.trim(jQuery("#friendsTitle").val());
            } else {
                title = jQuery.trim(jQuery("#title").val());
            }
            var subtitle = jQuery("#subtitle").val();
            var specialInstruction = jQuery("#specialInstruction").val();
            var hasError = false;
            if (title.length <= 0) {
                hasError = true;
                jQuery("#createOrder").addClass('disabled_btn');
            } else {
                jQuery("#createOrder").removeClass('disabled_btn');
            }

            var tempDataMC = [];
            var tempDataFB = [];
            var tempDataDB = [];
            var tempDataFL = [];
            var tempDataGP = [];
            var tempDataAC = [];
            jQuery('#files .mc').each(function () {
                tempDataMC.push(jQuery(this).data("orignalurl"));
            });

            jQuery('#files .preview-img-flicker').each(function () {
                tempDataFL.push(jQuery(this).data("orignalurl"));
            });
            jQuery('#files .preview-img-gp').each(function () {
                tempDataGP.push(jQuery(this).data("orignalurl"));
            });
            jQuery('#files .preview-img-ac').each(function () {
                tempDataAC.push(jQuery(this).data("orignalurl"));
            });
            jQuery('#files .preview-img-db').each(function () {
                tempDataDB.push(jQuery(this).data("orignalurl"));
            });
            jQuery('#files .fb').each(function () {
                tempDataFB.push(encodeURIComponent(jQuery(this).data("ourl")));
            });
            totalCount = parseInt(jQuery("#totalCountHidden").val());
            var mycomputerImageLength = 0;
            mycomputerImageLength = jQuery('#fileupload').fileupload('option').dataArray.length;
            totalCount = tempDataFL.length + tempDataFB.length + mycomputerImageLength + tempDataGP.length + tempDataDB.length + tempDataAC.length;
            GlobalData.fileUploadData.cloudCount = tempDataFL.length + tempDataFB.length + tempDataGP.length + tempDataDB.length + tempDataAC.length;
            GlobalData.fileUploadData.totalCount = totalCount;

            var browser = get_browser_info();
            if (hasError === false || type === 'saveStory' || type == "multiDeviceStory") {
                var designTypeFlag = 0;
                //console.log('GlobalData.multiDevice');
                //console.dir(GlobalData.multiDevice);
                GlobalData.fileUploadData.title = title;

                if (type === 'saveStory' || type === 'updateStory' || type === 'multiDeviceStory') {
                    designTypeFlag = 1;
                    GlobalData.fileUploadData.designRequestType = 1; //used for displaying "Saving photos for ..."
                }
                if (type === 'multiContributor') {
                    GlobalData.fileUploadData.designRequestType = 1; //used for displaying "Saving photos for ..."
                }

                if (type === 'updateStory') {
                    data = {
                        "order_id": GlobalData.multiDevice.orderId,
                        "cover_caption": title,
                        "rib_caption": subtitle,
                        "special_instruction": specialInstruction,
                        "image_set_source": {
                            "device_name": "Web",
                            "device_id": "",
                            "device_info": {
                                "type": "Web",
                                "data": {
                                    "version": browser.version,
                                    "browser": browser.name,
                                    "referer": "WEB UPLOADER",
                                    "ip_address": myip
                                }
                            },
                            "image_set_list": {}
                        }
                    };
                } else if (type === 'saveStory') {
                    data = {
                        "contributor_customer_id": customerId,
                        "design_request_type": designTypeFlag,
                        "order_id": GlobalData.multiDevice.orderId,
                        "image_set_source": {
                            "device_name": "Web",
                            "device_id": "",
                            "device_info": {
                                "type": "Web",
                                "data": {
                                    "version": browser.version,
                                    "browser": browser.name,
                                    "referer": "WEB UPLOADER",
                                    "ip_address": myip
                                }
                            },
                            "image_set_list": {}
                        }
                    };
                } else if (type === 'SCMDtoMCMDconvertion') {
                    data = {
                        "contributor_customer_id": customerId,
                        "order_id": GlobalData.multiDevice.orderId,
                        "cover_caption": title,
                        "rib_caption": "",
                        "special_instruction": "",
                        "design_request_type": 2,
                        "is_cluster": 0,
                        "image_set_source": {
                            "device_name": "Web",
                            "device_id": "",
                            "device_info": {
                                "type": "Web",
                                "data": {
                                    "version": browser.version,
                                    "browser": browser.name,
                                    "referer": "WEB UPLOADER",
                                    "ip_address": myip
                                }
                            },
                            "image_set_list": {}
                        },
                        invite_for_image_contribution: "1"

                    };
                } else if (type === 'multiContributor') {
                    data = {
                        "owner_customer_id": customerId,
                        "cover_caption": title,
                        "rib_caption": "",
                        "special_instruction": "",
                        "design_request_type": 2,
                        "is_cluster": 0,
                        "image_set_source": {
                            "device_name": "Web",
                            "device_id": "",
                            "device_info": {
                                "type": "Web",
                                "data": {
                                    "version": browser.version,
                                    "browser": browser.name,
                                    "referer": "WEB UPLOADER",
                                    "ip_address": myip
                                }
                            },
                            "image_set_list": {}
                        },
                        invite_for_image_contribution: "1"

                    };
                } else {
                    data = {
                        "owner_customer_id": customerId,
                        "cover_caption": title,
                        "rib_caption": subtitle,
                        "special_instruction": specialInstruction,
                        "design_request_type": designTypeFlag,
                        "is_cluster": 0,
                        "image_set_source": {
                            "device_name": "Web",
                            "device_id": "",
                            "device_info": {
                                "type": "Web",
                                "data": {
                                    "version": browser.version,
                                    "browser": browser.name,
                                    "referer": "WEB UPLOADER",
                                    "ip_address": myip
                                }
                            },
                            "image_set_list": {}
                        }
                    };
                }


                GlobalData.fileUploadData.my_computer = 0;
                GlobalData.fileUploadData.facebook = 0;
                GlobalData.fileUploadData.dropbox = 0;
                GlobalData.fileUploadData.flickr = 0;
                GlobalData.fileUploadData.google_photos = 0;
                GlobalData.fileUploadData.amazon_photos = 0;
                GlobalData.fileUploadData.onGoingUpload = 1;


                if (mclengthWithoutDuplicate > 0) {
                    data.image_set_source.image_set_list.my_computer = mycomputerImageLength;
                    GlobalData.fileUploadData.my_computer = mycomputerImageLength;
                }
                if (tempDataFB.length > 0) {
                    data.image_set_source.image_set_list.facebook = tempDataFB.length;
                    GlobalData.fileUploadData.facebook = true;
                }
                if (tempDataDB.length > 0) {
                    data.image_set_source.image_set_list.dropbox = tempDataDB.length;
                    GlobalData.fileUploadData.dropbox = true;
                }
                if (tempDataFL.length > 0) {
                    data.image_set_source.image_set_list.flickr = tempDataFL.length;
                    GlobalData.fileUploadData.flickr = true;
                }
                if (tempDataGP.length > 0) {
                    data.image_set_source.image_set_list.google_photos = tempDataGP.length;
                    GlobalData.fileUploadData.google_photos = true;
                }
                if (tempDataAC.length > 0) {
                    data.image_set_source.image_set_list.amazon_prime = tempDataAC.length;
                    GlobalData.fileUploadData.amazon_photos = true;
                }
                var cloudFlag = 0;
                if (tempDataGP.length > 0 || tempDataFL.length > 0 || tempDataDB.length > 0 || tempDataFB.length > 0 || tempDataAC.length > 0) {
                    cloudFlag = 1;
                }

                if (cloudFlag && mclengthWithoutDuplicate > 0) {
                    //data.source_type = "customer_device_cloud_source";
                    GlobalData.fileUploadData.sourceType = "customer_device_cloud_source";
                }
                if (cloudFlag && mclengthWithoutDuplicate < 1) {
                    //data.source_type = "cloud_source_only";
                    GlobalData.fileUploadData.sourceType = "cloud_source_only";
                }
                if (cloudFlag == 0 && mclengthWithoutDuplicate > 0) {
                    //data.source_type = "customer_device_only";
                    GlobalData.fileUploadData.sourceType = "customer_device_only";
                }
            }
            return data;



        };

        this.transferImages = function (orderId, imageSetIdList) {
            var imageSetids = [];
            GlobalData.imageSetListId = {}; //TODO: unset this when control goes out of this function, better to use global variable in class
            var i = 0;
            $.each(imageSetIdList, function (index, value) {
                imageSetids.push(value);
                GlobalData.imageSetListId[i] = value;
                i++;
            });
            GlobalData.currentId = orderId; //TODO: unset this when control goes out of this function, better to use global variable in class
            orderIdForFinish = orderId;
            imageSetIdsForFinish = imageSetids.join();
            var fbDataArray = [];
            var flDataArray = [];
            var gpDataArray = [];
            var dbDataArray = [];
            var acDataArray = [];

            //Prepare data for cancellation when browser refreshed
            if (GlobalData.uploadType === 'singleUserSingleDeviceDesignMyStory') {
                //order cancellation
                GlobalData.fileUploadData.cancelUploadInputAPIData = {
                    'order_id': orderId
                };
            } else {
                //only image set cancellation
                GlobalData.fileUploadData.cancelUploadInputAPIData = {
                    'image_set_id': GlobalData.imageSetListId
                };
            }

            GlobalData.fileUploadData.orderData = {};
            GlobalData.fileUploadData.orderData.orderId = orderId;
            GlobalData.fileUploadData.orderData.storyTitle = GlobalData.fileUploadData.title;
            GlobalData.fileUploadData.customerDeviceData = ObjectHandling.copyObject(jQuery('#fileupload').fileupload('option').dataArray);
            //console.dir(GlobalData);
            jQuery('#files .fb').each(function () {
                fbDataArray.push(encodeURIComponent(jQuery(this).data("ourl")));
            });
            jQuery('#files .preview-img-flicker').each(function () {
                flDataArray.push(jQuery(this).data("orignalurl"));
            });
            jQuery('#files .preview-img-gp').each(function () {
                gpDataArray.push(jQuery(this).data("orignalurl"));
            });
            jQuery('#files .preview-img-db').each(function () {
                dbDataArray.push(jQuery(this).data("orignalurl"));
            });
            jQuery('#files .preview-img-ac').each(function () {
                acDataArray.push(jQuery(this).data("orignalurl"));
            });
            var socilaMediaData = {
                order_id: orderId,
                image_set_metadata: {}
            };
            var fbURL = '';
            var flickrURL = '';
            var googleURL = '';
            var dropboxURL = '';
            var acURL = '';

            if (fbDataArray.length > 0) {
                var fbImageSetId = imageSetIdList.facebook;
                socilaMediaData.image_set_metadata.facebook = {};
                socilaMediaData.image_set_metadata.facebook[fbImageSetId] = {};
                for (var i = 0; i < fbDataArray.length; i++) {
                    fbURL = decodeURIComponent(fbDataArray[i]);
                    socilaMediaData.image_set_metadata.facebook[fbImageSetId][i] = {};
                    socilaMediaData.image_set_metadata.facebook[fbImageSetId][i]['url'] = fbURL;
                }
            }

            if (flDataArray.length > 0) {
                var flImageSetId = imageSetIdList.flickr;
                socilaMediaData.image_set_metadata.flickr = {};
                socilaMediaData.image_set_metadata.flickr[flImageSetId] = {};
                for (var i1 = 0; i1 < flDataArray.length; i1++) {
                    flickrURL = decodeURIComponent(flDataArray[i1]);
                    socilaMediaData.image_set_metadata.flickr[flImageSetId][i1] = {};
                    socilaMediaData.image_set_metadata.flickr[flImageSetId][i1]['url'] = flickrURL;
                }
            }

            if (gpDataArray.length > 0) {
                var gpImageSetId = imageSetIdList.google_photos;
                socilaMediaData.image_set_metadata.google_photos = {};
                socilaMediaData.image_set_metadata.google_photos[gpImageSetId] = {};
                for (var i2 = 0; i2 < gpDataArray.length; i2++) {
                    googleURL = decodeURIComponent(gpDataArray[i2]);
                    socilaMediaData.image_set_metadata.google_photos[gpImageSetId][i2] = {};
                    socilaMediaData.image_set_metadata.google_photos[gpImageSetId][i2]['url'] = googleURL;
                }
            }

            if (dbDataArray.length > 0) {
                var dbImageSetId = imageSetIdList.dropbox;
                socilaMediaData.image_set_metadata.dropbox = {};
                socilaMediaData.image_set_metadata.dropbox[dbImageSetId] = {};
                for (var i3 = 0; i3 < dbDataArray.length; i3++) {
                    dropboxURL = decodeURIComponent(dbDataArray[i3]);
                    socilaMediaData.image_set_metadata.dropbox[dbImageSetId][i3] = {};
                    socilaMediaData.image_set_metadata.dropbox[dbImageSetId][i3]['url'] = dropboxURL;
                }

            }

            if (acDataArray.length > 0) {
                var amazonImageSetId = imageSetIdList.amazon_prime;
                socilaMediaData.image_set_metadata.amazon_prime = {};
                socilaMediaData.image_set_metadata.amazon_prime[amazonImageSetId] = {};
                for (var i4 = 0; i4 < acDataArray.length; i4++) {
                    acURL = acDataArray[i4];
                    socilaMediaData.image_set_metadata.amazon_prime[amazonImageSetId][i4] = {};
                    socilaMediaData.image_set_metadata.amazon_prime[amazonImageSetId][i4]['url'] = acURL;
                }
            }

            function uploadCloudSourcePhotos(data, callDone) {
                uploadSocialPhotos(GlobalData.htmlUploaderfbfldpUploadURL, data, CookieUtils.getCookie("sessionKey"),
                    function () {
                        callDone();
                    },
                    function () {
                        callDone();
                    });
            }

            if (GlobalData.fileUploadData.sourceType === 'cloud_source_only') {
                GlobalData.fileUploadData.onGoingUpload = 2;
                uploadCloudSourcePhotos(socilaMediaData, function () {
                    UploaderView.finishOrderCall();
                    if (GlobalData.uploadType === 'multiContributor') {

                    } else {
                        UploaderView.redirectToDashboard();
                    }

                });
            } else if (GlobalData.fileUploadData.sourceType === 'customer_device_only') {
                //console.log('customer_device_only');
                if (GlobalData.uploadType !== 'singleUserSingleDeviceDesignMyStory') {
                    if (GlobalData.uploadType === 'multiContributor') {
                        GlobalData.storyUpdate = "saveMore";
                    }
                    PubSub.publish("DASH_UPDATE_SAVING_TILE");
                }

                var dataArray = jQuery('#fileupload').fileupload('option').dataArray;
                if (Object.keys(dataArray).length > 0) {
                    for (var i4 = 0; i4 < Object.keys(dataArray).length; i4++) {
                        dataArray[i4].files[0].order_id = orderId;
                    }
                    var count = 0;
                    jQuery(".successMessageBox").css("visibility", "visible");
                    jQuery(".successMessageBox").html("<div id='progressCounter'></div><div id='progressEstTime'></div>");

                    while (Object.keys(dataArray).length > 0) {
                        count = count + 1;
                        GlobalData.fileUploadData.uploadingData = dataArray.shift();
                        GlobalData.fileUploadData.uploadingData.formData = {
                            order_id: orderId,
                            image_set_id: imageSetIdList.my_computer
                        };
                        GlobalData.fileUploadData.uploadingData.url = GlobalData.htmlUploaderFileUploadUrl;
                        GlobalData.fileUploadData.uploadingData.submit().success(function (data) {
                            if (data.int_status_code == 0) {
                                failedfileCount++;
                            }
                            if (data.int_status_code == 0 && data.arr_data.retry_transfer === -1) {
                                GlobalData.fileUploadData.retryTransfer = -1;
                            }
                        });
                    }
                    if (GlobalData.uploadType === 'multiContributor') {

                    } else {
                        UploaderView.redirectToDashboard();
                    }
                } else {
                    //console.log('something gone wrong');
                }
            } else if (GlobalData.fileUploadData.sourceType === 'customer_device_cloud_source') {
                if (GlobalData.uploadType !== 'singleUserSingleDeviceDesignMyStory') {
                    if (GlobalData.uploadType === 'multiContributor') {
                        GlobalData.storyUpdate = "saveMore";
                    }
                    PubSub.publish("DASH_UPDATE_SAVING_TILE");
                }
                uploadCloudSourcePhotos(socilaMediaData, function () {
                    var dataArray = jQuery('#fileupload').fileupload('option').dataArray;
                    if (dataArray.length > 0) {
                        for (var i = 0; i < dataArray.length; i++) {
                            dataArray[i].files[0].order_id = orderId;
                        }
                        var count = 0;
                        jQuery(".successMessageBox").css("visibility", "visible");
                        jQuery(".successMessageBox").html("<div id='progressCounter'></div><div id='progressEstTime'></div>");
                        while (dataArray.length > 0) {
                            count = count + 1;
                            var data = dataArray.shift();
                            data.formData = {
                                order_id: orderId,
                                image_set_id: imageSetIdList.my_computer
                            };
                            data.url = GlobalData.htmlUploaderFileUploadUrl;
                            data.submit().success(function (data) {
                                if (parseInt(data.int_status_code) === 0) {
                                    failedfileCount++;
                                }
                                if (parseInt(data.int_status_code) === 0 && data.arr_data.retry_transfer === -1) {
                                    //console.log('got -1');
                                    GlobalData.fileUploadData.retryTransfer = -1;
                                }
                            });
                        }
                    }
                    if (GlobalData.uploadType === 'multiContributor') {

                    } else {
                        UploaderView.redirectToDashboard();
                    }
                });
            }
        };
        this.showSaveAndDesignPopup = function () {
            //            jQuery('.saveAndDesignPopup').modal('show');
            if (!(jQuery(this).hasClass('disabled_btn'))) {
                jQuery('.pageload').show();

                if (totalCount <= 0) {
                    console.log('fileUploadCount: ' + totalCount);
                    GlobalData.fileUploadData.onGoingUpload = 0;
                }

                var requestData = {
                    order_id: GlobalData.multiDevice.orderId
                };
                var promiseOrderInfoForValidate = '';

                promiseOrderInfoForValidate = ContributionService.getOrderInformation(requestData);

                $.when(promiseOrderInfoForValidate)
                    .done(function (obj) {
                        //console.dir(obj);      
                        GlobalData.currentOrderInfo = {};
                        GlobalData.currentOrderInfo = obj.arr_data;
                        //console.dir(GlobalData.currentOrderInfo);

                        if (GlobalData.currentOrderInfo.design_request_type_name === 'SCMD') {
                            maxFileLimit = 1000;
                        } else {
                            maxFileLimit = 2000;
                        }

                        if (GlobalData.currentOrderInfo.total_transferred_count < maxFileLimit && GlobalData.currentOrderInfo.order_status == "50") {
                            console.log('case01');
                            jQuery('.pageload').hide();
                            jQuery('.saveStoryMsgPopup').modal('show');
                            jQuery('#savePhotosMsg').text(uploaderView.msgUtils.noNeedToWait);
                            var msgContent = ((jQuery(window).height()) - ((jQuery('.saveStoryMsgPopup .modal-dialog').height()) / 2)) / 2;
                            jQuery('.saveStoryMsgPopup .modal-dialog').css('margin-top', msgContent + 'px');

                        } else if (GlobalData.currentOrderInfo.order_status !== "50") {
                            jQuery('.pageload').hide();
                            var msg_text = GlobalData.currentOrderInfo.story_owner_name + ' has already sent the story ' + GlobalData.currentOrderInfo.cover_caption + ' for design, so no more photos will be uploaded';
                            jQuery('.alertImageCount').modal('show');
                            jQuery('#displayTextError').html(msg_text);
                        } else if (GlobalData.currentOrderInfo.total_transferred_count >= maxFileLimit) {

                            jQuery('.pageload').hide();
                            var msg_text = 'No more photos can be added to the story.';
                            jQuery('.alertImageCount').modal('show');
                            jQuery('#displayTextError').html(msg_text);
                        }

                    });
            }

        };

        this.saveStoryInputKeysup = function (e) {
            var titleVal = jQuery.trim(jQuery(this).val());
            if (titleVal.length === 0) {
                //if(jQuery.inArray(e.keyCode, keyCodes) !== -1){
                jQuery("#saveStory").addClass('saveStoryDisabled');
                /* } else {
                 jQuery("#saveStory").removeClass('saveStoryDisabled');
                 }*/
            } else {
                jQuery("#saveStory").removeClass('saveStoryDisabled');
            }
        };
        this.friendsTitleInputKeysup = function (e) {
            var titleVal = jQuery.trim(jQuery(this).val());
            if (titleVal.length === 0) {
                //var keyCodes = new Array(32,8,46,16,17,18,96,97,98,99,100,101,102,103,104,105,144,33,34,35,36,37,38,39,40,41,42,43,44,45);

                // if(jQuery.inArray(e.keyCode, keyCodes) !== -1){
                jQuery("#inviteFriendsNextBtn").addClass('saveStoryDisabled');
                /* } else {
                 jQuery("#inviteFriendsNextBtn").removeClass('saveStoryDisabled');
                 }*/
            } else {
                jQuery("#inviteFriendsNextBtn").removeClass('saveStoryDisabled');
            }
        };



        this.otherDevicePopup = function () {
            // if (jQuery('.otherDeviceBox').find('.active_other_device').length != 0) {
            jQuery('.active_other_device').addClass("selected_other_device").removeClass('active_other_device');
            uploaderView.showLoaderIcon();
            setTimeout(function () {
                uploaderView.countDuplicatesFromMyComputer();
            }, 500);
            // }
        };
        this.closeSaveStoryPopup = function () {
            jQuery('.selected_other_device').addClass("active_other_device").removeClass('selected_other_device');

        };

        this.enabledOtherDevice = function () {
            var totalCount = jQuery("#totalCountHidden").val();
            if (totalCount > 0 && totalCount <= 1000) {
                jQuery('.otherDeviceBox').removeClass('otherDeviceBoxDisabled');
                jQuery('.other_device').addClass("active_other_device").removeClass('other_device');
            } else {
                jQuery('.active_other_device').parent().addClass('otherDeviceBoxDisabled');
                jQuery('.active_other_device').addClass("other_device").removeClass('active_other_device');
            }
        };

        this.loadAmazonSDK = function () {
            document.getElementById('amazonLogin').onclick = function () {
                GlobalData.ec.recordClickEvent('Story_origin', 'AmazonButtonClicked');
                if (GlobalData.amazonAuth !== undefined) {
                    jQuery('.loadingPhotogurusBody').show();
                    AmazonView.getRoot();
                } else {
                    AmazonView.getPermissionToken();
                }
            };
        };

        this.facebookModalAlignment = function () {
            var topMargin = 0;
            topMargin = (jQuery(window).height() - 493) / 2;
            if (topMargin > 0) {
                jQuery('.facebookAlbumSelectionModal .modal-dialog').css('margin-top', topMargin + 'px');
            }
            jQuery('.facebookModalCheck #selectAlbumTitile,.facebookModalCheck #FBAlbums,.facebookModalCheck #import,.facebookModalCheck .selectAlbumTitile').show();
            jQuery(".facebookModalCheck #FBAlbumsPhotos,.facebookModalCheck #addfbphotos,.facebookModalCheck .selectAllFBContent").hide();
        };

        this.applyCustomeScrollToCollection = function () {
            jQuery.mCustomScrollbar.defaults.theme = "3d-thick";
            jQuery(".collection_box,.modal-body-right").mCustomScrollbar({
                callbacks: {
                    onScroll: function () {}
                }
            });
        };

        this.FBAlbumScreen = function () {
            jQuery('.facebookModalCheck .selectAllCheckIcon,.facebookModalCheck .selectAllAlbumPhots').show();
            jQuery('.facebookModalCheck #selectAlbumTitile,.facebookModalCheck #FBAlbums,.facebookModalCheck #import,.facebookModalCheck .selectAlbumTitile').show();
            jQuery(".facebookModalCheck #FBAlbumsPhotos,.facebookModalCheck #addfbphotos,.facebookModalCheck .selectAllFBContent,.facebookModalCheck .fbphotosSelectionCount,.facebookModalCheck #closeFBAlbumList").hide();
            jQuery(".facebookModalCheck #fbInnerTitle").text("Facebook Albums");
            jQuery(".facebookModalCheck .backFBModal").addClass('closeFBModal').removeClass('backFBModal');
            jQuery('.facebookModalCheck .fbphotosSelectionCount').text("0 photos selected");
            jQuery(".modal-body-right").mCustomScrollbar({
                setTop: 0
            });
        };

        this.closeFBModalWindow = function () {
            jQuery('.facebookModalCheck .fbphotosSelectionCount').text("0 photos selected");
            jQuery('.facebookModalCheck #selectAlbumTitile,.facebookModalCheck #FBAlbums,.facebookModalCheck #import,.facebookModalCheck .selectAlbumTitile').show();
            jQuery(".facebookModalCheck #FBAlbumsPhotos,.facebookModalCheck #addfbphotos,.facebookModalCheck .selectAllFBContent,.facebookModalCheck #closeFBAlbumList").hide();
            jQuery(".facebookModalCheck #fbInnerTitle").text("Facebook Albums");
            jQuery('#myModal').modal('hide');
        };

        this.redirectToDashboard = function () {
            //jQuery('.pageload').hide();

            jQuery('.home-icon').hide();
            facebookInitialisationFlag = 0;
            googleView.reset();
            flickrView.reset();
            AmazonView.reset();
            fbCounter = 0;
            delete GlobalData.multiDevice;
            delete GlobalData.orderInfo;
            delete GlobalData.currentOrderInfo;
            jQuery('.modal').modal('hide');
            jQuery('.loginHeader').fadeOut();
            location.hash = "/dashboard";
            if (GlobalData.uploadType !== 'singleUserSingleDeviceDesignMyStory') {
                PubSub.publish("DASH_UPDATE_SAVING_TILE");
            }
        };

    });

    return UploaderView;
});