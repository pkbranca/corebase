var UserTable = function () {
    var datatable;
    var surveyId = $("#SurveyId").val();
    var sectionId = $("#SectionId").val();

    var options = {
        data: {
            type: "remote",
            source: {
                read: {
                    method: "POST",
                    url: ("/admin/gestion-encuestas/getsurveyusers/" + surveyId+"/"+sectionId).proto().parseURL()
                },
            },
            pageSize: 10,
        },
        columns: [
            {
                field: "name",
                title: "Nombre",
                width: 80
            },
            {
                field: "paternalSurname",
                title: "Apellido Paterno",
                width: 100
            },
            {
                field: "maternalSurname",
                title: "Apellido Materno",
                width: 100,
                textAlign: "center"
            },
            {
                field: "email",
                title: "Email",
                width: 200,
                textAlign: "center"
            },
            {
                field: "options",
                title: "Opciones",
                width: 100,
                template: function (row) {
                    template = "";
                    template += "<a href='/admin/gestion-encuestas/secciones/respuesta/" + row.surveyUserId + "' class='btn btn-success btn-sm m-btn--icon btn-answer btn-detail'><i class='la la-eye'></i></a>";
                    return template;
                }
            }
        ]
    }

    var events = {
        init: function () {
            $(".m-datatable").on('click', '.btn-answer', function () {
                var data = $(this).data('id');
            });
        }
    }

    return {
        init: function () {
            datatable = $(".m-datatable").mDatatable(options);
            events.init();
        }
    }
}();

jQuery(document).ready(function () {
    UserTable.init();
});