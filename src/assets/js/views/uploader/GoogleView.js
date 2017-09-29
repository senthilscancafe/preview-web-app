var myvar = '';
/*global define, jQuery, window, console*/

define(['Augment',
    'Instance',
    'GlobalData',
    'hbs!views/uploader/templates/GoogleView'
], function (augment, instance, GlobalData, tplGoogleView) {
    'use strict';
    var GoogleView = augment(instance, function () {
        var googleView = this;
        this.googleInitialisationFlag = 0;
        var msgUtils = getLocalizationValues();
        var GPOauthURL = GlobalData.htmlUploaderGPOauthURL;
        this.count = 0;
        var accessToken = '';
        var refreshToken = '';
        var payload = {
            accessToken: accessToken,
            refreshToken: refreshToken
        };
        var albumFeedUrl = "";
        var albumPhotosCount = 0;
        var gpCounter = 0;
        var goolgeAlbumText = "";
        var totalCount = 0;
        this.init = function () {};
        this.delete_cookie = function (name) {
            document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        };
        this.addToDiv = function () {
            var divId = "googleUploadView";
            var innerHtml = tplGoogleView({});
            jQuery('#' + divId).empty();
            jQuery('#' + divId).html(innerHtml);
            this.preloader();
            this.modalIsShown();
        };
        this.modalIsShown = function () {
            googleView.googleModalAlignment();
            jQuery(".loadingPhotogurusBody").show();
            jQuery('#importSelectFlickerPhotosId').hide();
            jQuery(document).on('shown.bs.modal', '#GPModal', function () {
                jQuery(".loadingPhotogurusBody").show();
                jQuery('.gpphotosSelectionCount,#importSelectFlickerPhotosId').hide();
                accessToken = googleView.getCookies('gAccessToken');
                refreshToken = googleView.getCookies('gRefreshToken');

                var payload = {
                    accessToken: accessToken,
                    refreshToken: refreshToken
                };
                jQuery(".noAlubmModal").on('click', '.noAlubmCloseModal', function () {
                    //                window.close();
                });
                if (accessToken === '') {
                    //                window.close();
                } else {
                    jQuery('.back').hide();
                    jQuery.ajax({
                        url: 'googlephoto/google_api.php',
                        type: 'POST',
                        cache: false,
                        dataType: 'JSON',
                        async: false,
                        data: {
                            payload: payload,
                            action: 'getalbum'
                        },
                        error: function (responseData) {
                            jQuery(".loadingPhotogurusBody").hide();
                            jQuery('.noAlubmModal').modal('show');
                            deleteAllCookies();

                            function deleteAllCookies() {
                                googleView.delete_cookie("gRefreshToken");
                                googleView.delete_cookie("gAccessToken");
                            }
                        },
                        success: function (responseData) {
                            jQuery('#GPModal #googleAlbumCollection,#GPModal .selectAlbumTitile').show();
                            if (responseData.success === false) {
                                $('.pageload').hide();
                                deleteAllCookies();
                                jQuery('.gpLoginExpired').modal('show');
                            } else if (responseData.albumData.length < 1) {
                                jQuery('.noAlubmModal').modal('show');
                                deleteAllCookies();
                            } else if (responseData.albumData.length === 1) {
                                if (responseData.albumData[0].albumId === null) {
                                    jQuery("#GPModal #googleAlbumCollection").hide();
                                    jQuery('.noAlubmModal').modal('show');
                                    deleteAllCookies();
                                }

                            }

                            function deleteAllCookies() {
                                googleView.delete_cookie("gRefreshToken");
                                googleView.delete_cookie("gAccessToken");
                            }

                            if (responseData.success) {
                                jQuery("#GPModal #googleAlbumCollection").empty();

                                jQuery.each(responseData.albumData, function (index, value) {
                                    if (parseInt(value.noOfPhotos) !== 0) {
                                        jQuery('#GPModal').modal('show');
                                        var node = jQuery("<div/>").attr({
                                            "data": value.albumFeedUrl,
                                            "data-count": value.noOfPhotos
                                        }).addClass('GPModalAlbum');
                                        node.appendTo(jQuery("#googleAlbumCollection"));
                                        node.append(jQuery("<div/>").addClass('fb-albums-thumb').css({
                                            'background-image': 'url(' + value.albumCoverImage + ')'
                                        }));
                                        node.append(jQuery('<div/>').text(value.albumTitle).addClass('file-title'));
                                        if (value.noOfPhotos > 1) {
                                            node.append(jQuery('<div/>').text(value.noOfPhotos + ' Photos').addClass('numberOfPhotos'));
                                        } else {
                                            node.append(jQuery('<div/>').text(value.noOfPhotos + ' Photo').addClass('numberOfPhotos'));
                                        }
                                    }
                                });
                                if (responseData.albumData.length > 1) {
                                    goolgeAlbumText = "Google Photos Albums";
                                    jQuery("#GPModal #fbInnerTitle").text('Google Photos Albums');
                                } else {
                                    goolgeAlbumText = "Google Photos Album";
                                    jQuery("#GPModal #fbInnerTitle").text('Google Photos Albums');
                                }
                                jQuery("#googleAlbumCollection .GPModalAlbum").on('click', function () {
                                    jQuery(".choose").hide();
                                    jQuery('#GPModal .selectAlbumTitile').hide();
                                    jQuery('#GPModal .closeFBModal').addClass('backGPModal').removeClass('closeFBModal');
                                    jQuery('#GPModal .selectAllFBContent,#GPModal .gpphotosSelectionCount,#GPModal #closeGPAlbumList').show();

                                    var gpAlbumText = this.children[1].textContent;
                                    jQuery("#GPModal .GoogleAlbumContainer #fbInnerTitle").text(gpAlbumText);

                                    albumFeedUrl = jQuery(this).attr('data');
                                    albumPhotosCount = jQuery(this).attr('data-count');
                                    jQuery("#googleUploadView .modal-body-right").mCustomScrollbar("scrollTo", "top");
                                });
                                jQuery('.loadingPhotogurusBody').hide();
                            }
                        }
                    });
                }
            });
            jQuery("#GPModal").on('click', '.backGPModal', function () {
                if (googleView.googleSelectionCount > 0) {
                    jQuery('.loseSelectionGPModal').modal('show');
                } else {
                    googleView.albumScreen();
                }
            });
            jQuery("#GPModal").on('click', '#closeGPAlbumList', function () {
                if (googleView.googleSelectionCount > 0) {
                    jQuery('.loseSelectionCloseGPModal').modal('show');
                } else {
                    googleView.albumScreen();
                    jQuery('#GPModal').modal('hide');
                }
            });
            jQuery('.loseSelectionGPModal #redirectionToGPAlbumBtn').click(googleView.albumScreen);
            jQuery('.loseSelectionCloseGPModal #redirectionToUploaderGPAlbumBtn').click(function () {
                googleView.albumScreen();
                jQuery('#GPModal').modal('hide');
            });
            jQuery("#GPModal").on('click', '.closeFBModal', function () {
                jQuery('#GPModal').modal('hide');
            });


        };
        this.getCookies = function (cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ')
                    c = c.substring(1);
                if (c.indexOf(name) === 0)
                    return c.substring(name.length, c.length);
            }
            return "";
        };

        this.preloader = function () {
            accessToken = googleView.getCookies('gAccessToken');
            refreshToken = googleView.getCookies('gRefreshToken');

            jQuery('#gpReLoginWindow').click(googleView.googleLoginWindowCallOnSesssionExprire);

            jQuery("#GPModal .back").click(function () {
                jQuery(".back").hide();
                jQuery("#GPModal #googleSelectedAlbumPhotosCollection").hide();
                jQuery("#GPModal #importSelectFlickerPhotosId").hide();
                jQuery("#GPModal #googleAlbumCollection").show();
                jQuery("#GPModal #import").show();
                jQuery("#GPModal #fbInnerTitle").text(goolgeAlbumText);
            });

            jQuery(".noPhotoModal").on('click', '.noImagesCloseModal', function () {
                jQuery("#GPModal .back").hide();
                jQuery("#GPModal #googleSelectedAlbumPhotosCollection").empty();
                jQuery("#GPModal #googleSelectedAlbumPhotosCollection").hide();
                jQuery("#GPModal #importSelectFlickerPhotosId").hide();
                jQuery("#GPModal #googleAlbumCollection").show();
                jQuery("#GPModal #import").show();
                jQuery("#GPModal #fbInnerTitle").text(goolgeAlbumText);
            });

            jQuery("#GPModal").on('click', '.GPModalAlbum', function () {
                var checkAutoBackUp = this.children[1].textContent;
                if (checkAutoBackUp === "Auto Backup" || checkAutoBackUp === "Auto-Backup") {
                    jQuery('#GPModal .selectAllCheckIcon,#GPModal .selectAllAlbumPhots').hide();
                    googleView.GPModalAlbumSelected();
                } else {
                    jQuery('#GPModal .selectAllCheckIcon,#GPModal .selectAllAlbumPhots').show();
                    googleView.GPModalAlbumSelected();
                }
            });

            jQuery("#GPModal #importSelectFlickerPhotosId").click(function () {
                if (googleView.googleSelectionCount > 0) {
                    googleView.selectGooglePhotosToCollection();
                }
            });
            jQuery(".duplicateAlert").on('click', '.dupMessageBtn', function () {

            });
        };
        this.GPModalAlbumSelected = function () {
            jQuery("#googleUploadView .modal-body-right").mCustomScrollbar("scrollTo", "top");
            jQuery('#GPModal .saveFbPhots').css({
                'color': '#7e7e7e'
            });
            jQuery('#GPModal .gpphotosSelectionCount').text("0 photos selected");
            jQuery("#GPModal #importSelectFlickerPhotosId,#GPModal #googleSelectedAlbumPhotosCollection,#GPModal #addfbphotos,#GPModal .selectAllFBContent,#GPModal .choose,.loadingPhotogurusBody").show();
            jQuery("#GPModal #googleAlbumCollection,#GPModal .selectAlbumTitile,#GPModal #import").hide();
            jQuery("#GPModal .GPModalAlbum-focus").removeClass("GPModalAlbum-focus");
            jQuery("#GPModal .rightArrow").removeClass("rightArrow");
            var accessToken = googleView.getCookies('gAccessToken');
            var refreshToken = googleView.getCookies('gRefreshToken');

            var payload = {
                albumFeedUrl: albumFeedUrl,
                photosCount: albumPhotosCount,
                accessToken: accessToken,
                refreshToken: refreshToken
            };
            jQuery.ajax({
                url: 'googlephoto/google_api.php',
                type: 'POST',
                cache: false,
                dataType: 'JSON',
                data: {
                    payload: payload,
                    action: 'getalbumphotos'
                },
                success: function (responseData) {
                    jQuery('#GPModal #googleSelectedAlbumPhotosCollection').empty();
                    jQuery(".loadingPhotogurusBody").hide();
                    if (responseData.albumImages.length < 1) {
                        jQuery('.noPhotoModal').modal('show');
                    }
                    if (responseData.success) {
                        jQuery('.albumPhotoList').html("");
                        console.log();
                        jQuery.each(responseData.albumImages, function (index, value) {
                            var li = '<li class="albumPhotoListItem"><img src="' + value.imageUrls[0] + '" data="' + value.imageUrls[3] + '"/></li>';
                            jQuery('.albumPhotoList').append(li);
                            var node1 = jQuery("<label/>").addClass('btn btn-primary');
                            var node2 = jQuery('<input />', {
                                type: 'checkbox',
                                value: value.imageUrls[2] + "###" + value.imageUrls[0],
                                'data-imageType': value.imageType
                            }).addClass("input_class_checkbox").appendTo(node1);
                            var node = jQuery("<div/>").addClass('fb-albums-photos').append(jQuery("<div/>").addClass('overlayCheckBtn')).append(jQuery("<div/>").addClass('fb-albums-thumb-check').css('background-image', 'url(' + value.imageUrls[2] + ')'));
                            node.appendTo(node1);
                            node1.appendTo(jQuery("#googleSelectedAlbumPhotosCollection"));
                        });

                        if (responseData.albumImages.length !== 0) {
                            googleView.googleInitialisationFlag++;
                            if (googleView.googleInitialisationFlag === 1) {
                                googleView.multiselectionProcess();
                            }
                        }
                    }
                }
            });
        };
        this.selectGooglePhotosToCollection = function () {
            var fileType = 0;
            var checkedValues = [];
            jQuery('#googleSelectedAlbumPhotosCollection label.selected').map(function () {
                console.log(this.children[0]);
                if (this.children[0].dataset['imagetype'] === '1') {
                    checkedValues.push(this.children[0].value);
                } else {
                    fileType++;
                }
            }).get();
            var gpDataArray = [];
            jQuery('#files .preview-img-gp').each(function (index, obj) {
                gpDataArray.push(jQuery(this).data("orignalurl"));
            });
            var checkedValuesData = JSON.parse(JSON.stringify(checkedValues));
            var dupsCount = 0;
            for (var j = 0; j < checkedValues.length; j++) {
                var splitURLData = checkedValues[j].split("###");
                for (var i = 0; i < gpDataArray.length; i++) {
                    if (splitURLData[1] !== undefined) {
                        if (splitURLData[1] === gpDataArray[i]) {
                            dupsCount++;
                            checkedValuesData.splice(checkedValues.indexOf(splitURLData[1]), 1);
                        }
                    }
                }
            }
            for (var i = 0; i < checkedValuesData.length; i++) {
                var splitURLData = checkedValuesData[i].split("###");
                var gpName = splitURLData[1].split('/');
                gpName = gpName[gpName.length - 1];
                jQuery('#files').append('<div class="col-xs-4 mycomputerImages preview-img-gp" data-orignalURL=' + splitURLData[1] + ' data-toggle="tooltip" title=' + gpName + '><div class="googlePhotoSmallIcon"></div><div class="generalTextName">' + gpName + '</div><div class="deleteIcon delete spriteImage"></div></div>');
                var toolEle = jQuery(".preview-img-gp").find("[data-orignalURL='" + splitURLData[1] + "']");
                toolEle.attr('title', gpName);
            }
            jQuery('input:checkbox').removeAttr('checked');
            gpCounter = parseInt(jQuery("#gpCountHidden").val());
            totalCount = parseInt(jQuery("#totalCountHidden").val());
            totalCount = totalCount + checkedValuesData.length;
            jQuery("#totalCountHidden").val(totalCount);
            gpCounter = gpCounter + checkedValuesData.length;
            jQuery("#gpCountHidden").val(gpCounter);
            jQuery("#GPhotoCounter").text(gpCounter + " Photos added");
            jQuery("#totalCount").text('Total ' + totalCount + ' Images Selected');
            jQuery("#GPhotoCounter,#totalCount").css("visibility", "visible");
            checkedValues = [];
            jQuery(".GPModalAlbum-focus").removeClass("GPModalAlbum-focus");
            jQuery(".choose").show();
            jQuery(".rightArrow").removeClass("rightArrow");
            jQuery(".sourceFlagImg").hide();
            if (dupsCount > 0) {
                jQuery(".duplicateAlert .modal-body p").text(dupsCount + " duplicates have been removed from your selection");
                jQuery(".duplicateAlert").modal("show");
            } else if (fileType > 0) {
                jQuery('.fileType').modal('hide');
                jQuery('.fileType .modal-body p').text(msgUtils.fileTypeAllow);
                jQuery('.fileType').modal('show');
            } else {
                jQuery('#GPModal').modal('hide');
            }
            jQuery('#GPModal .selectAllFBContent,#GPModal #closeGPAlbumList').hide();
            jQuery('#GPModal .selectAlbumTitile').show();
            jQuery('#GPModal .selectAllCheckIcon.active').removeClass('active');
            googleView.albumScreen();
            jQuery('#GPModal').modal('hide');
        };
        this.googleModalAlignment = function () {
            var topMargin = 0;
            topMargin = (jQuery(window).height() - 493) / 2;
            if (topMargin > 0) {
                jQuery('#GPModal .modal-dialog').css('margin-top', topMargin + 'px');
            }
        };

        this.googleLoginWindowCallOnSesssionExprire = function () {
            jQuery('#GPModal').modal('hide');
            var w = 900;
            var h = 369;
            var title = "Photo gurus Google Photo Login";
            var left = (screen.width / 2) - (w / 2);
            var top = (screen.height / 2) - (h / 2);
            var childWin = window.open(GPOauthURL, title, 'titlebar=no, toolbar=no, location=yes, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=900, height=369, top=' + top + ', left=' + left);
            return childWin;
        };

        this.multiselectionProcess = function () {
            var gpSelectedPhotosContainer = jQuery('#googleSelectedAlbumPhotosCollection').finderSelect({
                enableDesktopCtrlDefault: true
            });
            gpSelectedPhotosContainer.finderSelect('addHook', 'highlight:before', function (el) {
                el.find('input').prop('checked', true);
                el.find('.overlayCheckBtn').css('display', 'block');
                googleView.selectionGPPhotosCountUpdate();
            });
            gpSelectedPhotosContainer.finderSelect('addHook', 'unHighlight:before', function (el) {
                el.find('input').prop('checked', false);
                el.find('.overlayCheckBtn').css('display', 'none');
                googleView.selectionGPPhotosCountUpdate();
            });
            gpSelectedPhotosContainer.finderSelect("children").dblclick(function () {
                googleView.selectionGPPhotosCountUpdate();
            });
            gpSelectedPhotosContainer.on("click", ":checkbox", function (e) {
                googleView.selectionGPPhotosCountUpdate();
            });

            jQuery('#GPModal .GoogleAlbumContainer .selectAllCheckIcon').click(function () {
                if (jQuery(this).hasClass('active')) {
                    gpSelectedPhotosContainer.finderSelect('unHighlightAll');
                    jQuery(this).removeClass('active');
                    googleView.selectionGPPhotosCountUpdate();
                } else {
                    gpSelectedPhotosContainer.finderSelect('highlightAll');
                    jQuery(this).addClass('active');
                    googleView.selectionGPPhotosCountUpdate();
                }
            });
            gpSelectedPhotosContainer.on("mousedown", function (e) {
                return false;
            });
            jQuery('#GPModal').on('keyup', function (e) {
                if (e.ctrlKey) {
                    if (e.keyCode === 65) {
                        jQuery('#googleSelectedAlbumPhotosCollection input').prop('checked', true);
                        jQuery('#googleSelectedAlbumPhotosCollection label').removeClass('un-selected').addClass('selected');
                        jQuery('.overlayCheckBtn').css('display', 'block');
                        googleView.selectionGPPhotosCountUpdate();
                    }
                    if (e.ctrlKey && e.altKey && (e.keyCode == 65)) {
                        jQuery('#googleSelectedAlbumPhotosCollection input').prop('checked', false);
                        jQuery('#googleSelectedAlbumPhotosCollection label').removeClass('selected').addClass('un-selected');
                        jQuery('.overlayCheckBtn').css('display', 'none');
                        googleView.selectionGPPhotosCountUpdate();
                    }
                }
            });
        };
        this.selectCheckUncheck = function () {
            if (jQuery("#googleSelectedAlbumPhotosCollection .input_class_checkbox").length === jQuery('#googleSelectedAlbumPhotosCollection .selected').length) {
                jQuery("#GPModal .GoogleAlbumContainer .selectAllCheckIcon").addClass('active').attr("checked", "checked");
            } else {
                jQuery("#GPModal .GoogleAlbumContainer .selectAllCheckIcon.active").removeClass('active').removeAttr("checked");
            }
        };
        this.selectionGPPhotosCountUpdate = function () {
            setTimeout(function () {
                googleView.googleSelectionCount = jQuery('#googleSelectedAlbumPhotosCollection .selected').length;
                googleView.selectCheckUncheck();
                if (googleView.googleSelectionCount === 0 || googleView.googleSelectionCount === 1) {
                    jQuery('.gpphotosSelectionCount').text(googleView.googleSelectionCount + " photo selected");
                } else {
                    jQuery('.gpphotosSelectionCount').text(googleView.googleSelectionCount + " photos selected");
                }
                if (googleView.googleSelectionCount > 0) {
                    jQuery('.saveFbPhots').css({
                        'color': '#48aede'
                    });
                } else {
                    jQuery('.saveFbPhots').css({
                        'color': '#7e7e7e'
                    });
                }
            }, 10);
        };
        this.albumScreen = function () {
            jQuery('#GPModal #googleAlbumCollection,#GPModal .selectAlbumTitile').show();
            jQuery('#googleSelectedAlbumPhotosCollection,#GPModal .gpphotosSelectionCount,#GPModal .selectAllFBContent,#GPModal #importSelectFlickerPhotosId,#GPModal #closeGPAlbumList').hide();
            jQuery('#GPModal .GoogleAlbumContainer #fbInnerTitle').text(goolgeAlbumText);
            jQuery("#GPModal .GoogleAlbumContainer #fbInnerTitle").text(goolgeAlbumText);
            jQuery("#GPModal .backGPModal").addClass('closeFBModal').removeClass('backGPModal');
            jQuery("#GPModal .selectAllCheckIcon ").removeClass('active');
            jQuery("#googleUploadView .modal-body-right").mCustomScrollbar("scrollTo", "top");
            googleView.googleSelectionCount = 0;
        };
        this.reset = function () {
            googleView.googleInitialisationFlag = 0;
        };

    });
    return GoogleView;
});