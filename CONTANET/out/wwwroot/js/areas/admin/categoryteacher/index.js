var TermTable = function () {

    var datatable;
    var formCreate;
    var formEdit;
    var options = {
        data: {
            source: {
                read: {
                    method: "GET",
                    url: "/admin/categoryteacher/get".proto().parseURL()
                }
            }
        },
        columns: [
            {
                field: "name",
                title: "Nombre",
                width: 150
            },
            {
                field: "status",
                title: "Estado",
                textAlign: "center",
                template: function (row) {
                    var status = {
                        "1": { "title": "Activo", "class": " m-badge--success" },
                        "0": { "title": "Inactivo", "class": " m-badge--metal" }
                    };
                    return '<span class="m-badge ' + status[row.status.toString()].class + ' m-badge--wide">' + status[row.status.toString()].title + "</span>";
                }
            },
            {
                field: "options",
                title: "Opciones",
                sortable: false,
                filterable: false,
                template: function (row) {
                    return '<button data-id="' + row.id + '" class="btn btn-info btn-sm m-btn m-btn--icon edit"><span><i class="la la-edit"></i><span> Editar </span></span></button>' +
                        ' <button class="btn btn-danger m-btn btn-sm m-btn--icon m-btn--icon-only delete" data-id="' + row.id + '"><i class="la la-trash"></i></button>'; 
                }
            }
        ]
    };

    var loadTermData = function (id) {
        $.ajax({
            url: ("/admin/categoryteacher/get/" + id).proto().parseURL(),
            type: "GET",
            dataType: "json",
            success: function (result) {
                $("#eId").val(result.id);
                $("#eName").val(result.name);
                if (result.status)
                    document.getElementById("eStatus").checked = true;
                else
                    document.getElementById("eStatus").checked = false;
                $("#edit_modal").modal("toggle");
            },
            error: function () {
                toastr.error(_app.constants.toastr.message.error.task, _app.constants.toastr.title.error);
            }
        });
    };

    var deleteConfirmation = function (id) {
        swal({
            title: "¿Está seguro?",
            text: "La categoría de docente será eliminado permanentemente",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, eliminarlo",
            confirmButtonClass: "btn btn-danger m-btn m-btn--custom",
            cancelButtonText: "Cancelar"
        }).then(function (result) {
            if (result.value) {
                $.ajax({
                    url: "/admin/categoryteacher/eliminar",
                    type: "POST",
                    data: {
                        id: id
                    },
                    success: function () {
                        datatable.reload();
                        toastr.success(_app.constants.toastr.message.success.task, _app.constants.toastr.title.success);
                    },
                    error: function () {
                        toastr.error("La categoría de docente tiene información relacionada", _app.constants.toastr.title.error);
                    }
                });
            }
        });
    };

    var initFormValidation = function () {
        formCreate = $("#create-form").validate();
        formEdit = $("#edit-form").validate();
    };

    var initModalEvents = function () {
        $("#create_modal").on("hidden.bs.modal",
            function () {
                $("#create_msg").addClass("m--hide");
                formCreate.resetForm();
            });

        $("#edit_modal").on("hidden.bs.modal",
            function () {
                $("#edit_msg").addClass("m--hide");
                formEdit.resetForm();
            });
    };

    return {
        init: function () {
            datatable = $(".m-datatable").mDatatable(options);

            $(".m-datatable")
                .on("click", ".delete", function () {
                    var id = $(this).data("id");
                    deleteConfirmation(id);
                })
                .on("click", ".edit", function () {
                    var id = $(this).data("id");
                    loadTermData(id);
                });

            initFormValidation();

            initModalEvents();
        },
        reloadTable: function () {
            datatable.reload();
        }
    };
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
        TermTable.reloadTable();

        toastr.success(_app.constants.toastr.message.success.task, _app.constants.toastr.title.success);
    };
    var createFailure = function (e) {
        if (e.responseText !== null && e.responseText !== "") $("#create_msg_txt").html(e.responseText);
        else $("#create_msg_txt").html(_app.constant.ajax.message.error);

        $("#create_msg").removeClass("m--hide").show();
    };
    var editFailure = function (e) {
        if (e.responseText !== null && e.responseText !== "") $("#edit_msg_txt").html(e.responseText);
        else $("#edit_msg_txt").html("asdasd");

        $("#edit_msg").removeClass("m--hide").show();
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
        },
        editFailure: function (e) {
            console.log(e);
            editFailure(e);
        }
    };
}();

jQuery(document).ready(function () {
    TermTable.init();
});