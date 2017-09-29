<?php

require_once("xml2array.php");
require_once("Google/Client.php");
require_once("GoogleApp.php");
require_once("../config/config.php");

$googleConfig = $GLOBALS['google'];

function pd($d) {
    echo "<pre>" . print_r($d, true) . "</pre>";
    exit;
}

function p($d) {
    echo "<pre>" . print_r($d, true) . "</pre>";
}

function pr($d) {
    return "<pre>" . print_r($d, true) . "</pre>";
}

function h($d) {
    echo "<h2>$d</h2>";
}

function hr() {
    echo "<hr>";
}

function authGetObject($force = false) {
    global $googleConfig;
    try {

        $webAuth = new Google_Client();
        //Local
        $webAuth->setClientId($googleConfig['clientId']);
        $webAuth->setClientSecret($googleConfig['clientSecret']);
        $webAuth->setApplicationName($googleConfig['applicationName']);
        $webAuth->setRedirectUri($googleConfig['redirectURI']);
        $webAuth->setAccessType('offline'); //online - should be offline in order to get refresh token
        $webAuth->setApprovalPrompt('force'); //force
        $webAuth->setScopes(array('https://picasaweb.google.com/data/'));
        return $webAuth;
    } catch (Exception $ex) {
        die("An unexpected error occurred - " . $ex->getMessage());
    }
}

function curlCall($url, $curlOptions = array()) {
    $curlHandle = $curlResult = $curlObj = $curlInfo = $curlHttpCode = "";
    $curlHandle = curl_init($url);
    $curlOptions[CURLOPT_RETURNTRANSFER] = true;
    $curlOptions[CURLOPT_SSL_VERIFYPEER] = 0;
    curl_setopt_array($curlHandle, $curlOptions);
    $curlResult = curl_exec($curlHandle);
    $curlHttpCode = curl_getinfo($curlHandle, CURLINFO_HTTP_CODE);
    pd($curlHttpCode);

    $curlInfo = curl_getinfo($curlHandle);
    $curlObj = json_decode($curlResult);
    curl_close($curlHandle);
    return $curlObj;
}

?>