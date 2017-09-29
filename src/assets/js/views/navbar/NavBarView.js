/*global define, jQuery, window, setTimeout,location,document */

define(['Augment',
    'Instance',
    'GlobalData',
    'PubSub',
    'views/navbar/BellNotificationView',
    'utils/CookieUtils',
    'services/DashboardService',
    'views/dashboard/DashboardView',
    'views/messages/MessagesView',
    'views/verification/VerificationView',
    'views/errorMessage/ErrorMessage',
    'hbs!views/navbar/templates/NavBarView'
], function (augment, instance, GlobalData, PubSub, BellNotificationView, CookieUtils, DashboardService, DashboardView, MessagesView, VerificationView, ErrorMessage, tplNavBarView) {

    'use strict';

    var NavBarView = augment(instance, function () {
        this.offscreenDirectionClass = null;
        GlobalData.isOffscreenOpen = false;
        this.bellView = null;
        this.addToDiv = function () {
            var navBarView = this;
            var divId = "NavBarDiv";
            var innerHtml = tplNavBarView({
                imageBase: GlobalData.imageBase
            });
            jQuery('#' + divId).empty();
            jQuery('#' + divId).html(innerHtml);
            navBarView.bellView = BellNotificationView.create();
            //            navBarView.bellView.parseData();
            //            navBarView.bellView.parseNotificationCountData();
            navBarView.smallMenu();
            navBarView.initScrollbars();
            navBarView.rippleEffect();
            navBarView.sidebarPanel();
            navBarView.attachEvents();
            jQuery(window).resize(function () {
                navBarView.notificationHeight();
                navBarView.messageMiddle();
            });
        };

        this.attachEvents = function () {
            var navBarView = this;
            jQuery('#my_profile').click(navBarView.showProfilePage);
            jQuery('#showMessage').click(navBarView.showMessgaes);
            jQuery('.searchbox').click(function () {
                jQuery('.search-form').removeClass('hide');
            });
        };

        this.showProfilePage = function () {
            location.hash = '#/profile';
        };
        this.showMessgaes = function () {
            GlobalData.ec.recordClickEvent('Dashboard_view', 'BellIconClickedFromMobile');
            var messagesView = MessagesView.create();
            messagesView.addToDiv();
            jQuery('#messageModal').modal('show');
            NavBarView.messageMiddle();

        };
        this.showVerifyPopup = function () {
            GlobalData.ec.recordClickEvent('Dashboard_view', 'BellIconClickedFromMobile');
            //var verificationView = VerificationView.create();
            //verificationView.addToDiv();
            jQuery('#verifyModal').modal('show');
            NavBarView.messageMiddle();

        };
        this.rippleEffect = function () {
            jQuery('.ripple').on('click', function (e) {
                e.preventDefault();
                var div = jQuery('<div/>'),
                    btnOffset = jQuery(this).offset(),
                    xPos = e.pageX - btnOffset.left,
                    yPos = e.pageY - btnOffset.top;
                div.addClass('ripple-effect');
                var ripple = jQuery('.ripple-effect');
                ripple.css('height', jQuery(this).height());
                ripple.css('width', jQuery(this).height());
                div.css({
                    top: yPos - ripple.height() / 2,
                    left: xPos - ripple.width() / 2,
                    background: jQuery(this).data('ripple-color')
                }).appendTo(jQuery(this));
                window.setTimeout(function () {
                    div.remove();
                }, 1500);
            });
        };
        this.initScrollbars = function () {
            if (jQuery('.app').hasClass('layout-small-menu') || jQuery('.app').hasClass('layout-static-sidebar') || jQuery('.app').hasClass('layout-boxed')) {
                return;
            }
            jQuery('.no-touch .sidebar-panel').perfectScrollbar({
                wheelPropagation: true,
                suppressScrollX: true
            });
        };
        this.smallMenu = function () {
            var navBarView = this;
            jQuery('[data-toggle=layout-small-menu]').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                jQuery('.app').toggleClass('layout-small-menu');
                if (jQuery('.app').hasClass('layout-small-menu')) {
                    jQuery('.no-touch .sidebar-panel').perfectScrollbar('destroy').removeClass('ps-container ps-active-y ps-active-x');
                    if (jQuery('.quick-launch-apps').is(':visible')) {
                        jQuery('.quick-launch-apps').addClass('hide').next().removeClass('hide');
                    }
                } else if (!jQuery('.no-touch .sidebar-panel').hasClass('ps-container')) {
                    navBarView.initScrollbars();
                }
            });
        };
        this.sidebarPanel = function () {
            var navBarView = this;

            var offscreenDirection;
            jQuery('[data-toggle=offscreen]').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                offscreenDirection = jQuery(this).data('move') ? jQuery(this).data('move') : 'ltr';
                if (offscreenDirection === 'rtl') {
                    navBarView.offscreenDirectionClass = 'move-right';
                } else {
                    navBarView.offscreenDirectionClass = 'move-left';
                }
                var rapidClickCheck = false;
                if (rapidClickCheck) {
                    return;
                }
                rapidClickCheck = true;
                navBarView.toggleMenu();
            });
            jQuery('.main-panel').on('click', function (e) {
                var target = e.target;
                if (GlobalData.isOffscreenOpen && target !== jQuery('[data-toggle=offscreen]')) {
                    navBarView.toggleMenu();
                }
            });

            navBarView.notificationHeight();
            jQuery("#col2").parent(".panel-heading").css("background", "#7f7d7d");
            jQuery('#collapseOne').attr('aria-expanded', 'true');
            jQuery('#col1').click(function () {
                jQuery('#collapseTwo').slideUp();
                jQuery('#collapseOne').slideDown();
                jQuery('#col1 .indicator').removeClass("glyphicon-down").addClass("glyphicon-up");
                jQuery('#col2 .indicator').removeClass("glyphicon-up").addClass("glyphicon-down");
                jQuery("#col2").css("background", "#7f7d7d");
                jQuery("#col1").css("background", "#565656");

            });
            jQuery('#col2').click(function () {
                jQuery('#collapseOne').slideUp();
                jQuery('#collapseTwo').slideDown();
                jQuery('#col2 .indicator').removeClass("glyphicon-down").addClass("glyphicon-up");
                jQuery('#col1 .indicator').removeClass("glyphicon-up").addClass("glyphicon-down");
                jQuery("#col1").css("background", "#7f7d7d");
                jQuery("#col2").css("background", "#565656");

            });

            jQuery('.logo-img-box').click(function () {
                location.hash = "/dashboard";
                document.location.reload();
            });

            var clickDisabled = false;
            // do your real click processing here
            jQuery("#notificationBell > a").on('click', function (event) {
                event.stopPropagation();
                GlobalData.ec.recordClickEvent('Dashboard_view', 'BellIconClicked');

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
                
                navBarView.bellView.resetCount();
                navBarView.bellView.parseData();

                if ((parseInt(CookieUtils.getCookie('is_verified')) === 1)) {
                    jQuery(".notifiaction-container, #up_point").toggle();
                    jQuery("#notification_count").hide();
                } else {
                    var requestData = {
                        userid: CookieUtils.getCookie("custId")
                    };
                    var promise = DashboardService.tokenStatus(requestData);
                    promise.then(function (data) {
                        var verifyStatus = parseInt(data.arr_data.verified);
                        if ((verifyStatus === 1)) {
                            CookieUtils.setCookie("is_verified", 1, GlobalData.expireDays);
                            jQuery(".notifiaction-container, #up_point").toggle();
                            jQuery("#notification_count").hide();

                        } else {
                            if (clickDisabled) {
                                return;
                            }
                            clickDisabled = true;
                            setTimeout(function () {
                                clickDisabled = false;
                            }, 500);
                            NavBarView.showVerifyPopup();
                        }
                    }).fail(function () {

                    });
                }
                if (jQuery("#collapseOne .card").length < 1) {
                    jQuery('#collapseOne').html('<h4 class="empty-card">There are no new updates</h4>');
                }
            });
            this.toggleMenu = function () {
                if (GlobalData.isOffscreenOpen) {
                    jQuery('.app').removeClass('move-left move-right');
                    setTimeout(function () {
                        jQuery('.app').removeClass('offscreen');
                    }, 150);
                } else {
                    jQuery('.app').addClass('offscreen ' + this.offscreenDirectionClass);
                }
                GlobalData.isOffscreenOpen = !GlobalData.isOffscreenOpen;
                this.rapidClickFix();
            };

            this.rapidClickFix = function () {
                var navBarView = this;
                setTimeout(function () {
                    navBarView.rapidClickCheck = false;
                }, 150);
            };
        };
        this.messageMiddle = function () {
            var msgContent = ((jQuery(window).height()) - (181)) / 2;
            jQuery('#messageModal .modal-dialog').css('margin-top', msgContent + 'px');
        };
        this.notificationHeight = function () {
            var panelHeight, containerHeight;
            if (jQuery(window).width() < 1025) {
                panelHeight = (jQuery(window).height()) - 200;
                containerHeight = panelHeight + 93;
                jQuery('#notificationBell .notifiaction-container').css({
                    'height': containerHeight + 'px'
                });
                jQuery('.collapse-content').css('height', panelHeight + 'px');


            } else {
                panelHeight = (jQuery(window).height()) / 2;
                containerHeight = panelHeight + 93;
                jQuery('#notificationBell .notifiaction-container').css({
                    'height': containerHeight + 'px'
                });
                jQuery('.collapse-content').css('height', panelHeight + 'px');

            }
            jQuery(".notifiaction-container").on("mouseover", function () {
                jQuery(".collapse-content").perfectScrollbar("update");
            });

        };
    });


    return NavBarView;
});