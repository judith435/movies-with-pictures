'use strict'

jQuery(document).ready(function() {

    $("#navigation-bar").load("../../templates/navigation-template.html");
    generalMovie.LoadCU_Template(); //load input fields from template
    generalMovie.LoadDirectors();  //fill directors combo in input fields
})
