/*global define, jQuery, window, location, document*/

define(['Augment',
    'Instance',
    'GlobalData',
    'PubSub',
    'utils/LanguageUtils',
    'utils/CookieUtils',
    'utils/UploadProgressUtils',
    'views/share/ShareView',
    'views/messages/MessagesView',
    'views/errorMessage/ErrorMessage',
    'views/verification/VerificationView',
    'views/info/InfoView',
    'views/info/InfoViewMultiDevice',
    'views/info/InfoViewMultiContributor',
    'views/info/InfoViewMultiContributorReadOnly',
    'views/uploadProgress/UploadProgressView',
    'views/notification/NotificationView',
    'services/ContributionService',
    'services/DashboardService',
    'services/UserService',
    'services/ShareService',
    'services/PrintService',
    'hbs/underscore',
    'lockr',
    'hbs!views/dashboard/templates/DashboardView',
    'hbs!views/dashboard/templates/OwnMenuView',
    'hbs!views/dashboard/templates/SavedMenuView',
    'hbs!views/dashboard/templates/SharedMenuView'
], function (augment, instance, GlobalData, PubSub, LanguageUtils, CookieUtils, UploadProgressUtils, ShareView, MessagesView, ErrorMessage, VerificationView, InfoView, InfoViewMultiDevice, InfoViewMultiContributor, InfoViewMultiContributorReadOnly, UploadProgressView, NotificationView, ContributionService, DashboardService, UserService, ShareService, PrintService, _, Lockr, tplDashboardView, tplOwnMenuView, tplSavedMenuView, tplSharedMenuView) {
    'use strict';
    var DashboardView = augment(instance, function () {
        this.sampleStory = [];
        this.sharedStory = [];
        this.ownStory = [];
        this.userData = "";
        this.uploadProgress3DaysTimeoutCheck = "";
        var DashboardView = this;
        var uploaderView = '';
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        PubSub.subscribe('DASHBOARD_STORIES', function () {
            DashboardView.getDashboardData();
        });

        PubSub.subscribe('TRIGGER_DESIGN_MY_STORY', function (name, data) {
            //console.dir(data);
            GlobalData.multiDevice = {};
            GlobalData.multiDevice.orderId = data.id;
            GlobalData.multiDevice.transferred_image_count = data.actualImageTransferCount;
            DashboardView.designMyStory();
        });

        PubSub.subscribe('CHECK_IMAGE_STATUS', function () {
            DashboardView.checkImageStatus();
        });

        DashboardView.dashboardDataFilter = "";
        this.copy = function (source, deep) {
            var o, prop, type;
            if (typeof source !== 'object' || source === null) {
                // What do to with functions, throw an error?
                o = source;
                return o;
            }

            o = new source.constructor();
            for (prop in source) {

                if (source.hasOwnProperty(prop)) {
                    type = typeof source[prop];
                    if (deep && type === 'object' && source[prop] !== null) {
                        o[prop] = this.copy(source[prop]);
                    } else {
                        o[prop] = source[prop];
                    }
                }
            }
            return o;
        };

        this.init = function () {
            var dashView = this;
            jQuery('.home-icon').hide();
            jQuery(window).scrollTop(0);
            this.filterDataByYearWise();
            this.checkVerfication();
            this.addToDiv();

            var verificationView = VerificationView.create();
            verificationView.addToDiv();

            var editedStoryStatus = 0;
            var editedStoryStatusInner = 0;
            var updatingStoryStatus = 0;
            var checkUpdated = setInterval(function () {
                editedStoryStatus = 0;
                for (var h = 0; h < DashboardView.dashboardData.length; h++) {
                    if (DashboardView.dashboardData[h].order_status === '950' || DashboardView.dashboardData[h].order_status === '125') {
                        editedStoryStatus = 1;
                    }
                }
                if (editedStoryStatus) {
                    editedStoryStatusInner = 0;
                    for (var g = 0; g < DashboardView.dashboardData.length; g++) {
                        if (DashboardView.dashboardData[g].order_status === '950') {
                            editedStoryStatusInner = 1;
                        }
                    }
                    if (editedStoryStatusInner) {
                        updatingStoryStatus = 1;
                        DashboardView.checkDashboardData();
                    }
                } else {
                    clearInterval(checkUpdated);
                }
                if (updatingStoryStatus !== editedStoryStatus && GlobalData.photoStoryStatusMsg !== "DesignNow" && jQuery('.modal.fade.in').length == 0) {
                    console.log("This is called from interval!");
                    DashboardView.updateDashboardData();
                    clearInterval(checkUpdated);
                }
            }, 180000);
            //after 3 mins if it updated. story then n then only.


            //            if(jQuery('body').hasClass("modal-open")){
            //                jQuery('body').css('overflow','hidden');
            //            } else {
            //                 jQuery('body').css('overflow','scroll');
            //            }


            //            if(jQuery('body').hasClass("modal-open")){
            //                jQuery('body').css('overflow','hidden');
            //            } else {
            //                 jQuery('body').css('overflow','scroll');
            //            }
            jQuery(window).resize(function () {
                dashView.windowResize();
                dashView.shareMiddle();
                dashView.infoMiddle();
                dashView.messageMiddle();
                dashView.errorMiddle();
                dashView.verifyText();
            });
            jQuery(window).on('popstate', function () {
                jQuery('.modal').modal('hide');
            });
            var notificationView = NotificationView.create();
            notificationView.addToDiv();
            // request permission on page load
            //            document.addEventListener('DOMContentLoaded', function() {
            //                if (Notification.permission !== "granted")
            //                    Notification.requestPermission();
            //            });
            //            DashboardView.notifyMe();
            //            PubSub.unsubscribe('UPLOADING_STARTED_CHECK_DASHBOARD_PROCESS');
            //            PubSub.subscribe('UPLOADING_STARTED_CHECK_DASHBOARD_PROCESS', function () {
            //                var uploadProgressView = UploadProgressView.create();
            //                uploadProgressView.addToDiv();
            //                DashboardView.uploadProgress = setInterval(DashboardView.checkForDownloadInProgress, 10000); //after 10 seconds check calc(10*1000)
            //                DashboardView.uploadProgress3DaysTimeoutCheck = setInterval(DashboardView.uploadTimeoutCheck, 1800000);//after 30 mins check calc(30*60*1000)1800000
            //            });
            //            GlobalData.fileUploadData.onGoingUpload = 1;

            PubSub.unsubscribe('UPDATE_TRANSFER_IN_PROGRESS_STORY');
            PubSub.subscribe('UPDATE_TRANSFER_IN_PROGRESS_STORY', function () {
                DashboardView.updateDesignInProgressStory();
            });
            PubSub.unsubscribe('UPDATE_IMAGE_SET_INFO_PANEL_WITH_DASH');
            PubSub.subscribe('UPDATE_IMAGE_SET_INFO_PANEL_WITH_DASH', function () {
                DashboardView.updateImageSetInfoPanel();
            });
            PubSub.unsubscribe('DASH_UPDATE_SAVING_TILE');
            PubSub.subscribe('DASH_UPDATE_SAVING_TILE', function () {
                DashboardView.DashboardDataUpdated();
            });
            PubSub.unsubscribe('UPDATE_DASHBOARD_NO_CONDITION');
            PubSub.subscribe('UPDATE_DASHBOARD_NO_CONDITION', function () {
                DashboardView.updateDashboardData();
            });
            PubSub.unsubscribe('CONTRIBUTOR_FAIL_MESSAGES');
            PubSub.subscribe('CONTRIBUTOR_FAIL_MESSAGES', function (name, msg) {
                DashboardView.showContributorMessages(msg);
            });
            PubSub.unsubscribe('UPDATE_DASH_MD_MC');
            PubSub.subscribe('UPDATE_DASH_MD_MC', function () {
                DashboardView.updateOnImageTriggerFail();
            });

            if (GlobalData.fileUploadData.onGoingUpload === 1) {
                console.log('flagpoint 1');
                var uploadProgressView = UploadProgressView.create();
                uploadProgressView.addToDiv();

                DashboardView.uploadProgress = setInterval(DashboardView.checkForDownloadInProgress, 10000); //after 10 seconds check calc(10*1000)
                DashboardView.uploadProgress3DaysTimeoutCheck = setInterval(DashboardView.uploadTimeoutCheck, 1800000); //after 30 mins check calc(30*60*1000)1800000
                window.onbeforeunload = function () {
                    if (GlobalData.uploadType === 'singleUserSingleDeviceDesignMyStory') {
                        cancelPhotostory(GlobalData.baseUrlNew, GlobalData.fileUploadData.cancelUploadInputAPIData, CookieUtils.getCookie("sessionKey"));
                    } else {
                        ContributionService.cancelImageSetData(JSON.stringify(GlobalData.fileUploadData.cancelUploadInputAPIData));
                    }
                    return "Upload Terminated";
                };
                window.onunload = function () {
                    if (GlobalData.uploadType === 'singleUserSingleDeviceDesignMyStory') {
                        cancelPhotostory(GlobalData.baseUrlNew, GlobalData.fileUploadData.cancelUploadInputAPIData, CookieUtils.getCookie("sessionKey"));
                    } else {
                        ContributionService.cancelImageSetData(JSON.stringify(GlobalData.fileUploadData.cancelUploadInputAPIData));
                    }
                    return "Upload Terminated";
                };

            } else if (GlobalData.fileUploadData.onGoingUpload === 3) {
                DashboardView.updateDesignInProgressStory();
            }
        };

        this.getDashboardData = function () {
            if (GlobalData.fileUploadData.onGoingUpload !== 1) {
                var requestData = CookieUtils.getCookie("custId");
                console.log("getDashboardData");
                var promise = DashboardService.dashboardData(requestData);
                promise.then(function (data) {
                    DashboardView.dashboardData = data.arr_data;
                    DashboardView.init();
                });
            }
        };
        this.updateOnImageTriggerFail = function () {
            DashboardView.updateDashboardData();
            GlobalData.multiDevice = {};
            CookieUtils.delete_cookie('multidevice');
        };

        this.checkDashboardData = function () {
            if (GlobalData.fileUploadData.onGoingUpload !== 1) {
                if (document.location.hash === "#/dashboard") {
                    console.log("checkDashboardData");
                    var requestData = CookieUtils.getCookie("custId");
                    var promise = DashboardService.dashboardData(requestData);
                    promise.then(function (data) {
                        DashboardView.dashboardData = data.arr_data;
                    });
                }
            }
        };
        this.updateDashboardData = function () {
            if (GlobalData.fileUploadData.onGoingUpload !== 1) {
                if (document.location.hash === "#/dashboard") {
                    jQuery('body > .pageload').fadeIn();
                    var requestData = CookieUtils.getCookie("custId");
                    console.log("updateDashboardData");
                    var promise = DashboardService.dashboardData(requestData);
                    promise.then(function (data) {
                        if (location.hash === "#/dashboard") {
                            DashboardView.dashboardData = data.arr_data;
                            DashboardView.filterDataByYearWise();
                            DashboardView.addToDiv();
                            var notificationView = NotificationView.create();
                            notificationView.addToDiv();
                            jQuery('body > .pageload').fadeOut();
                        }
                    });
                }
            }
        };
        this.DashboardDataUpdated = function () {
            if (document.location.hash === "#/dashboard") {
                var requestData = CookieUtils.getCookie("custId");
                console.log("DashboardDataUpdated");
                var promise = DashboardService.dashboardData(requestData);
                promise.then(function (data) {
                    DashboardView.dashboardData = data.arr_data;
                    DashboardView.filterDataByYearWise();
                    DashboardView.addToDiv();
                    var notificationView = NotificationView.create();
                    notificationView.addToDiv();
                    if (GlobalData.fileUploadData.onGoingUpload === 1) {
                        if (GlobalData.storyUpdate !== undefined) {
                            if (GlobalData.storyUpdate === 'saveMore') {
                                if (GlobalData.belongsTo !== undefined) {
                                    if (GlobalData.belongsTo === 'contributor') {
                                        jQuery("#dash" + GlobalData.currentId + " .bottom-div-saving").show().text("Sending photos");
                                        jQuery("#dash" + GlobalData.currentId + " .selected-count").addClass("selected-count-saving").removeClass("selected-count").show();
                                    } else {
                                        jQuery("#dash" + GlobalData.currentId + " .bottom-div-saving").show().text("Saving photos");
                                        jQuery("#dash" + GlobalData.currentId + " .selected-count").addClass("selected-count-saving").removeClass("selected-count").show();
                                    }
                                } else {

                                    jQuery("#dash" + GlobalData.currentId + " .bottom-div-saving").show().text("Saving more photos");
                                    jQuery("#dash" + GlobalData.currentId + " .selected-count").addClass("selected-count-saving").removeClass("selected-count").show();
                                }
                            }
                        } else {
                            jQuery("#dash" + GlobalData.currentId + " .bottom-div-saving").show();
                            jQuery("#dash" + GlobalData.currentId + " .selected-count").hide();
                        }
                        jQuery("#dash" + GlobalData.currentId + " .addmorephotos-container").hide();
                        jQuery("#dash" + GlobalData.currentId + " .action-btn-container").hide();
                        jQuery("#dash" + GlobalData.currentId + " .pglogoDashboard").addClass('pglogoDashboard_saving').removeClass("pglogoDashboard");
                        jQuery("#dash" + GlobalData.currentId + " .story-name").addClass('story-name_saving').removeClass("story-name");
                    }
                });
            }
        };
        this.filterDataByYearWise = function (storyType) {
            var newStory = {
                story: 'new',
                copyUrl: 'assets/images/plus_start.jpg',
                StartANewPhotostory: 'Start a New Photostory',
                year: '',
                htmlUploaderUrl: GlobalData.baseUrlForHTMLUploader
            };
            for (var k = 0; k < DashboardView.dashboardData.length;) {
                if (DashboardView.dashboardData[k].order_status === '8888' || DashboardView.dashboardData[k].order_status === '1000' || DashboardView.dashboardData[k].order_status === '8001' || DashboardView.dashboardData[k].order_status === '8000' || DashboardView.dashboardData[k].order_status === '950' || DashboardView.dashboardData[k].order_status === '200' || DashboardView.dashboardData[k].order_status === '125' || DashboardView.dashboardData[k].order_status === '50') {
                    var token = DashboardView.dashboardData[k].token;
                    var encodedString, str;
                    if (token === "") {
                        str = DashboardView.dashboardData[k].pb_tracking_id;
                        encodedString = window.btoa(str);
                        DashboardView.dashboardData[k].flipbookLink = GlobalData.flipbookBaseURL + encodedString + '/0';
                    } else {
                        str = DashboardView.dashboardData[k].order_token;
                        encodedString = window.btoa(str);
                        DashboardView.dashboardData[k].flipbookLink = GlobalData.flipbookBaseURL + encodedString + '/1';
                    }
                    k++;
                } else {
                    DashboardView.dashboardData.splice(k, 1);
                }
            }
            DashboardView.dashboardDataFilter = DashboardView.copy(this.dashboardData);
            DashboardView.dashboardDataFilter.sort(function (a, b) {
                //                var c = new Date(a.order_event_date);
                var c = new Date(a.order_event_date.substr(0, 4), a.order_event_date.substr(5, 2), a.order_event_date.substr(8, 2), a.order_event_date.substr(11, 2), a.order_event_date.substr(14, 2), a.order_event_date.substr(17, 2));
                var d = new Date(b.order_event_date.substr(0, 4), b.order_event_date.substr(5, 2), b.order_event_date.substr(8, 2), b.order_event_date.substr(11, 2), b.order_event_date.substr(14, 2), b.order_event_date.substr(17, 2));
                return d - c;
            });
            this.sampleStory = [];
            if (storyType === 'own') {
                var orderStatusToConsider = ['1000', '950', '200', '125', '50'];
                for (var m = 0; m < DashboardView.dashboardDataFilter.length;) {
                    //if (DashboardView.dashboardDataFilter[m].order_status === '1000' || DashboardView.dashboardData[m].order_status === '950' || DashboardView.dashboardData[m].order_status === '200' || DashboardView.dashboardData[m].order_status === '125' || DashboardView.dashboardData[m].order_status === '50') {
                    if(jQuery.inArray(DashboardView.dashboardDataFilter[m].order_status, orderStatusToConsider) !== -1){
                        //console.log('if '+typeof(DashboardView.dashboardDataFilter[m].order_status),DashboardView.dashboardDataFilter[m].order_status);
                        m++;
                    } else {
                        //console.log('else '+typeof(DashboardView.dashboardDataFilter[m].order_status),DashboardView.dashboardDataFilter[m].order_status);
                        DashboardView.dashboardDataFilter.splice(m, 1);
                    }
                }
            }
            if (storyType === 'shared') {
                for (var shareCounter = 0; shareCounter < DashboardView.dashboardDataFilter.length;) {
                    if (DashboardView.dashboardDataFilter[shareCounter].order_status === '8000' || DashboardView.dashboardDataFilter[shareCounter].order_status === '8001') {
                        shareCounter++;
                    } else {
                        DashboardView.dashboardDataFilter.splice(shareCounter, 1);
                    }
                }
            }

            for (var l = 0; l < DashboardView.dashboardDataFilter.length;) {
                if (DashboardView.dashboardDataFilter[l].order_status === '8888') {
                    this.sampleStory.push(DashboardView.dashboardDataFilter[l]);
                    DashboardView.dashboardDataFilter.splice(l, 1);
                } else {
                    //                    var eventDate = new Date(DashboardView.dashboardDataFilter[l].order_event_date);
                    //                    var eventYear = eventDate.getFullYear();
                    var eventYear = DashboardView.dashboardDataFilter[l].order_event_date.split('-');
                    DashboardView.dashboardDataFilter[l].year = eventYear[0];
                    l++;
                }
            }
            var data = [
                []
            ];
            if (DashboardView.dashboardDataFilter.length === 0) {
                var d = new Date();
                var currentYear = d.getFullYear();
                newStory.year = currentYear;
            } else {
                newStory.year = DashboardView.dashboardDataFilter[0].year;
            }
            DashboardView.dashboardDataFilter.unshift(newStory);
            var copyCounter = 0;
            for (var i = 0; i < DashboardView.dashboardDataFilter.length;) {
                var flag = 0;
                for (var j = 1; j < DashboardView.dashboardDataFilter.length;) {

                    if (DashboardView.dashboardDataFilter[i].year === DashboardView.dashboardDataFilter[j].year) {
                        flag = 1;
                        if (data[copyCounter] === undefined) {
                            data[copyCounter] = [];
                        } else {
                            DashboardView.dashboardDataFilter[i].year = "";
                            data[copyCounter].push(DashboardView.dashboardDataFilter[i]);
                            DashboardView.dashboardDataFilter.splice(i, 1);
                        }
                    } else {
                        j++;
                    }
                }
                if (data[copyCounter] === undefined) {
                    data[copyCounter] = [];
                }
                data[copyCounter].push(DashboardView.dashboardDataFilter[i]);
                DashboardView.dashboardDataFilter.splice(i, 1);
                copyCounter++;
            }
            DashboardView.dashboardDataFilter = data;
            for (var filterCounter = 0; filterCounter < DashboardView.dashboardDataFilter.length; filterCounter++) {
                for (var p = 0; p < DashboardView.dashboardDataFilter[filterCounter].length; p++) {
                    if (filterCounter === 0) {
                        if (p % 2 === 1) {
                            DashboardView.dashboardDataFilter[filterCounter][p].numberType = "oddStory";
                        } else {
                            DashboardView.dashboardDataFilter[filterCounter][p].numberType = "evenStory";
                        }
                    } else {
                        if (p % 2 === 1) {
                            DashboardView.dashboardDataFilter[filterCounter][p].numberType = "evenStory";
                        } else {
                            DashboardView.dashboardDataFilter[filterCounter][p].numberType = "oddStory";
                        }
                    }
                }
            }

        };
        this.addToDiv = function (storyType) {

            if (document.location.hash === "#/dashboard") {
                var divId = "dashbaordUIView";
                //            myvar = dashboardView.dashboardData;
                jQuery('#dashbaordUIView').show();
                if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/Android/i))) {
                    jQuery('#dashbaordUIView').css('padding-top', '0px');
                    jQuery('#MainViewDiv.main-content').css('padding-top', '0px');
                } else {
                    //                jQuery('#dashbaordUIView').css('padding-top', '55px');

                    jQuery('#upload_progress').css({
                        'margin': '0px auto 0px'
                    });
                    jQuery('#upload_progress').css({
                        'padding': '4px 5px'
                    });
                }


                if (storyType === 'ALL_STORIES') {
                    this.ownStory = [];
                }

                var innerHtml = tplDashboardView({
                    VerifyAccountHeader: LanguageUtils.valueForKey("VerifyAccountHeader"),
                    Resend: LanguageUtils.valueForKey("Resend"),
                    Ok: LanguageUtils.valueForKey("Ok"),
                    NewPhotostory: LanguageUtils.valueForKey("NewPhotostory"),
                    StartANewPhotostory: LanguageUtils.valueForKey("StartANewPhotostory"),
                    allStory: this.dashboardDataFilter,
                    sampleStory: this.sampleStory,
                    ownStory: this.ownStory,
                    sharedStory: this.sharedStory,
                    starNewStory: GlobalData.baseUrlForHTMLUploader,
                    custId: CookieUtils.getCookie("custId"),
                    searchFoundLength: DashboardView.matchFoundLength,
                    searchData: DashboardView.searchData,
                    imageBase: GlobalData.imageBase
                });
                jQuery('#' + divId).empty();
                jQuery('#' + divId).html(innerHtml);
                if (jQuery(".cover-image").length > 0) {

                    if(GlobalData.mobileDevice){
                        if (jQuery(".action-btn-container").length > 0) {
                            jQuery(".coverNew").css({'height':'126px'});
                        }
                        if (jQuery(".daysText").length > 0) {
                            jQuery(".coverNew").css({'height':'126px'});
                        }
                    }

                    if(!GlobalData.mobileDevice){
                        setTimeout(function () {
                            if (jQuery(".action-btn-container").length > 0) {
                                jQuery(".coverNew").css({'height':'200px'});
                            }
                            if (jQuery(".daysText").length > 0) {
                                jQuery(".coverNew").css({'height':'200px'});
                            }
                        }, 100);

                        jQuery('#MainViewDiv').css('padding', '55px 0px 0px 0px');
                    }

                    jQuery('#upload_progress').hide();
                }


                jQuery('#NavBarDiv').show();

                if (GlobalData.myStoriesFromProfile === 1) {
                    GlobalData.myStoriesFromProfile = 0;
                    DashboardView.showOwnPhotoStory();
                }
                //
                //            if ((parseInt(CookieUtils.getCookie("is_verified")) === 1)||(parseInt(CookieUtils.getCookie("verify")) === 1)) {
                //                jQuery('#verfiyAccount').hide();
                //            } else {
                //                jQuery('#verfiyAccount').show();
                //
                //            }           
                this.preloader();



            }
        };

        this.validateOrderDetails = function () {
            var title = '';
            title = jQuery.trim(jQuery("#title").val());
            var subtitle = jQuery("#subtitle").val();
            var specialInstruction = jQuery("#specialInstruction").val();
            var hasError = false;
            if (title.length <= 0) {
                hasError = true;
                jQuery("#createOrder").addClass('disabled_btn');
            } else {
                jQuery("#createOrder").removeClass('disabled_btn');
            }

            var data = null;
            data = {
                "order_id": GlobalData.multiDevice.id,
                "cover_caption": title,
                "rib_caption": subtitle,
                "special_instruction": specialInstruction,
                "image_set_source": ""
            };
            return data;
        };

        this.showFilteredData = function (searchData) {
            if (searchData === "") {
                this.showAllPhotoStory();
                jQuery("#searchMessage").hide();
            } else {
                this.filterDataByYearWise();
                DashboardView.dashboardDataFilter = [
                    []
                ];
                var flag = 0;
                for (var i = 0; i < DashboardView.dashboardData.length; i++) {
                    var patt = new RegExp(searchData, 'i');
                    var stringContainer = DashboardView.dashboardData[i].cover_caption;
                    var res = patt.test(stringContainer);
                    if (DashboardView.dashboardData[i].order_status === '8000' || DashboardView.dashboardData[i].order_status === '8001' || DashboardView.dashboardData[i].order_status === '1000') {
                        if (res) {
                            flag = 1;
                            DashboardView.dashboardDataFilter[0].push(DashboardView.dashboardData[i]);
                        }
                    }
                }
                jQuery("#searchMessage").show();
                if (flag === 0) {
                    DashboardView.matchFoundLength = 'No result found for "' + searchData + '"';
                } else {
                    DashboardView.searchData = searchData;
                    DashboardView.matchFoundLength = (DashboardView.dashboardDataFilter[0].length) + " results found for ";
                }

                this.sampleStory = [];
                this.addToDiv();
                jQuery('.hrContainer').hide();
                jQuery('.closeResult').show();
                jQuery('.create-story').hide();
            }

        };

        this.showAllPhotoStory = function () {
            jQuery('.closeResult').hide();

            DashboardView.matchFoundLength = "";
            DashboardView.searchData = "";
            DashboardView.filterDataByYearWise();
            DashboardView.addToDiv();
            jQuery('#notification').hide();
            var notificationView = NotificationView.create();
            notificationView.addToDiv();
        };

        this.showOwnPhotoStory = function () {
            this.filterDataByYearWise('own');
            
            if (DashboardView.dashboardDataFilter.length > 0) {
                this.sampleStory = [];
                this.addToDiv();
            } else {

            }

        };
        this.showSharedPhotoStory = function () {
            this.filterDataByYearWise('shared');
            for (var i = 0; i < DashboardView.dashboardDataFilter.length; i++) {
                for (var j = 0; j < DashboardView.dashboardDataFilter[i].length;) {
                    if (DashboardView.dashboardDataFilter[i][j].order_status === '1000' || DashboardView.dashboardDataFilter[i][j].order_status === '950') {
                        DashboardView.dashboardDataFilter[i].splice(j, 1);
                    } else {
                        j++;
                    }
                }
            }
            //          Currently, you haven't placed any order.
            //            'No shared Photostories available.'
            this.sampleStory = [];
            this.addToDiv();
        };

        this.getOrderDetailsByOrderId = function (orderId) {
            var data;
            for (var i = 0; i < DashboardView.dashboardData.length; i++) {
                if (DashboardView.dashboardData[i].id === orderId) {
                    data = DashboardView.dashboardData[i];
                    break;
                }
            }
            return data;
        };

        this.loadActions = function () {
            //console.dir(this);
            //console.dir(DashboardView.menuData);
            jQuery('.initiateShare').click(DashboardView.initiateShareModal);
            jQuery('.initiatePrint').click(DashboardView.checkPrintServiceAvailable);
            jQuery('.initiateInfo').click(DashboardView.initiateInfoModal);
            jQuery('.initiateDesign').click(DashboardView.checkImageStatus);
            jQuery('.initiateDelete').click(DashboardView.initiateDelete);// for shared stories and own stories[not in 50 order_status]
            jQuery('.initiateDeleteForSavedStory').click(DashboardView.initiateDeleteForSavedStory);// for orders which are in 50 status
            jQuery('.initiateEditStory').click(DashboardView.initiateEditStory);// open story in ZULU
            jQuery('.initiateSaveStory').click(DashboardView.initiateSaveStory);// Download story to local system
            jQuery('.initiateDateUpdation, .initiateDateUpdation input[type="text"]').click(DashboardView.initiateDateUpdation);// update story date
            DashboardView.calenderSelect();
            jQuery('.initiateCopyLink').click(DashboardView.initiateCopyLink);
            
        };

        this.preloader = function () {
            // if (jQuery(window).width() <= 1024) {
            //     jQuery('.main-panel > .main-content').css({
            //         'padding': '0',
            //         'padding-top': '55px'
            //     });
            // }
            var dashboardView = this;
            var checkStatusVerify = '';
            var messagesView = MessagesView.create();
            messagesView.addToDiv();
            dashboardView.messageMiddle();



            jQuery('body').addClass('page-loaded').removeClass('page-loading');
            jQuery('body > .pageload').fadeOut();
            checkStatusVerify = setInterval(function () {
                var verifyNumber = parseInt(CookieUtils.getCookie("is_verified"));
                if (verifyNumber) {
                    jQuery('.yellowVerify').hide();
                    clearInterval(checkStatusVerify);
                }
            }, 60000);

            PubSub.subscribe('CHECK_USERID', function () {
                var tempOldID = CookieUtils.getCookie("custId");
                GlobalData.checkStatus = setInterval(function () {
                    if (tempOldID !== CookieUtils.getCookie("custId")) {
                        clearInterval(GlobalData.checkStatus);
                        document.location.reload();
                    }
                }, 60000);
            });
            PubSub.publish('CHECK_USERID');
            var dashboardCount = (jQuery(".same-height-cards").children().length) - 1;
            if (jQuery(window).width() < 767) {
                if ((dashboardCount % 2) === 0) {
                    jQuery('.dash-sample-card:even').css("padding-left", "0");
                    jQuery('.dash-sample-card:odd').css("padding-right", "0");

                } else {
                    jQuery('.dash-sample-card:even').css("padding-left", "0");
                    jQuery('.dash-sample-card:odd').css("padding-right", "0");
                }
            }
            DashboardView.verifyText();

            jQuery("#verfiyAccount").click(function () {
                if (jQuery(window).width() < 768) {
                    DashboardView.showVerifyPopup();
                }
            });

            //--snippet related to design my story btn click
            jQuery('.triggerDesignStory').click(dashboardView.checkImageStatus);
            jQuery(document).on('click', '.popup-modal-dismiss', function (e) {
                e.preventDefault();
                jQuery.magnificPopup.close();
                //jQuery(".modal").modal('hide'); //if called from info panel > designMyStory btn
            });



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

            var orderSubmitFunc = function () {
                var data = DashboardView.validateOrderDetails();
                if (data === null || jQuery("#createOrder").hasClass('disabled_btn')) {
                    return;
                }
                var sessionToken = CookieUtils.getCookie("sessionKey");
                jQuery.magnificPopup.close();
                delete data.image_set_source;
                data = JSON.stringify(data);
                createOrder(GlobalData.baseUrlNew, data, 'PUT', function orderSuccess(orderId, imageSetIdList) {
                    GlobalData.multiDevice = {};
                    jQuery.magnificPopup.close();
                    dashboardView.updateDesignInProgressStory();
                }, sessionToken);
            };

            jQuery("#createOrder").on('click keypress', function orderSubmit(event) {
                GlobalData.ec.recordClickEvent('Story_origin', 'CreateOrderButtonClicked');
                event.stopPropagation();
                jQuery('body > .pageload').fadeIn();
                orderSubmitFunc();
            });

            //--snippet related to design my story btn click
            jQuery('.closeResult').click(dashboardView.showAllPhotoStory);
            //jQuery('.shareButton').click(dashboardView.shareScreenShow);
            jQuery('.printButton').click(dashboardView.printScreenShow);

            if (CookieUtils.getCookie('printFromPreview')) {
                DashboardView.printScreenShow();
            }
            if (CookieUtils.getCookie('shareFromPreview')) {
                dashboardView.shareScreenShow();
            }

            jQuery('.infoButtonOwn').click(dashboardView.infoOwnStoryScreenShow);
            jQuery('.infoButtonShared').click(dashboardView.infoSharedStoryScreenShow);
            jQuery('#verify_code').unbind().click(dashboardView.errorShow);
            jQuery('.verifyMerge').click(dashboardView.verifyMerge);
            //jQuery('.create-story > a').click(dashboardView.downloadApp);
            jQuery('.dash-card > .card > a').click(function (event) {
                event.preventDefault();
                if (((parseInt(CookieUtils.getCookie('is_verified'))) === 1) || ((parseInt(CookieUtils.getCookie('verify'))) === 1)) {
                    var link = jQuery(this).attr("href");
                    dashboardView.cardMessage(link);
                } else {
                    DashboardView.showVerifyPopup();
                }
            });
            jQuery('#resend_btn').click(dashboardView.resendSmsOrEmail);

            jQuery('.uploaderLink').click(function (event) {
                event.stopPropagation();
                if (GlobalData.mobileDevice) {
                    jQuery('#plusIcon').removeAttr("href");
                    setTimeout(function () {
                        dashboardView.downloadApp();
                    }, 1000);
                } else if (GlobalData.fileUploadData.onGoingUpload === 1) {
                    var messagesView = MessagesView.create();
                    messagesView.addToDiv();
                    messagesView.messageMiddle();
                    jQuery('.ongoing-uploader-message').modal('show');
                } else if (!parseInt(CookieUtils.getCookie('is_verified'))) {
                    DashboardView.showVerifyPopup();
                } else {
                    CookieUtils.delete_cookie(('multidevice'));
                    delete GlobalData.multiDevice;
                    GlobalData.fileUploadData = {};
                    location.hash = '/uploader';
                }
            });
            jQuery('.uploaderUpdateLink').click(function (event) {
                event.stopPropagation();

                GlobalData.ec.recordClickEvent('Dashboard_view', 'AddPhotosButtonClicked');

                var udpateLinkEle = jQuery(this);
                if (GlobalData.mobileDevice) {
                    jQuery('#plusIcon').removeAttr("href");
                    setTimeout(function () {
                        dashboardView.downloadApp();
                    }, 1000);
                } else if (GlobalData.fileUploadData.onGoingUpload === 1) {
                    var messagesView = MessagesView.create();
                    messagesView.addToDiv();
                    messagesView.messageMiddle();
                    jQuery('.ongoing-uploader-message').modal('show');
                } else if (!parseInt(CookieUtils.getCookie('is_verified'))) {
                    DashboardView.showVerifyPopup();
                } else {
                    if (jQuery(this).hasClass('disabledAddPhotosBtn')) {} else {
                        jQuery('body').addClass('page-loaded');
                        jQuery('body > .pageload').fadeIn();
                        GlobalData.fileUploadData = {};
                        GlobalData.multiDevice = {};
                        GlobalData.multiDevice.addMorePhotos = 1;
                        GlobalData.multiDevice.orderId = this.id;
                        GlobalData.multiDevice.DesignRequestType = 1;
                        GlobalData.multiDevice.title = $(this).data('title');
                        //GlobalData.multiDevice.previousCount = $(this).data('count');
                        GlobalData.multiDevice.previousCount = 0;
                        GlobalData.multiDevice.design_request_type_name = $(this).data('type');
                        GlobalData.multiDevice.belongsTo = $(this).data('belongsto');
                        GlobalData.multiDevice.storyOwnerName = $(this).data('story-owner-name');
                        GlobalData.multiDevice.copyLink = $(this).data('copy-link');

                        var requestData = {
                            order_id: this.id
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
                                    CookieUtils.setCookie("multidevice", multiDevice, GlobalData.expireDays);
                                    jQuery('#InfoModal').modal('hide');
                                    if (obj1.arr_data.order_status === "50" && GlobalData.multiDevice.previousCount < 2000 && udpateLinkEle.hasClass('MCMD') || obj1.arr_data.order_status === "50" && GlobalData.multiDevice.previousCount < 1000 && udpateLinkEle.hasClass('SCMD')) {
                                        location.hash = '/uploader';
                                    } else {
                                        if (GlobalData.multiDevice.previousCount >= 1000) {
                                            var messagesView = MessagesView.create();
                                            messagesView.addToDiv();
                                            jQuery('.alertLimitCrossed').modal('show');
                                            jQuery('#displayTextLimit').text('No more photos can be added to the story.');
                                            DashboardView.messageMiddle();
                                            jQuery('.pageload').hide();
                                        } else {
                                            DashboardView.updateOnImageTriggerFail();
                                        }
                                    }

                                } else {
                                    console.log('API response is null');
                                }
                            });
                    }
                }
            });

            var verifyLink = parseInt(CookieUtils.getCookie("verifyByLink"));
            if (verifyLink === 1) {
                DashboardView.verifySuccess();
            }
            if ((parseInt(CookieUtils.getCookie("verrifyuserDeep")) === 1)) {
                DashboardView.verifyuserBylink();
            }
            var personalizedExistingUser = parseInt(CookieUtils.getCookie("personalizedExistingUserDeep"));
            if (personalizedExistingUser === 1) {
                DashboardView.existingPeronalizedUser();
            }
            if (CookieUtils.getCookie("personalizedNewUserDeep")) {
                DashboardView.newPeronalizedUser();
            }
            if (CookieUtils.getCookie("publicLogged")) {
                DashboardView.publicStoryUserLoggedIn();
            }
            if (jQuery(window).width() < 767) {
                jQuery('#notification,#upload_progress').removeClass("container");
            }
            var ownStoryCheck = parseInt(CookieUtils.getCookie("ownStoryDeep"));
            var ownStoryTrackingDeepCheck = CookieUtils.getCookie("ownStoryTrackingDeep");
            //console.log("tracking id - " + ownStoryTrackingDeepCheck);
            //console.log("----");
            //console.debug("tracking id - " + ownStoryTrackingDeepCheck);
            if (ownStoryCheck === 1) {
                //if (ownStoryCheck === 1 || ownStoryTrackingDeepCheck !== "" || ownStoryTrackingDeepCheck !== null) {
                DashboardView.ownStoryReady();
            }

            jQuery('.bg-danger .cover-image.updatingStory').css({
                'height': 'auto'
            });
            jQuery('.updatingStory').parent().css({
                "background": "#fff"
            });
            if (jQuery(window).width() < 1500) {
                jQuery('#notification, .same-height-cards,#upload_progress').removeClass("container");
            } else {
                jQuery('#notification, .same-height-cards,#upload_progress').addClass("container");
            }
            jQuery('.bg-danger a').click(function () {
                GlobalData.ec.recordClickEvent('Dashboard_view', 'PhotoStoryClicked');
            });
            jQuery('.actionMenuBtn').click(dashboardView.renderMenuLayout);
            DashboardView.windowResize();

        };

        this.renderMenuLayout = function (event) {
            event.stopPropagation();
            //console.log("add google click event for menu click or uncommnet");
            // GlobalData.ec.recordClickEvent('Dashboard_view', 'MenuButtonClicked'); 
            DashboardView.menuData = null;           
            var orderId = this.id;
            if (((parseInt(CookieUtils.getCookie('is_verified'))) === 1) || ((parseInt(CookieUtils.getCookie('verify'))) === 1)) {
                var shareView = ShareView.create();
                for (var i = 0; i < DashboardView.dashboardData.length; i++) {
                    if (DashboardView.dashboardData[i].id === orderId) {
                        DashboardView.menuData = DashboardView.dashboardData[i];
                        break;
                    }
                }
                console.dir(DashboardView.menuData);

                this.orderStatus = DashboardView.menuData.order_status;
                var innerHtml = null;
                jQuery('#menuLayoutContainer').empty();
                
                var deskTopMargin = null;
                deskTopMargin = ((jQuery(window).height()) - (475)) / 2;
                var deskWidth = 475;
                
                //var androidTopMargin = null;
                //androidTopMargin = ((jQuery(window).height()) - (390)) / 2;
                var androidWidth = 390;

                switch (this.orderStatus) {
                    //own story
                    case "1000":
                        DashboardView.menuData.orderDate = DashboardView.convertDate(DashboardView.menuData.order_event_date);
                        innerHtml = tplOwnMenuView(DashboardView.menuData);
                        jQuery('#menuLayoutContainer').append(innerHtml);
                        jQuery('#OwnMenuViewModal').modal('show');
                        //console.dir('GlobalData.mobileDeviceIsIOS'+GlobalData.mobileDeviceIsIOS);
                        if (GlobalData.mobileDevice) {
                            jQuery('#OwnMenuViewModal .modal-dialog').addClass('fullscreenMenuModal');
                            jQuery('.menuStyle .modal-content').css('border-radius', '0px');

                        }
                        if(GlobalData.mobileDeviceIsIOS){
                            jQuery('#OwnMenuViewModal > .modal-dialog').css('width', androidWidth + "px");
                            jQuery('#OwnMenuViewModal > .modal-dialog > .modal-content').css({"width" : androidWidth + "px"});
                        }
                        if(GlobalData.mobileDeviceIsAndroid){
                            jQuery('#OwnMenuViewModal > .modal-dialog').css('width', androidWidth + "px");
                            jQuery('#OwnMenuViewModal > .modal-dialog > .modal-content').css({"width" : androidWidth + "px"});
                        }
                        if(!GlobalData.mobileDevice){
                            jQuery('#OwnMenuViewModal > .modal-dialog').css('width', deskWidth + "px");
                            jQuery('#OwnMenuViewModal > .modal-dialog > .modal-content').css({"width" : deskWidth + "px", "margin-top" : deskTopMargin});
                        }
                        
                        break;
                        //shared
                    case "8001":
                        innerHtml = tplSharedMenuView(DashboardView.menuData);
                        jQuery('#menuLayoutContainer').append(innerHtml);
                        jQuery('#SharedMenuViewModal').modal('show');
                        if (GlobalData.mobileDevice) {
                            jQuery('#SharedMenuViewModal .modal-dialog').addClass('fullscreenMenuModal');
                            jQuery('.menuStyle .modal-content').css('border-radius', '0px');
                        }
                        
                        jQuery('#SharedMenuViewModal > .modal-dialog').css('width', deskWidth + "px");
                        jQuery('#SharedMenuViewModal > .modal-dialog > .modal-content').css({"width" : deskWidth + "px", "margin-top" : deskTopMargin});
                        break;
                        //saved (multidevice & multicontributor)
                    case "50":
                        innerHtml = tplSavedMenuView(DashboardView.menuData);
                        jQuery('#menuLayoutContainer').append(innerHtml);
                        jQuery('#SavedMenuViewModal').modal('show');
                        if (GlobalData.mobileDevice) {
                            jQuery('#SavedMenuViewModal .modal-dialog').addClass('fullscreenMenuModal');
                            jQuery('.menuStyle .modal-content').css('border-radius', '0px');
                        }
                        
                        jQuery('#SavedMenuViewModal > .modal-dialog').css('width', deskWidth + "px");
                        jQuery('#SavedMenuViewModal > .modal-dialog > .modal-content').css({"width" : deskWidth + "px", "margin-top" : deskTopMargin});
                        break;
                }

                DashboardView.loadActions();
            } else {
                DashboardView.showVerifyPopup();
            }


        };


        this.verifyText = function () {
            if (jQuery(window).width() < 768) {
                jQuery(".yellowVerify label").text("Please verify your account!");
            } else {
                jQuery(".yellowVerify label").text("Verify account - Click on the link sent in email or");
            }
        };
        this.publicStoryUserLoggedIn = function () {
            //            var requestData = {
            //                userid: CookieUtils.getCookie("custId")
            //            };
            //            var promise = DashboardService.tokenStatus(requestData);
            //            promise.then(function(data) {
            //                var verifyStatus = parseInt(data.arr_data.verified);
            //                if ((verifyStatus === 1)) {
            //                    DashboardView.redirectToDashboard();
            //                    CookieUtils.delete_cookie('publicLogged');
            //                    var str = CookieUtils.getCookie("publicLogged_comm_token");
            //                    CookieUtils.setCookie("is_verified", 1, GlobalData.expireDays);
            //                    var encodedString = window.btoa(str);
            //                    window.location.href = GlobalData.flipbookBaseURL + encodedString;
            //                }
            //                else {
            //                    CookieUtils.setCookie("publicShareVerfication", 1, GlobalData.expireDays);
            //                    DashboardView.showVerifyPopup();
            //                }
            //            }).fail(function() {
            //
            //            });
            CookieUtils.delete_cookie('publicLogged');
            var str = CookieUtils.getCookie("publicLogged_comm_token");
            var encodedString = window.btoa(str);
            window.location.href = GlobalData.flipbookBaseURL + encodedString;
        };
        this.showVerifyPopup = function () {

            jQuery('#verifyModal').modal('show');

        };
        this.verifySuccess = function () {
            if (CookieUtils.getCookie("verifyalreadyDeep")) {
                DashboardView.showVerifyAlreadyPopup();
            } else {
                DashboardView.showVerifySuccessPopup();

            }
        };
        this.verifyuserBylink = function () {
            var requestData = {
                "user_id": CookieUtils.getCookie("custIdDeep"),
                "account_id": CookieUtils.getCookie("accountIdDeep"),
                "token": CookieUtils.getCookie("authTokenDeep")
            };
            var promise = UserService.verifyAccountByUserId(requestData);
            promise.then(function (data) {
                CookieUtils.delete_cookie("verrifyuserDeep");
                jQuery(".yellowVerify").hide();
                if (data.int_status_code === 0) {} else {
                    if (data.str_status_message === "Your account has already been verified") {
                        CookieUtils.setCookie('is_verified', 1, GlobalData.expireDays);
                        DashboardView.showVerifyAlreadyPopup();
                    } else {
                        CookieUtils.setCookie('is_verified', 1, GlobalData.expireDays);
                        DashboardView.showVerifySuccessPopup();
                    }

                }
            }).fail(function () {

            });
        };

        this.existingPeronalizedUser = function () {
            var verifyCount = parseInt(CookieUtils.getCookie('is_verified'));
            if ((verifyCount === 1)) {
                jQuery('#verfiyAccount').hide();
                CookieUtils.delete_cookie("personalizedExistingUserDeep");
                var token = CookieUtils.getCookie("share_tokenDeep");
                DashboardView.redirectToDashboard();
                var str = token;
                var encodedString = window.btoa(str);
                window.location.href = GlobalData.flipbookBaseURL + encodedString;
            } else {
                var requestData = CookieUtils.getCookie("custId");
                var promise = DashboardService.tokenStatus(requestData);
                promise.then(function (data) {
                    var verifyStatus = parseInt(data.arr_data.verified);
                    if ((verifyStatus === 1) || (verifyCount === 1)) {
                        jQuery('#verfiyAccount').hide();
                        CookieUtils.setCookie("is_verified", 1, GlobalData.expireDays);
                        CookieUtils.delete_cookie("personalizedExistingUserDeep");
                        var token = CookieUtils.getCookie("share_tokenDeep");
                        DashboardView.redirectToDashboard();
                        var str = token;
                        var encodedString = window.btoa(str);
                        window.location.href = GlobalData.flipbookBaseURL + encodedString;
                    } else {
                        var requestData = {
                            "user_id": CookieUtils.getCookie("custId"),
                            "account_id": CookieUtils.getCookie("accountIdDeepShare"),
                            "token": CookieUtils.getCookie("authTokenDeepShare")
                        };
                        var promise = UserService.verifyAccountByUserId(requestData);
                        promise.then(function (data) {
                            if (data.int_status_code === 0) {

                            } else {
                                jQuery('.yellowVerify').hide();
                                CookieUtils.setCookie("is_verified", 1, GlobalData.expireDays);
                                DashboardView.showVerifySuccessPopup();
                                if (CookieUtils.getCookie("personalizedExistingUserDeep")) {
                                    CookieUtils.delete_cookie("personalizedExistingUserDeep");
                                    CookieUtils.delete_cookie('verifyByLink');
                                    jQuery('#messageModal.errorMessageModal button').click(function () {
                                        jQuery('.modal').hide();
                                        CookieUtils.delete_cookie('verifyByLink');
                                        CookieUtils.delete_cookie('accountIdDeepShare');
                                        CookieUtils.delete_cookie('authTokenDeepShare');
                                        var token = CookieUtils.getCookie("share_tokenDeep");
                                        CookieUtils.delete_cookie('verifyByLink');
                                        var str = token;
                                        var encodedString = window.btoa(str);
                                        window.location.href = GlobalData.flipbookBaseURL + encodedString;
                                    });
                                }
                            }
                        }).fail(function () {

                        });
                    }

                }).fail(function () {

                });
            }
        };
        this.newPeronalizedUser = function () {
            var verifyCount = parseInt(CookieUtils.getCookie('is_verified'));
            if ((verifyCount !== 1)) {
                DashboardView.showVerifyPopup();
            }

        };
        this.ownStoryReady = function () {
            var storyToken = CookieUtils.getCookie("ownStoryTrackingDeep");
            DashboardView.redirectToDashboard();
            //            setTimeout(function() {
            var str = storyToken;
            var encodedString = window.btoa(str);
            window.location.href = GlobalData.flipbookBaseURL + encodedString + '/0';
            CookieUtils.delete_cookie("ownStoryDeep");
            CookieUtils.delete_cookie("ownStoryTrackingDeep");
            //            }, 5000);
        };
        this.showVerifySuccessPopup = function () {
            console.log(CookieUtils);
            var verifySuccess = parseInt(CookieUtils.getCookie('is_verified'));
            if (verifySuccess === 1) {
                var errorMessage = ErrorMessage.create();
                errorMessage.addToDiv();
                jQuery('#messageModal.errorMessageModal').modal('show');
                DashboardView.errorMiddle();
                jQuery('#messageModal.errorMessageModal p').text('Your account is verified succesfully!');
                console.log('location 1');
                jQuery(document).on('click', '.errorMessageModalClose', function (event) {
                    event.stopPropagation();
                    console.log('ok btn clicked location showVerifySuccessPopup');
                    CookieUtils.delete_cookie("custIdDeep");
                    CookieUtils.delete_cookie("accountIdDeep");
                    CookieUtils.delete_cookie("usernameDeep");
                    CookieUtils.delete_cookie("authTokenDeep");
                    CookieUtils.delete_cookie('verifyByLink');
                    location.hash = "/dashboard";
                    document.location.reload();
                });
            }

        };
        this.showVerifyAlreadyPopup = function () {
            var errorMessage = ErrorMessage.create();
            errorMessage.addToDiv();
            jQuery('#messageModal.errorMessageModal').modal('hide');
            jQuery('#messageModal.errorMessageModal').modal('show');
            DashboardView.errorMiddle();
            jQuery('#messageModal.errorMessageModal p').text('Your account has already been verified');
            jQuery(document).on('click', '.errorMessageModalClose', function (event) {
                event.stopPropagation();
                console.log('ok btn clicked location showVerifyAlreadyPopup');
                CookieUtils.delete_cookie("custIdDeep");
                CookieUtils.delete_cookie("accountIdDeep");
                CookieUtils.delete_cookie("usernameDeep");
                CookieUtils.delete_cookie("authTokenDeep");
                CookieUtils.delete_cookie("verifyalreadyDeep");
                CookieUtils.delete_cookie('verifyByLink');
                location.hash = "/dashboard";
                document.location.reload();
            });

        };
        this.redirectToDashboard = function () {
            var stateObj = {
                foo: GlobalData.dashboardUrl
            };
            history.pushState(stateObj, "page 2", GlobalData.dashboardUrl);
        };
        this.resendSmsOrEmail = function () {
            GlobalData.ec.recordClickEvent('Dashboard_view', 'DashboardResendVerficationCodeButtonClicked');
            jQuery('body').addClass('page-loaded');
            jQuery('body > .pageload').fadeIn();
            var requestData = "";
            var promise = "";
            var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            //console.dir(DashboardView.userData);
            if (filter.test(CookieUtils.getCookie("custEmail"))) {
                requestData = {
                    userid: CookieUtils.getCookie("custId"),
                    "emailtype": 1,
                    "email": CookieUtils.getCookie("custEmail")
                };
                promise = DashboardService.resendverficationEmail(requestData);
            } else {
                requestData = {
                    userid: CookieUtils.getCookie("custId"),
                    mobiletype: "2",
                    mobile: CookieUtils.getCookie("mobile_number")
                };
                promise = DashboardService.resendVerificationSms(requestData);
            }
            promise.then(function () {
                //console.dir(requestData);
                jQuery('body').addClass('page-loaded').removeClass('page-loading');
                jQuery('body > .pageload').fadeOut();
                var errorMessage = ErrorMessage.create();
                errorMessage.addToDiv();
                jQuery('#messageModal.errorMessageModal').modal('show');
                DashboardView.errorMiddle();
                if (requestData.emailtype) {
                    jQuery('#messageModal.errorMessageModal p').text(LanguageUtils.valueForKey("accountVerificationEmail") + requestData.email + ".");
                } else {
                    jQuery('#messageModal.errorMessageModal p').text(LanguageUtils.valueForKey("accountVerificationMobile") + requestData.mobile + ".");
                }
            }).fail(function () {
                jQuery('#messageModal.errorMessageModal p').text("We are unable to send you a verification code");
            });
        };

        this.checkVerfication = function () {
            var requestData = CookieUtils.getCookie("custId");

            var promise = DashboardService.tokenStatus(requestData);
            promise.then(function (data) {
                var verifyStatus = parseInt(data.arr_data.verified);
                if ((verifyStatus === 1)) {
                    CookieUtils.setCookie("verify", 1, GlobalData.expireDays);
                    CookieUtils.setCookie("is_verified", 1, GlobalData.expireDays);
                }
            }).fail(function () {

            });
        };
        this.verifyMerge = function () {
            //var verificationView = VerificationView.create();
            VerificationView.email_address = jQuery(this).attr('data-customer-email');
            VerificationView.is_merge = jQuery(this).attr('data-merge');
            VerificationView.customer_id = jQuery(this).attr('data-customer-id');
            //verificationView.addToDiv();
            jQuery('#verifyModal').modal('show');
            DashboardView.messageMiddle();
        };

        this.errorShow = function () {
            GlobalData.ec.recordClickEvent('Dashboard_view', 'DashboardVerifyCodeButtonClicked');
            if (jQuery("#verifyCode").val() === "") {
                var errorMessage = ErrorMessage.create();
                errorMessage.addToDiv();
                jQuery('#messageModal.errorMessageModal').modal('show');
                DashboardView.errorMiddle();
                jQuery('#messageModal.errorMessageModal p').text('Please enter verification code.');
            } else {
                var requestData = {
                    user_id: CookieUtils.getCookie("custId"),
                    verification_code: jQuery("#verifyCode").val()
                };
                var promise = DashboardService.verifyByCode(requestData);
                promise.then(function (data) {
                    var errorMessage;
                    if (data.int_status_code === 0) {
                        errorMessage = ErrorMessage.create();
                        errorMessage.addToDiv();
                        jQuery('#verifyCode').val('');
                        jQuery('#messageModal.errorMessageModal').modal('show');
                        DashboardView.errorMiddle();
                        jQuery('#messageModal.errorMessageModal h4').text('Invalid code!');
                        jQuery('#messageModal.errorMessageModal p').text(data.str_status_message);
                    } else {
                        //                        CookieUtils.delete_cookie('is_verified');
                        CookieUtils.setCookie("is_verified", 1, GlobalData.expireDays);
                        jQuery('#verfiyAccount').hide();
                        errorMessage = ErrorMessage.create();
                        errorMessage.addToDiv();
                        jQuery('#messageModal.errorMessageModal').modal('show');
                        DashboardView.errorMiddle();
                        jQuery('#messageModal.errorMessageModal h4').hide();
                        jQuery('#messageModal.errorMessageModal p').text(LanguageUtils.valueForKey("accountVerified"));
                        console.log('location 2');
                        jQuery('#messageModal.errorMessageModal button').click(function () {
                            console.log('ok btn clicked location 2');
                            location.hash = "/dashboard";
                            document.location.reload();
                        });
                    }
                }).fail(function () {

                });
            }
        };

        this.cardMessage = function (link) {
            clearInterval(GlobalData.bellCounterInterval);
            if (GlobalData.fileUploadData.onGoingUpload) {
                window.open(link, '_blank');
            } else {
                window.open(link, '_self');
                jQuery('body').addClass('page-loaded');
                jQuery('body > .pageload').fadeIn();
            }

            var verfication = parseInt(CookieUtils.getCookie('is_verified'));
            //            var requestData = {
            //                userid: CookieUtils.getCookie("custId")
            //            };
            //            var promise = DashboardService.tokenStatus(requestData);
            //            promise.then(function(data) {
            //                if (data.arr_data.verified == 0) {
            //                     jQuery('.dash-card > .card > a').removeAttr("href");
            //                    DashboardView.showVerifyPopup();
            //                } 
            //            }).fail(function() {
            //
            //            });
            if (jQuery(this).hasClass('story8001')) {

            } else {
                if (verfication !== 1) {
                    jQuery(this).removeAttr("href");
                    DashboardView.showVerifyPopup();
                }
            }

        };
        this.downloadApp = function () {
            var verfication = CookieUtils.getCookie('is_verified');
            verfication = parseInt(verfication);
            var mobile = 0;
            if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/Android/i))) {
                mobile = 1;
            }

            if ((mobile === 0) && (verfication === 0)) {
                jQuery('.create-story > a').removeAttr("href");
                DashboardView.showVerifyPopup();
            }
            GlobalData.ec.recordClickEvent('Dashboard_view', 'DashboardCreateStoryClicked');
            if (mobile) {
                jQuery('.create-story > a').removeAttr("href");
                //messagesView obj loaded in preloader
                //var messagesView = MessagesView.create();
                //messagesView.addToDiv();
                jQuery('#messageModal.mobileFeature').modal('show');
                //DashboardView.messageMiddle();
            }

        };

        this.shareScreenShow = function (e) {
            GlobalData.ec.recordClickEvent('Dashboard_view', 'ShareStoryButtonClicked');
            //var sharedToAllFlag = jQuery(this).attr('data-share');
            var orderId = '';
            if (CookieUtils.getCookie('shareFromPreview')) {
                orderId = CookieUtils.getCookie('orderId');
                CookieUtils.delete_cookie('shareFromPreview');
                CookieUtils.delete_cookie('orderId');
            } else {
                orderId = this.id;
            }
            if (((parseInt(CookieUtils.getCookie('is_verified'))) === 1) || ((parseInt(CookieUtils.getCookie('verify'))) === 1)) {
                var shareView = ShareView.create();
                for (var i = 0; i < DashboardView.dashboardData.length; i++) {
                    if (DashboardView.dashboardData[i].id === orderId) {
                        ShareView.shareData = DashboardView.dashboardData[i];
                        break;
                    }
                }
                //console.table(ShareView.shareData);
                if (ShareView.shareData.order_status === '950') {
                    jQuery('.alertNoEditShare').modal('show');
                } else {
                    loadFBJS(); //load fb library
                    shareView.addToDiv();
                    jQuery('#shareModal').modal('show');
                    jQuery('body').addClass("mobModal");
                    DashboardView.shareMiddle();
                    //            jQuery('#shareModal .modal-content').perfectScrollbar();
                }
            } else {
                DashboardView.showVerifyPopup();
            }
        };

        this.checkPrintServiceAvailable = function (event) {
            if(event){
                event.stopPropagation();
            }
            
            GlobalData.ec.recordClickEvent('Dashboard_view', 'click', 'Print_Button');
            if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/Android/i))) {
                var errorMessage = ErrorMessage.create();
                errorMessage.addToDiv();
                jQuery('#messageModal.errorMessageModal').modal('show');
                DashboardView.errorMiddle();
                jQuery('#messageModal.errorMessageModal p').text("To print your story, please download the Photogurus app on your mobile or login to Photogurus.com on your computer.");
            } else {
                jQuery('body').addClass('page-loaded');
                jQuery('body > .pageload').fadeIn();
                var getGeoLocationPromise = getGeoLocation();
                getGeoLocationPromise.then(function(data) {
                    if(data.country_code){
                        return data.country_code;
                    }else{
                        return Promise.reject('Could not retrieve user country code');
                    }
                    
                }).then(function(countryCode) {
                    jQuery('body').addClass('page-loaded').removeClass('page-loading');
                    jQuery('body > .pageload').fadeOut();

                    countryCode = countryCode.toUpperCase();
                    console.log(countryCode);
                    //countryCode = 'DE';
                    if(countryCode === 'US'){
                        DashboardView.validateUserLocation(countryCode);
                        
                    }else if(countryCode === 'DE' || countryCode === 'NO'){
                        jQuery('.user-region-modal .modal-header h4').text('Download our app!');
                        jQuery('.user-region-modal #user-region-modal-content').text('Please download our app to print your photostory.');
                        jQuery('.user-region-modal #user-region-modal-left-action').text('Download');
                        jQuery('.user-region-modal #user-region-modal-right-action').text('Cancel');
                        jQuery('.user-region-modal').modal('show');

                        jQuery('.user-region-modal #user-region-modal-left-action').click(function(event){
                            event.stopPropagation();
                            jQuery('#confirm_download').click();
                        });
                    }else{
                        jQuery('.alertDialog').modal('show');
                        jQuery('.alertDialog .modal-header').hide();
                        jQuery('#displayText').text('Sorry, currently we do not offer photo book printing service in your region.');
                    }
                }).catch(function(e) {
                    console.log('Exception: '+e);
                });
            }
        };
        
        this.validateUserLocation = function (countryCode) {
            //intention is if regioncode doesnot match log out user, since its expected that during sign in the region code captured and the country code captured during tap on print icon should be same
            var requestData = {
            };
            var promiseOrderInfo = PrintService.getProducts(requestData);// book information
            $.when(promiseOrderInfo)
            .done(function (obj) {
                console.dir(obj);
                console.log(countryCode);
                if (obj.arr_data === null && obj.int_status_code === 0) {
                    DashboardView.logout();
                }
                if (obj.arr_data !== null && obj.int_status_code !== 0) {
                    if(countryCode !== obj.arr_data.details[0].printRegionCode){
                        //logout the user
                        DashboardView.logout();
                    }else{
                        DashboardView.printScreenShow();
                    }
                }
                
            });
        };
        
        this.logout = function (uploadCancel) {
            jQuery('body').addClass('page-loaded');
            jQuery('body > .pageload').fadeIn();
            var requestData = CookieUtils.getCookie("sessionKey");
            var promise = UserService.logoutUser(requestData);
            promise.then(function () {
                CookieUtils.delete_cookie('authToken');
                CookieUtils.delete_cookie('custId');
                CookieUtils.delete_cookie('custName');
                CookieUtils.delete_cookie('custProfilePic');
                CookieUtils.delete_cookie('custEmail');
                CookieUtils.delete_cookie('is_verified');
                CookieUtils.delete_cookie('verify');
                CookieUtils.delete_cookie('sessionKey');
                CookieUtils.delete_cookie("isRememberMe");
                CookieUtils.deleteAllCookies();
                window.onbeforeunload = null;
                window.onunload = null;
                var interval_id = window.setInterval("", 9999);
                for (var i = 1; i < interval_id; i++) {
                    window.clearInterval(i);
                }
                document.location.reload();
            }).fail(function () {});

        };

        this.printScreenShow = function () {
            if (!_.isUndefined(DashboardView.menuData)) {
                GlobalData.orderData = DashboardView.menuData;
                GlobalData.orderData.reOrder = false;
                GlobalData.printData = {};
            }else{
                var orderId = '';
                if (CookieUtils.getCookie('printFromPreview')) {
                    orderId = CookieUtils.getCookie('orderId');
                } else {
                    orderId = this.id;
                }

                for (var i = 0; i < DashboardView.dashboardData.length; i++) {
                    if (DashboardView.dashboardData[i].id === orderId) {
                        //GlobalData.storyData = DashboardView.dashboardData[i];
                        GlobalData.orderData = DashboardView.dashboardData[i];
                        GlobalData.orderData.reOrder = false;
                        GlobalData.printData = {};
                        break;
                    }
                }
            }

            //Owner|Recipient
            var type = null;
            type = 'Owner';
            if (GlobalData.orderData.story_belongsto !== 'Owner') {
                type = 'Recipient';
            }
            var pixel_params = null;
            pixel_params = {
                'User_role': type
            };
            //Fb Pixel
            GlobalData.ec.recordFBPixelEvent('track', 'AddToCart', pixel_params);

            Lockr.rm('storyData');
            Lockr.rm('printData');
            Lockr.rm('storyDataBKP');
            Lockr.rm('printDataBKP');
            console.dir(GlobalData);
            location.hash = "#/print/books";
        };

        this.infoOwnStoryScreenShow = function () {
            GlobalData.ec.recordClickEvent('Dashboard_view', 'InfoStoryButtonClicked');
            if (((parseInt(CookieUtils.getCookie('is_verified'))) === 1) || ((parseInt(CookieUtils.getCookie('verify'))) === 1)) {
                var myStory = 0;
                //TODO: workaround for now, need to refactor code
                for (var i = 0; i < DashboardView.dashboardData.length; i++) {
                    if (DashboardView.dashboardData[i].id === this.id) {

                        if (DashboardView.dashboardData[i].order_status === '950') {
                            jQuery('.alertNoEditShare').modal('show');
                        } else if (DashboardView.dashboardData[i].design_request_type === 0 || DashboardView.dashboardData[i].order_status === '1000') {
                            //SUSD

                            var infoView = InfoView.create();
                            InfoView.infoData = DashboardView.dashboardData[i];
                            myStory = 1;
                            infoView.addToDiv(myStory, 'OwnStory');
                            jQuery('#InfoModal').modal('show');
                            DashboardView.infoMiddle();
                            jQuery('.sharedFeatureContainer, #editDateId, #locationEditId, .edit-item, .save-item, .pagesPhoto, #add_new-sharer').show();
                            jQuery('.delete-info').addClass("ownSt");
                            jQuery('.sharedUserContainer').addClass("ownUsers");
                            //jQuery('.sharedFeatureContainer').show();
                        } else if (DashboardView.dashboardData[i].design_request_type == 1) {
                            //console.log('SUMD');
                            //SUMD
                            var infoViewMultiDevice = InfoViewMultiDevice.create();
                            InfoViewMultiDevice.infoData = DashboardView.dashboardData[i];
                            myStory = 1;
                            infoViewMultiDevice.addToDiv(myStory, 'OwnStory');
                            jQuery('#InfoModal').modal('show');
                            DashboardView.infoMiddle();
                            jQuery('.sharedFeatureContainer, #editDateId, #locationEditId, .edit-item, .save-item, .pagesPhoto, #add_new-sharer').show();
                            jQuery('.delete-info').addClass("ownSt");
                            jQuery('.image-set-src-container').addClass("ownImageSet");
                            //jQuery('.sharedFeatureContainer').show();
                        } else if (DashboardView.dashboardData[i].design_request_type == 2 && DashboardView.dashboardData[i].story_belongsto === "Owner") {
                            //console.log('MUMD owner');
                            //MUMD owner
                            InfoViewMultiContributor.create();
                            //console.log(DashboardView.dashboardData[i]);
                            InfoViewMultiContributor.infoData = DashboardView.dashboardData[i];
                            myStory = 1;
                            InfoViewMultiContributor.addToDiv(myStory, 'OwnStory');
                            jQuery('#InfoModal').modal('show');
                            DashboardView.infoMiddle();
                            jQuery('.sharedFeatureContainer, #editDateId, #locationEditId, .edit-item, .save-item, .pagesPhoto, #add_new-sharer').show();
                            jQuery('.delete-info').addClass("ownSt");
                            jQuery('.image-set-src-container').addClass("ownImageSet");

                        } else if (DashboardView.dashboardData[i].design_request_type == 2 && DashboardView.dashboardData[i].story_belongsto === "contributor") {
                            //console.log('MUMD contributor');
                            //MUMD contributor
                            InfoViewMultiContributorReadOnly.create();
                            //console.log(DashboardView.dashboardData[i]);
                            InfoViewMultiContributorReadOnly.infoData = DashboardView.dashboardData[i];
                            myStory = 1;
                            InfoViewMultiContributorReadOnly.addToDiv(myStory, 'OwnStory');
                            jQuery('#InfoModal').modal('show');
                            DashboardView.infoMiddle();
                            jQuery('.sharedFeatureContainer, #editDateId, #locationEditId, .edit-item, .save-item, .pagesPhoto, #add_new-sharer').show();
                            jQuery('.delete-info').addClass("ownSt");
                            jQuery('.image-set-src-container').addClass("ownImageSet");
                        }
                        break;
                    }
                }


            } else {
                DashboardView.showVerifyPopup();
            }

        };
        this.checkImageStatus = function () {
            GlobalData.ec.recordClickEvent('Dashboard_view', 'DesignInProgressButtonClicked');
            if (((parseInt(CookieUtils.getCookie('is_verified'))) === 1) || ((parseInt(CookieUtils.getCookie('verify'))) === 1)) {
                jQuery('body > .pageload').fadeIn();
                var orderId = '';
                if (DashboardView.menuData !== undefined) {
                    orderId = DashboardView.menuData.id;
                } else {
                    orderId = GlobalData.multiDevice.orderId;
                }
                var orderData = {};
                orderData.id = orderId;
                orderData.actualImageTransferCount = 0;
                var requestData = {
                    order_id: orderId,
                    customer_id: CookieUtils.getCookie("custId")
                };
                var promiseOrderInfo = ContributionService.getOrderInformation(requestData); //to get order status and other related data if required
                var promiseImageSetInfo = ContributionService.getContributedImageSetData(requestData);

                $.when(promiseOrderInfo, promiseImageSetInfo)
                    .done(function (obj1, obj2) {
                        //console.dir(obj1);
                        //console.dir(obj2);
                        if (obj1.arr_data !== null && obj1.int_status_code !== 0) {
                            orderData.actualImageTransferCount = parseInt(obj1.arr_data.total_transferred_count);

                            var messagesView = MessagesView.create();
                            messagesView.addToDiv();
                            messagesView.messageMiddle();

                            if (obj1.arr_data.order_status === '50') {
                                var imageSetData = obj2.arr_data;
                                DashboardView.storyCurrentStatus = "completed";
                                if (imageSetData !== null) {
                                    for (var i = 0; i < imageSetData.length; i++) {
                                        if (imageSetData[i].image_set_status_code === '1000' || imageSetData[i].image_set_status_code === '2000') {
                                            DashboardView.storyCurrentStatus = "transferring";
                                        }
                                    }
                                }

                                if (DashboardView.storyCurrentStatus === "transferring") {
                                    jQuery('body > .pageload').fadeOut();
                                    jQuery('.transferModalId').modal('show');
                                    jQuery('#transferModalId .modal-header h4').text('Photo transfer in progress!');
                                    jQuery('#transferMsgId').text(LanguageUtils.valueForKey("transferMsg"));
                                    jQuery("#designMyOrder").click(function (event) {
                                        event.stopPropagation();
                                        PubSub.publish('TRIGGER_DESIGN_MY_STORY', orderData);
                                    });
                                }
                                if (DashboardView.storyCurrentStatus === "completed") {
                                    PubSub.publish('TRIGGER_DESIGN_MY_STORY', orderData);
                                }
                            } else if (obj1.arr_data.order_status === '9999') {
                                //order has been sent deleted simultaneously from other device
                                jQuery('body > .pageload').fadeOut();
                                jQuery('.stopTransfer').modal({
                                    backdrop: 'static',
                                    keyboard: false
                                });
                                jQuery('#stopTransferText .modal-header h4').hide();
                                jQuery('#stopTransferText').text(obj1.arr_data.story_owner_name + ' has deleted the story - ' + obj1.arr_data.cover_caption + ', so no more photos can be uploaded.');

                                jQuery(".stopTransferModal").click(function (event) {
                                    event.stopPropagation();
                                    jQuery('.stopTransfer').modal('hide');
                                    jQuery('body > .pageload').fadeIn();
                                    window.onbeforeunload = null;
                                    window.onunload = null;
                                    document.location.reload();
                                });
                            } else {
                                //order has been sent for design
                                jQuery('body > .pageload').fadeOut();
                                jQuery('.stopTransfer').modal({
                                    backdrop: 'static',
                                    keyboard: false
                                });
                                jQuery('#stopTransferText .modal-header h4').hide();
                                jQuery('#stopTransferText').text(obj1.arr_data.story_owner_name + ' has already sent the story ' + obj1.arr_data.cover_caption + ' for design, so no more photos will be uploaded.');

                                jQuery(".stopTransferModal").click(function (event) {
                                    event.stopPropagation();
                                    jQuery('.stopTransfer').modal('hide');
                                    jQuery('body > .pageload').fadeIn();
                                    window.onbeforeunload = null;
                                    window.onunload = null;
                                    document.location.reload();
                                });
                            }
                        } else {
                            console.log('API response null');
                        }
                    });
                //debugger;
            } else {
                DashboardView.showVerifyPopup();
            }
        };

        this.designMyStory = function () {
            GlobalData.ec.recordClickEvent('Dashboard_view', 'designMyStoryButtonClicked');
            var orderId = '';
            if (this.id !== undefined) {
                orderId = this.id;
            } else {
                orderId = GlobalData.multiDevice.orderId;
            }
            var data = DashboardView.getOrderDetailsByOrderId(orderId);

            jQuery('.transferModalId').modal('hide');

            if (GlobalData.multiDevice.transferred_image_count < 20) {

                jQuery('.alertDialog').modal('show');
                jQuery('.alertDialog .modal-header h4').text('Add more photos!');
                if (GlobalData.multiDevice.transferred_image_count === 0) {
                    jQuery('#displayText').text('Please add 20 photos to place your design request.');
                } else {
                    var balance = (20 - GlobalData.multiDevice.transferred_image_count);
                    jQuery('#displayText').text('Please add ' + balance + ' more photos to place your design request.');
                }

                jQuery(".closeCustomModal").click(function (event) {
                    event.stopPropagation();
                    jQuery('.alertDialog').modal('hide');
                    window.onbeforeunload = null;
                    window.onunload = null;
                    document.location.reload();
                });
            } else {
                jQuery.magnificPopup.open({
                    items: {
                        src: '#photoStoryPopup'
                    },
                    type: 'inline'
                });

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

                //populate data for tittle field
                jQuery('#title').val(data.cover_caption);
                jQuery('#title').focus();


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

                GlobalData.multiDevice = {};
                GlobalData.multiDevice = data;
                GlobalData.multiDevice.activity = "designMyStory";
            }
            jQuery('body > .pageload').fadeOut();
        };

        this.infoSharedStoryScreenShow = function () {
            GlobalData.ec.recordClickEvent('Dashboard_view', 'InfoStoryButtonClicked');
            if (((parseInt(CookieUtils.getCookie('is_verified'))) === 1) || ((parseInt(CookieUtils.getCookie('verify'))) === 1)) {
                var infoView = InfoView.create();
                for (var i = 0; i < DashboardView.dashboardData.length; i++) {
                    if (DashboardView.dashboardData[i].id === this.id) {
                        InfoView.infoData = DashboardView.dashboardData[i];
                        break;
                    }
                }

                var requestData = {
                    order_id: InfoView.infoData.id,
                    customer_id: CookieUtils.getCookie("custId")
                };
                var promiseOrderInfo = ContributionService.getOrderInformation(requestData); //to get order status and other related data if required
                $.when(promiseOrderInfo)
                    .done(function (obj1) {
                        //console.dir(obj1);
                        if (obj1.arr_data !== null && obj1.int_status_code !== 0) {
                            if (obj1.arr_data.order_status === "950") {
                                jQuery('.alertNoEditShare').modal('show');
                            } else {
                                infoView.addToDiv(0, 'SharedStory');
                                jQuery('#InfoModal').modal('show');
                                DashboardView.infoMiddle();
                                jQuery('.sharedFeatureContainer, #editDateId, #locationEditId, .edit-item, .save-item, .pagesPhoto').hide();
                                jQuery('#add_new-sharer').children().hide();
                                jQuery('.delete-info').addClass("sharedSt");
                                jQuery('.sharedUserContainer').addClass("sharedUsers");
                                DashboardView.infoShareUser();
                            }
                        } else {
                            console.log('API response is null');
                        }
                    });
            } else {
                DashboardView.showVerifyPopup();
            }



        };
        this.windowResize = function () {
            if (jQuery(window).width() < 767) {
                jQuery('#notification, #upload_progress').removeClass("container");
            }
            if (jQuery(window).width() < 1500) {
                jQuery('#notification, .same-height-cards, #upload_progress').removeClass("container");
            } else {
                jQuery('#notification, .same-height-cards, #upload_progress').addClass("container");
            }
            
            if(GlobalData.mobileDevice){
                jQuery('.bg-danger .cover-image').css({'height':'126px'});
                jQuery('.bg-danger .unverified-merge-cover').css({'height':'126px'});
            }

            if(!GlobalData.mobileDevice){
                jQuery('.bg-danger .cover-image').css({'height':'200px'});
                jQuery('.bg-danger .unverified-merge-cover').css({'height':'200px'});
            }
            
            jQuery('.updatingStory').parent().css({
                'background': '#fff'
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
        this.infoMiddle = function () {
            if (jQuery(window).width() > 767) {
                var infoContent = ((jQuery(window).height()) - (jQuery('#InfoModal .modal-content').height())) / 2;
                jQuery('#InfoModal .modal-dialog').css('margin-top', infoContent + 'px');
            } else {
                jQuery('#InfoModal .modal-dialog').css('margin-top', '0px');
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
        this.infoShareUser = function () {
            jQuery('.sharedUserContainer').css({
                'border-right': '0',
                'width': '100%'
            });
            jQuery('.shared-names').css({
                'max-width': '88%'
            });

        };
        this.uploadTimeoutCheck = function () {
            if (GlobalData.fileUploadData.onGoingUpload === 1) {
                var diffDays = 0;
                if (GlobalData.fileUploadData.onGoingUpload === 1) {
                    diffDays = UploadProgressUtils.onGoingUploadDaysCount();
                }
                if (diffDays > 3) {
                    var requestData = {
                        order_id: GlobalData.fileUploadData.orderData.orderId
                    };
                    var messagesView = MessagesView.create();
                    messagesView.addToDiv();
                    var promise = DashboardService.uploadOrderPossibilty(requestData);
                    promise.then(function (data) {
                        if (data.arr_data.status === 1) {
                            jQuery('.timeOutTrueMessage').modal('show');
                            jQuery('.timeOutTrueMessage p').text(data.arr_data.msg);
                            DashboardView.messageMiddle();

                        } else if (data.arr_data.status === 2) {
                            jQuery('.timeOutMessage').modal('show');
                            jQuery('.timeOutMessage p').text(data.arr_data.msg);
                            DashboardView.messageMiddle();
                            //                                Cannot continue with upload, refresh dashboard to display the order & it's respective status

                            clearInterval(DashboardView.uploadProgress3DaysTimeoutCheck);
                        } else if (data.arr_data.status === 3) {
                            //                                 Cannot continue with upload, refresh dashboard to display the order & it's respective status
                            jQuery('.timeOutMessage').modal('show');
                            jQuery('.timeOutMessage p').text(data.arr_data.msg);
                            DashboardView.messageMiddle();
                            clearInterval(DashboardView.uploadProgress3DaysTimeoutCheck);
                        }
                    });
                }
            }
            if (GlobalData.fileUploadData.onGoingUpload === 0) {
                clearInterval(DashboardView.uploadProgress3DaysTimeoutCheck);
            }
        };
        this.checkForDownloadInProgress = function () {
            console.log('flagpoint 2');
            if (GlobalData.fileUploadData.onGoingUpload === 2) {
                console.log('flagpoint 3');
                //var messagesView = MessagesView.create();
                //messagesView.addToDiv();
                if (GlobalData.photoStoryStatusMsg !== undefined) {
                    console.log('flagpoint 4');
                    console.log(GlobalData.photoStoryStatusMsg);
                    if (GlobalData.photoStoryStatusMsg === "DesignNow") {
                        console.log('Messge box');
                        // jQuery('.modal-backdrop.fade.in').remove();
                        // console.log("all modals are get hide");
                        var messagesView = MessagesView.create();
                        messagesView.addToDiv();
                        jQuery('.storyStatus200dash').modal('show');
                        messagesView.messageMiddle();

                    }
                } else {
                    console.log('flagpoint 5');
                    clearInterval(DashboardView.uploadProgress);
                    PubSub.publish('UPDATE_TRANSFER_IN_PROGRESS_STORY');
                }

                //                DashboardView.updateDashboardData();
                GlobalData.fileUploadData.onGoingUpload = 0;
            }
            if (GlobalData.fileUploadData.onGoingUpload === 0) {
                clearInterval(DashboardView.uploadProgress);
            }
            if (GlobalData.fileUploadData.onGoingUpload === 1) {
                jQuery('#upload_progress').show();
            } else {
                jQuery('#upload_progress').empty();
                window.onbeforeunload = null;
            }
        };
        this.updateDesignInProgressStory = function () {
            if (GlobalData.fileUploadData.onGoingUpload !== 1) {
                if (document.location.hash === "#/dashboard") {
                    jQuery('body > .pageload').fadeIn();
                    var requestData = CookieUtils.getCookie("custId");
                    console.log("updateDesignInProgressStory");
                    var promise = DashboardService.dashboardData(requestData);

                    promise.then(function (data) {
                        DashboardView.dashboardData = data.arr_data;
                        DashboardView.filterDataByYearWise();
                        DashboardView.addToDiv();
                        jQuery('body > .pageload').fadeOut();
                        var notificationView = NotificationView.create();
                        notificationView.addToDiv();
                        jQuery("#dash" + GlobalData.currentId + " .addmorephotos-container").show();
                        jQuery("#dash" + GlobalData.currentId + " .action-btn-container").show();
                        jQuery("#dash" + GlobalData.currentId + " .selected-count").show();
                        jQuery("#dash" + GlobalData.currentId + " .pglogoDashboard_saving").addClass('pglogoDashboard').removeClass("pglogoDashboard_saving");
                        jQuery("#dash" + GlobalData.currentId + " .story-name_saving").addClass('story-name').removeClass("story-name_saving");
                        jQuery("#dash" + GlobalData.currentId + " .bottom-div-saving").hide();
                        jQuery("#dash" + GlobalData.currentId + " .selected-count-saving").addClass("selected-count").removeClass("selected-count-saving").show();

                    });
                }
            }
        };
        this.updateImageSetInfoPanel = function () {
            if (GlobalData.fileUploadData.onGoingUpload !== 1) {
                console.log("updateImageSetInfoPanel");
                var requestData = CookieUtils.getCookie("custId");
                var promise = DashboardService.dashboardData(requestData);
                $('.pageload').show();
                promise.then(function (data) {
                    DashboardView.dashboardData = data.arr_data;
                    DashboardView.filterDataByYearWise();
                    DashboardView.addToDiv();
                    $('.pageload').hide();
                    var notificationView = NotificationView.create();
                    notificationView.addToDiv();
                    /*InfoViewMultiDevice.imageSetData();
                     for (var i = 0; i < DashboardView.dashboardData.length; i++) {
                     if (DashboardView.dashboardData[i].id === InfoViewMultiDevice.infoData.id) {
                     if (DashboardView.dashboardData[i].design_request_type == 1) {
                     var infoViewMultiDevice = InfoViewMultiDevice.create();
                     InfoViewMultiDevice.infoData = DashboardView.dashboardData[i];
                     var myStory = 1;
                     infoViewMultiDevice.addToDiv(myStory, 'OwnStory');
                     jQuery('#InfoModal').modal('show');
                     DashboardView.infoMiddle();
                     jQuery('.sharedFeatureContainer, #editDateId, #locationEditId, .edit-item, .save-item, .pagesPhoto, #add_new-sharer').show();
                     jQuery('.delete-info').addClass("ownSt");
                     jQuery('.image-set-src-container').addClass("ownImageSet");
                     }
                     }
                     }*/

                });
            }
        };

        this.showContributorMessages = function (msg) {
            var messagesView = MessagesView.create();
            messagesView.addToDiv();
            messagesView.messageMiddle();
            jQuery(".contributorMessage").modal('show');
            jQuery(".contributorMessage p").text(msg);
        };

        this.initiateShareModal = function (event) {
            event.stopPropagation();
            //console.log(DashboardView.menuData.id);
            GlobalData.ec.recordClickEvent('Dashboard_view', 'ShareStoryButtonClicked');
            var orderId = '';
            if (CookieUtils.getCookie('shareFromPreview')) {
                orderId = CookieUtils.getCookie('orderId');
                CookieUtils.delete_cookie('shareFromPreview');
                CookieUtils.delete_cookie('orderId');
            } else {
                orderId = DashboardView.menuData.id;
            }
            
            if (((parseInt(CookieUtils.getCookie('is_verified'))) === 1) || ((parseInt(CookieUtils.getCookie('verify'))) === 1)) {
                var shareView = ShareView.create();
                for (var i = 0; i < DashboardView.dashboardData.length; i++) {
                    if (DashboardView.dashboardData[i].id === orderId) {
                        ShareView.shareData = DashboardView.dashboardData[i];
                        break;
                    }
                }
                if (ShareView.shareData.order_status === '950') {
                    jQuery('.alertNoEditShare').modal('show');
                } else {
                    loadFBJS(); //load fb library
                    shareView.addToDiv();
                    jQuery('#shareModal').modal('show');
                    jQuery('body').addClass("mobModal");
                    DashboardView.shareMiddle();
                }
            } else {
                DashboardView.showVerifyPopup();
            }
        };

        this.initiateInfoModal = function () {
            GlobalData.ec.recordClickEvent('Dashboard_view', 'InfoStoryButtonClicked');
            if (((parseInt(CookieUtils.getCookie('is_verified'))) === 1) || ((parseInt(CookieUtils.getCookie('verify'))) === 1)) {
                var myStory = 0;
                var orderDetails = null;
                orderDetails = DashboardView.menuData;
                if (orderDetails.order_status === '950') {
                    jQuery('.alertNoEditShare').modal('show');
                } else if (orderDetails.design_request_type === 0 || orderDetails.order_status === '1000') {
                    //SUSD
                    var infoView = InfoView.create();
                    InfoView.infoData = orderDetails;
                    myStory = 1;
                    infoView.addToDiv(myStory, 'OwnStory');
                    jQuery('#InfoModal').modal('show');
                    DashboardView.infoMiddle();
                    jQuery('.sharedFeatureContainer, #editDateId, #locationEditId, .edit-item, .save-item, .pagesPhoto, #add_new-sharer').show();
                    jQuery('.delete-info').addClass("ownSt");
                    jQuery('.sharedUserContainer').addClass("ownUsers");
                } else if (orderDetails.design_request_type == 1) {
                    //SUMD
                    var infoViewMultiDevice = InfoViewMultiDevice.create();
                    InfoViewMultiDevice.infoData = orderDetails;
                    myStory = 1;
                    infoViewMultiDevice.addToDiv(myStory, 'OwnStory');
                    jQuery('#InfoModal').modal('show');
                    DashboardView.infoMiddle();
                    jQuery('.sharedFeatureContainer, #editDateId, #locationEditId, .edit-item, .save-item, .pagesPhoto, #add_new-sharer').show();
                    jQuery('.delete-info').addClass("ownSt");
                    jQuery('.image-set-src-container').addClass("ownImageSet");
                } else if (orderDetails.design_request_type == 2 && orderDetails.story_belongsto === "Owner") {
                    //MUMD owner
                    InfoViewMultiContributor.create();
                    InfoViewMultiContributor.infoData = orderDetails;
                    myStory = 1;
                    InfoViewMultiContributor.addToDiv(myStory, 'OwnStory');
                    jQuery('#InfoModal').modal('show');
                    DashboardView.infoMiddle();
                    jQuery('.sharedFeatureContainer, #editDateId, #locationEditId, .edit-item, .save-item, .pagesPhoto, #add_new-sharer').show();
                    jQuery('.delete-info').addClass("ownSt");
                    jQuery('.image-set-src-container').addClass("ownImageSet");

                } else if (orderDetails.design_request_type == 2 && orderDetails.story_belongsto === "contributor") {
                    //MUMD contributor
                    InfoViewMultiContributorReadOnly.create();
                    InfoViewMultiContributorReadOnly.infoData = orderDetails;
                    myStory = 1;
                    InfoViewMultiContributorReadOnly.addToDiv(myStory, 'OwnStory');
                    jQuery('#InfoModal').modal('show');
                    DashboardView.infoMiddle();
                    jQuery('.sharedFeatureContainer, #editDateId, #locationEditId, .edit-item, .save-item, .pagesPhoto, #add_new-sharer').show();
                    jQuery('.delete-info').addClass("ownSt");
                    jQuery('.image-set-src-container').addClass("ownImageSet");
                }
            } else {
                DashboardView.showVerifyPopup();
            }

        };

        this.initiateDelete = function () {
            var custID = CookieUtils.getCookie("custId");
            var messagesView = MessagesView.create();
            messagesView.addToDiv();
            jQuery('#messageModal').modal('show');
            DashboardView.messageMiddle();
            
            var dialogTitle = '', dialogMsg = '', dialogBtnLabel = '';
            dialogTitle = 'Delete Story?';
            dialogMsg = 'Story cannot be restored after deletion.';
            dialogBtnLabel = 'Delete';
            
            if(DashboardView.menuData.order_status === '8001'){ //if shared story
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
                if(DashboardView.menuData.order_status === '8001'){ 
                    //if shared story
                    jQuery(".modal").modal('hide');
                    requestData = {
                        "customer_id": custID,
                        "token": DashboardView.menuData.token
                    };
                    promise = ShareService.deleteShareDetails(requestData);
                    promise.then(function () {
                        PubSub.publish('DASHBOARD_STORIES');
                    }).fail(function () {

                    });
                } else {
                    //if own story
                    jQuery(".modal").modal('hide');
                    PubSub.publish('DASHBOARD_STORIES');
                    requestData = {
                        "customer_id": custID,
                        "tracking_id": DashboardView.menuData.pb_tracking_id
                    };
                    promise = ShareService.deletePhotostory(requestData);
                    promise.then(function () {}).fail(function () {

                    });
                }
            });
        };
        
        this.initiateDeleteForSavedStory = function () {
            var custID = CookieUtils.getCookie("custId");
            var messagesView = MessagesView.create();
            messagesView.addToDiv();
            jQuery('#messageModal').modal('show');
            DashboardView.messageMiddle();

            if(DashboardView.menuData.story_belongsto === 'contributor'){
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
                    requestData = {
                        order_id: DashboardView.menuData.id,
                        customer_id: custID
                    };
                    promise = UserService.deletePhotostoryByContributor(requestData);
                    promise.then(function (data) {
                        PubSub.publish('DASHBOARD_STORIES');
                    }).fail(function () {

                    });
                });
            }else{
                if(DashboardView.menuData.design_request_type === '1'){
                    //ownstory and multiDevice order
                    jQuery('#messageModal #back_text').text("Story cannot be restored after deletion.").fadeIn();
                }else{
                    //ownstory and multiContributor order
                    jQuery('#messageModal #back_text').text("Are you sure you want to delete the Photostory?").fadeIn();
                }
                jQuery('#messageModal .modal-header h4').text("Delete story?").fadeIn();
                jQuery('#messageModal #download_text').hide();
                jQuery('#messageModal #confirm_download').hide();
                jQuery('#cancel_btn').text("Delete").fadeIn();
                jQuery('#ok_back').text("Cancel").fadeIn();
                jQuery('#cancel_btn').click(function () {
                    var requestData = {};
                    var promise;
                    jQuery(".modal").fadeOut();
                    requestData = {
                        order_id: DashboardView.menuData.id
                    };
                    promise = UserService.deletePhotostory(requestData);
                    promise.then(function (data) {
                        PubSub.publish('DASHBOARD_STORIES');
                    }).fail(function () {

                    });
                });
            }
        };

        this.initiateEditStory = function (event) {
            event.stopPropagation();
            if (GlobalData.mobileDevice) {
                jQuery('.pg-mobile-editor-dialog .modal-header h4').text('Download Photogurus App');
                jQuery('.pg-mobile-editor-dialog #pg-mobile-editor-content').text('To edit your story, please download the Photogurus editor app on your device').show();
                jQuery('.pg-mobile-editor-dialog').modal('show');
            }else{
                var link = GlobalData.editStoryTool + DashboardView.menuData.id + '&consumer=yes&token='+CookieUtils.getCookie("authToken");
                if (GlobalData.fileUploadData.onGoingUpload) {
                    window.open(link, '_blank');
                } else {
                    window.open(link, '_self');
                    jQuery('body').addClass('page-loaded');
                    jQuery('body > .pageload').fadeIn();
                }
            }
        };

        this.initiateSaveStory = function (event) {
            event.stopPropagation();
            window.location.href = DashboardView.menuData.zipurl;
        };

        this.initiateDateUpdation = function (event) {
            event.stopPropagation();
            //jQuery('input#triggerCalender').attr('disabled', false);
            jQuery('input#triggerCalender').focus();
            //jQuery('.modal-open').addClass("removeScroll");
        };

        this.initiateCopyLink = function (event) {
            event.stopPropagation();
            jQuery('.copyLinkDiv').show();
            jQuery('.copyBtn').click(DashboardView.copyURL);
        };
        
        this.sample = function (event) {
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
        this.calenderSelect = function () {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth();

            var newMonth = months[mm];
            var yyyy = today.getFullYear();
            var maxDate = newMonth + " " + dd + "," + yyyy;
            jQuery('input#triggerCalender').datepicker({
                format: "MM dd,yyyy",
                endDate: maxDate
            });
            
            jQuery('input#triggerCalender').on('changeDate', function () {
                //jQuery('.modal-open').removeClass("removeScroll");
                jQuery(this).datepicker('hide');
                var OldDate = jQuery('input#triggerCalender').val();
                var dateAndTime = DashboardView.convertDateWithTime(OldDate);

                var requestData = {
                    order_id: DashboardView.menuData.id,
                    order_event_date: dateAndTime
                };
                var OldDateUpdated = DashboardView.convertDate(dateAndTime);
                jQuery('input#triggerCalender').val(OldDateUpdated);
                var promise = ShareService.updateOrderEventInfodate(requestData);
                promise.then(function (data) {
                    //console.dir(data);
                    if (data.int_status_code === 1) { 
                        var messagesView = MessagesView.create();
                        messagesView.addToDiv();
                        jQuery('.toast-dialog').modal('show');
                        messagesView.messageMiddle();
                        jQuery('.toast-dialog #toast-msg').text("Date updated successfully.");
                        jQuery('#ok_back').click(function (event) {
                            event.stopPropagation();
                            PubSub.publish('DASHBOARD_STORIES');
                        });
                    }
                    //jQuery('input#triggerCalender').prop('disabled', true);
                }).fail(function () {});
            });
        };

        this.copyURL = function () {//console.log($(this).parent().find('.copyLinkInput'));
            var inputElement = $(this).parent().find('.copyLinkInput');
            if(inputElement.length){
                //console.log('step1');
                var copyTextarea = null;
                if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
                    //console.log('step2');
                    jQuery('.copy-link-modal').modal('show');
                    jQuery('.copy-text').fadeIn().text("Please select link and use cmd+c to copy the link");
                    copyTextarea = document.querySelector('.copyLinkInput');
                    copyTextarea.select();
                }
                //console.log('step3');
                copyTextarea = document.querySelector('.copyLinkInput');
                copyTextarea.select();
                try {
                    //console.log('step4');
                    var successful = document.execCommand('copy');
                    var msg = successful ? 'successful' : 'unsuccessful';
                    //console.log(msg);
                    if (msg === 'unsuccessful') {
                        //console.log('step5');
                        if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
                            jQuery('.copy-link-modal').modal('show');
                            jQuery('.copy-text').fadeIn().text("Please select link and use cmd+c to copy the link");

                        }
                    } else {
                        jQuery('.copy-link-modal').modal('show');
                    }
                } catch (err) {
                }
            }
        };


    });
    return DashboardView;
});