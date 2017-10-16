'use strict'

var generalDirector = (function() {    
    var app = {
        debugMode: true,   
        movieApi: 'http://localhost/joint/movies-with-pictures/back/api/api.php',
        }

    //load input fields from template        
    function LoadCU_Template()
    {
        $.ajax('../../templates/director/create-director-template.html').done(function(data) {

            //set text of submit button according to html file title tag
            $('#InputFields').prepend(data);
            if ($('title').text() == "Create Director") {
                $("#btnAction").html('Create Director');
            }
            else {
                $("#btnAction").html('Update Director');
            }
        });
    }

    //submit data to server for create/update and delete director
    function ajaxSubmit(){
        
        //htmlTitle way of identifying html page being processed
        var htmlTitle = $('title').text();    
        var verb = "";

        switch (htmlTitle) {
            case "Create Director":
                verb = "POST";
                break;
            case "Update Director":
                verb = "PUT";
                break;
            case "Delete Director":
                verb = "DELETE";
                break;
        }
    
        var ajaxData = $('form').serialize();
        if (app.debugMode) {
            console.log(ajaxData);
        }
        $.ajax({
            type: verb,
            url:  app.movieApi,
            data:  ajaxData,
            success: function(data){
                if (app.debugMode) {
                    console.log("movieApi response");
                    console.log(data);
                }
                data = JSON.parse(data);
                // data.message conatains CUD confirmation if successful or application errors => e.g. missing director if not
                alert(data.message); 

                if (data.status == 'error') { return;}

                //if action was delete or update show updated directors table
                if (data.action == "Update director" || data.action == "Delete director" ){ 
                    getDirectors.Get_Directors(getDirectors.callback_Build_Directors_Table);
                }

                //if action was update hide input fields to update director
                if (data.action == "Update director") {
                   $("#directorTitle, #InputFields").hide();
                }
            },
            // systen errors caused by a bad connection, timeout, invalid url  
            error:function(data){
                alert(data); //===Show Error Message====
                }
        });
        
    }
        
        

    return {
        LoadCU_Template: LoadCU_Template,
        ajaxSubmit: ajaxSubmit,
    }


})();
