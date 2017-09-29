<?php

require_once 'config/config.php';

$urls = $GLOBALS['urls'];
$configVars = $GLOBALS['config'];

$sharepreviewUrl = $urls['share_preview_url'];
$zuluUrl = $urls['zulu_url'];
$sendLinkUrl = $urls['send_link_url'];
$newlogInUrl = $urls['login_url'];

$branchKey = $configVars['branch_key'];
$branchLink = $configVars['branchio_api_endpoint'];
$currentUrl=$_GET['stroy_id'];
//$currentUrl = $_SERVER['REQUEST_URI'];
//$apiFlag is to identify own story or shared story. Comes in the URL
//$tokenFlag is to identify whether the shared link is a social media share link or direct email/sms share link. comes in cookie and default is 1 that is targeted token
$apiFlag = 0;
$urlArr = explode('/', $currentUrl);
//print_r($urlArr);
//echo ($urlArr[3]);exit;
$apiFlag = array_pop($urlArr);
// if the user comes to the flipbook preview via a branch io link, then only include the file barnch.php which would have the code to set appropriate cookies
if(strstr($apiFlag, '?')){

    $apiFlag = strtok($apiFlag, '?');
    require_once 'branch.php';
    exit;
}

$parameter = array_pop($urlArr);

$parameter = trim($parameter);

//echo $parameter;
//$parameter = base64_decode($parameter);

$trackingId = NULL;

$loggedInUser = 0;
$userLoggedIn = 0;
$authToken = 0;
$account = "";
//$tokenFlag = 1; // default is 1 (targetted-token) as from dashboard it will always consider targeted token
$orderToken = $currentUrl;

//if (isset($_COOKIE['order_token']) && $_COOKIE['order_token'] != '') {
//    $orderToken = $_COOKIE['order_token'];
//}

//if (isset($_COOKIE['token_flag']) && $_COOKIE['token_flag'] != '') {
//    $tokenFlag = $_COOKIE['token_flag'];
//}

if (isset($_COOKIE['custId']) && '' != $_COOKIE['custId']) {
    $loggedInUser = $_COOKIE['custId'];
    $userLoggedIn = 1;
    $authToken = $_COOKIE['authToken'];
}

//var_dump($_COOKIE['sharee_id']);
//var_dump($_COOKIE['account']);die;

if ($loggedInUser != 0 && isset($_COOKIE['sharee_id']) && '' != $_COOKIE['sharee_id'] && $_COOKIE['sharee_id'] != "null") {
    $loggedInUser = $_COOKIE['sharee_id'];
}
//var_dump(!is_null($_COOKIE['account']));die;
if ($loggedInUser == 0 && isset($_COOKIE['account']) && '' != $_COOKIE['account'] && $_COOKIE['account'] != "null") {
    $account = trim($_COOKIE['account']);
    $loggedInUser = trim($_COOKIE['account']);
}


if($apiFlag == 0) {
    $trackingId = $parameter;
    $sharepreviewUrl .= "story-details/" . $loggedInUser . "/" . $trackingId;
} else {
    $sharepreviewUrl .= "share-story-details/". $orderToken;
}

$lsharepreviewUrl = $sharepreviewUrl;
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $lsharepreviewUrl);
/*$headers = array(
    'x-api-session-key: '.$_COOKIE['sessionKey'],
    'Version: 1',
);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);*/
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
$result = curl_exec($ch);

curl_close($ch);

$decodeResult = json_decode($result);

$sharerId = '';
$storyId = '';
$login_type = NULL;
$login_id = NULL;
$sharedStatus = 0;
$deviceCount = 0;
$timestamp = '';
$orderId = '';
$visitCount = 0;

if (isset($decodeResult->arr_data->user_id)) {
    $sharerId = $decodeResult->arr_data->user_id;
}

if (isset($decodeResult->arr_data->device_count) && $decodeResult->arr_data->device_count != 0) {
    $deviceCount = 1;
}

if (isset($decodeResult->arr_data->shared_status)) {
    $sharedStatus = $decodeResult->arr_data->shared_status;
}

if (isset($decodeResult->arr_data->order_id)) {
    $storyId = $decodeResult->arr_data->order_id;
}

if (isset($decodeResult->arr_data->login_type)) {
    $login_type = $decodeResult->arr_data->login_type;
}

if (isset($decodeResult->arr_data->login_id)) {
    $login_id = $decodeResult->arr_data->login_id;
}

if (isset($decodeResult->arr_data->timestamp)) {
    $timestamp = $decodeResult->arr_data->timestamp;
}

if (isset($decodeResult->arr_data->order_id)) {
    $orderId = $decodeResult->arr_data->order_id;
}

if (isset($decodeResult->arr_data->visit_count)) {
    $visitCount = $decodeResult->arr_data->visit_count;
}

if ($trackingId && $loggedInUser == 0) {
    header('Location:' . $urls['login_url']);
    exit;
}

$imagdetails = array();
if (!empty($decodeResult->arr_data->details)) {
    $share_details = (array) $decodeResult->arr_data->details;

    $imagdetailscount = count($decodeResult->arr_data->details);
    foreach ($decodeResult->arr_data->details as $indexkey => $rowshare_details) {
        if (strstr($rowshare_details->spread_url, 'cover_1')) {
            $imagdetails[$rowshare_details->spread_id]['pagestyle'] = 'style="width:auto; height:700px; "';
            $imagdetails[$rowshare_details->spread_id]['spec'] = '';
        } else if (strstr($rowshare_details->spread_url, 'cover_2')) {
            $imagdetails[$rowshare_details->spread_id]['pagestyle'] = 'style="width:auto; height:700px; "';
            $imagdetails[$rowshare_details->spread_id]['spec'] = '';
        } else {
            $imagdetails[$rowshare_details->spread_id]['pagestyle'] = 'style="height:700px;"';
            $imagdetails[$rowshare_details->spread_id]['spec'] = 'width="915" height="458"';
        }

        $imagdetails[$rowshare_details->spread_id]['spread_url'] = $rowshare_details->spread_url;
        $imagdetails[$rowshare_details->spread_id]['thumb_url'] = $rowshare_details->thumb_url;
        $imagdetails[$rowshare_details->spread_id]['pagenumber'] = ($indexkey + 1) . ' / ' . $imagdetailscount;
        $imagdetails[$rowshare_details->spread_id]['spread_id'] = $rowshare_details->spread_id;
        $imagdetails[$rowshare_details->spread_id]['likes'] = $rowshare_details->likescount;
        $imagdetails[$rowshare_details->spread_id]['comments'] = $rowshare_details->commentscount;
        $imagdetails[$rowshare_details->spread_id]['likestatus'] = $rowshare_details->likesstatus;
    }
}

$dataParam = array();

$dataParam['$always_deeplink'] = true;

$dataParam['sharer_id'] = '';
$dataParam['sharee_id'] = $loggedInUser;
//$dataParam['sharee_id'];
$dataParam['story_id'] = NULL;
$dataParam['is_private'] = 0;
$dataParam['is_social'] = 0;
//$dataParam['is_social'] = 0;
$dataParam['login_id'] = $login_id;
$dataParam['login_type'] = $login_type;

$dataParam['should_show_personalized_page'] = 0;
$dataParam['is_second_link'] = 1;
if ($loggedInUser == NULL || $loggedInUser == '' || $loggedInUser == 0) {
    $dataParam['should_show_personalized_page'] = 1;
}

if (!$trackingId) {
    $dataParam['should_show_personalized_page'] = 0;
}

if ('' != $sharerId) {
    $dataParam['sharer_id'] = $sharerId;
}

if ('' != $storyId) {
    $dataParam['story_id'] = $storyId;
    setcookie('story_id', $storyId, time() + (86400 * 30 * 2), "/"); // 86400 = 1 day
}

$deepLinkUrl = createDeepLink('', $dataParam);


$sendLinkApiUrl = $sendLinkUrl;
include_once 'main.php';

function createDeepLink($originalUrl, $parameters) {
    global $branchKey;
    global $branchLink;

    $branchioLink = $branchLink;
    $postinfo = array();
    $postinfo['branch_key'] = $branchKey;

    if ($originalUrl != '') {
        $parameters['$android_url'] = $originalUrl;
        $parameters['$ios_url'] = $originalUrl;
        $parameters['$ipad_url'] = $originalUrl;
        $parameters['$blackberry_url'] = $originalUrl;
        $parameters['$windows_phone_url'] = $originalUrl;
        $parameters['$desktop_url'] = $originalUrl;
    }

    //print_r($parameters);die;

    $postinfo['data'] = $parameters;
    $chDeepLink = curl_init();
    $headers = array('Content-Type: application/json');
    $postDataDeepLink = json_encode($postinfo);

    curl_setopt($chDeepLink, CURLOPT_URL, $branchioLink);
    curl_setopt($chDeepLink, CURLOPT_POST, 1);
    curl_setopt($chDeepLink, CURLOPT_POSTFIELDS, $postDataDeepLink);
    curl_setopt($chDeepLink, CURLOPT_USERAGENT, 'api');

    curl_setopt($chDeepLink, CURLOPT_HEADER, 0);
    curl_setopt($chDeepLink, CURLOPT_HTTPHEADER, $headers);

    curl_setopt($chDeepLink, CURLOPT_FORBID_REUSE, true);

    curl_setopt($chDeepLink, CURLOPT_RETURNTRANSFER, true);

    curl_setopt($chDeepLink, CURLOPT_FRESH_CONNECT, true);
    curl_setopt($chDeepLink, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($chDeepLink, CURLOPT_SSL_VERIFYPEER, 0);

    $deepLinkResult = curl_exec($chDeepLink);

    curl_close($chDeepLink);
    $finalResult = json_decode($deepLinkResult);

    $deepLinkUrl = $finalResult->url;

    return $deepLinkUrl;
}

?>
