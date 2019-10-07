
var InitApp = function () {
    var datatable = {

        payments: {
            object: null,
            options: {
                data: {
                    source: {
                        read: {
                            method: "GET",
                            url: "/docente/actividades-no-lectivas/get".proto().parseURL()
                        }
                    }
                },
                columns: [
                    {
                        field: "activityName",
                        title: "Actividad"
                    },
                    {
                        field: "totalHours",
                        title: "Horas"
                    },
                    {
                        field: "commentary",
                        title: "Comentario"
                    },
                    {
                        field: "options",
                        title: "Opciones",
                        sortable: false,
                        width: 200,
                        filterable: false,
                        template: function (row) {
                            return '<button type="button" data-id="' + row.id + '" class="btn btn-primary btn-sm m-btn m-btn--icon btn-edit" title="Editar"><span><i class="la la-edit"></i><span>Editar</span></span></button>' +
                                '&nbsp; <button type="button" data-id="' + row.id + '" class="btn btn-danger btn-sm m-btn m-btn--icon btn-delete" title="Eliminar"><span><i class="la la-trash"></i><span>Eliminar</span></span></button>';
                        }
                    }
                ]
            },
            load: function () {

                var selectedStatus = $("#PaymentStatus").val();

                if (datatable.payments.object !== undefined && $.trim($(".m-datatable").html()).length) datatable.payments.object.destroy();
                datatable.payments.options.data.source.read.url = `/docente/actividades-no-lectivas/get`.proto().parseURL();
                datatable.payments.object = $("#ajax_data").mDatatable(datatable.payments.options);
            },
            destroy: function () {
                if (datatable.payments.object !== undefined && $.trim($(".m-datatable").html()).length) datatable.payments.object.destroy();
            }
        },
        init: function () {
            datatable.payments.load();

            $("#PaymentStatus").change(function () {
                datatable.payments.load();
            });
        }
    };
 
    var createModal;
    var forms = {
        create: {
            init: function () {
               createModal= $("#createForm").validate({
                    submitHandler: function (form, e) {
                        e.preventDefault();
                        mApp.block(form);

                        $(form).ajaxSubmit({
                            success: function () {
                                toastr.success("Se ha registrado la actividad.", "COMPLETADO");
                                datatable.payments.load();
                                $("#addNonActivity").modal("hide");
                            },
                            error: function () {
                                toastr.error("Ha ocurrido un problema en el servidor", "ERROR");
                            },
                            complete: function () {
                                mApp.unblock(form);
                            }
                        });
                    }
                });

                $("#editForm").validate({
                    submitHandler: function (form, e) {
                        e.preventDefault();
                        mApp.block(form);

                        $(form).ajaxSubmit({
                            success: function () {
                                toastr.success("Se ha actualizado la actividad.", "COMPLETADO");
                                datatable.payments.load();
                                $("#editNonActivity").modal("hide");
                            },
                            error: function () {
                                toastr.error("Ha ocurrido un problema en el servidor", "ERROR");
                            },
                            complete: function () {
                                mApp.unblock(form);
                            }
                        });
                    }
                });
            }
        },
        init: function () {
            forms.create.init();
        }
    };

    var events = {
        init: function () {

            $("#cTotalHours").keypress(function (event) {
                if (event.which === 46 || (event.which < 48 || event.which > 57)) {
                    event.preventDefault();
                }
            }).on('paste', function (event) {
                event.preventDefault();
            });

            $("#eTotalHours").keypress(function (event) {
                if (event.which === 46 || (event.which < 48 || event.which > 57)) {
                    event.preventDefault();
                }
            }).on('paste', function (event) {
                event.preventDefault();
                });

            $('#cFile').on('change', function () {
                let fileName = $(this).val();
                $(this).next().next().html(fileName);
            });

            $("#btnAddNonActivity").on('click', function () {  
                createModal.resetForm();
              
                $("#cFile").next().html('Seleccione un archivo pdf');
            });


            $("body").on('click', '.btn-edit', function () {
                var id = $(this).data('id');
                $.ajax({
                    url: (`/docente/actividades-no-lectivas/get/${id}`).proto().parseURL(),
                    type: "GET",
                    success: function (result) { 
                        $("#eId").val(result.id);
                        $("#eNonActivityId").val(result.nonActivityId);
                        $("#eCommentary").val(result.commentary);
                        $("#eActivityName").val(result.activityName);
                        $("#eTotalHours").val(result.totalHours);
                        $("#eFilePath").attr("href", result.filePath);
                    },
                    error: function (errormessage) {

                    }
                }); 
                $("#editNonActivity").modal('show');
            });



            $("body").on('click', '.btn-delete', function () {
                var id = $(this).data('id');
                swal({
                    title: '¿Está seguro?',
                    text: "La actividad será eliminada",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, eliminar',
                    confirmButtonClass: 'btn btn-danger m-btn m-btn--custom',
                    cancelButtonText: 'Cancelar',
                    showLoaderOnConfirm: true,
                    allowOutsideClick: () => !swal.isLoading(),
                    preConfirm: () => {
                        return new Promise((resolve) => {
                            $.ajax({
                                url: "/docente/actividades-no-lectivas/eliminar",
                                type: "POST",
                                data: {
                                    id: id
                                },
                                success: function (result) {
                                    swal({
                                        type: 'success',
                                        title: 'Completado',
                                        text: 'La actividad ha sido actualizada con éxito',
                                        confirmButtonText: 'Excelente'
                                    });
                                    datatable.payments.load();
                                },
                                error: function (errormessage) {
                                    swal({
                                        type: 'error',
                                        title: 'Error',
                                        confirmButtonClass: 'btn btn-danger m-btn m-btn--custom',
                                        confirmButtonText: 'Entendido',
                                        text: 'Al parecer la actividad tiene información relacionada'
                                    });
                                }
                            });
                        })
                    }
                });
            }); 
        }
    }

    var select = {
        nonactivity: {
            init: function () {
                $.ajax({
                    url: "/docente/actividades-no-lectivas/actividades/get",
                    type: "get"
                })
                    .done((data) => {
                        var newHtml = "";
                        $.each(data, function (i, v) {
                            newHtml += `<option value="${v.id}">${v.name}</option>`;
                        });

                        $("[name='NonActivityId']").html(newHtml);

                        $("#cNonActivityId").select2({
                            dropdownParent: $("#addNonActivity")
                        });
                    });
            }
        },
        init: function () {
            select.nonactivity.init();
        }
    }

    return {
        init: function () {
            datatable.init();
            forms.init();
            select.init();
            events.init();
        }
    }
}();

$(function () {
    InitApp.init();
});
