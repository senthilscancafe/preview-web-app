/*global define, jQuery*/

define(['Augment',
    'Instance',
    'GlobalData',
    'utils/CookieUtils',
    'utils/LogoutUtils'], function (augment, instance, GlobalData, CookieUtils, LogoutUtils) {
    'use strict';

    var ShareService = augment(instance, function () {
        this.getOrderData = function (dashdata) {
            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrlNew + '/customers/orders/' + dashdata;
            jQuery.ajax({
                url: url,
                dataType: "json",
                contentType: "application/json",
//                data: JSON.stringify(dashbaordData),
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
        this.storeShareInfo = function (dashbaordData) {
            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrlNew + '/sharebook/';
            jQuery.ajax({
                url: url,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(dashbaordData),
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
        this.getShareEmails = function (dashbaordData) {
            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrlNew + '/share/emails/by-order/' + dashbaordData;
            jQuery.ajax({
                url: url,
                dataType: "json",
                contentType: "application/json",
//                data: JSON.stringify(dashbaordData),
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
        this.postemailgroupShare = function (dashbaordData) {
            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrlNew + '/share/group/email';
            jQuery.ajax({
                url: url,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(dashbaordData),
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
        this.postemailgroupShareMobile = function (dashbaordData, session) {
            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrlNew + '/share/group/email';
            jQuery.ajax({
                url: url,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(dashbaordData),
                type: "POST",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('x-api-session-key', session);
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
        this.postemailShare = function (dashbaordData) {
            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrlNew + '/share/public-link-by-email';
            jQuery.ajax({
                url: url,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(dashbaordData),
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

        /*retired api need to remove*/
        this.getAllGroupEmails = function (dashbaordData) {
            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrl + 'app_gateway.php?action=getAllGroupEmails';
            jQuery.ajax({
                url: url,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(dashbaordData),
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
        this.getGroupShareEmails = function (dashbaordData) {
            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrl + 'app_gateway.php?action=getGroupShareEmails';
            jQuery.ajax({
                url: url,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(dashbaordData),
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
        this.updateOrderEventInfodate = function (dashbaordData) {
            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrlNew + '/customers/orders/event-date';
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
        this.deleteShareDetails = function (dashbaordData) {
            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrlNew + '/share/mark-deletion';
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
        this.deleteAllPublicShareLink = function (dashbaordData) {
            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrlNew + '/share/public-link-mark-deletion-all';
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
        this.deletePhotostory = function (dashbaordData) {
            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrlNew + '/customers/story-mark-deletion';
            jQuery.ajax({
                url: url,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(dashbaordData),
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
        /*Facebook share api is reamaning to migrate from serverside*/
        this.facebookShare = function (dashbaordData) {
            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrl2 + 'fbsharenewlink.php';
            jQuery.ajax({
                url: url,
                dataType: "json",
                data: JSON.stringify(dashbaordData),
                type: "POST"         
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
        this.getfacebookprivacyDetails = function (accessToken) {

            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrlNew + '/facebook-privacy/' + accessToken;
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
        
        this.shareContributor = function (requestData, session) {
            var deferred = jQuery.Deferred();
            var url = GlobalData.baseUrlNew + '/share/contributor';
            jQuery.ajax({
                url: url,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(requestData),
                type: "POST",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('x-api-session-key', session);
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
        }

    }), shareService = ShareService.create();

    return shareService;
});
