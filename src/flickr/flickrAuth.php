<!DOCTYPE html>
<html>
    <head>
        <title>Photogurus File Uploader</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="shortcut icon" type="image/x-icon" href="../assets/images/favicon.ico">
        <style>
            .pageload {
                width: 100%;
                height: 100%;
                position: fixed;
                top: 0;
                background-color: white;
                background-color: rgba(255,255,255,0.66);
                z-index: 99999;
                display: table;
                opacity: 5;
            }
            .pageload>div {
                display: table-cell;
                vertical-align: middle;
            }
            .text-center {
                text-align: center !important;
            }
        </style>
    </head>

    <body>
        <div class="pageload loadingPhotogurusBody">
            <div class="pageload-inner text-center">
                <img src="https://imgd.photogurus.com/assets/images/loading-photogurus.gif" style="width: 120px;height: 120px;">
            </div>
        </div>
     <!--<script type="text/javascript" src="../assets/js/thirdparty/jquery/jquery-2.1.4.min.js"></script>-->
        <script type="text/javascript" src="//code.jquery.com/jquery-2.1.4.min.js"></script>      
        <script>
            $(document).ready(function () {
//	'use strict';
                var totalCount = 0;
                var flickerCounter = 0;
                $('.loadingPhotogurusBody').show();
                function getCookies (cname) {
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
                var setCookies = function (cname, cvalue, exdays) {
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

                var accessToken = getCookies("accessToken");



                var nsid = getCookies("nsid");
                var username = getCookies("username");
                var fullname = getCookies("fullname");

                setCookies('fAccessToken', accessToken, 1);
                setCookies('fNsid', nsid, 1);
                setCookies('fUsername', username, 1);
                setCookies('fFullname', fullname, 1);
                window.close();
            });
        </script>
    </body>
</html>


