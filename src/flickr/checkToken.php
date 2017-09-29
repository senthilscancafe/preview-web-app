<?php
session_start();
if(isset($_COOKIE["accessToken"])){
   $data = array(
    "accessToken" => $_COOKIE["accessToken"],
    "perms" => $_COOKIE["perms"],
    "nsid" => $_COOKIE["nsid"],
    "username" => $_COOKIE["username"],
    "fullname" => $_COOKIE["fullname"],
    "success" => true   
   );
   echo json_encode($data);
}else{
    $data = array(
    "success" => false   
   );
   echo json_encode($data);
}
?>
