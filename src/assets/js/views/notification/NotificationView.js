/*global define, jQuery*/

define(['Augment',
    'Instance',
    'GlobalData',
    'PubSub',
    'parse',
    'utils/DateUtils',
    'utils/StringUtils',
    'utils/CookieUtils',
    'services/PrintService',
    'hbs!views/notification/templates/PS7Notification',
    'hbs!views/notification/templates/PS8Notification',
    'hbs!views/notification/templates/PS14Notification',
    'hbs!views/notification/templates/PS15Notification',
    'hbs!views/notification/templates/PS16Notification',
    'hbs!views/notification/templates/PS18Notification',
    'hbs!views/notification/templates/M7Notification',
    'hbs!views/notification/templates/M8Notification'
], function (augment, instance, GlobalData, PubSub, parse, DateUtils, StringUtils, CookieUtils, PrintService, tplPS7, tplPS8, tplPS14, tplPS15, tplPS16, tplPS18, tplM7, tplM8) {

    'use strict';

    var NotificationView = augment(instance, function () {
        var notfificationView = this;
        this.PSNotificationCount = 0;
        this.divId = "notification";
        this.psNotificaitonInterval = '';
        this.addToDiv = function () {
            jQuery('#' + this.divId).empty();
            if (document.location.hash === "#/dashboard" && navigator.onLine) {
                this.parseData();
            }
            clearInterval(this.psNotificaitonInterval);
            notfificationView.PSNotificationCount = 0;
            this.psNotificaitonInterval = setInterval(function () {
                if (document.location.hash === "#/dashboard" && navigator.onLine) {
                    notfificationView.parseData();
                }
            }, 60000);

        };

        this.registerCloseClicks = function () {
            var notView = this;
            jQuery('.closePS14 , .closePS8 , .closePS7').click(function (event) {
                event.stopPropagation();
                if (jQuery(window).width() < 1025) {
                    jQuery(".newStory-container").css('margin-top', '4px');
                }
                var objectId = jQuery(this).data("objid");
                jQuery(this).closest(".card").fadeOut("2000");
                notView.deleteObject(objectId);
            });
        };

        this.appendNotification = function (object) {
            //console.dir(object.get('notificationId'));
            var objectId = object.id;
            var notificationId = object.get('notificationId');
            var notificationText = object.get('notificationText');
            var photoStoryName = object.get('photoStoryName');
            var sentTimestamp = object.get('sentTimestamp');
            var orderIdFromParse = object.get('orderId');
            var printOrderId = object.get('printOrderId');
            notificationText = StringUtils.splitNotificationText(notificationText, photoStoryName);

            var option = {
                isDashBoard: true,
                text: notificationText,
                dateStr: DateUtils.timestamp10ToFormattedDate(sentTimestamp),
                objectId: objectId,
                orderId: orderIdFromParse,
                printOrderId: printOrderId
            };
            var innerHtml = null;
            switch (notificationId) {
                //                case "SO5":
                //                    innerHtml = tplS05(option);
                //                    break;
                //                case "SO1":
                //                    innerHtml = tplS01(option);
                //                    break;
                case "PS7":
                    var pixel_params = null;
                    pixel_params = {'Order_ID' : option.orderId};
                    //Fb Pixel
                    GlobalData.ec.recordFBPixelEvent('trackCustom', 'storyReady', pixel_params);
                    innerHtml = tplPS7(option);
                    break;
                case "PS8":
                    innerHtml = tplPS8(option);
                    break;
                case "PS14":
                    innerHtml = tplPS14(option);
                    break;
                case "PS15":
                    innerHtml = tplPS15(option);
                    break;
                case "PS16":
                    innerHtml = tplPS16(option);
                    break;
                case "PS18":
                    innerHtml = tplPS18(option);
                    break;
                case "M7":
                    innerHtml = tplM7(option);
                    break;
                case "M8":
                    innerHtml = tplM8(option);
                    break;
                default:
                    break;
            }
            if (innerHtml !== null) {
                jQuery('#' + this.divId).prepend(innerHtml);
            }

        };
        this.orderDetails = function () {
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

        this.parseData = function () {
            var notiView = this;
            //app id , javascript key, masterKey,
            if (GlobalData.fileUploadData.onGoingUpload !== 1 && GlobalData.photoStoryStatusMsg !== "DesignNow" && jQuery('.modal.fade.in').length == 0) {
                console.log("GlobalData.photoStoryStatusMsg" + GlobalData.photoStoryStatusMsg);
                parse.initialize(GlobalData.parseApplicationId, GlobalData.parseJavaScriptKey, GlobalData.parsemasterKey);
                var userNotifaction = parse.Object.extend("UserNotification");
                var query = new parse.Query(userNotifaction);
                query.select("objectId", "notificationId", "notificationText", "socialUserPicUrl", "sentTimestamp", "photoStoryName", "printOrderId", "orderId");
                query.equalTo("userId", CookieUtils.getCookie("custId"));
                query.equalTo("isRead", false);
                query.containedIn("notificationId", ["PS7", "PS8", "PS14", "PS15", "PS16", "PS18", "M7", "M8"]);
                query.find({
                    success: function (results) {
                        //console.dir(results);
                        notfificationView.PSNotificationData = results;
                        notfificationView.PSNotificationUpdate();
                        // Do something with the returned Parse.Object values
                    },
                    error: function () {

                    }
                });
            } else {
                console.log("parse method was called but we throw him out.");
            }

        };

        this.PSNotificationUpdate = function () {
            if (notfificationView.PSNotificationCount === 0) {
                notfificationView.PSNotificationOldData = notfificationView.PSNotificationData;
                notfificationView.PSNotificationCount++;
                jQuery('#notification').empty();
                for (var i = 0; i < notfificationView.PSNotificationData.length; i++) {
                    notfificationView.appendNotification(notfificationView.PSNotificationData[i]);
                }
                notfificationView.registerCloseClicks();
            }
            if (notfificationView.PSNotificationOldData.length !== notfificationView.PSNotificationData.length) {
                jQuery('#notification').empty();
                for (var i = 0; i < notfificationView.PSNotificationData.length; i++) {
                    notfificationView.appendNotification(notfificationView.PSNotificationData[i]);
                }
                notfificationView.registerCloseClicks();
                notfificationView.PSNotificationOldData = notfificationView.PSNotificationData;
                if (document.location.hash === "#/dashboard" && navigator.onLine) {
                    PubSub.publish('UPDATE_TRANSFER_IN_PROGRESS_STORY');
                }
            }
            jQuery('.ps14').click(notfificationView.orderDetails);
        };

        this.deleteObject = function (objId) {
            for (var i = 0; i < notfificationView.PSNotificationOldData.length; i++) {
                if (notfificationView.PSNotificationOldData[i].id === objId) {
                    notfificationView.PSNotificationOldData.splice(i, 1);
                }
            }
            parse.initialize(GlobalData.parseApplicationId, GlobalData.parseJavaScriptKey, GlobalData.parsemasterKey);
            var userNotifaction = parse.Object.extend("UserNotification");
            var query = new parse.Query(userNotifaction);
            query.get(objId, {
                success: function (userNotifactionObj) {
                    userNotifactionObj.set("isRead", true);
                    userNotifactionObj.save();
                },
                error: function () {
                    // The object was not retrieved successfully.
                    // error is a Parse.Error with an error code and message.
                }
            });
        };
    });

    return NotificationView;
});