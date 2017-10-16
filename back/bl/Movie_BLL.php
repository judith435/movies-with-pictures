<?php
    error_reporting(0);

    require_once 'BusinessLogicLayer.php';
    
    class Movie_BLL  extends BusinessLogicLayer{

        function __construct() {
            parent::__construct('movie_project');
        }

        public function get_movies() {
            $emptyParms = []; 
            return parent::get($this->get_dbName(), 'get_movies', $emptyParms);
        }

        public function insert_update_movie($params, $method,  &$applicationError) {
            $spParms =  array();
            array_push($spParms, new PDO_Parm("movie_name", $params["movie_name"], 'string')); 
            array_push($spParms, new PDO_Parm("director_id", $params["director_id"], 'integer'));
            $resultSet = parent::get($this->get_dbName(), 'check_movie_exists', $spParms);
            if ($resultSet->rowCount() > 0) { // movie with same name & director already exists
                $movie = $resultSet->fetch();
                $applicationError =  "movie with same name & director already exists - movie #" . $movie["id"];
                return;
            }
            if ($method == "Update") {  //for update must add movie_id as first parameter
                    array_unshift($spParms, new PDO_Parm("movie_id", $params["movie_id"], 'integer'));
            }
            $spName = $method == "Create" ? 'insert_movie' : 'update_movie';
            parent::update($this->get_dbName(), $spName, $spParms);
        }

        public function check_movie_exists($params) {
            $spParms =  array();
            array_push($spParms, new PDO_Parm("movie_name", $params["movie_name"], 'string')); 
            array_push($spParms, new PDO_Parm("director_id", $params["director_id"], 'integer'));
            $resultSet = parent::get($this->get_dbName(), 'check_movie_exists', $spParms);
            return $resultSet->fetch();
        }

        public function delete_movie($params) {
            $spParms =  array();
            array_push($spParms, new PDO_Parm("movie_id", $params["movie_id"], 'integer'));
            return parent::get($this->get_dbName(), 'delete_movie', $spParms);
        }
    }
    
?>
