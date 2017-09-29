/*global define, $, jQuery, window, FB, alert*/
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';
var facebookInitialisationFlag = 0;

function loadFBJS () {
    $.ajaxSetup({cache: true});
    $.getScript('//connect.facebook.net/en_US/sdk.js', function () {
        FB.init({
            appId: '543592049052730', //dev
//            appId: '519168014827117',
            version: 'v2.8',
            cookie: true, // enable cookies to allow the server to access 
            // the session
            xfbml: true // parse social plugins on this page
        });
        FB.getLoginStatus(function (response) {
            facebookData = response;
        });
        
        $('.fbdisable').removeClass('fbdisable');
    });

}
var loadFBNextAlbums = 0;
var facebookAlbumData = [];
var facebookAlbumCheckInterval = 0;
function loadFBAlbums () {
    console.log('entering loadFBAlbums function');
    jQuery(".loadingPhotogurusBody").show();
    facebookAlbumData = [];
    //though limit given 200, max limit that can be set is always 50
    FB.api(
      '/'+ facebookData.authResponse.userID +'/albums',
      'GET',
      {"fields":"count,name,created_time","limit":"200"},
      function(response) {
        console.dir(response)
        //$(".loadingPhotogurusBody").hide();
        if (response) {
            //console.dir(response);
            loadFBNextAlbums = response;
            /*response.data.sort(function (a, b) {
                //console.log(b.created_time+' - '+a.created_time);
                return new Date(b.created_time) - new Date(a.created_time);
            });*/
            //console.log('after appling desc sort');
            //console.dir(response);
            if(response.data.length === 0){
                jQuery(".loadingPhotogurusBody").hide();
                jQuery('#myModal').modal('hide');
                jQuery('#messageModal.alertFBDialog').modal('show');
                jQuery('#displayText').text('Unable to retreive photos associated with your Facebook account. Please try again.');
            }else{
                facebookAlbumData = facebookAlbumData.concat(response.data);
                checkForAllAlbum();
            }
        }
      }
    );
}

function checkForAllAlbum () {
    console.log('entering checkForAllAlbum function');
    if (loadFBNextAlbums.paging.next !== undefined) {
        FB.api(
            loadFBNextAlbums.paging.next,
            'GET',
            {"fields":"count,name"},
            function (response) {
                loadFBNextAlbums = response;
                /*response.data.sort(function (a, b) {
                    //console.log(b.created_time+' - '+a.created_time);
                    return new Date(b.created_time) - new Date(a.created_time);
                });*/
                facebookAlbumData = facebookAlbumData.concat(response.data);
                checkForAllAlbum();
            });
    
    } else {
        readFBAlbums(facebookAlbumData);
    }
}

function readFBAlbums (data) {
    console.log('entering readFBAlbums function');
    //console.dir(data);
    /*data.sort(function (a, b) {
        //console.log(b.created_time+' - '+a.created_time);
        return new Date(b.created_time) - new Date(a.created_time);
    });*/
    if (data.length > 1) {
        $(".facebookModalCheck #fbInnerTitle").text('Facebook Albums');
    } else {
        $(".facebookModalCheck #fbInnerTitle").text('Facebook Album');
    }
    $.each(data, function (index, album) {
        var node = $("<div/>").addClass('fb-albums');
        node.data('albumId', album.id + "");
        //For each album
        FB.api(
          '/'+album.id,
          'GET',
          {"fields":"cover_photo"},
          function(response) {
            // get details of a cover
            if(response.cover_photo !== undefined){
                FB.api(
                    '/'+response.cover_photo.id,
                    'GET',
                    {"fields":"picture"},
                    function(response) {
                      //console.log(response);
                      if (response) {
                        node.appendTo($("#FBAlbums"));
                        if(response.picture){
                          node.append($("<div/>").addClass('fb-albums-thumb').css('background-image', 'url(' + response.picture + ')'));
                        }
                        else{
                          //todo if cover photo not available, handle it
                          console.log('todo if cover photo not available, handle it')
                        }
                        node.append($('<div/>').text(album.name).addClass('file-title'));
                        if (album.count > 1) {
                            node.append($('<div/>').text(album.count + ' photos').addClass('numberOfPhotos'));
                        } else {
                            node.append($('<div/>').text(album.count + ' photo').addClass('numberOfPhotos'));
                        }
                      }
                    }
                );
            }else{
                console.log('todo cover details not found, handle it');
                //todo cover details not found, handle it
            }
          }
        );
    });
    $(".loadingPhotogurusBody").hide();
    $(".dynamicLoadingMessage").hide();

}
function multiselectionFbPhotos () {
    if (facebookInitialisationFlag >= 0 && facebookInitialisationFlag <= 1) {
        var fbSelectedPhotosContainer = jQuery('.facebookModalCheck #FBAlbumsPhotos').finderSelect({enableDesktopCtrlDefault: true});
        fbSelectedPhotosContainer.finderSelect('addHook', 'highlight:before', function (el) {
            el.find('input').prop('checked', true);
            el.find('.overlayCheckBtn').css('display', 'block');
            selectionFBPhotosCountUpdate();
        });
        fbSelectedPhotosContainer.finderSelect('addHook', 'unHighlight:before', function (el) {
            el.find('input').prop('checked', false);
            el.find('.overlayCheckBtn').css('display', 'none');
            selectionFBPhotosCountUpdate();
        });
        fbSelectedPhotosContainer.finderSelect("children").dblclick(function () {
            selectionFBPhotosCountUpdate();
        });
        
        fbSelectedPhotosContainer.on("click", ":checkbox", function (e) {
            selectionFBPhotosCountUpdate();
            e.preventDefault();
        });
        $('.facebookModalCheck .selectAllCheckIcon').click(function () {
            if ($(this).hasClass('active')) {
                fbSelectedPhotosContainer.finderSelect('unHighlightAll');
                $(this).removeClass('active');

            } else {
                fbSelectedPhotosContainer.finderSelect('highlightAll');
                jQuery(this).addClass('active');
            }
            selectionFBPhotosCountUpdate();
        });
        
        $(".safezone").on("mousedown", function (e) {
            selectionFBPhotosCountUpdate();
        });
        
        jQuery('.facebookModalCheck').on('keyup', function (e) {
            if (e.ctrlKey) {
                if (e.keyCode === 65) {
                    jQuery('#FBAlbumsPhotos input').prop('checked', true);
                    jQuery('#FBAlbumsPhotos label').removeClass('un-selected').addClass('selected');
                    jQuery('.overlayCheckBtn').css('display', 'block');
                    selectionFBPhotosCountUpdate();
                }
                if (e.ctrlKey && e.altKey && (e.keyCode == 65)) {
                    jQuery('#FBAlbumsPhotos input').prop('checked', false);
                    jQuery('#FBAlbumsPhotos label').removeClass('selected').addClass('un-selected');
                    jQuery('.overlayCheckBtn').css('display', 'none');
                    selectionFBPhotosCountUpdate();
                }
            }
        });
    }
}

var facebookAlbumPhotosData = [];
var loadFBNextPhotos = '';
function loadPhotos (albumId, numberOfPhots, callback) {
    console.log('entering loadPhotos function');
    jQuery(".facebookModalCheck #FBAlbumsPhotos").empty();
    facebookAlbumPhotosData = [];
    /*FB.api(
            "/" + albumId + "/photos?limit=100",
            function (response) {
                facebookInitialisationFlag++;
                //jQuery(".loadingPhotogurusBody").hide();
                if (response && !response.error) {
                    //jQuery(".loadingPhotogurusBody").hide();
                    if (callback !== undefined) {
                        callback(response.data);
                    } else {
                        loadFBNextPhotos = response;
                        facebookAlbumPhotosData = facebookAlbumPhotosData.concat(response.data);
                        checkForAllAlbumPhotoList();
                    }
                } else {
                    //jQuery(".facebookModalCheck .back,.facebookModalCheck #FBAlbumsPhotos,.facebookModalCheck #addfbphotos,.loadingPhotogurusBody").hide();
                    jQuery(".facebookModalCheck .back,.facebookModalCheck #FBAlbumsPhotos,.facebookModalCheck #addfbphotos").hide();
                    jQuery(".facebookModalCheck #FBAlbums,.facebookModalCheck #import").show();
                    jQuery(".loggedOut").modal('show');
                }
            }
    );*/
    
    FB.api(
      '/'+albumId+'/photos',
      'GET',
      {"fields":"picture,images,created_time","limit":"100"},
      function(response) {
        facebookInitialisationFlag++;
        //jQuery(".loadingPhotogurusBody").hide();
        if (response) {
            jQuery(".loadingPhotogurusBody").hide();
            if (callback !== undefined) {
                callback(response.data);
            } else {
                loadFBNextPhotos = response;
                facebookAlbumPhotosData = facebookAlbumPhotosData.concat(response.data);
                checkForAllAlbumPhotoList();
            }
        } else {
            //jQuery(".facebookModalCheck .back,.facebookModalCheck #FBAlbumsPhotos,.facebookModalCheck #addfbphotos,.loadingPhotogurusBody").hide();
            jQuery(".facebookModalCheck .back,.facebookModalCheck #FBAlbumsPhotos,.facebookModalCheck #addfbphotos").hide();
            jQuery(".facebookModalCheck #FBAlbums,.facebookModalCheck #import").show();
            jQuery(".loggedOut").modal('show');
        }
      }
    );
}

function checkForAllAlbumPhotoList () {
    console.log('entering checkForAllAlbumPhotoList function');
    //console.log(loadFBNextPhotos.paging.next);
    if (loadFBNextPhotos.paging.next !== undefined) {
        FB.api(loadFBNextPhotos.paging.next,
                function (response) {
                    loadFBNextPhotos = response;
                    facebookAlbumPhotosData = facebookAlbumPhotosData.concat(response.data);
                    checkForAllAlbumPhotoList();
                });
    } else {
        readFBAlbumsPhotos(facebookAlbumPhotosData);
        multiselectionFbPhotos();
    }
}


var FbAlbumData;
function readFBAlbumsPhotos (data) {
    console.log('entering readFBAlbumsPhotos function');
    console.dir(data);
    $('.facebookModalCheck .selectAllCheckIcon.active').removeClass('active');
    FbAlbumData = data;
    $.each(data, function (index, photo) {
        var node1 = $("<label/>").addClass('btn btn-primary');
        var node2 = $('<input />', {type: 'checkbox', value: photo.picture}).attr("data-OURL", photo.images[0].source).addClass("input_class_checkbox").appendTo(node1);       
        var node = $("<div/>").addClass('fb-albums-photos').data("source", photo.images[0].source).append($("<div/>").addClass('overlayCheckBtn')).append($("<div/>").addClass('fb-albums-thumb-check').css('background-image', 'url(' + photo.picture + ')'));        
        node.appendTo(node1);
        node1.appendTo($("#FBAlbumsPhotos"));
    });
    jQuery(".facebookModalCheck #addfbphotos").addClass("saveFbPhots");
    jQuery('.facebookModalCheck .selectAlbumTitile').hide();
    jQuery('.facebookModalCheck .closeFBModal').addClass('backFBModal').removeClass('closeFBModal');
    jQuery('.facebookModalCheck .selectAllFBContent').show();
}

function selectCheckUncheck () {
    if (jQuery(".facebookModalCheck .input_class_checkbox").length === jQuery('.facebookModalCheck #FBAlbumsPhotos .selected').length) {
        jQuery(".facebookModalCheck .selectAllCheckIcon").addClass('active').attr("checked", "checked");
    } else {
        jQuery(".facebookModalCheck .selectAllCheckIcon.active").removeClass('active').removeAttr("checked");
    }
}

function selectionFBPhotosCountUpdate () {
    setTimeout(function () {
        var fbSelectionCount = jQuery('.facebookModalCheck #FBAlbumsPhotos .selected').length;
        selectCheckUncheck();
        if (fbSelectionCount === 0 || fbSelectionCount === 1) {
            jQuery('.facebookModalCheck .fbphotosSelectionCount').text(fbSelectionCount + " Photo Selected");
        } else {
            jQuery('.facebookModalCheck .fbphotosSelectionCount').text(fbSelectionCount + " Photos Selected");
        }
        if (fbSelectionCount > 0) {
            jQuery('.facebookModalCheck .saveFbPhots').css({'color': '#48aede'});
        } else {
            jQuery('.facebookModalCheck .saveFbPhots').css({'color': '#7e7e7e'});
        }
    }, 10);
}



