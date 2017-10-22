'use strict'

var generalMovie = (function() {

    var app = {
        debugMode: true,   
        movieApi: 'http://localhost/joint/movies-with-pictures/back/api/api.php',
        }

     //load input fields from template        
    function LoadCU_Template()
    {
        $.ajax('../../templates/movie/create-movie-template.html').done(function(data) {
            $('#InputFields').prepend(data);

            //set text of submit button according to html file title tag
            if ($('title').text() == "Create Movie") {
                $("#btnAction").html('Create Movie');
            }
            else {
                $("#btnAction").html('Update Movie');
            }
        });
    }
    
    function LoadDirectors()
    {
        getDirectors.Get_Directors(callback_BuildDDL);
    }
    
    //fill directors combo in input fields with directors retrieved from db in function LoadDirectors()
    var callback_BuildDDL = function(directors)
    {
            //in case of create Movie put empty option "Please Select Director" as top element of combo
            if ($('title').text() == "Create Movie"){
                $("#DirectorDDL").append("<option value=''>Please Select Director</option>");
            }

            for(let i=0; i < directors.length; i++) {
                 $("#DirectorDDL").append(new Option(directors[i].director_name, directors[i].director_id));
            }
    }
     
    //submit data to server for create/update and delete movie
    function ajaxSubmit(){

        //htmlTitle way of identifying html page being processed
        var htmlTitle = $('title').text();    
        var verb = "";

        switch (htmlTitle) {
            case "Create Movie":
                verb = "POST";
                break;
            case "Update Movie":
                verb = "PUT";
                break;
            case "Delete Movie":
                verb = "DELETE";
                break;
        }

        var formData = "";
        if(htmlTitle == "Create Movie"){
            formData = new FormData();    
            var form_data = $('form').serialize();
            //because of movie image upload new FormData() must be used to send data to server and thus it can no longer be sent simply as $('form').serialize() 
            //the  individual input fields must be appeded to FormData() as key value pairs => statement below creates object from $('form').serialize() containing
            //key value pairs of input data  
            var form_data_pairs = JSON.parse('{"' + decodeURI(form_data.replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}')
            for (var key in form_data_pairs) {
                if (form_data_pairs.hasOwnProperty(key)) {
                //  console.log(key + " -> " + form_data_pairs[key]);
                    formData.append(key, form_data_pairs[key]);
                }
            }
            
            //movie image upload only exists in create/update movie
            if($("#movieImage").val()){ //movie image was selected
                var file_data = $('#movieImage').prop('files')[0]; 
                formData.append('movie_image', file_data);
            }        
        }
        else { //delete/update movie - movie image upload only works for create but not yet for update
            formData = $('form').serialize();
        }
    
        $.ajax({
            type: verb,
            url:  app.movieApi,
            data: formData,
            //mimeType:"multipart/form-data",
            contentType: false,
            //cache: false,
            processData: false,

            success: function(data){
                if (app.debugMode) {
                    console.log("movieApi response");
                    console.log(data);
                }
                data = JSON.parse(data);
                // data.message conatains CUD confirmation if successful or application errors => e.g. missing product if not
                alert(data.message); 
                if (data.status == 'error') { return;}

                //if action was delete or update show updated movies table
                if (data.action == "Update movie" || data.action == "Delete movie" ){ 
                    showMovies.showMovies()
                }

                //if action was update hide input fields to update movie
                if (data.action == "Update movie") {
                    $("#movieTitle, #InputFields").hide();
                }
            },
            // systen errors caused by a bad connection, timeout, invalid url  
            error:function(data){
                alert(data); //===Show Error Message====
                }
        });

    }

    //ajaxSubmit is called from submitHandler:  in validator = $("#frmCU").validate({ from validations.js file
    return {
        ajaxSubmit: ajaxSubmit, 
        LoadCU_Template: LoadCU_Template,
        LoadDirectors : LoadDirectors
    }
})();

