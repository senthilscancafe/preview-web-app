/*global define, jQuery, window, document, location*/

define(['Augment',
    'Instance',
    'PubSub',
    'GlobalData',
    'utils/CookieUtils',
    'views/errorMessage/ErrorMessage',
    'services/DashboardService',
    'utils/LanguageUtils',
    'hbs!views/verification/templates/VerificationView'
], function (augment, instance, PubSub, GlobalData, CookieUtils, ErrorMessage, DashboardService, LanguageUtils, tplVerificationView) {

    'use strict';

    var VerificationView = augment(instance, function () {
        var VerificationData;
        this.init = function () {
            var verification = this;
            //this.addToDiv();
            jQuery(window).resize(function () {
                verification.errorMiddle();
            });
        };
        this.addToDiv = function () {
            var divId = "verifyScrModal";
            var innerHtml = tplVerificationView({});
            jQuery('#' + divId).empty();
            jQuery('#' + divId).html(innerHtml);
            this.preloader();
        };
        this.preloader = function () {
            var verificationView = this;
            var promiseRequestData = CookieUtils.getCookie("custId");
            var profilePromise = DashboardService.getprofileDetails(promiseRequestData);
            profilePromise.then(function (data) {
                //console.log('dwdwdwdw');
                //console.dir(data);
                if (data.int_status_code === 0) {
                } else {
                    VerificationData = data.arr_data;
                }
            });
            
            jQuery('#verifyModal #resend_btn').click(verificationView.resendSmsOrEmail);
            jQuery('#verifyModal #verify_code').click(verificationView.errorShow);                  
            jQuery('#verifyModalMobile #resend_btn_mobile').click(verificationView.resendSmsOrEmail);
            jQuery('#verifyModalMobile #verify_code_mobile').click(verificationView.errorShow);      
            
        };

        this.resendSmsOrEmail = function () {
            GlobalData.ec.recordClickEvent('Profile_view', 'ProfileResendVerficationCodeButtonClicked');
            jQuery('body').addClass('page-loaded');
            jQuery('body > .pageload').fadeIn();
            //console.dir(VerificationData);
            var emailAddress = VerificationData.email;
            var emailType = 1;
            var isMerge = VerificationView.is_merge;
            var customerId = VerificationView.customer_id;
            
            if(isMerge === undefined) { // for verifying the primary account when there is no is_merge flag 
                isMerge = 0;
            }
            if(VerificationView.email_address !== undefined) {
                emailAddress = VerificationView.email_address;
                emailType = 2;
            }            
            var requestData = "";
            var promise = "";
            var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            if(parseInt(isMerge) === 0) {
                if (filter.test(VerificationData.email)) {
                    requestData = {
                        userid: CookieUtils.getCookie("custId"),
                        "emailtype": emailType,
                        "email": emailAddress
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
            } else {
                    requestData = {
                        merge_to_customer_id: CookieUtils.getCookie("custId"),
                        "merge_from_customer_id": customerId                        
                    };
                    promise = DashboardService.resendVerificationMergeRequest(requestData);
                    
                    
            }
            promise.then(function () {
                jQuery('body').addClass('page-loaded').removeClass('page-loading');
                jQuery('body > .pageload').fadeOut();
                var errorMessage = ErrorMessage.create();
                errorMessage.addToDiv();
                jQuery('#messageModal.errorMessageModal').modal('show');                
                
                var alertText = LanguageUtils.valueForKey("accountVerificationMobile")+requestData.mobile+".";//todo check why its email param
                
                if (requestData.emailtype) {
                    alertText = LanguageUtils.valueForKey("accountVerificationEmail")+requestData.email+".";
                }
                
                jQuery('#messageModal.errorMessageModal p').text(alertText);
                VerificationView.errorMiddle();
                jQuery('#messageModal.errorMessageModal button').click(function () {
                    //document.location.reload();
                    jQuery('#verifyModal').modal('hide');
                });

            }).fail(function () {

            });
        };
        this.errorShow = function () {
            var accountId = 0;
            var isMerge = 0;
            if(VerificationView.account_id !== undefined) {
               accountId = VerificationView.account_id;
            }

            if(VerificationView.is_merge !== undefined && parseInt(VerificationView.is_merge) === 1) {
               isMerge = 1;
            }
            
            GlobalData.ec.recordClickEvent('Profile_view', 'ProfileVerficationCodeButtonClicked');
                        
            if (jQuery(this).attr('id') == "verify_code" && jQuery("#verifyModal #verifyCode").val() === "") {
                jQuery('#verifyModal .verify-error').show().text("Please enter verification code");
            } else if(jQuery(this).attr('id') == "verify_code_mobile" && jQuery("#verifyModalMobile #verifyCodeMobile").val() === ""){
                jQuery('#verifyModalMobile .verify-error').show().text("Please enter verification code");
            } else {
                jQuery('#verifyModal .verify-error').hide();
                jQuery('#verifyModalMobile .verify-error').hide();
                var verifValue = '';
                if (jQuery(this).attr('id') === "verify_code") {
                    verifValue = jQuery("#verifyModal #verifyCode").val();
                } else {
                    verifValue = jQuery("#verifyModalMobile #verifyCodeMobile").val();
                }
                var promise='';
                if(isMerge === 0) {
                    var requestMergeData = {
                        user_id: CookieUtils.getCookie("custId"),
                        verification_code: verifValue,
                        account_id: accountId
                    };
                    promise = DashboardService.verifyByCode(requestMergeData);
                } else {
                    var customerId = VerificationView.customer_id;
                    var requestVerificationData = {
                        merge_to_customer_id: CookieUtils.getCookie("custId"),
                        verification_code: verifValue,
                        merge_from_customer_id: customerId
                    };
                    promise = DashboardService.mergeRequestProcess(requestVerificationData);
                }
                
                promise.then(function (data) {
                    var errorMessage;
                    if (data.int_status_code === 0) {
                        errorMessage = ErrorMessage.create();
                        errorMessage.addToDiv();
                        VerificationView.errorMiddle();
                        jQuery('#messageModal.errorMessageModal').modal('show');
                        jQuery('#messageModal.errorMessageModal h4').text('Invalid code!');
                        jQuery('#messageModal.errorMessageModal p').text(data.str_status_message);
                        
                        jQuery('#messageModal.errorMessageModal button').click(function () {
                            //document.location.reload();
                            jQuery('#verifyModal').modal('hide');
                        });

                    } else {
                        CookieUtils.setCookie("is_verified", 1, GlobalData.expireDays);
                        jQuery('#verifyModal').modal('hide');
                        jQuery('#verfiyAccount #verfiyAccountMobile, .yellowVerify').hide();
                        errorMessage = ErrorMessage.create();
                        errorMessage.addToDiv();
                        VerificationView.errorMiddle();
                        jQuery('#messageModal.errorMessageModal').modal('show');
                        jQuery('#messageModal.errorMessageModal h4').hide();
                        jQuery('#messageModal.errorMessageModal p').text(LanguageUtils.valueForKey("accountVerified"));
                        console.log('location 3');
                        jQuery('#messageModal.errorMessageModal button').click(function () {
                            console.log('ok btn clicked location 3');
                            var encodedString;
                            if ((CookieUtils.getCookie("personalizedExistingUserDeep")) || (CookieUtils.getCookie("personalizedNewUserDeep"))) {
                                var token = CookieUtils.getCookie("share_tokenDeep");
                                CookieUtils.delete_cookie("personalizedExistingUserDeep");
                                CookieUtils.delete_cookie("personalizedNewUserDeep");
                                encodedString = window.btoa(token);
                                window.location.href = GlobalData.flipbookBaseURL + encodedString;
                            }
                            else {
                                location.hash = "/dashboard";
                                document.location.reload();
                            }

                        });

                    }
                }).fail(function () {

                });
            }
        };
        this.errorMiddle = function () {
            var msgContent = ((jQuery(window).height()) - (181)) / 2;
            jQuery('#messageModal.errorMessageModal .modal-dialog').css('margin-top', msgContent + 'px');
        };


    });

    return VerificationView;
});