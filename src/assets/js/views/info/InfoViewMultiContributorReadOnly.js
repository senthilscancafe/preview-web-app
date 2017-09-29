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
    'hbs!views/info/templates/InfoViewMultiContributorReadOnly'
], function (augment, instance, PubSub, GlobalData, UserService, ContributionService, CookieUtils, LanguageUtils, MessagesView, tplInfoViewMultiContributorReadOnly) {

    'use strict';

    var InfoViewMultiContributorReadOnly = augment(instance, function () {
        var infoViewMultiContributorReadOnly = this;
        this.init = function () {
            jQuery(window).resize(function () {
                infoViewMultiContributorReadOnly.modalHeight();
                infoViewMultiContributorReadOnly.messageMiddle();
                infoViewMultiContributorReadOnly.errorMiddle();
            });
        };
        var StoryFlag, stroytype;
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Septr', 'Oct', 'Nov', 'Dec'];
        this.addToDiv = function (myFlag, stroyType) {
            StoryFlag = myFlag;
            stroytype = stroyType;
            var divId = "infoScreenModal";
            var auToken = CookieUtils.getCookie("authToken");
            var innerHtml = tplInfoViewMultiContributorReadOnly({
                id: infoViewMultiContributorReadOnly.infoData.id,
                caption: infoViewMultiContributorReadOnly.infoData.cover_caption,
                addMorePhotos: LanguageUtils.valueForKey("addMorePhotos"),
                photoSelectedCountByOwner: infoViewMultiContributorReadOnly.infoData.total_transferred_count,
                orderFailData: infoViewMultiContributorReadOnly.infoData.order_expiration_date,
                copylinkURL: infoViewMultiContributorReadOnly.infoData.image_contribution_invitation_link

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
            infoViewMultiContributorReadOnly.imageSetData(); //get all image set data
            infoViewMultiContributorReadOnly.modalHeight();
            jQuery('.delete-info').click(infoViewMultiContributorReadOnly.deleteStory);
            jQuery('.triggerAddMorePhotos').click(infoViewMultiContributorReadOnly.addMorePhotos);
            jQuery('.multiContributorOwner .multiInfoDeleteOwnerOfContributor').click(infoViewMultiContributorReadOnly.deleteImageSet);

        };

        this.focusContainer = function (e) {
            var senderElement = e.target.className;
            // console.log('Event Source con:  ' + senderElement);
            if (senderElement == 'multiInfoDeleteOwnerOfContributor') {
                var id = jQuery(this).data('id');
                var messagesView = MessagesView.create();
                messagesView.addToDiv();
                messagesView.messageMiddle();
                jQuery('.deleteImageSetModal').modal('show');
                jQuery('#deleteImageSetInfo').text(LanguageUtils.valueForKey("deleteImageSetMsg"));
                //console.log('OrderID: '+ infoViewMultiContributorReadOnly.infoData.id);
                jQuery("#deleteMyImageSet").click(function () {
                    var requestData = {
                        order_id: infoViewMultiContributorReadOnly.infoData.id
                    };
                    var promiseOrderStatusForDelete = ContributionService.getOrderInformation(requestData);
                    //promiseOrderStatusForDelete.then(function(data) {
                    $.when(promiseOrderStatusForDelete)
                        .done(function (obj) {
                            //console.dir(obj);
                            if (obj.arr_data.order_status == 50) {
                                jQuery('.pageload').show();
                                jQuery(".deleteImageSetModal").modal('hide');
                                infoViewMultiContributorReadOnly.imageSetId = {
                                    image_set_id: {
                                        "0": id

                                    }
                                }
                                var promise = ContributionService.cancelImageSetData(JSON.stringify(infoViewMultiContributorReadOnly.imageSetId));
                                promise.then(function (data) {
                                    PubSub.publish('UPDATE_IMAGE_SET_INFO_PANEL_WITH_DASH');
                                    jQuery('#InfoModal').modal('hide');
                                }).fail(function () {});
                            } else {
                                jQuery('.alertDialog').modal('show');
                                var msg_text = obj.arr_data.story_owner_name + ' has already sent the story ' + obj.arr_data.cover_caption + ' for design';
                                jQuery('#displayText').html(msg_text);

                                jQuery(".closeCustomModal").click(function (event) {
                                    event.stopPropagation();
                                    jQuery('.alertDialog').modal('hide');
                                    window.onbeforeunload = null;
                                    window.onunload = null;
                                    document.location.reload();
                                });
                            }

                        });
                });
            }
        };

        this.addMorePhotos = function () {
            GlobalData.ec.recordClickEvent('Multicontributor_View', 'ContributorAddMorePhotosButtonClicked');
            //if (!(jQuery(this).hasClass('disabledAddPhotosInfoTopBox'))) {
            if (!(jQuery(this).hasClass('disabledAddPhotosInfoTopBox')) && !GlobalData.mobileDevice) {
                jQuery('body').addClass('page-loaded');
                jQuery('body > .pageload').fadeIn();
                GlobalData.fileUploadData = {};
                GlobalData.multiDevice = {};
                GlobalData.multiDevice.addMorePhotos = 1;
                GlobalData.multiDevice.orderId = infoViewMultiContributorReadOnly.infoData.id;
                GlobalData.multiDevice.DesignRequestType = 1;
                GlobalData.multiDevice.title = infoViewMultiContributorReadOnly.infoData.cover_caption;
                //GlobalData.multiDevice.previousCount = infoViewMultiContributorReadOnly.infoData.total_transferred_count;
                GlobalData.multiDevice.previousCount = 0;
                GlobalData.multiDevice.belongsTo = infoViewMultiContributorReadOnly.infoData.story_belongsto;
                GlobalData.multiDevice.storyOwnerName = infoViewMultiContributorReadOnly.infoData.story_owner_name;
                GlobalData.multiDevice.design_request_type_name = infoViewMultiContributorReadOnly.infoData.design_request_type_name;
                GlobalData.multiDevice.copyLink = infoViewMultiContributorReadOnly.infoData.image_contribution_invitation_link;

                var requestData = {
                    order_id: infoViewMultiContributorReadOnly.infoData.id
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
                            if (obj1.arr_data.order_status === "50" && GlobalData.multiDevice.previousCount < 2000) {
                                location.hash = '/uploader';
                            } else {
                                if (GlobalData.multiDevice.previousCount >= 2000) {
                                    var messagesView = MessagesView.create();
                                    messagesView.addToDiv();
                                    jQuery('.alertLimitCrossed').modal('show');
                                    jQuery('#displayTextLimit').text('No more photos can be added to the story.');
                                    infoViewMultiContributorReadOnly.messageMiddle();
                                    jQuery('.pageload').hide();
                                } else {
                                    PubSub.publish('UPDATE_DASHBOARD_NO_CONDITION');
                                }
                            }

                        } else {
                            console.log('API response is null');
                        }
                    });
            } else if (GlobalData.mobileDevice) {
                var messagesView = MessagesView.create();
                messagesView.addToDiv();
                jQuery('#messageModal.mobileFeature').modal('show');
                messagesView.messageMiddle();
            } else {
                console.log('landed here');
            }
        };

        this.imageSetData = function () {
            var requestData = {
                order_id: infoViewMultiContributorReadOnly.infoData.id,
                customer_id: CookieUtils.getCookie("custId")
            };
            var promise = ContributionService.getContributedImageSetData(requestData);

            promise.then(function (data) {
                //console.dir(data);
                jQuery('body').addClass('page-loaded').removeClass('page-loading');
                jQuery('body > .pageload').fadeOut();
                //populate data in info view screen
                var imageSetList, infoText;
                var imageSetData = data.arr_data;
                infoViewMultiContributorReadOnly.actualImageTransferCount = 0;
                jQuery('.image-set').empty();
                infoViewMultiContributorReadOnly.storyCurrentStatus = "completed";
                var totalCountForOwner = 0;
                var totalCountForContributor = 0;
                if (imageSetData !== null) {
                    for (var i = 0; i < imageSetData.length; i++) {
                        infoViewMultiContributorReadOnly.actualImageTransferCount += parseInt(imageSetData[i].transferred_image_count);
                        if (imageSetData[i].image_set_status_code === '1000' || imageSetData[i].image_set_status_code === '2000') {
                            infoViewMultiContributorReadOnly.storyCurrentStatus = "transferring";
                        }
                        if (imageSetData[i].contributor_customer_id !== infoViewMultiContributorReadOnly.infoData.account_id) {
                            var deleteLink = (imageSetData[i].cancellable_by_user == 1) ? '<div class="multiInfoDeleteOwnerOfContributor">Delete</div>' : '';

                            var profilePic = imageSetData[i].contributor_profile_image_url;
                            if (profilePic === null) {
                                profilePic = 'assets/images/shareimage.png';
                            }
                            if (imageSetData[i].image_set_status === 'Completed') {
                                imageSetList = '<div class="imagSetContributorBox" data-id=' + imageSetData[i].order_imageset_id + '><div class="contributorNameText">' + imageSetData[i].contributor_first_name + '</div><div class="image-set-src-icon-friend"><img src="' + profilePic + '"><span class="image-set-image-count-special">' + imageSetData[i].transferred_image_count + '</span></div><div class="image-set-src-name">' + imageSetData[i].image_source_name_display_text + '</div><div class="image-set-src-status">' + imageSetData[i].image_set_status + '</div><div class="image-set-src-count-status" style="display:none">' + imageSetData[i].transferred_image_count + ' of ' + imageSetData[i].selected_image_count + '</div>' + deleteLink + '</div></div></div>';
                            } else {
                                imageSetList = '<div class="imagSetContributorBox" data-id=' + imageSetData[i].order_imageset_id + '><div class="contributorNameText">' + imageSetData[i].contributor_first_name + '</div><div class="image-set-src-icon-friend"><img src="' + profilePic + '"><span class="image-set-image-count-special">' + imageSetData[i].transferred_image_count + '</span></div><div class="image-set-src-name">' + imageSetData[i].image_source_name_display_text + '</div><div class="image-set-src-status">' + imageSetData[i].image_set_status + '</div><div class="image-set-src-count-status">' + imageSetData[i].transferred_image_count + ' of ' + imageSetData[i].selected_image_count + '</div>' + deleteLink + '</div></div></div>';
                            }
                            totalCountForContributor = totalCountForContributor + parseInt(imageSetData[i].transferred_image_count);

                            jQuery('.image-set-Friends').prepend(imageSetList);

                        } else {
                            var deleteLink = (imageSetData[i].cancellable_by_user == 1) ? '<div class="multiInfoDeleteOwnerOfContributor">Delete</div>' : '';
                            if (imageSetData[i].image_set_status === 'Completed') {
                                imageSetList = '<div class="image-set-src-details-container" data-id=' + imageSetData[i].order_imageset_id + '><div class="image-set-src-icon"><img src="assets/images/' + imageSetData[i].image_source_name + '-info.png"><span class="image-set-image-count">' + imageSetData[i].transferred_image_count + '</span></div><div class="image-set-src-name">' + imageSetData[i].image_source_name_display_text + '</div><div class="image-set-src-status">' + imageSetData[i].image_set_status + '</div><div class="image-set-src-count-status" style="display:none">' + imageSetData[i].transferred_image_count + ' of ' + imageSetData[i].selected_image_count + '</div>' + deleteLink + '</div></div>';
                            } else {
                                imageSetList = '<div class="image-set-src-details-container" data-id=' + imageSetData[i].order_imageset_id + '><div class="image-set-src-icon"><img src="assets/images/' + imageSetData[i].image_source_name + '-info.png"><span class="image-set-image-count">' + imageSetData[i].transferred_image_count + '</span></div><div class="image-set-src-name">' + imageSetData[i].image_source_name_display_text + '</div><div class="image-set-src-status">' + imageSetData[i].image_set_status + '</div><div class="image-set-src-count-status">' + imageSetData[i].transferred_image_count + ' of ' + imageSetData[i].selected_image_count + '</div>' + deleteLink + '</div></div></div>';
                            }
                            totalCountForOwner = totalCountForOwner + parseInt(imageSetData[i].transferred_image_count);

                            jQuery('.image-set').prepend(imageSetList);
                        }


                    }

                    if (totalCountForContributor === 0) {
                        jQuery("#imageSetCounterTextIdOwner").text("No photos added by friends");
                        jQuery("#contributuorImageSetCounterTextId").text("No photos added by friends");
                    } else if (totalCountForContributor > 0 && totalCountForContributor < 2) {
                        jQuery("#contributuorImageSetCounterTextId").text(totalCountForContributor + " photo added by friends");
                    } else {
                        jQuery("#contributuorImageSetCounterTextId").text(totalCountForContributor + " photos added by friends");
                    }

                    if (totalCountForOwner === 0) {
                        jQuery("#ownerImageSetCounterTextId").text("No photos added by you");
                    } else if (totalCountForOwner > 0 && totalCountForOwner < 2) {
                        jQuery("#ownerImageSetCounterTextId").text(totalCountForOwner + " photo added by you");
                    } else {
                        jQuery("#ownerImageSetCounterTextId").text(totalCountForOwner + " photos added by you");
                    }
                    //Commented as per requirement doc given by Priya
                    /*if ((totalCountForContributor + totalCountForOwner) >= 2000) {
                        jQuery('.multiContributorOnly .innerTop').addClass('disabledAddPhotosInfoTopBox')
                        jQuery('.multiContributorOnly .triggerAddMorePhotos').addClass('disabledAddPhotosInfoTopBox');
                    } else {
                        jQuery('.multiContributorOnly .innerTop').removeClass('disabledAddPhotosInfoTopBox');
                        jQuery('.multiContributorOnly .triggerAddMorePhotos').removeClass('disabledAddPhotosInfoTopBox');
                    }*/

                } else {
                    jQuery("#ownerImageSetCounterTextId").text("No photos added by you");
                    jQuery("#contributuorImageSetCounterTextId").text("No photos added by friends");
                }

                infoText = infoViewMultiContributorReadOnly.infoData.order_expiration_date;
                //                infoText = 'unknown';
                jQuery('#infoText').empty();
                //console.log(infoText);
                infoText = infoViewMultiContributorReadOnly.convertDateWithTime(infoText);
                //console.log(infoText);
                jQuery('#infoText').prepend('* This story will be saved only till ' + infoText + ' and will be automatically deleted after that.');
                infoViewMultiContributorReadOnly.imageSetListScroll();
                jQuery('.multiContributorOnly .image-set-src-details-container').click(infoViewMultiContributorReadOnly.focusContainer);


                jQuery('.multiContributorContributorSets .image-set-src-details-container').on("mouseover", function () {
                    jQuery('.image-set-src-details-container .multiInfoDeleteOwnerOfContributor').css('display', 'none');
                    jQuery(this).children('.multiInfoDeleteOwnerOfContributor:first').css({
                        'display': 'block',
                        color: '#0087f2'
                    });
                    jQuery('image-set-src-details-container-focus .multiInfoDeleteOwnerOfContributor:first').css('display', 'block');
                }).on("mouseout", function () {
                    jQuery('.image-set-src-details-container .multiInfoDeleteOwnerOfContributor').css('display', 'none');
                    //                    jQuery(this).children('.multiInfoDeleteOwnerOfContributor:first').css('display', 'none');
                    jQuery('.image-set-src-details-container-focus .multiInfoDeleteOwnerOfContributor:first').css('display', 'block');
                });

            }).fail(function () {});
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
            var divName = '';
            jQuery(divName + '.leftArrowIcon').css('visibility', 'hidden');

            //for owner list
            if (jQuery(".image-set-src-container").hasClass("ownImageSet")) {
                divName = '.div-owner ';
                if (jQuery(".image-set-src-details-container").length > 3) {
                    infoViewMultiContributorReadOnly.arrowShow(divName);
                } else {
                    jQuery(divName + '.leftArrowIcon').fadeOut();
                    jQuery(divName + '.rightArrowIcon').fadeOut();
                }
            } else {
                divName = '.div-owner ';
                if (jQuery(".image-set-src-details").length > 7) {
                    infoViewMultiContributorReadOnly.arrowShow(divName);
                } else {
                    jQuery(divName + '.leftArrowIcon').fadeOut();
                    jQuery(divName + '.rightArrowIcon').fadeOut();
                }
            }

            //for friends list

            if (jQuery(".image-set-src-container").hasClass("ownImageSet")) {
                divName = '.div-contributor ';
                if (jQuery(".imagSetContributorBox").length > 2) {
                    infoViewMultiContributorReadOnly.arrowShow(divName);
                } else {
                    jQuery(divName + '.leftArrowIcon').fadeOut();
                    jQuery(divName + '.rightArrowIcon').fadeOut();
                }
            } else {
                if (jQuery(".image-set-src-details").length > 7) {
                    divName = '.div-contributor ';
                    infoViewMultiContributorReadOnly.arrowShow(divName);
                } else {
                    jQuery(divName + '.leftArrowIcon').fadeOut();
                    jQuery(divName + '.rightArrowIcon').fadeOut();
                }
            }
        };
        this.arrowShow = function (divName) {
            var imgDivName = '.image-set';
            if (divName === undefined) {
                divName = '';
            } else if (divName === '.div-contributor ') {
                imgDivName = '.image-set-Friends';
            }
            if (jQuery(window).width() < 767) {
                jQuery(divName + '.leftArrowIcon').fadeOut();
                jQuery(divName + '.rightArrowIcon').fadeOut();
            } else {
                jQuery(divName + '.leftArrowIcon').fadeIn();
                jQuery(divName + '.rightArrowIcon').fadeIn();
                jQuery(divName + '.rightArrowIcon').click(function () {

                    var rightArrow = jQuery(divName + '.rightArrowIcon').offset().left;
                    var LastShare = jQuery(imgDivName).children().last().offset().left;
                    var leftDifference = LastShare - rightArrow;
                    if (leftDifference > -90) {
                        jQuery(imgDivName).css({
                            marginLeft: "-=276px"
                        });
                        jQuery(divName + '.leftArrowIcon').css('visibility', 'visible');
                    } else {
                        jQuery(divName + '.rightArrowIcon').css('visibility', 'hidden');
                    }
                    var rightArrow = jQuery(divName + '.rightArrowIcon').offset().left;
                    var LastShare = jQuery(imgDivName).children().last().offset().left;
                    var leftDifference = LastShare - rightArrow;

                    if ((leftDifference) < -93) {
                        jQuery(divName + '.rightArrowIcon').css('visibility', 'hidden');
                    }

                });
                jQuery(divName + '.leftArrowIcon').click(function () {
                    var leftArrow = jQuery(divName + '.leftArrowIcon').offset().left;
                    var firstShare = jQuery(imgDivName).children().first().offset().left;
                    var leftDifference = leftArrow - firstShare;
                    if (leftDifference > 276) {
                        jQuery(imgDivName).css({
                            marginLeft: "+=276px"
                        });
                        jQuery(divName + '.rightArrowIcon').css('visibility', 'visible');
                    } else {
                        jQuery(imgDivName).css({
                            marginLeft: '0px'
                        });
                        jQuery(divName + ' .rightArrowIcon').css('visibility', 'visible');
                        jQuery(divName + ' .leftArrowIcon').css('visibility', 'hidden');
                    }
                });
            }
        };

        this.screenHeight = function () {
            if (jQuery(window).width() < 767) {
                jQuery('#InfoModal .modal-content').height(jQuery(window).height());
            } else {
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
                    jQuery('#baseInfo .modal-body').css({
                        "max-height": bodyHeight + "px",
                        'padding-left': '0px',
                        'padding-right': '0px'
                    });
                    jQuery('#InfoModal > .modal-dialog > .modal-content#baseInfo').css("height", bodyHeightScr1 + "px");
                    jQuery('#InfoModal > .modal-dialog > .modal-content#baseInfo .modal-body').css("max-height", bodyHeightScr1 + "px");
                    jQuery('#infoDialog').css('width', deskWidth + "px");
                    jQuery('#shareCover').css('height', modalWidth - 60 + "px");


                } else {
                    deskDevice = 600;
                    bodyHeight = deskDevice - 50;
                    bodyHeightScr1 = 482;
                    deskWidth = deskDevice * 0.7;
                    modalWidth = deskWidth * 0.7;
                    coverHeight = modalWidth;
                    jQuery('#InfoModal > .modal-dialog > .modal-content').css("height", deskDevice + "px");
                    jQuery('#InfoModal > .modal-dialog > .modal-content').css("width", 380 + "px");
                    jQuery('#InfoModal > .modal-dialog > .modal-content .modal-body').css("max-height", bodyHeight + "px");
                    jQuery('#baseInfo .modal-body').css({
                        "max-height": bodyHeight + "px",
                        'padding-left': '0px',
                        'padding-right': '0px'
                    });
                    jQuery('#InfoModal > .modal-dialog > .modal-content#baseInfo').css("height", 525 + "px");
                    jQuery('#InfoModal > .modal-dialog > .modal-content#baseInfo .modal-body').css("max-height", bodyHeight + "px");
                    jQuery('#infoDialog').css('width', 380 + "px");
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
                    jQuery('#baseInfo .modal-body').css({
                        "max-height": bodyHeight + "px",
                        'padding-left': '0px',
                        'padding-right': '0px'
                    });
                    jQuery('#InfoModal > .modal-dialog > .modal-content#baseInfo').css("height", 560 + "px");
                    jQuery('#InfoModal > .modal-dialog > .modal-content#baseInfo .modal-body').css("max-height", bodyHeightScr1 + "px");
                    jQuery('#infoDialog').css('width', deskWidth + "px");
                    //jQuery('.sc1-content').css('width', modalWidth - 60 + "px");
                    jQuery('#shareCover').css('height', modalWidth - 60 + "px");


                } else {
                    deskDevice = 600;
                    bodyHeight = deskDevice - 50;
                    bodyHeightScr1 = 482;
                    deskWidth = deskDevice * 0.7;
                    modalWidth = deskWidth * 0.7;
                    coverHeight = modalWidth;
                    jQuery('#InfoModal > .modal-dialog > .modal-content').css("height", deskDevice + "px");
                    jQuery('#InfoModal > .modal-dialog > .modal-content').css("width", deskWidth + "px");
                    jQuery('#InfoModal > .modal-dialog > .modal-content .modal-body').css("max-height", bodyHeight + "px");
                    jQuery('#baseInfo .modal-body').css({
                        "max-height": bodyHeight + "px",
                        'padding-left': '0px',
                        'padding-right': '0px'
                    });
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
            infoViewMultiContributorReadOnly.messageMiddle();
            jQuery('#messageModal .modal-header h4').text('Remove Story?');
            jQuery('#messageModal #back_text').text("This will remove the story from your gallery. You can click on the invite link again to get it back.").fadeIn();
            jQuery('#messageModal #download_text').hide();
            jQuery('#messageModal #confirm_download').hide();
            jQuery('#cancel_btn').text("Yes").fadeIn();
            jQuery('#ok_back').text("No").fadeIn();
            jQuery('#cancel_btn').click(function () {
                var requestData = {};
                var promise;
                jQuery(".modal").fadeOut();

                //console.dir(infoViewMultiContributorReadOnly.infoData.contributor_customer_id);
                requestData = {
                    order_id: infoViewMultiContributorReadOnly.infoData.id,
                    customer_id: custID
                };
                promise = UserService.deletePhotostoryByContributor(requestData);
                promise.then(function (data) {
                    //console.dir(data);
                    PubSub.publish('DASHBOARD_STORIES');
                }).fail(function () {

                });
            });
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

    return InfoViewMultiContributorReadOnly;
});