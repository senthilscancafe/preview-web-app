<?php

require_once("head.php");
require_once("xml2array.php");

//var_dump($_POST);
//die();
$accessToken = $_POST['accessToken'];
$albumData = array();
try {
    $url = "https://picasaweb.google.com/data/feed/api/user/default";
    $curl = curl_init($url);
    curl_setopt_array($curl, array(
        CURLOPT_HTTPHEADER => array(
            'GData-Version: 2',
            'Authorization: Bearer ' . $accessToken
        ),
        CURLOPT_DNS_USE_GLOBAL_CACHE => false,
        CURLOPT_DNS_CACHE_TIMEOUT => 2,
        CURLOPT_SSL_VERIFYHOST => 0,
        CURLOPT_SSL_VERIFYPEER => 0,
        CURLOPT_RETURNTRANSFER => true
    ));
    $curlResult = curl_exec($curl);   
    $curlHttpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    $curlInfo = curl_getinfo($curl);
    curl_close($curl);

    if ($curlHttpCode == 200) {
        $array = XML2Array::createArray($curlResult);

        if (isAssoc($array['feed']['entry'])) {
            $val = $array['feed']['entry'];
            $albumTitle = $val['title'];
            $albumId = $val['gphoto:id'];
            $userId = $val['gphoto:user'];
            $noOfPhotos = $val['gphoto:numphotos'];
            $albumCoverImage = $val['media:group']['media:thumbnail']['@attributes']['url'];

            //Added imgmax=d to get original image size download url //// IMPORTANT /////
            if (strpos($val['link'][0]['@attributes']['href'], 'authkey') !== false) {
                $albumFeedUrl = $val['link'][0]['@attributes']['href'] . "&imgmax=d";
            } else {
                $albumFeedUrl = $val['link'][0]['@attributes']['href'] . "?imgmax=d";
            }

            $albumData[] = array(
                'userId' => $userId,
                'albumTitle' => $albumTitle,
                'albumId' => $albumId,
                'noOfPhotos' => $noOfPhotos,
                'albumCoverImage' => $albumCoverImage,
                'albumFeedUrl' => $albumFeedUrl
            );
        } else {
            foreach ($array['feed']['entry'] as $val) {

                $albumTitle = $val['title'];
                $albumId = $val['gphoto:id'];
                $userId = $val['gphoto:user'];
                $noOfPhotos = $val['gphoto:numphotos'];
                $albumCoverImage = $val['media:group']['media:thumbnail']['@attributes']['url'];

                //Added imgmax=d to get original image size download url //// IMPORTANT /////
                if (strpos($val['link'][0]['@attributes']['href'], 'authkey') !== false) {
                    $albumFeedUrl = $val['link'][0]['@attributes']['href'] . "&imgmax=d";
                } else {
                    $albumFeedUrl = $val['link'][0]['@attributes']['href'] . "?imgmax=d";
                }

                $albumData[] = array(
                    'userId' => $userId,
                    'albumTitle' => $albumTitle,
                    'albumId' => $albumId,
                    'noOfPhotos' => $noOfPhotos,
                    'albumCoverImage' => $albumCoverImage,
                    'albumFeedUrl' => $albumFeedUrl
                );
            }
        }


        echo json_encode(array('success' => TRUE, 'albumData' => $albumData));
    } else {
        echo json_encode(array('success' => FALSE, 'msg' => 'SERVER ERROR'));
    }
} catch (exception $e) {
    echo json_encode(array('success' => FALSE, 'msg' => 'SERVER ERROR'));
}

function isAssoc($arr) {
    return array_keys($arr) !== range(0, count($arr) - 1);
}

?>