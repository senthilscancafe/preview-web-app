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
    'hbs!views/info/templates/InfoViewMultiContributor'
], function (augment, instance, PubSub, GlobalData, UserService, ContributionService, CookieUtils, LanguageUtils, MessagesView, tplInfoViewMultiContributor) {

    'use strict';

    var InfoViewMultiContributor = augment(instance, function () {
        var infoViewMultiContributor = this;
        this.init = function () {
            jQuery(window).resize(function () {
                infoViewMultiContributor.modalHeight();
                infoViewMultiContributor.messageMiddle();
                infoViewMultiContributor.errorMiddle();
            });
        };
        var StoryFlag, stroytype;
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Septr', 'Oct', 'Nov', 'Dec'];
        this.addToDiv = function (myFlag, stroyType) {
            StoryFlag = myFlag;
            stroytype = stroyType;
            var divId = "infoScreenModal";
            var auToken = CookieUtils.getCookie("authToken");
            var innerHtml = tplInfoViewMultiContributor({
                id: infoViewMultiContributor.infoData.id,
                caption: infoViewMultiContributor.infoData.cover_caption,
                addMorePhotos: LanguageUtils.valueForKey("addMorePhotos"),
                designMyStory: LanguageUtils.valueForKey("designMyStory"),
                photoSelectedCountByOwner: infoViewMultiContributor.infoData.total_transferred_count,
                orderFailData: infoViewMultiContributor.infoData.order_expiration_date,
                copylinkURL: infoViewMultiContributor.infoData.image_contribution_invitation_link
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
            infoViewMultiContributor.imageSetData();//get all image set data
            infoViewMultiContributor.modalHeight();
            jQuery('.delete-info').click(infoViewMultiContributor.deleteStory);
            jQuery('.triggerDesignStoryMCO').click(infoViewMultiContributor.designMyStory);
            jQuery('.triggerAddMorePhotos').click(infoViewMultiContributor.addMorePhotos);
            jQuery('.contributorCopyBtn').click(infoViewMultiContributor.copyURL);

        };

        this.copyURL = function () {
            var inputElement = $('#' + this.id).parent().find('.contributorCopyInput').attr('id');
            if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
                jQuery('.copy-text').fadeIn().text("Please select link and use cmd+c to copy the link");
                var copyTextarea = document.querySelector('.contributorCopyInput#' + inputElement);
                copyTextarea.select();
            }

            var copyTextarea = document.querySelector('.contributorCopyInput#' + inputElement);
            copyTextarea.select();
            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
                if (msg === 'unsuccessful') {
                    if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
                        jQuery('#errorMessageModal').modal('show');
                        jQuery('.copy-text').fadeIn().text("Please select link and use cmd+c to copy the link");

                    }
                } else {
                    jQuery('#errorMessageModal').modal('show');
                }
            } catch (err) {
            }
        };

        this.focusContainerContributor = function (e) {
            var senderElement = e.target.className;
            // console.log('Event Source con:  ' + senderElement);
            if (senderElement == 'multiInfoDeleteOwnerScreenBtn') {
                var id = jQuery(this).data('id');
                var messagesView = MessagesView.create();
                messagesView.addToDiv();
                messagesView.messageMiddle();
                jQuery('.deleteImageSetModal').modal('show');
                jQuery('#deleteImageSetInfo').text(LanguageUtils.valueForKey("deleteImageSetMsg"));
                jQuery("#deleteMyImageSet").click(function () {
                    jQuery('.pageload').show();
                    jQuery(".deleteImageSetModal").modal('hide');
                    infoViewMultiContributor.imageSetId = {
                        image_set_id:
                                {
                                    "0": id

                                }
                    }
                    var promise = ContributionService.cancelImageSetData(JSON.stringify(infoViewMultiContributor.imageSetId));
                    promise.then(function (data) {
                        PubSub.publish('UPDATE_IMAGE_SET_INFO_PANEL_WITH_DASH');
                        jQuery('#InfoModal').modal('hide');
                    }).fail(function () {
                    });
                });
            }
        };

        this.focusContainer = function (e) {
            var senderElement = e.target.className;
             console.log('Event Source:  ' + senderElement);
            if (senderElement == 'multiInfoDeleteOwnerScreenBtn') {
                var id = jQuery(this).data('id');
                var messagesView = MessagesView.create();
                messagesView.addToDiv();
                messagesView.messageMiddle();
                jQuery('.deleteImageSetModal').modal('show');
                jQuery('#deleteImageSetInfo').text(LanguageUtils.valueForKey("deleteImageSetMsg"));
                jQuery("#deleteMyImageSet").click(function () {
                    jQuery('.pageload').show();
                    jQuery(".deleteImageSetModal").modal('hide');
                    infoViewMultiContributor.imageSetId = {
                        image_set_id:
                                {
                                    "0": id

                                }
                    }
                    var promise = ContributionService.cancelImageSetData(JSON.stringify(infoViewMultiContributor.imageSetId));
                    promise.then(function (data) {
                        PubSub.publish('UPDATE_IMAGE_SET_INFO_PANEL_WITH_DASH');
                        jQuery('#InfoModal').modal('hide');
                    }).fail(function () {
                    });
                });
            }
        };

        this.addMorePhotos = function () {
            if (!(jQuery(this).hasClass('disabledAddPhotosInfoTopBox')) && !GlobalData.mobileDevice) {
                jQuery('body').addClass('page-loaded');
                jQuery('body > .pageload').fadeIn();
                GlobalData.fileUploadData = {};
                GlobalData.multiDevice = {};
                GlobalData.multiDevice.addMorePhotos = 1;
                GlobalData.multiDevice.orderId = infoViewMultiContributor.infoData.id;
                GlobalData.multiDevice.DesignRequestType = 1;
                GlobalData.multiDevice.title = infoViewMultiContributor.infoData.cover_caption;
                //GlobalData.multiDevice.previousCount = infoViewMultiContributor.infoData.total_transferred_count;
                GlobalData.multiDevice.previousCount = 0;
                GlobalData.multiDevice.design_request_type_name = infoViewMultiContributor.infoData.design_request_type_name;
                GlobalData.multiDevice.belongsTo = infoViewMultiContributor.infoData.story_belongsto;
                GlobalData.multiDevice.storyOwnerName = infoViewMultiContributor.infoData.story_owner_name;
                GlobalData.multiDevice.copyLink = infoViewMultiContributor.infoData.image_contribution_invitation_link;


                var requestData = {
                    order_id: infoViewMultiContributor.infoData.id
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
                                        infoViewMultiContributor.messageMiddle();
                                        jQuery('.pageload').hide();
                                    } else {
                                        PubSub.publish('UPDATE_DASHBOARD_NO_CONDITION');
                                    }
                                }

                            } else {
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
            var requestData = {
                order_id: infoViewMultiContributor.infoData.id,
                customer_id: CookieUtils.getCookie("custId")
            };
            var promise = ContributionService.getContributedImageSetData(requestData);

            promise.then(function (data) {
                jQuery('body').addClass('page-loaded').removeClass('page-loading');
                jQuery('body > .pageload').fadeOut();
                //populate data in info view screen
                var imageSetList, infoText;
                var imageSetData = data.arr_data;
                infoViewMultiContributor.actualImageTransferCount = 0;
                jQuery('.image-set').empty();
                var totalCountForOwner = 0;
                var totalCountForContributor = 0;
                infoViewMultiContributor.storyCurrentStatus = "completed";

                if (imageSetData !== null) {
                    for (var i = 0; i < imageSetData.length; i++) {
                        infoViewMultiContributor.actualImageTransferCount += parseInt(imageSetData[i].transferred_image_count);
                        if (imageSetData[i].image_set_status_code === '1000' || imageSetData[i].image_set_status_code === '2000') {
                            infoViewMultiContributor.storyCurrentStatus = "transferring";
                        }
                        if (imageSetData[i].contributor_customer_id !== infoViewMultiContributor.infoData.contributor_customer_id) {
                            var deleteLink = (imageSetData[i].cancellable_by_user == 1) ? '<div class="multiInfoDeleteOwnerScreenBtn">Delete</div>' : '';

                            var profilePic = imageSetData[i].contributor_profile_image_url;
                            if (profilePic === null) {
                                profilePic = 'assets/images/shareimage.png';
                            }
                            if (imageSetData[i].image_set_status === 'Completed') {
                                imageSetList = '<div class="image-set-src-details-container-friends" data-id=' + imageSetData[i].order_imageset_id + '><div class="imagesetOwnerName"><div class="contributorNameText">' + imageSetData[i].contributor_first_name + '</div></div><div class="image-set-src-icon-friend"><img src="' + profilePic + '"><span class="image-set-image-count-special">' + imageSetData[i].transferred_image_count + '</span></div><div class="image-set-src-name">' + imageSetData[i].image_source_name_display_text + '</div><div class="image-set-src-status">' + imageSetData[i].image_set_status + '</div><div class="image-set-src-count-status" style="display:none">' + imageSetData[i].transferred_image_count + ' of ' + imageSetData[i].selected_image_count + '</div>' + deleteLink + '</div></div>';
                            } else {
                                imageSetList = '<div class="image-set-src-details-container-friends" data-id=' + imageSetData[i].order_imageset_id + '><div class="imagesetOwnerName"><div class="contributorNameText">' + imageSetData[i].contributor_first_name + '</div></div><div class="image-set-src-icon-friend"><img src="' + profilePic + '"><span class="image-set-image-count-special">' + imageSetData[i].transferred_image_count + '</span></div><div class="image-set-src-name">' + imageSetData[i].image_source_name_display_text + '</div><div class="image-set-src-status">' + imageSetData[i].image_set_status + '</div><div class="image-set-src-count-status">' + imageSetData[i].transferred_image_count + ' of ' + imageSetData[i].selected_image_count + '</div>' + deleteLink + '</div></div>';
                            }
                            totalCountForContributor = totalCountForContributor + parseInt(imageSetData[i].transferred_image_count);

                            jQuery('.image-set-Friends').prepend(imageSetList);

                        } else {
                            var deleteLink = (imageSetData[i].cancellable_by_user == 1) ? '<div class="multiInfoDeleteOwnerScreenBtn">Delete</div>' : '';
                            if (imageSetData[i].image_set_status === 'Completed') {
                                imageSetList = '<div class="image-set-src-details-container" data-id=' + imageSetData[i].order_imageset_id + '><div class="image-set-src-icon"><img src="assets/images/' + imageSetData[i].image_source_name + '-info.png"><span class="image-set-image-count">' + imageSetData[i].transferred_image_count + '</span></div><div class="image-set-src-name">' + imageSetData[i].image_source_name_display_text + '</div><div class="image-set-src-status">' + imageSetData[i].image_set_status + '</div><div class="image-set-src-count-status" style="display:none">' + imageSetData[i].transferred_image_count + ' of ' + imageSetData[i].selected_image_count + '</div>' + deleteLink + '</div></div>';
                            } else {
                                imageSetList = '<div class="image-set-src-details-container" data-id=' + imageSetData[i].order_imageset_id + '><div class="image-set-src-icon"><img src="assets/images/' + imageSetData[i].image_source_name + '-info.png"><span class="image-set-image-count">' + imageSetData[i].transferred_image_count + '</span></div><div class="image-set-src-name">' + imageSetData[i].image_source_name_display_text + '</div><div class="image-set-src-status">' + imageSetData[i].image_set_status + '</div><div class="image-set-src-count-status">' + imageSetData[i].transferred_image_count + ' of ' + imageSetData[i].selected_image_count + '</div>' + deleteLink + '</div></div>';
                            }
                            totalCountForOwner = totalCountForOwner + parseInt(imageSetData[i].transferred_image_count);

                            jQuery('.image-set').prepend(imageSetList);
                        }
                    }

                    if (totalCountForContributor === 0) {
                        jQuery("#imageSetCounterTextIdContributor").text("No photos added by friends");
                    } else if (totalCountForContributor > 0 && totalCountForContributor < 2) {
                        jQuery("#imageSetCounterTextIdContributor").text(totalCountForContributor + " photo added by friends");
                    } else {
                        jQuery("#imageSetCounterTextIdContributor").text(totalCountForContributor + " photos added by friends");
                    }

                    if (totalCountForOwner === 0) {
                        jQuery("#imageSetCounterTextIdOwner").text("No photos added by you");
                    } else if (totalCountForOwner > 0 && totalCountForOwner < 2) {
                        jQuery("#imageSetCounterTextIdOwner").text(totalCountForOwner + " photo added by you");
                    } else {
                        jQuery("#imageSetCounterTextIdOwner").text(totalCountForOwner + " photos added by you");
                    }

                } else {
                    jQuery("#imageSetCounterTextIdContributor").text("No photos added by friends");
                    jQuery("#imageSetCounterTextIdOwner").text("No photos added by you");
                }

                infoText = infoViewMultiContributor.infoData.order_expiration_date;

                jQuery('#infoText').empty();

                infoText = infoViewMultiContributor.convertDateWithTime(infoText);

                jQuery('#infoText').prepend('* This story will be saved only till ' + infoText + ' and will be automatically deleted after that.');
                infoViewMultiContributor.imageSetListScroll();
                jQuery('.multiContributorOwnerScreen .image-set-src-details-container').click(infoViewMultiContributor.focusContainer);
                jQuery('.image-set-src-details-container-friends').click(infoViewMultiContributor.focusContainerContributor);

                //for owner tab
                jQuery('.image-set-src-details-container').on("mouseenter", function () {
                    jQuery('.image-set-src-details-container .multiInfoDeleteOwnerScreenBtn').css('display', 'none');
                    jQuery(this).children('.multiInfoDeleteOwnerScreenBtn:first').css({'display': 'block', color: '#0087f2'});
                    jQuery('image-set-src-details-container-focus .multiInfoDeleteOwnerScreenBtn:first').css('display', 'block');
                }).on("mouseleave", function () {
                    jQuery('.image-set-src-details-container .multiInfoDeleteOwnerScreenBtn').css('display', 'none');
//                    jQuery(this).children('.multiInfoDeleteOwnerOfContributor:first').css('display', 'none');
                    jQuery('image-set-src-details-container-focus .multiInfoDeleteOwnerScreenBtn:first').css('display', 'block');
                });

                //for contributor tab
                jQuery('.image-set-src-details-container-friends').on("mouseenter", function () {
                    jQuery('.image-set-src-details-container-friends .multiInfoDeleteOwnerScreenBtn').css('display', 'none');
                    jQuery(this).children('.multiInfoDeleteOwnerScreenBtn:first').css({'display': 'block', color: '#0087f2'});
                    jQuery('image-set-src-details-container-friends-focus .multiInfoDeleteOwnerScreenBtn:first').css('display', 'block');
                }).on("mouseleave", function () {
                    jQuery('.image-set-src-details-container-friends .multiInfoDeleteOwnerScreenBtn').css('display', 'none');
//                    jQuery(this).children('.multiInfoDeleteOwnerOfContributor:first').css('display', 'none');
                    jQuery('image-set-src-details-container-friends-focus .multiInfoDeleteOwnerScreenBtn:first').css('display', 'block');
                });


            }).fail(function () {
            });

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
            var divName = '.div-owner ';
            jQuery(divName + '.leftArrowIcon').css('visibility', 'hidden');

            //for owner list
            if (jQuery(".image-set-src-container").hasClass("ownImageSet")) {
                if (jQuery(".image-set-src-details-container").length > 3) {
                    infoViewMultiContributor.arrowShow(divName);
                }
                else {
                    jQuery(divName + '.leftArrowIcon').fadeOut();
                    jQuery(divName + '.rightArrowIcon').fadeOut();
                }
            }
            else {
                if (jQuery(".image-set-src-details").length > 7) {
                    infoViewMultiContributor.arrowShow(divName);
                }
                else {
                    jQuery(divName + '.leftArrowIcon').fadeOut();
                    jQuery(divName + '.rightArrowIcon').fadeOut();
                }
            }

            //for friends list
            var divName = '.div-contributor ';
            if (jQuery(".image-set-src-container").hasClass("ownImageSet")) {
                if (jQuery(".image-set-src-details-container-friends").length > 3) {
                    infoViewMultiContributor.arrowShow(divName);
                }
                else {
                    jQuery(divName + '.leftArrowIcon').fadeOut();
                    jQuery(divName + '.rightArrowIcon').fadeOut();
                }
            }
            else {
                if (jQuery(".image-set-src-details").length > 7) {
                    infoViewMultiContributor.arrowShow(divName);
                }
                else {
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
                    //console.log('rightDifference' + leftDifference);
                    if (leftDifference > -90) {
                        jQuery(imgDivName).css({
                            marginLeft: "-=300px"
                        });
                        jQuery(divName + '.leftArrowIcon').css('visibility', 'visible');
                    }
                    else {
                        jQuery(divName + ' .rightArrowIcon').css('visibility', 'hidden');
                    }
                    var rightArrow = jQuery(divName + '.rightArrowIcon').offset().left;
                    var LastShare = jQuery(imgDivName).children().last().offset().left;
                    var leftDifference = LastShare - rightArrow;

                    if ((leftDifference) < -100) {
                        jQuery(divName + '.rightArrowIcon').css('visibility', 'hidden');
                    }

                });

                jQuery(divName + '.leftArrowIcon').click(function () {
                    var leftArrow = jQuery(divName + '.leftArrowIcon').offset().left;
                    var firstShare = jQuery(imgDivName).children().first().offset().left;
                    var leftDifference = leftArrow - firstShare;
                    //console.log('leftDifference' + leftDifference);
                    if (leftDifference > 318) {
                        jQuery(imgDivName).css({
                            marginLeft: "+=300px"
                        });
                        jQuery(divName + ' .rightArrowIcon').css('visibility', 'visible');
                    }
                    else {
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
            }
            else {
                jQuery('#InfoModal .modal-content').css("height", "479px");
            }
        };
        this.modalHeight = function () {
            var deskDevice, bodyHeight, deskWidth, modalWidth, formHeight, coverHeight, bodyHeightScr1;
            if (jQuery(window).width() < 768) {
                //console.log('info popup condition 1');
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
                //console.log('info popup condition 2');
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
                    //jQuery('#shareCover').css('height', modalWidth - 60 + "px");


                } else {
                    //console.log('dddd');
                    deskDevice = 600;
                    bodyHeight = deskDevice - 50;
                    bodyHeightScr1 = deskDevice - 50;
                    deskWidth = deskDevice * 0.7;
                    modalWidth = deskWidth * 0.7;
                    coverHeight = modalWidth;
                    jQuery('#InfoModal > .modal-dialog > .modal-content').css("height", deskDevice + "px");
                    jQuery('#InfoModal > .modal-dialog > .modal-content').css("width", deskWidth + "px");
                    jQuery('#InfoModal > .modal-dialog > .modal-content .modal-body').css("max-height", bodyHeight + "px");
                    jQuery('#baseInfo .modal-body').css({"max-height": bodyHeightScr1 + "px", 'padding-left': '0px', 'padding-right': '0px'});
                    jQuery('#InfoModal > .modal-dialog > .modal-content#baseInfo').css("height", deskDevice + "px");
                    jQuery('#InfoModal > .modal-dialog > .modal-content#baseInfo .modal-body').css("max-height", bodyHeightScr1 + "px");
                    //jQuery('#infoDialog').css('width', 350 + "px");
                    jQuery('#infoDialog').css({'width': 350 + "px", 'margin-top': '60px', 'margin-bottom': '0px'});
                    //jQuery('#shareCover').css('height', coverHeight + "px");
                }

            } else {
                //console.log('info popup condition 3');
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
                    //jQuery('#shareCover').css('height', modalWidth - 60 + "px");


                } else {
                    deskDevice = 600;
                    bodyHeight = deskDevice - 50;
                    bodyHeightScr1 = deskDevice - 50;
                    deskWidth = deskDevice * 0.7;
                    modalWidth = deskWidth * 0.7;
                    coverHeight = modalWidth;

                    jQuery('#InfoModal > .modal-dialog > .modal-content').css("height", deskDevice + "px");
                    jQuery('#InfoModal > .modal-dialog > .modal-content').css("width", deskWidth + "px");
                    jQuery('#InfoModal > .modal-dialog > .modal-content .modal-body').css("max-height", bodyHeight + "px");
                    jQuery('#baseInfo .modal-body').css({"max-height": bodyHeight + "px", 'padding-left': '0px', 'padding-right': '0px'});
                    jQuery('#InfoModal > .modal-dialog > .modal-content#baseInfo').css("height", deskDevice + "px");
                    jQuery('#InfoModal > .modal-dialog > .modal-content#baseInfo .modal-body').css("max-height", bodyHeightScr1 + "px");
                    jQuery('#infoDialog').css('width', deskWidth + "px");
                    //jQuery('#shareCover').css('height', coverHeight + "px");
                }
            }
        };

        this.deleteStory = function () {
            var del = this;
            var custID = CookieUtils.getCookie("custId");
            var messagesView = MessagesView.create();
            messagesView.addToDiv();
            jQuery('#messageModal').modal('show');
            infoViewMultiContributor.messageMiddle();
            jQuery('#messageModal #back_text').text("Are you sure you want to delete the Photostory?").fadeIn();
            jQuery('#messageModal #download_text').hide();
            jQuery('#messageModal #confirm_download').hide();
            jQuery('#cancel_btn').text("Delete").fadeIn();
            jQuery('#ok_back').text("Cancel").fadeIn();
            jQuery('#cancel_btn').click(function () {
                var requestData = {};
                var promise;
                jQuery(".modal").fadeOut();

                requestData = {
                    order_id: infoViewMultiContributor.infoData.id
                };
                promise = UserService.deletePhotostory(requestData);
                promise.then(function (data) {
                    //console.dir(data);
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

    return InfoViewMultiContributor;
});