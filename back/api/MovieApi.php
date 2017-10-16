<?php
    require_once 'abstract-api.php';
    require_once '../controllers/movieController.php';

    class MovieApi extends Api{

        function Read($params) {
            $mc = new MovieController;

            if (array_key_exists("movie_name", $params) && array_key_exists("director_id", $params)) {
                return  $mc->getMovieByNameDirector($params); //used to check if movie by same name & director already exists in remote js validations
            }
            else {
                return $mc->getAll_Movies();
            }
        }

        function Create($params) {
            return $this->create_update($params, "Create");  
        }

        function Update($params) {
            return $this->create_update($params, "Update");  
        }

         function Delete($params) {

            $mc = new MovieController;
            $mc->delete_Movie($params);
            $response_array['status'] = 'ok'; 
            $response_array['action'] = 'Delete movie';
            $response_array['message'] = 'movie deleted successfully'; 
            return $response_array;
        }

        function create_update($params, $function) {

            //used to return the following kind of errors to client: errors in input data, creating movie that already exists etc. 
            $applicationError = ""; 
            $mc = new MovieController;
            $mc->create_update_Movie($params, $function, $applicationError);

            if ($applicationError != "") {
                $response_array['status'] = 'error';  
                $response_array['action'] = $function . ' movie';
                $response_array['message'] =  $applicationError; 
            }
            else {
                $response_array['status'] = 'ok'; 
                $response_array['action'] = $function . ' movie';
                $response_array['message'] = 'movie ' . ($function == "Create" ? 'added' : 'updated') . ' successfully'; 
            }

            return $response_array;
        }
            


    }
?>