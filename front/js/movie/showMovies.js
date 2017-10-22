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
                    moviesArray.push(new mo.Movie(data[i].movie_id, 
                                                  data[i].movie_name,
                                                  data[i].director_id,
                                                  data[i].director_name
                                            ));
                }      
                $.ajax('../../templates/movie/movie-template.html').done(function(data) {
                    $("#movies").html("");
                    //after loading movies table row template append data from 1 movie object to each row
                    var movie_link = "http://localhost/joint/movies-with-pictures/back/uploads/image_for_movie_id_"
                    for(let i=0; i < moviesArray.length; i++) {
                        let template = data;
                        template = template.replace("{{movie_id}}", moviesArray[i].movie_id);
                        template = template.replace("{{movie_name}}", moviesArray[i].movie_name);
                        template = template.replace("{{director_id}}", moviesArray[i].director_id);
                        template = template.replace("{{director_name}}", moviesArray[i].director_name);
                        $('#movies').append(template);
                        $.ajax({
                            type: 'HEAD',
                            url: 'http://localhost/joint/movies-with-pictures/back/uploads/image_for_movie_id_' 
                                    +  moviesArray[i].movie_id +'.jpg',
                            success: function() {  
                               var movieID =  moviesArray[i].movie_id;
                               var movieTitleMV = "Movie ID: " + moviesArray[i].movie_id + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Movie Name: " + moviesArray[i].movie_name;
                               var movieTitleDIR = "Director ID: " + moviesArray[i].director_id + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Director Name: " + moviesArray[i].director_name;
                               var link_button =  '<a id="linkMovieImage' + movieID + '" data-toggle="modal" data-target="#modalMovieImage' + movieID + '" >View Movie Image</a>';
                               var modal = '<div id="modalMovieImage' + movieID + '" class="modal fade" role="dialog">';    
                               modal +=         '<div class="modal-dialog"><div class="modal-content">'; 
                               modal +=             '<div class="modal-header">'; 
                               modal +=                 '<button type="button" class="close" data-dismiss="modal">&times;</button>'; 
                               modal +=                 '<h5 class="modal-title">' + movieTitleMV + '</h5>'; 
                               modal +=                 '<h5 class="modal-title">' + movieTitleDIR + '</h5>'; 
                               modal +=             '</div>';
                               modal +=             '<div class="modal-body">';
                               modal +=                 '<img class="img-responsive" src="' + movie_link +  movieID + '.jpg">'; 
                               modal +=             '</div>'; 
                               modal +=    '</div></div></div>';
                               $("tbody  > tr  > td.movie-image-link").eq(i).append(link_button);
                               $("tbody  > tr  > td.movie-image-link").eq(i).append(modal); 
                                },
                            error: function() {
                               // $("tbody  > tr  > td.movie-image-link").eq(i).text("no image found for movie");                     
                            }
                        });
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

