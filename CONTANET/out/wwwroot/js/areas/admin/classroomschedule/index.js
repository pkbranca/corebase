var ClassroomSchedule = function () {
    var fullCalendar;

    var init = function() {
        $.ajax({
            url: ("/aulas/get").proto().parseURL()
        }).done(function (result) {
            $(".select2-classroom").select2({
                placeHolder: 'Aula',
                data: result.items
            });
            $("#btnQuery").on("click", function (e) {
                calendar.load($('.select2-classroom').val());
            });
            $(".select2-classroom").on("change", function (e) {
                calendar.load($('.select2-classroom').val());
            });
            if ($(".select2-classroom").val())
                calendar.load($(".select2-classroom").val());
        });
    }

    var calendar = {
        load: function (id) {
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
                dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
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

                    var fc_title = element.find(".fc-title").clone().children().remove().end().text();

                    element.css("border-color", "#" + fc_title.proto().toRGB()).css("border-width", "2px");
                },
                events: {
                    className: "m-fc-event--primary",
                    error: function () {
                        toastr.error("Ocurrió un problema con el servidor", "Error");
                    },
                    url: ("/admin/horarioaulas/" + id + "/get").proto().parseURL()
                },
                firstDay: 1,
                header: false,
                height: 600,
                locale: "es",
                maxTime: "24:00:00",
                minTime: "07:00:00",
                monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"],
                slotDuration: "00:30:00",
                timeFormat: "h(:mm)A"
            };

            if (fullCalendar !== null)
                $(fullCalendar).fullCalendar("destroy");
            fullCalendar = $(".m-calendar__container").fullCalendar(defaultSettings);
        }
    }

    return {
        init: function() {
            init();
        }
    }
}();

$(function () {
    ClassroomSchedule.init();
});
