/*global define, document, gapi, FB, window*/

define(['Augment',
    'Instance',
    'utils/EventCollector',
    'PubSub'
], function (augment, instance, EC, PubSub) {

    'use strict';

    var GlobalData = augment(instance, function () {
        GlobalData = this;
        this.keenCredentials = {};
        this.keenCredentials.keenProjectID = '585b373a8db53dfda8a7daf9';
        this.keenCredentials.keenWriteKey = '8C0B0434AA7C2A549D386B30EB40C72C4C47DFE1C1BF587D3C6081C839786794DE2C79F73D394A78295F46D1D3646183A3B4D9F863EB3501F4E74B42912B448918D84B3963F557CC91596B607A0575BFE2408280C75602FC6E6E824B513B3400';
        this.keenCredentials.keenReadKey = '0823EFFFAD33FC6603F129CDEB678A6816246CADC8EE7512728393FFDF1E2698974A3AB56A791B38430EB7749A7618E064E73C88FF6BE71AFB95B9E6F1E36B674F81637616E448C66320F5DEEE2EF2C131F12272947C154A5D64BE76123FFB43';
        this.keenCredentials.keenMasterKey = 'FB8DD8DEE55999062462D41E29BA169D072CEF8758730B51EBA0E5528F5C951F';

        this.ec = EC.create(this.keenCredentials);
        this.dashboardData = '';
        this.expireDays = 2;
        this.checkStatus = '';
        this.facebookAppId = '543592049052730';
        this.userData = "";
        this.googleData = "";
        this.facebookData = "";
        this.tempData = "";
        this.fbLoginStatusResponse = "";
        this.fileUploadData = {};
        this.fileUploadData.onGoingUpload = 0;
        this.historyLastURL = '';
        this.ownStory = '';
        this.notificationOlddata = 0;
        this.sessionToken = '';
        this.jsLoaded = false;

        this.amazonClientId = 'amzn1.application-oa2-client.a0d65aa5087f48cb98c9eef2063faae4';
        this.amazonSecretId = 'b1911c1b004d8e236c5bdc18de9914e4c2d0d9e459c3857a2fe52399b2ac6038';
        this.imageBase = 'https://imgd.photogurus.com/assets/images/';
        this.playStoreLink = 'https://play.google.com/store/apps/details?id=com.photogurus';
        this.appStoreLink = 'https://itunes.apple.com/us/app/photogurus/id799452318?ls=1&mt=8';
        
        this.playStoreEditorLink = 'https://play.google.com/store/apps/details?id=com.photogurus.editor';
        this.appStoreEditorLink = 'https://itunes.apple.com/us/app/photogurus-editor/id1140909601?mt=8';
        this.storeLink = 'https://www.photogurus.com/?page=send_link';
        
        if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/Android/i))) {
            this.mobileDevice = true;
            if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i))) {
                this.mobileDeviceIsIOS = true;
            } else {
                this.mobileDeviceIsAndroid = true;
            }
        } else {
            this.mobileDevice = false;
        }

        this.userLanguage = 'en-US';
        // IE
        if (navigator.browserLanguage) {
            console.log(navigator.browserLanguage);
            this.userLanguage = navigator.browserLanguage;
        }
        // All other vendors
        else if (navigator.language) {
            console.log(navigator.language);
            this.userLanguage = navigator.language;
        }


        this.setConfig = function (env) {
            switch (env) {
                case "local":
                    this.base = 'https://photogurusdev.scancafe.com';
                    this.baseUrl = 'https://photogurusapidev.scancafe.com/';
                    this.baseUrl2 = 'https://photogurusdev.scancafe.com/';
                    this.baseUrlNew = 'https://apidev.photogurus.com/v2';
                    this.appDownloadLink = 'https://pg.test-app.link/download';
                    this.imageBase = 'https://imgd.photogurus.com/assets/images/';
                    this.facebookAppId = '543592049052730';
                    this.editStoryTool = 'http://sdtdev.photogurus.com/merge/pg/index.html?orderId=';
                    this.mainPage = 'http://192.168.10.4/';
                    this.branchIOKey = 'key_test_iigOe5ilx8SnPzVoCz0DAnapyFddgSuI';
                    this.flickrAPIKey = "b0ec1fb321ca77eb25ee6e1704ea5bc0";
                    this.flickrSecretKey = "a6b2003525500438";
                    this.parseApplicationId = '4R54xBOB39Y6BZDcoq3DhoX5EZZvfa2lvArkX5Pq';
                    this.parseJavaScriptKey = 'SXncKgIuAY8NJxKjnYhx2P5hF23c7WdtGnzJbI4x';
                    this.parsemasterKey = '6gOpnQeAOjE97gGqdOzuqv0LYHRmcSkdTT7tHTWa';                    

                    this.htmlUploaderFileUploadUrl = 'https://uploaddev.photogurus.com/customers/orders/device-image-set-transfer';
                    this.htmlUploaderfbfldpUploadURL = 'https://apidev.photogurus.com/v2/orders/cloud-image-set-metadata-transfer'; // 
                    this.htmlUploaderFlickrOauthARL = "https://localhost/scancafe/pg-web-app/src/flickr/auth.php";
                    this.htmlUploaderGPOauthURL = "https://localhost/scancafe/pg-web-app/src/googlephoto";
                    //get contribution details
                    this.contributionDetailsUrl = 'https://apidev.photogurus.com/v2/customers/orders/image-sets/contribution';

                    if (location.hostname === "localhost") {
                        this.flipbookBaseURL = 'https://localhost/scancafe/pg-web-app/preview/';
                        this.htmlUploaderGPOauthURL = "http://localhost/scancafe/pg-web-app/src/googlephoto";
                        this.amazonAuthURL = 'https://localhost/scancafe/pg-web-app/src/aws/redirect.php';
                        this.amazonRedirectURL = 'https://localhost/scancafe/pg-web-app/src/aws/awsAuth.html';
                    } else if (location.hostname === "192.168.10.117") {
                        this.flipbookBaseURL = 'http://192.168.10.117/scancafe/pg-web-app/preview/';
                    } else if (location.hostname === "192.168.10.4") {
                        this.flipbookBaseURL = 'http://192.168.10.4/scancafe/pg-web-app/preview/';
                    } else if (location.hostname === "192.168.10.106") {
                        this.baseUrlForHTMLUploader = 'http://192.168.10.106/scancafe/pg-web-app/jqueryuploader/';
                        this.dashboardUrl = 'http://192.168.10.106/scancafe/pg-web-app/src/#/dashboard';
                        this.policy = 'http://192.168.10.106/scancafe/pg-web-app/src/#/policy';
                        this.terms = 'http://192.168.10.106/scancafe/pg-web-app/src/#/termofservices';
                        this.flipbookBaseURL = 'http://192.168.10.106/scancafe/pg-web-app/preview/';
                    } else {
                        //Default
                        this.primaryServerBasePath = 'http://sdt.photogurus.com/dev/wpgsphp/web/api/v1/';
                        this.imageServerBasePath = 'http://sdt.photogurus.com/dev/wpgsphp/web/api/v1/';
                        this.flipbookBaseURL = 'https://photogurusdev.scancafe.com/web/preview/';
                    }
                    break;
                case "dev":
                    this.base = 'https://photogurusdev.scancafe.com';
                    this.baseUrl = 'https://photogurusapidev.scancafe.com/';
                    this.baseUrl2 = 'https://photogurusdev.scancafe.com/';
                    this.baseUrlNew = 'https://apidev.photogurus.com/v2';
                    this.appDownloadLink = 'https://pg.test-app.link/download';
                    this.imageBase = 'https://imgd.photogurus.com/assets/images/';
                    this.baseUrlForHTMLUploader = 'https://photogurusdev.scancafe.com/web/#/uploader';
                    this.dashboardUrl = 'https://photogurusdev.scancafe.com/web/#/dashboard';
                    this.policy = 'https://photogurusdev.scancafe.com/web/#/policy';
                    this.terms = 'https://photogurusdev.scancafe.com/web/#/termofservices';
                    this.flipbookBaseURL = 'https://photogurusdev.scancafe.com/web/preview/';
                    //                    this.editStoryTool = 'https://photogurusdev.scancafe.com/web/index.html?orderId=';
                    this.editStoryTool = 'http://sdtdev.photogurus.com/master/index.html?orderId=';
                    this.mainPage = 'https://photogurusdev.scancafe.com/';
                    this.baseUrl = 'https://photogurusapidev.scancafe.com/';
                    this.branchIOKey = 'key_test_iigOe5ilx8SnPzVoCz0DAnapyFddgSuI';
                    this.flickrAPIKey = "c3c818aad23f6b04afe80c33b24c1d65";
                    this.flickrSecretKey = "2c80393d57ff9bad";
                    //Parse Keys
                    this.parseApplicationId = '4R54xBOB39Y6BZDcoq3DhoX5EZZvfa2lvArkX5Pq';
                    this.parseJavaScriptKey = 'SXncKgIuAY8NJxKjnYhx2P5hF23c7WdtGnzJbI4x';
                    this.parsemasterKey = '6gOpnQeAOjE97gGqdOzuqv0LYHRmcSkdTT7tHTWa';
                    //uploader
                    this.htmlUploaderFileUploadUrl = 'https://uploaddev.photogurus.com/customers/orders/device-image-set-transfer';
                    this.htmlUploaderfbfldpUploadURL = 'https://apidev.photogurus.com/v2/orders/cloud-image-set-metadata-transfer'; // 
                    this.htmlUploaderFlickrOauthARL = "https://photogurusdev.scancafe.com/web/flickr/auth.php";
                    this.htmlUploaderGPOauthURL = "https://photogurusdev.scancafe.com/web/googlephoto";
                    this.amazonAuthURL = 'https://photogurusdev.scancafe.com/web/aws/redirect.php';
                    this.amazonRedirectURL = 'https://photogurusdev.scancafe.com/web/aws/awsAuth.html';
                    this.contributionDetailsUrl = 'https://apidev.photogurus.com/v2/customers/orders/image-sets/contribution';
                    break;
                case "live":
                    // production URLs
                    this.base = 'https://www.photogurus.com';
                    this.baseUrl = 'https://photogurusapi.scancafe.com/';
                    this.baseUrl2 = 'https://www.photogurus.com/';
                    this.baseUrlNew = 'https://api.photogurus.com/v2';
                    this.appDownloadLink = 'https://pg.app.link/download';
                    this.imageBase = 'https://imgd.photogurus.com/assets/images/';
                    this.baseUrlForHTMLUploader = 'https://www.photogurus.com/web/#/uploader/';
                    this.dashboardUrl = 'https://www.photogurus.com/web/#/dashboard';
                    this.policy = 'https://www.photogurus.com/web/#/policy';
                    this.terms = 'https://www.photogurus.com/web/#/termofservices';
                    this.flipbookBaseURL = 'https://www.photogurus.com/web/preview/';
                    this.editStoryTool = 'http://sdt.photogurus.com/index.html?orderId=';
                    this.mainPage = 'https://www.photogurus.com/';
                    this.facebookAppId = '519168014827117';
                    this.branchIOKey = 'key_live_fihLn7lgEYSoUAIitE5vKjneuAdfoSx3';

                    this.flickrAPIKey = "282dd82e068597b77c2a8ad78c113a92";
                    // check flicker auth url and google auth url path 
                    this.flickrSecretKey = "982d10f7bb50e0a4";
                    //Parse Keys
                    this.parseApplicationId = 'IyZBSwons9KpZk3YUaMULnGAxZgaUi4vJvdiwTx9';
                    this.parseJavaScriptKey = '0DtobOoXUNub7Y5E4G5ZXDyjj2boIi9agT1j1aFO';
                    this.parsemasterKey = 'ID37aci9t9NO2D8ziaMPIdEKYftnKl58uF6twrNt';
                    //uploader
                    this.htmlUploaderFileUploadUrl = 'https://upload.photogurus.com/customers/orders/device-image-set-transfer';
                    this.htmlUploaderfbfldpUploadURL = 'https://api.photogurus.com/v2/orders/cloud-image-set-metadata-transfer';
                    this.htmlUploaderFlickrOauthARL = "https://www.photogurus.com/web/flickr/auth.php";
                    this.htmlUploaderGPOauthURL = "https://www.photogurus.com/web/googlephoto";
                    this.amazonAuthURL = 'https://www.photogurus.com/web/aws/redirect.php';
                    this.amazonRedirectURL = 'https://www.photogurus.com/web/aws/awsAuth.html';

                    break;
                case "pgdemo":
                    // production URLs
                    this.base = 'https://www.photogurus.com';
                    this.baseUrl = 'https://photogurusapi.scancafe.com/';
                    this.baseUrl2 = 'https://www.photogurus.com/';
                    this.baseUrlNew = 'https://api.photogurus.com/v2';
                    this.appDownloadLink = 'https://pg.app.link/download';
                    this.imageBase = 'https://imgd.photogurus.com/assets/images/';
                    this.baseUrlForHTMLUploader = 'https://pgdemo.mi2.in/web/#/uploader/';
                    this.dashboardUrl = 'https://pgdemo.mi2.in/web/#/dashboard';
                    this.policy = 'https://pgdemo.mi2.in//web/#/policy';
                    this.terms = 'https://pgdemo.mi2.in//web/#/termofservices';
                    this.flipbookBaseURL = 'https://pgdemo.mi2.in//preview/';
                    this.editStoryTool = 'http://sdt.photogurus.com/index.html?orderId=';
                    this.mainPage = 'https://www.photogurus.com/';
                    this.facebookAppId = '519168014827117';
                    this.branchIOKey = 'key_live_fihLn7lgEYSoUAIitE5vKjneuAdfoSx3';

                    this.flickrAPIKey = "282dd82e068597b77c2a8ad78c113a92";
                    // check flicker auth url and google auth url path 
                    this.flickrSecretKey = "982d10f7bb50e0a4";
                    //Parse Keys
                    this.parseApplicationId = 'IyZBSwons9KpZk3YUaMULnGAxZgaUi4vJvdiwTx9';
                    this.parseJavaScriptKey = '0DtobOoXUNub7Y5E4G5ZXDyjj2boIi9agT1j1aFO';
                    this.parsemasterKey = 'ID37aci9t9NO2D8ziaMPIdEKYftnKl58uF6twrNt';
                    //uploader
                    this.htmlUploaderFileUploadUrl = 'https://upload.photogurus.com/customers/orders/device-image-set-transfer';
                    this.htmlUploaderfbfldpUploadURL = 'https://api.photogurus.com/v2/orders/cloud-image-set-metadata-transfer';
                    this.htmlUploaderFlickrOauthARL = "https://www.photogurus.com/web/flickr/auth.php";
                    this.htmlUploaderGPOauthURL = "https://www.photogurus.com/web/googlephoto";
                    this.amazonAuthURL = 'https://www.photogurus.com/web/aws/redirect.php';
                    this.amazonRedirectURL = 'https://www.photogurus.com/web/aws/awsAuth.html';

                    break;
                case "UAT":
                    // uat URLs
                    this.base = 'https://www.photogurus.com';
                    this.baseUrl = 'https://photogurusapi.scancafe.com/';
                    this.baseUrl2 = 'https://www.photogurus.com/';
                    this.baseUrlNew = 'https://api.photogurus.com/v2';
                    this.appDownloadLink = 'https://pg.app.link/download';
                    this.imageBase = 'https://imgd.photogurus.com/assets/images/';
                    this.baseUrlForHTMLUploader = 'https://www.photogurus.com/UAT/#/uploader';
                    this.dashboardUrl = 'https://www.photogurus.com/UAT/#/dashboard';
                    this.policy = 'https://www.photogurus.com/UAT/#/policy';
                    this.terms = 'https://www.photogurus.com/UAT/#/termofservices';
                    this.flipbookBaseURL = 'https://www.photogurus.com/UAT/preview/';
                    this.editStoryTool = 'https://sdt.photogurus.com/index.html?orderId=';
                    this.mainPage = 'https://www.photogurus.com/';
                    this.baseUrl = 'https://www.photogurus.com/';
                    this.branchIOKey = 'key_live_fihLn7lgEYSoUAIitE5vKjneuAdfoSx3';
                    //UAT new keys
                    this.flickrAPIKey = "99f77e566f9ba0cf50ded6750e8b2286";
                    this.flickrSecretKey = "39b731e8bc3d116c";
                    //facebook keys
                    this.facebookAppId = '519168014827117';
                    //Parse Keys
                    this.parseApplicationId = 'IyZBSwons9KpZk3YUaMULnGAxZgaUi4vJvdiwTx9';
                    this.parseJavaScriptKey = '0DtobOoXUNub7Y5E4G5ZXDyjj2boIi9agT1j1aFO';
                    this.parsemasterKey = 'ID37aci9t9NO2D8ziaMPIdEKYftnKl58uF6twrNt';
                    //uploader
                    this.htmlUploaderFileUploadUrl = 'https://upload.photogurus.com/customers/orders/device-image-set-transfer';
                    this.htmlUploaderfbfldpUploadURL = 'https://api.photogurus.com/v2/orders/cloud-image-set-metadata-transfer'; // 
                    this.htmlUploaderFlickrOauthARL = "https://www.photogurus.com/UAT/flickr/auth.php";
                    this.htmlUploaderGPOauthURL = "https://www.photogurus.com/UAT/googlephoto";
                    this.amazonAuthURL = 'https://www.photogurus.com/UAT/aws/redirect.php';
                    this.amazonRedirectURL = 'https://www.photogurus.com/UAT/aws/awsAuth.html';
                    break;
                default:
                    break;
            }
        };
        this.CURRENTCOUNTRYCODE = null;




        PubSub.unsubscribe("LOAD_CLOUD_JS_FILES");
        PubSub.subscribe("LOAD_CLOUD_JS_FILES", function () {
            GlobalData.loadCloudJSfiles();
        });

        this.loadCloudJSfiles = function () {
            console.log(GlobalData.jsLoaded);
            if (GlobalData.jsLoaded) {
                jQuery("#googlePlusLogin").removeClass("disabled");
                jQuery("#facebookLogin").removeClass("disabled");
                jQuery("#amazonLogin").removeClass("disabled");
            } else {
                jQuery.getScript("https://apis.google.com/js/client.js", function (data, textStatus, jqxhr) {
                    jQuery.getScript("https://apis.google.com/js/api.js", function (data, textStatus, jqxhr) {
                        jQuery("#googlePlusLogin").removeClass("disabled");
                        jQuery.getScript("//connect.facebook.net/en_US/sdk.js", function (data, textStatus, jqxhr) {
                            jQuery("#facebookLogin").removeClass("disabled");
                            jQuery.getScript("https://api-cdn.amazon.com/sdk/login1.js", function (data, textStatus, jqxhr) {
                                jQuery("#amazonLogin").removeClass("disabled");
                                GlobalData.jsLoaded = true;
                                jQuery.getScript("//www.google-analytics.com/analytics.js", function (data, textStatus, jqxhr) {});
                            });
                        });
                    });
                });
            }
        };
        /* ---------------------------------------------facebook------------------------------ */
        window.fbAsyncInit = function () {
            FB.init({
                appId: GlobalData.facebookAppId,
                cookie: true, // enable cookies to allow the server to access 
                // the session
                xfbml: true, // parse social plugins on this page
                version: 'v2.8' // use version 2.2
            });


            FB.getLoginStatus(function (response) {

                if (response.status === 'connected') {
                    //                    var uid = response.authResponse.userID;
                    //                    var accessToken = response.authResponse.accessToken;
                } else if (response.status === 'not_authorized') {
                    // the user is logged in to Facebook, 
                    // but has not authenticated your app
                } else {
                    // the user isn't logged in to Facebook.
                }
            });
        };

        /*                    facebook initialisation.          */

        this.loadCloudJSFiles = function () {
            //Google analytics
            var googleAnalyticsFile = document.createElement("script");
            jQuery(googleAnalyticsFile).attr({
                'src': '//www.google-analytics.com/analytics.js'
            });
            document.body.appendChild(googleAnalyticsFile);

        };
        GlobalData.loadCloudJSFiles();



        // Load the SDK asynchronously
        // Here we run a very simple test of the Graph API after login is
        // successful.  See statusChangeCallback() for when this call is made.
        this.testAPI = function () {
            FB.api('/me?fields=id,name,first_name,last_name,email', function (response) {
                console.log('called testAPI');
                console.dir(response);
                if (response.error) {

                } else {
                    if (typeof (response.email) !== "undefined" && response.email !== '') {
                        GlobalData.facebookData = response;
                        PubSub.publish('FACEBOOK_LOGGED_IN');
                    } else {
                        $('.form-inputs').find('.errorMessage').text('Could not retreive email id from Facebook account');
                    }
                }

            });
        };

        this.checkFBPermission = function (deferred) {
            GlobalData.tempData = "";
            FB.api('/me/permissions', function (response) {
                console.log('called checkFBPermission');
                var declined = ["email"];

                //console.dir(response);
                if (typeof (response.data) === "undefined") {
                    declined = ["email"]; //if no permissions set
                } else {

                    for (var i = 0; i < response.data.length; i++) {
                        if (response.data[i].permission === 'email' && response.data[i].status === 'granted') {
                            declined = [];
                        }
                    }

                }
                GlobalData.tempData = declined;
                deferred.resolve();
            });
        };

        this.statusChangeCallback = function (response) {
            console.log('called statusChangeCallback');
            console.log(response.status);
            // The response object is returned with a status field that lets the
            // app know the current login status of the person.
            // Full docs on the response object can be found in the documentation
            // FB.getLoginStatus();
            var deferred = $.Deferred();
            window.fb_loaded = deferred.promise();
            if (response.status === 'connected') {
                // Logged into your app and Facebook.
                GlobalData.checkFBPermission(deferred);
                $.when(fb_loaded).then(function () {
                    var declinedPermissions = GlobalData.tempData;
                    console.dir(declinedPermissions);
                    if (declinedPermissions.length === 0) {
                        GlobalData.testAPI();
                    } else {
                        jQuery('#messageModal').modal('show');
                        jQuery('#messageModal #reinitiateFBDialog').unbind("click");
                        jQuery('#messageModal #reinitiateFBDialog').on('click', function (event) {
                            event.stopPropagation();
                            jQuery('#messageModal').modal('hide');
                            FB.login(function (response) {
                                console.dir(response);
                                if (response && !response.error && response.status === 'connected') {
                                    if (response.authResponse !== null) {
                                        GlobalData.testAPI();
                                    }
                                }
                            }, {
                                scope: 'email, public_profile, user_photos',
                                auth_type: 'rerequest'
                            });

                        });
                    }

                });

            } else if (response.status === 'not_authorized') {
                // The person is logged into Facebook, but not your app.
                // document.getElementById('status').innerHTML = 'Please log ' + 'into this app.';
                FB.login(function (response) {
                    if (response && !response.error && response.status === 'connected') {
                        if (response.authResponse !== null) {
                            GlobalData.testAPI();
                        }
                    }
                }, {
                    scope: 'email, public_profile, user_photos',
                    auth_type: 'rerequest'
                });
            } else {
                // The person is not logged into Facebook, so we're not sure if
                // they are logged into this app or not.
                // document.getElementById('status').innerHTML = 'Please log ' +            'into Facebook.';
                console.log('am in else part');
                FB.login(function (response) {
                    console.dir(response);
                    if (response && !response.error && response.status === 'connected') {
                        if (response.authResponse !== null) {
                            // GlobalData.facebookAccessToken = response.authResponse.accessToken;
                            var permissions = response.authResponse.grantedScopes.split(",");
                            if (permissions.indexOf("email") !== -1) {
                                GlobalData.testAPI();
                            } else {
                                $('.form-inputs').find('.errorMessage').text('We couldn’t log you in with your Facebook ID. Please allow Photogurus to access your email address.');
                            }
                        }
                    }
                }, {
                    //scope: 'user_friends, publish_actions, status_update, read_stream, manage_friendlists, read_custom_friendlists'
                    //scope: 'email, public_profile', //original
                    scope: 'email, public_profile, user_photos', //email id permission is not guarateed https://developers.facebook.com/docs/facebook-login/permissions
                    //scope: 'email, user_photos', //email id permission is not guarateed https://developers.facebook.com/docs/facebook-login/permissions
                    //auth_type: 'rerequest',
                    return_scopes: true

                });
            }
        };
        /* //-------------------------------------------facebook------------------------------ */
        /* ---------------------------------------------google api----------------------------*/
        this.GoogleServiceInitialisation = function () {

        };

        this.GoogleServiceLogin = function () {
            var myParams = {
                'clientid': '819144645292-navbilho2klkmfi7tvorqbso01oj87el.apps.googleusercontent.com',
                'cookiepolicy': 'single_host_origin',
                'callback': function (result) {

                    if (result.status.signed_in) {
                        var request = gapi.client.plus.people.get({
                            'userId': 'me'
                        });
                        request.execute(function (resp) {
                            GlobalData.googleAfterLoginSuccessData(resp);
                        });

                    }
                },
                'approvalprompt': 'force',
                'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read'
            };
            gapi.auth.signIn(myParams);
        };

        this.onLoadCallback = function () {
            //            gapi.client.setApiKey('819144645292-navbilho2klkmfi7tvorqbso01oj87el.apps.googleusercontent.com'); //set your API KEY
            gapi.client.load('plus', 'v1', function () {}); //Load Google + API
            jQuery("#googlePlusLogin").removeClass("disabled");
        };

        this.googleAfterLoginSuccessData = function (googleData) {
            this.googleData = googleData;
            PubSub.publish('GOOGLE_LOGGED_IN');
        };

        /* //---------------------------------------------google api----------------------------*/
    });


    return GlobalData;
});
