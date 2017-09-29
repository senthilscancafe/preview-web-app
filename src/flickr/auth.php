<!DOCTYPE html>
<html>    
    <body>        
        <?php
        require_once("../config/config.php");
        $flickrConfig = $GLOBALS['flickr'];
        /* Last updated with phpFlickr 2.3.2
         *
         * Edit these variables to reflect the values you need. $default_redirect 
         * and $permissions are only important if you are linking here instead of
         * using phpFlickr::auth() from another page or if you set the remember_uri
         * argument to false.
         */

        $api_key = $flickrConfig['apiKey'];
        $api_secret = $flickrConfig['apiSecret'];

        $permissions = "read";
        $path_to_phpFlickr_class = "./";

        include($path_to_phpFlickr_class . "phpFlickr.php");

        unset($_SESSION['phpFlickr_auth_token']);
        unset($_SESSION['phpFlickr_auth_redirect']);

        $f = new phpFlickr($api_key, $api_secret);
        if (empty($_GET['frob'])) {
            $f->auth($permissions, false);
        } else {
            $response = $f->auth_getToken($_GET['frob']);

            $accessToken = $response['token']['_content'];
            $perms = $response['perms']['_content'];
            $nsid = $response['user']['nsid'];
            $username = $response['user']['username'];
            $fullname = $response['user']['fullname'];

            setcookie("accessToken", $accessToken, time() + (3600));
            setcookie("perms", $perms, time() + (86400 * 30)); // 86400 = 1 day
            setcookie("nsid", $nsid, time() + (86400 * 30)); // 86400 = 1 day
            setcookie("username", $username, time() + (86400 * 30)); // 86400 = 1 day
            setcookie("fullname", $fullname, time() + (86400 * 30)); // 86400 = 1 day        
            header("Location:flickrAuth.php?success=true");
        }
        ?>
    </body>
</html>
