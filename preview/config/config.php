<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



$config['branch_key'] = getenv('BRANCH_KEY'); 
$config['mode'] = getenv('MODE'); 
$config['branchio_api_endpoint'] = getenv('BRANCHIO_API_ENDPOINT'); 
$urls['share_preview_url'] = getenv('SHARE_PREVIEW_URL'); 
$urls['send_link_url'] = getenv('SEND_LINK_URL');
$config['googlePlayId'] = getenv('GOOGLE_PLAY_ID'); 
$config['appleStoreId'] = getenv('APPLE_STORE_ID'); 


$config['send_link_text']=getenv('SEND_LINK_TEXT');
$config['email_place_holder']=getenv('EMAIL_PLACE_HOLDER');
$config['last_page_text1']=getenv('LAST_PAGE_TEXT1');
$config['last_page_text2']=getenv('LAST_PAGE_TEXT2');
$config['email_validation1']=getenv('EMAIL_VALIDATION1');
$config['email_validation2']=getenv('EMAIL_VALIDATION2');
$config['page_title']=getenv('PAGE_TITLE');
$config['partner_code']=getenv('PARTNER_CODE');
$config['partner_name']=getenv('PARTNER_NAME');


?>