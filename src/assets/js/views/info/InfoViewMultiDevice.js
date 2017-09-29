/*global define, jQuery, window*/

define(['Augment',
    'Instance',
    'PubSub',
    'GlobalData',
    'services/UserService',
    'services/ContributionService',
    'utils/CookieUtils',
    'utils/LanguageUtils',
    'views/messages/MessagesView',
    'hbs!views/info/templates/InfoViewMultiDevice'
], function (augment, instance, PubSub, GlobalData, UserService, ContributionService, CookieUtils, LanguageUtils, MessagesView, tplInfoViewMultiDevice) {

    'use strict';

    var InfoViewMultiDevice = augment(instance, function () {
        var infoViewMultiDevice = this;
        this.init = function () {
            jQuery(window).resize(function () {
                infoViewMultiDevice.modalHeight();
                infoViewMultiDevice.messageMiddle();
                infoViewMultiDevice.errorMiddle();

            });
        };
        var StoryFlag, stroytype;
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Septr', 'Oct', 'Nov', 'Dec'];
        this.addToDiv = function (myFlag, stroyType) {

            StoryFlag = myFlag;
            stroytype = stroyType;
            var divId = "infoScreenModal";
            var auToken = CookieUtils.getCookie("authToken");
            var innerHtml = tplInfoViewMultiDevice({
                id: infoViewMultiDevice.infoData.id,
                caption: infoViewMultiDevice.infoData.cover_caption,
                addMorePhotos: LanguageUtils.valueForKey("addMorePhotos"),
                designMyStory: LanguageUtils.valueForKey("designMyStory"),
                photoSelectedCountByOwner: infoViewMultiDevice.infoData.total_transferred_count,
                orderFailData: infoViewMultiDevice.infoData.order_expiration_date

            });
            jQuery('#' + divId).empty();
            jQuery('#' + divId).html(innerHtml);
            this.changeScreen();
        };

        this.changeScreen = function () {
            jQuery('body').addClass('page-loaded');
            jQuery('body > .pageload').fadeIn();
            //jQuery('#InfoModal').perfectScrollbar();
            jQuery('#InfoModal .modal-body').perfectScrollbar();
            jQuery('.leftArrowIcon').fadeOut();
            jQuery('.rightArrowIcon').fadeOut();
            infoViewMultiDevice.imageSetData();//get all image set data
            infoViewMultiDevice.modalHeight();
            jQuery('.delete-info').click(infoViewMultiDevice.deleteStory);
            jQuery('.triggerDesignStoryMCO').click(infoViewMultiDevice.designMyStory);
            jQuery('.triggerAddMorePhotos').click(infoViewMultiDevice.addMorePhotos);


        };

        this.focusContainer = function (e) {
            var senderElement = e.target.className;
            if (senderElement == 'multiInfoDelete') {
                var id = jQuery(this).data('id');
                var messagesView = MessagesView.create();
                messagesView.addToDiv();
                messagesView.messageMiddle();
                jQuery('.deleteImageSetModal').modal('show');
                jQuery('#deleteImageSetInfo').text(LanguageUtils.valueForKey("deleteImageSetMsg"));
                jQuery("#deleteMyImageSet").click(function () {
                    jQuery('.pageload').show();
                    jQuery(".deleteImageSetModal").modal('hide');
                    infoViewMultiDevice.imageSetId = {
                        image_set_id:
                                {
                                    "0": id

                                }
                    }
                    var promise = ContributionService.cancelImageSetData(JSON.stringify(infoViewMultiDevice.imageSetId));
                    promise.then(function (data) {
                        PubSub.publish('UPDATE_IMAGE_SET_INFO_PANEL_WITH_DASH');
                        jQuery('#InfoModal').modal('hide');
                    }).fail(function () {
                    });
                });
            }
        };

        this.addMorePhotos = function () {
            GlobalData.ec.recordClickEvent('Multicontributor_View', 'OwnerAddMorePhotosButtonClicked');
            if (!GlobalData.mobileDevice) {
                jQuery('body').addClass('page-loaded');
                jQuery('body > .pageload').fadeIn();
                GlobalData.fileUploadData = {};
                GlobalData.multiDevice = {};
                GlobalData.multiDevice.addMorePhotos = 1;
                GlobalData.multiDevice.orderId = infoViewMultiDevice.infoData.id;
                GlobalData.multiDevice.DesignRequestType = 1;
                GlobalData.multiDevice.title = infoViewMultiDevice.infoData.cover_caption;
                //GlobalData.multiDevice.previousCount = infoViewMultiDevice.infoData.total_transferred_count;
                //GlobalData.multiDevice.previousCount = infoViewMultiDevice.actualImageTransferCount;
                GlobalData.multiDevice.previousCount = 0;
                GlobalData.multiDevice.design_request_type_name = infoViewMultiDevice.infoData.design_request_type_name;
                GlobalData.multiDevice.belongsTo = infoViewMultiDevice.infoData.story_belongsto;
                GlobalData.multiDevice.storyOwnerName = infoViewMultiDevice.infoData.story_owner_name;
                GlobalData.multiDevice.copyLink = infoViewMultiDevice.infoData.image_contribution_invitation_link;

                var requestData = {
                    order_id: infoViewMultiDevice.infoData.id
                };
                var promiseOrderInfo = ContributionService.getOrderInformation(requestData);
                $.when(promiseOrderInfo)
                    .done(function (obj1) {
                        //console.dir(obj1);
                        if (obj1.arr_data !== null && obj1.int_status_code !== 0) {
                            GlobalData.multiDevice.previousCount = parseInt(obj1.arr_data.total_transferred_count);
                            //console.clear();
                            //console.dir(GlobalData.multiDevice);
                            var multiDevice = JSON.stringify(GlobalData.multiDevice);
                            CookieUtils.setCookie("multidevice", multiDevice, GlobalData.expireDays)
                            jQuery('#InfoModal').modal('hide');
                            if (obj1.arr_data.order_status === "50" && GlobalData.multiDevice.previousCount < 1000) {
                                location.hash = '/uploader';
                            } else {
                                if (GlobalData.multiDevice.previousCount >= 1000) {
                                    var messagesView = MessagesView.create();
                                    messagesView.addToDiv();
                                    jQuery('.alertLimitCrossed').modal('show');
                                    jQuery('#displayTextLimit').text('No more photos can be added to the story.');
                                    infoViewMultiDevice.messageMiddle();
                                    jQuery('.pageload').hide();
                                } else {
                                    PubSub.publish('UPDATE_DASHBOARD_NO_CONDITION');
                                }
                            }

                        }else{
                            console.log('API response is null');
                        }
                });
            }else if (GlobalData.mobileDevice) {
                var messagesView = MessagesView.create();
                messagesView.addToDiv();
                jQuery('#messageModal.mobileFeature').modal('show');
                messagesView.messageMiddle();
            }else{
                console.log('landed here');
            }
        };

        this.imageSetData = function () {
            if (infoViewMultiDevice.infoData.id !== undefined) {

                var requestData = {
                    order_id: infoViewMultiDevice.infoData.id,
                    customer_id: CookieUtils.getCookie("custId")
                };
                var promise = ContributionService.getContributedImageSetData(requestData);

                promise.then(function (data) {
                    jQuery('body').addClass('page-loaded').removeClass('page-loading');
                    jQuery('body > .pageload').fadeOut();
                    //populate data in info view screen
                    var imageSetList, infoText;
                    var imageSetData = data.arr_data;
                    jQuery('.image-set').empty();
                    infoViewMultiDevice.actualImageTransferCount = 0;
                    infoViewMultiDevice.storyCurrentStatus = "completed";

                    if (imageSetData !== null) {
                        for (var i = 0; i < imageSetData.length; i++) {
                            var deleteLink = (imageSetData[i].cancellable_by_user == 1) ? '<div class="multiInfoDelete">Delete</div>' : '';
                            infoViewMultiDevice.actualImageTransferCount += parseInt(imageSetData[i].transferred_image_count);
                            if (imageSetData[i].image_set_status_code === '1000' || imageSetData[i].image_set_status_code === '2000') {
                                infoViewMultiDevice.storyCurrentStatus = "transferring";
                            }
                            if (imageSetData[i].image_set_status === 'Completed') {
                                imageSetList = '<div class="image-set-src-details-container" data-id=' + imageSetData[i].order_imageset_id + '><div class="image-set-src-icon"><img src="assets/images/' + imageSetData[i].image_source_name + '-info.png"><span class="image-set-image-count">' + imageSetData[i].transferred_image_count + '</span></div><div class="image-set-src-name">' + imageSetData[i].image_source_name_display_text + '</div><div class="image-set-src-status">' + imageSetData[i].image_set_status + '</div><div class="image-set-src-count-status" style="display:none">' + imageSetData[i].transferred_image_count + ' of ' + imageSetData[i].selected_image_count + '</div>' + deleteLink + '</div></div>';
                            } else {
                                imageSetList = '<div class="image-set-src-details-container" data-id=' + imageSetData[i].order_imageset_id + '><div class="image-set-src-icon"><img src="assets/images/' + imageSetData[i].image_source_name + '-info.png"><span class="image-set-image-count">' + imageSetData[i].transferred_image_count + '</span></div><div class="image-set-src-name">' + imageSetData[i].image_source_name_display_text + '</div><div class="image-set-src-status">' + imageSetData[i].image_set_status + '</div><div class="image-set-src-count-status">' + imageSetData[i].transferred_image_count + ' of ' + imageSetData[i].selected_image_count + '</div>' + deleteLink + '</div></div>';
                            }
                            jQuery('.image-set').prepend(imageSetList);

                        }

                        if (infoViewMultiDevice.actualImageTransferCount === 0) {

                        } else if (infoViewMultiDevice.actualImageTransferCount === 1) {
                            jQuery("#imageSetCounterTextId").text(infoViewMultiDevice.actualImageTransferCount + " photos saved");
                        } else {
                            jQuery("#imageSetCounterTextId").text(infoViewMultiDevice.actualImageTransferCount + " photos saved");
                        }


//                        if (infoViewMultiDevice.actualImageTransferCount < 20) {
//                            jQuery(".btn-design-my-story").removeClass('triggerDesignStoryMCO').addClass('disabled').off("click", infoViewMultiDevice.designMyStory);
//
//                        } else {
//                            jQuery(".btn-design-my-story").removeClass('disabled').addClass('triggerDesignStoryMCO').on("click", infoViewMultiDevice.designMyStory);
//                        }
                    } else {
                        jQuery("#imageSetCounterTextId").text("No photos added");
                    }

                    infoText = infoViewMultiDevice.infoData.order_expiration_date;
//                infoText = 'unknown';
                    jQuery('#infoText').empty();
                    infoText = infoViewMultiDevice.convertDateWithTime(infoText);
                    jQuery('#infoText').prepend('* This story will be saved only till ' + infoText + ' and will be automatically deleted after that.');
                    infoViewMultiDevice.imageSetListScroll();
                    jQuery('.multideviceScreen .image-set-src-details-container').click(infoViewMultiDevice.focusContainer);
                    jQuery('.multideviceScreen .image-set-src-details-container').mouseover(function () {
                        jQuery(this).find('.multiInfoDelete').css({"display": "block", "color": "#0087f2"});
                    }).mouseout(function () {
                        if (jQuery(this).hasClass('image-set-src-details-container-focus')) {

                        } else {
                            jQuery(this).find('.multiInfoDelete').css({"display": "none"});
                        }
                    });
                }).fail(function () {
                });
            }
        };
        this.convertDateWithTime = function (date) {
            var from0 = date.split(" ");
            from0 = from0[0].split('-');
            var expMonth = parseInt(from0[1]);
            var newMonth = [];
            newMonth = months[expMonth - 1];
            var Neworderdate = newMonth + " " + from0[2] + ", " + from0[0];
            return Neworderdate;
        };

        this.imageSetListScroll = function () {
            jQuery('.leftArrowIcon').css('visibility', 'hidden');
            if (jQuery(".image-set-src-container").hasClass("ownImageSet")) {
                if (jQuery(".image-set-src-details-container").length > 3) {
                    infoViewMultiDevice.arrowShow();
                }
                else {
                    jQuery('.leftArrowIcon').fadeOut();
                    jQuery('.rightArrowIcon').fadeOut();
                }
            }
            else {
                if (jQuery(".image-set-src-details").length > 7) {
                    infoViewMultiDevice.arrowShow();
                }
                else {
                    jQuery('.leftArrowIcon').fadeOut();
                    jQuery('.rightArrowIcon').fadeOut();
                }
            }
        };
        this.arrowShow = function () {
            if (jQuery(window).width() < 767) {
                jQuery('.leftArrowIcon').fadeOut();
                jQuery('.rightArrowIcon').fadeOut();
            } else {
                jQuery('.leftArrowIcon').fadeIn();
                jQuery('.rightArrowIcon').fadeIn();
                jQuery('.rightArrowIcon').click(function () {

                    var rightArrow = jQuery('.rightArrowIcon').offset().left;
                    var LastShare = jQuery('.image-set').children().last().offset().left;
                    var leftDifference = LastShare - rightArrow;
                    if (leftDifference > -90) {
                        jQuery('.image-set').css({
                            marginLeft: "-=300px"
                        });
                        jQuery('.leftArrowIcon').css('visibility', 'visible');
                    } else {
                        jQuery('.rightArrowIcon').css('visibility', 'hidden');
                    }
                    var rightArrow = jQuery('.rightArrowIcon').offset().left;
                    var LastShare = jQuery('.image-set').children().last().offset().left;
                    var leftDifference = LastShare - rightArrow;

                    if ((leftDifference) < -100) {
                        jQuery('.rightArrowIcon').css('visibility', 'hidden');
                    }

                });
                jQuery('.leftArrowIcon').click(function () {
                    var leftArrow = jQuery('.leftArrowIcon').offset().left;
                    var firstShare = jQuery('.image-set').children().first().offset().left;
                    var leftDifference = leftArrow - firstShare;

                    if (leftDifference > 318) {
                        jQuery('.image-set').css({
                            marginLeft: "+=300px"
                        });
                        jQuery('.rightArrowIcon').css('visibility', 'visible');
                    }
                    else {
                        jQuery('.image-set').css({
                            marginLeft: '0px'
                        });
                        jQuery(' .rightArrowIcon').css('visibility', 'visible');
                        jQuery('.leftArrowIcon').css('visibility', 'hidden');
                    }
                });
            }
        };

        this.screenHeight = function () {

            if (jQuery(window).width() < 767) {
                jQuery('#InfoModal .modal-content').height(jQuery(window).height());
            }
            else {
                jQuery('#InfoModal .modal-content').css("height", "479px");
            }
        };

        this.modalHeight = function () {
            var deskDevice, bodyHeight, deskWidth, modalWidth, formHeight, coverHeight, bodyHeightScr1;
            if (jQuery(window).width() < 768) {
                var smallDevice = (window.innerHeight - 130);
                var smallDeviceWidth = jQuery(window).width();
                var contentWidth = smallDeviceWidth * 0.70;
                if ((jQuery(window).height() < jQuery(window).width())) {
                    contentWidth = smallDeviceWidth * 0.40;
                    //jQuery('.sc1-content').css('width', contentWidth + "px");
                }
                jQuery('#InfoModal > .modal-dialog > .modal-content').height(window.innerHeight);
                jQuery('#InfoModal > .modal-dialog > .modal-content .modal-body').css("max-height", smallDevice + 'px');
                jQuery('#InfoModal > .modal-dialog > .modal-content#baseInfo .modal-body').css("max-height", '100%');
                //jQuery('.sc1-content').css('width', contentWidth + "px");
            } else if ((jQuery(window).width() > 767) && (jQuery(window).height() < 950)) {
                if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/Android/i))) {

                    deskDevice = (jQuery(window).height()) * 0.7;
                    bodyHeight = deskDevice - 124;
                    bodyHeightScr1 = deskDevice;
                    deskWidth = deskDevice * 0.7;
                    modalWidth = deskWidth * 0.7;
                    formHeight = deskDevice - 160;
                    coverHeight = modalWidth;
                    jQuery('#InfoModal > .modal-dialog > .modal-content').css("height", deskDevice + "px");
                    jQuery('#InfoModal > .modal-dialog > .modal-content').css("width", deskWidth + "px");
                    jQuery('#baseInfo .modal-body').css({"max-height": bodyHeight + "px", 'padding-left': '0px', 'padding-right': '0px'});
                    jQuery('#InfoModal > .modal-dialog > .modal-content#baseInfo').css("height", bodyHeightScr1 + "px");
                    jQuery('#InfoModal > .modal-dialog > .modal-content#baseInfo .modal-body').css("max-height", bodyHeightScr1 + "px");
                    jQuery('#infoDialog').css('width', deskWidth + "px");
                    jQuery('#shareCover').css('height', modalWidth - 60 + "px");


                } else {
                    deskDevice = 568;
                    bodyHeight = deskDevice - 50;
                    bodyHeightScr1 = 482;
                    deskWidth = deskDevice * 0.7;
                    modalWidth = deskWidth * 0.7;
                    coverHeight = modalWidth;
                    jQuery('#InfoModal > .modal-dialog > .modal-content').css("height", deskDevice + "px");
                    jQuery('#InfoModal > .modal-dialog > .modal-content').css("width", 415 + "px");
                    jQuery('#InfoModal > .modal-dialog > .modal-content .modal-body').css("max-height", bodyHeight + "px");
                    jQuery('#baseInfo .modal-body').css({"max-height": bodyHeight + "px", 'padding-left': '0px', 'padding-right': '0px'});
                    jQuery('#InfoModal > .modal-dialog > .modal-content#baseInfo').css("height", 550 + "px");
                    jQuery('#InfoModal > .modal-dialog > .modal-content#baseInfo .modal-body').css("max-height", bodyHeight + "px");
                    jQuery('#infoDialog').css('width', 415 + "px");
                    jQuery('#shareCover').css('height', coverHeight + "px");
                }

            } else {
//                deskDevice = (jQuery(window).height()) * 0.6;
                if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/Android/i))) {

                    deskDevice = (jQuery(window).height()) * 0.6;
                    bodyHeight = deskDevice - 124;
                    bodyHeightScr1 = deskDevice;
                    deskWidth = deskDevice * 0.7;
                    modalWidth = deskWidth * 0.7;
                    formHeight = deskDevice - 160;
                    coverHeight = modalWidth;
                    jQuery('#InfoModal > .modal-dialog > .modal-content').css("height", deskDevice + "px");
                    jQuery('#InfoModal > .modal-dialog > .modal-content').css("width", deskWidth + "px");
                    jQuery('#baseInfo .modal-body').css({"max-height": bodyHeight + "px", 'padding-left': '0px', 'padding-right': '0px'});
                    jQuery('#InfoModal > .modal-dialog > .modal-content#baseInfo').css("height", 560 + "px");
                    jQuery('#InfoModal > .modal-dialog > .modal-content#baseInfo .modal-body').css("max-height", bodyHeightScr1 + "px");
                    jQuery('#infoDialog').css('width', deskWidth + "px");
                    //jQuery('.sc1-content').css('width', modalWidth - 60 + "px");
                    jQuery('#shareCover').css('height', modalWidth - 60 + "px");


                } else {
                    deskDevice = 568;
                    bodyHeight = deskDevice - 50;
                    bodyHeightScr1 = 482;
                    deskWidth = deskDevice * 0.7;
                    modalWidth = deskWidth * 0.7;
                    coverHeight = modalWidth;
                    jQuery('#InfoModal > .modal-dialog > .modal-content').css("height", deskDevice + "px");
                    jQuery('#InfoModal > .modal-dialog > .modal-content').css("width", deskWidth + "px");
                    jQuery('#InfoModal > .modal-dialog > .modal-content .modal-body').css("max-height", bodyHeight + "px");
                    jQuery('#baseInfo .modal-body').css({"max-height": bodyHeight + "px", 'padding-left': '0px', 'padding-right': '0px'});
                    jQuery('#InfoModal > .modal-dialog > .modal-content#baseInfo').css("height", 560 + "px");
                    jQuery('#InfoModal > .modal-dialog > .modal-content#baseInfo .modal-body').css("max-height", bodyHeight + "px");
                    jQuery('#infoDialog').css('width', deskWidth + "px");
                    jQuery('#shareCover').css('height', coverHeight + "px");
                }
            }
        };

        this.deleteStory = function () {
            var del = this;
            var custID = CookieUtils.getCookie("custId");
            var messagesView = MessagesView.create();
            messagesView.addToDiv();
            jQuery('#messageModal').modal('show');
            infoViewMultiDevice.messageMiddle();
            jQuery('#messageModal .modal-header h4').text("Delete story?").fadeIn();
            jQuery('#messageModal #back_text').text("Story cannot be restored after deletion.").fadeIn();
            jQuery('#messageModal #download_text').hide();
            jQuery('#messageModal #confirm_download').hide();
            jQuery('#cancel_btn').text("Delete").fadeIn();
            jQuery('#ok_back').text("Cancel").fadeIn();

            jQuery('#cancel_btn').click(function () {
                var requestData = {};
                var promise;
                jQuery(".modal").fadeOut();

                requestData = {
                    order_id: infoViewMultiDevice.infoData.id
                };
                promise = UserService.deletePhotostory(requestData);
                promise.then(function (data) {
                    PubSub.publish('DASHBOARD_STORIES');
                }).fail(function () {

                });
            });
        };

        this.designMyStory = function () {
            jQuery("#InfoModal").modal('hide');
            GlobalData.multiDevice = {};
            GlobalData.multiDevice.orderId = this.id;
            PubSub.publish('CHECK_IMAGE_STATUS');
        };

        this.messageMiddle = function () {
            var msgContent = ((jQuery(window).height()) - (181)) / 2;
            jQuery('#messageModal .modal-dialog').css('margin-top', msgContent + 'px');
        };
        this.errorMiddle = function () {
            var msgContent = ((jQuery(window).height()) - (181)) / 2;
            jQuery('#messageModal.errorMessageModal .modal-dialog').css('margin-top', msgContent + 'px');
        };
    });

    return InfoViewMultiDevice;
});