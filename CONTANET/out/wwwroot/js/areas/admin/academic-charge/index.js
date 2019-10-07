var TeacherTable = function () {
    var datatable;

    var options = {
        search: {
            input: $('#search')
        },
        data: {
            type: 'remote',
            source: {
                read: {
                    method: 'GET',
                    url: ('/admin/academiccharge/get').proto().parseURL(),
                },
            },
            pageSize: 10,
            saveState: {
                cookie: true,
                webstorage: true
            }
        },
        layout: {
            theme: 'default', // datatable theme
            class: '', // custom wrapper class
            scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
            footer: false // display/hide footer
        },
        // column sorting
        sortable: true,
        pagination: true,
        toolbar: {
            // toolbar items
            items: {
                // pagination
                pagination: {
                    // page size select
                    pageSizeSelect: [10, 20, 30, 50, 100],
                },
                info: false
            }
        },
        columns: [
            {
                field: 'fullname',
                title: 'Nombre Completo',
                width: 200
            },
            {
                field: 'userName',
                title: 'Usuario',
                width: 70
            },
            {
                field: 'email',
                title: 'Correo electrónico',
                width: 200
            },
            {
                field: 'condition',
                title: 'Condición',
                width: 120
            },
            {
                field: 'dedication',
                title: 'Dedicación',
                width: 120
            },
            {
                field: 'hours',
                title: 'Horas por semana',
                width: 120
            },
            {
                field: 'options',
                title: 'Opciones',
                width: 200,
                sortable: false,
                filterable: false,
                template: function (row) {
                    return '<button data-id="' + row.id + '" class="btn btn-primary btn-sm m-btn m-btn--icon btn-edit" title="Carga Académica"><span><i class="la la-list"></i><span>Carga Académica</span></span></button>'
                }
            }
        ]
    };

    var events = {
        init: function () {
            datatable.on('click', '.btn-edit', function () {
                var aux = $(this);
                var id = aux.data('id');
                window.open(`/admin/academiccharge/leontry/${id}`.proto().parseURL(), "_blank");
            });
            $(".report").on('click', function () {
                window.open(`/admin/academiccharge/report2`.proto().parseURL(), "_blank");
            });
            $(".report2").on('click', function () {
                window.open(`/admin/academiccharge/report3`.proto().parseURL(), "_blank");
            });
        }
    };

    return {
        init: function () {
            datatable = $(".m-datatable").mDatatable(options);
            events.init();
        }
    };
}();

$(function () {
    TeacherTable.init();
});