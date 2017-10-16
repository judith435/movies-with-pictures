<?php
    error_reporting(0);

    require_once '../share/Validations.php';
    
    class MovieModel implements JsonSerializable {

        private $id;
        private $name;
        private $director_id;
        private $director_name;

        function __construct($params, &$errorInInput) {
            $this->setID
                (array_key_exists("movie_id", $params) ? $params["movie_id"] : 0); 
            $this->setName($params["movie_name"], $errorInInput);
            $this->setDirector_ID($params["director_id"], $errorInInput); 
            $this->setDirector_Name
                (array_key_exists("director_name", $params) ? $params["director_name"] : ""); 
        }  

        public function setID($mv_id){
            $this->id = $mv_id;
        }

        public function setName($mv_name, &$errorInInput){
            if(!Validations::nameOK($mv_name)){
                $errorInInput .= " Movie Name must contain at least one letter\n";
            }
            $this->name = $mv_name;
        }

        public function setDirector_ID($director_id, &$errorInInput){
            if(!Validations::optionSelected($director_id)){
                $errorInInput .= " Please select director\n";
            }
            $this->director_id = $director_id;
        }

        public function setDirector_Name($director_name){
            $this->director_name = $director_name;
        }

        public function getID(){
            return $this->id;
        }

        public function getName(){
            return $this->name;
        }

        public function getDirector_ID(){
            return $this->director_id;
        }

        public function getDirector_Name(){
            return $this->director_name;
        }

        public function jsonSerialize() {
            return  [
                        'id' => $this->getID(),
                        'name' => $this->getName(),
                        'director_id' => $this->getDirector_ID(),
                        'director_name' => $this->getDirector_Name()
                    ];
        }
    }

?>
