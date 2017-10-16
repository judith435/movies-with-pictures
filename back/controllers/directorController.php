<?php 
    require_once '../models/DirectorModel.php';
    require_once '../bl/Director_BLL.php';
    
    class DirectorController {

        function getAll_Directors() {
                    
            $dir_bll = new Director_BLL();
            $resultSet = $dir_bll->get_directors();

            $allDirectors = array();
            //$errorInInput will contain any problems found in data retrieved from db () creating DirectorModel
            //object automatically validates the data - at this stage no further processing occurs with any faulty
            //db data
            $errorInInput = ""; 

            while ($row = $resultSet->fetch())
            {                           
                array_push($allDirectors, new DirectorModel(["director_id" => $row['director_id'], 
                                                             "director_name" => $row['director_name']], 
                                                             $errorInInput));
            }
            return $allDirectors;
        }

        function getDirectorByName($params) { //used for js remote validation
            $director_bll = new Director_BLL();
            $director_id = $director_bll->check_director_exists($params);
            if ($director_id == false) { //no movie found with given director name
                $director_id = ["id" => -1];
            }
            return $director_id;
        }

        function create_update_Director($params, $method, &$applicationError) {
            $Director = new DirectorModel($params, $applicationError);
            if ($applicationError != "") { //error found in data members of movie object - faulty user input
                return;
            }
            $director_bll = new Director_BLL();
            //insert => if movie already exists  $applicationError will contain corresponding message and movies-api.php will send apropriate message back to client 
            $director_bll->insert_update_director($params, $method, $applicationError);
        }

        function delete_Director($params, &$applicationError) {
            $director_bll = new Director_BLL();
            $director_bll->delete_Director($params, $applicationError);
        }
    }

?>