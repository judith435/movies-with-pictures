'use strict'

var showMovies = (function() {

    var app = {
        debugMode: true,   
        movieApi: 'http://localhost/joint/movies-with-pictures/back/api/api.php',
        }

    function showMovies(){
        //load movie table template
        $("#MoviesTable").load("../../templates/movie/movies-table-template.html");

        var ajaxData = {
            ctrl: 'movie'
        };

        $.ajax({    
            type: 'GET',
            url: app.movieApi,
            data: ajaxData,
            success: function(response) {
                var data = JSON.parse(response);
                if (data.status == "error"){ 
                    alert(data.message);
                    return;
                }

                //build array of movie objects with data returned from server
                var moviesArray = [];
                var mo = MovieObject();
                for (let i = 0; i < data.length; i++) {
                    moviesArray.push(new mo.Movie(data[i].id, 
                                                  data[i].name,
                                                  data[i].director_id,
                                                  data[i].director_name
                                            ));
                }      
                $.ajax('../../templates/movie/movie-template.html').done(function(data) {
                    $("#movies").html("");
                    //after loading movies table row template append data from 1 movie object to each row
                    for(let i=0; i < moviesArray.length; i++) {
                        let template = data;
                        template = template.replace("{{movie_id}}", moviesArray[i].movie_id);
                        template = template.replace("{{movie_name}}", moviesArray[i].movie_name);
                        template = template.replace("{{director_id}}", moviesArray[i].director_id);
                        template = template.replace("{{director_name}}", moviesArray[i].director_name);
                        $('#movies').append(template);
                    }
                });
        },
            // systen errors caused by a bad connection, timeout, invalid url  
            error: function(error_response){
                    if(app.debugMode){
                        console.log("movieApi error response");
                        console.log(error_response);
                    }
                    alert("error: " + error_response); //===Show Error Message====
                }
        });
    }

    return {
        showMovies: showMovies 
    }
})();

