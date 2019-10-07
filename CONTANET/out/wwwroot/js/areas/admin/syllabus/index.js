var SolicitudeTable = function () {
    var datatable;

    var options = {       
        data: {
            type: 'remote',
            source: {
                read: {
                    method: 'GET',
                    url: `/admin/silabo/get`.proto().parseURL(),
                },
            }           
        },         
        columns: [
            {
                field: 'name',
                title: 'Nombre',
                width: 150
            },
            {
                field: 'start',
                title: 'Fecha de Inicio',
                width: 150
            },
            {
                field: 'end',
                title: 'Fecha de Fin',
                width: 150
            },
            {
                field: 'termid',
                title: 'Periodo Académico',
                width: 150
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

            $('#syllabus-modal-create').on('shown.bs.modal', function (e) {
                console.log("LOAD");
                $('.date').datepicker();
            });

            $('.btn-add').on('click', function () {
                 
                $("#syllabus-modal-create-form input[name=Name]").val("");  
                $("#StartCreate").datepicker().on("changeDate", function (e) { 
                    $("#EndCreate").datepicker("setStartDate", e.date);
                }); 
                $("#EndCreate").datepicker().on("changeDate", function (e) {
                    $("StartCreate").datepicker("setEndDate", e.date);
                });
            });

            datatable.on('click', '.btn-edit', function () {
                var id = $(this).data("id");
                $.ajax({
                    type: "GET",
                    url: `/admin/silabo/get/${id}`.proto().parseURL(),
                    success: function (data) {
                        $("#syllabus-modal-edit-form input[name=Name]").val(data.name);
                        $("#syllabus-modal-edit-form select[name=TermId]").val(data.termid).trigger('change');
                        
                        $("#syllabus-modal-edit-form input[name=Start]").val(data.start);
                        $("#syllabus-modal-edit-form input[name=End]").val(data.end);
                        $("#syllabus-modal-edit-form input[name=Id]").val(id);
                        $("#StartEdit").datepicker().on("changeDate", function (e) {
                            $("#EndEdit").datepicker("setStartDate", e.date);
                        });
                        $("#EndEdit").datepicker().on("changeDate", function (e) {
                            $("#StartEdit").datepicker("setEndDate", e.date);
                        });
                    }

                });
                $("#syllabus-modal-edit").modal('show');

            });

            var validator = $("#syllabus-modal-create-form").validate({
                submitHandler: function (form, event) {
                    event.preventDefault();
                    $("#btnSave").addLoader();
                    $.ajax({
                        type: "POST",
                        url: `/admin/silabo/agregar`.proto().parseURL(),
                        data: $(form).serialize(),
                        success: function () {
                            $("#syllabus-modal-create").modal('hide');
                            toastr.success(_app.constants.toastr.message.success.task, _app.constants.toastr.title.success);
                            datatable.reload();
                        },
                        error: function () {
                            toastr.warning("Ya existe un sílabo para el periodo académico seleccionado", _app.constants.toastr.title.warning);
                        },
                        complete: function () {
                            $("#btnSave").removeLoader();
                        }

                    });
                }
            });



            $("#syllabus-modal-edit-form").validate({
                submitHandler: function (form, event) {
                    event.preventDefault();
                    $("#btnSave").addLoader();
                    $.ajax({
                        type: "POST",
                        url: `/admin/silabo/editar/post`.proto().parseURL(),
                        data: $(form).serialize(),
                        success: function () {
                            $("#syllabus-modal-edit").modal('hide');
                            toastr.success(_app.constants.toastr.message.success.task, _app.constants.toastr.title.success);
                            datatable.reload();
                        },
                        error: function () {
                            toastr.warning("El periodo académico elegido ya se encuentra para otro registro", _app.constants.toastr.title.warning);
                        },
                        complete: function () {
                            $("#btnSave").removeLoader();
                        }

                    });
                }
            });



            $("#syllabus-modal-create").on("hidden.bs.modal", function () {
                validator.resetForm();
            })

            $.ajax({
                url: `/periodos/get`.proto().parseURL()
            }).done(function (data) {
                $("#syllabus-modal-create-form select[name=TermId]").select2({
                    data: data.items
                }).val(data.selected).trigger('change');
                $("#syllabus-modal-edit-form select[name=TermId]").select2({
                    data: data.items
                }).val(data.selected);
            });



            datatable.on('click', '.btn-delete', function () {
                var id = $(this).data('id');
                swal({
                    title: '¿Está seguro?',
                    text: "La solicitud será eliminada",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, eliminarla',
                    confirmButtonClass: 'btn btn-danger m-btn m-btn--custom',
                    cancelButtonText: 'Cancelar',
                    showLoaderOnConfirm: true,
                    allowOutsideClick: () => !swal.isLoading(),
                    preConfirm: () => {
                        return new Promise((resolve) => {
                            $.ajax({
                                url: "/admin/silabo/eliminar/post",
                                type: "POST",
                                data: {
                                    id: id
                                },
                                success: function (result) {
                                    datatable.reload();
                                    swal({
                                        type: 'success',
                                        title: 'Completado',
                                        text: 'La solicitud ha sido eliminado con éxito',
                                        confirmButtonText: 'Excelente'
                                    });
                                }
                                //,
                                //error: function (errormessage) {
                                //    swal({
                                //        type: 'error',
                                //        title: 'Error',
                                //        confirmButtonClass: 'btn btn-danger m-btn m-btn--custom',
                                //        confirmButtonText: 'Entendido',
                                //        text: 'Al parecer el docente tiene información relacionada'
                                //    });
                                //}
                            });
                        })
                    }
                });
            });
        }
    };

    return {
        init: function () {
            datatable = $(".m-datatable").mDatatable(options);
            events.init(); 
        }
    }
}();

$(function () {
    SolicitudeTable.init();
});