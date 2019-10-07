var ContractTable = function () {
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
                    url: (('/admin/contratos/get')).proto().parseURL(),
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
                field: 'resolution',
                title: 'N° Resolución',
                width: 70
            },
            {
                field: 'comment',
                title: 'Comentario',
                width: 100
            },
            {
                field: 'begin',
                title: 'Fecha de Inicio',
                width: 100
            },
            {
                field: 'end',
                title: 'Fecha de Fins',
                width: 100
            },
            {
                field: 'options',
                title: 'Opciones',
                textAlign: 'center',
                width: 200,
                sortable: false,
                filterable: false,
                template: function (row) {
                    return '<button data-id="' + row.id + '" class="btn btn-primary btn-sm m-btn m-btn--icon btn-edit" title="Editar"><span><i class="la la-edit"></i><span>Editar</span></span></button></button>'
                }
            }
        ]
    };

    var events = {
        init: function () {
            datatable.on('click', '.btn-edit', function () {
                var aux = $(this);
                var id = aux.data('id');
                location.href = '/admin/contratos/editar/' + id;
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

$(function () {
    ContractTable.init();
});