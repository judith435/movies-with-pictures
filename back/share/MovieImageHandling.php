<?php

    require_once 'ErrorHandling.php';

    //constants containing image folder and image file names - I place them in this file although they are global they are only relevant in connection to MovieImageHandling
    define("UPLOAD_FOLDER", "uploads");
    define("IMAGE_NAME", "image_for_movie_id_");

    class MovieImageHandling { 

        public function save_uploaded_movie_image($method, $movieID, &$movieUploadError) {   
            
            if (isset($_FILES["movie_image"])) {
                $this->check_movie_image($movieUploadError);
                if ($movieUploadError == ""){   // $movieImageNotOK == "" means no errors were found
                    $target_dir = "\\" . UPLOAD_FOLDER . "\\";
                    $extension = strtolower( pathinfo($_FILES["movie_image"]["name"], PATHINFO_EXTENSION));
                    $target_file =  $GLOBALS['siteRoot'] . $target_dir . IMAGE_NAME . $movieID . "." . $extension;  
                    $moved = move_uploaded_file($_FILES["movie_image"]["tmp_name"], $target_file);
                    if (!$moved){
                        $movieUploadError = "\n error uploading image - contanct support center"; //client gets general message  
                        ErrorHandling::LogFileUploadError($_FILES["movie_image"]["error"]); //write exact error to error log - But don't send it to client 
                    }
                }
            }
        }

        public function check_movie_image(&$movieUploadError) {   

            $imageFileType = pathinfo($_FILES["movie_image"]["name"], PATHINFO_EXTENSION);
            if (strtolower($imageFileType) != "jpg" && 
                strtolower($imageFileType) != "png" && 
                strtolower($imageFileType) != "jpeg" && 
                strtolower($imageFileType) != "gif" ) {
                $movieUploadError = htmlspecialchars("\n only jpg, jpeg, png & gif files are allowed");
            }

            if ($_FILES["movie_image"]["size"] > 5000000) {  
                $movieUploadError .= "\n file size (" . $_FILES["movie_image"]["size"] . ") is too large - max file size allowed : 5'000'000 bytes" ;
            }
        }

        public function delete_movie_image($movieID) {

            $glob_pattern = $GLOBALS['siteRoot'] . "\\" . UPLOAD_FOLDER. "\\/" . IMAGE_NAME . $movieID . ".{jpg,gif,png,jpeg}";
            $image = glob($glob_pattern, GLOB_BRACE);
            if (!empty($image)) {
                $unlink_successful =  unlink($image[0]);
                if (!$unlink_successful) { //if deleteing image failed write to error log BUT don't return error to client
                    ErrorHandling::LogFileUploadError("unlink of movie image for movie id " . $movieID . " failed"); 
                }
            }
        }            
            
    }
?>