var StudentTable = function () {
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
                    url: ('/admin/alumnos/get').proto().parseURL(),
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
                field: 'paternalSurname',
                title: 'Apellido Paterno',
                width: 70
            },
            {
                field: 'maternalSurname',
                title: 'Apellido Materno',
                width: 70
            },
            {
                field: 'names',
                title: 'Nombres',
                width: 70
            },
            {
                field: 'userName',
                title: 'Usuario',
                width: 60
            },
            {
                field: 'email',
                title: 'Correo electrónico',
                width: 200
            },
            {
                field: 'phoneNumber',
                title: 'Teléfono',
                width: 80
            },
            {
                field: 'careerName',
                title: 'Carrera',
                width: 120
            },
            {
                field: 'options',
                title: 'Opciones',
                width: 200,
                sortable: false,
                filterable: false,
                template: function (row) {
                    return '<button data-id="' + row.id + '" class="btn btn-primary btn-sm m-btn m-btn--icon btn-edit" title="Editar"><span><i class="la la-edit"></i><span>Editar</span></span></button> <button data-id="' + row.id + '" class="btn btn-danger btn-sm m-btn m-btn--icon btn-delete" title="Eliminar"><span><i class="la la-trash"></i><span>Eliminar</span></span></button>'
                }
            }
        ]
    };

    var events = {
        init: function () {
            datatable.on('click', '.btn-edit', function () {
                    var aux = $(this);
                    var id = aux.data('id');
                    location.href = '/admin/alumnos/editar/' + id;
                });

            datatable.on('click', '.btn-delete', function () {
                    var id = $(this).data('id');
                    swal({
                        title: '¿Está seguro?',
                        text: "El alumno será eliminado",
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
                                    url: "/admin/alumnos/eliminar/post",
                                    type: "POST",
                                    data: {
                                        id: id
                                    },
                                    success: function (result) {
                                        datatable.reload();
                                        swal({
                                            type: 'success',
                                            title: 'Completado',
                                            text: 'El alumno ha sido eliminado con éxito',
                                            confirmButtonText: 'Excelente'
                                        });
                                    },
                                    error: function (errormessage) {
                                        swal({
                                            type: 'error',
                                            title: 'Error',
                                            confirmButtonClass: 'btn btn-danger m-btn m-btn--custom',
                                            confirmButtonText: 'Entendido',
                                            text: 'Al parecer el alumno tiene información relacionada'
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
    StudentTable.init();
});