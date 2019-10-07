var initDatatable = function () {
    //== Private functions
    var options = {
        data: {
            source: {
                read: {
                    method: "GET",
                    url: "/profesor/notas/getsecciones".proto().parseURL()
                }
            }
        },
        columns: [
            {
                field: "course",
                title: "Curso"
            },
            {
                field: "section",
                title: "Sección"
            },
            {
                field: "term",
                title: "Periodo"
            },
            {
                field: "options",
                title: "Opciones",
                sortable: false,
                filterable: false,
                template: function (row) {
                    return '<a href="/profesor/notas/detalle/' +
                        row.sectionId +
                        '" class="btn btn-primary btn-sm m-btn m-btn--icon btn-notes" data-course="' +
                        row.courseId +
                        '" data-section="' +
                        row.sectionId +
                        '"><span><i class="la la-list"></i><span> Detalle </span></span></a>';
                }
            }
        ]
    }
    var datatable;

    return {
        // public functions
        init: function() {
            datatable = $(".m-datatable").mDatatable(options);
        }
    };
}();

jQuery(document).ready(function () {
    initDatatable.init();
});