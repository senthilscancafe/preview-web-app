<?php

require_once("head.php");
require_once("Google/Client.php");
require_once("../config/config.php");

$googleConfig = $GLOBALS['google'];
if (isset($_COOKIE['gAccessToken']) && !empty($_COOKIE['gAccessToken'])) {
    header("Location:googleauth.html?success=true");
} else {
    global $googleConfig;
    $webAuth = new Google_Client();
    $webAuth->setClientId($googleConfig['clientId']);
    $webAuth->setClientSecret($googleConfig['clientSecret']);
    $webAuth->setApplicationName($googleConfig['applicationName']);
    $webAuth->setRedirectUri($googleConfig['redirectURI']);
    $webAuth->setAccessType('offline'); //online - should be offline in order to get refresh token
    $webAuth->setApprovalPrompt('force'); //force
    $webAuth->setScopes(array('https://picasaweb.google.com/data/'));
    header("Location:" . $webAuth->createAuthUrl());
}
?>