'use strict' //problem of double checking happens from 2nd check onwards

$(document).ready(function () {
  
  var app = {
    debugMode: true,   
    movieApi: 'http://localhost/joint/movies-with-pictures/back/api/api.php',
    }

  var validator = $("#frmCU").validate({
    onkeyup: false,
    onfocusout: false,
    rules:  {
      movie_name: {
        required: true,
        normalizer: function(value) {
          return $.trim(value);
        } 
      },
      director_id: {
        required: true
      },
      duplicate_movie: {  
          movie_already_exists: true
      },
    },
    messages: {
        movie_name: "No movie name specified",
        director_id: "No director selected",
        duplicate_movie: "Movie with same name and director already exists",
        director_name: "No director name specified",
    },
    submitHandler: function() {
          console.log("submitHandler  response " + response);
          generalMovie.ajaxSubmit();
      }
  });

  var response;
  $.validator.addMethod(
      "movie_already_exists", 
      function() {
        var movieName = $('#movieName').val().trim();
        var directorID = $('#DirectorDDL').val().trim();
        
        if (movieName == "" || directorID == "") {
          return true; //if either movie name of director missing no point in checking
        }
        console.log("()()()()()()()()()()() in $.validator.addMethod movie_already_exists action button value " + $('#btnAction').text()); 
        
        //update movie: no change made to data retrieved from db return relevant message to user
        if ($('#btnAction').text() == "Update Movie") {

          if (app.debugMode){
            console.log("movie_already_exists() movieName from update: " + updateMovie.movieUpdated.movieName);
            console.log("movie_already_exists() directorID  from update: " + updateMovie.movieUpdated.directorID);
          }
          //updateMovie.movieUpdated contains movie name and director id of of movie before any updates 
          //were made => updateMovie.movieUpdated was set in update.js when movie selected for update 
          if (movieName == updateMovie.movieUpdated.movieName && 
              directorID == updateMovie.movieUpdated.directorID ){
                validator.settings.messages.duplicate_movie = 'No change in data - No update';
                return false; 
          }
          else {
            validator.settings.messages.duplicate_movie = 'Movie with same name and director already exists';
          }

        }

        var ajaxData = {
            ctrl: 'movie',
            movie_name: movieName,
            director_id: directorID
        }; 

        if (app.debugMode){
            console.log("validations >>>  ajaxData.movie_name  " + ajaxData.movie_name);
            console.log("validations >>>  ajaxData.director_id " + ajaxData.director_id);
        }  
        $.ajax({
                  type: 'GET',
                  url: app.movieApi,
                  async: false,
                  data: ajaxData
              })
              .done(function(data)
                {
                  var movie = JSON.parse(data);
                  //-1 means movie was not found
                  response = ( movie.id == -1 ) ?  true : false;
                  if(app.debugMode){
                    console.log(".done  response " + response);
                    console.log(".done  data " + data);
                    console.log(".done  movie.id " + movie.id);
                  }
                })
              .fail(function(data){
                console.log(".fail >>>  data  " + data);
                response = true;
              })
              return response;
        });
      });
