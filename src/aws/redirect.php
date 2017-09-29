<?php
require_once("../config/config.php");
 
$amazonConfig = $GLOBALS['amazon'];

$amazonViewBaseURL = $amazonConfig['amazonViewBaseURL'];
$amazonViewClientId = $amazonConfig['amazonViewClientId'];
$amazonViewScope = $amazonConfig['amazonViewScope'];
$amazonViewResponseType = $amazonConfig['amazonViewResponseType'];
$amazonViewRedirectUri = $amazonConfig['amazonViewRedirectUri'];

$getToken = $amazonViewBaseURL .  '?client_id=' . $amazonViewClientId . '&scope=' . $amazonViewScope . '&response_type=code&redirect_uri=' . $amazonViewRedirectUri;

header('Location:' . $getToken);

?>