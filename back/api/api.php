<?php
    require_once 'MovieApi.php';
    require_once 'DirectorApi.php';
    require_once '../share/ErrorHandling.php';
    
    define ('SITE_ROOT', realpath(dirname(__FILE__)));
    $siteRoot = substr(SITE_ROOT, 0, strrpos(SITE_ROOT,"\\"));
    //define error handling for site
    set_exception_handler('exception_handler');
    function exception_handler($exception) {
        ErrorHandling::HandleError($exception); 
    }
    
    $target_dir = "\\uploads\\";
    $target_file = $siteRoot . $target_dir . basename($_FILES["movie_image"]["name"]);
    $uploadOk = 1;
    $imageFileType = pathinfo($target_file, PATHINFO_EXTENSION);
    move_uploaded_file($_FILES["movie_image"]["tmp_name"], $target_file);

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

    switch ($params['ctrl']) {
        case 'movie':
            $mv_api = new MovieApi();
            $response = $mv_api->gateway($method, $params);
            echo json_encode($response);
            break;
        case 'director':
            $dir_api = new DirectorApi();
            $response = $dir_api->gateway($method, $params);
            echo json_encode($response);
            break;
    }

?>