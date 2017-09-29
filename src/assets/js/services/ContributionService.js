/*global define, jQuery*/

define(['Augment',
    'Instance',
    'GlobalData',
    'utils/CookieUtils',
    'utils/LogoutUtils'
], function (augment, instance, GlobalData, CookieUtils, LogoutUtils) {
    'use strict';

    var ContributionService = augment(instance, function () {
            this.getContributLinkDashModule = function (dashdata) {
                //console.dir(dashdata);
                var deferred = jQuery.Deferred();
                var url = GlobalData.baseUrlNew + '/customers/orders/information/' + dashdata.order_id + '/' + dashdata.customer_id;
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
                        //console.log(data);
                        deferred.resolve(data);
                    }
                }).fail(function (jqXHR, textStatus, errorThrown) {

                    deferred.reject(jqXHR, textStatus, errorThrown);
                });
                return deferred.promise();
            };

            this.getOrderInformation = function (dashdata) {
                //console.dir(dashdata);
                var deferred = jQuery.Deferred();
                var url = GlobalData.baseUrlNew + '/customers/orders/information/' + dashdata.order_id;
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
                        //console.log(data);
                        deferred.resolve(data);
                    }
                }).fail(function (jqXHR, textStatus, errorThrown) {

                    deferred.reject(jqXHR, textStatus, errorThrown);
                });
                return deferred.promise();
            };

            this.getContributedImageSetData = function (dashdata) {
                //console.dir(dashdata);
                var deferred = jQuery.Deferred();
                var url = GlobalData.baseUrlNew + '/customers/orders/image-sets/information/' + dashdata.order_id + '/' + dashdata.customer_id;

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
                        //console.log(data);
                        deferred.resolve(data);
                    }
                }).fail(function (jqXHR, textStatus, errorThrown) {

                    deferred.reject(jqXHR, textStatus, errorThrown);
                });
                return deferred.promise();
            };


            this.cancelImageSetData = function (imageSetData) {
                var deferred = jQuery.Deferred();
                var url = GlobalData.baseUrlNew + '/customers/orders/image-sets/cancel';
                jQuery.ajax({
                    url: url,
                    dataType: "json",
                    contentType: "application/json",
                    data: imageSetData,
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
                        //console.log(data);
                        deferred.resolve(data);
                    }
                }).fail(function (jqXHR, textStatus, errorThrown) {

                    deferred.reject(jqXHR, textStatus, errorThrown);
                });
                return deferred.promise();
            };
            this.getOrderStatus = function (orderId) {
                var deferred = jQuery.Deferred();
                var url = GlobalData.baseUrlNew + '/customers/orders/status/' + orderId;
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
                        //console.log(data);
                        deferred.resolve(data);
                    }
                }).fail(function (jqXHR, textStatus, errorThrown) {

                    deferred.reject(jqXHR, textStatus, errorThrown);
                });
                return deferred.promise();
            };
            this.connectContributionStory = function (data) {
                var deferred = jQuery.Deferred();
                var url = GlobalData.baseUrlNew + '/customers/orders/image-contribution-invitation'
                jQuery.ajax({
                    url: url,
                    dataType: "json",
                    contentType: "application/json",
                    type: "POST",
                    data: JSON.stringify(data),
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
                        //console.log(data);
                        deferred.resolve(data);
                    }
                }).fail(function (jqXHR, textStatus, errorThrown) {

                    deferred.reject(jqXHR, textStatus, errorThrown);
                });
                return deferred.promise();
            };

            this.contributeImages = function (data) {
                var deferred = jQuery.Deferred();
                var url = GlobalData.baseUrlNew + '/customers/orders/image-contribution-notification'
                jQuery.ajax({
                    url: url,
                    dataType: "json",
                    contentType: "application/json",
                    type: "POST",
                    data: JSON.stringify(data),
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
                        //console.log(data);
                        deferred.resolve(data);
                    }
                }).fail(function (jqXHR, textStatus, errorThrown) {

                    deferred.reject(jqXHR, textStatus, errorThrown);
                });
                return deferred.promise();
            };


        }),
        contributionService = ContributionService.create();

    return contributionService;
});