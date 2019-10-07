var ClassSchedule = function () {
    var datatableClass = null;
    var formScheduleValidate = $("#class-schedule-form").validate();

    var options = {
        search: {
            input: $("#searchClass"),
        },
        data: {
            type: "remote",
            source: {
                read: {
                    method: "GET",
                    url: ""
                }
            }
        },
        columns: [
            {
                field: "weekday",
                title: "Día",
                sortable: false,
                width: 70,
            },
            {
                field: "time",
                title: "Horario",
                sortable: false,
                template: function (row) {
                    var hour = Math.floor(row.duration);
                    var minutes = row.duration % 1;
                    var tmp = "De " + row.startTime + "</br>a " + row.endTime + ((minutes === 0) ? (" (" + hour + "h)") : ("</br>(" + hour + "h " + minutes * 60 + "m)"));
                    return tmp;
                },
                width: 120,
            },
            {
                field: "sessionType",
                title: "Tipo",
                width: 90,
                template: function(row) {
                    var sessionTypes = {
                        1: { text: _app.constants.sessionType.theory.text, value: _app.constants.sessionType.theory.value, class: "m-badge--info" },
                        2: { text: _app.constants.sessionType.practice.text, value: _app.constants.sessionType.practice.value, class: "m-badge--brand" },
                        3: { text: _app.constants.sessionType.virtual.text, value: _app.constants.sessionType.virtual.value, class: "m-badge--accent" },
                        4: { text: _app.constants.sessionType.seminar.text, value: _app.constants.sessionType.seminar.value, class: "m-badge--focus" }
                    };
                    return `<span class=\"m-badge ${sessionTypes[row.sessionType].class} m-badge--wide\">${sessionTypes[row.sessionType].text}</span>`;
                }
            },
            {
                field: "teacher",
                title: "Profesor(es)",
                sortable: false,
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
                sortable: false,
                width: 60,
                textAlign: "center"
            },
            {
                field: "options",
                title: "Opciones",
                width: 130,
                sortable: false, // disable sort for this column
                filterable: false, // disable or enable filtering
                template: function (row) {
                    return `<button type=\"button\" data-id="${row.id}" class=\"btn btn-info btn-sm m-btn m-btn--icon btn-edit\"><span><i class=\"la la-edit\"></i><span>Editar</span></span></button> <button type=\"button\" data-id=\"${row.id}" class=\"btn btn-danger btn-sm m-btn m-btn--icon btn-delete\"><i class=\"la la-trash\"></i></button>`;
                }
            }
        ]
    };

    var events = {
        init: function () {
            datatableClass.on("click", ".btn-delete", function () {
                var id = $(this).data("id");
                swal({
                    title: "¿Está seguro?",
                    text: "El horario será eliminado permanentemente",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Sí, eliminarlo",
                    confirmButtonClass: "btn btn-danger m-btn m-btn--custom",
                    cancelButtonText: "Cancelar",
                    showLoaderOnConfirm: true,
                    allowOutsideClick: () => !swal.isLoading(),
                    preConfirm: () => {
                        return new Promise((resolve) => {
                            $.ajax({
                                url: location.href + "/secciones/horariosclase/eliminar/post",
                                type: "POST",
                                data: {
                                    id: id
                                },
                                success: function (result) {
                                    datatableClass.reload();
                                    swal({
                                        type: "success",
                                        title: "Completado",
                                        text: "El horario ha sido eliminado con éxito",
                                        confirmButtonText: "Excelente"
                                    });
                                },
                                error: function (errormessage) {
                                    swal({
                                        type: "error",
                                        title: "Error",
                                        confirmButtonClass: "btn btn-danger m-btn m-btn--custom",
                                        confirmButtonText: "Entendido",
                                        text: "Al parecer el horario tiene información relacionada"
                                    });
                                }
                            });
                        });
                    }
                });
            });

            datatableClass.on("click", ".btn-edit", function () {
                var id = $(this).data("id");
                update.init(id, $(this).get(0));
            });
        }
    }

    var load = function (id, section) {
        create.init();
        var title = $("#course_title").html();
        var course_code = $("#course_code").html();
        var course_name = $("#course_name").html();
        var term_name = $("#term_name").html();

        // & emsp;|& emsp; " + course_code + " - " + course_name + "(" + term_name + ")"

        var finalTitle = "Horarios de la Sección " + section ;
        $("#btnCancelEdit").hide();
        $("#modal-class-schedule-label").html(finalTitle);
        $("#Fields_SectionId").val(id);
        $("#Fields_EndTime, #Fields_StartTime").timepicker("setTime", "7:00 AM");

        select2.reset();
        select2.load(id);

        $("#class_schedule_modal").one("shown.bs.modal", function (e) {
            select2.classrooms.load();
            options.data.source.read.url = location.href + "/secciones/" + id + "/horariosclase/get";
            if (datatableClass === null) {
                datatableClass = $(".m-datatable-class").mDatatable(options);
                events.init();
            }
        });
        $("#class_schedule_modal").one("hidden.bs.modal", function (e) {
            if (datatableClass !== null) {
                datatableClass.destroy();
                datatableClass = null;
            }
            form.reset();
            $("#modal-class-schedule-label").html("");
        });

        $("#class_schedule_modal").modal("toggle");

        $("#btnCleanTeachers").click(function (e) {
            select2.reset();
        });
        $(".m-datatable-class").on("m-datatable--on-layout-updated", function (e) {
            form.reset();
        });
    }

    var select2 = {
        load: function (id) {
            $("#Fields_SelectedTeachers").empty();
            $.ajax({
                url: `/seccion/${id}/profesores/get`.proto().parseURL()
            }).done(function(result) {
                $("#Fields_SelectedTeachers").select2({
                    placeholder: "Profesor(es)",
                    allowClear: false,
                    minimumInputLength: 0,
                    width: "90%",
                    data: result.items
                });
            });

            $(".select2-classrooms").select2({
                placeholder: "Aula",
                data: null
            });
            $("#Fields_WeekDay").select2({
                minimumResultsForSearch: -1
            });
            $("#Fields_SessionType").select2({
                minimumResultsForSearch: -1
            });
            this.classrooms.load();
        },
        classrooms: {
            load: function () {
                mApp.block("#class_schedule_modal .modal-content", { type: "loader", message: "Cargando..." });
                $.ajax({
                    url: ("/aulas/get").proto().parseURL()
                }).done(function (data) {
                    $(".select2-classrooms").select2({
                        placeholder: "Aula",
                        data: data.items
                    });
                    mApp.unblock("#class_schedule_modal .modal-content");
                });
            }
        },
        reset: function () {
            $("#Fields_SelectedTeachers").val(null).trigger("change");
        }
    }

    var form = {
        reset: function () {
            var sectionid = $("#Fields_SectionId").val();
            formScheduleValidate.resetForm();
            $("#form_class_msg_txt").html();
            $("#form_class_msg").addClass("m--hide").hide();
            $("#Fields_StartTime, #Fields_EndTime").timepicker().timepicker("setTime", "7:00 AM");
            $("#Fields_SectionId").val(sectionid);
            $("#Fields_SessionType").prop("selectedIndex", 0).trigger("change");

            select2.reset();
            update.cancel();
            create.init();
        }
    }

    var create = {
        init: function () {
            $("#class-schedule-form").attr("action", location.href + "/secciones/horariosclase/crear/post");
			$("#Fields_WeekDay").attr("name", "WeekDay");
			$("#Fields_StartTime").attr("name", "StartTime");
			$("#Fields_EndTime").attr("name", "EndTime");
			$("#Fields_ClassroomId").attr("name", "ClassroomId");
			$("#Fields_SelectedTeachers").attr("name", "SelectedTeachers");
            $("#Fields_SectionId").attr("name", "SectionId");
            $("#Fields_SessionType").attr("name", "SessionType");

			var form = $("#class-schedule-form");
            form.data("ajax-begin", this.begin);
            form.data("ajax-complete", this.complete);
            form.data("ajax-success", this.success);
            form.data("ajax-failure", this.failure);
        },
        begin: function () {
            $("div#class_schedule_modal input, div#class_schedule_modal select").attr("disabled", true);
            $("#btnCleanTeachers").attr("disabled", true);
            $("#btnCancelEdit").attr("disabled", true);
			$("#btnSaveClassSchedule").addLoader();
        },
        complete: function () {
            $("div#class_schedule_modal input, div#class_schedule_modal select").attr("disabled", false);
            $("#btnCleanTeachers").attr("disabled", false);
            $("#btnCancelEdit").attr("disabled", false);
			$("#btnSaveClassSchedule").removeLoader();
        },
        success: function (e) {
            toastr.success(_app.constants.toastr.message.success.task, _app.constants.toastr.title.success);
            form.reset();
            datatableClass.reload();
        },
        failure: function (e) {
            toastr.error(_app.constants.toastr.message.error.task, _app.constants.toastr.title.error);
			if(e.responseText != null) $("#form_class_msg_txt").html(e.responseText);
			else $("#form_class_msg_txt").html(_app.constants.ajax.message.error);
            $("#form_class_msg").removeClass("m--hide").show();
        }
    }   
    
    var update = {
        init: function (id, btn) {
            $("#class-schedule-form").attr("action", location.href + "/secciones/horariosclase/editar/post");
            $("#Fields_WeekDay").attr("name", "Fields.WeekDay");
            $("#Fields_StartTime").attr("name", "Fields.StartTime");
            $("#Fields_EndTime").attr("name", "Fields.EndTime");
            $("#Fields_ClassroomId").attr("name", "Fields.ClassroomId");
            $("#Fields_SelectedTeachers").attr("name", "Fields.SelectedTeachers");
            $("#Fields_SectionId").attr("name", "Fields.SectionId");
            $("#Fields_SessionType").attr("name", "Fields.SessionType");

            var formSchedule = $("#class-schedule-form");
            formSchedule.data("ajax-begin", this.begin);
            formSchedule.data("ajax-complete", this.complete);
            formSchedule.data("ajax-success", this.success);
            formSchedule.data("ajax-failure", this.failure);

            mApp.block("#class_schedule_modal .modal-content", { type: "loader", message: "Cargando..." });
            var tr = btn.parentElement.parentElement.parentElement;
            var iseven = tr.classList.contains("m-datatable__row--even");
            if (iseven) {
                $(tr).removeClass("m-datatable__row--even").addClass("bg-selected").addClass("even-selected")
                    .removeClass("m-datatable__row--hover");
            } else {
                $(tr).addClass("bg-selected").removeClass("m-datatable__row--hover");
            }
            
            $(".m-datatable-class").on("mouseover", ".bg-selected", function (e) {
                e.preventDefault();
                $(this).addClass("bg-selected").removeClass("m-datatable__row--hover");
            });
            $(tr.parentElement).find(".btn").attr("disabled", true);
            $("#btnCancelEdit").show();
            $("#btnCancelEdit").on("click", function () {
                form.reset();
            });
            $("#btnSaveClassSchedule").html("<span><i class=\"la la-save\"></i><span>Guardar Horario</span></span>");

            $.ajax({
                url: ("/admin/cursos/horariosclase/" + id + "/get").proto().parseURL(),
                type: "GET",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    var formElements = $("#class-schedule-form").get(0).elements;
                    formElements["ClassScheduleId"].value = id;
                    formElements["Fields_SectionId"].value = result.sectionid;
                    $("#Fields_StartTime").timepicker("setTime", result.startTime);
                    $("#Fields_EndTime").timepicker("setTime", result.endTime);
                    $("#Fields_WeekDay").val(result.weekday).trigger("change");
                    $("#Fields_ClassroomId").val(result.classroomid).trigger("change");
                    $("#Fields_SessionType").val(result.sessionType).trigger("change");
                    $("#Fields_SelectedTeachers").val(null).trigger("change");
                    if (result.teacher) {
                        $("#Fields_SelectedTeachers").val(result.teacher).trigger("change");
                        //result.teacher.forEach(function (item) {
                        //    var opt = new Option(item.text, item.id, true, true);
                        //    $("#Fields_SelectedTeachers").append(opt).trigger("change");
                        //});
                    }
                    mApp.unblock("#class_schedule_modal .modal-content");
                },
                error: function (error) {
                    mApp.unblock("#class_schedule_modal .modal-content");
                }
            });
        },
        cancel: function () {
            $("#btnCancelEdit").hide();
            $("#btnSaveClassSchedule").html("<span><i class=\"la la-plus\"></i><span>Agregar Horario</span></span>");
            $(".m-datatable-class tr").find(".btn").attr("disabled", false);
            var selectedtr = $(".m-datatable-class tr.bg-selected").get(0);
            if (selectedtr !== undefined) {
                var iseven = selectedtr.classList.contains("even-selected");
                $(".m-datatable-class tr.bg-selected").removeClass("bg-selected").addClass(iseven ? "m-datatable__row--even" : "");
            }
        },
        begin: function () {
            $("div#class_schedule_modal input, div#class_schedule_modal select").attr("disabled", true);
            $("#btnCleanTeachers").attr("disabled", true);
            $("#btnCancelEdit").attr("disabled", true);
            $("#btnSaveClassSchedule").addLoader();
        },
        complete: function () {
            $("div#class_schedule_modal input, div#class_schedule_modal select").attr("disabled", false);
            $("#btnCleanTeachers").attr("disabled", false);
            $("#btnCancelEdit").attr("disabled", false);
            $("#btnSaveClassSchedule").removeLoader();
        },
        success: function (e) {
            toastr.success(_app.constants.toastr.message.success.task, _app.constants.toastr.title.success);
            //resetModal();
            form.reset();
            update.cancel();
            datatableClass.reload();
            //refreshSchedule();
        },
        failure: function (e) {
            toastr.error(_app.constants.toastr.message.error.task, _app.constants.toastr.title.error);
            if (e.responseText != null) $("#form_class_msg_txt").html(e.responseText);
            else $("#form_class_msg_txt").html(_app.constants.ajax.message.error);
            $("#form_class_msg").removeClass("m--hide").show();
        }
    }

    return {
        show: function(id, section) {
            load(id, section);
        },
        Form: {
            begin: function () {
                create.begin();
            },
            complete: function () {
                create.complete();
            },
            success: function (e) {
                create.success(e);
            },
            failure: function (e) {
                create.failure(e);
            }
        }
    }
}();
