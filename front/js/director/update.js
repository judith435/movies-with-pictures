'use strict'
var updateDirector = (function() {

    var directorUpdated = {};

    jQuery(document).ready(function() {
        $("#navigation-bar").load("../../templates/navigation-template.html");

        //build directors table
        getDirectors.Get_Directors(getDirectors.callback_Build_Directors_Table);

        generalDirector.LoadCU_Template(); //load fields to be updated from template
        
        $("#directorTitle, #InputFields").hide(); //hide update fields on first load

        //define function to handle row click (update event)
        $(document).on('click','#DirectorsTable tr',function(e){
            update_Director($(this));
        })
    });

    function update_Director(row)
    {
        var directorID = row.find('td:first').text(); //get director id from 1st column

        //array  movieUpdated used for module export (module pattern) of info of movie being updated
        directorUpdated.directorName = row.find('td:nth-child(2)').text(); //get director name from 2nd column

        var dirObj = DirectorObject();
        var director = new dirObj.Director(directorID, directorUpdated.directorName)

         //put director id in hidden field in html so that it can be passed to server when form is 
         //serialized in generalDirector.ajaxSubmit()  
        $('#directorID').val(director.director_id);

        //place director name of director being updated in input field
        $('#directorName').val(director.director_name);
        //set update info
        $("#directorTitle").text("Director# being updated: " + director.director_id).show();
        $("#InputFields").show();
        $("#btnAction").html('Update Director');
        $("#duplicate_director-error").text(""); //reset any prevous validator errors when new director selected for update
    }

    return {
        directorUpdated: directorUpdated
    }
})();

