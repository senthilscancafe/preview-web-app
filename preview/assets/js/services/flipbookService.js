/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var getCookie = function (cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};
var feedback = function (UserData) {
    var deferred = jQuery.Deferred();
//    console.log(UserData);
    var url = baseUrlNew + 'customers/orders/feedback';
    jQuery.ajax({
        url: url,
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(UserData),
        type: "POST",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('x-api-session-key', getCookie("sessionKey"));
            xhr.setRequestHeader('version', 1);
        }
    }).done(function (data) {
        deferred.resolve(data);
    }).fail(function (jqXHR, textStatus, errorThrown) {

        deferred.reject(jqXHR, textStatus, errorThrown);
    });

    return deferred.promise();
};

var likesFetch = function (spreadId) {
    var deferred = jQuery.Deferred();
    var url = baseUrlNew + 'share/spreads/likes/' + spreadId;
    jQuery.ajax({
        url: url,
        dataType: "json",
        contentType: "application/json",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('x-api-session-key', getCookie("sessionKey"));
            xhr.setRequestHeader('version', 1);
        }
    }).done(function (data) {
        deferred.resolve(data);
    }).fail(function (jqXHR, textStatus, errorThrown) {

        deferred.reject(jqXHR, textStatus, errorThrown);
    });

    return deferred.promise();
};
var commentsFetch = function (spreadId, customer_id) {
    var deferred = jQuery.Deferred();
    var url = baseUrlNew + 'share/spreads/comments/' + spreadId + '/' + customer_id;
    jQuery.ajax({
        url: url,
        dataType: "json",
        contentType: "application/json",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('x-api-session-key', getCookie("sessionKey"));
            xhr.setRequestHeader('version', 1);
        }
    }).done(function (data) {
        deferred.resolve(data);
    }).fail(function (jqXHR, textStatus, errorThrown) {

        deferred.reject(jqXHR, textStatus, errorThrown);
    });

    return deferred.promise();
};

var updateLike = function (UserData) {
    var deferred = jQuery.Deferred();
//    console.log(UserData);
    var url = baseUrlNew + 'customers/books/likes';
    jQuery.ajax({
        url: url,
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(UserData),
        type: "PUT",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('x-api-session-key', getCookie("sessionKey"));
            xhr.setRequestHeader('version', 1);
        }
    }).done(function (data) {
        deferred.resolve(data);
    }).fail(function (jqXHR, textStatus, errorThrown) {

        deferred.reject(jqXHR, textStatus, errorThrown);
    });

    return deferred.promise();
};
var updateComment = function (UserData) {
    var deferred = jQuery.Deferred();
//    console.log(UserData);
    var url = baseUrlNew + 'customers/books/comments';
    jQuery.ajax({
        url: url,
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(UserData),
        type: "PUT",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('x-api-session-key', getCookie("sessionKey"));
            xhr.setRequestHeader('version', 1);
        }
    }).done(function (data) {
        deferred.resolve(data);
    }).fail(function (jqXHR, textStatus, errorThrown) {

        deferred.reject(jqXHR, textStatus, errorThrown);
    });

    return deferred.promise();
};
var backcoverAPIRequest = function (userData) {
    var deferred = jQuery.Deferred();
//    console.log(UserData);
    var url = baseUrlNew + 'share/order-image-urls/backcover/' + userData;
    jQuery.ajax({
        url: url,
        dataType: "json",
        contentType: "application/json",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('x-api-session-key', getCookie("sessionKey"));
            xhr.setRequestHeader('version', 1);
        }
    }).done(function (data) {
        deferred.resolve(data);
    }).fail(function (jqXHR, textStatus, errorThrown) {

        deferred.reject(jqXHR, textStatus, errorThrown);
    });
    return deferred.promise();
};
var connectStory = function (UserData) {
    var deferred = jQuery.Deferred();
    var url = baseUrlNew + 'share/connected';
    jQuery.ajax({
        url: url,
        dataType: "json",
        data: JSON.stringify(UserData),
        type: "PUT",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('x-api-session-key', getCookie("sessionKey"));
            xhr.setRequestHeader('version', 1);
        }
    }).done(function (data) {
        deferred.resolve(data);
    }).fail(function (jqXHR, textStatus, errorThrown) {

        deferred.reject(jqXHR, textStatus, errorThrown);
    });
    return deferred.promise();
};

var getProducts = function (customer_id) {
    var deferred = jQuery.Deferred();
    var url = baseUrlNew + '/customers/print-orders/product/' + customer_id;
    jQuery.ajax({
        url: url,
        dataType: "json",
        contentType: "application/json",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('x-api-session-key', getCookie("sessionKey"));
            xhr.setRequestHeader('version', 2);
        }
    }).done(function (data) {
        if (data.int_status_code === 2) {
            if (data.str_status_message === "Invalid Session key. Please Login again") {
                console.log('Invalid Session key. Please Login again');//TODO handle it
                //printService.sessionOut();
            }
        } else {
            deferred.resolve(data);
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {

        deferred.reject(jqXHR, textStatus, errorThrown);
    });
    return deferred.promise();
};

var getGeoLocation = function () {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: "https://freegeoip.net/json/",
            dataType: "json",
            method: "GET",
            success: function(response) {
                resolve(response);
            },
            error: function(req, status, err) {
                if(!err){
                    err = 'Could not retrieve user location.';
                }
            reject(err);
            }
        });
  });
};