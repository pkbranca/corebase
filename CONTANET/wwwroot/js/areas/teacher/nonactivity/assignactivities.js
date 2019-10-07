var TeacherSchedule = function () {
    var fullCalendar;

    var formRequestValidation = $("#equipment-form").validate();

    $("#sDetailSection").select2({
        width: "100%",
        dropdownParent: $("#modal-add-edit"),
        placeholder: "Buscar una sección",
        ajax: {
            url: "/admin/actividades-no-lectivas/sections/select/filter/get",
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

    var events = {
        init: function () {
            $(".btn-add").on("click",
                function () {
                    modal.add();
                });
        }
    };

    var init = function () {
        calendar.load();
    }

    var calendar = {
        load: function () {
            var defaultSettings = {
                allDaySlot: false,
                aspectRatio: 2,
                businessHours: {
                    dow: [1, 2, 3, 4, 5, 6],
                    end: "24:00",
                    start: "07:00"
                },
                columnFormat: "dddd",
                contentHeight: 600,
                defaultView: "agendaWeek",
                editable: false,
                eventRender: function (event, element) {
                    if (element.hasClass("fc-day-grid-event")) {
                        element.data("content", event.description);
                        element.data("placement", "top");
                        mApp.initPopover(element);
                    } else if (element.hasClass("fc-time-grid-event")) {
                        element.find(".fc-title").append("<div class=\"fc-description\">" + event.description + "</div>");
                    } else if (element.find(".fc-list-item-title").length !== 0) {
                        element.find(".fc-list-item-title").append("<div class=\"fc-description\">" + event.description + "</div>");
                    }

                    var fcTitle = element.find(".fc-title").clone().children().remove().end().text();

                    element.css("border-color", "#" + fcTitle.proto().toRGB()).css("border-width", "2px");
                },
                events: {
                    className: "m-fc-event--primary",
                    error: function () {
                        toastr.error("Ocurrió un problema con el servidor", "Error");
                    },
                    url: `/docente/actividades-no-lectivas/assign/get`.proto().parseURL()
                },
                eventAfterAllRender: function () {
                    $(".fc-prev-button").prop("disabled", false);
                    $(".fc-next-button").prop("disabled", false);
                    mApp.unblock(".m-calendar__container");
                },
                eventClick: function (calEvent, jsEvent, view) {
                    form.detail.load(calEvent.id);
                },
                firstDay: 1,
                header: {
                    left: "prev,next today",
                    center: "title"
                },
                height: 600,
                locale: "es",
                maxTime: "24:00:00",
                minTime: "07:00:00",
                monthNames: monthNames,
                dayNames: dayNames,
                monthNamesShort: monthNamesShort,
                dayNamesShort: dayNamesShort,
                buttonText: {
                    today: "hoy",
                    month: "mes",
                    week: "semana",
                    day: "día"
                },
                slotDuration: "00:30:00",
                timeFormat: "h(:mm)A"
            };

            if (fullCalendar !== null) {
                $(fullCalendar).fullCalendar("destroy");
                fullCalendar = null;
            }
            mApp.block(".m-calendar__container", { type: "loader", message: "Cargando..." });
            fullCalendar = $(".m-calendar__container").fullCalendar(defaultSettings);
            this.events();
        },
        events: function () {
            fullCalendar.on("click",
                ".fc-prev-button",
                function () {
                    $(this).prop("disabled", true);
                    mApp.block(".m-calendar__container", { type: "loader", message: "Cargando..." });
                });
            fullCalendar.on("click",
                ".fc-next-button",
                function () {
                    $(this).prop("disabled", true);
                    mApp.block(".m-calendar__container", { type: "loader", message: "Cargando..." });
                });
        }
    }

    var modal = {
        add: function () {
            $("#modal-add-edit").modal("toggle");

            $("#class-form").find("input").prop("disabled", false);
            $("#class-form").find("select").prop("disabled", false);
            $("#class-form").find("textarea").prop("disabled", false);

            $("#modal-add-edit").one("hidden.bs.modal",
                function (e) {
                    modal.reset();
                });
        },
        edit: function (id) {
            $("#modal-add-edit").modal("toggle");

            $("#modal-add-edit").one("shown.bs.modal",
                function (e) {

                    $("#class-form").find("input").prop("disabled", true);
                    $("#class-form").find("select").prop("disabled", true);

                    mApp.block("#modal-add-edit .modal-content", { type: "loader", message: "Cargando..." });

                    $.ajax({
                        url: (`/admin/equipos/get/${id}`).proto().parseURL()
                    }).done(function (result) {

                        var formElements = $("#class-form").get(0).elements;
                        formElements["Id"].value = id;

                        $("#class-form").find("input").prop("disabled", false);

                        formElements["DetailCourse"].value = result.detailcourse;
                        formElements["Brand"].value = result.brand;
                        formElements["Serie"].value = result.serie;

                        mApp.unblock("#modal-add-edit .modal-content");
                    });
                });
            $("#modal-add-edit").one("hidden.bs.modal",
                function (e) {
                    modal.reset();
                });
        },
        reset: function () {
            $("#equipment_form_msg").addClass("m--hide").hide();
            $("#cTeacherSearch").val("").trigger('change');
            $("#cEquipmentSearch").val("").trigger('change');
            formRequestValidation.resetForm();
        },
        begin: function () {
            $("#modal-add-edit input").attr("disabled", true);
            $("#modal-add-edit select").attr("disabled", true);
            $("#btnSave").addLoader();
        },
        complete: function () {
            $("#modal-add-edit input").attr("disabled", false);
            $("#modal-add-edit select").attr("disabled", false);
            $("#btnSave").removeLoader();
        },
        success: function (e) {
            $('#modal-add-edit').modal("toggle");
            toastr.success(_app.constants.toastr.message.success.task, _app.constants.toastr.title.success);
            datatable.reload();
        },
        failure: function (e) {
            toastr.error(_app.constants.toastr.message.error.task, _app.constants.toastr.title.error);
            if (e.responseText != null) $("#equipment_form_msg_txt").html(e.responseText);
            else $("#equipment_form_msg_txt").html(_app.constants.ajax.message.error);
            $("#equipment_form_msg").removeClass("m--hide").show();
        }
    }

    var form = {
        detail: {
            load: function (id) {
                mApp.blockPage();
                $.ajax({
                    url: `/admin/horarios/${id}/get`.proto().parseURL()
                })
                    .always(function () {
                        mApp.unblockPage();
                    })
                    .done(function (result) {
                        $("#DetailCourse").val(result.course);
                        $("#DetailSection").val(result.section);
                        $("#DetailDate").val(result.date);
                        $("#DetailStart").val(result.start);
                        $("#DetailEnd").val(result.end);
                        $("#DetailClassroom").val(result.classroom);
                        $("#DetailType").val(result.type);

                        $("#modal-detail").modal("show");
                    })
                    .fail(function () {
                        toastr.error(_app.constants.toastr.message.error.task, _app.constants.toastr.title.error);
                    });
            }
        }
    };

    return {
        init: function () {
            init();
            events.init();
        }
    }
}();

$(function () {
    TeacherSchedule.init();
});