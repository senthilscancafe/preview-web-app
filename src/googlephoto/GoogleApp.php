<?php

class GoogleApp {

    private $accessToken;
    private $refreshToken;
    private $userAlbumUrl;
    private $userAlbumFeedUrl;
    private $googleClientObject;
    private $albumPaginatedUrls;

    public function __construct($accessToken, $refreshToken) {

        $this->accessToken = $accessToken;
        $this->refreshToken = urldecode($refreshToken);
        $this->userAlbumUrl = 'https://picasaweb.google.com/data/feed/api/user/default';
        $this->tokenUrl = 'https://accounts.google.com/o/oauth2/token';
        $this->googleClientObject = authGetObject();
        $this->albumPaginatedUrls = array();
    }

    public function getRequestData($requestUrl = '') {
        $curl = curl_init($requestUrl);
        curl_setopt_array($curl, array(
            CURLOPT_HTTPHEADER => array(
                'GData-Version: 2',
                'Authorization: Bearer ' . $this->accessToken
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
            $responseData = XML2Array::createArray($curlResult);
            return $responseData;
        } else {
            return $curlHttpCode;
        }
    }

    public function refreshAccessToken() {
        try {
            $this->googleClientObject->refreshToken($this->refreshToken);
            $accessTokenDetailsArr = (array) json_decode($this->googleClientObject->getAccessToken());
            setcookie('gAccessToken', $accessTokenDetailsArr['access_token'], time() + (24 * 60 * 60 * 1000), "/");
            $this->accessToken = $accessTokenDetailsArr['access_token'];
            return TRUE;
        } catch (Exception $e) {
            return FALSE;
        }
    }

    public function getAlbums() {

        $returnData = $this->getRequestData($this->userAlbumUrl);
        if (is_array($returnData)) {
            $albumData = array();
            if ($this->isAssoc($returnData['feed']['entry'])) {
                $val = $returnData['feed']['entry'];
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
                foreach ($returnData['feed']['entry'] as $val) {
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
            if ($returnData == 403) {
                if ($this->refreshAccessToken()) {
                    $this->getAlbums();
                } else {
                    echo json_encode(array('success' => FALSE, 'ERROR' => "Oops, something went wrong, try again"));
                }
            } else {
                echo json_encode(array('success' => FALSE, 'ERROR' => "Oops, something went wrong, try again"));
            }
        }
    }

//    public function getAlbumPhotos($albumFeedUrl = '') {
//
//        $this->userAlbumFeedUrl = $albumFeedUrl;
//
//        $returnData = $this->getRequestData($albumFeedUrl);
//        $albumPhotosData = $returnData;
//        $albumImages = array();
//        if (is_array($albumPhotosData)) {
//            if (isset($albumPhotosData['feed']['entry'][0])) {
//                foreach ($albumPhotosData['feed']['entry'] as $val_1) {
//                    $imageName = $val_1['title'];
//                    $imageId = $val_1['gphoto:id'];
//                    $imageUrls = array();
//
//                    //Check For Image Or Video
//                    $image = true;
//                    if (isset($val_1['media:group']['media:content'][0])) {
//                        foreach ($val_1['media:group']['media:content'] as $node) {
//                            if ($node['@attributes']['medium'] == 'video') {
//                                $image = false;
//                            }
//                        }
//                    }
//
//                    if ($image) {                        
//                        $imageType = 0;
//                        if(in_array($val_1['content']['@attributes']['type'], array('image/jpeg','image/jpg','image/png'))){
//                            $imageType = 1;
//                        }
//                        
//                        //original image url adding to list of images //// IMPORTANT /////
//                        if (isset($val_1['media:group']['media:content']['@attributes'])) {
//                            $imageUrls[] = $val_1['media:group']['media:content']['@attributes']['url'];
//                        }
//
//                        foreach ($val_1['media:group']['media:thumbnail'] as $img) {
//                            $imageUrls[] = $img['@attributes']['url'];
//                        }
//
//                        $selfLink = '';
//
//                        foreach ($val_1['link'] as $link) {
//                            if ($link['@attributes']['rel'] == 'self') {
//                                $selfLink = $link['@attributes']['href'];
//                            }
//                        }
//
//                        $albumImages[] = array(
//                            'imageName' => $imageName,
//                            'imageUrls' => $imageUrls,
//                            'selfLink' => $selfLink,
//                            'imageId' => $imageId,
//                            'imageType' => $imageType
//                        );
//                    }
//                }
//            } else {
//                if (isset($albumPhotosData['feed']['entry'])) {
//                    $imageName = $albumPhotosData['feed']['entry']['title'];
//                    $imageId = $albumPhotosData['feed']['entry']['gphoto:id'];
//                    $imageUrls = array();
//
//                    //Check For Image Or Video
//                    $image = true;
//                    if (isset($albumPhotosData['feed']['entry']['media:group']['media:content'][0])) {
//                        foreach ($albumPhotosData['feed']['entry']['media:group']['media:content'] as $node) {
//                            if ($node['@attributes']['medium'] == 'video') {
//                                $image = false;
//                            }
//                        }
//                    }
//
//                    if ($image) {
//                        
//                        $imageType = 0;
//                        if(in_array($albumPhotosData['feed']['entry']['content']['@attributes']['type'], array('image/jpeg','image/jpg','image/png'))){
//                            $imageType = 1;
//                        }
//                        
//                        //original image url adding to list of images //// IMPORTANT /////
//                        $imageUrls[] = $albumPhotosData['feed']['entry']['media:group']['media:content']['@attributes']['url'];
//                        foreach ($albumPhotosData['feed']['entry']['media:group']['media:thumbnail'] as $img) {
//                            $imageUrls[] = $img['@attributes']['url'];
//                        }
//
//                        $selfLink = '';
//
//                        foreach ($albumPhotosData['feed']['entry']['link'] as $link) {
//                            if ($link['@attributes']['rel'] == 'self') {
//                                $selfLink = $link['@attributes']['href'];
//                            }
//                        }
//
//                        $albumImages[] = array(
//                            'imageName' => $imageName,
//                            'imageUrls' => $imageUrls,
//                            'selfLink' => $selfLink,
//                            'imageId' => $imageId,
//                            'imageType' => $imageType
//                        );
//                    }
//                }
//            }
//
//            echo json_encode(array('success' => TRUE, 'albumImages' => $albumImages));
//        } else {
//            if ($returnData == 403) {
//                if ($this->refreshAccessToken()) {
//                    $this->getAlbumPhotos($this->userAlbumFeedUrl);
//                } else {
//                    echo json_encode(array('success' => FALSE, 'ERROR' => "Oops, something went wrong, try again"));
//                }
//            } else {
//                echo json_encode(array('success' => FALSE, 'ERROR' => "Oops, something went wrong, try again"));
//            }
//        }
//    }
    
    public function getAlbumPhotos($albumFeedUrl = '', $albumPhotosCount = 0, $startIndex = 1){

        $this->userAlbumFeedUrl = $albumFeedUrl;

        $returnData = $this->getRequestData($albumFeedUrl);
        $albumImages = array();
        $error = false;
        
        //Form Pagination Links For The Album Photos
        while($albumPhotosCount >= 1000){
                $requestDataUrl = $albumFeedUrl.'&start-index='.$startIndex.'&max-results=1000';
                $this->albumPaginatedUrls[] = $requestDataUrl;
                $startIndex = $startIndex + 1000;
                $albumPhotosCount = $albumPhotosCount - 1000;
        }

        if($albumPhotosCount != 0){
            $requestDataUrl = $albumFeedUrl.'&start-index='.$startIndex.'&max-results=1000';
            $this->albumPaginatedUrls[] = $requestDataUrl;
        }

        foreach($this->albumPaginatedUrls as $albumPhotosPageUrl){
            
            $returnData = $this->getRequestData($albumPhotosPageUrl);
            if(!is_array($returnData)){
                $error = true;
                break;
            }
            
            $albumPhotosData = $returnData;

            if (isset($albumPhotosData['feed']['entry'][0])) {
                foreach ($albumPhotosData['feed']['entry'] as $val_1) {

                    $imageName = $val_1['title'];
                    $imageId = $val_1['gphoto:id'];
                    $imageUrls = array();

                    //original image url adding to list of images //// IMPORTANT /////
                    $image = true;
                    if(isset($val_1['media:group']['media:content'][0])){
                        foreach ($val_1['media:group']['media:content'] as $node){
                            if($node['@attributes']['medium'] == 'video'){
                                $image = false;
                            }
                        }
                    }

                    if($image){
                        $imageType = 0;
                        if(in_array($val_1['content']['@attributes']['type'], array('image/jpeg','image/png'))){
                            $imageType = 1;
                        }

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
                            'imageId' => $imageId,
                            'imageType' => $imageType
                        );
                    }
                }
            } else {
                if (isset($albumPhotosData['feed']['entry'])) {
                    $imageName = $albumPhotosData['feed']['entry']['title'];
                    $imageId = $albumPhotosData['feed']['entry']['gphoto:id'];
                    $imageUrls = array();

                    $image = true;
                    if(isset($albumPhotosData['feed']['entry']['media:group']['media:content'][0])){
                        foreach ($albumPhotosData['feed']['entry']['media:group']['media:content'] as $node){
                            if($node['@attributes']['medium'] == 'video'){
                                $image = false;
                            }
                        }
                    }

                    if($image){

                        $imageType = 0;
                        if(in_array($albumPhotosData['feed']['entry']['content']['@attributes']['type'], array('image/jpeg','image/png'))){
                            $imageType = 1;
                        }

                        //original image url adding to list of images //// IMPORTANT /////
                        $imageUrls[] = $albumPhotosData['feed']['entry']['media:group']['media:content']['@attributes']['url'];
                        foreach ($albumPhotosData['feed']['entry']['media:group']['media:thumbnail'] as $img) {
                            $imageUrls[] = $img['@attributes']['url'];
                        }

                        $selfLink = '';

                        foreach ($albumPhotosData['feed']['entry']['link'] as $link) {
                            if ($link['@attributes']['rel'] == 'self') {
                                $selfLink = $link['@attributes']['href'];
                            }
                        }

                        $albumImages[] = array(
                            'imageName' => $imageName,
                            'imageUrls' => $imageUrls,
                            'selfLink' => $selfLink,
                            'imageId' => $imageId,
                            'imageType' => $imageType
                        );
                    }
                }
            }
        }

        if($error){
            echo json_encode(array('success' => FALSE, 'ERROR' => "Oops, something went wrong, try again"));
        }else{
            echo json_encode(array('success' => TRUE, 'albumImages' => $albumImages));
        }
    }

    public function isAssoc($arr) {
        return array_keys($arr) !== range(0, count($arr) - 1);
    }
    
}

?>
