/*global $, window, Dropbox, console*/
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {
    //	'use strict';
    var totalCount = 0;
    var flickerCounter = 0;
    $('.loadingPhotogurusBody').show();

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    var setCookie = function (cname, cvalue, exdays) {
        var d = new Date();
        // (number*days)
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        var co = cname + "=" + cvalue + ";";
        co += "path=/;";
        co += expires;
        document.cookie = co;
    };
    window.opener.$('#flickrModal').modal('show');

    var accessToken = getCookie("accessToken");
    var nsid = getCookie("nsid");
    var username = getCookie("username");
    var fullname = getCookie("fullname");

    setCookie('fAccessToken', accessToken, 1);
    setCookie('fNsid', nsid, 1);
    setCookie('fUsername', username, 1);
    setCookie('fFullname', fullname, 1);
    window.close();

    //      $api_key = "c3c818aad23f6b04afe80c33b24c1d65";
    //      $api_secret = "2c80393d57ff9bad";
    //local prashant
    //    var apikey = "c3c818aad23f6b04afe80c33b24c1d65";
    //    var secret = "2c80393d57ff9bad";
    //    sdt/dev
    //    var apikey = "c3c818aad23f6b04afe80c33b24c1d65";
    //    var secret = "2c80393d57ff9bad";
    // photogurus dev scancafe.com
    //    var apikey = "b0ec1fb321ca77eb25ee6e1704ea5bc0";
    //    var secret = "a6b2003525500438";
    //    
    //uat
    var apikey = "99f77e566f9ba0cf50ded6750e8b2286";
    var secret = "39b731e8bc3d116c";

    var apisig = "";
    var FlickerAlbumId = "";
    var flickrAlbumText = '';
    apisig = $.md5(secret + "api_key" + apikey + "auth_token" + accessToken + "formatjsonmethodflickr.photosets.getListprimary_photo_extrasurl_t");
    //  apisig = $.md5("method=flickr.photosets.getListsecret" + secret + "api_key" + apikey + "format=jsonnojsoncallback=1auth_token" + accessToken);
    var callbackUrl = window.location.href;
    var callbackMsgUrl = callbackUrl.split('?');

    function stateChanged() {
        if (xmlhttp.readyState == 4) {
            function jsonFlickrApi(response) {
                $('#flickerModal').modal('show');
                $("#importSelectFlickerPhotosId").hide();
                $('.loadingPhotogurusBody').hide();
                photosets = response.photosets.photoset;
                if (photosets.length > 1) {
                    flickrAlbumText = "Flickr Albums";
                    $("#fbInnerTitle").text("Flickr Albums");
                } else {
                    flickrAlbumText = "Flickr Album";
                    $("#fbInnerTitle").text("Flickr Album");
                }
                var t_url;
                var node = $("<div/>").attr("id", "root").addClass('flickerModalAlbum');
                node.appendTo($("#flickerAlbumCollection"));
                node.append($("<img/>").addClass('fb-albums-thumb').attr('src', "../assets/images/flickerRootAlbum.png"));
                node.append($('<div/>').text("Root").addClass('file-title'));
                $.each(photosets, function (index, photo) {
                    //t_url = "http://farm" + photo.farm + ".static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_" + "t.jpg";
                    var node = $("<div/>").attr("id", photo.id).addClass('flickerModalAlbum');
                    node.appendTo($("#flickerAlbumCollection"));
                    node.append($("<div/>").addClass('fb-albums-thumb').css({
                        'background-image': 'url(' + photo.primary_photo_extras.url_t + ')',
                        'background-position': 'center center'
                    }));
                    node.append($('<div/>').text(photo.title._content).addClass('file-title'));
                });

                $(".back").hide();
            }
            var jsonResponse = xmlhttp.responseText;
            eval(jsonResponse);
            $("#flickerAlbumCollection .flickerModalAlbum").on('click', function () {
                $(".choose").hide();
                $(".flickerModalAlbum-focus").removeClass("flickerModalAlbum-focus");
                $(".rightArrow").removeClass("rightArrow");
                FlickerAlbumId = $(this).attr('id');
                //loadPhotos(albumId);
                $("#fbInnerTitle").text($(this).text());
                $(this).addClass("flickerModalAlbum-focus");
                $(".flickerModalAlbum-focus").addClass("rightArrow");
            });
        }
    }

    function GetXmlHttpObject() {
        // IE7+, Firefox, Chrome, Opera, Safari
        if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        }

        //IE5, IE6
        if (window.ActiveXObject) {
            return new ActiveXObject("Microsoft.XMLHTTP");
        }
        return null;
    }
    if (callbackMsgUrl[1] === "success=true") {
        var xmlhttp;
        xmlhttp = GetXmlHttpObject();
        if (xmlhttp === null) {
            return;
        }
        xmlhttp.onreadystatechange = stateChanged;
        xmlhttp.open("GET", "https://api.flickr.com/services/rest/?api_sig=" + apisig + "&api_key=" + apikey + "&auth_token=" + accessToken + "&format=json&method=flickr.photosets.getList&primary_photo_extras=url_t", true);
        xmlhttp.send(null);
        var photosets = "";




    }

    $("#selPhototsFlickerAlbum").click(function () {
        $('.loadingPhotogurusBody').show();
        $("#importSelectFlickerPhotosId").show();
        $("#flickerSelectedAlbumPhotosCollection").show();
        $("#addfbphotos").show();
        $("#flickerAlbumCollection").hide();
        $("#import").hide();
        $(".back").show();
        $(".flickerModalAlbum-focus").removeClass("flickerModalAlbum-focus");
        $(".choose").show();
        $(".rightArrow").removeClass("rightArrow");
        nsid = nsid.replace("%40", "@");
        if (FlickerAlbumId == "root") {
            apisig = $.md5(secret + "api_key" + apikey + "auth_token" + accessToken + "extrasurl_t,url_oformatjsonmethodflickr.people.getPhotosuser_id" + nsid);
            var xmlhttp;
            xmlhttp = GetXmlHttpObject();
            if (xmlhttp == null) {
                alert("Boo! Your browser doesn't support AJAX!");
                return;
            }

            function stateChangedRoot() {
                if (xmlhttp.readyState == 4) {
                    function jsonFlickrApi(response) {
                        $('.loadingPhotogurusBody').hide();
                        $('#flickerModal').modal('show');
                        var s = "";
                        // http://farm{id}.static.flickr.com/{server-id}/{id}_{secret}_[mstb].jpg
                        // http://www.flickr.com/photos/{user-id}/{photo-id}
                        var photo;
                        var t_url;
                        var p_url;
                        $("#flickerSelectedAlbumPhotosCollection").empty();
                        for (var i = 0; i < response.photos.photo.length; i++) {
                            photo = response.photos.photo[i];
                            var node1 = $("<label/>").addClass('btn btn-primary');
                            var node2 = $('<input />', {
                                type: 'checkbox',
                                value: photo.url_t + "###" + photo.url_o
                            }).addClass("input_class_checkbox").appendTo(node1);
                            var node = $("<div/>").addClass('fb-albums file-image').css({
                                'background-image': 'url(' + photo.url_t + ')',
                                'background-position': 'center center'
                            });

                            //node.data('albumId', album.id + "");
                            node.appendTo(node1);
                            node1.appendTo($("#flickerSelectedAlbumPhotosCollection"));
                        }
                        window.opener.$(".sourceFlagImg").hide();
                        $(".back").show();
                    }
                    var jsonResponse = xmlhttp.responseText;
                    eval(jsonResponse);
                }
            }
            xmlhttp.open("GET", "https://api.flickr.com/services/rest/?api_sig=" + apisig + "&api_key=" + apikey + "&auth_token=" + accessToken + "&extras=url_t%2Curl_o&format=json&method=flickr.people.getPhotos&user_id=" + nsid, true);
            xmlhttp.onreadystatechange = stateChangedRoot;
            xmlhttp.send(null);
            var photosets = "";

        } else {
            apisig = $.md5(secret + "api_key" + apikey + "auth_token" + accessToken + "extrasurl_t,url_oformatjsonmethodflickr.photosets.getPhotosphotoset_id" + FlickerAlbumId);
            var xmlhttp;
            xmlhttp = GetXmlHttpObject();
            if (xmlhttp == null) {
                alert("Boo! Your browser doesn't support AJAX!");
                return;
            }

            function stateChangedPhoto() {
                if (xmlhttp.readyState == 4) {
                    function jsonFlickrApi(response) {
                        $('.loadingPhotogurusBody').hide();
                        $('#flickerModal').modal('show');
                        var s = "";
                        // http://farm{id}.static.flickr.com/{server-id}/{id}_{secret}_[mstb].jpg
                        // http://www.flickr.com/photos/{user-id}/{photo-id}
                        var photo;
                        var t_url;
                        var p_url;
                        $("#flickerSelectedAlbumPhotosCollection").empty();
                        for (var i = 0; i < response.photoset.photo.length; i++) {
                            photo = response.photoset.photo[i];
                            var node1 = $("<label/>").addClass('btn btn-primary');
                            var node2 = $('<input />', {
                                type: 'checkbox',
                                value: photo.url_t + "###" + photo.url_o
                            }).addClass("input_class_checkbox").appendTo(node1);
                            var node = $("<div/>").addClass('fb-albums').append($('<div/>').css({
                                'background-image': 'url(' + photo.url_t + ')',
                                'background-position': 'center center'
                            }).addClass('file-image'));
                            //node.data('albumId', album.id + "");
                            node.appendTo(node1);
                            node1.appendTo($("#flickerSelectedAlbumPhotosCollection"));
                        }
                        window.opener.$(".sourceFlagImg").hide();
                        $(".back").show();
                    }
                    var jsonResponse = xmlhttp.responseText;
                    eval(jsonResponse);
                }
            }
            xmlhttp.onreadystatechange = stateChangedPhoto;
            xmlhttp.open("GET", "https://api.flickr.com/services/rest/?api_sig=" + apisig + "&api_key=" + apikey + "&auth_token=" + accessToken + "&extras=url_t%2Curl_o&format=json&method=flickr.photosets.getPhotos&photoset_id=" + FlickerAlbumId, true);
            xmlhttp.send(null);
            var photosets = "";


        }

        function GetXmlHttpObject() {
            // IE7+, Firefox, Chrome, Opera, Safari
            if (window.XMLHttpRequest) {
                return new XMLHttpRequest();
            }

            //IE5, IE6
            if (window.ActiveXObject) {
                return new ActiveXObject("Microsoft.XMLHTTP");
            }
            return null;
        }

    });
    $(".back").click(function () {
        $(".back").hide();
        $("#flickerSelectedAlbumPhotosCollection").empty();
        $("#flickerSelectedAlbumPhotosCollection").hide();
        $("#importSelectFlickerPhotosId").hide();
        $("#flickerAlbumCollection").show();
        $("#import").show();
        $("#fbInnerTitle").text(flickrAlbumText);
    });
    $("#importSelectFlickerPhotosId").click(function () {
        var checkedValues = [];
        var checkedData = [];
        $('input:checkbox:checked').map(function () {
            checkedValues.push(this.value);
            checkedData.push($(this).data("orignalURL"));
        }).get();
        /*
         var oldDataChecking = [];
         if (window.opener.$(('#files .preview-img-flicker')) != 0) {
         window.opener.$(('#files .preview-img-flicker').each(function (index, obj) {
         //you can use this to access the current item
         oldDataChecking.push($(this).data("orignalurl"));
         }));
         }
         */
        var flDataArray = [];
        window.opener.$('#files .preview-img-flicker').each(function (index, obj) {
            flDataArray.push($(this).data("orignalurl"));
        });
        var checkedValuesData = JSON.parse(JSON.stringify(checkedValues));
        var dupsCount = 0;
        for (var j = 0; j < checkedValues.length; j++) {
            var splitURLData = checkedValues[j].split("###");
            for (var i = 0; i < flDataArray.length; i++) {
                if (splitURLData[1] !== undefined) {
                    if (splitURLData[1] === flDataArray[i]) {
                        dupsCount++;
                        checkedValuesData.splice(checkedValues.indexOf(splitURLData[1]), 1);
                    }

                }

            }
        }

        for (var i = 0; i < checkedValuesData.length; i++) {
            var splitURLData = checkedValuesData[i].split("###");
            var name = splitURLData[1];
            name = name.split('/');
            name = name[name.length - 1];
            window.opener.$('#files').append('<div class="col-xs-4 mycomputerImages preview-img-flicker" data-orignalURL=' + splitURLData[1] + ' data-toggle="tooltip" title=' + name + '><div class="flickrPhotoSmallIcon"></div><div class="generalTextName">' + name + '</div><div class="deleteIcon delete spriteImage"></div></div>');
            //			window.opener.$("#files").append('<div class="preview-img-flicker"  data-orignalURL=' + splitURLData[1] + '><img src="assets/images/flickerLeftBottom.png" alt="Flicker icon" class="fb_bottom"><div  style="background-image:url('+ splitURLData[0] +');height:117px;width: auto;background-repeat: no-repeat;background-size 100%;background-position: center center;"></div><div class="delete-button-div"><button class="button delete">Delete</button></div></div>');
        }
        $('input:checkbox').removeAttr('checked');
        flickerCounter = parseInt(window.opener.$("#flickerCountHidden").val());
        totalCount = parseInt(window.opener.$("#totalCountHidden").val());
        totalCount = totalCount + checkedValuesData.length;
        window.opener.$("#totalCountHidden").val(totalCount);
        flickerCounter = flickerCounter + checkedValuesData.length;
        window.opener.$("#flickerCountHidden").val(flickerCounter);
        window.opener.$("#flickerPhotoCounter").text(flickerCounter + " Photos added");
        window.opener.$("#totalCount").text('Total ' + totalCount + ' Images Selected');
        window.opener.$("#flickerPhotoCounter").css("visibility", "visible");
        window.opener.$("#totalCount").css("visibility", "visible");
        checkedValues = [];
        $(".flickerModalAlbum-focus").removeClass("flickerModalAlbum-focus");
        $(".choose").show();
        $(".rightArrow").removeClass("rightArrow");
        if (dupsCount > 0) {
            $("#fbInnerTitle").text(flickrAlbumText);
            $(".duplicateAlert .modal-body p").text(dupsCount + " duplicates have been removed from your selection");
            $(".duplicateAlert").modal("show");

        } else {
            window.close();
        }
    });
    $("#importSelectedFlickerAllPhotos").click(function () {
        $('.loadingPhotogurusBody').show();
        nsid = nsid.replace("%40", "@");
        if (FlickerAlbumId == "root") {
            apisig = $.md5(secret + "api_key" + apikey + "auth_token" + accessToken + "extrasurl_t,url_oformatjsonmethodflickr.people.getPublicPhotosuser_id" + nsid);
            var xmlhttp;
            xmlhttp = GetXmlHttpObject();
            if (xmlhttp == null) {
                alert("Boo! Your browser doesn't support AJAX!");
                return;
            }

            function stateChangedImportRootAlbum() {
                if (xmlhttp.readyState == 4) {
                    function jsonFlickrApi(response) {
                        $('.loadingPhotogurusBody').hide();
                        flickerAlbumData = response.photos.photo;
                        $('#flickerModal').modal('show');
                        var s = "";
                        // http://farm{id}.static.flickr.com/{server-id}/{id}_{secret}_[mstb].jpg
                        // http://www.flickr.com/photos/{user-id}/{photo-id}
                        var photo;
                        var t_url;
                        var p_url;
                        $("#flickerSelectedAlbumPhotosCollection").empty();
                        var wholeData;
                        var flDataArray = [];
                        var dupsCount = 0;
                        window.opener.$('#files .preview-img-flicker').each(function (index, obj) {
                            flDataArray.push($(this).data("orignalurl"));
                        });
                        for (var j = 0; j < response.photos.photo.length; j++) {
                            for (var i = 0; i < flDataArray.length; i++) {
                                if (response.photos.photo[j] !== undefined) {
                                    if (response.photos.photo[j].url_o === flDataArray[i]) {
                                        dupsCount++;
                                        response.photos.photo.splice(j, 1);
                                    }

                                }

                            }
                        }
                        for (var i = 0; i < response.photos.photo.length; i++) {
                            photo = response.photos.photo[i];
                            var splitURLData = photo.url_t.split('/');
                            splitURLData = splitURLData[splitURLData.length - 1];
                            window.opener.$('#files').append('<div class="col-xs-4 mycomputerImages preview-img-flicker" data-orignalURL=' + photo.url_o + ' data-toggle=tooltip title=' + splitURLData + '><div class="flickrPhotoSmallIcon"></div><div class="generalTextName">' + splitURLData + '</div><div class="deleteIcon delete spriteImage"></div></div>');
                            //                            window.opener.$("#files").append('<div class="preview-img-flicker" data-orignalURL=' + photo.url_o + '><img src="assets/images/flickerLeftBottom.png" alt="Flicker images" class="fb_bottom"><div  style="background-image:url(' + photo.url_t + ');height:117px;width: auto;background-repeat: no-repeat;background-size: 100%;background-position: center center;"></div><div class="delete-button-div"><button class="button delete">Delete</button></div></div>');
                        }
                        // flickerCounter(response.photoset.photo.length);
                        flickerCounter = parseInt(window.opener.$("#flickerCountHidden").val());
                        totalCount = parseInt(window.opener.$("#totalCountHidden").val());
                        totalCount = totalCount + response.photos.photo.length;
                        window.opener.$("#totalCountHidden").val(totalCount);
                        flickerCounter = flickerCounter + response.photos.photo.length;
                        window.opener.$("#flickerCountHidden").val(flickerCounter);
                        window.opener.$("#flickerPhotoCounter").text(flickerCounter + " Photos added");
                        window.opener.$("#totalCount").text('Total ' + totalCount + ' Images Selected');
                        window.opener.$("#flickerPhotoCounter").css("visibility", "visible");
                        window.opener.$("#totalCount").css("visibility", "visible");
                        window.opener.$("#files").append(wholeData);
                        $(".flickerModalAlbum-focus").removeClass("flickerModalAlbum-focus");
                        $(".choose").show();
                        $(".rightArrow").removeClass("rightArrow");
                        window.opener.$(".sourceFlagImg").hide();
                        if (dupsCount > 0) {
                            $("#fbInnerTitle").text(flickrAlbumText);
                            $(".duplicateAlert .modal-body p").text(dupsCount + " duplicates have been removed from your selection");
                            $(".duplicateAlert").modal("show");

                        } else {
                            window.close();
                        }

                    }
                    var jsonResponse = xmlhttp.responseText;
                    eval(jsonResponse);
                }
            }
            xmlhttp.onreadystatechange = stateChangedImportRootAlbum;
            xmlhttp.open("GET", "https://api.flickr.com/services/rest/?api_sig=" + apisig + "&api_key=" + apikey + "&auth_token=" + accessToken + "&extras=url_t%2Curl_o&format=json&method=flickr.people.getPublicPhotos&user_id=" + nsid, true);
            xmlhttp.send(null);
            var photosets = "";


        } else {
            apisig = $.md5(secret + "api_key" + apikey + "auth_token" + accessToken + "extrasurl_t,url_oformatjsonmethodflickr.photosets.getPhotosphotoset_id" + FlickerAlbumId);
            var flickerAlbumData;
            var xmlhttp;
            xmlhttp = GetXmlHttpObject();
            if (xmlhttp == null) {
                alert("Boo! Your browser doesn't support AJAX!");
                return;
            }

            function stateChangedImportAlbum() {
                if (xmlhttp.readyState == 4) {
                    function jsonFlickrApi(response) {
                        $('.loadingPhotogurusBody').hide();
                        var flDataArray = [];
                        var dupsCount = 0;
                        window.opener.$('#files .preview-img-flicker').each(function (index, obj) {
                            flDataArray.push($(this).data("orignalurl"));
                        });
                        for (var j = 0; j < response.photoset.photo.length; j++) {
                            for (var i = 0; i < flDataArray.length; i++) {
                                if (response.photoset.photo[j] !== undefined) {
                                    if (response.photoset.photo[j].url_o === flDataArray[i]) {
                                        dupsCount++;
                                        response.photoset.photo.splice(j, 1);
                                    }

                                }

                            }
                        }
                        flickerAlbumData = response.photoset.photo;
                        $('#flickerModal').modal('show');
                        var s = "";
                        // http://farm{id}.static.flickr.com/{server-id}/{id}_{secret}_[mstb].jpg
                        // http://www.flickr.com/photos/{user-id}/{photo-id}
                        var photo;
                        var t_url;
                        var p_url;
                        $("#flickerSelectedAlbumPhotosCollection").empty();
                        var wholeData;
                        for (var i = 0; i < response.photoset.photo.length; i++) {
                            photo = response.photoset.photo[i];
                            var splitURLData = photo.url_t.split('/');
                            splitURLData = splitURLData[splitURLData.length - 1];
                            window.opener.$('#files').append('<div class="col-xs-4 mycomputerImages preview-img-flicker" data-orignalURL=' + photo.url_o + ' data-toggle="tooltip" title=' + splitURLData + '><div class="flickrPhotoSmallIcon"></div><div class="generalTextName">' + splitURLData + '</div><div class="deleteIcon delete spriteImage"></div></div>');
                            //                            window.opener.$("#files").append('<div class="preview-img-flicker" data-orignalURL=' + photo.url_o + '><img src="assets/images/flickerLeftBottom.png" alt="Flicker images" class="fb_bottom"><div  style="background-image:url(' + photo.url_t + ');height:117px;width: auto;background-repeat: no-repeat;background-size: 100%;background-position: center center;"></div><div class="delete-button-div"><button class="button delete">Delete</button></div></div>');
                        }
                        // flickerCounter(response.photoset.photo.length);
                        flickerCounter = parseInt(window.opener.$("#flickerCountHidden").val());
                        totalCount = parseInt(window.opener.$("#totalCountHidden").val());
                        totalCount = totalCount + response.photoset.photo.length;
                        window.opener.$("#totalCountHidden").val(totalCount);
                        flickerCounter = flickerCounter + response.photoset.photo.length;
                        window.opener.$("#flickerCountHidden").val(flickerCounter);
                        window.opener.$("#flickerPhotoCounter").text(flickerCounter + " Photos added");
                        window.opener.$("#totalCount").text('Total ' + totalCount + ' Images Selected');
                        window.opener.$("#flickerPhotoCounter").css("visibility", "visible");
                        window.opener.$("#totalCount").css("visibility", "visible");
                        window.opener.$("#files").append(wholeData);
                        $(".flickerModalAlbum-focus").removeClass("flickerModalAlbum-focus");
                        $(".choose").show();
                        $(".rightArrow").removeClass("rightArrow");
                        window.opener.$(".sourceFlagImg").hide();
                        if (dupsCount > 0) {
                            $("#fbInnerTitle").text(flickrAlbumText);
                            $(".duplicateAlert .modal-body p").text(dupsCount + " duplicates have been removed from your selection");
                            $(".duplicateAlert").modal("show");
                        } else {
                            window.close();
                        }
                    }
                    var jsonResponse = xmlhttp.responseText;
                    eval(jsonResponse);
                }
            }
            xmlhttp.onreadystatechange = stateChangedImportAlbum;
            xmlhttp.open("GET", "https://api.flickr.com/services/rest/?api_sig=" + apisig + "&api_key=" + apikey + "&auth_token=" + accessToken + "&extras=url_t%2Curl_o&format=json&method=flickr.photosets.getPhotos&photoset_id=" + FlickerAlbumId, true);
            xmlhttp.send(null);
            var photosets = "";


        }

        function GetXmlHttpObject() {
            // IE7+, Firefox, Chrome, Opera, Safari
            if (window.XMLHttpRequest) {
                return new XMLHttpRequest();
            }

            //IE5, IE6
            if (window.ActiveXObject) {
                return new ActiveXObject("Microsoft.XMLHTTP");
            }
            return null;
        }
    });
    window.onresize = function () {
        window.resizeTo(900, 436);
    }
    window.onclick = function () {
        window.resizeTo(900, 436);
    }
});