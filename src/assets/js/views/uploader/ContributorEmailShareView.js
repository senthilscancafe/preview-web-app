/*global define, jQuery, window, sendEmailInvite*/

define(['Augment',
    'Instance',
    'GlobalData',
    'PubSub',
    'utils/CookieUtils',
    'hbs!views/uploader/templates/ContributorEmailShareView'
], function (augment, instance, GlobalData, PubSub, CookieUtils, tplContributorEmailShareView) {
    'use strict';
    var ContributorEmailShareView = augment(instance, function () {
        var contributorEmailShareView = this;

        this.addToDiv = function () {
            var divId = "contributorEmailShareView";
            var innerHtml = tplContributorEmailShareView({});
            jQuery('#' + divId).empty();
            jQuery('#' + divId).html(innerHtml);
            jQuery("#shareModal").modal({
                backdrop: 'static',
                keyboard: false
            });
            this.preLoader();

            // code for adding cover caption to subject line and message
            var sub_string = jQuery('#SubjectId').val() + ' ' + GlobalData.orderInfo.title;
            jQuery('#SubjectId').val(sub_string);

            var msg_string = jQuery('#MessageId').val() + ' ' + GlobalData.orderInfo.title;
            jQuery('#MessageId').val(msg_string);


        };

        this.preLoader = function () {
            jQuery('#contributorEmailShareNextBtn').click(contributorEmailShareView.shareEmail);
            //jQuery('#contributorEmailShareNextBtn').click(contributorEmailShareView.shareStoryWithFriendsByEmail);
            jQuery("#backBtn").click(contributorEmailShareView.backToPreviousModal);
            jQuery(".closeModal").click(contributorEmailShareView.closeAllModal);
            jQuery("#emailError").click(contributorEmailShareView.closeErrorModal);
        };

        this.shareEmail = function () {

            if (jQuery('#EmailAndMobileId').val() === '') {
                //jQuery('#EmailAndMobileIdMsg').html('Email ID required')
                jQuery(".errorEmail").modal('show');
            } else {
                var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                var flag = true;
                if (jQuery('#EmailAndMobileId').val().indexOf(',') > -1) {
                    var emailIds = jQuery('#EmailAndMobileId').val().split(',');
                    for (var i = 0; i < emailIds.length; i++) {
                        if (re.test(emailIds[i].trim()) !== true) {
                            flag = false;
                        }
                    }
                } else {
                    if (re.test(jQuery.trim(jQuery('#EmailAndMobileId').val())) !== true) {
                        flag = false;
                    }
                }
                if (flag === true) {
                    if (CookieUtils.getCookie('custEmail') !== jQuery('#EmailAndMobileId').val()) {
                        jQuery('.pageload').fadeIn();
                        var sessionToken = CookieUtils.getCookie("sessionKey");
                        var data = null;
                        /*data = {
                            "order_id": GlobalData.orderInfo.order_id,
                            "email_id_list": jQuery('#EmailAndMobileId').val(),
                            "send_invitation": 1

                        };*/
                        data = {
                            "order_id": GlobalData.orderInfo.order_id,
                            "invitee_list": jQuery('#EmailAndMobileId').val(),
                            "send_invitation": 1,
                            "invitation_mode": "email"

                        };
                        var methodType = "POST";
                        sendEmailInvite(GlobalData.baseUrlNew, data, methodType, function orderSuccess(resp) {
                            if (!resp) {
                                //to do
                            } else {
                                jQuery('.pageload').fadeOut();
                                var hasImage = false;
                                if(GlobalData.fileUploadData.totalCount){
                                    hasImage = true;
                                }
                                contributorEmailShareView.shareStoryWithFriendsByEmail(hasImage);
                                delete GlobalData.orderInfo;
                                delete GlobalData.multiDevice;
                            }
                        }, sessionToken);
                    } else {
                        jQuery("#firstText").html("You cannot send email invitation to yourself");
                        jQuery(".errorEmail").modal('show');
                    }
                } else {
                    jQuery("#firstText").html("Enter a valid Email ID");
                    jQuery(".errorEmail").modal('show');

                }
            }
        };

        this.shareStoryWithFriendsByEmail = function (hasImage) {
            jQuery(".emailShareSuccessModal").modal({
                backdrop: 'static',
                keyboard: false
            });
            var msgContent = ((jQuery(window).height()) - (300)) / 2;
            if(hasImage){
                jQuery(".emailShareSuccessModal p:first").text('We will save your photos now. No need to wait.');
            }
            
            jQuery('.messageModal .modal-dialog').css('margin-top', msgContent + 'px');
            jQuery(".emailShareSuccessModal").on('click', '#emailSentSuccess', function () {
                jQuery('.pageload').fadeIn();
                jQuery(".emailShareSuccessModal").modal('hide');
                PubSub.publish("REDIRECT_TO_DASHBOARD");
            });
        };

        this.backToPreviousModal = function () {
            jQuery("#shareModal").modal('hide');
            jQuery(".inviteFriendsToAddPhotosModal").modal('show');
        };

        this.messageMiddle = function (modalName) {
            setTimeout(function () {
                var modalHeight = jQuery("." + modalName + " .modal-content").height() / 2;
                var msgContent = ((jQuery(window).height()) - (modalHeight)) / 2;
                jQuery('.' + modalName + ' .modal-dialog').css('margin-top', msgContent + 'px');
            }, 50);
        };

        this.closeAllModal = function () {
            jQuery("#shareModal").modal('hide');
        };

        this.closeErrorModal = function () {
            jQuery(".errorEmail").modal('hide');
        };


    });

    return ContributorEmailShareView;
});