var CareerTable = function () {
    var datatable;

    var formEditValidation = $("#edit-form").validate();

    $("#cTeacherSearch").select2({
        width: "100%",
        dropdownParent: $("#edit_term_modal"),
        placeholder: "Buscar un docente",
        ajax: {
            url: "/admin/docentes/select/filter/get",
            dataType: "json",
            data: function (params) {
                return {
                    term: params.term,
                    page: params.page
                };
            },
            processResults: function (data, params) {
                return {
                    results: data.items
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) {
            return markup;
        },
        minimumInputLength: 3
    });

    var options = {
        search: {
            input: $('#search')
        },
        data: {
            type: 'remote',
            source: {
                read: {
                    method: 'GET',
                    url: (('/admin/career/get/')).proto().parseURL(),
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
                field: 'title',
                title: 'Nombre Completo',
                width: 200
            },
            {
                field: 'coordinator',
                title: 'Coordinador',
                width: 70
            },
            {
                field: 'options',
                title: 'Opciones',
                width: 200,
                sortable: false,
                filterable: false,
                template: function (row) {
                    return '<button data-id="' + row.id + '" class="btn btn-info btn-sm m-btn m-btn--icon btn-edit" title="Asignar coordinador"><span><i class="la la-eye"></i><span>Asignar coordinador</span></span></button>'
                }
            }
        ]
    };

    var events = {
        init: function () {
            datatable.on("click",
                ".btn-edit",
                function () {
                    var id = $(this).data("id");
                    edit.show(id);
                });
        }
    };

    var edit = {
        show: function (id) {
            $("#edit_term_modal").modal("toggle");

            $("#edit_term_modal").one("shown.bs.modal",
                function (e) {
                    $(".m-select2").prop("disabled", false);

                    mApp.block("#edit_term_modal .modal-content", { type: "loader", message: "Cargando..." });
                    $.ajax({
                        url: (`/admin/career/${id}/coordinador/get`).proto().parseURL()
                    }).done(function (result) {

                        var formElements = $("#edit-form").get(0).elements;
                        formElements["CareerId"].value = id;

                        if (result.id != null) {
                            var newOption = new Option(result.title, result.id, true, true);
                            $('#cTeacherSearch').append(newOption).trigger('change');
                        }
                        else {
                            $('#cTeacherSearch').val("");
                            $('#cTeacherSearch').trigger('change');
                        }
                        
                        mApp.unblock("#edit_term_modal .modal-content");
                    });
                });
            $("#edit_term_modal").one("hidden.bs.modal",
                function (e) {
                    edit.reset();
                });
        },
        reset: function () {
            $("#edit_form_msg").addClass("m--hide").hide();
            formEditValidation.resetForm();
        },
        begin: function () {
            $("#edit_form_modal input").attr("disabled", true);
            $("#edit_form_modal select").attr("disabled", true);
            $("#btnSave").addLoader();
        },
        complete: function () {
            $("#edit_term_modal input").attr("disabled", false);
            $("#edit_term_modal select").attr("disabled", false);
            $("#btnSave").removeLoader();
        },
        success: function (e) {
            $('#edit_term_modal').modal("toggle");
            toastr.success(_app.constants.toastr.message.success.task, _app.constants.toastr.title.success);
            datatable.reload();
        },
        failure: function (e) {
            toastr.error(_app.constants.toastr.message.error.task, _app.constants.toastr.title.error);
            if (e.responseText != null) $("#edit_form_msg_txt").html(e.responseText);
            else $("#edit_form_msg_txt").html(_app.constants.ajax.message.error);
            $("#edit_form_msg").removeClass("m--hide").show();
        }
    };

    return {
        init: function () {
            datatable = $(".m-datatable").mDatatable(options);
            events.init();
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
    };
}();

$(function () {
    CareerTable.init();
});