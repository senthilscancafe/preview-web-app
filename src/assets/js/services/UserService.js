/*global define, jQuery*/

define(['Augment',
    'Instance',
    'GlobalData',
    'utils/CookieUtils',
    'utils/LogoutUtils'], function (augment, instance, GlobalData, CookieUtils, LogoutUtils) {
    'use strict';

    var UserService = augment(instance, function () {

        this.userLogin = function (UserData) {
            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrlNew + '/auth/signin';
            jQuery.ajax({
                url: url,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(UserData),
                type: "PUT",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('version', 2);
                }
            }).done(function (data) {
                deferred.resolve(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                deferred.reject(jqXHR, textStatus, errorThrown);
            });

            return deferred.promise();
        };



        this.userForgotPassowrd = function (UserData) {
            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrlNew + '/auth/forgot-password/' + UserData;
            jQuery.ajax({
                url: url,
                dataType: "json",
//                data: JSON.stringify(UserData),
                type: "GET",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('x-api-session-key', CookieUtils.getCookie("sessionKey"));
                    xhr.setRequestHeader('version', 1);
                }
            }).done(function (data) {
                if (data.int_status_code === 2) {
                    if (data.str_status_message === "Invalid Session key. Please Login again") {
                        LogoutUtils.clearSession();
                    }
                } else {
                    deferred.resolve(data);
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {

                deferred.reject(jqXHR, textStatus, errorThrown);
            });

            return deferred.promise();
        };
        this.logoutUser = function (UserData) {
            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrlNew + '/auth/signout';
            jQuery.ajax({
                url: url,
                dataType: "json",
                type: "delete",
//                headers: {"x-api-session-key": UserData, "version": 1},
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('x-api-session-key', UserData);
                    xhr.setRequestHeader('version', 1);
                }
            }).done(function (data) {
                deferred.resolve(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {

                deferred.reject(jqXHR, textStatus, errorThrown);
            });

            return deferred.promise();
        };
        this.userChangePassowrd = function (UserData) {
            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrlNew + '/auth/change-password';
            jQuery.ajax({
                url: url,
                dataType: "json",
                data: JSON.stringify(UserData),
                type: "PUT",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('x-api-session-key', CookieUtils.getCookie("sessionKey"));
                    xhr.setRequestHeader('version', 1);
                }
            }).done(function (data) {
                deferred.resolve(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {

                deferred.reject(jqXHR, textStatus, errorThrown);
            });

            return deferred.promise();
        };

        

        this.addsecondaryEmail = function(UserData) {
            console.log(UserData);
            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrlNew + '/customers/secondary-email';
            jQuery.ajax({
                url: url,
                dataType: "json",
                data: UserData,
                type: "POST",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('x-api-session-key', CookieUtils.getCookie("sessionKey"));
                    xhr.setRequestHeader('version', 1);
                }
            }).done(function(data) {
                deferred.resolve(data);
            }).fail(function(jqXHR, textStatus, errorThrown) {

                deferred.reject(jqXHR, textStatus, errorThrown);
            });

            return deferred.promise();
        };
        this.deletesecondaryEmail = function(UserData) {
            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrlNew + '/customers/secondary-email';
            jQuery.ajax({
                url: url,
                dataType: "json",
                data: JSON.stringify(UserData),
                type: "DELETE",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('x-api-session-key', CookieUtils.getCookie("sessionKey"));
                    xhr.setRequestHeader('version', 1);
                }
            }).done(function(data) {
                deferred.resolve(data);
            }).fail(function(jqXHR, textStatus, errorThrown) {

                deferred.reject(jqXHR, textStatus, errorThrown);
            });

            return deferred.promise();
        };
        this.deleteSecondaryMobile = function(UserData) {
            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrlNew + '/customers/secondary-mobile-mark-deletion';
            jQuery.ajax({
                url: url,
                dataType: "json",
                data: JSON.stringify(UserData),
                type: "PUT",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('x-api-session-key', CookieUtils.getCookie("sessionKey"));
                    xhr.setRequestHeader('version', 1);
                }
            }).done(function(data) {
                deferred.resolve(data);
            }).fail(function(jqXHR, textStatus, errorThrown) {

                deferred.reject(jqXHR, textStatus, errorThrown);
            });

            return deferred.promise();
        }
        
        this.resetPassword = function (UserData) {
            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrlNew + '/auth/reset-password';
            jQuery.ajax({
                url: url,
                dataType: "json",
                data: JSON.stringify(UserData),
                type: "PUT",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('x-api-session-key', CookieUtils.getCookie("sessionKey"));
                    xhr.setRequestHeader('version', 1);
                }
            }).done(function (data) {
                deferred.resolve(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {

                deferred.reject(jqXHR, textStatus, errorThrown);
            });

            return deferred.promise();
        };
        this.updateHelpInfo = function (UserData) {
            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrlNew + '/contact-us';
            jQuery.ajax({
                url: url,
                dataType: "json",
                data: UserData,
                type: "POST",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('x-api-session-key', CookieUtils.getCookie("sessionKey"));
                    xhr.setRequestHeader('version', 1);
                }
            }).done(function (data) {
                if (data.int_status_code === 2) {
                    if (data.str_status_message === "Invalid Session key. Please Login again") {
                        LogoutUtils.clearSession();
                    }
                } else {
                    deferred.resolve(data);
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {

                deferred.reject(jqXHR, textStatus, errorThrown);
            });

            return deferred.promise();
        };

        this.userRegistration = function (UserData) {
            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrlNew + '/customers/signup';
            
            jQuery.ajax({
                url: url,
                dataType: "json",
                data: UserData,
                type: "POST",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('version', 2);
                }
            }).done(function (data) {
                deferred.resolve(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {

                deferred.reject(jqXHR, textStatus, errorThrown);
            });

            return deferred.promise();
        };
        this.userMobileSignUp = function (UserData) {
            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrlNew + '/customers/signup-mobile';
            jQuery.ajax({
                url: url,
                dataType: "json",
                data: UserData,
                type: "POST",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('version', 2);
                }
            }).done(function (data) {
                if (data.arr_data !== null) {
                    GlobalData.sessionToken = data.arr_data.session_token;
                }
                deferred.resolve(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {

                deferred.reject(jqXHR, textStatus, errorThrown);
            });

            return deferred.promise();
        };
        this.verifyAccountByUserId = function (UserData) {
            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrlNew + '/auth/validate-account';
            jQuery.ajax({
                url: url,
                dataType: "json",
                data: JSON.stringify(UserData),
                type: "PUT",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('x-api-session-key', CookieUtils.getCookie("sessionKey"));
                    xhr.setRequestHeader('version', 1);
                }
            }).done(function (data) {
                deferred.resolve(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {

                deferred.reject(jqXHR, textStatus, errorThrown);
            });

            return deferred.promise();
        };
        this.connectStory = function (UserData) {
            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrlNew + '/share/connected';
            jQuery.ajax({
                url: url,
                dataType: "json",
                data: JSON.stringify(UserData),
                type: "PUT",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('x-api-session-key', CookieUtils.getCookie("sessionKey"));
                    xhr.setRequestHeader('version', 1);
                }
            }).done(function (data) {
                deferred.resolve(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {

                deferred.reject(jqXHR, textStatus, errorThrown);
            });

            return deferred.promise();
        };

//        this.userMobileCheck = function (phoneNumber, countryCode) {
//            var deferred = jQuery.Deferred();
//            var url = "https://libphonenumber.appspot.com/phonenumberparser?number="+phoneNumber+"&country="+countryCode;
//            jQuery.ajax({
//                url: url,
//                dataType: "jsonp",
//                type: "POST"
//            }).done(function (data) {
//                deferred.resolve(data);
//            }).fail(function (jqXHR, textStatus, errorThrown) {
//
//                deferred.reject(jqXHR, textStatus, errorThrown);
//            });
//
//            return deferred.promise();
//        };
        this.userSocialLogin = function (UserData) {
            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrlNew + '/auth/signin-social';
            jQuery.ajax({
                url: url,
                dataType: "json",
                data: JSON.stringify(UserData),
                type: "PUT",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('version', 2);
                }
            }).done(function (data) {
                console.dir(data);
                if (data.arr_data !== null) {
                    GlobalData.sessionToken = data.arr_data.session_token;
                }
                deferred.resolve(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {

                deferred.reject(jqXHR, textStatus, errorThrown);
            });
            return deferred.promise();
        };

        this.userSocialAccount = function (UserData) {
            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrlNew + '/customers/social-account';
            jQuery.ajax({
                url: url,
                dataType: "json",
                data: UserData,
                type: "POST",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('version', 2);
                }
            }).done(function (data) {
                console.dir(data);
                if (data.arr_data !== null) {
                    GlobalData.sessionToken = data.arr_data.session_token;
                }
                deferred.resolve(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {

                deferred.reject(jqXHR, textStatus, errorThrown);
            });
            return deferred.promise();
        };

        this.userMobileLogin = function (UserData) {
            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrlNew + '/auth/signin-mobile';
            jQuery.ajax({
                url: url,
                dataType: "json",
                data: JSON.stringify(UserData),
                type: "PUT",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('version', 2);
                }
            }).done(function (data) {
                //GlobalData.sessionToken = data.arr_data.session_token;
                deferred.resolve(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                deferred.reject(jqXHR, textStatus, errorThrown);
            });
            return deferred.promise();
        };

        this.deletePhotostory = function (dashbaordData) {
            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrlNew + '/customers/orders/cancel';
            jQuery.ajax({
                url: url,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(dashbaordData),
                type: "PUT",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('x-api-session-key', CookieUtils.getCookie("sessionKey"));
                    xhr.setRequestHeader('version', 1);
                }
            }).done(function (data) {
                deferred.resolve(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {

                deferred.reject(jqXHR, textStatus, errorThrown);
            });
            return deferred.promise();
        };
        
        this.addSecondaryMobile = function(UserData) {
            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrlNew + '/customers/secondary-mobile';
            jQuery.ajax({
                url: url,
                dataType: "json",
                data: UserData,
                type: "POST",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('x-api-session-key', CookieUtils.getCookie("sessionKey"));
                    xhr.setRequestHeader('version', 1);
                }
            }).done(function(data) {
                deferred.resolve(data);
            }).fail(function(jqXHR, textStatus, errorThrown) {

                deferred.reject(jqXHR, textStatus, errorThrown);
            });

            return deferred.promise();
        };
        this.deletesecondaryMobile = function(UserData) {
            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrlNew + '/customers/secondary-mobile';
            jQuery.ajax({
                url: url,
                dataType: "json",
                data: JSON.stringify(UserData),
                type: "DELETE",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('x-api-session-key', CookieUtils.getCookie("sessionKey"));
                    xhr.setRequestHeader('version', 1);
                }
            }).done(function(data) {
                deferred.resolve(data);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                deferred.reject(jqXHR, textStatus, errorThrown);
            });

            return deferred.promise();
        };
        
        this.mergeRequest = function(UserData) {
            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrlNew + '/merge-request/send';
            
           jQuery.ajax({
                url: url,
                dataType: "json",
                data: UserData,
                type: "POST",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('x-api-session-key', CookieUtils.getCookie("sessionKey"));
                    xhr.setRequestHeader('version', 1);
                }
            }).done(function(data) {
                deferred.resolve(data);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                deferred.reject(jqXHR, textStatus, errorThrown);
            });

            return deferred.promise();
        };
        
        this.deletePhotostoryByContributor = function (dashbaordData) {
            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrlNew + '/customers/orders/contribution-mark-deletion';
            jQuery.ajax({
                url: url,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(dashbaordData),
                type: "PUT",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('x-api-session-key', CookieUtils.getCookie("sessionKey"));
                    xhr.setRequestHeader('version', 1);
                }
            }).done(function (data) {
                deferred.resolve(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {

                deferred.reject(jqXHR, textStatus, errorThrown);
            });
            return deferred.promise();
        };

        this.updateFeedbackInfo = function (requestData) {
            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrlNew + '/feedback';
            jQuery.ajax({
                url: url,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(requestData),
                type: "POST",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('x-api-session-key', CookieUtils.getCookie("sessionKey"));
                    xhr.setRequestHeader('version', 1);
                }
            }).done(function (data) {
                deferred.resolve(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {

                deferred.reject(jqXHR, textStatus, errorThrown);
            });
            return deferred.promise();
        };
        
    }), userService = UserService.create();

    return userService;
});
