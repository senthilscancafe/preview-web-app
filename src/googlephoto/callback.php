<?php
require_once("head.php");

try
{
        if(isset($_GET['error'])){
            header("Location:googleauth.html?success=false&message=".$_GET['error']);
        }else{
            $authCode = $_GET['code'];
            $webAuth = authGetObject();	
            $accessTokenDetails = json_decode($webAuth->authenticate($authCode));
            $accessToken = $accessTokenDetails->access_token;
            $refreshToken = $accessTokenDetails->refresh_token;
            setcookie("gAccessToken", $accessToken, time() + (24 * 60 * 60 * 1000),'/');
            setcookie("gRefreshToken", $refreshToken, time() + (24 * 60 * 60 * 1000),'/');
            header("Location:googleauth.html?success=true");
        }
}
catch(exception $e)
{
	p("<h1>Exception</h1>");
	pd($e);
}
?>