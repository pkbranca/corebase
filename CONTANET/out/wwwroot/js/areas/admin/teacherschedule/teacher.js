var TeacherSchedule = function () {
    var fullCalendar;

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
                    url: `/admin/horarios/get`.proto().parseURL()
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
        }
    }
}();

$(function () {
    TeacherSchedule.init();
});