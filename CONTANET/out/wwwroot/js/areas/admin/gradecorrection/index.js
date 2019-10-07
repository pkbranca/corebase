var RequestsTable = function () {

    var dataTable;
    var options = {
        data: {
            source: {
                read: {
                    method: "GET",
                    url: null
                }
            }
        },
        columns: [
            {
                field: "course",
                title: "Curso"
            },
            {
                field: "section",
                title: "Sección"
            },
            {
                field: "code",
                title: "Código"
            },
            {
                field: "student",
                title: "Alumno"
            },
            {
                field: "evaluation",
                title: "Evaluación"
            },
            {
                field: "grade",
                title: "Nueva Nota"
            },
            {
                field: "state",
                title: "Estado",
                sortable: false,
                filterable: false,
                template: function (row) {
                    switch (row.state) {
                        case 2:
                            return "<span class='m-badge m-badge--success m-badge--wide'> Aprobado </span>";
                        case 3:
                            return "<span class='m-badge m-badge--danger m-badge--wide'> Rechazado </span>";
                        default:
                            return "<span class='m-badge m-badge--metal m-badge--wide'> Pendiente </span>";
                    }
                }
            },
            {
                field: "options",
                title: " ",
                width: 100,
                sortable: false,
                filterable: false,
                template: function (row) {
                    if (row.state !== 1) return " ";

                    return '<button class="btn btn-success m-btn btn-sm m-btn--icon m-btn--icon-only approve" data-id="' + row.id + '" title="Aprobar"><i class="la la-check"></i></button>' +
                        ' <button class="btn btn-danger m-btn btn-sm m-btn--icon m-btn--icon-only disapprove" data-id="' + row.id + '" title="Rechazar"><i class="la la-remove"></i></button>';
                }
            }
        ]
    }

    var confirmation = function (id, approved) {
        swal({
            title: "Confirmación de la solicitud",
            text: "El estado de la solicitud será cambiado y no podrá ser modificado posteriormente.",
            type: "warning",
            showCancelButton: true
        }).then(function(result) {
            if (result.value) {
                $.ajax({
                    url: "/admin/correccion-notas/post".proto().parseURL(),
                    type: "POST",
                    data: {
                        id: id,
                        approved: approved
                    }
                }).done(function() {
                    dataTable.reload();
                    toastr.success(_app.constants.toastr.message.success.task, _app.constants.toastr.title.success);
                }).fail(function(e) {
                    if (e.responseText !== null && e.responseText !== "")
                        toastr.error(e.responseText, _app.constants.toastr.title.error);
                    else toastr.error(_app.constants.toastr.message.error.task, _app.constants.toastr.title.error);
                });
            }
        });
    };

    return {
        loadTable: function (id) {
            if (dataTable !== undefined) dataTable.destroy();

            options.data.source.read.url = ("/admin/correccion-notas/get/" + id).proto().parseURL();
            dataTable = $(".m-datatable").mDatatable(options);

            $(".m-datatable")
                .on("click", ".approve", function () {
                    var grade = $(this).data("id");
                    confirmation(grade, true);
                })
                .on("click", ".disapprove", function () {
                    var grade = $(this).data("id");
                    confirmation(grade, false);
                });
        },
        reloadTable: function() {
            dataTable.reload();
        }
    }

}();
var TermSelect = function () {

    var select2Initializer = function() {
        $.ajax({
            url: "/periodos/get".proto().parseURL()
        }).done(function (data) {
            $("#select_term").select2({
                data: data.items
            });

            $("#select_term").on("change", function () {
                if ($("#select_term").val() != null) {
                    RequestsTable.loadTable($("#select_term").val());
                }
            });

            if (data.selected !== null) {
                $("#select_term").val(data.selected);
                $("#select_term").trigger("change.select2");
            }

            RequestsTable.loadTable($("#select_term").val());
        }).fail(function () {
            toastr.error(_app.constants.toastr.message.error.task, _app.constants.toastr.title.error);
        });
    }

    return {
        init: function () {
            select2Initializer();
        }
    }
}();
var AjaxEvents = function () {
    var beginAjaxCall = function () {
        $(".btn-submit").each(function () {
            $(this).addLoader();
        });
    }
    var endAjaxCall = function () {
        $(".btn-submit").each(function () {
            $(this).removeLoader();
        });
    }
    var ajaxSuccess = function () {
        RequestsTable.reloadTable();
        toastr.success(_app.constants.toastr.message.success.task, _app.constants.toastr.title.success);
    }
    var createFailure = function (e) {
        if (e.responseText !== null && e.responseText !== "") $("#create_msg_txt").html(e.responseText);
        else $("#create_msg_txt").html(_app.constants.toastr.message.error.task);

        $("#create_msg").removeClass("m--hide").show();
    }

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
        createFailure: function () {
            createFailure();
        }
    }
}();

jQuery(document).ready(function () {
    TermSelect.init();
});


