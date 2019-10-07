var ReportCourse = function() {
    var courseDatatable = null;
    var sectionsDatatable = null;
    var syllabusId = null;

    var courseSettings = {
        responsive: true,
        processing: true,
        serverSide: true,
        ajax: {
            url: "/admin/reporte-silabo/cursos/get".proto().parseURL(),
            data: function(d) {
                d.termId = $(".select2-terms").val();
            }
        },
        columns: [
            { title: "Código", data: "code" },
            { title: "Curso", data: "name" },
            { title: "Tipo", data: "courseType.name" },
            { title: "Área o Carrera", data: "areaCareer" },
            {
                title: "Opciones",
                sortable: false,
                orderable: false,
                render: function (data, type, row) {
                    var tmp = "";
                    if (row.syllabusId) {
                        tmp =
                            `<button data-id='${row.id}' data-syllabusid='${row.syllabusId
                            }' class='btn btn-info btn-sm m-btn m-btn--icon btn-sections'><span><i class='la la-list'></i><span>Ver Secciones</span></span></button> `;
                    } else {
                        tmp = "No tiene Sílabo";
                    }
                    return tmp;
                }
            }
        ]
    };

    var sectionSettings = {
        responsive: true,
        processing: true,
        serverSide: true,
        ajax: {
            url: ""
        },
        columns: [
            { title: "Código", data: "code" },
            {
                title: "Profesor(es)",
                data: "teacherNames",
                render: function (data, type, row) {
                    var tmp = "";
                    if (row.teacherNames.length === 0) {
                        tmp = "No Asignado";
                    }
                    row.teacherNames.forEach(function(e, index) {
                        tmp += e + "</br>";
                    });
                    return tmp;
                }
            },
            { title: "Alumnos", data: "studentsCount" },
            {
                title: "Opciones",
                sortable: false,
                orderable: false,
                render: function (data, type, row) {
                    return `<button data-sectionid='${row.id
                        }' class='btn btn-brand btn-sm m-btn--icon btn-report'><span><i class='la la-eye'></i><span>Ver Reporte</span></button>`;
                }
            }
        ]
    };

    var datatable = {
        courses: {
            init: function () {
                courseDatatable = $("#m-datatable").DataTable(courseSettings);
                this.initEvents();
            },
            initEvents: function () {
                courseDatatable.on("click",
                    ".btn-sections",
                    function () {
                        syllabusId = $(this).data("syllabusid");
                        var courseId = $(this).data("id");
                        $("#sections-modal").modal("show");
                        $("#sections-modal").one("shown.bs.modal",
                            function() {
                                datatable.sections.init(courseId);
                            });
                        $("#sections-modal").one("hidden.bs.modal",
                            function() {
                                datatable.sections.destroy();
                            });
                    });
            }
        },
        sections: {
            init: function (courseId) {
                sectionSettings.ajax.url =
                    `/admin/reporte-silabo/cursos/${courseId}/periodo/${$(".select2-terms").val()}/secciones/get`.proto()
                    .parseURL();
                sectionsDatatable = $("#sections-datatable").DataTable(sectionSettings);
                this.initEvents();
            },
            initEvents: function() {
                sectionsDatatable.on("click",
                    ".btn-report",
                    function () {
                        var sectionId = $(this).data("sectionid");
                        location.href = `/admin/reporte-silabo/${syllabusId}/seccion/${sectionId}`.proto().parseURL();
                    });
            },
            destroy: function() {
                if (sectionsDatatable !== null) {
                    sectionsDatatable.destroy();
                    sectionsDatatable.empty();
                    sectionsDatatable = null;
                }
            }
        }
    };

    var select = {
        init: function () {
            this.terms.initEvents();
            this.terms.init();
        },
        terms: {
            init: function () {
                $.ajax({
                    url: "/periodos/get".proto().parseURL()
                }).done(function(result) {
                    $(".select2-terms").select2({
                        data: result.items,
                        placeholder: "Período"
                    });
                    $(".select2-terms").val(result.selected).trigger("change");
                });
            },
            initEvents: function() {
                $(".select2-terms").on("change",
                    function () {
                        if (courseDatatable) {
                            courseDatatable.ajax.reload();
                        } else {
                            datatable.courses.init();
                        }
                    });
            }
        }
    };

    return {
        init: function () {
            select.init();
        }
    }
}();

$(function() {
    ReportCourse.init();
});