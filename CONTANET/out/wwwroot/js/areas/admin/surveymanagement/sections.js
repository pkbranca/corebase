var SurveyTable = function () {
    var datatable;
    var surveyId = $("#SurveyId").val();
    console.log(surveyId);
    var options = {
        data: {
            source: {
                read: {
                    method: "GET",
                    url: ("/admin/gestion-encuestas/getsectionsbysurvey/"+surveyId).proto().parseURL()
                }
            }
        },
        sortable: false,
        columns: [
            {
                field: "code",
                title: "Código"
            }, 
            {
                field: "teacherName",
                title: "Profesor"
            }, 
            {
                field: "options",
                title: "Opciones",
                sortable: false,
                filterable: false,
                template: function (row) {
                    return '<a href="' + ("/admin/gestion-encuestas/secciones/detalle/" + row.id+"/"+surveyId).proto().parseURL() + '" class="btn btn-secondary btn-sm m-btn m-btn--icon"><span><i class="la la-edit"></i><span> Detalle </span></span></a>' + "&nbsp;";
                       
                }
            }
        ]
    }; 

    return {
        init: function () {
            datatable = $(".m-datatable").mDatatable(options); 
             
        }
    }
}();
 
jQuery(document).ready(function () {
    SurveyTable.init(); 
});