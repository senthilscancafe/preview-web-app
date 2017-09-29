<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//dev
$config['branch_key'] = "key_test_iigOe5ilx8SnPzVoCz0DAnapyFddgSuI";
$config['mode'] = "development";
$config['branchio_api_endpoint'] = "https://api.branch.io/v1/url";

//live
//$config['branch_key'] = "key_live_fihLn7lgEYSoUAIitE5vKjneuAdfoSx3";
//$config['mode'] = "live";
//$config['branchio_api_endpoint'] = "https://api.branch.io/v1/url";



//API end points

//dev
$urls['share_preview_url'] = "http://api.local/share/order-image-urls/";
$urls['check_valid_token_url'] = "https://apidev.photogurus.com/auth/validate-order-token/";
$urls['send_link_url'] = "https://apidev.photogurus.com/send-app-link/";
$urls['zulu_url'] = 'http://sdtdev.photogurus.com/master/index.html?orderId=';

//live
//$urls['share_preview_url'] = "https://api.photogurus.com/share/order-image-urls/";
//$urls['check_valid_token_url'] = "https://api.photogurus.com/auth/validate-order-token/";
//$urls['send_link_url'] = "https://api.photogurus.com/send-app-link/";
//$urls['zulu_url'] = 'http://sdt.photogurus.com/index.html?orderId=';

//local
//$urls['share_preview_url'] = "http://apidevlocal.photogurus.com/share/order-image-urls/";
//$urls['check_valid_token_url'] = "http://apidevlocal.photogurus.com/auth/validate-order-token/";
//$urls['send_link_url'] = "http://apidevlocal.photogurus.com/send-app-link/";

//website url
//$urls['login_url'] = "https://photogurus.com/web/#/login";
$urls['login_url'] = "https://photogurusdev.scancafe.com/web/#/login1";
//$urls['login_url'] = "http://192.168.10.2/scancafe/pg-web-app/src/#/login"; 
//$urls['login_url'] = "http://192.168.10.107/scancafe/pg-web-app/src/#/login";
