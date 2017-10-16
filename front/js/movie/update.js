'use strict'
var updateMovie = (function() {

    var movieUpdated = {};

    jQuery(document).ready(function() {

        $("#navigation-bar").load("../../templates/navigation-template.html");

        showMovies.showMovies();         //build movies table
        
        generalMovie.LoadCU_Template(); //load input fields from template
        generalMovie.LoadDirectors(); //fill directors combo in input fields

        $("#movieTitle, #InputFields").hide(); //hide update fields on first load
        
        //define function to handle row click (update event)
        $(document).on('click','#MoviesTable tr',function(e){
            update_Movie($(this));
        })

    });

    function update_Movie(row)
    {
        var movieID = row.find('td:first').text(); //get movie id from 1st column

        //array  movieUpdated used for module export (module pattern) of info of movie being updated
        movieUpdated.movieName = row.find('td:nth-child(2)').text();
        movieUpdated.directorID = row.find('td:nth-child(3)').text();

        var directorName = row.find('td:nth-child(4)').text();

        var mo = MovieObject();
        var movie = new mo.Movie(movieID, movieUpdated.movieName, movieUpdated.directorID, directorName)

        //put movie id in hidden field in html so that it can be passed to server when form is 
        //serialized in generalMovie.ajaxSubmit()  
        $('#movieID').val(movie.movie_id);

        //place movie name and director of movie being updated in input field
        $('#movieName').val(movie.movie_name);
        $("#DirectorDDL").val(movie.director_id);

        //set update info
        $("#movieTitle").text("Movie# being updated: " + movie.movie_id).show();
        $("#InputFields").show();
        $("#btnAction").html('Update Movie');
        $("#duplicate_movie-error").text(""); //reset any prevous validator errors when new movie selected for update
    }

    return {
        movieUpdated: movieUpdated
    }
})();

