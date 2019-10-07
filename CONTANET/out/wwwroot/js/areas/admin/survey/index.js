var SurveyTable = function () {
    var datatable;
    var options = {
        data: {
            source: {
                read: {
                    method: "GET",
                    url: "/admin/encuestas/get".proto().parseURL()
                }
            }
        },
        columns: [
            {
                field: "code",
                title: "Código"
            },
            {
                field: "name",
                title: "Nombre"
            },
            {
                field: "publicationdate",
                title: "Fecha Publicación"
            },
            {
                field: "finishdate",
                title: "Fecha Finalización"
            },
            {
                field: "options",
                title: "Opciones",
                sortable: false,
                filterable: false,
                template: function (row) {
                    return '<a href="' + ("/admin/encuestas/editar/" + row.id).proto().parseURL() + '" class="btn btn-secondary btn-sm m-btn m-btn--icon"><span><i class="la la-edit"></i><span> Detalle </span></span></a>';
                }
            }
        ]
    }

    return {
        init: function () {
            datatable = $(".m-datatable").mDatatable(options);
        },
        reloadTable: function () {
            datatable.reload();
        }
    }
}();

jQuery(document).ready(function () {
    SurveyTable.init();

    $("#publicationDate").datepicker();
    $("#endDate").datepicker();
});