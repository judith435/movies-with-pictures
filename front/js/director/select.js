jQuery(document).ready(function() {
    
        $("#navigation-bar").load("../../templates/navigation-template.html");
        //build directors table
        getDirectors.Get_Directors(getDirectors.callback_Build_Directors_Table);
    });
