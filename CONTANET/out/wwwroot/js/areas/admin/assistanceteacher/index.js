var TermTable = function () {


    var datatable;
    var formCreate;
    var formEdit;
    var options = {
        data: {
            source: {
                read: {
                    method: "GET",
                    url: "/admin/asistencia-docente/get".proto().parseURL()
                }
            }
        },
        columns: [
            {
                field: "ind",
                title: "#",
                width: 20
            },
            {
                field: "fullName",
                title: "Profesor",
                width: 200
            },
            {
                field: "userName",
                title: "Código",
                width: 150
            },
            {
                field: "startDate",
                title: "Hora de Entrada",
                width: 120
            },
            {
                field: "endDate",
                title: "Hora de Salida",
                width: 120,
                template: function (row) {
                    if (row.endDate == "00:00:00")
                        return "--";
                    else
                        return row.endDate;
                }
            },
            {
                field: "status",
                title: "Estado",
                sortable: false,
                filterable: false,
                template: function (row) {
                    var tmp = '';
                    var options = {
                        0: { text: "Asistió" , value: 0, selected: '' },
                        1: { text: "Tardanza", value: 1, selected: '' },
                        2: { text: "Falta"   , value: 2, selected: '' }
                    };
                    options[row.status].selected = 'selected';
                    if (row.startDate != "--" || row.status == 2)
                        tmp += '<select disabled id="input_' + row.teacherId + '" class="form-control " ';
                    else
                        tmp += '<select id="input_' + row.teacherId + '" class="form-control " ';
                    tmp += 'name = "assists[' + row.status + '].Status" value = "' + row.status + '" > ';
                    tmp += '<option ' + options[0].selected + ' value="' + options[0].value + '" >' + options[0].text + '</option>';
                    tmp += '<option ' + options[1].selected + ' value="' + options[1].value + '" >' + options[1].text + '</option>';
                    tmp += '<option ' + options[2].selected + ' value="' + options[2].value + '" >' + options[2].text + '</option>';
                    tmp += '</select>';
                    return tmp;
                }
            },
            {
                field: "",
                title: "Marcar Asistencia",
                sortable: false,
                filterable: false,
                template: function (row) {
                    if (row.endDate == "--" && row.status != 2)
                        return '<button data-id="' + row.teacherId + '" class="btn btn-info btn-sm m-btn m-btn--icon register"><span> Registrar </span></button>';
                    else
                        return '<button disabled data-id="' + row.teacherId + '" class="btn btn-info btn-sm m-btn m-btn--icon register"><span> Registrar </span></button>';
                }
            }
        ]
    };

    var exportExcel = function () {
        $(".btn-excel").on('click', function (e) {
            e.preventDefault();
            var $btn = $(this);
            $btn.addLoader();
            $.fileDownload(`/admin/asistencia-docente/exportar-excel`.proto().parseURL(), {
                httpMethod: 'GET', successCallback: function (url) {
                    $btn.removeLoader();
                    toastr.success("Archivo descargado satisfactoriamente", "Éxito");
                },
                failCallback: function (responseHtml, url) {
                    $btn.removeLoader();
                    toastr.error("", "Error");
                }
            });
        });
    };


    var registerTeacherAssist = function (id,value) {
        $.ajax({
            url: "/admin/asistencia-docente/register/post",
            type: "POST",
            data: {
                id: id,
                estado: value
            },
            success: function () {
                datatable.reload();
                toastr.success(_app.constants.toastr.message.success.task, _app.constants.toastr.title.success);
            },
            error: function () {
                toastr.error("Error al registrar la asitencia del docente", _app.constants.toastr.title.error);
            }
        });
    };

    return {
        init: function () {
            datatable = $(".m-datatable").mDatatable(options);
            exportExcel();
            $(".m-datatable")
                .on("click", ".register", function () {
                    var id = $(this).data("id");
                    var value = this.parentNode.parentNode.parentNode.children[5].children[0].children[0].value;
                    registerTeacherAssist(id,value);
                })
                .on("click", ".edit", function () {
                    var id = $(this).data("id");
                    loadTermData(id);
                });
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
        //$("#create_modal").modal("hide");
        //$("#edit_modal").modal("hide");
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
 
var Assistance = function () {
    var formValidate;

    var form = {
        submit: function (formElement) {
            var formData = new FormData($(formElement).get(0));
            $("#assistance input").attr("disabled", true);
            $("#btnSave").addLoader();
            $(".custom-file").append("<div id='space-bar' class='m--space-10'></div><div class='progress m-progress--sm'><div class='progress-bar progress-bar-striped progress-bar-animated m--bg-primary' role='progressbar'></div></div>");
            $(".progress-bar").width("0%");
            $.ajax({
                data: formData,
                type: "POST",
                contentType: false,
                processData: false,
                url: $(formElement).attr("action"),
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
                }
                }).always(function () {
                    $("#assistance input").attr("disabled", false);
                    $("#btnSave").removeLoader();
                    $(".progress").empty().remove();
                    $("#space-bar").remove();
                })
                .done(function (result) {
                    $("#assistance").resetForm();
                    $("#input-file").next().html('');

                    toastr.success(_app.constants.toastr.message.success.task, _app.constants.toastr.title.success);
                })
                .fail(function () {
                    toastr.error(_app.constants.toastr.message.error.task, _app.constants.toastr.title.error);
                    if (e.responseText != null) $("#alert-text").html(e.responseText);
                    else $("#alert-text").html(_app.constants.toastr.message.error.task);
                    $("#m-form_alert").removeClass("m--hide").show();
                    mApp.scrollTop();
                });
        }
    };

    var events = {
        init: function () {
            $("#input-file").on('change', function () {
                let fileName = $(this).val();
                $(this).next().next().html(fileName);
            });
        }
    };

    var validate = {
        init: function () {
            formValidate = $("#assistance").validate({
                submitHandler: function (formElement) {
                    form.submit(formElement);
                }
            });
        }
    };

    return {
        init: function () {
            validate.init();
            events.init();
        }
    }
}(); 

jQuery(document).ready(function () {
    TermTable.init();
    Assistance.init();
});