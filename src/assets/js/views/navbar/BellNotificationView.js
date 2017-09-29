/*global define, jQuery, clearInterval, setInterval, document, window*/

define(['Augment',
    'Instance',
    'GlobalData',
    'parse',
    'PubSub',
    'views/dashboard/DashboardView',
    'views/errorMessage/ErrorMessage',
    'hbs!views/navbar/templates/BellNotificationView',
    'utils/DateUtils',
    'utils/CookieUtils',
    'utils/StringUtils',
    'utils/LanguageUtils',
    'services/PrintService',
    'hbs!views/notification/templates/S01Notification',
    'hbs!views/notification/templates/S04Notification',
    'hbs!views/notification/templates/S05Notification',
    'hbs!views/notification/templates/PS7Notification',
    'hbs!views/notification/templates/PS8Notification',
    'hbs!views/notification/templates/PS14Notification',
    'hbs!views/notification/templates/M7Notification',
    'hbs!views/notification/templates/M8Notification'
], function (augment, instance, GlobalData, parse, PubSub, DashboardView, ErrorMessage, tplBellNotificationView,
    DateUtils, CookieUtils, StringUtils, LanguageUtils, PrintService, tplS01, tplS04, tplS05, tplPS7, tplPS8, tplPS14, tplM7, tplM8) {

    'use strict';

    var BellNotificationView = augment(instance, function () {

        this.init = function () {
            var bellView = this;
            bellView.errorMiddle();
            var divId = "notificationBell";
            var innerHtml = tplBellNotificationView({
                Notifications: LanguageUtils.valueForKey("Notifications"),
                PhotoStoryStatus: LanguageUtils.valueForKey("PhotoStoryStatus"),
                imageBase: GlobalData.imageBase
            });
            jQuery("#" + divId).empty();
            jQuery("#" + divId).html(innerHtml);
            this.initScrollbars();
            if (GlobalData.bellCounterInterval !== undefined && GlobalData.bellCounterInterval !== null) {
                clearInterval(GlobalData.bellCounterInterval);
            }
            GlobalData.bellCounterInterval = setInterval(function () {
                if (window.location.hash === "#/dashboard" && navigator.onLine) {
                    bellView.parseNotificationCountData();
                    clearInterval(GlobalData.bellCounterInterval);
                }
            }, 60000);
            /*jQuery('#notificationBell > a').click(function (event) {
                event.stopPropagation();
                jQuery('#collapseOne').addClass('page-loaded');
                jQuery('#collapseOne > .pageloadRelative').fadeIn();
                var notif_count = jQuery('#notification_count').text();
                if (notif_count > 0) {
                    //                    jQuery('#collapseOne').empty();
                    //                    jQuery('#collapseTwo').empty();
                    jQuery('#collapseOne').html('<div class="pageloadRelative"><div class="pageload-inner text-center table-center" ><img src="' + GlobalData.imageBase + 'loading-photogurus.gif"></div></div>');
                    jQuery('#collapseOne').addClass('page-loaded');
                    jQuery('#collapseOne > .pageload').fadeIn();
                    PubSub.publish('DASHBOARD_STORIES');
                }
                BellNotificationView.resetCount();
                BellNotificationView.parseData();
                //                jQuery('body').addClass('page-loaded').removeClass('page-loading');
                //                jQuery('body > .pageload').fadeOut();

            });*/

        };

        this.initScrollbars = function () {
            jQuery('.collapse-content').perfectScrollbar();


        };

        this.registerCloseClicks = function () {
            var bellView = this;
            jQuery('.closePS14Bell').click(function () {
                var objectId = jQuery(this).data("objid");
                jQuery(this).closest(".card").fadeOut("2000");
                bellView.deleteObject(objectId);
            });

        };

        this.appendNotification = function (object) {
            var div = "collapseOne";
            var objectId = object.id;
            var notificationId = object.get('notificationId');
            var notificationText = object.get('notificationText');
            var photoStoryName = object.get('photoStoryName');
            var socialUserPicUrl = object.get('socialUserPicURL');
            var sentTimestamp = object.get('sentTimestamp');
            var isRead = object.get('isRead');
            var orderId = object.get('orderId');
            var classes = "";
            var printOrderId = object.get('printOrderId');
            var profileUrl = "assets/images/icon_user_profile_left_menu.png";
            if (isRead) {
                classes = "bg-unread";
            }
            if (socialUserPicUrl !== undefined && socialUserPicUrl !== null && socialUserPicUrl.length > 0 && "defaultpath" !== socialUserPicUrl) {
                profileUrl = socialUserPicUrl;
            }
            var preview = {};
            var oldOrder = {};
            for (var i = 0; i < DashboardView.dashboardData.length; i++) {
                var newOrder = orderId.toString();
                //var oldOrder;
                if (DashboardView.dashboardData[i].id === newOrder) {
                    var encodedString, str;



                    oldOrder = parseInt(newOrder);

                    var token = DashboardView.dashboardData[i].token;
                    if (token === "") {
                        str = DashboardView.dashboardData[i].pb_tracking_id;
                        encodedString = window.btoa(str);
                        preview = GlobalData.flipbookBaseURL + encodedString + '/0';
                    } else {
                        str = DashboardView.dashboardData[i].order_token;
                        encodedString = window.btoa(str);
                        preview = GlobalData.flipbookBaseURL + encodedString + '/1';
                    }
                    break;
                } else {
                    jQuery('#orderId').hide();
                }
            }

            notificationText = StringUtils.splitSpecialNotificationText(notificationText, photoStoryName);
            var option = {
                text: notificationText,
                objectId: objectId,
                classes: classes,
                profileUrl: profileUrl,
                dateStr: DateUtils.timestamp10ToFormattedDate(sentTimestamp),
                order: oldOrder,
                previewLink: preview,
                printOrderId: printOrderId
            };
            var innerHtml = null;
            switch (notificationId) {
                case "SO1":
                    innerHtml = tplS01(option);
                    break;
                case "SO2":
                    innerHtml = tplS01(option);
                    break;
                case "SO3":
                    innerHtml = tplS01(option);
                    break;
                case "SO4":
                    innerHtml = tplS04(option);
                    break;
                case "SO5":
                    innerHtml = tplS05(option);
                    break;
                case "PS7":
                    div = "collapseTwo";
                    innerHtml = tplPS7(option);
                    break;
                case "PS8":
                    div = "collapseTwo";
                    innerHtml = tplPS8(option);
                    break;
                case "PS14":
                    div = "collapseTwo";
                    innerHtml = tplPS14(option);
                    break;
                case "PS15":
                    div = "collapseTwo";
                    innerHtml = tplPS15(option);
                    break;
                case "PS16":
                    div = "collapseTwo";
                    innerHtml = tplPS16(option);
                    break;
                case "PS18":
                    div = "collapseTwo";
                    innerHtml = tplPS14(option);
                    break;
                case "M7":
                    div = "collapseTwo";
                    innerHtml = tplM7(option);
                    break;
                case "M8":
                    div = "collapseTwo";
                    innerHtml = tplM8(option);
                    break;
                default:
                    //                    innerHtml = tplS01(option);
                    break;
            }


            if (innerHtml !== null) {
                jQuery('#' + div).append(innerHtml);
            }

        };

        jQuery(document).on('click', '.card1', function (event) {

            var bellLinkStr = jQuery(this).attr('href');

            if (jQuery(this).attr('id').length === 0 || bellLinkStr[bellLinkStr.length - 1] === '/') {
                jQuery(this).removeAttr("href");
                var errorMessage = ErrorMessage.create();
                errorMessage.addToDiv();
                jQuery('#messageModal.errorMessageModal').modal('show');
                BellNotificationView.errorMiddle();
                jQuery('#messageModal.errorMessageModal p').text("Error in view this Story");
            } else {
                event.preventDefault();
                var objectId = jQuery(this).data("objid");
                BellNotificationView.markUnread(objectId);
                if (GlobalData.fileUploadData.onGoingUpload) {
                    window.open(bellLinkStr, '_blank');
                } else {
                    window.open(bellLinkStr, '_self');
                    jQuery('body').addClass('page-loaded');
                    jQuery('body > .pageload').fadeIn();
                }
            }
        });

        this.parseData = function () {
            var bellNotView = this;
            //app id , javascript key, masterKey,
            if (GlobalData.fileUploadData.onGoingUpload !== 1 && GlobalData.photoStoryStatusMsg !== "DesignNow" && jQuery('.modal.fade.in').length == 0) {
                console.log("GlobalData.photoStoryStatusMsg" + GlobalData.photoStoryStatusMsg);
                parse.initialize(GlobalData.parseApplicationId, GlobalData.parseJavaScriptKey, GlobalData.parsemasterKey);
                var userNotifaction = parse.Object.extend("UserNotification");
                var query = new parse.Query(userNotifaction);
                query.select("isRead", "notificationId", "notificationText", "socialUserPicURL", "sentTimestamp", "photoStoryName", "orderId");
                query.equalTo("userId", CookieUtils.getCookie("custId"));
                query.descending("createdAt");
                query.containedIn("notificationId", ["SO1", "SO2", "SO3", "SO4", "SO5", "PS7", "PS8", "PS14", "PS15", "M7", "M8"]);
                query.find({
                    success: function (results) {
                        jQuery('#collapseOne').empty();
                        jQuery('#collapseTwo').empty();
                        // Do something with the returned Parse.Object values
                        for (var i = 0; i < results.length; i++) {
                            var object = results[i];
                            bellNotView.appendNotification(object);
                        }
                        jQuery('.ps14').click(bellNotView.orderDetails);
                        if (jQuery('#collapseOne .card').length < 1) {
                            jQuery('#collapseOne').html('<h4 class="empty-card">There are no new updates</h4>');
                        }
                        if (jQuery('#collapseTwo .card').length < 1) {
                            jQuery('#collapseTwo').html('<h4 class="empty-card">There are no new updates</h4>');
                        }

                    },
                    error: function () {

                    }
                });
            } else {
                console.log("bell notification parse is get called but we throw him out of method.");
            }
        };
        this.orderDetails = function () {
            console.log(this.id);
            if (this.id === undefined || this.id === 0) {
                this.id = 0;
            }
            var requestData = {
                print_order_id: this.id
            };
            var promise = PrintService.getOrderDetails(requestData);
            $.when(promise)
                .done(function (obj) {
                    if (obj.arr_data !== null && obj.int_status_code !== 0) {
                        GlobalData.printData = {};
                        GlobalData.printData.selectedOrderDetails = obj.arr_data.data[0];
                        GlobalData.printData.redirectURL = '#/print/order/details';
                        Lockr.set('printData', GlobalData.printData);
                        location.hash = GlobalData.printData.redirectURL;
                    } else {

                    }
                });
        };

        this.displayCount = function (count) {
            if (count !== undefined && count !== null && count > 0) {
                jQuery("#notification_count").show();
                jQuery("#notification_count").html(count);
                //                BellNotificationView.notifyMe();
            }
        };
        this.displayResetCount = function () {
            jQuery("#notification_count").hide();
        };
        //         this.notifyMe = function() {
        //            if (!Notification) {
        //                alert('Desktop notifications not available in your browser. Try Chromium.');
        //                return;
        //            }
        //
        //            if (Notification.permission !== "granted")
        //                Notification.requestPermission();
        //            else {
        //                var notification = new Notification('Notification title', {
        //                    icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
        //                    body: "Hey there! You've been notified! by Photogurus",
        //                });
        //
        //                notification.onclick = function() {
        //                    window.open("http://stackoverflow.com/a/13328397/1269037");
        //                };
        //
        //            }
        //
        //        };
        this.parseNotificationCountData = function () {
            var bellNotView = this;
            //app id , javascript key, masterKey,
            parse.initialize(GlobalData.parseApplicationId, GlobalData.parseJavaScriptKey, GlobalData.parsemasterKey);
            var userNotifaction = parse.Object.extend("UserNotificationCount");
            var query = new parse.Query(userNotifaction);
            query.select("userId", "count");
            query.equalTo("userId", CookieUtils.getCookie("custId"));
            query.find({
                success: function (results) {
                    // Do something with the returned Parse.Object values
                    for (var i = 0; i < results.length; i++) {
                        var object = results[i];
                        var count = object.get('count');
                        bellNotView.displayCount(count);
                    }
                    bellNotView.registerCloseClicks();
                },
                error: function () {

                }
            });
        };

        this.deleteObject = function (objId) {
            parse.initialize(GlobalData.parseApplicationId, GlobalData.parseJavaScriptKey, GlobalData.parsemasterKey);
            var UserNotification = parse.Object.extend("UserNotification");
            var userNotification = new UserNotification();
            userNotification.set("id", objId);
            userNotification.destroy({
                success: function () {},
                error: function () {
                    // The delete failed.
                    // error is a Parse.Error with an error code and message.
                }
            });

        };
        this.markUnread = function (objId) {
            parse.initialize(GlobalData.parseApplicationId, GlobalData.parseJavaScriptKey, GlobalData.parsemasterKey);
            var userNotifaction = parse.Object.extend("UserNotification");
            var query = new parse.Query(userNotifaction);
            query.get(objId, {
                success: function (userNotifactionObj) {
                    userNotifactionObj.set("isRead", true);
                    userNotifactionObj.save();
                },
                error: function () {

                }
            });
        };
        this.resetCount = function () {
            var bellNotView = this;
            //app id , javascript key, masterKey,
            parse.initialize(GlobalData.parseApplicationId, GlobalData.parseJavaScriptKey, GlobalData.parsemasterKey);
            var userNotifaction = parse.Object.extend("UserNotificationCount");
            var query = new parse.Query(userNotifaction);
            query.select("userId", "count");
            query.equalTo("userId", CookieUtils.getCookie("custId"));
            query.find({
                success: function (results) {

                    for (var i = 0; i < results.length; i++) {
                        var object = results[i];
                        var count = object.set('count', 0);
                        bellNotView.displayResetCount(count);
                        count.save();
                    }
                    jQuery("#notification_count").html(0);
                    //                    BellNotificationView.appendNotification();

                },
                error: function () {}
            });
        };
        this.errorMiddle = function () {
            var msgContent = ((jQuery(window).height()) - (181)) / 2;
            jQuery('#messageModal.errorMessageModal .modal-dialog').css('margin-top', msgContent + 'px');
        };

    });

    return BellNotificationView;
});