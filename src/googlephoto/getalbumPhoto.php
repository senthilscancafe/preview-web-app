<?php

require_once("head.php");
require_once("xml2array.php");

$albumImages = array();
try {
    //Initialise curl object
    $album_feed_url = $_POST['albumFeedUrl'];
    $accessToken = $_POST['accessToken'];
    $url = $album_feed_url;
    $curl = curl_init($url);
    curl_setopt_array($curl, array(
        CURLOPT_HTTPHEADER => array(
            'GData-Version: 2',
            'Authorization: Bearer ' . $accessToken
        ),
        CURLOPT_DNS_USE_GLOBAL_CACHE => false,
        CURLOPT_DNS_CACHE_TIMEOUT => 20,
        CURLOPT_SSL_VERIFYHOST => 0,
        CURLOPT_SSL_VERIFYPEER => 0,
        CURLOPT_RETURNTRANSFER => true
    ));
    $curlResult = curl_exec($curl);
    $curlHttpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);

    if ($curlHttpCode == 200) {
        //Parse Album Data
        $albumData = XML2Array::createArray($curlResult);

        if (isset($albumData['feed']['entry'][0])) {
            foreach ($albumData['feed']['entry'] as $val_1) {
                $imageName = $val_1['title'];
                $imageId = $val_1['gphoto:id'];
                $imageUrls = array();

                //original image url adding to list of images //// IMPORTANT /////
                if (isset($val_1['media:group']['media:content']['@attributes'])) {
                    $imageUrls[] = $val_1['media:group']['media:content']['@attributes']['url'];
                }
                
                foreach ($val_1['media:group']['media:thumbnail'] as $img) {
                    $imageUrls[] = $img['@attributes']['url'];
                }

                $selfLink = '';

                foreach ($val_1['link'] as $link) {
                    if ($link['@attributes']['rel'] == 'self') {
                        $selfLink = $link['@attributes']['href'];
                    }
                }

                $albumImages[] = array(
                    'imageName' => $imageName,
                    'imageUrls' => $imageUrls,
                    'selfLink' => $selfLink,
                    'imageId' => $imageId
                );
            }
        } else {
            if (isset($albumData['feed']['entry'])) {
                $imageName = $albumData['feed']['entry']['title'];
                $imageId = $albumData['feed']['entry']['gphoto:id'];
                $imageUrls = array();

                //original image url adding to list of images //// IMPORTANT /////
                $imageUrls[] = $albumData['feed']['entry']['media:group']['media:content']['@attributes']['url'];
                foreach ($albumData['feed']['entry']['media:group']['media:thumbnail'] as $img) {
                    $imageUrls[] = $img['@attributes']['url'];
                }

                $selfLink = '';

                foreach ($albumData['feed']['entry']['link'] as $link) {
                    if ($link['@attributes']['rel'] == 'self') {
                        $selfLink = $link['@attributes']['href'];
                    }
                }

                $albumImages[] = array(
                    'imageName' => $imageName,
                    'imageUrls' => $imageUrls,
                    'selfLink' => $selfLink,
                    'imageId' => $imageId
                );
            }
        }

        echo json_encode(array('success' => TRUE, 'albumImages' => $albumImages));
    } else {
        echo json_encode(array('success' => FALSE, 'msg' => 'SERVER ERROR'));
    }
} catch (exception $e) {
    echo json_encode(array('success' => FALSE, 'msg' => 'SERVER ERROR'));
}
?>