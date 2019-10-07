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
            }
        ]
    }

    return {
        loadTable: function (id) {
            options.data.source.read.url = ("/profesor/correccion-notas/get/" + id).proto().parseURL();
            if (dataTable !== undefined) dataTable.destroy();
            dataTable = $(".m-datatable").mDatatable(options);
        },
        reloadTable: function() {
            dataTable.reload();
        }
    }

}();
var TermSelect = function () {
    return {
        init: function () {
            $.ajax({
                url: "/periodos/get".proto().parseURL(),
            }).done(function (data) {
                $("#select_term").select2({
                    data: data.items
                });

                if (data.selected !== null) {
                    $("#select_term").val(data.selected);
                    $("#select_term").trigger("change.select2");
                }

                RequestsTable.loadTable($("#select_term").val());

                $("#select_term").on("change", function (e) {
                    if ($("#select_term").val() != null) {
                        RequestsTable.loadTable($("#select_term").val());
                    }
                });
            });
        }
    }
}();
var SelectGroup = function () {
    var courseSelect;
    var sectionSelect;
    var studentSelect;
    var gradeSelect;
    return {
        courseInit: function () {
            $.ajax({
                url: "/profesor/correccion-notas/cursos/get".proto().parseURL()
            }).done(function (data) {
                courseSelect = $("#courses").select2({
                    minimumResultsForSearch: -1,
                    placeholder: "Seleccione un curso",
                    data: data.items,
                    dropdownParent: $("#request_modal")
                });

                sectionSelect = $("#section").select2({
                    minimumResultsForSearch: -1,
                    placeholder: "Seleccione una sección",
                    dropdownParent: $("#request_modal")
                });

                studentSelect = $("#student").select2({
                    minimumResultsForSearch: -1,
                    placeholder: "Seleccione un alumno",
                    dropdownParent: $("#request_modal")
                });

                gradeSelect = $("#GradeId").select2({
                    minimumResultsForSearch: -1,
                    placeholder: "Seleccione una evaluación",
                    dropdownParent: $("#request_modal")
                });

                $("#courses").on("change", function (e) {
                    if ($("#courses").val() != null) {
                        SelectGroup.sectionList($("#courses").val());
                    }
                });

                $("#section").on("change", function (e) {
                    if ($("#section").val() != null) {
                        SelectGroup.studentList($("#section").val());
                    }
                });

                $("#student").on("change", function (e) {
                    if ($("#student").val() != null) {
                        SelectGroup.gradeList($("#student").val());
                    }
                });
            });
        },
        sectionList: function (id) {
            $.ajax({
                url: ("/profesor/correccion-notas/secciones/get/" + id).proto().parseURL()
            }).done(function (data) {
                sectionSelect.empty();
                sectionSelect.select2({
                    minimumResultsForSearch: -1,
                    placeholder: "Seleccione una sección",
                    data: data.items
                });
                sectionSelect.val(null).trigger("change");

                studentSelect.empty();
                gradeSelect.empty();
            });
        },
        studentList: function (id) {
            $.ajax({
                url: ("/profesor/correccion-notas/alumnos/get/" + id).proto().parseURL()
            }).done(function (data) {
                studentSelect.empty();
                studentSelect.select2({
                    minimumResultsForSearch: -1,
                    placeholder: "Seleccione un alumno",
                    data: data.items
                });
                studentSelect.val(null).trigger("change");

                gradeSelect.empty();
            });
        },
        gradeList: function (id) {
            $.ajax({
                url: ("/profesor/correccion-notas/notas/get/" + id).proto().parseURL()
            }).done(function (data) {
                gradeSelect.empty();
                gradeSelect.select2({
                    minimumResultsForSearch: -1,
                    placeholder: "Seleccione una evaluación",
                    data: data.items
                });
                gradeSelect.val(null).trigger("change");
            });
        },
        resetSelects: function () {
            courseSelect.val(null).trigger("change.select2");
            sectionSelect.empty().trigger("change.select2");
            studentSelect.empty().trigger("change.select2");
            gradeSelect.empty().trigger("change.select2");
        }
    }
}();

var RequestForm = function () {
    var form;
    return {
        init: function() {
            form = $("#create-form").validate();
        },
        reset: function() {
            form.resetForm();
        }
    }
}();

jQuery(document).ready(function () {
    TermSelect.init();
    SelectGroup.courseInit();
    RequestForm.init();
});


var beginAjaxCall = function () {
    $(".btn-submit").each(function (index, element) {
        $(this).addLoader();
    });
}
var endAjaxCall = function () {
    $(".btn-submit").each(function (index, element) {
        $(this).removeLoader();
    });
}
var ajaxSuccess = function () {
    $("#request_modal").modal("hide");
    //RequestForm.reset();
    RequestsTable.reloadTable();
    toastr.success(_app.constants.toastr.message.success.task, _app.constants.toastr.title.success);
}
var createFailure = function (e) {
    if (e.responseText !== null && e.responseText !== "") $("#create_msg_txt").html(e.responseText);
    else $("#create_msg_txt").html(_app.constants.toastr.message.error.task);

    $("#create_msg").removeClass("m--hide").show();
}

$("#request_modal").on("hidden.bs.modal", function () {
    RequestForm.reset();
    SelectGroup.resetSelects();
    $("#create_msg").addClass("m--hide");
})