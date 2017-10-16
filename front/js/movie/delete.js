'use strict'

jQuery(document).ready(function() {
    $("#navigation-bar").load("../../templates/navigation-template.html");

    //build movies table
    showMovies.showMovies();

    //define function to handle row click (delete event)
    $(document).on('click','#MoviesTable tr',function(e){
        delete_Movie($(this));
    })

});

function delete_Movie(row)
{
    var movieID = row.find('td:first').text(); //movie id is in first column of table
    var confirmation = confirm('Are you sure you want to delete movie number ' + movieID + "?");
    if (confirmation == true) {
        //put movie id in hidden field in html so that it can be passed to server when form is 
        //serialized in generalMovie.ajaxSubmit()  
        $('#movieID').val(movieID);
        generalMovie.ajaxSubmit();
    } 
}

