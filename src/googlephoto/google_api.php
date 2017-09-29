<?php
require_once("head.php");
$action = $_REQUEST['action'];
$payload = $_REQUEST['payload'];

$appObject = new GoogleApp($payload['accessToken'],$payload['refreshToken']);

switch ($action){
    case 'getalbum':
            $response = $appObject->getAlbums();
            echo $response;
        break;
    case 'getalbumphotos':
            $albumFeedUrl = $payload['albumFeedUrl'];
            $albumPhotosCount = $payload['photosCount'];
            $response = $appObject->getAlbumPhotos($albumFeedUrl, $albumPhotosCount);
            echo $response;
        break;
    default :
            echo json_encode(array("success" => FALSE,"msg" => "Invalid action"));
}
?>
