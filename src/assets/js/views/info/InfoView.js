/*global define, jQuery, window*/

define(['Augment',
    'Instance',
    'PubSub',
    'GlobalData',
    'services/ShareService',
    'utils/CookieUtils',
    'utils/LanguageUtils',
    'views/share/ShareView',
    'views/messages/MessagesView',
    'views/errorMessage/ErrorMessage',
    'lockr',
    'hbs!views/info/templates/InfoView'
], function (augment, instance, PubSub, GlobalData, ShareService, CookieUtils, LanguageUtils, ShareView, MessagesView, ErrorMessage, Lockr, tplInfoView) {

    'use strict';

    var InfoView = augment(instance, function () {
        //        var infoView = this;
        this.init = function () {
            var infoview = this;
            jQuery(window).resize(function () {
                infoview.shareMiddle();
                infoview.screenHeight();
                infoview.messageMiddle();
                infoview.errorMiddle();
            });
        };
        var StoryFlag, stroytype;
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.addToDiv = function (myFlag, stroyType) {
            StoryFlag = myFlag;
            stroytype = stroyType;
            var divId = "infoScreenModal";
            var from1 = InfoView.infoData.order_event_date;
            var OrderDate = this.convertDate(from1);
            var auToken = CookieUtils.getCookie("authToken");
            var innerHtml = tplInfoView({
                editStoryTool: GlobalData.editStoryTool,
                id: InfoView.infoData.id,
                caption: InfoView.infoData.cover_caption,
                cover: InfoView.infoData.coverurl,
                pagescount: InfoView.infoData.noofpages,
                photoscount: InfoView.infoData.images_uploaded_count,
                orderDate: OrderDate,
                bookOwner: InfoView.infoData.shared_book_owner_name,
                zipURL: InfoView.infoData.zipurl,
                authToken: auToken,
                shareUppercase: LanguageUtils.valueForKey("shareUppercase"),
                withshare: LanguageUtils.valueForKey("withshare"),
                sharemore: LanguageUtils.valueForKey("sharemore"),
                removepubliclinks: LanguageUtils.valueForKey("removepubliclinks"),
                order: LanguageUtils.valueForKey("order"),
                photobook: LanguageUtils.valueForKey("photobook"),
                edit: LanguageUtils.valueForKey("edit"),
                photostory: LanguageUtils.valueForKey("photostory"),
                save: LanguageUtils.valueForKey("save"),
                todevice: LanguageUtils.valueForKey("todevice"),
                delete: LanguageUtils.valueForKey("delete"),
                fromgallery: LanguageUtils.valueForKey("fromgallery"),
                addnew: LanguageUtils.valueForKey("addnew"),
                sharedthrough: LanguageUtils.valueForKey("sharedthrough"),
                sharedwith: LanguageUtils.valueForKey("sharedwith"),
                sharedon: LanguageUtils.valueForKey("sharedon"),
                remove: LanguageUtils.valueForKey("remove"),
                stroytype : stroyType


            });
            jQuery('#' + divId).empty();
            jQuery('#' + divId).html(innerHtml);
            jQuery('#shaereInfo').hide();
            this.changeScreen();
        };
        this.convertDate = function (date) {
            var from2 = date.split(" ");
            var from3 = from2[0];
            var from4 = from3.split("-");
            var newMonth = from4[1] - 1;
            var Neworderdate = months[newMonth] + ' ' + from4[2] + ', ' + from4[0];
            return Neworderdate;
        };
        this.convertDateWithTime = function (date) {
            var from0 = date.split(" ");
            var newMonth = [];
            newMonth = months.indexOf(from0[0]);
            var split = from0[1].split(",");
            var from1 = newMonth + 1;
            var from1new = parseInt(from1);
            var from4;
            if (from1 < 10) {
                from4 = "0" + from1new;
            } else {
                from4 = from1new;
            }
            var from2 = split[0];
            var from3 = split[1];
            var Neworderdate = from3 + '-' + from4 + '-' + from2 + ' 12:00:00';
            return Neworderdate;
        };
        this.changeScreen = function () {
            jQuery('body').addClass('page-loaded');
            jQuery('body > .pageload').fadeIn();
            jQuery('#InfoModal').perfectScrollbar();
            jQuery('.leftArrowIcon').hide();
            jQuery('.rightArrowIcon').hide();
            InfoView.getshareEmailsDetails();
            InfoView.calenderSelect();
            jQuery('.share-more').click(InfoView.shareScreenShow);
            jQuery('#add_new-sharer').click(InfoView.sharePrivateScreenShow);
            InfoView.screenHeight();
            jQuery('.info-delete').click(InfoView.deleteShare);
            jQuery('.delete-info').click(InfoView.deleteShareStory);
            jQuery('.order-photoBook').click(InfoView.orderPhotoBook);
            jQuery('.edit-item').click(function (event) {
                event.preventDefault();
                event.stopPropagation();
                if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/Android/i))) {
                    /*jQuery('.alertDialog').modal('show');
                    jQuery('#displayText').text('To edit your story, please download the Photogurus editor app on your tablet or login to Photogurus.com on your computer.');
                    jQuery(".closeCustomModal").click(function (e) {
                        e.stopPropagation();
                        jQuery('.alertDialog').modal('hide');
                    });*/
                    /*var errorMessage = ErrorMessage.create();
                    errorMessage.addToDiv();
                    jQuery('#messageModal.errorMessageModal').modal('show');
                    InfoView.errorMiddle();
                    jQuery('#messageModal.errorMessageModal p').text("To edit your story, please download the Photogurus editor app on your tablet or login to Photogurus.com on your computer.");
                    */
                    //var messagesView = MessagesView.create();
                    //messagesView.addToDiv();
                    jQuery('.pg-mobile-editor-dialog .modal-header h4').text('Download Photogurus App');
                    jQuery('.pg-mobile-editor-dialog #pg-mobile-editor-content').text('To edit your story, please download the Photogurus editor app on your device').show();
                    jQuery('.pg-mobile-editor-dialog').modal('show');
                    //messagesView.messageMiddle();
                }else{
                    console.log(jQuery(this).find('a'));
                    var link = jQuery(this).find('a').attr("href");
                    
                    if (GlobalData.fileUploadData.onGoingUpload) {
                        window.open(link, '_blank');
                    } else {
                        window.open(link, '_self');
                        jQuery('body').addClass('page-loaded');
                        jQuery('body > .pageload').fadeIn();
                    }
                }
            });

        };
        this.removePublicLinks = function () {

            var requestData = {
                order_id: InfoView.infoData.id,
                customer_id: CookieUtils.getCookie("custId")
            };
            var promise = ShareService.deleteAllPublicShareLink(requestData);
            promise.then(function () {
                jQuery('#removePublicLinks').css('cursor', 'default');
                jQuery('#removePublicLinks .cSubTitle').css("opacity", "0.5");
                jQuery('#removePublicLinks').off('click');
                PubSub.publish('DASHBOARD_STORIES');
            }).fail(function () {});
        };
        this.screenHeight = function () {
            if (jQuery(window).width() < 767) {
                jQuery('#InfoModal .modal-content').height(jQuery(window).height());
            } else {
                jQuery('#InfoModal .modal-content').css("height", "479px");
            }
        };
        this.orderPhotoBook = function () {
            /*var errorMessage = ErrorMessage.create();
            errorMessage.addToDiv();
            jQuery('#messageModal.errorMessageModal').modal('show');
            InfoView.errorMiddle();
            jQuery('#messageModal.errorMessageModal p').text("Currently, photobook can only be ordered from our apps. Please download the app from the App Store.");
            */
            //console.dir(InfoView.infoData);
            var type = null;
            type = 'Owner';
            if(InfoView.infoData.story_belongsto!=='Owner'){
                type = 'Recipient';
            }
            var pixel_params = null;
            pixel_params = {'User_role' : type};
            //Fb Pixel
            GlobalData.ec.recordFBPixelEvent('track', 'AddToCart', pixel_params);
            
            if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/Android/i))) {
                var errorMessage = ErrorMessage.create();
                errorMessage.addToDiv();
                jQuery('#messageModal.errorMessageModal').modal('show');
                InfoView.errorMiddle();
                jQuery('#messageModal.errorMessageModal p').text("To print your story, please download the Photogurus app on your mobile or login to Photogurus.com on your computer.");
            }else{
                GlobalData.ec.recordClickEvent('Info_view', 'click', 'Order_Photo_Book_Button');
                GlobalData.orderData = InfoView.infoData;
                GlobalData.orderData.reOrder = false;
                GlobalData.printData = {};

                Lockr.rm('storyData');
                Lockr.rm('printData');
                Lockr.rm('storyDataBKP');
                Lockr.rm('printDataBKP');
                location.hash = "#/print/books";
            }
        };


        this.deleteShareStory = function () {
            var del = this;
            var custID = CookieUtils.getCookie("custId");
            var messagesView = MessagesView.create();
            messagesView.addToDiv();
            jQuery('#messageModal').modal('show');
            InfoView.messageMiddle();
            var dialogTitle = '', dialogMsg = '', dialogBtnLabel = '';
            dialogTitle = 'Delete Story?';
            dialogMsg = 'Story cannot be restored after deletion.';
            dialogBtnLabel = 'Delete';
            
            if(stroytype === 'SharedStory'){
                dialogTitle = 'Remove Story?';
                dialogMsg = 'This will remove the story from your gallery. You can click on the share link again to get it back.';
                dialogBtnLabel = 'Remove';
            }
            jQuery('#messageModal .modal-header h4').text(dialogTitle);
            jQuery('#messageModal #back_text').text(dialogMsg).show();

            jQuery('#messageModal #download_text').hide();
            jQuery('#messageModal #confirm_download').hide();
            jQuery('#cancel_btn').text(dialogBtnLabel).show();
            jQuery('#ok_back').text("Cancel").show();
            jQuery('#cancel_btn').click(function () {
                var requestData = {};
                var promise;
                if (jQuery(del).hasClass("ownSt")) {
                    jQuery(".modal").modal('hide');
                    PubSub.publish('DASHBOARD_STORIES');
                    requestData = {
                        "customer_id": custID,
                        "tracking_id": InfoView.infoData.pb_tracking_id
                    };
                    promise = ShareService.deletePhotostory(requestData);
                    promise.then(function () {}).fail(function () {

                    });
                } else {
                    jQuery(".modal").modal('hide');
                    requestData = {
                        "customer_id": custID,
                        "token": InfoView.infoData.token
                    };
                    promise = ShareService.deleteShareDetails(requestData);
                    promise.then(function () {
                        PubSub.publish('DASHBOARD_STORIES');
                    }).fail(function () {

                    });
                }
            });




        };
        this.deleteShare = function () {
            var id = this.id;
            var messagesView = MessagesView.create();
            messagesView.addToDiv();
            jQuery('#messageModal').modal('show');
            InfoView.messageMiddle();
            jQuery('#messageModal #back_text').text("Are you sure you want to remove this private link?").show();
            jQuery('#messageModal #download_text').hide();
            jQuery('#messageModal #confirm_download').hide();
            jQuery('#cancel_btn').text("No").show();
            jQuery('#ok_back').text("Yes").show();
            jQuery('#ok_back').click(function () {
                var requestData = {
                    "customer_id": id,
                    "order_id": InfoView.infoData.id
                };
                var promise = ShareService.deleteShareDetails(requestData);
                promise.then(function (data) {
                    jQuery('body').addClass('page-loaded');
                    jQuery('body > .pageload').fadeIn();
                    jQuery('#baseInfo').show();
                    jQuery('#shaereInfo').hide();
                    jQuery('.usersIcon').remove();
                    InfoView.getshareEmailsDetails();
                    InfoView.sharerListScroll();
                    jQuery('.share-NameCon').css('margin-left', '0px');
                }).fail(function () {

                });
            });

        };
        this.sharerListScroll = function () {
            jQuery('.leftArrowIcon').css('visibility', 'hidden');
            if (jQuery(".sharedUserContainer").hasClass("ownUsers")) {
                if (jQuery(".userIconDetailsContent").length > 5) {
                    InfoView.arrowShow();
                } else {
                    jQuery('.leftArrowIcon').hide();
                    jQuery('.rightArrowIcon').hide();
                }
            } else {
                if (jQuery(".userIconDetailsContent").length > 7) {
                    InfoView.arrowShow();
                } else {
                    jQuery('.leftArrowIcon').hide();
                    jQuery('.rightArrowIcon').hide();
                }
            }
        };
        this.arrowShow = function () {
            if (jQuery(window).width() < 767) {
                jQuery('.leftArrowIcon').hide();
                jQuery('.rightArrowIcon').hide();
            } else {
                jQuery('.leftArrowIcon').show();
                jQuery('.rightArrowIcon').show();
                jQuery('.rightArrowIcon').click(function () {

                    var rightArrow = jQuery('.rightArrowIcon').offset().left;
                    var LastShare = jQuery('.share-NameCon').children().last().offset().left;
                    var leftDifference = LastShare - rightArrow;
                    if (leftDifference > -30) {
                        jQuery('.share-NameCon').animate({
                            marginLeft: "-=72px"
                        }, "fast");
                        jQuery('.leftArrowIcon').css('visibility', 'visible');
                    } else {
                        jQuery('.rightArrowIcon').css('visibility', 'hidden');
                    }
                });
                jQuery('.leftArrowIcon').click(function () {
                    var leftArrow = jQuery('.leftArrowIcon').offset().left;
                    var firstShare = jQuery('.share-NameCon').children().first().offset().left;
                    var leftDifference = leftArrow - firstShare;
                    if (leftDifference > -10) {
                        jQuery('.share-NameCon').animate({
                            marginLeft: "+=72px"
                        }, "fast");
                        jQuery('.rightArrowIcon').css('visibility', 'visible');
                    } else {
                        jQuery('.leftArrowIcon').css('visibility', 'hidden');
                    }
                });
            }
        };
        this.calenderSelect = function () {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth();

            var newMonth = months[mm];
            var yyyy = today.getFullYear();
            var maxDate = newMonth + " " + dd + "," + yyyy;
            jQuery('input#calender').datepicker({
                format: "MM dd,yyyy",
                endDate: maxDate
                    //                format: "yyyy-mm-dd"
            });


            //            $('input#calender').datepicker('setDate', new Date(2006, 11, 24));
            //            $('input#calender').datepicker('update');
            jQuery('#editDateId').click(function () {
                jQuery('input#calender').attr('disabled', false);
                jQuery('.modal-open').addClass("removeScroll");
                jQuery('input#calender').focus();
            });
            jQuery('input#calender').on('changeDate', function () {
                jQuery('.modal-open').removeClass("removeScroll");
                jQuery(this).datepicker('hide');
                var OldDate = jQuery('input#calender').val();
                var dateAndTime = InfoView.convertDateWithTime(OldDate);

                var requestData = {
                    order_id: InfoView.infoData.id,
                    order_event_date: dateAndTime
                };
                var OldDateUpdated = InfoView.convertDate(dateAndTime);
                jQuery('input#calender').val(OldDateUpdated);
                var promise = ShareService.updateOrderEventInfodate(requestData);
                promise.then(function (data) {
                    //console.dir(data);
                    if (data.int_status_code === 1) { 
                        var messagesView = MessagesView.create();
                        messagesView.addToDiv();
                        jQuery('.toast-dialog').modal('show');
                        InfoView.messageMiddle();
                        jQuery('.toast-dialog #toast-msg').text("Date updated successfully.");
                        jQuery('#ok_back').click(function (event) {
                            event.stopPropagation();
                            PubSub.publish('DASHBOARD_STORIES');
                        });
                    }
                    jQuery('input#calender').prop('disabled', true);
                }).fail(function () {});
            });

        };
        this.shareScreenShow = function () {
            var shareView = ShareView.create();
            ShareView.shareData = InfoView.infoData;
            shareView.addToDiv();
            jQuery('#InfoModal').modal('hide');
            jQuery('#shareModal').modal('show');
            InfoView.shareMiddle();
        };
        this.sharePrivateScreenShow = function () {
            jQuery('#InfoModal').modal('hide');

            var shareView = ShareView.create();
            ShareView.shareData = InfoView.infoData;
            console.table(ShareView.shareData);
            if (ShareView.shareData.order_status === '950') {
                jQuery('.alertNoEditShare').modal('show');
            } else {
                shareView.addToDiv();
                jQuery('#shareModal').modal('show');
                jQuery('body').addClass("mobModal");
                InfoView.shareMiddle();
                //            jQuery('#shareModal .modal-content').perfectScrollbar();
            }
        };
        this.getshareEmailsDetails = function () {
            var requestData = InfoView.infoData.id;
            var promise = ShareService.getShareEmails(requestData);
            promise.then(function (data) {
                jQuery('body').addClass('page-loaded').removeClass('page-loading');
                jQuery('body > .pageload').fadeOut();
                var shareCount = parseInt(data.arr_data.public_share_count);
                if (shareCount > 0) {
                    jQuery('#removePublicLinks').click(InfoView.removePublicLinks);
                    jQuery('#removePublicLinks .cSubTitle').css("opacity", "1");
                } else {
                    jQuery('#removePublicLinks').off('click');
                    jQuery('#removePublicLinks .cSubTitle').css("opacity", "0.5");
                }

                var shareuserData = data.arr_data.share_user_data;
                for (var i = 0; i < shareuserData.length; i++) {
                    var picPath;
                    if (shareuserData[i].user_pic_path === "defaultpath") {
                        picPath = 'assets/images/shareimage.png';
                    } else {
                        picPath = shareuserData[i].user_pic_path;
                    }
                    var shareList;
                    var visited = parseInt(shareuserData[i].visited);
                    var accountType = parseInt(shareuserData[i].type);
                    if (accountType === 2) {
                        if (visited === 1) {
                            shareList = "<div class='userIconDetailsContent usersIcon " + stroytype + "' id=" + shareuserData[i].id + "><div class='shareVisit'></div><div class='userIcon_code sharedCIcon'><img src=" + picPath + "></div><div class='cSubTitle sharerName'>" + shareuserData[i].shared_email + "</div></div>";
                        } else {
                            shareList = "<div class='userIconDetailsContent usersIcon " + stroytype + "' id=" + shareuserData[i].id + "><div class='userIcon_code sharedCIcon'><img src=" + picPath + "></div><div class='cSubTitle sharerName'>" + shareuserData[i].shared_email + "</div></div>";
                        }
                    } else {
                        if (visited === 1) {
                            shareList = "<div class='userIconDetailsContent usersIcon " + stroytype + "' id=" + shareuserData[i].id + "><div class='shareVisit'></div><div class='userIcon_code sharedCIcon'><img src=" + picPath + "></div><div class='cSubTitle sharerName'>" + shareuserData[i].shared_name + "</div></div>";
                        } else {
                            shareList = "<div class='userIconDetailsContent usersIcon " + stroytype + "' id=" + shareuserData[i].id + "><div class='userIcon_code sharedCIcon'><img src=" + picPath + "></div><div class='cSubTitle sharerName'>" + shareuserData[i].shared_name + "</div></div>";
                        }
                    }

                    jQuery('.share-NameCon').prepend(shareList);

                }
                jQuery(".sharedCIcon > img").error(function () {
                    jQuery(this).attr('src', 'assets/images/shareimage.png');
                });
                jQuery('#info_back').click(function () {
                    jQuery('#baseInfo').show();
                    jQuery('#shaereInfo').hide();
                });

                InfoView.sharerListScroll();
                jQuery('.usersIcon').click(function () {
                    if (StoryFlag) {
                        jQuery('#baseInfo').hide();
                        jQuery('#shaereInfo').show();
                        for (var i = 0; i < shareuserData.length; i++) {
                            if (shareuserData[i].id === this.id) {
                                jQuery('.sharer').text(shareuserData[i].shared_name);
                                if (shareuserData[i].user_pic_path === "defaultpath") {
                                    jQuery('#sharer_image').attr("src", "assets/images/user_pic_profilepic.png");
                                } else {
                                    jQuery('#sharer_image').attr("src", shareuserData[i].user_pic_path);
                                }
                                jQuery('#sharer_email').text(shareuserData[i].shared_email);
                                jQuery('#shared_through').text(shareuserData[i].shared_through);
                                var OrderDate = InfoView.convertDate(shareuserData[i].shared_date);
                                var shareID = shareuserData[i].id;
                                jQuery('.info-delete').attr("id", shareID);
                                jQuery('#shared_date').text(OrderDate);
                            }
                        }
                    }

                });

            }).fail(function () {

            });
        };

        this.shareMiddle = function () {
            if (jQuery(window).width() > 767) {
                var shareContent = ((jQuery(window).height()) - (jQuery('#shareModal .modal-content').height())) / 2;
                jQuery('#shareModal .modal-dialog').css('margin-top', shareContent + 'px');
            } else {
                jQuery('#shareModal .modal-dialog').css('margin-top', '0px');
            }
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

    return InfoView;
});