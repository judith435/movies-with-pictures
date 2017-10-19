<?php
    
    $xhr = $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest'; 
    $target_dir = "uploads/";
    $target_file = $target_dir . basename($_FILES["posted_file"]["name"]);
    $uploadOk = 1;
    $imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
    move_uploaded_file($_FILES["posted_file"]["tmp_name"], $target_file);
    
    $method = $_SERVER['REQUEST_METHOD']; // verb
    $params = []; //contains data sent to server from client in REST protocol

    if ($method == 'GET' || $method == 'POST') {
        $params = $_REQUEST;
    }
    else //verbs DELETE & PUT
    {
        parse_str(file_get_contents("php://input"), $params);    
    }

    //trim all leading and trailing blank from parameters posted to server from client
    $params = array_map("trim", $params);

?>