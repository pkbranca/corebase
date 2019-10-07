var ForumTable = function () {
    var datatable;

    var options = {
        data: {
            source: {
                read: {
                    method: "GET",
                    url: "/admin/foros/get".proto().parseURL()
                }
            }
        },
        columns: [
            {
                field: "name",
                title: "Nombre"
            },
            {
                field: "description",
                title: "Descripción"
            },
            {
                field: "state",
                title: "Estado",
                template: function(row) {
                    return '<span class="m-badge m-badge--success m-badge--wide">Activo</span>';
                }
            },
            {
                field: "options",
                title: "Opciones",
                sortable: false,
                filterable: false,
                template: function (row) {
                    return '<button data-id="' + row.id + '" class="btn btn-secondary btn-sm m-btn m-btn--icon"><span><i class="la la-edit"></i><span> Editar </span></span></a>';
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
    ForumTable.init();
});