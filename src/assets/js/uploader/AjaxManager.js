function createOrder(baseurl, data, methodType, orderSuccess, sessionToken) {
    var options = {
        url: baseurl + "/customers/orders/",
        dataType: "json",
        method: methodType,
        data: data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('x-api-session-key', sessionToken);
            xhr.setRequestHeader('version', 1);
        }
    };
    $.ajax(options).success(function (resp) {
        if (resp.int_status_code == 1) {
            if (resp.arr_data !== null) {
                orderSuccess(resp.arr_data.order_id, resp.arr_data.image_set_source_info, resp.arr_data);
            } else {
                orderSuccess();
            }

        }
    }).fail(function (resp) {});

}

function getIp(getIpSuccess) {
    var options = {
        url: "https://freegeoip.net/json/",
        dataType: "json",
        method: "GET"
    };
    jQuery.ajax(options).success(function (resp) {
        getIpSuccess(resp.ip);
    }).fail(function (resp) {});
}

/*function getGeoLocation(getGeoLocationSuccess) {
    var options = {
        url: "https://freegeoip.net/json/",
        dataType: "json",
        method: "GET"
    };
    jQuery.ajax(options).success(function (resp) {
        getGeoLocationSuccess(resp);
    }).fail(function (resp) {});
}*/

/*var getGeoLocation = function () {
  var defer = $.Deferred();
 
  $.ajax({
    url: "https://freegeoip.net/json/",
    dataType: "json",
    method: "GET",
    success: function(response) {
      defer.resolve(response);
    },
    error: function(req, status, err) {
      defer.reject(err);
    }
  });
 
  return defer.promise();
}*/

var getGeoLocation = function () {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: "https://freegeoip.net/json/",
            dataType: "json",
            method: "GET",
            success: function(response) {
                //console.log('1+'+response);
            resolve(response);
            },
            error: function(req, status, err) {
                console.log('2+'+req+'--'+status+'--'+err);
                if(!err){
                    err = 'Could not retrieve user location.';
                }
            reject(err);
            //resolve(err);
            }
        });
  });
};


function cancelPhotostory(baseurl, data, sessionToken, successCallback) {
    var options = {
        url: baseurl + "/customers/orders/cancel",
        dataType: "json",
        method: "PUT",
        data: JSON.stringify(data),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('x-api-session-key', sessionToken);
            xhr.setRequestHeader('version', 1);
        }
    };
    $.ajax(options).success(function (resp) {
        if (resp.int_status_code === 1) {
            successCallback(resp);
        }
    }).fail(function (resp) {});

}

function finishOrder(baseurl, data, sessionToken, successCallback, errorCallback) {
    var options = {
        url: baseurl + "/customers/orders/image-sets/image-transfer-completion",
        dataType: "json",
        method: "PUT",
        data: JSON.stringify(data),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('x-api-session-key', sessionToken);
            xhr.setRequestHeader('version', 1);
        }
    };
    $.ajax(options).success(function (resp) {
        if (resp.int_status_code === 1) {
            successCallback();
            jQuery("#uploader-details-modal").modal('hide');
            $.magnificPopup.close();
        } else {}
    }).fail(function (resp) {
        errorCallback(resp);
    });
}


function uploadSocialPhotos(baseUrl, input, sessionToken, successCallback, errorCallback) {
    $.ajax({
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        url: baseUrl,
        data: input,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('x-api-session-key', sessionToken);
            xhr.setRequestHeader('version', 1);
        },
        success: function (data) {
            if (data["Success"] === true) {
                successCallback(data["Message"]);
            } else {
                errorCallback("error");
            }
        },
        error: function (data) {
            errorCallback("error");
        }
    });
}

function createImageSet(baseUrl, input, sessionToken, successCallback, errorCallback) {
    $.ajax({
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        url: baseUrl + "/customers/orders/image-sets",
        data: input,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('x-api-session-key', sessionToken);
            xhr.setRequestHeader('version', 1);
        },
        success: function (data) {
            successCallback(data);
        },
        error: function (data) {
            errorCallback("error");
        }

    });
}

function convertSCMDtoMCMD(baseurl, data, methodType, orderSuccess, sessionToken) {
    var options = {
        url: baseurl + "/customers/orders/story-design-mode-conversion",
        dataType: "json",
        method: methodType,
        data: data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('x-api-session-key', sessionToken);
            xhr.setRequestHeader('version', 1);
        }
    };
    $.ajax(options).success(function (resp) {
        console.log('convertSCMDtoMCMD API call');
        console.dir(resp);
        orderSuccess(resp);
    }).fail(function (resp) {});

}

function sendEmailInvite(baseurl, data, methodType, orderSuccess, sessionToken) {
    var options = {
        url: baseurl + "/customers/orders/image-contribution-invitee-list",
        dataType: "json",
        method: methodType,
        data: data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('x-api-session-key', sessionToken);
            xhr.setRequestHeader('version', 1);
        }
    };
    $.ajax(options).success(function (resp) {
        if (resp.int_status_code == 1) {
            orderSuccess(true);
        } else {
            orderSuccess();
        }
    }).fail(function (resp) {});

}