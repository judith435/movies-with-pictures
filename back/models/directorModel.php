<?php
    error_reporting(0);
    require_once '../share/Validations.php';

    class DirectorModel implements JsonSerializable {
            
        private $director_id;
        private $director_name;

        function __construct($params, &$errorInInput) {
            $this->setDirectorID
             (array_key_exists("director_id", $params) ? $params["director_id"] : 0); 
            $this->setDirectorName($params["director_name"], $errorInInput);
        }

        public function setDirectorID($dir_id){
            $this->director_id = $dir_id;
        }

        public function setDirectorName($dir_name, &$errorInInput){
            if(!Validations::nameOK($dir_name)){
                $errorInInput .= " Director Name must contain at least one letter\n";
            }

            $this->director_name = $dir_name;
        }

        public function getDirectorID(){
            return $this->director_id;
        }

        public function getDirectorName(){
            return $this->director_name;
        }

        public function jsonSerialize() {
            return  [
                        'director_id' => $this->getDirectorID(),
                        'director_name' => $this->getDirectorName()
                    ];
        }
    }

?>
