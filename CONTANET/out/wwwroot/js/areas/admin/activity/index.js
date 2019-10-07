var Activity = function () { 
    var activityDatatable = null;

    var options = {
        search: {
            input: $("#search"),
        },
        data: {
            source: {
                read: {
                    method: "GET",
                    url: "/admin/actividades-lectivas/get".proto().parseURL()
                }
            }
        },
        columns: [ 
            {
                field: "name",
                title: "Nombre",
                width: 100
            },
            {
                field: "description",
                title: "Description",
                width: 180
            },
            {
                field: "minHours",
                title: "Horas minimas",
                width: 100,
                textAlign: "center"
            },
            {
                field: "maxHours",
                title: "Horas máximas",
                width: 100,
                textAlign: "center"
            }, 
            {
                field: "options",
                title: "Opciones",
                width: 220,
                sortable: false,
                filterable: false,
                template: function (row) {
                    return '<a href="/admin/actividades-lectivas/editar/' + row.id + '" class="btn btn-primary btn-sm m-btn m-btn--icon" title="Editar"><span><i class="la la-edit"></i><span>Editar</span></span></a>' +
                        '&nbsp; <button data-id="' + row.id + '" class="btn btn-danger btn-sm m-btn m-btn--icon btn-delete" title="Eliminar"><span><i class="la la-trash"></i><span>Eliminar</span></span></button>';
 
                }
            }
        ]
    };
 
    var datatable = {
        init: function () {
            if (activityDatatable !== null) {
                activityDatatable.destroy();
                activityDatatable = null;
            } 
            activityDatatable = $(".m-datatable").mDatatable(options);
            this.initEvents();
        },
        initEvents: function () { 
          
            activityDatatable.on('click', '.btn-delete', function () {
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
                                url: "/admin/actividades-lectivas/eliminar/post".proto().parseURL(),
                                type: "POST",
                                data: {
                                    id: id
                                },
                                success: function (result) { 
                                    swal({
                                        type: "success",
                                        title: "Completado",
                                        text: `La actividad ha sido eliminada con éxito`,
                                        confirmButtonText: "Excelente"
                                    });
                                    datatable.init();
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
            datatable.init();
        }
    }
}();


$(function () {
    Activity.init();
});