var Positions = function () {
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
                    url: ("/admin/cargos/getPositions").proto().parseURL(),
                },
            }
        },
        columns: [
            {
                field: "description",
                title: "Descripcion",
            },
            {
                field: "age",
                title: "Edad",
            },
            {
                field: "dedication",
                title: "Dedicacion",
            },
            {
                field: "academicDegree",
                title: "Grado Académico",
            },
            {
                field: "jobTitle",
                title: "Titulo Profesional",
            }, 
            {
                field: "options",
                title: "Opciones",
                sortable: false,
                width: 200,
                filterable: false,
                template: function (row) {
                    return '<a href="/admin/cargos/editar/' + row.id + '" class="btn btn-primary btn-sm m-btn m-btn--icon" title="Editar"><span><i class="la la-edit"></i><span>Editar</span></span></a>' +
                        '&nbsp; <button data-id="' + row.id + '" class="btn btn-danger btn-sm m-btn m-btn--icon btn-delete" title="Eliminar"><span><i class="la la-trash"></i><span>Eliminar</span></span></button>';
                }
            }
        ]
    }; 

    var events = {
        init: function () {
            $(datatable).on('click', '.btn-delete', function () {
                var id = $(this).data('id');

                swal({
                    title: "¿Está seguro?",
                    text: `La actividad será eliminada permanentemente`,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Sí, eliminar",
                    confirmButtonClass: "btn btn-danger m-btn m-btn--custom",
                    cancelButtonText: "Cancelar",
                    showLoaderOnConfirm: true,
                    allowOutsideClick: () => !swal.isLoading(),
                    preConfirm: () => {
                        return new Promise((resolve) => {
                            $.ajax({
                                url: "/admin/cargos/eliminar/post".proto().parseURL(),
                                type: "POST",
                                data: {
                                    id: id
                                },
                                success: function (result) {
                                    datatable.reload();
                                    swal({
                                        type: "success",
                                        title: "Completado",
                                        text: `La actividad ha sido eliminada con éxito`,
                                        confirmButtonText: "Excelente"
                                    });
                                },
                                error: function (errormessage) {
                                    swal({
                                        type: "error",
                                        title: "Error",
                                        confirmButtonClass: "btn btn-danger m-btn m-btn--custom",
                                        confirmButtonText: "Entendido",
                                        text: "Ocurrió un error al intentar eliminar la actividad"
                                    });
                                }
                            });
                        });
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
    Positions.init();
});
