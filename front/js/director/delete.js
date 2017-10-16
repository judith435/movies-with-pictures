'use strict'

jQuery(document).ready(function() {

    $("#navigation-bar").load("../../templates/navigation-template.html");
    //build directors table
    getDirectors.Get_Directors(getDirectors.callback_Build_Directors_Table);

    //define function to handle row click (delete event)
    $(document).on('click','#DirectorsTable tr',function(e){
        delete_Director($(this));
    })

});

function delete_Director(row)
{
    var directorID = row.find('td:first').text();//director id is in first column of table
    var confirmation = confirm('Are you sure you want to delete director number ' + directorID + "?");
    if (confirmation == true) {
         //put director id in hidden field in html so that it can be passed to server when form is 
         //serialized in generalDirector.ajaxSubmit()  
        $('#directorID').val(directorID);
        generalDirector.ajaxSubmit();
    } 
}

