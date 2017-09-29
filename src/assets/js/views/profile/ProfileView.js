/*global define, jQuery, console, window, location,FileReader, FormData */

define(['Augment',
    'Instance',
    'PubSub',
    'GlobalData',
    'utils/CookieUtils',
    'utils/LanguageUtils',
    'views/navbar/NavBarView',
    'views/sidebar/SideBarView',
    'views/dashboard/DashboardView',
    'services/UserService',
    'services/DashboardService',
    'views/verification/VerificationView',
    'views/errorMessage/ErrorMessage',
    'views/messages/MessagesView',
    'views/changePasswordInner/ChangePasswordInnerView',
    'hbs!views/profile/templates/ProfileView'

], function (augment, instance, PubSub, GlobalData, CookieUtils, LanguageUtils, NavBarView, SideBarView, DashboardView, UserService, DashboardService, VerificationView, ErrorMessage, MessagesView, ChangePasswordInnerView, tplProfileView) {

    'use strict';

    var ProfileView = augment(instance, function () {
        var profile = this;
        this.init = function () {
            this.addToDiv();
            jQuery(window).resize(function () {
                profile.messageMiddle();
                profile.passwordMiddle();
                profile.confirmMessageMiddle();
                profile.profileHeight();
                profile.errorMiddle();
            });
            this.profileData();
        };

        this.addToDiv = function () {
            jQuery(".secondaryEmail,.default-email-left, .add-email-new, .default-email-right").hide();
            this.preloader();
        };
        this.preloader = function () {
            var profileView = this;
            //jQuery('body').addClass('page-loaded').removeClass('page-loading');
            //jQuery('body > .pageload').fadeOut();
            //PubSub.publish('CHECK_USERID');

            if (!CookieUtils.getCookie("custId")) {
                location.hash = "#/login";
            }

            jQuery('.verfiInner').click(function () {
                ////console.log('ProfileClicked');
            });

            jQuery('#resend_btn').click(profileView.resendSmsOrEmail);
            jQuery('#resend_btn_mobile').click(profileView.resendSmsOrEmail);




        };
        this.profileData = function () {

            //console.log('here-p');
            jQuery('#signUpMobileDiv').hide();
            var promiseRequestData = CookieUtils.getCookie("custId");
            var profilePromise = DashboardService.getprofileDetails(promiseRequestData);
            var isMobilePrimary = 0;
            var isEmailPrimary = 0;

            profilePromise.then(function (data) {
                jQuery('body').addClass('page-loaded').removeClass('page-loading');
                jQuery('body > .pageload').fadeOut();
                ProfileView.profileInfo = data.arr_data;
                DashboardView.userData = data.arr_data;

                var navBar = NavBarView.create();
                navBar.addToDiv();
                jQuery('.navbar-nav').hide();
                jQuery('.home-icon').css("display", "inline-block");
                jQuery('.home-icon').click(function () {
                    GlobalData.ec.recordClickEvent('Profile_view', 'HomeButtonClicked');
                    jQuery('.navbar-nav').hide();
                    location.hash = "/dashboard";
                    jQuery('body').addClass('page-loaded');
                    jQuery('body > .pageload').fadeIn();
                });

                var sideBar = SideBarView.create();
                sideBar.addToDiv();
                var sidebardata = ProfileView.profilepic;

                var loggedInId;
                if (CookieUtils.getCookie("custEmail").length > 4) {
                    loggedInId = "email";
                } else {
                    //console.log("s");
                    loggedInId = "mobile";
                }

                var imagedata, photoUpdate;

                if (DashboardView.userData.user_picture_path === null || DashboardView.userData.user_picture_path === undefined || DashboardView.userData.user_picture_path === "") {
                    imagedata = 'assets/images/user_pic_profilepic.png';
                    photoUpdate = "Add Photo";
                } else {
                    imagedata = ProfileView.profileInfo.user_picture_path + '?v=' + Math.random();
                    photoUpdate = "Change Photo";
                }
                var divId = "dashbaordUIView";

                if (parseInt(CookieUtils.getCookie("isPasswordSet")) === 0) {
                    profile.passwordLabel = "Set Password";
                    jQuery("#oldPass").hide();
                } else {
                    profile.passwordLabel = "Change Password";
                }
                var innerHtml = tplProfileView({
                    email: ProfileView.profileInfo.email,
                    name: ProfileView.profileInfo.first_name,
                    proflieImage: imagedata,
                    photoButton: photoUpdate,
                    changepassword: profile.passwordLabel,
                    Logout: LanguageUtils.valueForKey("Logout"),
                    deleteAccount: LanguageUtils.valueForKey("deleteAccount")
                });
                jQuery('#' + divId).empty();
                jQuery('#' + divId).html(innerHtml);
                jQuery('#MainViewDiv').show();
                jQuery('#NavBarDiv').show();
                jQuery("#printlayout").hide();
                jQuery('#MainViewDiv').css('padding', '55px 0px 0px 0px');
                ProfileView.profileHeight();
                var secondaryEmails;

                if (isNaN(jQuery('#enterMobile').text())) // this is the code I need to change
                {
                    jQuery('.mobile-right .field-verify-second').hide();

                }
                if (loggedInId === "email") {
                    isEmailPrimary = 1;

                    if (CookieUtils.getCookie("custsecondary_email") !== "undefined") { // logged in with secondary email
                        secondaryEmails = ProfileView.profileInfo.altenative_accounts.length;
                        console.log("---------second---------");
                        console.log(ProfileView.profileInfo.altenative_accounts);

                        for (var i = 0; i < secondaryEmails; i++) {
                            //console.log(ProfileView.profileInfo.altenative_accounts[i].account);
                            var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

                            if (parseInt(ProfileView.profileInfo.altenative_accounts[i].verified)) {
                                if (ProfileView.profileInfo.altenative_accounts[i].account === CookieUtils.getCookie("custsecondary_email")) { // logged in with secondary email
                                    console.log("matched");
                                    jQuery('.emailSec').attr("id", ProfileView.profileInfo.altenative_accounts[i].id);

                                    if (filter.test(ProfileView.profileInfo.altenative_accounts[i].account)) {

                                        var emailDiv = "<div class='profile_fields_box col-sm-6 user_accounts'><div class='secondaryEmail clearfix row-emails email-margin'><div class='field-col1'> <span class='profile-icons email-icon'></span> </div><div class='field-col2 email-cols' id=" + ProfileView.profileInfo.altenative_accounts[i].id + ">" + ProfileView.profileInfo.altenative_accounts[i].account + "</div><div class='right-div'><div class='delete-secAccount delAccount'><span class='profile-icons delete-icon'></div></div></div></div>";
                                        jQuery(".accounts-details-div").append(emailDiv);
                                        jQuery(".email-cols").css("width", "75%");
                                        jQuery('.verify-sec-mobile').hide();
                                    } else {

                                        jQuery("#enterMobile").text(ProfileView.profileInfo.altenative_accounts[i].account);
                                        jQuery("#enterMobile").attr("id", ProfileView.profileInfo.altenative_accounts[i].id);
                                        jQuery('.verify-sec-mobile').hide();
                                        jQuery('.del-mobile-sec').show();

                                    }

                                } else {
                                    if (filter.test(ProfileView.profileInfo.altenative_accounts[i].account)) {
                                        var emailDiv = "<div class='profile_fields_box col-sm-6 user_accounts'><div class='secondaryEmail clearfix row-emails email-margin'><div class='field-col1'> <span class='profile-icons email-icon'></span> </div><div class='field-col2 email-cols' id=" + ProfileView.profileInfo.altenative_accounts[i].id + ">" + ProfileView.profileInfo.altenative_accounts[i].account + "</div><div class='right-div'><div class='delete-secAccount delAccount'></div></div></div></div>";
                                        jQuery(".accounts-details-div").append(emailDiv);
                                        jQuery(".email-cols").css("width", "75%");
                                        jQuery(".field-verify-second").hide();
                                        jQuery('.verify-sec-mobile').hide();
                                    } else {
                                        jQuery("#enterMobile").text(ProfileView.profileInfo.altenative_accounts[i].account);
                                        jQuery("#enterMobile").attr("id", ProfileView.profileInfo.altenative_accounts[i].id);
                                        jQuery('.verify-sec-mobile').hide();
                                        jQuery('.del-mobile-sec').show();
                                    }
                                }

                            } else {
                                if (ProfileView.profileInfo.altenative_accounts[i].account === CookieUtils.getCookie("custsecondary_email")) {
                                    ////console.log("matched");
                                } else {
                                    if (filter.test(ProfileView.profileInfo.altenative_accounts[i].account)) {
                                        var emailDiv = "<div class='profile_fields_box col-sm-6 user_accounts'><div class='secondaryEmail clearfix row-emails email-margin'><div class='field-col1'> <span class='profile-icons email-icon'></span> </div><div class='field-col2' id=" + ProfileView.profileInfo.altenative_accounts[i].id + ">" + ProfileView.profileInfo.altenative_accounts[i].account + "</div><div class='right-div'><div class='field-verify-second field-verify'> <a data-toggle='modal' data-target='#verifyModal' class='verify-now'>Verify Now</a></div><div class='delete-secAccount delAccount'><span class='profile-icons delete-icon'></div></div></div></div>";
                                        jQuery(".accounts-details-div").append(emailDiv);
                                        jQuery('.verify-sec-mobile').hide();

                                    } else {
                                        jQuery("#enterMobile").text(ProfileView.profileInfo.altenative_accounts[i].account);
                                        jQuery("#enterMobile").attr("id", ProfileView.profileInfo.altenative_accounts[i].id);
                                        jQuery('.verify-sec-mobile').show();
                                    }
                                }
                            }
                        }

                        jQuery(".default-email-left").show();
                        jQuery(".emailSec").text(CookieUtils.getCookie("custsecondary_email"));
                    } else {

                        secondaryEmails = ProfileView.profileInfo.altenative_accounts.length;

                        //console.log(ProfileView.profileInfo.altenative_accounts);

                        jQuery(".right-email-field").hide();
                        jQuery('.del-mobile-sec').hide();
                        for (var i = 0; i < secondaryEmails; i++) {

                            var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

                            if (parseInt(ProfileView.profileInfo.altenative_accounts[i].verified)) {
                                jQuery('.default-email').show(); // show default text when verify now button is not present - when acc is verified

                                if (ProfileView.profileInfo.altenative_accounts[i].account === CookieUtils.getCookie("custsecondary_email")) {
                                    ////console.log("matched");
                                } else {
                                    if (filter.test(ProfileView.profileInfo.altenative_accounts[i].account)) {

                                        var emailDiv = "<div class='profile_fields_box col-sm-6 user_accounts'><div class='secondaryEmail clearfix row-emails email-margin'><div class='field-col1'> <span class='profile-icons email-icon'></span> </div><div class='field-col2 email-cols' id=" + ProfileView.profileInfo.altenative_accounts[i].id + ">" + ProfileView.profileInfo.altenative_accounts[i].account + "</div><div class='right-div'><div class='delete-secAccount delAccount'><span class='profile-icons delete-icon'></div></div></div></div>";
                                        jQuery(".accounts-details-div").append(emailDiv);
                                        jQuery(".email-cols").css("width", "75%");
                                        jQuery('.verify-sec-mobile').hide();
                                    } else {

                                        jQuery("#enterMobile").text(ProfileView.profileInfo.altenative_accounts[i].account);
                                        jQuery("#enterMobile").attr("id", ProfileView.profileInfo.altenative_accounts[i].id);
                                        jQuery('.verify-sec-mobile').hide();
                                        jQuery('.del-mobile-sec').show();

                                    }
                                }

                            } else {

                                jQuery('.default-email').hide(); //hide default text and show verify now button

                                if (ProfileView.profileInfo.altenative_accounts[i].account === CookieUtils.getCookie("custsecondary_email")) {
                                    ////console.log("matched");
                                } else {
                                    if (filter.test(ProfileView.profileInfo.altenative_accounts[i].account)) {
                                        var emailDiv = "<div class='profile_fields_box col-sm-6 user_accounts'><div class='secondaryEmail clearfix row-emails email-margin'><div class='field-col1'> <span class='profile-icons email-icon'></span> </div><div class='field-col2' id=" + ProfileView.profileInfo.altenative_accounts[i].id + ">" + ProfileView.profileInfo.altenative_accounts[i].account + "</div><div class='right-div'> <div class='delete-secAccount delAccount'><span class='profile-icons delete-icon'></span></div> </div><div class='right-div'><div class='field-verify-second field-verify'><a data='" + ProfileView.profileInfo.altenative_accounts[i].id + "' data-merge='" + ProfileView.profileInfo.altenative_accounts[i].is_merge + "' data-customer='" + ProfileView.profileInfo.altenative_accounts[i].customer_id + "' data-toggle='modal' data-target='#verifyModal' class='verify-now'>Verify Now</a></div></div></div></div>";
                                        jQuery(".accounts-details-div").append(emailDiv);
                                        jQuery('.verify-sec-mobile').hide();
                                    } else {

                                        //                                        var mobileDiv = "<div class='profile_fields_box col-sm-6 user_accounts add-mobile-div'>
                                        //                                                        <div class='secondaryEmail clearfix row-emails email-margin'>
                                        //                                                        <div class='field-col1'> <span class='profile-icons email-icon'></span> </div>
                                        //                                                        <div class='field-col2' id=" + ProfileView.profileInfo.altenative_accounts[i].id + ">" + ProfileView.profileInfo.altenative_accounts[i].account + "</div>
                                        //                                                     <div class='right-div'> <div class='delete-secAccount delAccount'><span class='profile-icons delete-icon'></div> </div>
                                        //                                                        <div class='right-div'><div class='field-verify-second field-verify'><a data='" + ProfileView.profileInfo.altenative_accounts[i].id +"' data-merge='" + ProfileView.profileInfo.altenative_accounts[i].is_merge +"' data-customer='" + ProfileView.profileInfo.altenative_accounts[i].customer_id +"' data-toggle='modal' data-target='#verifyModal' class='verify-now'>Verify Now</a></div>
                                        //                                                        </div></div></div>";
                                        //                                         //jQuery(".accounts-details-div").append(mobileDiv);
                                        jQuery("#enterMobile").text(ProfileView.profileInfo.altenative_accounts[i].account);
                                        jQuery("#enterMobile").attr("id", ProfileView.profileInfo.altenative_accounts[i].id);
                                        jQuery('.verify-primary-mobile').show();
                                        jQuery('.verify-sec-mobile').show();
                                        jQuery('.del-mobile-sec').show();
                                    }
                                }
                            }
                        }
                        jQuery(".default-email-left").show();
                        //                        jQuery(".add-email-new").show();
                    }
                } else {
                    jQuery('.del-mobile-sec').hide();
                    isMobilePrimary = 1;
                    var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                    if (filter.test(CookieUtils.getCookie("custprimaryemail"))) {
                        jQuery(".right-email-field").hide();
                        jQuery(".default-email-left").show();
                        secondaryEmails = ProfileView.profileInfo.altenative_accounts.length;
                        ////console.log(secondaryEmails);
                        for (var i = 0; i < secondaryEmails; i++) {
                            ////console.log(ProfileView.profileInfo.altenative_accounts[i].account);
                            var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                            if (parseInt(ProfileView.profileInfo.altenative_accounts[i].verified)) {
                                if (ProfileView.profileInfo.altenative_accounts[i].account === CookieUtils.getCookie("custsecondary_email")) {
                                    ////console.log("matched");
                                } else {
                                    if (filter.test(ProfileView.profileInfo.altenative_accounts[i].account)) {
                                        var emailDiv = "<div class='profile_fields_box col-sm-6 user_accounts'><div class='secondaryEmail clearfix row-emails email-margin'><div class='field-col1'> <span class='profile-icons email-icon'></span> </div><div class='field-col2 email-cols' id=" + ProfileView.profileInfo.altenative_accounts[i].id + ">" + ProfileView.profileInfo.altenative_accounts[i].account + "</div><div class='right-div'><div class='delete-secAccount delAccount'><span class='profile-icons delete-icon'></div></div></div></div>";
                                        jQuery(".accounts-details-div").append(emailDiv);
                                        jQuery(".email-cols").css("width", "75%");
                                        jQuery(".field-verify-second").hide();
                                    } else {
                                        jQuery("#enterMobile").text(ProfileView.profileInfo.altenative_accounts[i].account);
                                        jQuery("#enterMobile").attr("id", ProfileView.profileInfo.altenative_accounts[i].id);
                                    }
                                }

                            } else {

                                jQuery('.mobile-right').hide();
                                if (ProfileView.profileInfo.altenative_accounts[i].account === CookieUtils.getCookie("custsecondary_email")) {
                                    ////console.log("matched");
                                } else {
                                    if (filter.test(ProfileView.profileInfo.altenative_accounts[i].account)) {
                                        var emailDiv = "<div class='profile_fields_box col-sm-6 user_accounts'><div class='secondaryEmail clearfix row-emails email-margin'><div class='field-col1'> <span class='profile-icons email-icon'></span> </div><div class='field-col2' id=" + ProfileView.profileInfo.altenative_accounts[i].id + ">" + ProfileView.profileInfo.altenative_accounts[i].account + "</div><div class='right-div'> <div class='delete-secAccount delAccount'><span class='profile-icons delete-icon'></div> </div><div class='right-div'><div class='field-verify-second field-verify'><a data='" + ProfileView.profileInfo.altenative_accounts[i].id + "' data-merge='" + ProfileView.profileInfo.altenative_accounts[i].is_merge + "' data-customer='" + ProfileView.profileInfo.altenative_accounts[i].customer_id + "' data-toggle='modal' data-target='#verifyModal' class='verify-now'>Verify Now</a></div></div></div></div>";
                                        jQuery(".accounts-details-div").append(emailDiv);
                                    } else {
                                        jQuery("#enterMobile").text(ProfileView.profileInfo.altenative_accounts[i].account);
                                        jQuery("#enterMobile").attr("id", ProfileView.profileInfo.altenative_accounts[i].id);
                                    }
                                }
                            }
                        }

                    } else {

                        ////console.log("primay mob");
                        jQuery('.field-verify-second').hide();
                        secondaryEmails = ProfileView.profileInfo.altenative_accounts.length;
                        ////console.log(secondaryEmails);
                        for (var i = 0; i < secondaryEmails; i++) {
                            ////console.log(ProfileView.profileInfo.altenative_accounts[i].account);
                            var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                            if (parseInt(ProfileView.profileInfo.altenative_accounts[i].verified)) {
                                if (ProfileView.profileInfo.altenative_accounts[i].account === CookieUtils.getCookie("custsecondary_email")) {
                                    ////console.log("matched");
                                } else {
                                    if (filter.test(ProfileView.profileInfo.altenative_accounts[i].account)) {
                                        var emailDiv = "<div class='profile_fields_box col-sm-6 user_accounts'><div class='secondaryEmail clearfix row-emails email-margin'><div class='field-col1'> <span class='profile-icons email-icon'></span> </div><div class='field-col2 email-cols' id=" + ProfileView.profileInfo.altenative_accounts[i].id + ">" + ProfileView.profileInfo.altenative_accounts[i].account + "</div><div class='right-div'><div class='delete-secAccount delAccount'><span class='profile-icons delete-icon'></div></div></div></div>";
                                        jQuery(".accounts-details-div").append(emailDiv);
                                        jQuery(".email-cols").css("width", "75%");
                                        jQuery(".field-verify-second").hide();
                                    } else {
                                        jQuery("#enterMobile").text(ProfileView.profileInfo.altenative_accounts[i].account);
                                        jQuery("#enterMobile").attr("id", ProfileView.profileInfo.altenative_accounts[i].id);
                                    }
                                }

                            } else {
                                if (ProfileView.profileInfo.altenative_accounts[i].account === CookieUtils.getCookie("custsecondary_email")) {
                                    ////console.log("matched");
                                } else {
                                    if (filter.test(ProfileView.profileInfo.altenative_accounts[i].account)) {
                                        var emailDiv = "<div class='profile_fields_box col-sm-6 user_accounts'><div class='secondaryEmail clearfix row-emails email-margin'><div class='field-col1'> <span class='profile-icons email-icon'></span> </div><div class='field-col2' id=" + ProfileView.profileInfo.altenative_accounts[i].id + ">" + ProfileView.profileInfo.altenative_accounts[i].account + "</div><div class='right-div'> <div class='delete-secAccount delAccount'><span class='profile-icons delete-icon'></div> </div><div class='right-div'><div class='field-verify-second field-verify'><a data='" + ProfileView.profileInfo.altenative_accounts[i].id + "' data-merge='" + ProfileView.profileInfo.altenative_accounts[i].is_merge + "' data-customer='" + ProfileView.profileInfo.altenative_accounts[i].customer_id + "' data-toggle='modal' data-target='#verifyModal' class='verify-now'>Verify Now</a></div></div></div></div>";
                                        jQuery(".accounts-details-div").append(emailDiv);
                                    } else {
                                        jQuery("#enterMobile").text(ProfileView.profileInfo.altenative_accounts[i].account);
                                        jQuery("#enterMobile").attr("id", ProfileView.profileInfo.altenative_accounts[i].id);
                                    }
                                }
                            }
                        }

                    }

                }
                jQuery('.accounts-details-div').append("<div class='profile_fields_box col-sm-6 user_accounts'><div class='secondaryEmail clearfix row-emails email-margin'><div class='field-col1'> <span class='profile-icons email-icon'></span> </div><div class='field-col2 add-secondary-div'> <input type='text' class='no-border additional-email' placeholder='Add another email address' id='add_email1'/></div><div class='right-div' style='display:none'><div class='field-verify-second field-verify' id='currentVerify'><a data-toggle='modal' data-target='#verifyModal' class='verify-now'>Verify Now</a></div><div class='delete-secAccount delAccount' id='currentDelete'><span class='profile-icons delete-icon'></div></div></div></div>");

                jQuery('.verify-additional').hide();
                ProfileView.radius();
                jQuery('.telephone-input').on('keypress', function (e) {
                    if (e.which === 13) {
                        GlobalData.ec.recordClickEvent('Profile_view', 'AddSecondaryMobileEvent');
                        jQuery('body').addClass('page-loaded');
                        jQuery('body > .pageload').fadeIn();

                        var mobileInputObj = jQuery(this);
                        mobileInputObj.blur();
                        var requestdata = '';
                        var errorMessage = ErrorMessage.create();

                        var error = mobileInputObj.intlTelInput("getValidationError");
                        //console.log(error);
                        //console.log(mobileInputObj.intlTelInput("isValidNumber"));
                        var mobileValidationErrorMsg = '';
                        var mobileValidationErrorHeader = '';
                        /*if (error == intlTelInputUtils.validationError.TOO_SHORT) {
                            mobileValidationErrorHeader = 'Error!';
                            mobileValidationErrorMsg = 'Too short number';
                        }
                        if (error == intlTelInputUtils.validationError.TOO_LONG) {
                            mobileValidationErrorHeader = 'Error!';
                            mobileValidationErrorMsg = 'Too long number';
                        }*/
                        if (error == intlTelInputUtils.validationError.NOT_A_NUMBER) {
                            mobileValidationErrorHeader = 'Missing information!';
                            mobileValidationErrorMsg = LanguageUtils.valueForKey("missingSecondaryMobile");
                        }
                        
                        if(mobileValidationErrorMsg){
                            jQuery('body').addClass('page-loaded').removeClass('page-loading');
                            jQuery('body > .pageload').fadeOut();
                            
                            errorMessage.addToDiv();
                            jQuery('#messageModal.errorMessageModal').modal({
                                backdrop: 'static',
                                keyboard: false
                            });
                            ProfileView.errorMiddle();
                            jQuery('#messageModal.errorMessageModal h4').text(mobileValidationErrorHeader);
                            jQuery('#messageModal.errorMessageModal p').text(mobileValidationErrorMsg);
                            jQuery('#messageModal.errorMessageModal button').click(function () {
                                jQuery('.modal').modal('hide');
                                mobileInputObj.focus();
                            });
                            return;
                        }

                        if(!mobileInputObj.intlTelInput("isValidNumber")){
                            jQuery('body').addClass('page-loaded').removeClass('page-loading');
                            jQuery('body > .pageload').fadeOut();

                            errorMessage.addToDiv();
                            jQuery('#messageModal.errorMessageModal').modal({
                                backdrop: 'static',
                                keyboard: false
                            });
                            ProfileView.errorMiddle();
                            jQuery('#messageModal.errorMessageModal h4').text('Invalid mobile number!');
                            jQuery('#messageModal.errorMessageModal p').text(LanguageUtils.valueForKey("invalidSecondaryMobile"));
                            jQuery('#messageModal.errorMessageModal button').click(function () {
                                jQuery('.modal').modal('hide');
                                mobileInputObj.focus();
                            });
                            return;
                        }

                        if (mobileInputObj.intlTelInput("isValidNumber")) {
                            var mobileNumber = mobileInputObj.intlTelInput("getNumber").split("+" + mobileInputObj.intlTelInput("getSelectedCountryData").dialCode);
                            var countryCode = "+" + mobileInputObj.intlTelInput("getSelectedCountryData").dialCode;
                            requestdata = {
                                mobile: mobileNumber[1],
                                country_code: countryCode,
                                mobile_type: "2",
                                user_id: CookieUtils.getCookie("custId")
                            };

                            var promise = UserService.addSecondaryMobile(requestdata);

                            promise.then(function (data) {
                                jQuery('body').removeClass('page-loaded');
                                jQuery('body > .pageload').fadeOut();
                                //console.log(data);

                                if (data.arr_data === null && data.str_status_message !== '') { // when add sec email api returns error show normal error popup
                                    var errorMessage = ErrorMessage.create();
                                    errorMessage.addToDiv();
                                    jQuery('#messageModal.errorMessageModal').modal('show');
                                    ProfileView.errorMiddle();
                                    jQuery('#messageModal.errorMessageModal p').text(data.str_status_message);
                                    //On error popup and clicking ok, remove off the entered text of email, verify button and del acc button for that current div
                                    //jQuery('#mobile').val('');
                                    jQuery('.verify-primary-mobile').hide();
                                    jQuery('.del-mobile-sec').hide();


                                } else if (data.arr_data !== null && data.str_status_message !== '') { // when add sec email api returns message to merge the account yes/no popup
                                    var messagesView = MessagesView.create();
                                    messagesView.addToDiv();
                                    jQuery('.merge-message').modal('show');
                                    ProfileView.confirmMessageMiddle();
                                    jQuery('.merge-message .modal-header h4').text('Account already exists!');
                                    jQuery('.merge-message .modal-body p').text(data.str_status_message);

                                    jQuery('#no_merge').click(function () {

                                        jQuery('.verify-primary-mobile').hide();
                                        jQuery('.del-mobile-sec').hide();
                                    });

                                    jQuery('#yes_merge').click(function () {
                                        var promiseRequestData = {
                                            "merge_to_customer_id": CookieUtils.getCookie("custId"),
                                            "merge_from_customer_id": data.arr_data.merge_from_customer_id
                                        };
                                        var profilePromise = UserService.mergeRequest(promiseRequestData);
                                        profilePromise.then(function (data) {
                                            var errorMessage = ErrorMessage.create();
                                            errorMessage.addToDiv();
                                            jQuery('#messageModal.errorMessageModal').modal('show');
                                            ProfileView.errorMiddle();
                                            if (data.str_status_message != "") {
                                                jQuery('#messageModal.errorMessageModal p').text(data.str_status_message);
                                            } else {
                                                jQuery('#messageModal.errorMessageModal p').text('Something went Wrong! Please try again.');
                                            }
                                            jQuery('#messageModal.errorMessageModal button').click(function () {
                                                jQuery('.modal').modal('hide');
                                                location.reload();
                                            });
                                        });
                                        //                                       jQuery('#add_email1').val('');
                                        //                                       jQuery('.field-verify-second').hide();
                                        //                                       jQuery('.delete-secAccount').hide();
                                    });
                                } else {
                                    location.reload();
                                }

                            }).fail(function () {
                                console.log('fail');
                            });

                            jQuery('body').addClass('page-loaded').removeClass('page-loading');
                            jQuery('body > .pageload').fadeOut();
                        }
                    }
                });

                jQuery('.accounts-details-div').on('keypress', '.additional-email', function (e) {

                    var key = e.which;
                    if (key === 13) // the enter key code
                    {
                        GlobalData.ec.recordClickEvent('Profile_view', 'AddSecondaryEmailEvent');
                        jQuery('body').addClass('page-loaded');
                        jQuery('body > .pageload').fadeIn();
                        var errorMessage = ErrorMessage.create();

                        var validEmailObj = jQuery(this);
                        var validEmail = $.trim(validEmailObj.val());
                        var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                        var add_email_count = (jQuery('.additional-email').length) + 1;
                        if (CookieUtils.getCookie("is_verified") === '0') {
                            jQuery('body').addClass('page-loaded').removeClass('page-loading');
                            jQuery('body > .pageload').fadeOut();
                            //var errorMessage = ErrorMessage.create();
                            errorMessage.addToDiv();
                            jQuery('#messageModal.errorMessageModal').modal('show');
                            ProfileView.errorMiddle();
                            jQuery('#messageModal.errorMessageModal p').text("Please verify your primary account first");
                            jQuery('#messageModal.errorMessageModal button').click(function () {
                                jQuery('.modal').modal('hide');
                            });
                            return;
                        }
                        
                        if(!validEmail){
                            jQuery('#add_email1').blur();
                            jQuery('body').addClass('page-loaded').removeClass('page-loading');
                            jQuery('body > .pageload').fadeOut();
                            //var errorMessage = ErrorMessage.create();
                            errorMessage.addToDiv();
                            jQuery('#messageModal.errorMessageModal').modal('show');
                            ProfileView.errorMiddle();
                            jQuery('#messageModal.errorMessageModal h4').text('Missing information!');
                            jQuery('#messageModal.errorMessageModal p').text(LanguageUtils.valueForKey("missingSecondaryEmail"));
                            jQuery('#add_email1').val('');
                            jQuery('#messageModal.errorMessageModal button').click(function () {
                                jQuery('.modal').modal('hide');
                            });
                            return;
                        }

                        if (!filter.test(validEmail)) {
                            jQuery('#add_email1').blur();
                            jQuery('body').addClass('page-loaded').removeClass('page-loading');
                            jQuery('body > .pageload').fadeOut();
                            //var errorMessage = ErrorMessage.create();
                            errorMessage.addToDiv();
                            jQuery('#messageModal.errorMessageModal').modal('show');
                            ProfileView.errorMiddle();
                            jQuery('#messageModal.errorMessageModal h4').text('Invalid email address!');
                            jQuery('#messageModal.errorMessageModal p').text(LanguageUtils.valueForKey("invalidSecondaryEmail"));
                            jQuery('#add_email1').val('');
                            jQuery('#messageModal.errorMessageModal button').click(function () {
                                jQuery('.modal').modal('hide');
                            });
                            return;
                        }
                        if (filter.test(validEmail)) {
                            var promiseRequestData = {
                                "email": validEmail,
                                "emailtype": "2",
                                "userid": CookieUtils.getCookie("custId")
                            };
                            var profilePromise = UserService.addsecondaryEmail(promiseRequestData);
                            profilePromise.then(function (data) {
                                jQuery('body').removeClass('page-loaded');
                                jQuery('body > .pageload').fadeOut();
                                console.log(data);

                                if (data.arr_data === null && data.str_status_message !== '') { // when add sec email api returns error show normal error popup
                                    //var errorMessage = ErrorMessage.create();
                                    errorMessage.addToDiv();
                                    jQuery('#messageModal.errorMessageModal').modal('show');
                                    ProfileView.errorMiddle();
                                    jQuery('#messageModal.errorMessageModal h4').text('Incorrect information!');
                                    jQuery('#messageModal.errorMessageModal p').text(data.str_status_message);
                                    //On error popup and clicking ok, remove off the entered text of email, verify button and del acc button for that current div
                                    jQuery('#add_email1').val('');
                                    jQuery('#currentVerify').hide();
                                    jQuery('#currentDelete').hide();


                                } else if (data.arr_data !== null && data.str_status_message !== '') { // when add sec email api returns message to merge the account yes/no popup
                                    var messagesView = MessagesView.create();
                                    messagesView.addToDiv();
                                    jQuery('.merge-message').modal('show');
                                    ProfileView.confirmMessageMiddle();
                                    jQuery('.merge-message .modal-header h4').text('Account already exists!');
                                    jQuery('.merge-message .modal-body p').text(data.str_status_message);

                                    jQuery('#no_merge').click(function () {
                                        jQuery('#add_email1').val('');
                                        jQuery('#currentVerify').hide();
                                        jQuery('#currentDelete').hide();
                                    });

                                    jQuery('#yes_merge').click(function () {
                                        var promiseRequestData = {
                                            "merge_to_customer_id": CookieUtils.getCookie("custId"),
                                            "merge_from_customer_id": data.arr_data.merge_from_customer_id
                                        };
                                        var profilePromise = UserService.mergeRequest(promiseRequestData);
                                        profilePromise.then(function (data) {
                                            console.dir(data);
                                            //var errorMessage = ErrorMessage.create();
                                            errorMessage.addToDiv();
                                            jQuery('#messageModal.errorMessageModal').modal('show');
                                            ProfileView.errorMiddle();
                                            if (data.str_status_message !== "") {
                                                jQuery('#messageModal.errorMessageModal h4').text('Account details added.');
                                                jQuery('#messageModal.errorMessageModal p').text(data.str_status_message);
                                            } else {
                                                jQuery('#messageModal.errorMessageModal h4').text('Error!');
                                                jQuery('#messageModal.errorMessageModal p').text('Something went Wrong! Please try again.');
                                            }
                                            jQuery('#messageModal.errorMessageModal button').click(function () {
                                                jQuery('.modal').modal('hide');
                                                location.reload();
                                            });
                                        });
                                    });
                                } else {
                                    location.reload();
                                }

                            }).fail(function () {
                                console.log('fail');
                            });
                            ProfileView.resetRadius();
                            ProfileView.radius();
                        }
                    }
                });
                jQuery(".delete-secAccount").click(ProfileView.deleteSecondary);
                var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                if (filter.test(DashboardView.userData.email)) {
                    jQuery('.default-email, .add-email').hide();
                    if (CookieUtils.getCookie("is_verified") === '0') {

                    } else {

                    }
                } else {
                    jQuery('.emailDefault, .default-email' /*#enterMobile*/ ).hide();
                    if (CookieUtils.getCookie("is_verified") === '0') {

                    } else {

                    }
                }
                jQuery('#changePassword, #changePasswordText').click(ProfileView.changePass);
                jQuery("#logout").click(function () {
                    GlobalData.ec.recordClickEvent('Profile_view', 'ProfileLogoutButtonClicked');
                    GlobalData.GoogleServiceInitialisation();
                    var requestData = CookieUtils.getCookie("sessionKey");
                    var promise = UserService.logoutUser(requestData);
                    promise.then(function () {}).fail(function () {});
                    CookieUtils.deleteAllCookies();
                    location.hash = "/login";
                });
                jQuery('#myPhotobooks, #myPhotobooksText').click(ProfileView.myPhotobooks);
                jQuery('#myPhotoStory, #myPhotoStoryText').click(ProfileView.myPhotoStory);

                //                alert('email-primary = ' + isEmailPrimary);
                //                alert('mob-primrary = ' + isMobilePrimary);
                //alert(CookieUtils.getCookie("is_verified"));

                //                var mobileDiv = "<div class='field-col2' id='signUpMobileDiv' style='margin-top: 3px;overflow:visible;'>
                //                                <input type='tel' class='form-control telephone-input' autofocus onfocus='this.value = this.value;' id='mobile' style='' placeholder='+1 25646455666'>
                //                                <span class='delMob' style='display: inline;top: 5px;'>X</span></div>";
                //                
                //                jQuery('#enterMobile').after(mobileDiv);

                jQuery('#signUpMobileDiv').hide();

                //jQuery('#signUpMobileDiv').css('overflow', 'visible !important');

                //                jQuery('.intl-tel-input .country-list').css('background-color', 'white !important');
                //                jQuery('.intl-tel-input .country-list').css('color', 'black !important');


                jQuery('.telephone-input').intlTelInput({
                    autoHideDialCode: false,
                    allowDropdown: true,
                    //                defaultCountry: 'auto',
                    initialCountry: 'auto',
                    nationalMode: false,
                    numberType: "MOBILE",
                    autoPlaceholder: true,
                    //onlyCountries: ['us', 'ch', 'ca', 'do'],
                    preferredCountries: ['us'],
                    responsiveDropdown: true,
                    preventInvalidNumbers: true,
                    preventInvalidDialCodes: true,
                    geoIpLookup: function (callback) {
                        jQuery.get("http://ipinfo.io", function () {}, "jsonp").always(function (resp) {
                            var countryCode = (resp && resp.country) ? resp.country : "";
                            callback(countryCode);
                        });
                    },
                    //utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/11.0.11/js/utils.js" // just for formatting/placeholders etc
                    
                });

                var telInput = jQuery("#mobile");
                telInput.trigger("change");
                var mobileData = telInput.intlTelInput("getSelectedCountryData");
                jQuery('.selected-flag .iti-flag').text(mobileData.iso2).css("text-transform", "uppercase");
                telInput.on("change", function () {
                    var mobileData = jQuery("#mobile").intlTelInput("getSelectedCountryData");
                    jQuery('.selected-flag .iti-flag').text(mobileData.iso2).css("text-transform", "uppercase");
                });

                if (CookieUtils.getCookie("is_verified") === '0') {
                    jQuery('.field-verify_default').show();
                    jQuery('.default-email').hide();
                    jQuery('.default-mob').hide();
                    if (isEmailPrimary == 1) {
                        //if(jQuery('.profile-mobile-div'))
                        jQuery('.verify-primary-mobile').hide();
                        jQuery('#add_email1').hide(); // primary is email and unverified, then hide the i/p text box for secondary email
                        jQuery('.add-secondary-div').html('Add another email');
                        jQuery('.del-mobile-sec').hide();
                        jQuery('#enterMobile').css('color', '');
                        jQuery('.verify-sec-mobile').hide();
                    }

                    if (isMobilePrimary == 1) {
                        jQuery('.del-mobile-sec').hide();
                        jQuery('.verify-sec-mobile').hide();
                        jQuery('.del-mobile-sec').hide();
                        jQuery('.default-email').hide();
                        jQuery('.default-mob').hide();
                        jQuery('.mobileDefault').show();
                        jQuery('.mobileDefault').html(ProfileView.profileInfo.email);
                        jQuery('.mobileDefault').css('color', '');
                        jQuery('.add-secondary-div').html('Add another email'); // make add sec email div inactive
                    }
                } else {
                    jQuery('.field-verify_default').hide();
                    if (isEmailPrimary == 1) {
                        jQuery('.default-email').show();
                        jQuery('.default-mob').hide();
                        jQuery('.verify-primary-mobile').hide();
                        jQuery('#add_email1').show(); // primary is email and verified, then show the i/p text box for secondary email
                        jQuery('#enterMobile').css('color', '#29abe2');
                        jQuery('#enterMobile').css('cursor', 'pointer');
                        jQuery('#enterMobile').click(ProfileView.showMobileTextBox);
                        jQuery('.delMob').click(function () {
                            jQuery('#signUpMobileDiv').hide();
                            jQuery('#enterMobile').show();
                            jQuery('#mobile').val('+1'); //when typed something in text box and clicked on cross mark and again opened the text box, the defaults should be restored
                        });

                        if (jQuery('#enterMobile').is(':visible')) {
                            jQuery('.verify-sec-mobile').hide();
                        }
                    }

                    if (isMobilePrimary == 1) {
                        jQuery('.del-mobile-sec').hide();
                        jQuery('.verify-sec-mobile').hide();
                        jQuery('.del-mobile-sec').hide();
                        jQuery('.default-email').hide();
                        jQuery('.default-mob').show();
                        jQuery('.mobileDefault').show();
                        jQuery('.mobileDefault').html(ProfileView.profileInfo.email);
                        jQuery('.mobileDefault').css('color', '');
                    }
                    //jQuery('.default-email').show();

                }

                //jQuery('#verifyNow').click(ProfileView.innerVerify);
                jQuery('.verify-now').click(ProfileView.innerVerify);
                ProfileView.uploadImage();
                jQuery('#delete_account').click(ProfileView.deleteAcc);


            }).fail(function () {});

        };
        this.deleteSecondary = function () {
            ////console.log(jQuery(this).parent().siblings('.field-col2').text());
            ////console.log(jQuery(this).parent().siblings('.field-col2').attr('id'));
            var secEmail = jQuery(this).parent().siblings('.field-col2').text();
            var secId = jQuery(this).parent().siblings('.field-col2').attr('id');
            //if (jQuery(this).parent().siblings('.field-col2').hasClass('add-number')) {
            var profilePromise = '';
            var alertText = '';

            var mobileDelClass = jQuery(this);
            var promiseRequestData;
            if (jQuery(this).hasClass('del-mobile-sec')) {
                console.log("mob clicked");
                var mobile = jQuery('.mobileDefault').text();
                promiseRequestData = {
                    "mobile": mobile,
                    "user_id": CookieUtils.getCookie("custId")
                };
                alertText = LanguageUtils.valueForKey("deleteSecondaryMobile");

            } else {
                promiseRequestData = {
                    "email": secEmail,
                    "emailtype": 2,
                    "id": secId,
                    "userid": CookieUtils.getCookie("custId")
                };

                alertText = LanguageUtils.valueForKey("deleteSecondaryEmail");
            }

            var messagesView = MessagesView.create();
            messagesView.addToDiv();
            jQuery('#messageModal').modal('show');
            ProfileView.confirmMessageMiddle();
            jQuery('#messageModal .modal-header h4').text('Delete account?');
            jQuery('#messageModal .modal-body p').text(alertText);
            jQuery('#confirm_download').text("Delete");
            jQuery('#cancel_btn').text("Cancel");
            jQuery('#confirm_download').click(function () {
                if (mobileDelClass.hasClass('del-mobile-sec')) {
                    profilePromise = UserService.deleteSecondaryMobile(promiseRequestData);
                } else {
                    profilePromise = UserService.deletesecondaryEmail(promiseRequestData);
                }
                profilePromise.then(function (data) {
                    ////console.log(data);
                    if (parseInt(data.int_status_code) === 1) {
                        var errorMessage = ErrorMessage.create();
                        errorMessage.addToDiv();
                        jQuery('#messageModal.errorMessageModal').modal('show');
                        ProfileView.errorMiddle();
                        jQuery('#messageModal.errorMessageModal p').text("Account has been removed successfully!");
                        jQuery('#messageModal.errorMessageModal button').click(function () {
                            jQuery('.modal').modal('hide');
                            location.reload();
                        });
                    }

                }).fail(function () {});
            });
        };
        this.profileHeight = function () {
            var winHeight = jQuery(window).height();
            if (jQuery(window).height() < 600) {
                jQuery('.profile-container').css('min-height', winHeight + "px");
            } else {
                jQuery('.profile-container').css('height', winHeight + "px");
            }

        };
        this.deleteAcc = function () {
            GlobalData.ec.recordClickEvent('Profile_view', 'DeleteAccountButtonClicked');
            var messagesView = MessagesView.create();
            messagesView.addToDiv();
            jQuery('#messageModal').modal('show');
            ProfileView.confirmMessageMiddle();
            jQuery('#messageModal .modal-header h4').text("Delete Account?");
            jQuery('#messageModal .modal-body p').text("Deleting this account will also delete all your stories.");
            jQuery('#confirm_download').text("Proceed");
            jQuery('#cancel_btn').text("Cancel");
            jQuery('#cancel_btn').click(function () {
                GlobalData.ec.recordClickEvent('Profile_view', 'DeleteAccountNoButtonClicked');
            });
            jQuery('#confirm_download').click(function () {
                jQuery('#messageModal').modal('hide');
                GlobalData.ec.recordClickEvent('Profile_view', 'DeleteAccountYesButtonClicked');
                var promiseRequestData = {
                    customer_id: CookieUtils.getCookie("custId")
                };
                var profilePromise = DashboardService.deleteaccount(promiseRequestData);
                profilePromise.then(function () {
                    var errorMessage = ErrorMessage.create();
                    errorMessage.addToDiv();
                    jQuery('#messageModal.errorMessageModal').modal('show');
                    ProfileView.errorMiddle();
                    jQuery('#messageModal.errorMessageModal .modal-header').remove();
                    jQuery('#messageModal.errorMessageModal p').text(LanguageUtils.valueForKey("accountDeleteSuccess"));
                    jQuery('#messageModal.errorMessageModal button').click(function () {
                        CookieUtils.deleteAllCookies();
                        location.hash = "/login";
                        jQuery('.modal').modal('hide');
                    });
                }).fail(function () {});
            });


        };
        this.uploadImage = function () {
            var $uploadCrop;
            $uploadCrop = $('#upload-demo').croppie({
                viewport: {
                    width: 175,
                    height: 175
                },
                boundary: {
                    width: 360,
                    height: 260
                }
            });

            var readURL = function (input) {
                var reader = new FileReader();
                if (input.files && input.files[0]) {

                    var resultPic = "";
                    reader.onload = function (e) {
                        jQuery('.profile-pic').attr('src', e.target.result);
                        jQuery('#profileIcon img').attr('src', e.target.result);
                        resultPic = e.target.result;
                        if (e.target.result) {
                            var formData = new FormData();
                            formData.append('Filedata', jQuery('input[type=file]')[0].files[0]);
                            formData.append('user_id', CookieUtils.getCookie("custId"));
                            var profilePicPromise = DashboardService.changeprofilePic(CookieUtils.getCookie("custId"), formData);
                            profilePicPromise.then(function (data) {
                                //data = JSON.parse(data);
                                //console.dir(data);
                                ProfileView.profilepic = data.arr_data.userpicturepath;
                                CookieUtils.setCookie("custProfilePic", data.arr_data.userpicturepath, GlobalData.expireDays);
                                jQuery('#uploadpaystub').text("Change Photo");
                                jQuery('#profileIcon img').attr("src", ProfileView.profilepic);
                            }).fail(function () {});
                        }
                    };
                    reader.readAsDataURL(input.files[0]);
                    $uploadCrop.croppie('bind', {
                        url: resultPic
                    });
                    $('.upload-demo').addClass('ready');
                }
                reader.readAsDataURL(input.files[0]);
            };

            $('.upload-result').on('click', function (ev) {
                $uploadCrop.croppie('result', {
                    type: 'canvas',
                    size: 'original'
                }).then(function (resp) {
                    popupResult({
                        src: resp
                    });
                });
            });

            function popupResult(result) {
                if (result.html) {
                    jQuery(".profile-pic").attr("src", result.html);
                }
                if (result.src) {
                    jQuery(".profile-pic").attr("src", result.src);
                }
                jQuery('#profileCropModal').modal('hide');
                var formData = new FormData();
                //                            formData.append('section', 'general');
                //                            formData.append('action', 'previewImg');
                formData.append('Filedata', jQuery('input[type=file]')[0].files[0]);
                formData.append('user_id', CookieUtils.getCookie("custId"));

                var profilePicPromise = DashboardService.changeprofilePic(CookieUtils.getCookie("custId"), formData);
                profilePicPromise.then(function (data) {
                    data = JSON.parse(data);
                    ProfileView.profilepic = data.userpicturepath;
                    jQuery('#uploadpaystub').text("Change Photo");
                    jQuery('#profileIcon img').attr("src", ProfileView.profilepic);
                }).fail(function () {});
            };
            jQuery(".file-upload").on('change', function () {
                readURL(this);
                //jQuery('#profileCropModal').modal('show');
                if (jQuery('.cr-slider-wrap').children().hasClass("prfoile-zoomOut")) {} else {
                    jQuery('.cr-slider-wrap').append("<i class='prfoile-zoomOut'></i><i class='prfoile-zoomIn'></i>");
                }
            });
            jQuery(".upload-button, .profile-pic").on('click', function () {
                GlobalData.ec.recordClickEvent('Profile_view', 'AddProfilePictureButtonClicked');
                jQuery(".file-upload").click();
            });
            jQuery('.modal-body').on('click', '.prfoile-zoomOut', function () {
                if (jQuery('.cr-slider').val() > 0.01) {
                    jQuery('.cr-slider').val((jQuery('.cr-slider').val()) - 0.01);
                }
            });
            jQuery('.modal-body').on('click', '.prfoile-zoomIn', function () {
                if (jQuery('.cr-slider').val() < 1.5) {
                    jQuery('.cr-slider').val((jQuery('.cr-slider').val()) + 0.01);
                }
            });
        };

        this.radius = function () {
            jQuery('.accounts-details-div').children().eq(0).css({
                "border-top-left-radius": "8px",
                "border-top-right-radius": "8px"
            });
            jQuery('.accounts-details-div').children().eq(1).css({
                "border-top-left-radius": "8px",
                "border-top-right-radius": "8px"
            });
            var divs_count = jQuery('.accounts-details-div').children().length;
            var last_div, second_last_div;
            last_div = divs_count - 1;
            second_last_div = divs_count - 2;
            jQuery('.accounts-details-div').children().eq(last_div).css({
                "border-bottom-left-radius": "8px",
                "border-bottom-right-radius": "8px"
            });
            jQuery('.accounts-details-div').children().eq(second_last_div).css({
                "border-bottom-left-radius": "8px",
                "border-bottom-right-radius": "8px"
            });

        };
        this.resetRadius = function () {
            jQuery('.accounts-details-div').children().eq(0).css({
                "border-top-left-radius": "0",
                "border-top-right-radius": "0"
            });
            jQuery('.accounts-details-div').children().eq(1).css({
                "border-top-left-radius": "0",
                "border-top-right-radius": "0"
            });
            var divs_count = jQuery('.accounts-details-div').children().length;
            var last_div, second_last_div;
            last_div = divs_count - 1;
            second_last_div = divs_count - 2;
            jQuery('.accounts-details-div').children().eq(last_div).css({
                "border-bottom-left-radius": "0",
                "border-bottom-right-radius": "0"
            });
            jQuery('.accounts-details-div').children().eq(second_last_div).css({
                "border-bottom-left-radius": "0",
                "border-bottom-right-radius": "0"
            });

        };
        this.changePass = function () {

            GlobalData.ec.recordClickEvent('Profile_view', 'ProfileReuestChangePasswordButtonClicked');
            var passwordInner = ChangePasswordInnerView.create();
            passwordInner.addToDiv();
            jQuery('#passwordModal').modal('show');
            ProfileView.passwordMiddle();
        };
        this.innerVerify = function () {

            GlobalData.ec.recordClickEvent('Profile_view', 'ProfileVerifyButtonClicked');
            var accountId = jQuery(this).attr('data');
            var verificationView = VerificationView.create();
            var emailAddress = jQuery("#" + accountId).html();
            VerificationView.account_id = accountId;
            VerificationView.email_address = emailAddress;
            VerificationView.is_merge = jQuery(this).attr('data-merge');
            VerificationView.customer_id = jQuery(this).attr('data-customer');
            verificationView.addToDiv();
            ProfileView.messageMiddle();
        };
        this.messageMiddle = function () {
            var msgContent = ((jQuery(window).height()) - (181)) / 2;
            jQuery('#verifyModal .modal-dialog').css('margin-top', msgContent + 'px');
            jQuery('#verifyModalMobile .modal-dialog').css('margin-top', msgContent + 'px');
        };
        this.errorMiddle = function () {
            var msgContent = ((jQuery(window).height()) - (181)) / 2;
            jQuery('#messageModal.errorMessageModal .modal-dialog').css('margin-top', msgContent + 'px');
        };
        this.passwordMiddle = function () {
            var msgContent = ((jQuery(window).height()) - (300)) / 2;
            jQuery('#passwordModal .modal-dialog').css('margin-top', msgContent + 'px');
        };
        this.confirmMessageMiddle = function () {
            var msgContent = ((jQuery(window).height()) - (181)) / 2;
            jQuery('#messageModal .modal-dialog').css('margin-top', msgContent + 'px');
        };

        this.myPhotobooks = function (event) {
            event.stopPropagation();
            //Query('body').addClass('page-loaded');
            //jQuery('body > .pageload').fadeIn();
            CookieUtils.setCookie("prePath", '#/profile');
            window.onbeforeunload = null;
            location.hash = "/print/order";
        };

        this.myPhotoStory = function (event) {
            event.stopPropagation();
            //location.hash = "/dashboard";
            jQuery('body').addClass('page-loaded');
            jQuery('body > .pageload').fadeIn();
            GlobalData.myStoriesFromProfile = 1;
            location.hash = "/dashboard";
            //                setTimeout(function () {
            //                    DashboardView.showOwnPhotoStory();
            //                    jQuery('body').addClass('page-loaded').removeClass('page-loading');
            //                    jQuery('body > .pageload').fadeOut();
            //                }, 1000);
        };

        this.showMobileTextBox = function () {
            //console.log('text show');
            jQuery('#enterMobile').hide();
            jQuery('#signUpMobileDiv').show();
            //jQuery('.del-mobile-sec').hide();
        };



    });


    return ProfileView;
});