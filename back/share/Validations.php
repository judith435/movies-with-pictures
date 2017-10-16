<?php

    class Validations { 


        public static function nameOK($name) {
            if (!preg_match("/[a-z]/i",$name)) //name must contain at least one letter
            {
                return false;
            }
            
            return true;
        }

        public static function optionSelected($option) {
            if ($option == "")
            {
                return false;
            }
            return true;
        }
    }
?>