/*global define, $, jQuery, window, console, alert*/

define(['Augment',
    'Instance',
    'GlobalData',
    'utils/CookieUtils',
    'hbs!views/uploader/templates/FlickrView'
], function (augment, instance, GlobalData, CookieUtils, tplFlickrView) {
//    'use strict';

    var FlickrView = augment(instance, function () {
        var flickrView = this;
        var msgUtils = getLocalizationValues();
        this.flickrInitialisationFlag = 0;
        var apikey = '';
        var secret = '';
        var totalCount = 0;
        var accessToken = '';
        var nsid = '';
        var username = '';
        var fullname = '';
        var apisig = "";
        var FlickerAlbumId = "";
        var flickrAlbumText = '';
        this.init = function () {

        };
        this.addToDiv = function () {
            var divId = "flickrUploadView";
            var innerHtml = tplFlickrView({});
            jQuery('#' + divId).empty();
            jQuery('#' + divId).html(innerHtml);
            apikey = GlobalData.flickrAPIKey;
            secret = GlobalData.flickrSecretKey;
            this.modalIsShown();
            this.preloader();
        };
        this.modalIsShown = function () {
            jQuery('#flickrModal').on('shown.bs.modal', function () {
                jQuery(".loadingPhotogurusBody").show();
                flickrView.flickrModalAlignment();
                accessToken = CookieUtils.getCookie("fAccessToken");
                nsid = CookieUtils.getCookie("fNsid");
                username = CookieUtils.getCookie("fUsername");
                fullname = CookieUtils.getCookie("fFullname");

                CookieUtils.setCookie('fAccessToken', accessToken, 1);
                CookieUtils.setCookie('fNsid', nsid, 1);
                CookieUtils.setCookie('fUsername', username, 1);
                CookieUtils.setCookie('fFullname', fullname, 1);
                
                flickrView.rootNumberOfPhotosCount();
                jQuery('#flickrModal .selectAllFBContent').hide();
                jQuery('#flickrModal .selectAlbumTitile').show();
                apisig = $.md5(secret + "api_key" + apikey + "auth_token" + accessToken + "formatjsonmethodflickr.photosets.getListprimary_photo_extrasurl_t");
                var callbackUrl = 'https://photogurusdev.scancafe.com/web/flickr/flickrAuth.php?success=true';
                var callbackMsgUrl = callbackUrl.split('?');
                function stateChanged () {
                    if (parseInt(xmlhttp.readyState) === 4) {
                        function jsonFlickrApi (response) {
                            jQuery('#flickrModal #albumCollectionList').empty();
                            jQuery('#flickrModal').modal('show');
                            jQuery("#flickrModal #importSelectFlickerPhotosId").hide();

                            photosets = response.photosets.photoset;
                            if (photosets.length > 1) {
                                flickrAlbumText = "Flickr Albums";
                                jQuery("#flickrModal #fbInnerTitle").text("Flickr Albums");
                            } else {
                                flickrAlbumText = "Flickr Album";
                                jQuery("#flickrModal #fbInnerTitle").text("Flickr Album");
                            }
                            var t_url;
                            var node = jQuery("<div/>").attr("id", "root").addClass('flickrModalAlbum');
                            node.appendTo(jQuery("#flickrModal #albumCollectionList"));
                            node.append(jQuery("<img/>").addClass('fb-albums-thumb').attr('src', "assets/images/uploader/flickr-root-thumbnail.png"));
                            node.append(jQuery('<div/>').text("Root").addClass('file-title'));
                            node.append(jQuery('<div/>').text('X Photo').addClass('numberOfPhotos'));
                            jQuery.each(photosets, function (index, photo) {
                                var node = jQuery("<div/>").attr("id", photo.id).addClass('flickrModalAlbum');
                                node.appendTo(jQuery("#flickrModal #albumCollectionList"));
                                node.append(jQuery("<div/>").addClass('fb-albums-thumb').css({'background-image': 'url(' + photo.primary_photo_extras.url_t + ')'}));
                                node.append(jQuery('<div/>').text(photo.title._content).addClass('file-title'));
                                if (photo.noOfPhotos > 1) {
                                    node.append(jQuery('<div/>').text(photo.photos + ' Photos').addClass('numberOfPhotos'));
                                } else {
                                    node.append(jQuery('<div/>').text(photo.photos + ' Photo').addClass('numberOfPhotos'));
                                }
                                jQuery('.loadingPhotogurusBody').hide();
                            });
                            jQuery(".back").hide();
                        }
                        var jsonResponse = xmlhttp.responseText;
                        eval(jsonResponse);
                    }
                }
                function GetXmlHttpObject () {
                    if (window.XMLHttpRequest) {
                        return new XMLHttpRequest();
                    }
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


            });
        };
        this.preloader = function () {
            jQuery("#flickrModal").on('click', '.flickrModalAlbum', function () {
                jQuery("#flickrModal .modal-body-right").mCustomScrollbar("scrollTo", "top");
                jQuery('#flickrModal .saveFbPhots').css({'color': '#7e7e7e'});
                jQuery('#flickrModal .saveFbPhots').show();
                FlickerAlbumId = jQuery(this).attr('id');
                var flickrSelectedAlbumText = this.children[1].textContent;
                jQuery("#flickrModal #fbInnerTitle").text(flickrSelectedAlbumText);
                jQuery('#flickrModal .selectAlbumTitile').hide();
                jQuery('#flickrModal .selectAllFBContent,#flickrModal #importSelectFlickerPhotosId').show();
                jQuery("#flickrModal #albumPhotosCollectionList").empty();
                jQuery('.loadingPhotogurusBody').show();
                jQuery("#flickrModal #importSelectFlickerPhotosId").show();
                jQuery("#flickrModal #albumPhotosCollectionList,#flickrModal .flickrphotosSelectionCount,#flickrModal #closeFlickrAlbumList").show();
                jQuery("#flickrModal #addfbphotos").show();
                jQuery("#flickrModal #albumCollectionList").hide();
                jQuery("#flickrModal #import").hide();
                jQuery("#flickrModal .back").show();
                jQuery("#flickrModal .flickrModalAlbum-focus").removeClass("flickrModalAlbum-focus");
                jQuery("#flickrModal .choose").show();
                jQuery("#flickrModal .rightArrow").removeClass("rightArrow");
                nsid = nsid.replace("%40", "@");
                jQuery('#flickrModal .closeFBModal').addClass('backFlickrModal').removeClass('closeFBModal');
                if (FlickerAlbumId === "root") {
                    jQuery('#flickrModal .selectAllCheckIcon,#flickrModal .selectAllAlbumPhots').hide();
                    nsid = nsid.replace("%40", "@");
                    apisig = $.md5(secret + "api_key" + apikey + "auth_token" + accessToken + "extrasurl_t,url_oformatjsonmethodflickr.people.getPhotosper_page500user_id" + nsid);
                    var xmlhttp;
                    xmlhttp = GetXmlHttpObject();
                    if (xmlhttp === null) {
                        alert("Boo! Your browser doesn't support AJAX!");
                        return;
                    }
                    function stateChangedRoot () {
                        if (parseInt(xmlhttp.readyState) === 4) {
                            function jsonFlickrApi (response) {
                                jQuery('.loadingPhotogurusBody').hide();
                                jQuery('#flickrModal').modal('show');
                                var s = "";
                                var photo;
                                var t_url;
                                var p_url;
                                for (var i = 0; i < response.photos.photo.length; i++) {
                                    photo = response.photos.photo[i];
                                    var node1 = jQuery("<label/>").addClass('btn btn-primary');
                                    var node2 = jQuery('<input />', {
                                        type: 'checkbox',
                                        value: photo.url_t + "###" + photo.url_o
                                    }).addClass("input_class_checkbox").appendTo(node1);
                                    var node = jQuery("<div/>").addClass('overlayCheckBtn');
                                    var node2 = jQuery("<div/>").addClass('fb-albums-photos fb-albums-thumb-check').css({'background-image': 'url(' + photo.url_t + ')'});
                                    var node3 = jQuery("<div/>").addClass('fb-albums-photos');
                                    node.appendTo(node3);
                                    node2.appendTo(node3);
                                    node3.appendTo(node1);
                                    node1.appendTo(jQuery("#albumPhotosCollectionList"));
                                }
                                jQuery(".sourceFlagImg").hide();
                                jQuery(".back").show();
                            }
                            var jsonResponse = xmlhttp.responseText;
                            eval(jsonResponse);
                            flickrView.flickrInitialisationFlag++;
                            if (flickrView.flickrInitialisationFlag === 1) {
                                flickrView.multiselectionProcess();
                            }

                        }
                    }
                    xmlhttp.open("GET", "https://api.flickr.com/services/rest/?api_sig=" + apisig + "&api_key=" + apikey + "&auth_token=" + accessToken + "&extras=url_t%2Curl_o&format=json&method=flickr.people.getPhotos&per_page=500&user_id=" + nsid, true);
                    xmlhttp.onreadystatechange = stateChangedRoot;
                    xmlhttp.send(null);
                    var photosets = "";

                } else {
                    jQuery('#flickrModal .selectAllCheckIcon,#flickrModal .selectAllAlbumPhots').show();
                    apisig = $.md5(secret + "api_key" + apikey + "auth_token" + accessToken + "extrasurl_t,url_oformatjsonmethodflickr.photosets.getPhotosphotoset_id" + FlickerAlbumId);
                    var xmlhttp;
                    xmlhttp = GetXmlHttpObject();
                    if (xmlhttp == null) {
                        alert("Boo! Your browser doesn't support AJAX!");
                        return;
                    }
                    function stateChangedPhoto () {
                        if (xmlhttp.readyState == 4) {
                            function jsonFlickrApi (response) {
                                jQuery('.loadingPhotogurusBody').hide();
                                jQuery('#flickrModal').modal('show');
                                var s = "";
                                var photo;
                                var t_url;
                                var p_url;
                                for (var i = 0; i < response.photoset.photo.length; i++) {
                                    photo = response.photoset.photo[i];
                                    var node1 = jQuery("<label/>").addClass('btn btn-primary');
                                    var node2 = jQuery('<input />', {
                                        type: 'checkbox',
                                        value: photo.url_t + "###" + photo.url_o
                                    }).addClass("input_class_checkbox").appendTo(node1);
                                    var node = jQuery('<div/>').css({'background-image': 'url(' + photo.url_t + ')'}).addClass('fb-albums-thumb-check');
                                    var node4 = jQuery("<div/>").addClass('overlayCheckBtn');
                                    var node3 = jQuery("<div/>").addClass('fb-albums-photos');
                                    node4.appendTo(node3);
                                    node.appendTo(node3);
                                    node3.appendTo(node1);
                                    node1.appendTo(jQuery("#albumPhotosCollectionList"));
                                }
                                jQuery(".sourceFlagImg").hide();
                                jQuery("#flickrModal .back").show();
                            }
                            var jsonResponse = xmlhttp.responseText;
                            eval(jsonResponse);
                            flickrView.flickrInitialisationFlag++;
                            if (flickrView.flickrInitialisationFlag === 1) {
                                flickrView.multiselectionProcess();
                            }
                        }

                    }
                    xmlhttp.onreadystatechange = stateChangedPhoto;
                    xmlhttp.open("GET", "https://api.flickr.com/services/rest/?api_sig=" + apisig + "&api_key=" + apikey + "&auth_token=" + accessToken + "&extras=url_t%2Curl_o&format=json&method=flickr.photosets.getPhotos&photoset_id=" + FlickerAlbumId, true);
                    xmlhttp.send(null);
                    var photosets = "";
                }

                function GetXmlHttpObject () {
                    if (window.XMLHttpRequest) {
                        return new XMLHttpRequest();
                    }
                    
                    if (window.ActiveXObject) {
                        return new ActiveXObject("Microsoft.XMLHTTP");
                    }
                    return null;
                }

            });
            jQuery("#flickrModal .back").click(function () {
                jQuery(".back").hide();
                jQuery("#flickrModal #albumPhotosCollectionList").empty();
                jQuery("#flickrModal #albumPhotosCollectionList").hide();
                jQuery("#flickrModal #importSelectFlickerPhotosId").hide();
                jQuery("#flickrModal #albumCollectionList").show();
                jQuery("#flickrModal #import").show();
                jQuery("#flickrModal #fbInnerTitle").text(flickrAlbumText);
                jQuery("#flickrModal .flickrphotosSelectionCount").hide();
            });

            jQuery("#flickrModal").on('click', '#importSelectFlickerPhotosId', function () {
                flickrView.flickrSelectionCount = jQuery('#albumPhotosCollectionList .selected').length;
                if (flickrView.flickrSelectionCount > 0) {
                    flickrView.selectFlickrPhotosToCollection();
                }

            });

            jQuery("#flickrModal").on('click', '.backFlickrModal', function () {
                flickrView.flickrSelectionCount = jQuery('#albumPhotosCollectionList .selected').length;
                if (flickrView.flickrSelectionCount > 0) {
                    jQuery('.loseSelectionFlickrModal').modal('show');
                } else {
                    flickrView.albumScreen();
                }
            });
            jQuery("#flickrModal").on('click', '#closeFlickrAlbumList', function () {
                flickrView.flickrSelectionCount = jQuery('#albumPhotosCollectionList .selected').length;
                if (flickrView.flickrSelectionCount > 0) {
                    jQuery('.loseSelectionCloseFlickrModal').modal('show');
                } else {
                    flickrView.closeFlickrScreen();
                }
            });

            jQuery('.loseSelectionFlickrModal #redirectionToFlickrAlbumBtn').click(flickrView.albumScreen);

            jQuery("#flickrModal").on('click', '.closeFBModal', flickrView.closeFlickrScreen);
            jQuery(".loseSelectionCloseFlickrModal").on('click', '#redirectionToUploaderFlickrAlbumBtn', flickrView.closeFlickrScreen);

        };
        this.GetXmlHttpObject = function () {            
            if (window.XMLHttpRequest) {
                return new XMLHttpRequest();
            }
            
            if (window.ActiveXObject) {
                return new ActiveXObject("Microsoft.XMLHTTP");
            }
            return null;
        };
        this.closeFlickrScreen = function () {
            jQuery('#flickrModal #albumCollectionList').show();
            jQuery('#flickrModal #albumPhotosCollectionList').hide();
            jQuery('#flickrModal .selectAllCheckIcon').removeClass('active');
            jQuery("#flickrModal .backFlickrModal").addClass('closeFBModal').removeClass('backFlickrModal');
            jQuery('#flickrModal').modal('hide');
            jQuery("#flickrModal .flickrphotosSelectionCount,#flickrModal #importSelectFlickerPhotosId,#flickrModal .selectAllFBContent,#flickrModal #closeFlickrAlbumList").hide();
            jQuery('#flickrModal .flickrphotosSelectionCount').text("0 photos selected");
            jQuery('#flickrModal').modal('hide');
            jQuery('#flickrModal #albumCollectionList').show();
            jQuery('#flickrModal #albumPhotosCollectionList').hide();
            jQuery('#flickrModal .selectAllCheckIcon').removeClass('active');
            jQuery("#flickrModal #fbInnerTitle").text(flickrAlbumText);
            jQuery("#flickrModal .backFlickrModal").addClass('closeFBModal').removeClass('backFlickrModal');
            jQuery('#flickrModal').modal('hide');

        };
        this.albumScreen = function () {
            jQuery("#flickrModal #fbInnerTitle").text(flickrAlbumText);
            jQuery('#flickrModal #albumCollectionList,#flickrModal .selectAlbumTitile').show();
            jQuery('#flickrModal #albumPhotosCollectionList,#flickrModal .flickrphotosSelectionCount,#flickrModal #importSelectFlickerPhotosId,#flickrModal .selectAllFBContent,#flickrModal #closeFlickrAlbumList').hide();
            jQuery('#flickrModal .selectAllCheckIcon').removeClass('active');
            jQuery('#flickrModal .flickrphotosSelectionCount').text("0 photos selected");
            jQuery("#flickrModal .backFlickrModal").addClass('closeFBModal').removeClass('backFlickrModal');
            jQuery("#flickrModal .modal-body-right").mCustomScrollbar("scrollTo", "top");
        };
        this.rootNumberOfPhotosCount = function () {
            nsid = nsid.replace("%40", "@");
            apisig = $.md5(secret + "api_key" + apikey + "auth_token" + accessToken + "extrasurl_t,url_oformatjsonmethodflickr.people.getPhotosper_page500user_id" + nsid);
            var xmlhttp;
            xmlhttp = flickrView.GetXmlHttpObject();
            if (xmlhttp === null) {
                alert("Boo! Your browser doesn't support AJAX!");
                return;
            }
            function stateChangedRoot () {
                if (parseInt(xmlhttp.readyState) === 4) {
                    function jsonFlickrApi (response) {
                        jQuery('.loadingPhotogurusBody').hide();
                        jQuery('#flickrModal').modal('show');
                        var s = "";
                        var photo;
                        var t_url;
                        var p_url;
                        if (response.photos.photo.length > 1) {
                            jQuery('#root').children(".numberOfPhotos").text(response.photos.photo.length + " Photos");
                        } else {
                            jQuery('#root').children(".numberOfPhotos").text(response.photos.photo.length + " Photo");
                        }

                    }
                    var jsonResponse = xmlhttp.responseText;
                    eval(jsonResponse);
                }
            }
            xmlhttp.open("GET", "https://api.flickr.com/services/rest/?api_sig=" + apisig + "&api_key=" + apikey + "&auth_token=" + accessToken + "&extras=url_t%2Curl_o&format=json&method=flickr.people.getPhotos&per_page=500&user_id=" + nsid, true);
            xmlhttp.onreadystatechange = stateChangedRoot;
            xmlhttp.send(null);
        };

        this.openFile = function (file) {
            var extension = file.substr((file.lastIndexOf('.') + 1));
            switch (extension) {
                case 'jpg':
                case 'png':
                    return 1; 
                    break;
                default:
                    return 0;
            }
        };
        this.selectFlickrPhotosToCollection = function () {
            var checkedValues = [];
            var checkedData = [];
            var fileType = 0;
            jQuery('#flickrModal label.selected').map(function () {
                if (flickrView.openFile(this.children[0].value)) {
                    checkedValues.push(this.children[0].value);
                } else {
                    fileType++;
                }
            }).get();
          
            var flDataArray = [];
            jQuery('#files .preview-img-flicker').each(function (index, obj) {
                flDataArray.push(jQuery(this).data("orignalurl"));
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
                jQuery('#files').append('<div class="col-xs-4 mycomputerImages preview-img-flicker" data-orignalURL=' + splitURLData[1] + ' data-toggle="tooltip" title=' + name + '><div class="flickrPhotoSmallIcon"></div><div class="generalTextName">' + name + '</div><div class="deleteIcon delete spriteImage"></div></div>');
            }
            
            jQuery('label.selected').removeClass('selected');
            flickerCounter = parseInt(jQuery("#flickerCountHidden").val());
            totalCount = parseInt(jQuery("#totalCountHidden").val());
            totalCount = totalCount + checkedValuesData.length;
            jQuery("#totalCountHidden").val(totalCount);
            flickerCounter = flickerCounter + checkedValuesData.length;
            jQuery("#flickerCountHidden").val(flickerCounter);
            jQuery("#flickerPhotoCounter").text(flickerCounter + " Photos added");
            jQuery("#totalCount").text('Total ' + totalCount + ' Images Selected');
            jQuery("#flickerPhotoCounter").css("visibility", "visible");
            jQuery("#totalCount").css("visibility", "visible");
            checkedValues = [];
            jQuery(".choose").show();
            jQuery(".rightArrow").removeClass("rightArrow");
            if (dupsCount > 0) {
                jQuery("#flickrModal #fbInnerTitle").text(flickrAlbumText);
                jQuery(".duplicateAlert .modal-body p").text(dupsCount + " duplicates have been removed from your selection");
                jQuery(".duplicateAlert").modal("show");
            } else if (fileType > 0) {
                jQuery('.fileType').modal('hide');
                jQuery('.fileType .modal-body p').text(msgUtils.fileTypeAllow);
                jQuery('.fileType').modal('show');
            }
            jQuery("#flickrModal .flickrphotosSelectionCount,#flickrModal #importSelectFlickerPhotosId,#flickrModal .selectAllFBContent,#flickrModal #closeFlickrAlbumList").hide();
            jQuery('#flickrModal .flickrphotosSelectionCount').text("0 photos selected");
            jQuery('#flickrModal').modal('hide');
            jQuery('#flickrModal #albumCollectionList').show();
            jQuery('#flickrModal #albumPhotosCollectionList').hide();
            jQuery('#flickrModal .selectAllCheckIcon').removeClass('active');
            jQuery("#flickrModal #fbInnerTitle").text(flickrAlbumText);
            jQuery("#flickrModal .backFlickrModal").addClass('closeFBModal').removeClass('backFlickrModal');
            jQuery('#flickrModal').modal('hide');
        };

        this.flickrModalAlignment = function () {
            var topMargin = 0;
            topMargin = (jQuery(window).height() - 493) / 2;
            if (topMargin > 0) {
                jQuery('#flickrModal .modal-dialog').css('margin-top', topMargin + 'px');
            }
        };
        this.multiselectionProcess = function () {
            var fbSelectedPhotosContainer = '';
            fbSelectedPhotosContainer = jQuery('#flickrModal #albumPhotosCollectionList').finderSelect({enableDesktopCtrlDefault: true});            
            fbSelectedPhotosContainer.finderSelect('addHook', 'highlight:before', function (el) {
                el.find('input').prop('checked', true);
                el.find('.overlayCheckBtn').css('display', 'block');
                flickrView.selectionFlickrPhotosCountUpdate();
            });            
            fbSelectedPhotosContainer.finderSelect('addHook', 'unHighlight:before', function (el) {
                el.find('input').prop('checked', false);
                el.find('.overlayCheckBtn').css('display', 'none');
                flickrView.selectionFlickrPhotosCountUpdate();
            });            
            fbSelectedPhotosContainer.finderSelect("children").dblclick(function () {
                flickrView.selectionFlickrPhotosCountUpdate();
            });            
            fbSelectedPhotosContainer.on("click", ":checkbox", function (e) {
                flickrView.selectionFlickrPhotosCountUpdate();
            });
            jQuery('#flickrModal .selectAllCheckIcon').click(function () {
                if (jQuery(this).hasClass('active')) {
                    fbSelectedPhotosContainer.finderSelect('unHighlightAll');
                    jQuery(this).removeClass('active');
                } else {
                    fbSelectedPhotosContainer.finderSelect('highlightAll');
                    jQuery(this).addClass('active');
                }
                flickrView.selectionFlickrPhotosCountUpdate();
            });
            jQuery(".safezone").on("mousedown", function (e) {
                return false;
            });
            jQuery('#flickrModal').on('keyup', function (e) {
                if (e.ctrlKey) {
                    if (e.keyCode === 65) {
                        jQuery('#albumPhotosCollectionList input').prop('checked', true);
                        jQuery('#albumPhotosCollectionList label').removeClass('un-selected').addClass('selected');
                        jQuery('.overlayCheckBtn').css('display', 'block');
                        flickrView.selectionFlickrPhotosCountUpdate();
                    }
                    if (e.ctrlKey && e.altKey && (e.keyCode == 65)) {
                        jQuery('#albumPhotosCollectionList input').prop('checked', false);
                        jQuery('#albumPhotosCollectionList label').removeClass('selected').addClass('un-selected');
                        jQuery('.overlayCheckBtn').css('display', 'none');
                        flickrView.selectionFlickrPhotosCountUpdate();
                    }
                }
            });
        };
        this.selectCheckUncheck = function () {
            if (jQuery("#albumPhotosCollectionList .input_class_checkbox").length === jQuery('#albumPhotosCollectionList .selected').length) {
                jQuery("#flickrModal .selectAllCheckIcon").addClass('active').attr("checked", "checked");
            } else {
                jQuery("#flickrModal .selectAllCheckIcon.active").removeClass('active').removeAttr("checked");
            }
        };
        this.selectionFlickrPhotosCountUpdate = function () {
            setTimeout(function () {
                flickrView.flickrSelectionCount = jQuery('#albumPhotosCollectionList .selected').length;
                flickrView.selectCheckUncheck();
                if (flickrView.flickrSelectionCount === 0 || flickrView.flickrSelectionCount === 1) {
                    jQuery('#flickrModal .flickrphotosSelectionCount').text(flickrView.flickrSelectionCount + " photo selected");
                } else {
                    jQuery('#flickrModal .flickrphotosSelectionCount').text(flickrView.flickrSelectionCount + " photos selected");
                }
                if (flickrView.flickrSelectionCount > 0) {
                    jQuery('#flickrModal .saveFbPhots').css({'color': '#48aede'});
                } else {
                    jQuery('#flickrModal .saveFbPhots').css({'color': '#7e7e7e'});
                }
            }, 10);

        };
        this.reset = function () {
            flickrView.flickrInitialisationFlag = 0;
        };

    });

    return FlickrView;
});