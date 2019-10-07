var Sections = function() {
    var courseDatatable = null;
    var sectionsDatatable = {};
    var classScheduleDatatable = {};
    var isTermLoaded = false;
    var isAcademicYearLoaded = false;

    var courseSettings = {
        responsive: true,
        processing: true,
        serverSide: true,
        ajax: {
            url: "/admin/secciones-profesores/cursos/get".proto().parseURL(),
            data: function (d) {
                d.tid = $(".select2-terms").val();
                d.acid = $(".select2-areacareers").val();
                d.ayid = $(".select2-academicyears").val();
            }
        },
        columns: [
            {
                className: "courses-details-control",
                orderable: false,
                data: null,
                defaultContent: ""
            },
            { title: "Código", data: "code" },
            { title: "Curso", data: "name" },
            { title: "Tipo", data: "courseType.name" },
            { title: "Área o Carrera", data: "areaCareer" },
            { title: "Créditos", data: "credits", className: "text-center" },
            { title: "N° de Secciones", data: "sectionCount", className: "text-center" }
        ]
    };

    var sectionsSettings = {
        responsive: true,
        processing: true,
        serverSide: true,
        ajax: {
            url: ""
        },
        columns: [
            {
                className: "sections-details-control",
                orderable: false,
                data: null,
                defaultContent: ""
            },
            { title: "Código", data: "code" },
            { title: "Profesor(es)", data: "teacherNames" },
            {
                title: "N° de Alumnos",
                data: "studentsCount",
                className: "text-center"
            },
            {
                title: "Opciones",
                data: null,
                render: function(data, type, row) {
                    return `<button data-id='${row.id
                        }' class='btn btn-info btn-sm m-btn m-btn--icon btn-teachersection'><span><i class='la la-cog'></i><span>Profesores</span></span></button>`;
                }
            }
        ]
    };

    var classSchedulesSettings = {
        responsive: true,
        processing: true,
        serverSide: false,
        ajax: {
            url: ""
        },
        columns: [
            {
                title: "Día", data: "weekDay",
                render: function(data, type, row) {
                    return _app.constants.date.serverDays[row.weekDay];
                }
            },
            { title: "Inicio", data: "startTimeText" },
            { title: "Fin", data: "endTimeText" },
            { title: "Aula", data: "classroom.description" },
            { title: "Sede", data: "classroom.building.campus.name" },
            {
                title: "Tipo de Sesión",
                data: "sessionType",
                className: "text-center",
                render: function(data, type, row) {
                    var sessionTypes = {
                        1: { text: _app.constants.sessionType.theory.text, value: _app.constants.sessionType.theory.value, class: "m-badge--info" },
                        2: { text: _app.constants.sessionType.practice.text, value: _app.constants.sessionType.practice.value, class: "m-badge--brand" },
                        3: { text: _app.constants.sessionType.virtual.text, value: _app.constants.sessionType.virtual.value, class: "m-badge--accent" },
                        4: { text: _app.constants.sessionType.seminar.text, value: _app.constants.sessionType.seminar.value, class: "m-badge--focus" }
                    };
                    return `<span class=\"m-badge ${sessionTypes[row.sessionType].class} m-badge--wide\">${sessionTypes[row.sessionType].text}</span>`;
                }
            },
            { title: "Profesor(es)", data: "teacherNames" },
            {
                title: "Opciones",
                data: null,
                render: function (data, type, row) {
                    return `<button data-id='${row.id
                        }' class='btn btn-info btn-sm m-btn m-btn--icon btn-teacherschedule'><span><i class='la la-cog'></i><span>Profesores</span></span></button>`;
                }
            }
        ]
    };

    var teacherSectionsSettings = {
        responsive: true,
        processing: true,
        serverSide: false,
        ajax: {
            url: ""
        },
        columns: [
            {
                title: "Principal", data: "isMainTeacher",
                render: function(data, type, row) {
                    return `<input type="radio" />`
                }
            },
            { title: "Profesor", data: "teacher.user.fullName" },
            {
                title: "Opciones",
                data: null,
                render: function (data, type, row) {
                    return `<button data-id='${row.id
                        }' class='btn btn-danger btn-sm m-btn m-btn--icon btn-delete-teachersection'><i class='la la-trash'></button>`;
                }
            }
        ]
    };

        var datatable = {
            courses: {
                init: function() {
                    courseDatatable = $("#courses-datatable").DataTable(courseSettings);
                    this.initEvents();
                },
                initEvents: function() {
                    courseDatatable.on("draw.dt",
                        function() {
                            var init = $(this).data("init");
                            if (!init) {
                                $(this).find("td.courses-details-control").addClass("m--font-brand")
                                    .html("<i style='width: 20px;' class='fa fa-caret-right'></i>");
                                $(this).data("init", true);
                            }
                        });

                    courseDatatable.on("click",
                        "td.courses-details-control",
                        function() {
                            var tr = $(this).closest("tr");
                            var row = courseDatatable.row(tr);

                            if (row.child.isShown()) {
                                // This row is already open - close it
                                row.child.hide();
                                tr.removeClass("shown");
                                $(this).html("<i style='width: 20px;' class='fa fa-caret-right'></i>");
                            } else {
                                // Open this row
                                $(this).html("<i style='width: 20px;' class='fa fa-caret-down'></i>");
                                var courseId = row.data().id;
                                var termId = $(".select2-terms").val();
                                row.child(datatable.sections.html(courseId, termId)).show();
                                tr.addClass("shown");
                                datatable.sections.init(courseId, termId);
                            }
                        });
                },
                reload: function() {
                    if (isTermLoaded && isAcademicYearLoaded) {
                        if (courseDatatable) {
                            $("#courses-datatable").data("init", false);
                            courseDatatable.ajax.reload();
                        } else {
                            this.init();
                        }
                    }
                }
            },
            sections: {
                init: function(courseId, termId) {
                    sectionsSettings.ajax.url =
                        `/admin/secciones-profesores/cursos/${courseId}/secciones/get?tid=${termId}`
                            .proto().parseURL();

                    sectionsDatatable[`${courseId}-${termId}`] = {
                        datatable: $(`#sections-${courseId}-${termId}`).DataTable(sectionsSettings),
                        init: false
                    };

                    sectionsDatatable[`${courseId}-${termId}`].datatable.on("draw.dt",
                        function() {
                            var init = sectionsDatatable[`${courseId}-${termId}`].init;
                            if (!init) {
                                $(this).find("td.sections-details-control").addClass("m--font-brand")
                                    .html("<i style='width: 20px;' class='fa fa-caret-right'></i>");
                                sectionsDatatable[`${courseId}-${termId}`].init = true;
                            }
                        });

                    sectionsDatatable[`${courseId}-${termId}`].datatable.on("click",
                        "td.sections-details-control",
                        function() {
                            var tr = $(this).closest("tr");
                            var row = sectionsDatatable[`${courseId}-${termId}`].datatable.row(tr);

                            if (row.child.isShown()) {
                                // This row is already open - close it
                                row.child.hide();
                                tr.removeClass("shown");
                                $(this).html("<i style='width: 20px;' class='fa fa-caret-right'></i>");
                            } else {
                                // Open this row
                                $(this).html("<i style='width: 20px;' class='fa fa-caret-down'></i>");
                                var sectionId = row.data().id;
                                row.child(datatable.classSchedules.html(sectionId)).show();
                                tr.addClass("shown");
                                datatable.classSchedules.init(sectionId);
                            }
                        });
            },
            html: function (courseId, termId) {
                return `<table style="box-shadow: 0 0px 15px 0 rgba(0, 0, 0, 0.2)" id="sections-${
                    courseId}-${termId
                    }" class="table table-bordered table-striped table-hover"></table>`;
            }
        },
        classSchedules: {
            init: function(sectionId) {
                classSchedulesSettings.ajax.url =
                    `/admin/secciones-profesores/cursos/0/secciones/${sectionId}/horarios/get`.proto().parseURL();
                classSchedulesSettings[`${sectionId}`] =
                    $(`#classschedules-${sectionId}`).DataTable(classSchedulesSettings);
            },
            html: function(sectionId) {
                return `<table style="box-shadow: 0 0px 15px 0 rgba(0, 0, 0, 0.2)" id="classschedules-${sectionId
                    }" class="table table-bordered table-striped table-hover"></table>`;
            }
        }
    };

    var select2 = {
        init: function() {
            this.terms.init();
            this.areaCareers.init();
        },
        terms: {
            init: function() {
                $.ajax({
                    url: "/periodos/get".proto().parseURL()
                }).done(function(result) {
                    $(".select2-terms").select2({
                        data: result.items,
                        minimumResultsForSearch: -1
                    }).on("change",
                        function() {
                            datatable.courses.reload();
                        });
                    isTermLoaded = true;
                    if (result.selected) {
                        $(".select2-terms").val(result.selected);
                    }
                    $(".select2-terms").trigger("change");
                });
            }
        },
        areaCareers: {
            init: function() {
                $.ajax({
                    url: "/areascarreras/get".proto().parseURL()
                }).done(function (result) {
                    $(".select2-areacareers").select2({
                        data: result.items
                    }).on("change", function () {
                        select2.academicYears.init($(this).val());
                    }).trigger("change");
                });
            }
        },
        academicYears: {
            init: function (careerId) {
                $(".select2-academicyears").empty();
                $(".select2-academicyears").prop("disabled", true);
                $.ajax({
                    url: `/carreras/${careerId}/curriculumactivo/niveles/get`.proto().parseURL()
                }).done(function (result) {
                    $(".select2-academicyears").append(new Option("Todos", 0, false, false)).trigger("change");
                    $(".select2-academicyears").select2({
                        minimumResultsForSearch: -1,
                        data: result.items
                    }).on("change",
                        function() {
                            datatable.courses.reload();
                        });
                    isAcademicYearLoaded = true;
                    if (result.items.length > 0) {
                        $(".select2-academicyears").prop("disabled", false);
                    }
                    $(".select2-academicyears").trigger("change");
                });
            }
        }
    };

    return {
        init: function() {
            select2.init();
        }
    }
}();

$(function() {
    Sections.init();
});