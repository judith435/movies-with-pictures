<?php
    error_reporting(0);

    require_once '../share/Validations.php';
    
    class MovieModel implements JsonSerializable {

        private $movie_id;
        private $movie_name;
        private $director_id;
        private $director_name;

        function __construct($params, &$errorInInput) {
            $this->setMovieID
                (array_key_exists("movie_id", $params) ? $params["movie_id"] : 0); 
            $this->setMovieName($params["movie_name"], $errorInInput);
            $this->setDirectorID($params["director_id"], $errorInInput); 
            $this->setDirectorName
                (array_key_exists("director_name", $params) ? $params["director_name"] : ""); 
        }  

        public function setMovieID($mv_id){
            $this->movie_id = $mv_id;
        }

        public function setMovieName($mv_name, &$errorInInput){
            if(!Validations::nameOK($mv_name)){
                $errorInInput .= " Movie Name must contain at least one letter\n";
            }
            $this->movie_name = $mv_name;
        }

        public function setDirectorID($director_id, &$errorInInput){
            if(!Validations::optionSelected($director_id)){
                $errorInInput .= " Please select director\n";
            }
            $this->director_id = $director_id;
        }

        public function setDirectorName($director_name){
            $this->director_name = $director_name;
        }

        public function getMovieID(){
            return $this->movie_id;
        }

        public function getMovieName(){
            return $this->movie_name;
        }

        public function getDirectorID(){
            return $this->director_id;
        }

        public function getDirectorName(){
            return $this->director_name;
        }

        public function jsonSerialize() {
            return  [
                        'movie_id' => $this->getMovieID(),
                        'movie_name' => $this->getMovieName(),
                        'director_id' => $this->getDirectorID(),
                        'director_name' => $this->getDirectorName()
                    ];
        }
    }

?>
