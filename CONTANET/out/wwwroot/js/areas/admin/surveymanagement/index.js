var SurveyTable = function () {
    var datatable;
    var options = {
        data: {
            source: {
                read: {
                    method: "GET",
                    url: "/admin/gestion-encuestas/get".proto().parseURL()
                }
            }
        },
        sortable: false,
        columns: [
            {
                field: "code",
                title: "Código"
            },
            {
                field: "name",
                title: "Nombre"
            },
            {
                field: "publicationDate",
                title: "Fecha Publicación"
            },
            {
                field: "finishDate",
                title: "Fecha Finalización"
            },
            {
                field: "options",
                title: "Opciones",
                sortable: false,
                filterable: false,
                template: function (row) {
                    return '<a href="' + ("/admin/gestion-encuestas/editar/" + row.id).proto().parseURL() + '" class="btn btn-secondary btn-sm m-btn m-btn--icon"><span><i class="la la-edit"></i><span> Detalle </span></span></a>' + "&nbsp;" +
                        '<a href="' + ("/admin/gestion-encuestas/secciones/" + row.id).proto().parseURL() + '" class="btn btn-secondary btn-sm m-btn m-btn--icon"><span><i class="la la-eye"></i><span> Respuestas </span></span></a>' + "&nbsp;" +
                        '<a href="' + ("/admin/gestion-encuestas/generar-reporte/" + row.id).proto().parseURL() + '" class="btn btn-secondary btn-sm m-btn m-btn--icon"><span><i class="la la-cloud-download"></i><span> Reporte </span></span></a>' + "&nbsp;" +
                        ' <button class="btn btn-danger m-btn btn-sm m-btn--icon m-btn--icon-only delete" data-id="' + row.id + '"><i class="la la-trash"></i></button>';
                }
            }
        ]
    };

    var deleteConfirmation = function (id) {
        swal({
            title: "¿Está seguro?",
            text: "La encuesta será eliminada permanentemente",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, eliminarla",
            confirmButtonClass: "btn btn-danger m-btn m-btn--custom",
            cancelButtonText: "Cancelar"
        }).then(function (result) {
            if (result.value) {
                $.ajax({
                    url: "/admin/gestion-encuestas/eliminar",
                    type: "POST",
                    data: {
                        id: id
                    },
                    success: function () {
                        datatable.reload();
                        toastr.success(_app.constants.toastr.message.success.task, _app.constants.toastr.title.success);
                    },
                    error: function () {
                        toastr.error("La encuesta tiene información relacionada", _app.constants.toastr.title.error);
                    }
                });
            }
        });
    };

    var initFormValidation = function () {
        formCreate = $("#create-form").validate();
    };
    var initFormDatepickers = function () {
        $("#cPublicationDate").datepicker()
            .on("changeDate", function (e) {
                $("#cFinishDate").datepicker("setStartDate", e.date);
            });

        $("#cFinishDate").datepicker()
            .on("changeDate", function (e) {
                $("#cPublicationDate").datepicker("setEndDate", e.date);
            });
    };
    var initModalEvents = function () {
        $("#create_modal").on("hidden.bs.modal",
            function () {
                $("#create_msg").addClass("m--hide");
                formCreate.resetForm();
            });
    };

    return {
        init: function () {
            datatable = $(".m-datatable").mDatatable(options);

            $(".m-datatable")
                .on("click", ".delete", function () {
                    var id = $(this).data("id");
                    deleteConfirmation(id);
                });

            initFormValidation();
            initFormDatepickers();
            initModalEvents();
        },
        reloadTable: function () {
            datatable.reload();
        }
    }
}();

var DefaultAjaxFunctions = function () {
    var beginAjaxCall = function () {
        $(".btn-submit").each(function (index, element) {
            $(this).addLoader();
        });
    };
    var endAjaxCall = function () {
        $(".btn-submit").each(function (index, element) {
            $(this).removeLoader();
        });
    };
    var ajaxSuccess = function () {
        $("#create_modal").modal("hide");
        $("#edit_modal").modal("hide");
        SurveyTable.reloadTable();

        toastr.success(_app.constants.toastr.message.success.task, _app.constants.toastr.title.success);
    };
    var createFailure = function (e) {
        if (e.responseText !== null && e.responseText !== "") $("#create_msg_txt").html(e.responseText);
        else $("#create_msg_txt").html(_app.constant.ajax.message.error);

        $("#create_msg").removeClass("m--hide").show();
    };

    return {
        beginAjaxCall: function () {
            beginAjaxCall();
        },
        endAjaxCall: function () {
            endAjaxCall();
        },
        ajaxSuccess: function () {
            ajaxSuccess();
        },
        createFailure: function (e) {
            createFailure(e);
        }
    };
}();

jQuery(document).ready(function () {
    SurveyTable.init();

    $("#cPublicationDate").datepicker();
    $("#cFinishDate").datepicker();
});