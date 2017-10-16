<?php
    require_once 'MovieApi.php';
    require_once 'DirectorApi.php';
    require_once '../share/ErrorHandling.php';
    
    //define error handling for site
    set_exception_handler('exception_handler');
    function exception_handler($exception) {
        ErrorHandling::HandleError($exception); 
    }
      
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