<?php
    error_reporting(0);

    require_once 'BusinessLogicLayer.php';
    
    class Director_BLL  extends BusinessLogicLayer{

        function __construct() {
            parent::__construct('movie_project');
        }
    
        public function get_directors() {
            $emptyParms = []; 
            return parent::get($this->get_dbName(), 'get_directors', $emptyParms);
        }

        public function check_director_exists($params) {
            $spParms =  array();
            array_push($spParms, new PDO_Parm("director_name", $params["director_name"], 'string'));
            $resultSet = parent::get($this->get_dbName(), 'check_director_exists', $spParms);
            return $resultSet->fetch();
        }

        public function insert_update_director($params, $method,  &$applicationError) {
            $spParms =  array();
            array_push($spParms, new PDO_Parm("director_name", $params["director_name"], 'string')); 
            $resultSet = parent::get($this->get_dbName(), 'check_director_exists', $spParms);
            if ($resultSet->rowCount() > 0) { // director_name with same name already exists
                $director = $resultSet->fetch();
                $applicationError =  "director with same name already exists - director #" . $director["id"];
                return;
            }
            if ($method == "Update") { //for update must add director_id as first parameter
              array_unshift($spParms, new PDO_Parm("director_id", $params["director_id"], 'integer'));
            }
            $spName = $method == "Create" ? 'insert_director' : 'update_director';
            parent::update($this->get_dbName(), $spName, $spParms);
        }

        public function delete_Director($params, &$applicationError) {
            $spParms =  array();
            array_push($spParms, new PDO_Parm("director_id", $params["director_id"], 'integer'));
            //delete director will fail if there are movies with given director (violation of FK constraint)
            //try catch will catch this error and send message back to client for all other pdo exception 
            //regular php error handling occurs => ErrorHandling::HandleError writing to error log
            try { 
                return parent::get($this->get_dbName(), 'delete_director', $spParms);
            } 
            catch (PDOException $e) { 
                if ($e->getCode() == '23000') { 
                    $applicationError = "cannot delete director - there are movies defined with this director"; 
                }
                else {
                    throw $e;
                }
            }
        }


    }
    
?>

