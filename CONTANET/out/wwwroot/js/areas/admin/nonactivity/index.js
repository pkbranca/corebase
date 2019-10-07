var NonActivities = function () {
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
                    url: ("/admin/actividades-no-lectivas/getNonActivities").proto().parseURL(),
                },
            }
        }, 
        columns: [
            {
                field: "name",
                title: "Nombre",
            },
            {
                field: "description",
                title: "Descripcion",
            },
            {
                field: "minHours",
                title: "Horas mínimas",
            },
            {
                field: "maxHours",
                title: "Horas máximas",
            },
            {
                field: "completeWholeHours",
                title: "Horas completas",
                template: function (row) {
                    return row.completeWholeHours ? "SI" : "NO";
                }
            },
            {
                field: "issueDate",
                title: "Fecha de Resolución",
            },
            {
                field: "number",
                title: "Número de Resolución",
            },
            {
                field: "options",
                title: "Opciones",
                sortable: false,
                width: 200,
                filterable: false,
                template: function (row) {
                    return '<a href="/admin/actividades-no-lectivas/editar/' + row.id + '" class="btn btn-primary btn-sm m-btn m-btn--icon" title="Editar"><span><i class="la la-edit"></i><span>Editar</span></span></a>' +
                            '&nbsp; <button data-id="' + row.id + '" class="btn btn-danger btn-sm m-btn m-btn--icon btn-delete" title="Eliminar"><span><i class="la la-trash"></i><span>Eliminar</span></span></button>';
                }
            }
        ]
    }; 
    var events = {
        init: function () {
            $(datatable).on('click', '.btn-delete',  function () {
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
                                url: "/admin/actividades-no-lectivas/eliminar/post".proto().parseURL(),
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
    NonActivities.init();
});
