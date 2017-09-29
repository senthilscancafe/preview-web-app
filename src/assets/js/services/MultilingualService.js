/*global define*/

define(['Augment', 'Instance'], function (augment, instance) {
    'use strict';

    var MultilingualService = augment(instance, function () {


            this.getLocalizationValues = function (ln) {
                if (ln === "fr") {
                    return {

                    };

                }
                // Default english
                return {
                    "Dashboard": "Dashboard",
                    "NewPhotostory": "New Photostory",
                    "StartANewPhotostory": "Start a New Photostory",
                    "VerifyAccountHeader": "Verify account - Click on the link sent in email or",
                    "Login": "Login",
                    "Ok": "Ok",
                    "Resend": "Resend",
                    "Logout": "Logout",
                    "ViewAllPhotostories": "View All Photostories",
                    "ViewMyPhotostories": "View My Photostories",
                    "ViewSharedPhotostories": "View Shared Photostories",
                    "Settings": "Settings",
                    "Help": "Help",
                    "loginLowerCase": "Login",
                    "loginUpperCase": "Login",
                    "signupLowerCase": "Signup",
                    "signupUppderCase": "Signup",
                    "accountlogin": "Account Login",
                    "forgotpassword": "Forgot password?",
                    "donthaveaccount": "Don't have an account?",
                    "rememberme": "Remember Me",
                    "emailInvalid": "Email Address is invalid",
                    "mobileInvalid": "Mobile number is invalid",
                    "enterEmailAddress": "Please enter email address",
                    "accountsignup": "Account Signup",
                    "acceptance": "By clicking on Signup, you agree to our",
                    "terms": "Term of Services",
                    "privacy": "Privacy Policy",
                    "andOur": "and our",
                    "alreadyhaveaccount": "Already have an account?",
                    "email": "Email",
                    "mobile": "Mobile",
                    "emailaddress": "Email Address",
                    "password": "Password",
                    "confirmpassword": "Confirm Password",
                    "emailormobile": "Email Address or Mobile",
                    "forgotyourpassword": "Forgot your Password?",
                    "forgotpasswordInstuctions": "Enter the email address or Mobile Number associated with your PhotoGurus account. You will receive an email with a secure link to set your new password.",
                    "resetpassword": "Reset Password",
                    "checkyouremail": "Please check your mail for new password.",
                    "changeyourpassword": "Change your Password?",
                    "newpassword": "New Password",
                    "changepassword": "Change Password",
                    "passwordchanged": "Password changed successfully.",
                    "searchphotostory": "Search Photostories by Name",
                    "EditProfile": "My account",
                    "shareUppercase": "SHARED",
                    "withshare": "with",
                    "sharemore": "Share more",
                    "removepubliclinks": "Disable share links",
                    "order": "ORDER",
                    "photobook": "photo book",
                    "edit": "EDIT",
                    "photostory": "photo story",
                    "save": "SAVE",
                    "todevice": "to device",
                    "remove": "REMOVE",
                    "delete": "DELETE",
                    "fromgallery": "from gallery",
                    "addnew": "Add New",
                    "sharedwith": "Shared with",
                    "sharedthrough": "Shared through:",
                    "sharedon": "Shared on:",
                    "Share": "Share",
                    "PrivateShare": "Private Share",
                    "Requireslogin": "Requires login to view",
                    "selectDeslectInstructions": "All the pages in this story will be shared. If you do not want to share some pages, de-select / uncheck them.",
                    "next": "NEXT",
                    "EmailorMobileNumber": "Mobile Number",
                    "SeparateEmailaddressesOrMobile": "Separate mobile numbers by comma",
                    "SeprateEmailaddresses": "Separate email addresses by comma",
                    "Subject": "Subject",
                    "Message": "Message",
                    "Checkoutmystory": "Check out my photo story",
                    "hello": "Hello,",
                    "textareaMessageStart": "Have a look at my photo story ",
                    "textareaMessageEnd": "made for me by Photogurus.",
                    "From": "From",
                    "ToEmail": "To",
                    "Tagyourfriends": "Tag your friends",
                    "withFriends": "With:",
                    "SelectWhoCanSee": "Select who can see this photo story on facebook:",
                    "Friends": "Friends",
                    "Self": "Self",
                    "deleteAccount": "Delete Account",
                    "Notifications": "Notifications",
                    "PhotoStoryStatus": "Photo Story Status",
                    "uploadPaused": "Upload Paused - Bad Network Connection!",
                    "noNetwork": "Upload Paused - No Network Connection!",
                    "stopUpload": "Are you sure you want to logout? You have an upload in progress. It will be canceled if you logout.",
                    "addMorePhotos": "Add Photos",
                    "designMyStory": "Design my Story",
                    "transferMsg": "Some of your photos are still being transferred. Do you want us to stop transferring those photos and design your story without them?",
                    "deleteImageSetMsg": "Photos cannot be restored after deletion. ",
                    "addPhotosFromDevice": "Do you want to add photos from another device?",
                    "contributor1stVisitText": "Please select photos from any source above. Maximum is 1000",
                    "printNumberOfPagesMoreNote1": "There are more pages in this story than we can print on a ",
                    "printNumberOfPagesMoreNote2": ". please uncheck ",
                    "printNumberOfPagesMoreNote3": " sets of pages(spreads) to print your book.",
                    "printCoverImageNote": "Cover cannot be deselected.",
                    "printBlankImageNote": "Blank spreads cannot be deselected.",
                    "printSpreadSelectionNote1": "Minimum book size is ",
                    "printSpreadSelectionNote2": " pages. if you don't select more pages, you will have blank pages in the book.",

                    //forgotPassword
                    "invalidMobile" : "Please enter a valid email address/mobile number or signup for a new account.",
                    "invalidEmail" : "Please enter a valid email address/mobile number or signup for a new account.",

                    //changePassword
                    "changePasswordOldFieldEmpty" : "Please enter the old password.",
                    "changePasswordNewFieldEmpty" : "Please enter the new password.",
                    "changePasswordConfirmFieldEmpty" : "Please confirm your new password.",
                    "changePasswordNotSame" : "Please enter the same password.",
                    "changePasswordInvalidLength" : "Password length must be between 6-10 characters.",

                    //accountVerification
                    "accountVerificationEmail" : "We have resent your code on your email address ",
                    "accountVerificationMobile" : "We have resent your code on your mobile number ",
                    "accountVerified" : "Your account has been verified.",

                    //profile
                    "missingSecondaryMobile" : "Please enter a mobile number.",
                    "invalidSecondaryMobile" : "Please enter a valid mobile number.",
                    "deleteSecondaryMobile" : "Deleting this account will remove all shared stories belonging to this account.",
                    
                    "deleteSecondaryEmail" : "Deleting this account will remove all shared stories belonging to this account.",
                    "missingSecondaryEmail" : "Please enter an email address.",
                    "invalidSecondaryEmail" : "Please enter a valid email address.",

                    "accountDeleteSuccess" : "Account deleted."
                };

            };

        }),
        multilingualService = MultilingualService.create();

    return multilingualService;
});