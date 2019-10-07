// CourseTerm management

var CourseTerm = function () {
    var formValidate = $("#course-term-form").validate({
        submitHandler: function() {
            var formData = new FormData(document.getElementById("course-term-form"));
            $.ajax({
                type: "POST",
                url: `${location.href}/editar/post`,
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                beforeSend: function (e) {
                    form.begin();
                    $(".custom-file").append("<div class='m--space-10'></div><div class='progress m-progress--sm'><div class='progress-bar progress-bar-striped progress-bar-animated m--bg-primary' role='progressbar'></div></div>");
                    $(".progress-bar").width("0%");
                },
                // this part is progress bar
                xhr: function () {
                    var xhr = new window.XMLHttpRequest();
                    xhr.upload.onprogress = function (evt) {
                        if (evt.lengthComputable) {
                            var percentComplete = evt.loaded / evt.total;
                            percentComplete = parseInt(percentComplete * 100);
                            $(".progress-bar").width(percentComplete + "%");
                        }
                    }
                    return xhr;
                },
                complete: function (e) {
                    form.complete();
                    $(".progress").empty().remove();
                },
                success: function (e) {
                    form.success(e);
                    $("#download-temary").show();
                },
                error: function (e) {
                    form.failure(e);
                }
            });
            return false;
        }
    });

    var form = {
        reset: function () {
            $("#form_msg").addClass("m--hide").hide();
            formValidate.resetForm();
        },
        begin: function () {
            $("form input").attr("disabled", true);
            $("#btnSaveCourseTerm").addLoader();
        },
        complete: function () {
            $("form input").attr("disabled", false);
            $("#btnSaveCourseTerm").removeLoader();
        },
        success: function (e) {
            toastr.success(_app.constants.toastr.message.success.task, _app.constants.toastr.title.success);
        },
        failure: function (e) {
            toastr.error(_app.constants.toastr.message.error.task, _app.constants.toastr.title.error);
            if (e.responseText != null) $("#form_msg_txt").html(e.responseText);
            else $("#form_msg_txt").html(_app.constants.ajax.message.error);
            $("#form_msg").removeClass("m--hide").show();
        }
    }

    var load = function () {
        $("#download-temary").click(function (e) {
            window.open(location.href + "/temario/descargar");
        });
    };

    return {
        init: function () {
            load();
        },
        Form: {
            begin: function () {
                form.begin();
            },
            complete: function () {
                form.complete();
            },
            success: function (e) {
                form.success(e);
            },
            failure: function (e) {
                form.failure(e);
            }
        }
    }
}();

var Section = function () {
    var datatable;
    var formCreateValidation = $("#add-section-form").validate();
    var formEditValidation = $("#edit-section-form").validate();

    var options = {
        search: {
            input: $("#searchSection"),
        },
        data: {
            type: "remote",
            source: {
                read: {
                    method: "GET",
                    url: (location.pathname + "/secciones/get").proto().parseURL()
                },
            }
        },
        columns: [
            {
                field: "code",
                title: "Código",
                width: 80
            },
            {
                field: "teacher",
                title: "Profesor(es)",
                width: 300
            },
            {
                field: "vacancies",
                title: "Max. Vacantes",
                width: 150,
                textAlign: "center"
            },
            {
                field: "options",
                title: "Opciones",
                width: 150,
                sortable: false, // disable sort for this column
                filterable: false, // disable or enable filtering
                template: function (row) {
                    return "<button data-id='" +
                        row.id +
                        "' class='btn btn-info btn-sm m-btn m-btn--icon btn-edit'><span><i class='la la-edit'></i><span>Editar</span></span></button>" +
                        " <button data-id='" +
                        row.id +
                        "' class='btn btn-danger btn-sm m-btn m-btn--icon btn-delete'><i class='la la-trash'></i></button>";
                }
            },
            {
                field: "management",
                title: "Gestión",
                sortable: false,
                filterable: false,
                template: function (row) {
                    return "<button data-id='" +
                        row.id +
                        "' data-section='" +
                        row.code +
                        "' class='btn btn-brand btn-sm m-btn m-btn--icon btn-detail'><span><i class='la la-calendar'></i><span> Horarios </span></span></button>";
                }
            }
        ]
    };

    var events = {
        init: function () {
            $("#add-section").on("click", function () {
                create.show();
            });

            datatable.on("click", ".btn-delete", function () {
                var id = $(this).data("id");
                swal({
                    title: "¿Está seguro?",
                    text: "La sección será eliminada permanentemente",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Sí, eliminarla",
                    confirmButtonClass: "btn btn-danger m-btn m-btn--custom",
                    cancelButtonText: "Cancelar",
                    showLoaderOnConfirm: true,
                    allowOutsideClick: () => !swal.isLoading(),
                    preConfirm: () => {
                        return new Promise((resolve) => {
                            $.ajax({
                                url: location.href + "/secciones/eliminar/post",
                                type: "POST",
                                data: {
                                    id: id
                                },
                                success: function () {
                                    datatable.reload();
                                    swal({
                                        type: "success",
                                        title: "Completado",
                                        text: "La sección ha sido eliminada con éxito",
                                        confirmButtonText: "Excelente"
                                    });
                                },
                                error: function () {
                                    swal({
                                        type: "error",
                                        title: "Error",
                                        confirmButtonClass: "btn btn-danger m-btn m-btn--custom",
                                        confirmButtonText: "Entendido",
                                        text: "Al parecer la sección tiene información relacionada"
                                    });
                                }
                            });
                        });
                    }
                });
            });

            datatable.on("click", ".btn-edit", function () {
                var id = $(this).data("id");
                edit.show(id);
            });

            datatable.on("click", ".btn-detail", function () {
                var id = $(this).data("id");
                var section = $(this).data("section");
                ClassSchedule.show(id, section);
            });
        }
    }

    var initComponents = function () {
        $(".select2-teachers").select2({
            placeholder: "Seleccione Profesor(es)"
        });
        $(".select2-teachers").prop("disabled", true);
        $.ajax({
            url: "/profesores/get".proto().parseURL()
        }).done(function (result) {
            $(".select2-teachers").each(function (index, e) {
                if ($(e).attr("id") === "Fields_SelectedTeachers") {
                    $(e).select2({
                        placeholder: "Profesor(es)",
                        allowClear: false,
                        minimumInputLength: 0,
                        width: "90%"
                    });
                } else {
                    $(e).select2({
                        placeholder: "Seleccione Profesor(es)",
                        minimumInputLength: 0,
                        data: result.items
                    });
                }
            });
            if (result.items) {
                $(".select2-teachers").prop("disabled", false);
            }
            $(".select2-teachers").val(null).trigger("change");
        });
    }

    var create = {
        show: function () {
            $("#add_section_modal").modal("show");
            $("#add_section_modal").on("shown.bs.modal", function (e) {
                $("#TeacherId").val(null).trigger("change");
            });
            $("#add_section_modal").on("hidden.bs.modal", function (e) {
                create.reset();
            });
        },
        reset: function () {
            formCreateValidation.resetForm();
            $("#add_form_sec_msg").addClass("m--hide").hide();
        },
        begin: function () {
            $("div#add_evaluation_modal input, div#edit_evaluation_modal select").attr("disabled", true);
            $("#btnAddSection").addLoader();
        },
        complete: function () {
            $("div#add_evaluation_modal input, div#edit_evaluation_modal select").attr("disabled", false);
            $("#btnAddSection").removeLoader();
        },
        success: function (e) {
            $("#add_section_modal").modal("hide");
            toastr.success(_app.constants.toastr.message.success.task, _app.constants.toastr.title.success);
            datatable.reload();
        },
        failure: function (e) {
            toastr.error(_app.constants.toastr.message.error.task, _app.constants.toastr.title.error);
            //if (e.responseText != null) $("#add_form_sec_msg_txt").html(e.responseText);
            //else
            $("#add_form_sec_msg_txt").html(_app.constants.ajax.message.error);
            $("#add_form_sec_msg").removeClass("m--hide").show();
        }
    }

    var edit = {
        show: function (id) {
            $("#edit_section_modal").modal("toggle");
            $("#edit_section_modal").on("shown.bs.modal", function (e) {
                mApp.block("#edit_section_modal .modal-content", { type: "loader", message: "Cargando..." });
                $.ajax({
                    url: "/admin/cursos/secciones/" + id + "/get",
                    type: "GET",
                    dataType: "json",
                    success: function (result) {
                        var formElements = $("#edit-section-form").get(0).elements;
                        formElements["SectionId"].value = id;
                        formElements["Fields_Code"].value = result.code;
                        formElements["Fields_Vacancies"].value = result.vacancies;
                        
                        if (result.teachers) {
                            //var option = new Option(result.teacher.text, result.teacher.id, true, true);
                            //$("#Fields_TeacherId").append(option);
                            //$("#Fields_Teacher").trigger("change");
                            $("#Fields_TeacherId").val(result.teachers).trigger("change");
                        }
                        mApp.unblock("#edit_section_modal .modal-content");
                    },
                    error: function (error) {
                        toastr.error(_app.constants.toastr.message.error.task, _app.constants.toastr.title.error);
                        mApp.unblock("#edit_section_modal .modal-content");
                    }
                });
            });
            $("#edit_section_modal").one("hidden.bs.modal", function (e) {
                edit.reset();
            });
        },
        reset: function () {
            formEditValidation.resetForm();
            $("#edit_form_sec_msg").addClass("m--hide").hide();
            $("#Fields_TeacherId").val([]).trigger("change");
        },
        begin: function () {
            $("div#edit_evaluation_modal input, div#edit_evaluation_modal select").attr("disabled", true);
            $("#btnEditSection").addLoader();
        },
        complete: function () {
            $("div#edit_evaluation_modal input, div#edit_evaluation_modal select").attr("disabled", false);
            $("#btnEditSection").removeLoader();
        },
        success: function (e) {
            $("#edit_section_modal").modal("toggle");
            toastr.success(_app.constants.toastr.message.success.task, _app.constants.toastr.title.success);
            datatable.reload();
        },
        failure: function (e) {
            toastr.error(_app.constants.toastr.message.error.task, _app.constants.toastr.title.error);
            //if (e.responseText != null) $("#edit_form_sec_msg_txt").html(e.responseText);
            //else
            $("#edit_form_sec_msg_txt").html(_app.constants.ajax.message.error);
            $("#edit_form_sec_msg").removeClass("m--hide").show();
        }
    }

    return {
        Table: {
            init: function () {
                datatable = $("#sections-datatable").mDatatable(options);
                initComponents();
                events.init();
            },
            adjustCellsWidth: function() {
                datatable.adjustCellsWidth();
            },
            reload: function () {
                datatable.reload();
            }
        },
        Form: {
            Create: {
                begin: function () {
                    create.begin();
                },
                complete: function () {
                    create.complete();
                },
                success: function (e) {
                    create.success(e);
                },
                failure: function (e) {
                    create.failure(e);
                }
            },
            Edit: {
                begin: function () {
                    edit.begin();
                },
                complete: function () {
                    edit.complete();
                },
                success: function (e) {
                    edit.success(e);
                },
                failure: function (e) {
                    edit.failure(e);
                }
            }
        }
    }
}();

$(function () {
    CourseTerm.init();
    Section.Table.init();

    $(".nav-link.m-tabs__link").on("shown.bs.tab", function (event) {
        Section.Table.adjustCellsWidth();
    });
});