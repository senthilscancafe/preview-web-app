/*global define, jQuery*/

define(['Augment',
    'Instance',
    'GlobalData',
    'PubSub',
    'utils/CookieUtils',
    'utils/LogoutUtils',
], function (augment, instance, GlobalData, PubSub, CookieUtils, LogoutUtils) {
    'use strict';

    var DashboardService = augment(instance, function () {
            CookieUtils.getCookie("sessionKey");
            this.dashboardData = function (dashboardData) {
                    var deferred = jQuery.Deferred();
                    var url = GlobalData.baseUrlNew + '/customers/dashboard/' + dashboardData.toString();
                    jQuery.ajax({
                        url: url,
                        dataType: "json",
                        contentType: "application/json",
                        type: "GET",
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('x-api-session-key', CookieUtils.getCookie("sessionKey"));
                            xhr.setRequestHeader('version', 1);
                        }
                    }).done(function (data) {
                        if (data.int_status_code === 2 || data.int_status_code === 0) {
                            if (data.str_status_message === "Invalid Session key. Please Login again") {
                                console.log("Invalid Session key. Please Login again");
                                LogoutUtils.clearSession();
                            } else {
                                console.log("Invalid customer Id");
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
            this.uploadOrderPossibilty = function (UserData) {
                var deferred = jQuery.Deferred();
                var url = GlobalData.baseUrlNew + '/orders/upload-order-possibility';
                jQuery.ajax({
                    url: url,
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(UserData),
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
            this.deleteaccount = function (requestData) {
                var deferred = jQuery.Deferred();
                var url = GlobalData.baseUrlNew + '/customers/';
                jQuery.ajax({
                    url: url,
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(requestData),
                    type: "DELETE",
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
            this.verifyByCode = function (requestData) {
                var deferred = jQuery.Deferred();
                var url = GlobalData.baseUrlNew + '/verification/by-code';
                jQuery.ajax({
                    url: url,
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(requestData),
                    type: "PUT",
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
            this.resendVerificationSms = function (requestData) {
                var deferred = jQuery.Deferred();
                var url = GlobalData.baseUrlNew + '/verification/send-sms';
                jQuery.ajax({
                    url: url,
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(requestData),
                    type: "PUT",
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
            this.resendverficationEmail = function (requestData) {
                var deferred = jQuery.Deferred();
                var url = GlobalData.baseUrlNew + '/verification/send-email';
                jQuery.ajax({
                    url: url,
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(requestData),
                    type: "PUT",
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
            this.getprofileDetails = function (requestData) {
                var deferred = jQuery.Deferred();
                var url = GlobalData.baseUrlNew + '/customers/profile/' + requestData;
                jQuery.ajax({
                    url: url,
                    dataType: "json",
                    contentType: "application/json",
                    //                data: JSON.stringify(),
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
            this.changeprofilePic = function (requestData, formData) {
                var deferred = jQuery.Deferred();

                var url = GlobalData.baseUrlNew + '/customers/profile-pic';
                jQuery.ajax({
                    url: url,
                    data: formData,
                    type: "POST",
                    contentType: false,
                    processData: false,
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
            this.tokenStatus = function (UserData) {
                var deferred = jQuery.Deferred();
                var url = GlobalData.baseUrlNew + '/customers/verification-status/' + UserData;
                jQuery.ajax({
                    url: url,
                    dataType: "json",
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

            this.mergeRequestProcess = function (UserData) {
                var deferred = jQuery.Deferred();
                var url = GlobalData.baseUrlNew + '/merge-request/process';

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

            this.resendVerificationMergeRequest = function (requestData) {
                var deferred = jQuery.Deferred();
                var url = GlobalData.baseUrlNew + '/merge-request/resend';
                jQuery.ajax({
                    url: url,
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(requestData),
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

        }),
        dashboardService = DashboardService.create();
    return dashboardService;
});