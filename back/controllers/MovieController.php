<?php 

    require_once '../models/MovieModel.php';
    require_once '../bl/Movie_BLL.php';
    
    class MovieController {


        function getAll_Movies() {
            $movie_bll = new Movie_BLL();
            $resultSet = $movie_bll->get_movies();

            $allMovies = array();
            //$errorInInput will contain any problems found in data retrieved from db () creating MovieModel
            //object automatically validates the data - at this stage no further processing occurs with any faulty
            //db data
            $errorInInput = ""; 
            
            while ($row = $resultSet->fetch())
            {                           
                array_push($allMovies, new MovieModel([ "movie_id" => $row['movie_id'], 
                                                        "movie_name" => $row['movie_name'],
                                                        "director_id" => $row['director_id'],
                                                        "director_name" => $row['director_name']],
                                                         $errorInInput));
            }
            return $allMovies;
        }

        function create_update_Movie($params, $method, &$applicationError) {
            $Movie = new MovieModel($params, $applicationError);
            if ($applicationError != "") { //error found in data members of movie object - faulty user input
                return;
            }
            $movie_bll = new Movie_BLL();
            //insert => if movie already exists  $applicationError will contain corresponding message and movies-api.php will send apropriate message back to client 
            $movie_bll->insert_update_movie($params, $method, $applicationError);
        }

        function delete_Movie($params) {
                    $movie_bll = new Movie_BLL();
                    $movie_bll->delete_movie($params);
        }
        
        function getMovieByNameDirector($params) { //used for js remote validation
            $movie_bll = new Movie_BLL();
            $movie_id = $movie_bll->check_movie_exists($params);
            if ($movie_id == false){ //no movie found with given movie name and director ID
                $movie_id = ["id" => -1];
            }
            return $movie_id;
        }
    }

?>
