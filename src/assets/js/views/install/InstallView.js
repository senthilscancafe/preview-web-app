/*global define, jQuery,window*/
define(['Augment',
    'Instance',
    'GlobalData',
    'hbs!views/install/templates/InstallView'
], function (augment, instance, GlobalData, tplInstallView) {

    'use strict';
    var InstallView = augment(instance, function () {
        var installView = this;
        this.email = false;
        this.mobile = false;
        this.addToDiv = function () {
            var divId = "appSignInDiv";
            var innerHtml = tplInstallView({
                isAndroid: GlobalData.mobileDeviceIsAndroid,
                isIOS: GlobalData.mobileDeviceIsIOS,
                appStoreLink: GlobalData.appStoreLink,
                playStoreLink: GlobalData.playStoreLink
            });
            jQuery('#' + divId).empty();
            jQuery('.mainContainer').hide();
            jQuery('#' + divId).html(innerHtml);
            this.preloader();
        };

        this.preloader = function () {
            jQuery('.pageload').hide();
            this.winHeight = $(window).height();
            this.winWidth = $(window).width();
            installView.callCssOnOrientationChange();
            $(window).resize(function () {
                console.log("Resized.");
                installView.callCssOnOrientationChange();
            });
            $(window).on("orientationchange", function (event) {
                console.log("orientation changed.");
                installView.callCssOnOrientationChange();
            });
            jQuery('.signUpLine .installLink').click(function () {
                location.hash = '#/personalizedaccountsignup';
            });


        };
        this.setHeightInviteLinkContainer = function () {
            jQuery('.inviteLinkBox').css({
                'height': this.winHeight
            });
        }
        this.callCssOnOrientationChange = function () {
            this.winHeight = $(window).height();
            this.winWidth = $(window).width();
            console.log('width: ' + this.winWidth);
            console.log('Height:' + this.winHeight);

            if (this.winHeight > this.winWidth) {
                console.log("potrait");
                jQuery('.installAppBody .logoImg').addClass('logImg').removeClass('logImgLandscape');
                installView.setHeightInviteLinkContainer();
            }
            if (this.winHeight < this.winWidth) {
                console.log("Landscape");
                jQuery('.installAppBody .logoImg').addClass('logImgLandscape').removeClass('logImg');
                installView.setHeightInviteLinkContainer();
            }
        }
    });

    return InstallView;
});