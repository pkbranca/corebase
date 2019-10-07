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
                    url: (('/admin/bloger/get/') + $("#conditionId").val()).proto().parseURL(),
                },
            },
            pageSize: 10,
            saveState: {
                cookie: true,
                webstorage: true
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
                field: 'options',
                title: 'Opciones',
                width: 200,
                sortable: false,
                filterable: false,
                template: function (row) {
                    return '<button data-id="' + row.id + '" class="btn btn-info btn-sm m-btn m-btn--icon btn-edit" title="Detalle"><span><i class="la la-eye"></i><span>Detalle</span></span></button> <button data-id="' + row.id + '" class="btn btn-danger btn-sm m-btn m-btn--icon btn-delete" title="Eliminar"><span><i class="la la-trash"></i><span>Eliminar</span></span></button>'
                }
            }
        ]
    };

    var events = {
        init: function () {
            datatable.on('click', '.btn-edit', function () {
                var aux = $(this);
                var id = aux.data('id');
                location.href = '/admin/bloger/editar/' + id;
            });

            datatable.on('click', '.btn-delete', function () {
                var id = $(this).data('id');
                swal({
                    title: '¿Está seguro?',
                    text: "El bloger será eliminado",
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
                                url: "/admin/bloger/eliminar/post",
                                type: "POST",
                                data: {
                                    id: id
                                },
                                success: function (result) {
                                    datatable.reload();
                                    swal({
                                        type: 'success',
                                        title: 'Completado',
                                        text: 'El bloger ha sido eliminado con éxito',
                                        confirmButtonText: 'Excelente'
                                    });
                                },
                                error: function (errormessage) {
                                    swal({
                                        type: 'error',
                                        title: 'Error',
                                        confirmButtonClass: 'btn btn-danger m-btn m-btn--custom',
                                        confirmButtonText: 'Entendido',
                                        text: 'Al parecer el bloger tiene información relacionada'
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
    TeacherTable.init();
});