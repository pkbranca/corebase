var CourseTermTable = function () {
    var datatable;  
    $("#select_term").trigger("change");
    $("#select_career").trigger("change");
    var termid = $("#select_term").val();
    var careerid = $("#select_career").val();
    console.log(`${termid} ${careerid}`);
    var options = {
        search: {
            input: $('#search')
        },
        data: {
            type: 'remote',
            source: {
                read: {
                    method: 'GET',
                    url: `/admin/coordinador-docente/get/${termid}/${careerid}`.proto().parseURL()
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
                field: 'course',
                title: 'Curso',
                width: 120
            },
            {
                field: 'coordinator',
                title: 'Coordinador',
                width: 120
            },
            {
                field: 'options',
                title: 'Opciones',
                width: 200,
                sortable: false,
                filterable: false,
                template: function (row) {
                    if (row.coordinator === "--") {
                        return '<button data-courseid="' + row.courseId + '" data-coursetermid="' + row.courseTermId + '" class="btn btn-success btn-sm m-btn m-btn--icon btn-add" data-toggle="modal" data-target="#modal-add" title="Agregar"><span><i class="la la-plus"></i><span>Agregar</span></span></button>'
                    }
                    else {
                        return '<button data-courseid="' + row.courseId + '" data-coursetermid="' + row.courseTermId + '" class="btn btn-primary btn-sm m-btn m-btn--icon btn-edit" data-toggle="modal" data-target="#modal-edit" title="Editar"><span><i class="la la-edit"></i><span>Editar</span></span></button>'
                    }
                }
            }
        ]
    };
    var events = {
        init: function () {

            $("#add").on('click', function (e) {
                e.preventDefault(); 
                $(this).addLoader();
                $.ajax({
                    url: ('/admin/coordinador-docente/agregar').proto().parseURL(),
                    type: 'POST',
                    data: $("#add-form").serialize(),
                    success: function () {
                        toastr.success(_app.constants.toastr.message.success.task, "Guardado");
                        $("#add").removeLoader();
                        datatable.reload();
                    },
                    error: function () {
                        toastr.error(_app.constants.toastr.message.error.task, "Error");
                    }
                });
            });

            $("#edit").on('click', function (e) {
                e.preventDefault();
                $(this).addLoader();
                $.ajax({
                    url: ('/admin/coordinador-docente/editar').proto().parseURL(),
                    type: 'POST',
                    data: $("#edit-form").serialize(),
                    success: function () {
                        toastr.success(_app.constants.toastr.message.success.task, "Guardado");
                        $("#edit").removeLoader();
                        datatable.reload();
                    },
                    error: function () {
                        toastr.error(_app.constants.toastr.message.error.task, "Error");
                    }
                });
            });
           
        }
    };

    var datatableEvents = function () {

        datatable.on('click', '.btn-add', function () {
            var courseid = $(this).data('courseid');
            var coursetermid = $(this).data('coursetermid');
            $("#CourseId").val(courseid);
            $("#CourseTermId").val(coursetermid);
            $("#TermId").val($("#select_term").val());
        });

        datatable.on('click', '.btn-edit', function () {
            var courseid = $(this).data('courseid');
            var coursetermid = $(this).data('coursetermid');
            $("#CourseIdEdit").val(courseid);
            $("#CourseTermIdEdit").val(coursetermid);
            $("#TermIdEdit").val($("#select_term").val());
            loadSelect2.teacheredit.init(coursetermid);
        });
    };
    var reloadDatatable = function () {
        if (datatable !== undefined) {
            datatable.destroy();
        }
        termid = $("#select_term").val();
        careerid = $("#select_career").val();
        options.data.source.read.url = `/admin/coordinador-docente/get/${termid}/${careerid}`.proto().parseURL();
        datatable = $(".m-datatable").mDatatable(options);
        datatableEvents();
    };


    var loadSelect2 = {
        init: function () {
            this.term.init();
            this.faculty.init();  
            this.teacher.init();
        },
        term: {
            init: function () {
                $.ajax({
                    url: ("/periodos/get").proto().parseURL()
                }).done(function (data) {
                    $("#select_term").select2({
                        data: data.items
                    }).on("change", function () {
                    });
                    if (data.selected !== null) { 
                        $("#select_term").val(data.selected);
                        $("#select_term").trigger("change");
                    }
                    $("#select_term").on("change", function (e) {
                        reloadDatatable();
                    });
                });
            }
        },
        faculty: {
            init: function () {
                $.ajax({
                    url: ("/facultades/get").proto().parseURL()
                }).done(function (data) {
                    $("#select_faculty").select2({
                        data: data.items
                    }); 
                    $("#select_faculty").on('change', function (e) {
                        loadSelect2.career.init();
                    });
                    if (data.selected !== null) {
                        $("#select_faculty").val(data.selected);
                        $("#select_faculty").trigger("change");
                    }
                });
            }
        },
        career: {
            init: function () {
                $("#select_career").empty();
                $.ajax({
                    url: ("/facultades/" + $("#select_faculty").val() + "/carreras/get").proto().parseURL()
                }).done(function (data) { 

                    $("#select_career").select2({
                        data: data.items
                    });
                    $("#select_career").on('change', function (e) {
                        reloadDatatable();
                    });
                    if (data.selected !== null) {
                        $("#select_career").val(data.selected);
                        $("#select_career").trigger("change");
                    }
                });
            }
        },
        teacher: {
            init: function () {
                $.ajax({
                    url: ("/profesores/get").proto().parseURL()
                }).done(function (data) {
                    $("#select_teacher").select2({
                        data: data.items
                    });
                });
            }
        },
        teacheredit: {
            init: function (coursetermid) { 
                console.log(coursetermid);
                $.ajax({
                    url: (`/admin/coordinador-docente/editar-coordinador/get/${coursetermid}`).proto().parseURL()
                }).done(function (data) {
                    console.log(data);
                    $("#select_teacher_edit").select2({
                        data: data.items
                    });
                    if (data.selected !== null) {
                        $("#select_teacher_edit").val(data.selected);
                        $("#select_teacher_edit").trigger("change");
                    }
                });
            }
        }
    };

    datatable = {
        init: function () {
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
            loadSelect2.init();
            datatable = $('.m-datatable').mDatatable(options);
            events.init();
        }
    }
}();

$(function () {
    CourseTermTable.init();
});