var CourseTable = function () {
    var courseDatatable = null;

    var options = {
        search: {
            input: $("#search")
        },
        data: {
            source: {
                read: {
                    method: "GET",
                    url: "/admin/curso/get".proto().parseURL()
                }
            },
            pageSize: 10,
            saveState: {
                cookie: true,
                webstorage: true
            }
        },
        columns: [
            {
                field: "code",
                title: "Código",
                width: 120
            },
            {
                field: "name",
                title: "Nombre",
                width: 200
            },
            {
                field: "areaCareer",
                title: "Área o Carrera",
                width: 180
            },
            {
                field: "type",
                title: "Tipo",
                width: 180
            },
            {
                field: "options",
                title: "Opciones",
                width: 200,
                sortable: false,
                filterable: false,
                template: function (row) {
                    var tmp = "";
                    if (row.canEdit) {
                        tmp += '<button data-id="' +
                            row.id +
                            '" class="btn btn-brand btn-sm m-btn m-btn--icon btn-edit" title="Sílabo"><span><i class="la la-cog"></i><span>Gestionar</span></span></button>';
                    } else {
                        if (row.hasSylabus) {
                            tmp += '<button data-id="' +
                                row.id +
                                '" class="btn btn-brand btn-sm m-btn m-btn--icon btn-watch-detail" title="Sílabo"><span><i class="la la-cog"></i><span>Ver</span></span></button>';
                        }
                    }
                    return tmp;
                }
            }
        ]
    };

    var events = {
        init: function () {
            courseDatatable.on("click", ".btn-edit", function () {
                var aux = $(this);
                var id = aux.data("id");
                location.href = `/admin/cursos/${id}/periodo/${$(".select2-terms").val()}`.proto().parseURL();
            });

            courseDatatable.on("click", ".btn-watch-detail", function () {
                var cid = $(this).data("id");
                var code = $(this).data("code");
                var name = $(this).data("name");
                var pid = $(".select2-terms").val();
                var courseinfo = code + "-" + name;
                $("#modal-course-term-detail-label").html("Detalle del Curso " + courseinfo);
                $("#tabContent a").first().addClass("active").addClass("show");
                $("#general").addClass("active").addClass("show");
                $("#course_term_detail_modal").modal("toggle");
                $("#course_term_detail_modal").one("shown.bs.modal", function (e) {
                    mApp.block("#course_term_detail_modal .modal-content", { type: "loader", message: "Cargando..." });
                    $.ajax({
                        url: `/admin/cursos/${cid}/periodo/${pid}/get`.proto().parseURL()
                    }).done(function (data) {
                        var formElements = $("#course-term-detail-form").get(0).elements;
                        formElements["DetailCourseId"].value = cid;
                        formElements["DetailTermId"].value = pid;
                        formElements["DetailCourse"].value = data.course;
                        formElements["DetailTerm"].value = data.term;
                        formElements["DetailWeekHours"].value = data.weekhours;
                        formElements["DetailCredits"].value = data.credits;
                        $("#modal-course-term-detail-label").html("Detalle del Curso " + courseinfo + "&emsp;|&emsp;Período " + data.term);
                        evaluationOptions.data.source.read.url = "/admin/cursos/" + cid + "/periodo/" + pid + "/evaluaciones/get";
                        sectionOptions.data.source.read.url = "/admin/cursos/" + cid + "/periodo/" + pid + "/secciones/get";
                        datatableDetailEvaluation = $(".m-datatable-evaluations").mDatatable(evaluationOptions);
                        datatableDetailSection = $(".m-datatable-sections").mDatatable(sectionOptions);
                        mApp.unblock("#course_term_detail_modal .modal-content");
                    });
                });
                $("#course_term_detail_modal").one("hidden.bs.modal", function (e) {
                    datatableDetailEvaluation.destroy();
                    datatableDetailSection.destroy();
                    var formElements = $("#course-term-detail-form").get(0).elements;
                    formElements["DetailCourse"].value = null;
                    formElements["DetailCourseId"].value = null;
                    formElements["DetailTerm"].value = null;
                    formElements["DetailTermId"].value = null;
                    formElements["DetailWeekHours"].value = null;
                    formElements["DetailCredits"].value = null;
                    $("#tabContent a").removeClass("active").removeClass("show");
                    $(".tab-pane").removeClass("active").removeClass("show");
                });
            });
        }
    };

    var evaluationOptions = {
        data: {
            source: {
                read: {
                    method: "GET",
                    url: ""
                }
            }
        },
        columns: [
            {
                field: "name",
                title: "Nombre",
                width: 160
            },
            {
                field: "percentage",
                title: "Porcentaje (%)",
                template: "{{percentage}} %",
                width: 150,
                textAlign: "center"
            },
            {
                field: "retrievable",
                title: "Recuperable",
                width: 150,
                textAlign: "center",
                template: function (row) {
                    var status = {
                        1: { "title": "Recuperable", "class": " m-badge--success" },
                        2: { "title": "No Recuperable", "class": " m-badge--danger" }
                    };
                    var index = row.retrievable ? 1 : 2;
                    return "<span class='m-badge " + status[index].class + " m-badge--wide'>" + status[index].title + "</span>";
                }
            }
        ]
    };

    var subTableSchedulesInit = function (e) {
        var cid = $("#DetailCourseId").val();
        var pid = $("#DetailTermId").val();

        $("<div/>").attr("id", "child_data_schedule_" + e.data.id).appendTo(e.detailCell).mDatatable({
            data: {
                type: "remote",
                source: {
                    read: {
                        url: "/admin/cursos/" + cid + "/periodo/" + pid + "/secciones/" + e.data.id + "/horariosclase/get"
                    },
                },
                pageSize: 10,
                saveState: {
                    cookie: true,
                    webstorage: true
                }
            },

            // layout definition
            layout: {
                theme: "default",
                class: "",
                scroll: true,
                height: 300,
                footer: false,

            },

            sortable: true,
            pagination: true,
            toolbar: {
                // toolbar items
                items: {
                    // pagination
                    pagination: {
                        // page size select
                        pageSizeSelect: [10, 20, 30, 50, 100],
                    },
                    info: false
                },
            },
            // columns definition
            columns: [
                {
                    field: "weekday",
                    title: "Día",
                    width: 70,
                },
                {
                    field: "time",
                    title: "Horario",
                    template: function (row) {
                        var hour = Math.floor(row.duration);
                        var minutes = row.duration % 1;
                        return "De " + row.startTime + "</br>a " + row.endTime + ((minutes === 0) ? (" (" + hour + "h)") : ("</br>(" + hour + "h " + minutes * 60 + "m)"));
                    },
                    width: 120,
                },
                {
                    field: "teacher",
                    title: "Profesor(es)",
                    width: 250,
                    responsive: {
                        visible: "md",
                        hidden: "sm"
                    },
                    template: function (row) {
                        var tmp = "";
                        if (row.teacher) {
                            row.teacher.split("\r\n").forEach(function (item) {
                                tmp += item + "<br/>";
                            });
                        }
                        return tmp;
                    }
                },
                {
                    field: "classroom",
                    title: "Aula",
                    width: 40,
                    textAlign: "center"
                }
            ]
        });
    };

    var sectionOptions = {
        data: {
            type: "remote",
            source: {
                read: {
                    method: "GET",
                    url: ""
                },
            },
            pageSize: 10,
            saveState: {
                cookie: true,
                webstorage: true,
            },
        },
        detail: {
            title: "Cargar Horarios",
            content: subTableSchedulesInit,
        },
        columns: [
            {
                field: "id",
                title: "",
                sortable: false,
                width: 20
            },
            {
                field: "code",
                title: "Código",
                width: 80
            },
            {
                field: "teacher",
                title: "Profesor(a)",
                width: 300
            },
            {
                field: "vacancies",
                title: "Max. Vacantes",
                width: 150,
                textAlign: "center"
            }
        ]
    };

    var select = {
        init: function() {
            this.terms.init();
        },
        terms: {
            init: function() {
                $.ajax({
                    url: "/periodos/get".proto().parseURL()
                }).done(function(result) {
                    $(".select2-terms").select2({
                        data: result.items
                    }).on("change", function() {
                        datatable.init();
                    });
                    if (result.selected) {
                        $(".select2-terms").val(result.selected);
                    }
                    $(".select2-terms").trigger("change");
                });
            }
        }
    }

    var datatable = {
        init: function() {
            if (courseDatatable !== null) {
                courseDatatable.destroy();
                courseDatatable = null;
            }
            options.data.source.read.url = `/admin/cursos/get?tid=${$(".select2-terms").val()}`.proto().parseURL();
            courseDatatable = $(".m-datatable").mDatatable(options);
            events.init();
        }
    }

    return {
        init: function () {
            select.init();
        }
    }
}();

$(function () {
    CourseTable.init();
});