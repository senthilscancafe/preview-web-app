/*global define, jQuery, window, getLocalizationValues*/
define(['Augment',
    'Instance',
    'GlobalData',
    'utils/CookieUtils',
    'hbs!views/uploader/templates/AmazonView'
], function (augment, instance, GlobalData, CookieUtils, tplAmazonView) {
    'use strict';
    var AmazonView = augment(instance, function () {
        var amazonView = this;
        this.amazonInitialisationFlag = 0;
        this.amazonCloudCurrentTitle = '';
        this.acCounter = 0;
        this.initFlag = 0;
        this.msgUtils = getLocalizationValues();
        this.baseURL = 'https://www.amazon.com/ap/oa';
        this.client_id = GlobalData.amazonClientId;
        this.scope = 'clouddrive:read_image';
        this.response_type = 'code';
        this.folderStuctureData = [];
        this.path = '';
        this.outFromFiles = 0;
        this.lastNode = 0;
        this.eventRegistered = 0;
        this.redirect_uri = GlobalData.amazonRedirectURL;


        this.getPermissionToken = function () {
            var w = 900;
            var h = 369;
            var title = "Photogurus Amazon Cloud Drive Login";
            var left = (screen.width / 2) - (w / 2);
            var top = (screen.height / 2) - (h / 2);
            var childWin = window.open(GlobalData.amazonAuthURL, title, 'toolbar=no,scrollbars=1,resizable=1,  location=yes, directories=no, status=no, menubar=no,copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
            return childWin;
        };

        this.getAccessToken = function () {
            var request = {
                grant_type: 'authorization_code',
                code: GlobalData.cloudData.accessToken,
                client_id: GlobalData.amazonClientId,
                client_secret: GlobalData.amazonSecretId,
                redirect_uri: GlobalData.amazonRedirectURL
            };
            jQuery.ajax({
                url: 'https://api.amazon.com/auth/o2/token',
                dataType: "json",
                data: request,
                type: "POST",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).done(function (data) {
                GlobalData.amazonAuth = data;
                amazonView.amazonInitialisationFlag = 0;
                amazonView.getRoot();
            }).fail(function () {
                jQuery(".loadingPhotogurusBody").hide();
                jQuery("#AmazonModal").modal('hide');
            });
        };

        this.getAccessByRefreshToken = function () {
            delete GlobalData.amazonAuth;
            jQuery(".loadingPhotogurusBody").hide();
            jQuery("#AmazonModal").modal('hide');
        };

        this.getRoot = function () {
            jQuery.ajax({
                url: 'https://drive.amazonaws.com/drive/v1/nodes?filters=kind:FOLDER AND isRoot:true',
                dataType: "json",
                type: "get",
                headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + GlobalData.amazonAuth.access_token}
            }).done(function (data) {
                amazonView.folderData = data.data;
                amazonView.outFromFiles = 0;
                amazonView.lastNode = 0;
                amazonView.amazonCloudRootId = amazonView.folderData[0].id;
                amazonView.path = amazonView.folderData[0].id;
                amazonView.getFileList(amazonView.amazonCloudRootId, 'Root');
                amazonView.folderStuctureData = [];
            }).fail(function (resp) {
                if (resp.status === 401) {
                    jQuery(".loadingPhotogurusBody").hide();
                    jQuery('.acLoginExpired').modal('show');
                    amazonView.getAccessByRefreshToken();
                } else {
                    amazonView.getPermissionToken();
                }
            });
        };

        var folderListResponseData = 0;
        this.getFolderData = function (folderID, folderName, successCallback) {
            var options = {
                url: 'https://cdws.us-east-1.amazonaws.com/drive/v1/nodes/' + folderID + '/children?filters=kind:FOLDER&tempLink=true&startToken=',
                dataType: "json",
                method: "GET",
                headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + GlobalData.amazonAuth.access_token}
            };
            function checkForfolders (folderID) {
                if (folderListResponseData.nextToken !== undefined) {
                    jQuery.ajax({
                        url: 'https://cdws.us-east-1.amazonaws.com/drive/v1/nodes/' + folderID + '/children?filters=kind:FOLDER&tempLink=true&startToken=' + folderListResponseData.nextToken,
                        dataType: "json",
                        method: "GET",
                        headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + GlobalData.amazonAuth.access_token}
                    }).done(function (data) {
                        folderListResponseData = data;
                        amazonView.folderData = amazonView.folderData.concat(data.data);
                        checkForfolders(folderID);
                    }).fail(function (resp) {
                        if (resp.status === 401) {
                            jQuery(".loadingPhotogurusBody").hide();
                            jQuery('.acLoginExpired').modal('show');
                        } else {
                            folderListResponseData = '';
                            successCallback();
                            amazonView.fileListUILoad();
                        }
                    });
                } else {
                    successCallback();
                }
            }

            jQuery.ajax(options).success(function (resp) {
                folderListResponseData = resp;
                amazonView.folderData = resp.data;
                amazonView.fileData = resp.data;
                if (resp.nextToken) {
                    checkForfolders(folderID);
                } else {
                    successCallback(resp);
                }
            }).fail(function (resp) {
                if (resp.status === 401) {
                    jQuery(".loadingPhotogurusBody").hide();
                    jQuery('.acLoginExpired').modal('show');
                }
            });
        };


        var fileListResponseData = 0;
        this.getFileList = function (folderID, folderName) {
            if (folderName.search("_images") === -1) {
                console.log("am here: "+folderName);

                amazonView.getFolderData(folderID, folderName, function folderSuccess () {

                    amazonView.folderData.sort(function (a, b) {
                        if (a.name.toUpperCase() < b.name.toUpperCase()) {
                            return -1;
                        }
                        if (a.name.toUpperCase() > b.name.toUpperCase()) {
                            return 1;
                        }
                        return 0;
                    });
                    jQuery.ajax({
                        url: 'https://cdws.us-east-1.amazonaws.com/drive/v1/nodes/' + folderID + '/children?filters=kind:FILE&sort=["contentProperties.contentDate DESC"]&tempLink=true',
                        dataType: "json",
                        type: "get",
                        headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + GlobalData.amazonAuth.access_token}
                    }).done(function (data) {
                        amazonView.fileData = data.data;
                        fileListResponseData = data;
                        if (amazonView.folderData.length === 0) {
                            amazonView.checkForFiles(folderID);
                        } else {
                            if (data.count > 0) {
                                amazonView.subfolderProp = {};
                                amazonView.subfolderProp = {
                                    id: folderID,
                                    name: folderName + "_images",
                                    version: data.count
                                };
                                amazonView.folderData.unshift(amazonView.subfolderProp);
                            }
                            amazonView.folderStuctureData.push(amazonView.folderData);
                            amazonView.folderUILoad(amazonView.folderData);
                        }
                    }).fail(function (resp) {
                        if (resp.status === 401) {
                            jQuery(".loadingPhotogurusBody").hide();
                            jQuery('.acLoginExpired').modal('show');
                        }
                    });
                }, function folderFailure (resp) {
                    if (resp.status === 401) {
                        jQuery(".loadingPhotogurusBody").hide();
                        jQuery('.acLoginExpired').modal('show');
                    }
                });
            } else {
                console.log("am here now: "+folderName);
                jQuery.ajax({
                    url: 'https://cdws.us-east-1.amazonaws.com/drive/v1/nodes/' + folderID + '/children?filters=kind:FILE&sort=["contentProperties.contentDate DESC"]&tempLink=true',
                    dataType: "json",
                    type: "get",
                    headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + GlobalData.amazonAuth.access_token}
                }).done(function (data) {
                    amazonView.fileData = data.data;
                    fileListResponseData = data;
                    amazonView.checkForFiles(folderID);

                }).fail(function (resp) {
                    if (resp.status === 401) {
                        jQuery(".loadingPhotogurusBody").hide();
                        jQuery('.acLoginExpired').modal('show');
                    }
                });
            }
        };

        this.checkForFiles = function (folderID) {
            if (fileListResponseData.nextToken !== undefined) {
                jQuery.ajax({
                    url: 'https://cdws.us-east-1.amazonaws.com/drive/v1/nodes/' + folderID + '/children?filters=kind:FILE&sort=["contentProperties.contentDate DESC"]&tempLink=true&startToken=' + fileListResponseData.nextToken,
                    dataType: "json",
                    type: "get",
                    headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + GlobalData.amazonAuth.access_token}
                }).done(function (data) {
                    fileListResponseData = data;
                    amazonView.fileData = amazonView.fileData.concat(data.data);
                    amazonView.checkForFiles(folderID);
                }).fail(function (resp) {
                    if (resp.status === 401) {
                        jQuery(".loadingPhotogurusBody").hide();
                        jQuery('.acLoginExpired').modal('show');
                    } else {
                        fileListResponseData = '';
                        amazonView.hideFolderScreen();
                        amazonView.fileListUILoad();
                        jQuery(".loadingPhotogurusBody").hide();
                    }
                });
            } else {
                amazonView.hideFolderScreen();
                amazonView.fileListUILoad();
                jQuery(".loadingPhotogurusBody").hide();
            }
        };

        this.addToUploader = function () {
            amazonView.amazonInitialisationFlag = 0;
            var divId = "amazonUploadView";
            var innerHtml = tplAmazonView({});
            jQuery('#' + divId).empty();
            jQuery('#' + divId).html(innerHtml);
            jQuery(".loadingPhotogurusBody").hide();
            amazonView.modalShow();
            amazonView.amazonModalAlignment();
            jQuery("#acReLoginWindow").click(amazonView.getAccessByRefreshToken);
        };

        this.modalShow = function () {
            jQuery(document).on('shown.bs.modal', '#AmazonModal', function () {
                if (CookieUtils.getCookie("awsAccessToken") !== '' || CookieUtils.getCookie("awsAccessToken") !== undefined) {
                    GlobalData.cloudData = {};
                    GlobalData.cloudData.accessToken = CookieUtils.getCookie("awsAccessToken");
                    if (GlobalData.amazonAuth === undefined) {
                        AmazonView.getAccessToken();
                    }
                }
            });
        };

        this.folderUILoad = function (folderData) {
            amazonView.folderData = folderData;
            jQuery("#AmazonModal").modal('show');
            jQuery(".loadingPhotogurusBody,.noImages").hide();
            jQuery("#AmazonModal #amazonCloudCollection").empty();
            for (var i = 0; i < amazonView.folderData.length; i++) {
                var node = jQuery("<div/>").attr({data: 'assets/images/uploader/flickr-root-thumbnail.png', id: amazonView.folderData[i].id}).addClass('ACModalAlbum');
                node.appendTo(jQuery("#amazonCloudCollection"));
                node.append(jQuery("<div/>").addClass('fb-albums-thumb').css({'background-image': 'url(assets/images/uploader/flickr-root-thumbnail.png)'}));
                if (amazonView.folderData[i] !== undefined) {
                    if (amazonView.folderData[i].isRoot === undefined) {
                        node.append(jQuery('<div/>').text(amazonView.folderData[i].name).addClass('file-title'));
                    } else {
                        node.append(jQuery('<div/>').text("Root").addClass('file-title'));
                    }
                }
                node.append(jQuery('<div/>').text((amazonView.folderData[i].version - 1) + ' Photos').addClass('numberOfPhotos'));
            }
            jQuery(".loadingPhotogurusBody").hide();
            amazonView.initFlag++;
            if (amazonView.initFlag === 1) {
                amazonView.eventRegisteration();
            }
        };

        this.fileListUILoad = function () {
            amazonView.outFromFiles = 1;
            jQuery(".noImages").hide();
            jQuery('#AmazonModal #amazonCloudSelectedPhotosCollection').empty();
            jQuery(".loadingPhotogurusBody").hide();
            jQuery('.albumPhotoList').html("");
            var actualImagesCount = 0;
            jQuery.each(amazonView.fileData, function (index, files) {
                if (files.contentProperties.contentType.search(".jpg") > 0 || files.contentProperties.contentType.search(".png") > 0 || files.contentProperties.contentType.search(".jpeg") > 0 || files.contentProperties.contentType.search(".JPG") > 0 || files.contentProperties.contentType.search(".PNG") > 0 || files.contentProperties.contentType.search(".JPEG") > 0) {
//                    var li = '<li class="albumPhotoListItem"><img src="' + files.tempLink + '"/></li>';
//                    jQuery('.albumPhotoList').append(li);
                    var node1 = jQuery("<label/>").addClass('btn btn-primary');
                    jQuery('<input />', {type: 'checkbox', value: files.name + "|" + files.tempLink, 'data-imageType': files.name}).addClass("input_class_checkbox").appendTo(node1);
                    var node = jQuery("<div/>").addClass('fb-albums-photos').append(jQuery("<div/>").addClass('overlayCheckBtn')).append(jQuery("<div/>").addClass('fb-albums-thumb-check').css('background-image', 'url(' + files.tempLink + '/alt/thumb?viewBox=115&fit=clip)'));
                    node.appendTo(node1);
                    node1.appendTo(jQuery("#amazonCloudSelectedPhotosCollection"));
                    actualImagesCount++;
                    jQuery("#amazonUploadView .modal-body-right").mCustomScrollbar("scrollTo", "top");
                }
            });
            if (actualImagesCount === 0 || amazonView.fileData.length === 0) {
                jQuery(".noImages").text("There are no photos in this folder");
                jQuery('.selectAllFBContent').hide();
                jQuery(".noImages").show();
            } else {
                amazonView.amazonInitialisationFlag++;
                if (amazonView.amazonInitialisationFlag === 1) {
                    amazonView.multiselectionProcess();
                }
            }
        };

        this.eventRegisteration = function () {
            jQuery.mCustomScrollbar.defaults.theme = "3d-thick";
            jQuery("#AmazonModal").on('click', '.ACModalAlbum', amazonView.openAlbum);
            jQuery("#AmazonModal").on('click', '#closeACAlbumList', amazonView.closeScreen);
            jQuery("#AmazonModal").on('click', '.closeFBModal', amazonView.levelBack);
            jQuery("#AmazonModal").on('click', '.backACModal', amazonView.levelBackFromFiles);
            jQuery('.loseSelectionACModal #redirectionToACAlbumBtn').click(amazonView.albumScreen);
            jQuery('.loseSelectionCloseACModal #redirectionToUploaderACAlbumBtn').click(function () {
                amazonView.albumScreen();
                jQuery('#AmazonModal').modal('hide');
            });
            jQuery("#AmazonModal #importSelectACPhotosId").click(function () {
                if (amazonView.amazonSelectionCount > 0) {
                    amazonView.selectACPhotosToCollection();
                }
            });
            jQuery("#AmazonModal .modal-body-right").mCustomScrollbar({
                callbacks: {
                    onScroll: function () {
                    }
                }
            });
            amazonView.amazonModalAlignment();
        };

        this.closeScreen = function () {
            if (amazonView.amazonSelectionCount > 0) {
                jQuery('.loseSelectionCloseACModal').modal('show');
            } else {
                amazonView.albumScreen();
                jQuery('#AmazonModal').modal('hide');
            }
        };

        this.openAlbum = function () {
            jQuery('.loadingPhotogurusBody').show();
            jQuery('#AmazonModal .selectAllCheckIcon.active').removeClass('active');
            amazonView.lastNode = 1;
            amazonView.amazonCloudCurrentId = this.id;
            amazonView.amazonCloudCurrentTitle = this.children[1].textContent;
            amazonView.outFromFiles = 0;
            amazonView.getFileList(amazonView.amazonCloudCurrentId, amazonView.amazonCloudCurrentTitle);
        };

        this.levelBack = function () {
            if (amazonView.outFromFiles === 1) {
                if (amazonView.folderStuctureData.length > 1) {
                    amazonView.folderStuctureData.pop();
                    amazonView.outFromFiles = 0;
                } else {
                    amazonView.lastNode = 0;
                }
            }
            if (amazonView.lastNode === 0) {
                jQuery('#AmazonModal').modal('hide');
            } else {

                if (amazonView.folderStuctureData.length === 0) {
                    jQuery('#AmazonModal').modal('hide');
                } else {
                    if (amazonView.folderStuctureData.length === 1) {
                        amazonView.lastNode = 0;
                        amazonView.folderUILoad(amazonView.folderStuctureData[0]);
                        jQuery(".closeFBModal").addClass("closeAmazonModal");
                    } else {
                        amazonView.folderData = amazonView.folderStuctureData.pop();
                        amazonView.folderUILoad(amazonView.folderData);
                    }
                }
            }
        };

        this.levelBackFromFiles = function () {
            if (amazonView.amazonSelectionCount > 0) {
                jQuery('.loseSelectionACModal').modal('show');
            } else {
                amazonView.albumScreen();
            }
        };

        this.hideFolderScreen = function () {
            jQuery('#AmazonModal .selectAlbumTitile,.choose').hide();
            jQuery('#AmazonModal .closeFBModal').addClass('backACModal').removeClass('closeFBModal');
            jQuery('#AmazonModal .selectAllFBContent,#AmazonModal .acphotosSelectionCount,#AmazonModal #closeACAlbumList').show();
            jQuery("#AmazonModal .GoogleAlbumContainer #fbInnerTitle").text(amazonView.amazonCloudCurrentTitle);
            jQuery("#amazonUploadView .modal-body-right").mCustomScrollbar("scrollTo", "top");
            jQuery('#AmazonModal .saveFbPhots').css({'color': '#7e7e7e'});
            jQuery('#AmazonModal .acphotosSelectionCount').text("0 photos selected");
            jQuery("#AmazonModal #importSelectACPhotosId,#AmazonModal #amazonCloudSelectedPhotosCollection,#AmazonModal #addfbphotos,#AmazonModal .selectAllFBContent,#AmazonModal .choose,.loadingPhotogurusBody").show();
            jQuery("#AmazonModal #amazonCloudCollection,#AmazonModal .selectAlbumTitile,#AmazonModal #import").hide();
            jQuery("#AmazonModal .GPModalAlbum-focus").removeClass("GPModalAlbum-focus");
            jQuery("#AmazonModal .rightArrow").removeClass("rightArrow");
        };

        this.amazonModalAlignment = function () {
            var topMargin = 0;
            topMargin = (jQuery(window).height() - 493) / 2;
            if (topMargin > 0) {
                jQuery('#AmazonModal .modal-dialog').css('margin-top', topMargin + 'px');
            }
        };
        this.albumScreen = function () {
//            amazonView.folderData = amazonView.folderStuctureData.pop();
            jQuery('#AmazonModal #amazonCloudCollection,#AmazonModal .selectAlbumTitile').show();
            jQuery('#amazonCloudSelectedPhotosCollection,#AmazonModal .acphotosSelectionCount,#AmazonModal .selectAllFBContent,#AmazonModal #importSelectACPhotosId,#AmazonModal #closeACAlbumList,.noImages').hide();
            jQuery('#AmazonModal .GoogleAlbumContainer #fbInnerTitle').text("Amazon Drive");
            jQuery("#AmazonModal .backACModal").addClass('closeFBModal').removeClass('backACModal');
            jQuery("#AmazonModal .selectAllCheckIcon ").removeClass('active');
            jQuery("#amazonUploadView .modal-body-right").mCustomScrollbar("scrollTo", "top");
            amazonView.amazonSelectionCount = 0;
        };
        this.multiselectionProcess = function () {
            var acSelectedPhotosContainer = jQuery('#amazonCloudSelectedPhotosCollection').finderSelect({enableDesktopCtrlDefault: true});
            acSelectedPhotosContainer.finderSelect('addHook', 'highlight:before', function (el) {
                el.find('input').prop('checked', true);
                el.find('.overlayCheckBtn').css('display', 'block');
                amazonView.selectionACPhotosCountUpdate();
            });
            acSelectedPhotosContainer.finderSelect('addHook', 'unHighlight:before', function (el) {
                el.find('input').prop('checked', false);
                el.find('.overlayCheckBtn').css('display', 'none');
                amazonView.selectionACPhotosCountUpdate();
            });
            acSelectedPhotosContainer.finderSelect("children").dblclick(function () {
                amazonView.selectionACPhotosCountUpdate();
            });
            acSelectedPhotosContainer.on("click", ":checkbox", function () {
                amazonView.selectionACPhotosCountUpdate();
            });

            jQuery('#AmazonModal .GoogleAlbumContainer .selectAllCheckIcon').click(function () {
                if (jQuery(this).hasClass('active')) {
                    acSelectedPhotosContainer.finderSelect('unHighlightAll');
                    jQuery(this).removeClass('active');
                    amazonView.selectionACPhotosCountUpdate();
                } else {
                    acSelectedPhotosContainer.finderSelect('highlightAll');
                    jQuery(this).addClass('active');
                    amazonView.selectionACPhotosCountUpdate();
                }
            });
            acSelectedPhotosContainer.on("mousedown", function () {
                return false;
            });
            jQuery('#AmazonModal').on('keyup', function (e) {
                if (e.ctrlKey) {
                    if (e.keyCode === 65) {
                        jQuery('#amazonCloudSelectedPhotosCollection input').prop('checked', true);
                        jQuery('#amazonCloudSelectedPhotosCollection label').removeClass('un-selected').addClass('selected');
                        jQuery('.overlayCheckBtn').css('display', 'block');
                        amazonView.selectionACPhotosCountUpdate();
                    }
                    if (e.ctrlKey && e.altKey && (e.keyCode === 65)) {
                        jQuery('#amazonCloudSelectedPhotosCollection input').prop('checked', false);
                        jQuery('#amazonCloudSelectedPhotosCollection label').removeClass('selected').addClass('un-selected');
                        jQuery('.overlayCheckBtn').css('display', 'none');
                        amazonView.selectionACPhotosCountUpdate();
                    }
                }
            });
        };
        this.selectCheckUncheck = function () {
            if (jQuery("#amazonCloudSelectedPhotosCollection .input_class_checkbox").length === jQuery('#amazonCloudSelectedPhotosCollection .selected').length) {
                jQuery("#AmazonModal .GoogleAlbumContainer .selectAllCheckIcon").addClass('active').attr("checked", "checked");
            } else {
                jQuery("#AmazonModal .GoogleAlbumContainer .selectAllCheckIcon.active").removeClass('active').removeAttr("checked");
            }
        };
        this.selectionACPhotosCountUpdate = function () {
            setTimeout(function () {
                amazonView.amazonSelectionCount = jQuery('#amazonCloudSelectedPhotosCollection .selected').length;
                amazonView.selectCheckUncheck();
                if (amazonView.amazonSelectionCount === 0 || amazonView.amazonSelectionCount === 1) {
                    jQuery('.acphotosSelectionCount').text(amazonView.amazonSelectionCount + " photo selected");
                } else {
                    jQuery('.acphotosSelectionCount').text(amazonView.amazonSelectionCount + " photos selected");
                }
                if (amazonView.amazonSelectionCount > 0) {
                    jQuery('#AmazonModal .saveFbPhots').css({'color': '#48aede'});
                } else {
                    jQuery('#AmazonModal .saveFbPhots').css({'color': '#7e7e7e'});
                }
            }, 10);
        };

        this.selectACPhotosToCollection = function () {
            jQuery('.pageload').show();
            var fileType = 0;
            var checkedValues = [];
            jQuery('#amazonCloudSelectedPhotosCollection label.selected').map(function () {
                if (this.children[0].value.search(".jpg") > 0 || this.children[0].value.search(".png") > 0 || this.children[0].value.search(".jpeg") > 0 || this.children[0].value.search(".JPG") > 0 || this.children[0].value.search(".PNG") > 0 || this.children[0].value.search(".JPEG") > 0) {
                    checkedValues.push(this.children[0].value);
                } else {
                    fileType++;
                }

            }).get();




            var acDataArray = [];
            jQuery('#files .preview-img-ac').each(function () {
                acDataArray.push(jQuery(this).data("orignalurl"));
            });
            var checkedValuesData = JSON.parse(JSON.stringify(checkedValues));
            var dupsCount = 0;
            for (var j = 0; j < checkedValues.length; j++) {
                var splitURLData = checkedValues[j].split("|");
                for (var i = 0; i < acDataArray.length; i++) {
                    var imageName = acDataArray[i].split("|");
                    if (splitURLData[0] !== undefined) {
                        if (splitURLData[0].replace(/ /g, '') === imageName[0].replace(/ /g, '')) {
                            dupsCount++;
                            checkedValuesData.splice(checkedValues.indexOf(splitURLData[0]), 1);
                        }
                    }
                }
            }
            for (var ii = 0; ii < checkedValuesData.length; ii++) {
                var splitURLDataNext = checkedValuesData[ii].split("|");
                var gpName = splitURLDataNext[0];
                jQuery('#files').append('<div class="col-xs-4 mycomputerImages preview-img-ac" data-orignalURL=' + checkedValuesData[ii].replace(/ /g, '') + ' data-toggle="tooltip" title=' + gpName + '><div class="amazonPhotoSmallIcon"></div><div class="generalTextName">' + gpName + '</div><div class="deleteIcon delete spriteImage"></div></div>');
                var toolEle = jQuery(".preview-img-ac").find("[data-orignalURL='" + splitURLDataNext[1] + "']");
                toolEle.attr('title', gpName);
            }
            jQuery('input:checkbox').removeAttr('checked');
            amazonView.acCounter = parseInt(jQuery("#acCountHidden").val());
            amazonView.totalCount = parseInt(jQuery("#totalCountHidden").val());
            amazonView.totalCount = amazonView.totalCount + checkedValuesData.length;
            jQuery("#totalCountHidden").val(amazonView.totalCount);
            amazonView.acCounter = amazonView.acCounter + checkedValuesData.length;
            jQuery("#acCountHidden").val(amazonView.acCounter);
            jQuery("#ACPhotoCounter").text(amazonView.acCounter + " Photos added");
            jQuery("#totalCount").text('Total ' + amazonView.totalCount + ' Images Selected');
            jQuery("#ACPhotoCounter,#totalCount").css("visibility", "visible");
            checkedValues = [];
            jQuery(".GPModalAlbum-focus").removeClass("GPModalAlbum-focus");
            jQuery(".choose").show();
            jQuery(".rightArrow").removeClass("rightArrow");
            jQuery(".sourceFlagImg").hide();
            if (dupsCount > 0) {
                jQuery('.pageload').hide();
                jQuery(".duplicateAlert .modal-body p").text(dupsCount + " duplicates have been removed from your selection");
                jQuery(".duplicateAlert").modal("show");
            } else if (fileType > 0) {
                jQuery('.pageload').hide();
                jQuery('.fileType').modal('hide');
                jQuery('.fileType .modal-body p').text(amazonView.msgUtils.fileTypeAllow);
                jQuery('.fileType').modal('show');
            } else {
                jQuery('.pageload').hide();
                jQuery('#AmazonModal').modal('hide');
            }
            jQuery('.pageload').hide();
            jQuery('#AmazonModal .selectAllFBContent,#AmazonModal #closeGPAlbumList').hide();
            jQuery('#AmazonModal .selectAlbumTitile').show();
            jQuery('#AmazonModal .selectAllCheckIcon.active').removeClass('active');
            amazonView.albumScreen();
            jQuery('#AmazonModal').modal('hide');
            jQuery(".loadingPhotogurusBody").hide();
        };
        this.reset = function () {
            amazonView.amazonInitialisationFlag = 0;
            amazonView.initFlag = 0;
        };


    });
    return AmazonView;
});