var UserTable = function () {
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
                    url: ('/admin/usuarios/get').proto().parseURL()
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
                    pageSizeSelect: [10, 20, 30, 50, 100]
                },
                info: false
            }
        },
        columns: [
            {
                field: 'email',
                title: 'Correo electrónico',
                width: 200
            },
            {
                field: 'name',
                title: 'Nombres',
                width: 100
            },
            {
                field: 'paternalSurname',
                title: 'Apellido Paterno',
                width: 100
            },
            {
                field: 'maternalSurname',
                title: 'Apellido Materno',
                width: 100
            },
            {
                field: 'phoneNumbermater',
                title: 'Teléfono',
                width: 100
            },
            {
                field: 'userName',
                title: 'Usuario',
                width: 120
            },
            {
                field: 'options',
                title: 'Opciones',
                width: 200,
                sortable: false, // disable sort for this column
                filterable: false, // disable or enable filtering
                template: function (row) {
                    return '<button data-id="' + row.id + '" class="btn btn-primary btn-sm m-btn m-btn--icon btn-edit" title="Editar"><span><i class="la la-edit"></i><span>Editar</span></span></button> <button data-id="' + row.id + '" class="btn btn-danger btn-sm m-btn m-btn--icon btn-delete" title="Eliminar"><span><i class="la la-trash"></i><span>Eliminar</span></span></button>'
                }
            }
        ]
    }

    var events = {
        init: function () {
            datatable.on('click', '.btn-edit', function () {
                var aux = $(this);
                var id = aux.data('id');
                location.href = ('/admin/usuarios/editar/' + id).proto().parseURL();
            });

            datatable.on('click', '.btn-delete', function () {
                var id = $(this).data('id');
                swal({
                    title: '¿Está seguro?',
                    text: "El usuario será eliminado",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, eliminarlo',
                    confirmButtonClass: 'btn btn-danger m-btn m-btn--custom',
                    cancelButtonText: 'Cancelar',
                    showLoaderOnConfirm: true,
                    allowOutsideClick: () => !swal.isLoading(),
                    preConfirm: () => {
                        return new Promise((resolve) => {
                            $.ajax({
                                url: ("/admin/usuarios/eliminar/post").proto().parseURL(),
                                type: "POST",
                                data: {
                                    id: id
                                },
                                success: function (result) {
                                    datatable.reload();
                                    swal({
                                        type: 'success',
                                        title: 'Completado',
                                        text: 'El usuario ha sido eliminado con éxito',
                                        confirmButtonText: 'Excelente'
                                    });
                                },
                                error: function (errormessage) {
                                    swal({
                                        type: 'error',
                                        title: 'Error',
                                        confirmButtonClass: 'btn btn-danger m-btn m-btn--custom',
                                        confirmButtonText: 'Entendido',
                                        text: 'Al parecer el usuario tiene información relacionada'
                                    });
                                }
                            });
                        })
                    }
                });
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
    UserTable.init();
});