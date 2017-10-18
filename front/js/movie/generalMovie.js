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

        // var img =  $('#movieImage').val();
        // var form = $('form').serialize();
        // ajaxData = form + '&movie_image=' + encodeURIComponent(img);
        // var lala = 9;
        // if (app.debugMode) {
        //     console.log(ajaxData);
        // }
        // $(function() {            
        //     $('#fileUploadForm').ajaxForm({                 
        //       beforeSubmit: ShowRequest,
        //       success: SubmitSuccesful,
        //       error: AjaxError                               
        //     });                                    
        //   });  
//$('#frmCU').ajaxForm({ 
        // form.ajaxForm({
        //     data: { data: fd }, 
        //     type: verb,
        //     url:app.movieApi,
        //     beforeSubmit:function() { 
        //         var queryString = $.param(formData);
        //         alert('BeforeSend method: \n\nAbout to submit: \n\n' + queryString);
        //         return true;
        //           } ,
        //     beforeSend: function(e) {},
        //     uploadProgress: function(event, position, total, percentComplete) {},
        //     complete: function(data) {}
        //   });

        //var formData = new FormData(this);
       // var formData = $('form').serialize();
        var form_data = $('form').serialize();
        var file_data = $('#movieImage').prop('files')[0]; 
        var formData = new FormData();    
        formData.append('movie_image', file_data);
        //formData.append('frmData', formi);
        //"movie_name=gagagag&director_id=13&ctrl=movie&duplicate_movie="
        // formData.append('movie_name', "gagagag");
        // formData.append('director_id', "13");
        // formData.append('ctrl', "movie");
        // formData.append('duplicate_movie', "");
        var form_data_pairs = JSON.parse('{"' + decodeURI(form_data.replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}')
        for (var key in form_data_pairs) {
            if (form_data_pairs.hasOwnProperty(key)) {
              //  console.log(key + " -> " + form_data_pairs[key]);
                formData.append(key, form_data_pairs[key]);
            }
        }
        var hook = 6;  
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

