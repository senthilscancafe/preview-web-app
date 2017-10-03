var timeoutSessionCheck = '';
var safari3rdPageblurIssueFlag = 0;
var feedbackBoxHeight = 114;
var mDevice = 0;
if (navigator.userAgent.match(/Android/i) || (navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i))) {
    mDevice = 1;
} else {
    mDevice = 0;
}

$(function () {
    //Owner|Recipient
    var type = null;
    type = 'Owner';
    console.log($('#shared_status').val(), 'ViewContent');
    if($('#shared_status').val() === '8001'){
        type = 'Recipient';
    }
    console.log(type);
    var pixel_params = null;
    pixel_params = {'User_role' : type};
    //Fb Pixel
    fbq('track', 'ViewContent', pixel_params);

    connectStoryCall();
    var isMobileDevice = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);
    var firefoxNotSupported = navigator.userAgent.match('Firefox/46.0');
    if (firefoxNotSupported) {
        alert("Please, use a different browser to see your story . This browser version has limitation");
    }

    if (isMobileDevice) {
        jQuery('.flip-control-actions').hide();
    }
    if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Mac') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
        jQuery('.fl-screen ').hide();
    }
    //    $('#next').hide();   
    var cachedValue = 1;

    function is_cached(src) {
        var image = new Image();
        image.src = src;
        //        alert(image.src);
        return image.complete;
    }

    function imagesCached(images, len) {
        for (var i = 0; i < len; i++) {
            cachedValue = is_cached(images[i]);
            if (cachedValue && i === (len - 1)) {
                //                alert(cachedValue + " " + (len - 1))
                return cachedValue;
            }
        }

    }

    function downloadAllThumbs() {
        var allThumbImageDownloadInterval = setInterval(function () {
            var getCachedValue = imagesCached(images, images.length);
            if (getCachedValue) {
                //                    loadRealImages(0);
                clearInterval(allThumbImageDownloadInterval);
            }
        }, 100);
        for (i = 0; i < images.length; i++) {
            jQuery("#hidden_image_url_l_" + i).attr({
                'src': images[i].src
            });
        }
        //            loadRealImages(0);
    }

    function loadRealImages(initial) {
        $('[id^=image_url_]').each(function () {
            var obj = $(this);
            var srcImg;
            var suffix = $(this).attr('id').split('_').pop();
            if ($('#hidden_image_url_l_' + suffix).attr('src') !== undefined) {
                $('#hidden_image_url_l_' + suffix).attr('src', images[suffix]);
            }
            $('#hidden_image_url_l_' + suffix).load(function () {
                if (initial === "initial") {}
                srcImg = $('#hidden_image_url_l_' + suffix).attr('src');
                $('.image_url_' + suffix).css("background-image", "url('" + srcImg + "')");
                //            $('.image_url_' + suffix).css("background-image", "url('" + srcImg + "')");
                //              $('#hidden_image_url_l_' + suffix).remove();
                $('.image_url_' + suffix + '.even').find("#loadingThmubs").css('display', 'none');
                if (suffix === '0') {
                    $('.image_url_' + suffix + '.odd').find("#loadingThmubs").css('display', 'none');
                    $('.image_url_' + suffix).find("#loadingThmubs").css('display', 'none');
                }
                $('.image_url_' + suffix).attr('id', 'image_' + suffix);
            });
        });
    }

    function coverImageDownload(initial) {
        var suffix = initial;
        var srcImg;
        if ($('#hidden_image_url_l_' + suffix).attr('src') !== undefined) {
            $('#hidden_image_url_l_' + suffix).attr('src', images[suffix]);
        }
        $('#hidden_image_url_l_' + suffix).load(function () {
            if (initial === "initial") {}
            srcImg = $(this).attr('src');
            $('.image_url_' + suffix).css("background-image", "url('" + srcImg + "')");
            //            $('.image_url_' + suffix).css("background-image", "url('" + srcImg + "')");
            //              $('#hidden_image_url_l_' + suffix).remove();
            $('.image_url_' + suffix + '.even').find("#loadingThmubs").css('display', 'none');
            if (suffix === 0) {
                $('.image_url_' + suffix + '.odd').find("#loadingThmubs").css('display', 'none');
                $('.image_url_' + suffix).find("#loadingThmubs").css('display', 'none');
            }
            $('.image_url_' + suffix).attr('id', 'image_' + suffix);
        });
    }



    //     if ($('#hidden_image_url_l_' + suffix).attr('src') !== undefined) {
    //            $('#hidden_image_url_l_' + suffix).attr('src', images[suffix]);
    //        }
    var loaderFadeOutInterval = setTimeout(function () {
        setFlipBookSize();
        clearInterval(imageDownloadInterval);
        $("#wrapper").show();
        $('#loading').hide();
        //        alert("called after 15 seconds");
    }, 15000);


    var publicShare = getCookie('publicShare');
    jQuery(".logo,.home,.portraitHome,.home").click(function () {
        window.location.href = homeURL;
        if (publicShare) {
            window.location.href = commercialURL;
        } else {
            window.location.href = homeURL;
        }
    });



    $('#sign_up_btn').click(function () {
        //        if (getCookie('copylink')) {
        //            window.location.href = signupURL;
        //        } else {
        setCookie("publicShare", 1, expireDays);
        window.location.href = personalizedSignupURL;
        //        }

    });
    $('#login_btn').click(function () {
        //        if (getCookie('copylink')) {
        //            window.location.href = loginURL;            
        //        } else {
        setCookie("publicShare", 1, expireDays);
        window.location.href = personalizedLoginURL;
        //        }

    });
    var mobileFlag;
    if ((navigator.userAgent.match(/Android/i))) {
        mobileFlag = 1;
        $(".logoPos").removeClass("logoPos");
        $(".logo").css('position', 'fixed');
        $(".logo").css('z-index', '2030');
    } else if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i))) {
        mobileFlag = 1;
    }

    if (mobileFlag === 1) {
        var imageDownloadInterval = setInterval(function () {
            var getCachedValue = imagesCached(imagesThumb, 1);
            if (getCachedValue) {
                setFlipBookSize();
                $("#wrapper").show();
                $('#loading').hide();
                //                alert("wait");
                coverImageDownload(0);
                downloadAllThumbs();
                clearInterval(loaderFadeOutInterval);
                clearInterval(imageDownloadInterval);
            }
        }, 3000);
        $('.logo').attr({
            'src': '../assets/images/photogurus_logo_fixed_nav_new.png'
        });
    } else {

        // first 3 original image is hidden now
        /*
         var imageDownloadInterval = setInterval(function () {
         var getCachedValue = imagesCached(images, 3);
         if (getCachedValue) {
         setFlipBookSize();
         $("#wrapper").show();
         $('#loading').hide();
         clearInterval(imageDownloadInterval);
         }
         }, 1000);
         */

        var imageDownloadInterval = setInterval(function () {
            var getCachedValue = imagesCached(images, 1);
            if (getCachedValue) {
                setFlipBookSize();
                $("#wrapper").show();
                $('#loading').hide();
                downloadAllThumbs();
                clearInterval(loaderFadeOutInterval);
                clearInterval(imageDownloadInterval);
            }
            coverImageDownload(0);
        }, 100);



        if ($(window).width() > 767 && $(window).width() < 1025) {
            $('.logo').css('width', '139px');
            $('.logo').css('src', '../assets/imagesphotogurus_logo_fixed_nav_new.png');
        } else {

            $('.logo').attr({
                'src': '../assets/images/photogurus_logo_fixed_nav_new1.png'
            });
        }
    }
    $(".loaderFor").hide();
    //    backPageHeight();
    $('.commonbackCover').css('display', 'none');
    //$('.flipbook-body').css('display', 'block');
    document.getElementById("flip_body").style.display = "block";
    $('.show-warning-no-images').hide();
    if ((navigator.userAgent.match(/Android/i))) {
        isAndroid = 1;
    } else if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i))) {
        if (navigator.userAgent.match(/iPad/i)) {
            iPad = 1;
        }
        isIOS = 1;
    }

    var oTurn = $('#flipbook').turn({
        width: 1700,
        height: 850,
        elevation: 150,
        gradients: false,
        //        autoCenter: true,
        cornerSize: 100,
        acceleration: true,
        start: function (event, pageObject, corner) {
            if (pageObject.next === 1)
                event.preventDefault();
        },
        turning: function (event, page, view) {
            if (page === 1) {
                $('#next').show();
                event.preventDefault();
                $('.flipbook-bottom').hide();
            }

        }
    });
    $("body").css("overflow", "hidden");
    // controllers of previous and next page
    $("#prev").click(function (e) {
        e.preventDefault();
        oTurn.turn("previous");
        previousTrayImageMove();
    });

    var enterPrintFlow = function (){
        setCookie('printFromPreview', 1, expireDays);
        var orderId = getCookie('story_id');
        setCookie('orderId', orderId, expireDays);
        setCookie('previewURL', window.location.href, expireDays);
        window.location.href = homeURL;
    };

    var logout = function () {
        deleteCookie("custId");
        deleteCookie('authToken');
        deleteCookie('custId');
        deleteCookie('custName');
        deleteCookie('custProfilePic');
        deleteCookie('custEmail');
        deleteCookie('is_verified');
        deleteCookie('verify');
        deleteCookie('sessionKey');
        deleteCookie("isRememberMe");
        deleteAllCookies();
        window.onbeforeunload = null;
        window.onunload = null;
        var interval_id = window.setInterval("", 9999);
        for (var i = 1; i < interval_id; i++) {
            window.clearInterval(i);
        }
        document.location.reload();
        window.location.href = loginURL;
    };

    var validateUserLocation = function (countryCode) {
        //intention is if regioncode doesnot match log out user, since its expected that during sign in the region code captured and the country code captured during tap on print icon should be same
        var customerId = getCookie('custId');
        if (customerId) {
            var promiseOrderInfo = getProducts(customerId);// book information
            $.when(promiseOrderInfo)
            .done(function (obj) {
                console.dir(obj);
                console.log(countryCode);
                if (obj.arr_data === null && obj.int_status_code === 0) {
                    //logout the user
                    logout();
                }
                if (obj.arr_data !== null && obj.int_status_code !== 0) {
                    if(countryCode !== obj.arr_data.details[0].printRegionCode){
                        //logout the user
                        logout();
                    }else{
                        enterPrintFlow();
                    }
                }
                
            });
        }
    };

    var initiatePrintFromPreview = function (){
        jQuery('body').addClass('page-loaded');
        jQuery('body > .pageload').fadeIn();
        
        var getGeoLocationPromise = getGeoLocation();
        getGeoLocationPromise.then(function(data) {
            if(data.country_code){
                return data.country_code;
            }else{
                return Promise.reject('Could not retrieve user country code');
            }
            
        }).then(function(countryCode) {
            jQuery('body').addClass('page-loaded').removeClass('page-loading');
            jQuery('body > .pageload').fadeOut();

            countryCode = countryCode.toUpperCase();
            console.log(countryCode);
            //countryCode = 'US';
            if(countryCode === 'US'){
                validateUserLocation(countryCode);
            }else if(countryCode === 'DE' || countryCode === 'NO'){
                jQuery('.user-region-modal .modal-header h4').text('Download our app!');
                jQuery('.user-region-modal #user-region-modal-content').text('Please download our app to print your photostory.');
                jQuery('.user-region-modal #user-region-modal-left-action').text('Download');
                jQuery('.user-region-modal #user-region-modal-right-action').text('Cancel');
                jQuery('.user-region-modal').modal('show');

                jQuery('.user-region-modal #user-region-modal-left-action').click(function(event){
                    event.stopPropagation();
                    if ((navigator.userAgent.match(/Android/i))) {
                        window.location.href = "https://play.google.com/store/apps/details?id=com.photogurus";
                    } else if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i))) {
                        window.location.href = "https://itunes.apple.com/us/app/photogurus/id799452318?ls=1&mt=8";
                    } else {
                        window.location.href = 'https://www.photogurus.com/?page=send_link';
                    }
                });
            }else{
                jQuery('.alertDialog').modal('show');
                jQuery('.alertDialog .modal-header').hide();
                jQuery('#displayText').text('Sorry, currently we do not offer photo book printing service in your region.');
            }
        })['catch'](function(e) {
            console.log('Exception: '+e);
        });
    };

    jQuery("#flip_body").on('click', '.spreadPrintIcon', function (event) {
        event.stopPropagation();
        console.log("printFromPreview set");
        initiatePrintFromPreview();
    });


    jQuery("#flip_body").on('click', '.spreadShareIcon', function () {
        console.log("shareFromPreview set");
        setCookie('shareFromPreview', 1, expireDays);
        var orderId = getCookie('story_id');
        setCookie('orderId', orderId, expireDays);
        window.location.href = homeURL;
    });


    $("#flip_body").on('click', '#next,#frontCoverArrow,.dFrontNextControl', function (e) {
        //        console.log("called");
        oTurn.turn("next");
        backPageHeight();
        $('.flipbook-bottom').show();
        $('.mainCoverActionButtonContainer').css({
            'visibility': 'hidden'
        })
        //        nextTrayImageMove();
    });
    //    $("#next,#frontCoverArrow,.dFrontNextControl img").click(function (e) {
    //        e.preventDefault();
    //        oTurn.turn("next");
    //        backPageHeight();
    ////        nextTrayImageMove();
    //    });
    var sentFieldFocus = 1;
    $("#flipbook").on("focusin", "#phoneAndEmailId", function () {
        sentFieldFocus = 0;
    });
    $("#flipbook").on("focusout", "#phoneAndEmailId", function () {
        sentFieldFocus = 1;
    });

    function checkKey(e) {

        e = e || window.event;
        if (sentFieldFocus) {
            if (e.keyCode === 38) {
                // up arrow
            } else if (e.keyCode === 40) {
                // down arrow
            } else if (e.keyCode === 37) {
                // left arrow
                e.preventDefault();
                oTurn.turn("previous");
            } else if (e.keyCode === 39) {
                // right arrow
                oTurn.turn("next");
                backPageHeight();
            }
        }


    }


    document.onkeydown = checkKey;
    // height and widht set   
    // after window resize
    $(window).resize(function () {
        $('.flip-control-front').show();
        $('#frontCoverArrow').show();
        potraitFlag = 0;
        $('#prev').hide();
        if (isMobile) {
            $('.home').hide();
            if (pageNumber === 1) {
                $('#frontCoverArrow').show();
                $('#next').hide();

            } else {
                $('#next').hide();
                $('#frontCoverArrow').hide();
            }
        } else {
            $('.home').show();
            if (pageNumber === 1) {
                $('#frontCoverArrow').show();
                $('#next,.flip-control.right').hide();
            } else {
                var lastSpread = 'c' + jQuery(".coverImages").last().data('value');
                if (jQuery('.wellsActive').hasClass(lastSpread)) {
                    $('#next,.flip-control.right').hide();
                } else {
                    $('#next,.flip-control.right').show();
                }
                $('#frontCoverArrow').hide();
            }
        }
        adjustDownloadBtn();
        setFlipBookSize();
        backPageHeight();
    });
    /*fullscreen button clicked*/
    $('.fullscreen').click(function (e) {
        e.preventDefault();
        toggleFullScreen();
    });
    /* full screen exit on ESC key */
    $(document).keyup(function (e) {
        if (e.keyCode === 27) { // escape key maps to keycode `27`
            if (fullScreen === 1) {
                $('.exitFullscreen').addClass('fullscreen').removeClass('exitFullscreen');
                jQuery('.trayOutterBlock').show();
                fullScreen = 0;
            }
        }
    });
    /* Fulll screen icon change on toggle for every browser*/
    document.addEventListener("fullscreenchange", function () {
        if (!document.fullscreen) {
            jQuery('.exitFullscreen').addClass('fullscreen').removeClass('exitFullscreen');
            jQuery('.trayOutterBlock').show();
            fullScreen = 0;
        }
    }, false);
    document.addEventListener("mozfullscreenchange", function () {
        if (!document.mozFullScreen) {
            $('.exitFullscreen').addClass('fullscreen').removeClass('exitFullscreen');
            jQuery('.trayOutterBlock').show();
            fullScreen = 0;
        }
    }, false);
    document.addEventListener("webkitfullscreenchange", function () {
        if (!document.webkitIsFullScreen) {
            $('.exitFullscreen').addClass('fullscreen').removeClass('exitFullscreen');
            jQuery('.trayOutterBlock').show();
            fullScreen = 0;
        }
    }, false);
    if (Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0) {
        $('.fullscreen-logo').hide();
    }

    if ($('.bottomTrayInnerContainer').css('marginLeft') === '0px') {
        //        $('#leftArrowTray').css('visibility', 'hidden');
    } else {
        $('#leftArrowTray').css('visibility', 'visible');
    }

    $('#leftArrowTray').click(function () {
        previousTrayImageMove();
    });
    $('#rightArrowTray').click(function () {
        nextTrayImageMove();
    });
    // jumping to page
    $('.flipbookWell').click(function () {
        $('.controls').hide();
        $('.flipbookWell').removeClass('wellsActive');
        $(this).addClass('wellsActive');
        $("#flipbook").turn("page", $(this).data('value'));
        backPageHeight();
        bottomTrayMoveWellActive();
    });

    function foundDeviceLink() {
        if ((navigator.userAgent.match(/Android/i))) {
            isAndroid = 1;
            window.location.href = 'https://play.google.com/store/apps/details?id=com.photogurus';
        } else if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i))) {
            window.location.href = 'https://itunes.apple.com/us/app/photogurus/id799452318?ls=1&mt=8';
        }
    }

    $('#startUpload').click(function () {
        foundDeviceLink();
    });
    var count = 0;
    var image_count = images.length;
    var image_last = image_count - 1;
    if ($('#image_count').val() > 0) {
        $('.arrowContainRight').show();
        $('.galleria-container').show();
        $('.show-warning-no-images').hide();
    } else {
        jQuery('.warning-icon-div-no-images img').attr({
            'src': '../assets/images/icon_alert.png'
        });
        jQuery('.show-warning-no-images').show();
        jQuery('.show-warning,.trayOutterBlock,.galleria-container').hide();
    }

    //    $('#hidden_image_url_0').attr('src', 'http://d-photostory.s3.amazonaws.com/900002320/5yhabac343ksv/spreads/cover_2.jpg');
    //    $('#hidden_image_url_'+image_last).attr('src', 'http://d-photostory.s3.amazonaws.com/900002320/5yhabac343ksv/spreads/cover_1.jpg');

    if (parseInt(jQuery('#userLoggedIn').val()) !== 1) {
        //        console.log("0");
        // jQuery('.flipbook-bottom').hide();
        jQuery('.activeNav .likeAndComments').hide();
    } else {
        //        console.log("1");
        // jQuery('.flipbook-bottom').show();
    }
    jQuery('.send-comment').attr('disabled', 'false');
    $('.send-comment').prop('disabled', false);
    var likeVal = $('.p1').attr("data-likes");
    if (likeVal.length < 1) {
        $('.like-count').text("0");
    } else {
        $('.like-count').text(likeVal);
    }
    $('.flipbook-comments').removeClass("active");
    var commentVal = $('.p1').attr("data-comments");
    if (commentVal.length < 1) {
        $('.comments-count').text("0");
    } else {
        $('.comments-count').text(commentVal);
    }

    var spreadId = $('.p1').attr("data-spreadid");
    $('.likeAndComments').attr("id", spreadId);
    jQuery('.flipbook-like').removeClass("active blankYellow activeYellow");
    if (parseInt($('.p1').attr("data-likestatus"))) {
        jQuery('.flipbook-like').addClass("active");
    } else {
        jQuery('.flipbook-like').removeClass("active");
    }
    var flipComplete = null;
    jQuery("#flipbook").bind("turning", function (event, page, view) {
        console.log("showing: "+page);
        if (page === 1) {
            jQuery('.flip-control-actions').addClass('editIconLayering');
            $('.flipbook-bottom').hide();
            if (!isMobileDevice) {
                $('.mainCoverActionButtonContainer').css({
                    'visibility': 'visible'
                });
            }
        } else {
            $('.flipbook-bottom').show();
            $('.mainCoverActionButtonContainer').css({
                'visibility': 'hidden'
            });
            jQuery('.editIconLayering').removeClass('editIconLayering');
        }

        var totalPage = (jQuery("#image_count").val()-1)*2;
        jQuery(".hard.page.p"+(totalPage+1)+".odd").css('display','block');
        jQuery(".hard.image_url_1.page.p2.even").css('display','none');
        console.log(jQuery("#image_count").val());
        
        console.log(totalPage);
        if (page === (totalPage-2) || page === ((totalPage-2)+1)) {
            jQuery(".hard.image_url_"+((totalPage-2)/2)+".page.p"+(totalPage-1)+".odd").css('display','none');
            jQuery(".hard.page.p"+(totalPage+1)+".odd").css('display','none');
        }
        

        if (page === 6 || page === 7) {

            var url6 = jQuery(".hard.image_url_3.page.p6.even").css('background-image');
            var url7 = jQuery(".hard.image_url_3.page.p7.odd").css('background-image');
            console.log(url6);
            if (url6 !== url7) {
                console.log(url6);
                jQuery('.hard.image_url_3.page.p7.odd').css('background-image', url6);
            }
            //            $('#hidden_image_url_l_3').load(function () {
            //                jQuery('.hard.image_url_3.page.p7.odd').css('background-image', 'url(' + $('#hidden_image_url_l_3').attr('src') + ')');
            //                console.log(page + "image is downloaded");
            //            });
        }
        if (isMobileDevice) {
            $('.flipbook-bottom').hide();
            $('.mainCoverActionButtonContainer').css({
                'visibility': 'hidden'
            })
            jQuery('.prevControl.controls img').attr({
                'src': "../assets/images/prevControl.png"
            });
            jQuery('.nextControl.controls img').attr({
                'src': "../assets/images/nextControl.png"
            });
            jQuery('.flip-control-actions').hide();
        }
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE");
        var edge = ua.indexOf("Trident");
        if (msie > 0 || edge > 0) {
            var marginLeftArrow = ((($('.flipbookContainer').width() - $('#flipbook').width()) - ($('.flip-control').width() * 2)) / 2) - ($('.flip-control').width() - 10);
            jQuery('.flip-control.left').css('margin-left', marginLeftArrow + 'px');
        }



        //        jQuery('.flip-control.left').css('margin-left', ((($('.flipbookContainer').width() - $('#flipbook').width()) - ($('.flip-control').width() + 10)) / 2) - 30);
        //        var marginLeftArrow = ((($('.flipbookContainer').width() - $('#flipbook').width()) - ($('.flip-control').width() * 2)) / 2) - ($('.flip-control').width() + 20);
        //        if (marginLeftArrow > 0) {
        //            marginLeftArrow = -marginLeftArrow;
        //        }
        //        jQuery('.flip-control.left').css('margin-left', marginLeftArrow + 'px');
        //        if (fullScreen !== 0) {
        //            jQuery('.flip-control.left').css('margin-left', ((($('.flipbookContainer').width() - $('#flipbook').width()) - ($('.flip-control').width() + 10)) / 2) - 30);
        //        }
        //        if (flipComplete === null) {
        //            flipComplete = setTimeout(function () {
        ////                $('.flip-control.left').css('margin-left', ((($('.flipbookContainer').width() - $('#flipbook').width()) - ($('.flip-control').width() + 10)) / 2) - $('.flip-control').width());
        //                $('.flipbook-comments').removeClass("active");
        //                var likeVal = $('.p' + page).attr('data-likes');
        //                if (likeVal.length < 1) {
        //                    $('.like-count').text("0");
        //                } else {
        //                    $('.like-count').text(likeVal);
        //                }
        //                var commentVal = $('.p' + page).attr('data-comments');
        //                if (commentVal.length < 1) {
        //                    $('.comments-count').text("0");
        //                } else {
        //                    $('.comments-count').text(commentVal);
        //                }
        //                $('.likeAndComments').attr("id", $('.p' + page).attr('data-spreadid'));
        //
        ////        console.log("data" + $('.p' + page).attr("data-likestatus"));
        //
        //                jQuery('.flipbook-like').removeClass("active blankYellow activeYellow");
        //                if (parseInt($('.p' + page).attr("data-likestatus"))) {
        //                    jQuery('.flipbook-like').addClass("active");
        //                } else {
        //                    jQuery('.flipbook-like').removeClass("active");
        //                }
        //                pageNumber = page;
        //                if ((parseInt(jQuery('.lastPage').attr("data-likestatus")) === 1) || (parseInt(jQuery('.lastPage').attr("data-comments")) > 0)) {
        //                    if ((parseInt($('#shared_status').attr("value")) === 8000) || (parseInt($('#shared_status').attr("value")) === 8001)) {
        //                        console.log("user liked");
        //                        $('#visit_count').attr("value", "5");
        //                    }
        //                }
        //                clearTimeout(flipComplete);
        //            }, 1000);
        //        }

        loadRealImages(page);
        if (page === 1) {
            var currentWindowWidth = $('#flipbook').width();
            $('#flipbook').css('margin-left', '-' + (currentWindowWidth / 2) + 'px');
            $('#prev').hide();
            //            $('#frontCoverArrow').show();
            $('.flip-control-front').show();
            $('#frontCoverArrow').show();
            //            if (fbWebView === 1) {
            //            $('.flip-control').show();
            //            }
            $('.flip-control').hide();

        } else {
            $('.flip-control').show();
            //            $('#frontCoverArrow').hide();
            $('.flip-control-front').hide();
            var currentWindowWidth = $('#flipbook').width();
            $('#flipbook').css('margin-left', '0px');
            if (potraitFlag === 1 || isMobile === false) {
                //                $('.flip-control').show();
            } else {
                $('.flip-control').hide();
            }
            //            if (fbWebView === 1) {
            //            $('.flip-control').hide();
            //            }
        }
        /*
         $("#flipbook").bind("last", function (event) {
         var currentWindowWidth = $('#flipbook').width();
         $('#flipbook').css('margin-left', (currentWindowWidth / 3) + 'px');
         $('#next').hide();
         backPageHeight();
         });
         */
    });
    var testresults;
    var isEmail = 0;

    function checkemail() {
        var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        if (filter.test($("#phoneAndEmailId").val())) {
            isEmail = 1;
            testresults = true;
        } else {
            if ($("#phoneAndEmailId").val() === "") {
                //$('.ocperson').text("Please enter email or mobile number");
                $('.ocperson').text("Please enter the email address");
            } else {
                $('.ocperson').text("Invalid email address");
            }
            testresults = false;
            isEmail = 0;
        }
        return (testresults);
    }

    function isValidPhonenumber(value) {
        var check = checkemail();
        if (check) {
            return true;
        } else {
            return (/^\d{7,}$/).test(value.replace(/[\s()+\-\.]|ext/gi, ''));
        }
    }
    //    $("#flipbook").on("click", "#donwload_now", function () {
    ////        foundDeviceLink();
    //    });

    function sentLink() {
        var phoneNumberValue = $("#phoneAndEmailId").val();
        if (isValidPhonenumber(phoneNumberValue)) {
            $('.ocperson').css('visibility', 'hidden');
            //            var send_link_url = $('#send_link_url').val();
            var send_link_url = $('#send_link_url').val() + phoneNumberValue;
            var country_code = '';
            if (isEmail === 0) {
                country_code = $('#country_code').val();
            }


            $.ajax({
                url: send_link_url,
                type: 'GET',
                beforeSend: function (xhr) {
                    $(".loaderFor").show();
                    //xhr.setRequestHeader('x-api-session-key', getCookie("sessionKey"));
                    //xhr.setRequestHeader('version', 1);
                },
                success: function (response) {
                    $(".loaderFor").hide();
                    var msg = response.str_status_message;
                    $('.ocperson').css('visibility', 'visible');
                    $('.ocperson').text(msg);
                    $('.clearIcon').css('visibility', 'visible');
                    setTimeout(function () {
                        $('.ocperson').css('visibility', 'hidden');
                    }, 5000); // <-- time in milliseconds
                    setTimeout(function () {
                        $('.closeButton').css('visibility', 'hidden');
                    }, 5000); // <-- time in milliseconds
                }
            });
        } else {
            var filter = /^([\w-]+(?:\.[\w-]+)*)@$/i;
            var numbers = /^[0-9]+$/;
            if (filter.test($("#phoneAndEmailId").val())) {
                $('.ocperson').text("Invalid email address");
            }
            //            else if (numbers.test($("#phoneAndEmailId").val())) {
            //                $('.ocperson').text("Invalid mobile number");
            //            }
            $('.closeButton').css('visibility', 'visible');
            $('.clearIcon').css('visibility', 'hidden');
            $('.ocperson').css('visibility', 'visible');
        }
    }
    $("#flipbook").on("click", "#getLink", sentLink);
    $("#id_of_textbox").keyup(function (event) {
        if (event.keyCode === 13) {
            sentLink();
        }
    });
    $('.clearIcon').css('visibility', 'visible');
    $("#flipbook").on("click", ".closeButton", function () {
        $("#phoneAndEmailId").val("");
        $('.closeButton').css('visibility', 'hidden');
        $('.ocperson').css('visibility', 'hidden');
    });
    $("#flipbook").on("click", "#googlePlayId", function () {
        window.location = 'https://play.google.com/store/apps/details?id=com.photogurus';
    });
    $("#flipbook").on("click", "#appleStoreId", function () {
        window.location = 'https://itunes.apple.com/us/app/photogurus/id799452318?ls=1&mt=8';
    });
    // $(".body").on("click", ".js-textareacopybtn", function () {
    //     evt.stopPropagation();
    //
    //    });
    $('.js-copytext').val(window.location.href);
    $('.js-textareacopybtn').click(function () {
        $('.js-copytext').val(window.location.href);
        var copyTextarea = document.querySelector('.js-copytext');
        copyTextarea.select();
        try {
            var successful = document.execCommand('copy');
            var test = document.queryCommandSupported("copy");
            var msg = successful ? 'successful' : 'unsuccessful';
            if (msg === 'unsuccessful') {
                if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
                    alert("Use ctrl + c on safari");
                }
            } else {
                alert("link copied");
            }
        } catch (err) {}
    });
    $("#flipbook").on("keypress", "#phoneAndEmailId", function () {
        $('.closeButton').css('visibility', 'hidden');
        $('.ocperson').css('visibility', 'hidden ');
        $('.clearIcon').css('visibility', 'visible');
        if ($("#phoneAndEmailId").val() === "") {
            $('.clearIcon').css('visibility', 'hidden');
        }
    });
    $("#flipbook").on("click", ".clearIcon", function () {
        $("#phoneAndEmailId").val("");
        $('.clearIcon').css('visibility', 'hidden');
    });
    //    $('.other-rows-likes').mCustomScrollbar({
    //        theme: "dark"
    //    });
    //    loadRealImages("initial");

    /* full screen for browser followin code*/
    var fullScreenApi = {
            supportsFullScreen: false,
            nonNativeSupportsFullScreen: false,
            isFullScreen: function () {
                return false;
            },
            requestFullScreen: function () {},
            cancelFullScreen: function () {},
            fullScreenEventName: '',
            prefix: ''
        },
        browserPrefixes = 'webkit moz o ms khtml'.split(' ');
    // check for native support
    if (typeof document.cancelFullScreen !== 'undefined') {
        fullScreenApi.supportsFullScreen = true;
    } else {
        // check for fullscreen support by vendor prefix
        for (var i = 0, il = browserPrefixes.length; i < il; i++) {
            fullScreenApi.prefix = browserPrefixes[i];
            if (typeof document[fullScreenApi.prefix + 'CancelFullScreen'] !== 'undefined') {
                fullScreenApi.supportsFullScreen = true;
                break;
            }
        }
    }
    // update methods to do something useful
    if (fullScreenApi.supportsFullScreen) {
        fullScreenApi.fullScreenEventName = fullScreenApi.prefix + 'fullscreenchange';
        fullScreenApi.isFullScreen = function () {
            switch (this.prefix) {
                case '':
                    return document.fullScreen;
                case 'webkit':
                    return document.webkitIsFullScreen;
                default:
                    return document[this.prefix + 'FullScreen'];
            }
        };
        fullScreenApi.requestFullScreen = function (el) {
            return (this.prefix === '') ? el.requestFullScreen() : el[this.prefix + 'RequestFullScreen']();
        };
        fullScreenApi.cancelFullScreen = function (el) {
            return (this.prefix === '') ? document.cancelFullScreen() : document[this.prefix + 'CancelFullScreen']();
        };
    } else if (typeof window.ActiveXObject !== "undefined") {
        // IE.
        fullScreenApi.nonNativeSupportsFullScreen = true;
        fullScreenApi.requestFullScreen = fullScreenApi.requestFullScreen = function (el) {
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        };
        fullScreenApi.isFullScreen = function () {
            return document.body.clientHeight === screen.height && document.body.clientWidth === screen.width;
        };
    }
    // jQuery plugin
    if (typeof jQuery !== 'undefined') {
        jQuery.fn.requestFullScreen = function () {
            return this.each(function () {
                if (fullScreenApi.supportsFullScreen) {
                    fullScreenApi.requestFullScreen(this);
                }
            });
        };
    }
    // export api
    window.fullScreenApi = fullScreenApi;
    /* back cover feed back*/
    //    $('#visit_count').attr({"value": "3"});
    if ($('#visit_count').attr("value") === 1) {
        $('.feedback').show();
    } else {
        $('.feedback').hide();
    }
    $("#flipbook").on("click", ".good-feedback", good_feedback_Method);

    function good_feedback_Method() {
        $('.story-text').hide();
        $(this).addClass("selected");
        $(this).siblings().removeClass("selected");
        $(".feedback-forms").hide();
        $("#form_good").show();
        $('.feedback-all').css('margin-top', ($('#flipbook').height() - feedbackBoxHeight) / 2 + 'px');
    }
    $("#flipbook").on("click", ".ok-feedback", ok_feedback_Method);

    function ok_feedback_Method() {
        $('.story-text').hide();
        $(this).addClass("selected");
        $(this).siblings().removeClass("selected");
        $(".feedback-forms").hide();
        $("#form_ok").show();
        $('.feedback-all').css('margin-top', ($('#flipbook').height() - feedbackBoxHeight) / 2 + 'px');
    }
    $("#flipbook").on("click", ".bad-feedback", bad_feedback_Method);

    function bad_feedback_Method() {
        $('.story-text').hide();
        $(this).addClass("selected");
        $(this).siblings().removeClass("selected");
        $(".feedback-forms").hide();
        $("#form_bad").show();
        $('.feedback-all').css('margin-top', ($('#flipbook').height() - feedbackBoxHeight) / 2 + 'px');
    }
    $("#flipbook").on("click", "#send_good", send_good_Method);

    function send_good_Method() {
        var promiseRequestData = {
            "user_id": getCookie('custId'),
            "order_id": $('#order_id').attr("value"),
            "rating": "2",
            "comments": $("#form_good textarea").val()
        };
        var feedbackPromise = feedback(promiseRequestData);
        feedbackPromise.then(function (data) {
            if (data.int_status_code === 1) {
                $('#errorMessge').hide();
                $(".feedback-forms").hide();
                $('.feedback-all').css('margin-top', ($('#flipbook').height() - feedbackBoxHeight) / 2 + 'px');
                $("#flipbook").off("click", ".good-feedback");
                $("#flipbook").off("click", ".bad-feedback");
                $("#flipbook").off("click", ".ok-feedback");
            } else {
                $('#errorMessge').show();
            }
        }).fail(function () {});
    }
    $("#flipbook").on("click", "#send_ok", send_ok_Method);

    function send_ok_Method() {
        var promiseRequestData = {
            "user_id": getCookie('custId'),
            "order_id": $('#order_id').attr("value"),
            "rating": "1",
            "comments": $("#form_ok textarea").val()
        };
        var feedbackPromise = feedback(promiseRequestData);
        feedbackPromise.then(function (data) {
            if (data.int_status_code === 1) {
                $('#errorMessge').hide();
                $(".feedback-forms").hide();
                $('.feedback-all').css('margin-top', ($('#flipbook').height() - feedbackBoxHeight) / 2 + 'px');
                $("#flipbook").off("click", ".good-feedback");
                $("#flipbook").off("click", ".bad-feedback");
                $("#flipbook").off("click", ".ok-feedback");
            } else {
                $('#errorMessge').show();
            }
        }).fail(function () {});
    }
    $("#flipbook").on("click", "#send_dislike", send_dislike_Method);
    //    $(".flipbook-like").click(function() {
    //        console.log("liked");
    //        $('.likeBox').fadeIn();
    ////        if ($('.likeBox').is(':visible')) {
    ////            console.log("true");
    ////            $("#flipbook").turn("disable", true);
    ////        } else {
    ////            $("#flipbook").turn("disable", false);
    ////            console.log("false");
    ////        }
    //
    //    });
    $("#wrapper").on('click', '.flipbook-comments', function () {
        //        console.log("comments");
        if ((navigator.userAgent.match(/Android/i))) {
            middleMessage();
            jQuery('#messageModalFlipbook #download_text,#confirm_download_btn,#cancelBtn').show();
            jQuery('#messageModalFlipbook #enter_comment, #okBtn').hide();
            jQuery('#messageModalFlipbook').modal('show');
            jQuery('#confirm_download_btn').click(function () {
                //                console.log("clk");
                window.location.href = "https://play.google.com/store/apps/details?id=com.photogurus";
                jQuery('#messageModalFlipbook').modal('hide');
            });
        } else if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i))) {
            middleMessage();
            jQuery('#messageModalFlipbook #download_text,#confirm_download_btn,#cancelBtn').show();
            jQuery('#messageModalFlipbook #enter_comment, #okBtn').hide();
            jQuery('#messageModalFlipbook').modal('show');
            jQuery('#confirm_download_btn').click(function () {
                //                console.log("clk");
                window.location.href = "https://itunes.apple.com/us/app/photogurus/id799452318?ls=1&mt=8";
                jQuery('#messageModalFlipbook').modal('hide');
            });
        } else {
            $('.likeBox').fadeOut();
            $("#flipbook").turn("disable", true);
            jQuery('#loading').show();
            jQuery('.flipbook-comments').addClass("active");
            var own = this;
            var commetns = 0;
            commentsDisplay(own, commetns);
            var spID = jQuery(this).closest(".likeAndComments").attr("id");
            if (parseInt(jQuery(".hard[data-spreadid='" + spID + "']").attr("data-likestatus"))) {
                jQuery('.flipbook-like').removeClass("activeYellow").addClass('active');
                //                console.log("yellow");
            } else {
                jQuery('.flipbook-like').removeClass("activeYellow blankYellow");
                //                console.log("white");
            }
        }
    });
    $("#wrapper").on('click', '.flipbook-like', function () {
        var own = this;
        if ((navigator.userAgent.match(/Android/i))) {
            middleMessage();
            jQuery('#messageModalFlipbook #download_text,#confirm_download_btn,#cancelBtn').show();
            jQuery('#messageModalFlipbook #enter_comment, #okBtn').hide();
            jQuery('#messageModalFlipbook').modal('show');
            jQuery('#confirm_download_btn').click(function () {
                //                console.log("clk");
                window.location.href = "https://play.google.com/store/apps/details?id=com.photogurus";
                jQuery('#messageModalFlipbook').modal('hide');
            });
        } else if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i))) {
            middleMessage();
            jQuery('#messageModalFlipbook #download_text,#confirm_download_btn,#cancelBtn').show();
            jQuery('#messageModalFlipbook #enter_comment, #okBtn').hide();
            jQuery('#messageModalFlipbook').modal('show');
            jQuery('#confirm_download_btn').click(function () {
                //                console.log("clk");
                window.location.href = "https://itunes.apple.com/us/app/photogurus/id799452318?ls=1&mt=8";
                jQuery('#messageModalFlipbook').modal('hide');
            });
        } else {
            $("#flipbook").turn("disable", true);
            jQuery('#loading').show();
            //        jQuery('body').addClass('page-loaded');
            //        jQuery('body > .pageload').fadeIn();
            jQuery('.commentsBox').hide();

            if ($('#shared_status').val() === "8000" || $('#shared_status').val() === "8001") {

                var spreadId = jQuery(own).closest(".likeAndComments").attr("id");
                //                if (jQuery('.likeButton').hasClass("active")) {
                //                    console.log("removed filled");
                //                    jQuery('.likeButton').removeClass("active");
                //                } else {
                //                    console.log("add filled");
                //                    jQuery('.likeButton').addClass("active");
                //                }
                jQuery('#loading').show();
                if (jQuery(own).hasClass("active")) {
                    var liked = 0;
                    likeDisplay(own, liked);
                    jQuery('.flipbook-like').addClass("activeYellow");
                    //                    console.log("yellow");

                } else {
                    jQuery('.flipbook-like').addClass("activeYellow");
                    var requestData = {
                        "customer_id": getCookie('custId'),
                        "spread_id": spreadId
                    };
                    var dataPromise = updateLike(requestData);
                    dataPromise.then(function (data) {
                        //                        console.log(data);
                        //                        console.log(data.arr_data.likestatus);
                        var spID = jQuery(own).closest(".likeAndComments").attr("id");
                        //                        console.log(spID);
                        //                        console.log(jQuery(".hard[data-spreadid='" + spID + "']"));
                        jQuery(".hard[data-spreadid='" + spID + "']").attr("data-likestatus", data.arr_data.likestatus);
                        //                        console.log(jQuery(".hard[data-spreadid='" + spID + "']"));

                        $(".other-rows-likes").mCustomScrollbar("destroy");
                        var liked = 1;
                        var shreLike = 1;
                        likeDisplay(own, liked, shreLike);
                    });
                }

                //                console.log("Yes shared");
            } else {
                jQuery('.flipbook-comments').removeClass("active");
                var own = this;
                var liked = 0;
                likeDisplay(own, liked);
                var spID = jQuery(this).closest(".likeAndComments").attr("id");
                if (parseInt(jQuery(".hard[data-spreadid='" + spID + "']").attr("data-likestatus"))) {
                    jQuery('.flipbook-like').addClass("activeYellow");
                    //                    console.log("yellow");
                } else {
                    jQuery('.flipbook-like').removeClass("activeYellow");
                    //                    console.log("white");
                }
            }
        }
    });

    function commentsDisplay(own, commetns) {
        var spreadId = $(".likeAndComments").attr("id");
        var customer_id = getCookie('custId');
        var dataPromise = commentsFetch(spreadId, customer_id);
        dataPromise.then(function (data) {
            //            console.log(data);

            if (data.int_status_code === 1) {
                //                console.log(data);
                //                $(".other-rows-likes").mCustomScrollbar({
                //                    theme: "dark"
                //                });
                jQuery('.other-rows-comments').empty();

                jQuery('.send-comment').val("");
                if (data.arr_data.spreadcommentsinfo) {
                    var commentsInfo = data.arr_data.spreadcommentsinfo;
                    jQuery('.CommentsCount').text("(" + commentsInfo.length + ")").attr("data-count", commentsInfo.length);
                    jQuery('.comments-count').text(jQuery('.CommentsCount').attr("data-count"));
                    for (var i = 0; i < commentsInfo.length; i++) {
                        //                        console.log(commentsInfo[i]);
                        var commentRows;
                        var picPath = commentsInfo[i].user_pic_path;
                        var custName = commentsInfo[i].customer_name;
                        var commentText = commentsInfo[i].comment_text;
                        var current = Date.now();
                        current = current * 1000;
                        var previous = (commentsInfo[i].modified_date);

                        previous = previous * 1000;
                        //                        console.log(previous);
                        var timeDetails = timeSince(previous);
                        //                         var timeDetails =  timeDifference(current,previous);
                        commentRows = $('<div/>').addClass('commentRow');
                        var userPicNode = $('<div/>').addClass('userPic');
                        var userNameNode = $('<div/>').addClass('userNameComments').text(custName);
                        var commentTextNode = $('<div/>').text(commentText);
                        var dateNode = $('<div/>').addClass('commentTime').text(timeDetails);
                        var contentCol = $('<div/>').addClass('content-col');
                        userPicNode.appendTo(commentRows);
                        contentCol.appendTo(commentRows);
                        userNameNode.appendTo(contentCol);
                        commentTextNode.appendTo(contentCol);
                        dateNode.appendTo(contentCol);
                        jQuery('<img />').error(function () {
                            this.src = '../assets/images/profile.png';
                        }).attr('src', picPath).appendTo(userPicNode);
                        jQuery('.other-rows-comments').append(commentRows);
                    }
                }
                if (data.arr_data.spreadcommentsinfo) {
                    jQuery(".hard[data-spreadid='" + spreadId + "']").attr("data-comments", commentsInfo.length);
                } else {
                    jQuery(".hard[data-spreadid='" + spreadId + "']").attr("data-comments", "0");
                }
                $(".other-rows-comments").mCustomScrollbar({
                    theme: "dark"
                });

                $('.send-comment').prop('disabled', false);
                //                var spID;
                //                if (liked) {
                //                    spID = jQuery(own).closest(".likeBox").attr("data-id");
                //                } else {
                //                    spID = jQuery(own).closest(".likeAndComments").attr("id");
                //                }
                //                if (data.arr_data.likes_info) {
                //                    jQuery(".hard[data-spreadid='" + spID + "']").attr("data-likes", likeInfo.length);
                //                }
                //                if (parseInt(jQuery(".hard[data-spreadid='" + spID + "']").attr("data-likestatus"))) {
                //                    jQuery('.likeButton').addClass("active");
                //                    jQuery('.flipbook-like').addClass("activeYellow").removeClass("active blankYellow");
                //                    console.log("yellowLk");
                //                } else {
                //                    jQuery('.likeButton').removeClass("active");
                //                    jQuery('.flipbook-like').removeClass("activeYellow active").addClass("blankYellow");
                //                    console.log("blank");
                //                }
                //
                jQuery('#loading').hide();
                $('.commentsBox').fadeIn().attr("data-id", spreadId);
                //                jQuery('.like-count').text(jQuery('.likeCount').attr("data-count"));
                //                $('.commentsBox').fadeOut();

            } else {
                jQuery('#loading').hide();
                $('.commentsBox').fadeIn().attr("data-id", spreadId);
                jQuery('.other-rows-comments').empty();
                jQuery('.CommentsCount').text("( 0 )");
            }
        });
    }

    function timeSince(date) {

        var seconds = Math.floor(((new Date().getTime() / 1000) - date / 1000)),
            interval = Math.floor(seconds / 31536000);

        if (interval > 1) {
            if (interval === 1) {
                return interval + " year ago";
            } else {
                return interval + " years ago";
            }
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1)
            if (interval === 1) {
                return interval + " month ago";
            } else {
                return interval + " months ago";
            }


        interval = Math.floor(seconds / 86400);
        if (interval >= 1)
            if (interval === 1) {
                return interval + " day ago";
            } else {
                return interval + " days ago";
            }


        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
            if (interval === 1) {
                return interval + " hour ago";
            } else {
                return interval + " hours ago";
            }
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1)
            if (interval === 1) {
                return interval + " minute ago";
            } else {
                return interval + " minutes ago";
            }

        interval = Math.floor(seconds);
        if (interval > 10) {
            return Math.floor(seconds) + " seconds ago";
        } else {
            return "Just Now";
        }
    }

    var sharedLikedButton = 0;

    function likeDisplay(own, liked, shreLike) {
        var spreadId = $(".likeAndComments").attr("id");
        var dataPromise = likesFetch(spreadId);
        dataPromise.then(function (data) {
            if (data.int_status_code === 1) {
                //                console.log(data);
                jQuery('.other-rows-likes').empty();
                if (data.arr_data.likes_info) {
                    var likeInfo = data.arr_data.likes_info;
                    jQuery('.likeCount').text("(" + likeInfo.length + ")").attr("data-count", likeInfo.length);
                    for (var i = 0; i < likeInfo.length; i++) {
                        //                        console.log(likeInfo[i]);
                        var likeRows;
                        var picPath = likeInfo[i].user_pic_path;
                        var custName = likeInfo[i].customer_name;
                        likeRows = $('<div/>').addClass('likeRow');
                        var userPicNode = $('<div/>').addClass('userPic');
                        var userNameNode = $('<div/>').addClass('userName').text(custName);
                        userPicNode.appendTo(likeRows);
                        userNameNode.appendTo(likeRows);
                        jQuery('<img />').error(function () {
                            this.src = '../assets/images/profile.png';
                        }).attr('src', picPath).appendTo(userPicNode);
                        jQuery('.other-rows-likes').append(likeRows);
                        $('.likeBox').fadeIn().attr("data-id", spreadId);
                    }
                } else {
                    $('.likeBox').fadeIn().attr("data-id", spreadId);
                    jQuery(".likeAndComments[id='" + spreadId + "']").children(".like-container").children(".like-count").text("0");
                    jQuery(".likeBox[data-id='" + spreadId + "']").children(".top-row").children(".pull-left").children(".likeCount").text("(0)");
                    jQuery(".like-count").text("0");
                    jQuery('.likeCount').attr("data-count", "0");

                }
                $(".other-rows-likes").mCustomScrollbar({
                    theme: "dark"
                });
                var spID;
                if (liked) {
                    spID = jQuery(own).closest(".likeBox").attr("data-id");
                } else {
                    spID = jQuery(own).closest(".likeAndComments").attr("id");
                }

                if (data.arr_data.likes_info) {
                    jQuery(".hard[data-spreadid='" + spID + "']").attr("data-likes", likeInfo.length);
                }
                if (parseInt(jQuery(".hard[data-spreadid='" + spID + "']").attr("data-likestatus"))) {
                    jQuery('.likeButton').addClass("active");
                    jQuery('.flipbook-like').addClass("activeYellow").removeClass("active blankYellow");
                    //                    console.log("yellowLk");
                } else {
                    jQuery('.likeButton').removeClass("active");
                    jQuery('.flipbook-like').removeClass("activeYellow active").addClass("blankYellow");
                    //                    console.log("blank");
                }
                if (shreLike) {
                    //                    sharedLikedButton = 1;
                    //                    jQuery(".likebox[data-id='" + spID + "']").closest('.likeButton').addClass("active");
                    jQuery(".hard[data-spreadid='" + spreadId + "']").attr("data-likes", likeInfo.length);
                    jQuery('.likeButton').addClass("active");
                    jQuery('.flipbook-like').addClass("activeYellow").removeClass("active blankYellow");
                }
                //                jQuery('body').addClass('page-loaded').removeClass('page-loading');
                //                jQuery('body > .pageload').fadeOut();



                jQuery('.like-count').text(jQuery('.likeCount').attr("data-count"));
                $('.commentsBox').fadeOut();
                jQuery('#loading').hide();
            }
        });
    }
    $("#flipbook").on("click", ".likeButton", function () {
        //        console.log("Liked");
        var own = this;
        var spreadId = jQuery(this).closest(".likeBox").attr("data-id");
        if (jQuery('.likeButton').hasClass("active")) {
            //            console.log("removed filled");
            jQuery('.likeButton').removeClass("active");
        } else {
            //            console.log("add filled");
            jQuery('.likeButton').addClass("active");
        }
        jQuery('#loading').show();
        var requestData = {
            "customer_id": getCookie('custId'),
            "spread_id": spreadId
        };
        var dataPromise = updateLike(requestData);
        dataPromise.then(function (data) {
            //            console.log(data);
            //            console.log(data.arr_data.likestatus);
            var spID = jQuery(own).closest(".likeBox").attr("data-id");
            //            console.log(jQuery(".hard[data-spreadid='" + spID + "']"));
            jQuery(".hard[data-spreadid='" + spID + "']").attr("data-likestatus", data.arr_data.likestatus);
            //            console.log(jQuery(".hard[data-spreadid='" + spID + "']"));
            $(".other-rows-likes").mCustomScrollbar("destroy");
            var liked = 1;
            likeDisplay(own, liked);

        });
    });
    $("#flipbook").on("click", ".closeBtnLike", function () {
        //        console.log("close");
        $(".other-rows-comments").mCustomScrollbar("destroy");
        $(".other-rows-likes").mCustomScrollbar("destroy");
        //        $(".other-rows-comments").mCustomScrollbar("destroy");
        $('.likeBox').fadeOut();

        var spID = jQuery(this).closest(".likeBox").attr("data-id");
        if (parseInt(jQuery(".hard[data-spreadid='" + spID + "']").attr("data-likestatus"))) {
            jQuery('.flipbook-like').removeClass("activeYellow").addClass("active");
            //            console.log("yellow");
        } else {
            jQuery('.flipbook-like').removeClass("activeYellow active blankYellow");
            //            console.log("blank");
        }
        if (sharedLikedButton) {
            jQuery('.flipbook-like').removeClass("activeYellow").addClass("active");
            sharedLikedButton = 0;
        }
        $("#flipbook").turn("disable", false);
    });
    $("#flipbook").on("click", ".closeBtnComments", function () {
        //        console.log("close");
        $(".other-rows-comments").mCustomScrollbar("destroy");
        $(".other-rows-likes").mCustomScrollbar("destroy");
        $('.commentsBox').fadeOut();
        $('.flipbook-comments').removeClass("active");
        $("#flipbook").turn("disable", false);
    });
    jQuery('#flipbook').on('keypress', '.send-comment', function (e) {
        var spreadID = jQuery(this).closest(".commentsBox").attr("data-id");
        var comment = jQuery(this).val();
        var key = e.which;
        var own = this;
        if (key === 13) // the enter key code
        {
            if (jQuery(this).val() !== '') {
                jQuery('.send-comment').attr('disabled', 'true');
                jQuery('#loading').show();
                var requestData = {
                    "customer_id": getCookie('custId'),
                    "spread_id": spreadID,
                    "comment_text": comment
                };
                var dataPromise = updateComment(requestData);
                dataPromise.then(function (data) {
                    //                    console.log(data);
                    $(".other-rows-comments").mCustomScrollbar("destroy");
                    commentsDisplay();
                });
            } else {
                middleMessage();
                jQuery('#messageModalFlipbook #download_text,#confirm_download_btn,#cancelBtn').hide();
                jQuery('#messageModalFlipbook #enter_comment, #okBtn').show();
                jQuery('#messageModalFlipbook').modal('show');
                jQuery('#okBtn').click(function () {
                    jQuery(own).focus();
                });

            }
        }
    });

    function middleMessage() {
        var requireHeight = (jQuery(window).height()) - (jQuery('#messageModalFlipbook').height()) / 1.4;
        jQuery('#messageModalFlipbook .modal-dialog').css('margin-top', requireHeight + "px");
    }

    function send_dislike_Method() {
        var promiseRequestData = {
            "user_id": getCookie('custId'),
            "order_id": $('#order_id').attr("value"),
            "rating": "0",
            "comments": $("#form_bad textarea").val()
        };
        var feedbackPromise = feedback(promiseRequestData);
        feedbackPromise.then(function (data) {
            if (data.int_status_code === 1) {
                $('#errorMessge').hide();
                $(".feedback-forms").hide();
                $('.feedback-all').css('margin-top', ($('#flipbook').height() - feedbackBoxHeight) / 2 + 'px');
                $("#flipbook").off("click", ".good-feedback");
                $("#flipbook").off("click", ".bad-feedback");
                $("#flipbook").off("click", ".ok-feedback");
            } else {
                $('#errorMessge').show();
            }
        }).fail(function () {});
    }
    jQuery('body').click(function (e) {
        if (jQuery(e.target).closest('#activeNav').length === 0) {
            jQuery('.activeNav').removeClass("navShow");
        }

    });
    jQuery('.mobile-nav').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        jQuery('.activeNav').addClass("navShow");
    });
    jQuery('.active-lines').click(function () {
        jQuery('.activeNav').removeClass("navShow");
    });
    jQuery('.home-icon-nav').click(function () {
        window.location.href = homeURL;
    });
    adjustDownloadBtn();

});

function adjustDownloadBtn() {
    if ((jQuery(window).width() < 768) && (jQuery(window).width() > jQuery(window).height())) {
        jQuery('.install-app').addClass("pt5");
    } else {
        jQuery('.install-app').removeClass("pt5");
    }
}

function setFlipBookSize() {
    if (jQuery('.bottomTrayInnerContainer').css('marginLeft') === '0px') {
        jQuery('#leftArrowTray').css('visibility', 'hidden');
        jQuery('#rightArrowTray').css('visibility', 'visible');
    } else {
        jQuery('#leftArrowTray').css('visibility', 'visible');
    }
    //    jQuery('#leftArrowTray').css({'visibility': 'hidden'});
    //    $('#fullscreen').show();  
    $('.show-warning,warning-icon-div').hide();
    var currentWindowWidth = $(window).width();
    //only for mobile ios and android
    if (isIOS === 1 || isAndroid === 1) {
        iosAndroidSize();
        jQuery('.mobile-nav').hide();

    } else {


        if (!isMobileDevice) {
            $('.flip-control-front').hide();
            $('.DFrontControl').show();
        } else {
            $('.DFrontControl').hide();
        }
        $('#menu-toggle').show();
        // only for desktop not for any mobiles.
        var currentWindowWidth = $(window).width();
        // full screen and not full screen for chrom and moz width set
        if (fullScreen === 1 || mozFullScreen === 1) {
            $('.trayOutterBlock').css('display', 'none');
            currentWindowWidth = $(window).width() - 100;
        } else {
            $('.trayOutterBlock').show();
            if ($('#image_count').val() <= 0) {
                jQuery('.trayOutterBlock').hide();
            }
            if (navigator.platform.match('Linux')) {
                currentWindowWidth = $(window).width() - 200;
            } else {
                currentWindowWidth = $(window).width() - 150;
            }

            if (currentWindowWidth > 1010 && currentWindowWidth < 1111) {
                currentWindowWidth = currentWindowWidth - 90;
            }

        }

        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE");
        // If Internet Explorer, return version number
        if (msie > 0) {
            currentWindowWidth = currentWindowWidth - 150;
        }
        currentWindowHeight = currentWindowWidth / 2;
        // if height is less than inner height then
        var otherContentHeight = jQuery('.trayOutterBlock').height() + 53;
        //        var likeAndCommentFixHeightAndSomeBlankSpace = 33 + 10;
        //        if ((window.innerHeight - (otherContentHeight + likeAndCommentFixHeightAndSomeBlankSpace)) < currentWindowHeight) {
        //            alert(currentWindowWidth);
        //            if ($(window).width() > 1260) {
        //                currentWindowHeight = window.innerHeight - 200;
        //            } else {
        //                currentWindowHeight = window.innerHeight - 200;
        //            }
        //            currentWindowWidth = currentWindowHeight * 2;
        //        }
        //        var likeAndCommentFixHeightAndSomeBlankSpace = 33 + 10;
        if ((window.innerHeight - 154) < currentWindowHeight) {
            //            alert(currentWindowWidth);
            //            if ($(window).width() > 1260) {
            currentWindowHeight = window.innerHeight - 140;
            //            } else {
            //                currentWindowHeight = window.innerHeight - 90;
            //            }
            currentWindowWidth = currentWindowHeight * 2;
        }
        // flip book resizer called.
        resizeFlipbook(currentWindowWidth, currentWindowHeight);
        //flipbook contianer set widht and height.
        $('.flipbookContainer').css('width', window.innerWidth);
        //vertically equal margin logic is below.
        var wHeight = 0;
        if (fullScreen === 1 || mozFullScreen === 1) {
            // in full screen
            if (window.innerWidth < 767) {
                wHeight = window.innerHeight - 33 - $('#flipbook').height();
            } else {
                wHeight = window.innerHeight - 52 - $('#flipbook').height();
            }
        } else {
            jQuery('.trayOutterBlock').show();
            jQuery('.exitFullscreen').addClass('fullscreen').removeClass('exitFullscreen');
            // not full screen
            if (window.innerWidth < 767) {
                wHeight = window.innerHeight - 105 - $('#flipbook').height();
            } else {
                wHeight = window.innerHeight - 125 - $('#flipbook').height();
            }

        }
        // top margin is set
        jQuery('.flipbookContainer').css('margin-top', (wHeight) / 2);
        // -6 cause used display :inline block with display table issue..
        // jQuery('.flipbookContainer').css('margin-bottom', ((wHeight) / 2) - 6);
        jQuery('.portraitHome').hide();
        jQuery('.home').show();
    }
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
        isMobile = true;
    } else {
        isMobile = false;
    }


    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    var edge = ua.indexOf("Edge"); //Microsoft Edge
    var ieEdge = ua.indexOf("Trident");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./) || edge > -1 || ieEdge > 0) // If Internet Explorer, return version number
    {
        $('.fl-screen').hide();
    }

    // if mobile
    if (true === isMobile) {
        $('.flip-control,.DFrontControl').hide();
        $('.web-signin').hide();
        if (window.innerHeight > window.innerWidth) {
            adjustForPortraitMode();
        } else {
            adjustForLandscapeMode();
        }
        $('.fl-screen').hide();
        $('.install-app').show();
        if ((navigator.userAgent.match(/Android/i))) {
            isAndroid = 1;
            var nua = navigator.userAgent.toLowerCase();
            var ua = navigator.userAgent;
            //mozila check for android and ios
            var browserFlag = ((ua.indexOf('Mozilla/5.0') > -1 && ua.indexOf('Android ') > -1 || ua.indexOf('AppleWebKit') > -1));
            if (browserFlag) {
                if (ua.indexOf('Version') < 0) {
                    $('.fl-screen ').show();
                    $('#fullscreen').show();
                } else {
                    $('#fullscreen').hide();
                    $('.fl-screen ').hide();
                }

            } else {
                $('#fullscreen').hide();
                $('.fl-screen ').hide();
            }
        } else if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i))) {
            isIOS = 1;
            $('#fullscreen').hide();
            $('.fullscreen').css('display', 'none');
        }
    } else {
        $('.install-app').hide();
        $('.web-signin').show();
    }

    $('.even').each(function () {
        var curr_width = parseFloat($(this).css('width'));
        var curr_height = parseFloat($(this).css('height'));
        if (curr_width !== curr_height) {
            curr_width = curr_height;
        }
        $(this).css('width', curr_width + 'px');
    });
    /* previous and next button hide and show effect */
    if (preBtnFullscreen === 0) {
        $('#prev').hide();
    } else {
        if (potraitFlag === 1 || isMobile === false) {
            $('#prev').show();
        } else {
            $('#prev').hide();
        }
    }
    if ($("#flipbook").turn("page") === 1) {
        $('.flip-control').hide();
        $('#frontCoverArrow').show();
        var currentWindowWidth = $('#flipbook').width();
        $('#flipbook').css('margin-left', '-' + (currentWindowWidth / 2) + 'px');
        $('#prev').hide();
        $('.flipbook-bottom').hide();
        // $('.flipbook-bottom').width(($('#flipbook').width()) / 2).css("margin", "10px auto");
    } else {
        // $('.flipbook-bottom').width($('#flipbook').width()).css("margin", "10px auto");
        $('.flipbook-bottom').show();
        $('.DFrontControl,.mainCoverActionButtonContainer').hide();
        $('#frontCoverArrow').hide();
        $('#flipbook').css('margin-left', '0px');
        if (potraitFlag === 1 || isMobile === false) {
            $('#prev').show();
        }
    }
    $("#flipbook").bind("first", function (event) {
        $('#prev').hide();
    });
    $("#flipbook").bind("last", function (event) {
        $('.flip-control').hide();
        if (potraitFlag === 1 || isMobile === false) {
            if (isMobile === false) {
                $('.flip-control').show();
                $('.flip-control').css('display', 'inline-block');
            } else {
                $('.flip-control').hide();
            }
            $('#prev').show();
            $('#next').hide();
            $('#next,.flip-control.right').hide();
            //            $('#frontCoverArrow').hide();
        } else {
            $('#prev').hide();
            $('#next').hide();
            $('#next,.flip-control.right').hide();

        }
        //        if (window.innerHeight > window.innerWidth) {
        //            jQuery('.fl-screen,.mobile-nav').hide();
        //            jQuery('.portraitHome').show();
        //        } else {
        ////        jQuery('.mobile-nav').show();
        ////        jQuery('.portraitHome').hide();
        //            jQuery('.fl-screen,.mobile-nav').hide();
        //            jQuery('.portraitHome').show();
        //        }
        backPageHeight();
    });
    $('.c1').addClass('wellsActive');




    $("#flipbook").bind("turning", function (event, page, pageObject) {
        $('.wellsActive').removeClass('wellsActive');
        $('.c' + page).addClass('wellsActive');
        bottomTrayMoveWellActive();
        //        $('#prev').show();
        if (potraitFlag === 1 || isMobile === false) {
            if (isMobile === false) {
                $('.flip-control').show();
                $('.flip-control').css('display', 'inline-block');
                $('.controls').hide();
            } else {
                $('.flip-control').hide();
                $('.DFrontControl').hide();
            }

            $('#prev').show();
            if (page === 1) {
                $('.DFrontControl').css('display', 'inline-block');
                $('#frontCoverArrow').show();
                $('#next').hide();
                $('#next,.flip-control.right').hide();
                if (!isMobileDevice) {
                    $('.flip-control-front').hide();
                    $('.flip-control').show();
                    $('#next,.flip-control.right').hide();
                }
                $('.flipbook-bottom').hide();
                if (!isMobileDevice) {
                    $('.mainCoverActionButtonContainer').css({
                        'visibility': 'visible'
                    });
                }
            } else {
                $('.DFrontControl').hide();
                $('#frontCoverArrow').hide();
                $('#next').show();
                $('.flipbook-bottom').show();
                $('.mainCoverActionButtonContainer').css({
                    'visibility': 'hidden'
                });
            }
        } else {
            $('.flipbook-bottom').hide();
            $('.mainCoverActionButtonContainer').css({
                'visibility': 'hidden'
            });
            if (page !== 1) {
                $('#next').hide();
                $('.flipbook-bottom').show();
            } else {}
            $('#prev').hide();

        }
        if (!isMobile) {
            $('.controls').hide();
        } else {
            $('.flip-control,.DFrontControl').hide();
        }
        if (page !== 1) {
            // $('.flipbook-bottom').width($('#flipbook').width()).css("margin", "10px auto");
        } else {
            // $('.flipbook-bottom').width(($('#flipbook').width()) / 2).css("margin", "10px auto");
        }
    });
}

function iosAndroidSize() {
    jQuery('#frontCoverArrow').attr({
        'src': "../assets/images/nextControl.png"
    });
    jQuery('.prevControl.controls img').attr({
        'src': "../assets/images/prevControl.png"
    });
    jQuery('.nextControl.controls img').attr({
        'src': "../assets/images/nextControl.png"
    });
    jQuery('.warning-icon-div.show-warning img').attr({
        'src': "../assets/images/turnDevice.png"
    });

    jQuery('.controls').show();
    jQuery('.flip-control,.DFrontControl,#menu-toggle,.trayOutterBlock').hide();
    //  hidden bottom thumb tray and menu icon    
    var currentWindowWidth = $(window).width();
    var isChromium = window.chrome,
        vendorName = window.navigator.vendor,
        isOpera = window.navigator.userAgent.indexOf("OPR") > -1;
    // chrome and safri browser
    if (isChromium !== null && isChromium !== undefined) {
        //            alert(currentWindowWidth);
        // chrome browser for ios and android fullscreen
        if (preBtnFullscreen) {
            // samsung tab 10 fullscreen spacing issue
            if (currentWindowWidth > 1220) {
                //                    currentWindowWidth = currentWindowWidth - 120;
                currentWindowWidth = $(window).width() - 10;
            } else {
                // nexus tab 9 has chrome fullscreen spacing
                if (currentWindowWidth > 1020) {
                    //                        currentWindowWidth = currentWindowWidth - 100;
                    currentWindowWidth = $(window).width() - 10;
                } else if (currentWindowWidth > 638 && currentWindowWidth < 650) {
                    {
                        //                            currentWindowWidth = currentWindowWidth - 80;
                        currentWindowWidth = $(window).width() - 10;
                    }
                } else {
                    //                        currentWindowWidth = currentWindowWidth - 60;
                    currentWindowWidth = $(window).width() - 10;
                }

            }

        } else {
            //previous it was 150 made now 170 for samsung galaxy s4 II
            //                currentWindowWidth = currentWindowWidth - 170;

        }
    } else if (navigator.userAgent.match('FB_IAB') || navigator.userAgent.match('FBIOS')) {
        $('.head-container').hide();
        //fb link for android and ios
        currentWindowWidth = $(window).width();
        fbWebView = 1;
    } else {
        if (navigator.userAgent.match('CriOS')) {

            // ios chrome iphone 5 both current widht are required.
            if (currentWindowWidth < 569) {
                currentWindowWidth = currentWindowWidth - 40;
            }
            if (currentWindowWidth === 736) {
                // ios iphone 6
                currentWindowWidth = currentWindowWidth + 80;
            }
            currentWindowWidth = currentWindowWidth - 100;
        }
        if (currentWindowWidth < 569) {
            // iphone 5c address bar issue flipbook jumps to over bar
            if (window.innerHeight < 240) {
                currentWindowWidth = currentWindowWidth - 180;
            } else {

                // fulll screen in safari hides address then.
                //                    currentWindowWidth = currentWindowWidth - 40;
                currentWindowWidth = $(window).width();
            }
        } else {
            //                currentWindowWidth = currentWindowWidth - 140;
            if (window.innerHeight < 332) {

                currentWindowWidth = $(window).width() - 70;
            } else {

                currentWindowWidth = $(window).width();
            }

        }



    }


    var currentWindowHeight = currentWindowWidth / 2;
    // if inner height is less that calculated height.
    var headerHeight = 39;
    var headerHeightDiff = 0;
    headerHeightDiff = $(".head-container").height();
    headerHeight = 0;
    if (isIOS === 1) {
        jQuery('.share-icon-nav-ios').show();
        jQuery('.share-icon-nav').hide();
        if ((($(window).height() - 39) * 2) < currentWindowWidth) {
            headerHeightDiff = 39;
            currentWindowHeight = window.innerHeight - headerHeightDiff;
            currentWindowWidth = currentWindowHeight * 2;
        }

    } else {
        jQuery('.share-icon-nav-ios').hide();
        jQuery('.share-icon-nav').show();
        if ((window.innerHeight - 39) < currentWindowHeight) {
            currentWindowHeight = window.innerHeight - headerHeightDiff;
            currentWindowWidth = currentWindowHeight * 2;
        }
    }

    if (navigator.userAgent.match('FB_IAB') || navigator.userAgent.match('FBIOS')) {
        if ((currentWindowWidth / 2) > currentWindowHeight) {
            currentWindowHeight = window.innerHeight;
            currentWindowWidth = currentWindowHeight * 2;
        } else {
            currentWindowWidth = window.innerWidth;
            currentWindowHeight = currentWindowWidth / 2;
            //                $('.flip-control').hide();

        }
        $('.head-container').hide();
    }

    // if inner height is greater that calculated width. means it is potrait.
    if (window.innerHeight > $(window).width()) {
        $('.flip-control').hide();
        $('.head-container').show();
        $('.fl-screen').hide();
        var currentWindowWidth = $(window).width();
        var currentWindowHeight = currentWindowWidth / 2;
        if (isChromium !== null && isChromium !== undefined) {
            //samsung tab potrait device ( chrome and internet browser) spacing
            currentWindowWidth = $(window).width();
            currentWindowHeight = currentWindowWidth / 2;
        }
        if (pageNumber === 1) {
            $('#next').hide();
            $('#next,.flip-control.right').hide();
            $('#frontCoverArrow').show();
        } else {
            $('#next').show();
            $('#next,.flip-control.right').show();
            $('#frontCoverArrow').hide();
        }
        $('.head-container').show();
        potraitFlag = 1;
        if (preBtnFullscreen) {
            toggleFullScreen();
        }
    }
    if (pageNumber === 1 && potraitFlag !== 1 || pageNumber === '') {
        $('#next').hide();
        $('#frontCoverArrow').show();
    } else if (pageNumber === 1 || pageNumber === '') {
        $('#next').hide();
        $('#frontCoverArrow').show();
    } else if (potraitFlag === 1) {
        $('#next').show();
        $('#next,.flip-control.right').show();
        $('#frontCoverArrow').hide();
    } else {
        $('#next').hide();
        $('#next,.flip-control.right').hide();
        $('#frontCoverArrow').hide();
    }
    resizeFlipbook(currentWindowWidth, currentWindowHeight);
    // flipbook container width set.
    $('.flipbookContainer').css('width', window.innerWidth);
    // potrait hide element
    if (potraitFlag) {
        $('#phone').show();
        $('.fl-screen').hide();
        $('.flipbookContainer').css('margin-top', '20px');
        $('.flipbookContainer').css('margin-bottom', '40px');
    } else {
        // for landscare show elements and hide elements and vertical center functionality.
        $('.fl-screen').show();
        var wHeight = 0;
        if (navigator.userAgent.match('FB_IAB') || navigator.userAgent.match('FBIOS')) {
            wHeight = window.innerHeight - $('#flipbook').height();
            $('.flipbookContainer').css('margin-top', (wHeight) / 2);
            $('.flipbookContainer').css('margin-bottom', (wHeight) / 2);
        } else {
            if (window.innerWidth < 767) {
                wHeight = window.innerHeight - 33 - $('#flipbook').height();
            } else {
                wHeight = window.innerHeight - 53 - $('#flipbook').height();
            }
            if (wHeight < 0) {
                wHeight = 2;
            }
            $('.flipbookContainer').css('margin-top', ((wHeight) / 2) + 'px');
            $('.flipbookContainer').css('margin-bottom', ((wHeight) / 2) + 'px');
        }
    }
    if (isMobileDevice) {
        $('.mainCoverActionButtonContainer').css({
            'visibility': 'hidden'
        });
    }
}

function noAppInstalledImages() {
    jQuery('#googlePlayId').attr({
        'src': '../assets/images/googleplay.png'
    });
    jQuery('#appleStoreId').attr({
        'src': '../assets/images/appstore.png'
    });
}

function appInstalledOnceImages() {
    jQuery('.noAppInstatlled ').hide();
    jQuery('.facebookShareLink img').attr({
        'src': '../assets/images/icon_fb.png'
    });
    jQuery('#copyContain img').attr({
        'src': '../assets/images/icon_link.png'
    });
    jQuery('.emailShareLink img').attr({
        'src': '../assets/images/icon_mail.png'
    });

}


function backcoverAPICall() {
    var customerId = getCookie('custId');
    if (customerId) {
        var backcoverResponse = backcoverAPIRequest(customerId);
        backcoverResponse.then(function (data) {
            console.log(data);
            if (data.int_status_code === 1) {
                $("#device_count").val(data.arr_data.device_count);
                backcoverLayoutAndScrenChange();
            }

        });
    }
}

function backcoverLayoutAndScrenChange() {
    appInstalledOnceImages();
    //    noAppInstalledImages();
    $('.commonbackCover').css('display', 'block');
    $('.noAppInstatlled').css('margin-top', ($('#flipbook').height() - $('.noAppInstatlled').height()) / 2 + 'px');
    $('.privateStory').css('margin-top', ($('#flipbook').height() - $('.privateStory').height()) / 2 + 'px');
    $('.mobileAndIpadOwnPrivateAndPublicLoggedIn').css('margin-top', ($('#flipbook').height() - $('.mobileAndIpadOwnPrivateAndPublicLoggedIn').height()) / 2 + 'px');
    $('.appInstalledOnce').css('margin-top', ($('#flipbook').height() - $('.appInstalledOnce').height()) / 2 + 'px');
    $('.appInstalledOnce').css('margin-bottom', ($('#flipbook').height() - $('.appInstalledOnce').height()) / 2 + 'px');
    $('.publicSharedStoryNotLoggedIn').css('margin-top', ($('#flipbook').height() - $('.publicSharedStoryNotLoggedIn').height()) / 2 + 'px');
    $('.publicSharedStoryLoggedIn').css('margin-top', ($('#flipbook').height() - $('.publicSharedStoryLoggedIn').height()) / 2 + 'px');
    $('.feedback-all').css('margin-top', ($('#flipbook').height() - feedbackBoxHeight) / 2 + 'px');
    $('.backCoverLikeAndComment').css('margin-top', ($('#flipbook').height() - $('.backCoverLikeAndComment').height()) / 2 + 'px');
    //    $('.appInstalledOnce').css('display', 'none');

    var pathTrac = window.location.href;
    // any stroy with don't have an app showing sent link view.
    if (($('#shared_status').val() === "0" || $('#shared_status').val() === "8000" || $('#shared_status').val() === "8001") && $("#device_count").val() === "0") {
        $('.commonbackCover').css('display', 'none');
        noAppInstalledImages();
        $('.noAppInstatlled').css('display', 'block');
        $('.noAppInstatlled').css('margin-top', ($('#flipbook').height() - $('.noAppInstatlled').height()) / 2 + 'px');
    }
    // have an app and own story
    if ($('#shared_status').val() === "0" && $("#device_count").val() === "1") {
        $('.commonbackCover').css('display', 'none');
        $('.noAppInstatlled ').hide();
        $('.appInstalledOnce').css('display', 'block');
        $('.appInstalledOnce').css('margin-top', ($('#flipbook').height() - $('.appInstalledOnce').height()) / 2 + 'px');
        $('.bottomLogoLink').hide();

    }
    //have an app and Priviate story
    if ($('#shared_status').val() === "8000" && $("#device_count").val() === "1") {
        $('.commonbackCover').css('display', 'none');
        $(".privateStory").css('display', 'block');
    }
    //have an app and public story
    if ($('#shared_status').val() === "8001") {
        if ($("#device_count").val() === "1") {
            $('.commonbackCover').css('display', 'none');
            if ($("#userLoggedIn").val() === "1") {
                $('.publicSharedStoryLoggedIn').css('display', 'block');
                $('.publicSharedStoryLoggedIn').css('margin-top', ($('#flipbook').height() - $('.publicSharedStoryLoggedIn').height()) / 2 + 'px');
            }
        } else {
            $('.commonbackCover').css('display', 'none');
            if ($("#userLoggedIn").val() === "1" && $("#device_count").val() !== "1") {
                noAppInstalledImages();
                $(".noAppInstatlled").css('display', 'block');
            } else {
                jQuery('.logoBig').attr({
                    'src': '../assets/images/logoBig.png'
                });
                $(".publicSharedStoryNotLoggedIn").css('display', 'block');
                $('.bottomLogoLink').hide();
            }
        }

    }
    // mobile view for back cover
    if ((navigator.userAgent.match(/Android/i))) {
        isAndroid = 1;
        //        $('.bottomLogoLink').hide();
        $('.commonbackCover').css('display', 'none');
        //logged in view and not logged in view for android
        if ($("#loggedInUser").val() === "1") {
            $('.mobileAndIpadOwnPrivateAndPublicLoggedIn').css('display', 'block');
            $('.bottomLogoLink').show();
        } else {
            jQuery('.logoBig').attr({
                'src': '../assets/images/logoBig.png'
            });
            $('.publicSharedStoryNotLoggedIn').css('display', 'block');
            $('.bottomLogoLink').hide();
        }
        $('.feedback').hide();
        //        $('.bottomLogoLink').hide();

    } else if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i))) {
        isIOS = 1;
        $('.commonbackCover').css('display', 'none');
        //logged in view and not logged in view for IOS
        if ($("#loggedInUser").val() === "1") {
            $('.mobileAndIpadOwnPrivateAndPublicLoggedIn').css('display', 'block');
            $('.bottomLogoLink').show();
        } else {
            jQuery('.logoBig').attr({
                'src': '../assets/images/logoBig.png'
            });
            $('.publicSharedStoryNotLoggedIn').css('display', 'block');
            $('.bottomLogoLink').hide();
        }
        $('.feedback').hide();
        //        $('.bottomLogoLink').hide();

    } else {
        var storyType;
        if (parseInt($('#shared_status').attr("value")) === 1000) {
            storyType = "own";
        }
        if ((parseInt($('#shared_status').attr("value")) === 8000) || (parseInt($('#shared_status').attr("value")) === 8001)) {
            storyType = "shared";
        }
        $('.mobileAndIpadOwnPrivateAndPublicLoggedIn').css('display', 'none');
        $('.bottomLogoLink').show();

        if (storyType === "own") {
            if (parseInt($('#visit_count').attr("value")) === 1) {
                $('.feedback').show();
                $('.commonbackCover').hide();
                //                console.log("own st");
            } else {
                $('.feedback').hide();
            }
        }
        if (storyType === "shared") {
            if ((parseInt($('#visit_count').attr("value")) < 4) && (parseInt(jQuery('#userLoggedIn').val())) === 1) {
                $('.backCoverLikeAndComment').show();
                $('.noAppInstatlled ').hide();
                //                console.log("shared st");
            } else {
                $('.backCoverLikeAndComment').hide();
                noAppInstalledImages();
                $('.noAppInstatlled ').show();
            }
        }
    }
    //    if (pathTrac.indexOf('tracking_id=') > 0) {
    var user_Id = pathTrac.split("tracking_id=");
    $('.facebookShareLink').attr('href', '/?page=selected-share&sharemode=FB&id=' + user_Id[1]);
    $('.emailShareLink').attr('href', '/?page=selected-share&sharemode=F&id=' + user_Id[1]);
    //    }

    if ((navigator.userAgent.match(/Android/i))) {
        isAndroid = 1;
        $('#downloadPath').attr('href', 'https://play.google.com/store/apps/details?id=com.photogurus');
    } else if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i))) {
        $('#downloadPath').attr('href', 'https://itunes.apple.com/us/app/photogurus/id799452318?ls=1&mt=8');
    }
}

function backPageHeight() {
    if (backcoverVisit === 0) {
        backcoverVisit++;
        backcoverAPICall();
    } else {
        backcoverLayoutAndScrenChange();

    }
}

function connectStoryCall() {
    if (parseInt(getCookie("connectStory")) === 1) {
        var requestData = {
            "communication_token": getCookie("communication_token"),
            "story_id": getCookie("story_id"),
            "user_id": getCookie("custId")
        };
        var promise = connectStory(requestData);
        promise.then(function (data) {
            if (data.int_status_code === 0) {
                alert("Please try again.");
            } else {
                deleteCookie("connectStory");
            }
        }).fail(function () {

        });
    }
}

function previousTrayImageMove() {
    var threeThumbMoveBack = 0;
    var distanceBetweenTwoDiv = 0;
    if ((jQuery(".c1").offset().left + 367) < jQuery(".bottomTrayContainer").offset().left) {
        jQuery('#rightArrowTray').css({
            'visibility': 'visible'
        });
        threeThumbMoveBack = parseInt(jQuery(".bottomTrayInnerContainer").css('margin-left')) + 330;
        distanceBetweenTwoDiv = threeThumbMoveBack + 'px';
        moveTrayByArrow(distanceBetweenTwoDiv);
    } else {
        threeThumbMoveBack = 0;
        distanceBetweenTwoDiv = threeThumbMoveBack;
        jQuery('#leftArrowTray').css({
            'visibility': 'hidden'
        });
        jQuery('#rightArrowTray').css('visibility', 'visible');
        moveTrayByArrow(distanceBetweenTwoDiv);
    }
}

function nextTrayImageMove() {
    jQuery('#leftArrowTray').css({
        'visibility': 'visible'
    });
    var threeThumbMoveBack = 0;
    if ((jQuery(".wells").last().offset().left - 367) > jQuery("#rightArrowTray").offset().left) {
        if (parseInt($('.bottomTrayInnerContainer').css('margin-left')) === 0) {
            threeThumbMoveBack = parseInt(jQuery(".bottomTrayInnerContainer").css('margin-left')) - 392;
            threeThumbMoveBack = threeThumbMoveBack + 'px';
            moveTrayByArrow(threeThumbMoveBack);
        } else {
            threeThumbMoveBack = parseInt(jQuery(".bottomTrayInnerContainer").css('margin-left')) - 330;
            threeThumbMoveBack = threeThumbMoveBack + 'px';
            moveTrayByArrow(threeThumbMoveBack);
        }

    } else {
        jQuery('#rightArrowTray').css({
            'visibility': 'hidden'
        });
        jQuery('#leftArrowTray').css({
            'visibility': 'visible'
        });
        threeThumbMoveBack = (parseInt((jQuery(".bottomTrayInnerContainer").css('margin-left'))) - ((jQuery(".wells").last().offset().left - 200) - jQuery(".bottomTrayContainer").offset().left)) + "px";
        moveTrayByArrow(threeThumbMoveBack);
    }
}

function bottomTrayMoveWellActive() {
    var threeThumbMoveBack = 0;
    var last3Spread = 'c' + jQuery(".coverImages").last().prev().prev().data('value');
    var last2Spread = 'c' + jQuery(".coverImages").last().prev().data('value');
    var lastSpread = 'c' + jQuery(".coverImages").last().data('value');

    var distanceBetweenTwoDiv = (jQuery('.wellsActive').offset().left - jQuery('.c1').offset().left);
    if (distanceBetweenTwoDiv < 280) {
        distanceBetweenTwoDiv = 0;
        jQuery('#leftArrowTray').css({
            'visibility': 'hidden'
        });
        jQuery('#rightArrowTray').css({
            'visibility': 'visible'
        });
    } else {
        if (jQuery('.wellsActive').hasClass(lastSpread) || jQuery('.wellsActive').hasClass(last2Spread) || jQuery('.wellsActive').hasClass(last3Spread)) {
            distanceBetweenTwoDiv = (parseInt((jQuery(".bottomTrayInnerContainer").css('margin-left'))) - ((jQuery(".wells").last().offset().left - 200) - jQuery(".bottomTrayContainer").offset().left));
            jQuery('#rightArrowTray').css({
                'visibility': 'hidden'
            });
            jQuery('#leftArrowTray').css({
                'visibility': 'visible'
            });
        } else {
            jQuery('#leftArrowTray').css({
                'visibility': 'visible'
            });
            jQuery('#rightArrowTray').css({
                'visibility': 'visible'
            });

        }
    }
    if (parseInt(distanceBetweenTwoDiv) < 0) {
        distanceBetweenTwoDiv = distanceBetweenTwoDiv + 'px';
    } else {
        distanceBetweenTwoDiv = '-' + distanceBetweenTwoDiv + 'px';
    }
    moveTray(distanceBetweenTwoDiv);
}


function moveTray(distanceBetweenTwoDiv) {
    if (timeoutSessionCheck !== null) {
        clearTimeout(timeoutSessionCheck);
        timeoutSessionCheck = setTimeout(function () {
            jQuery(".bottomTrayInnerContainer").animate({
                "margin-left": distanceBetweenTwoDiv
            }, 300);
        }, 300);
        return;
    } else {
        timeoutSessionCheck = setTimeout(function () {
            jQuery(".bottomTrayInnerContainer").animate({
                "margin-left": distanceBetweenTwoDiv
            }, 300);
        }, 300);
    }
}

function moveTrayByArrow(distanceBetweenTwoDiv) {
    if (timeoutSessionCheck !== null) {
        console.log(timeoutSessionCheck);
        jQuery(".bottomTrayInnerContainer").css({
            "margin-left": distanceBetweenTwoDiv
        });
        return;
    } else {
        console.log(timeoutSessionCheck);
        timeoutSessionCheck = setTimeout(function () {
            jQuery(".bottomTrayInnerContainer").animate({
                "margin-left": distanceBetweenTwoDiv
            }, 300);
            timeoutSessionCheck = null;
        }, 300);
    }
}


function toggleFullScreen() {
    if (window.ActiveXObject || "ActiveXObject" in window) {
        if (IEExpand === 0) {
            $('.fullscreen').addClass('exitFullscreen').removeClass('.fullscreen');
            IEExpand = 1;
            fullScreen = 1;
        } else {
            IEExpand = 0;
            $('.exitFullscreen').addClass('fullscreen').removeClass('exitFullscreen');

        }
        fullScreenApi.requestFullScreen(document.documentElement);
    } else {
        if ((document.fullScreenElement && document.fullScreenElement !== null) ||
            (!document.mozFullScreen && !document.webkitIsFullScreen)) {
            $('.fullscreen').addClass('exitFullscreen').removeClass('.fullscreen');
            fullScreen = 1;
            $('.heder_wraper').hide();
            if (document.documentElement.requestFullScreen) {
                document.documentElement.requestFullScreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                mozFullScreen = 1;
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullScreen) {
                document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            }
            if (true === isMobile) {

                if (window.innerHeight > window.innerWidth) {
                    $('.show-warning,warning-icon-div').show();
                }
            }
            fullScreen = 1;
            setFlipBookSize();
            preBtnFullscreen = 1;
        } else {
            preBtnFullscreen = 0;
            $('.exitFullscreen').addClass('fullscreen').removeClass('exitFullscreen');
            fullScreen = 0;
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                mozFullScreen = 0;
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }

            if (true === isMobile) {
                $('.install-app').show();
            }

            if (isAndroid === 1) {

            }
            setFlipBookSize();
        }
    }

}

function adjustForPortraitMode() {
    //    $('.flip-control').hide();
    jQuery('.show-warning,warning-icon-div').show();
    if (fullScreen === 1) {
        portraitFullScreen();
    }
}

function adjustForLandscapeMode() {
    //    $('.flip-control').show();
    jQuery('.show-warning,warning-icon-div').hide();
    jQuery('.install-app-btn').attr('src', '../assets/images/btn_install_landscape.png');
    if (fullScreen === 1) {
        //        landscapeFullScreen();
    }

    if (isIOS === 1) {
        if (iPad === 1) {
            jQuery('.app-text').css('font-size', '16px');
            jQuery('.install-app-btn').css('height', '25px');
            jQuery('.logo').css('width', '139px');
            //            $('.logo').css('height', '29px');
            //            $('.logo').css('margin-top', '3px');
        }
    }
}

function bottomActionButtonLayout() {
    var marginToLeft = (jQuery(window).width() - jQuery("#flipbook").width()) / 2;
    jQuery(".bottomActionBtnContainer").css({
        'margin-left': marginToLeft
    });
}

function resizeFlipbook(setWidth, setHeight) {
    jQuery('#flipbook').turn("size", setWidth, setHeight);
    if (!mDevice) {
        jQuery('.dFrontNextControl').css('display', 'inline-block');
        jQuery('#frontCoverArrow').remove();
    }
    bottomActionButtonLayout();
}

function portraitFullScreen() {
    jQuery('.install-app-btn').attr('src', '../assets/images/btn_install_portrait.png');
}
