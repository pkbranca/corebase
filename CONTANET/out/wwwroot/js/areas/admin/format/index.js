var Activity = function () {
    var activityDatatable = null;
    var detailDatatable = null;

    var options = {
        search: {
            input: $("#search")
        },
        data: {
            source: {
                read: {
                    method: "GET",
                    url: "/admin/format/get".proto().parseURL()
                }
            }
        },
        columns: [
            {
                field: "code",
                title: "Código",
                width: 100
            },
            {
                field: "name",
                title: "Docente"
            },
            {
                field: "career",
                title: "Carrera"
            },
            {
                field: "faculty",
                title: "Facultad"
            },
            {
                field: "options",
                title: "Opciones",
                width: 400,
                sortable: false,
                filterable: false,
                template: function (row) {
                    var template = "";
                    template += `<button class=\"btn btn-info btn-sm m-btn m-btn--icon btn-detail\" data-id=\"${row.id}\"><span><i class="la la-eye"></i><span>Ver Registro</span></span></button>&nbsp;` +
                        `<button class=\"btn btn-primary btn-sm m-btn m-btn--icon btn-detail2\" data-id=\"${row.id}\"><span><i class="la la-eye"></i><span>Horas Lectivas</span></span></button> ` +
                        `<button class=\"btn btn-brand btn-sm m-btn m-btn--icon btn-1-a\" data-id=\"${row.id}\"><span><i class="la la-eye"></i><span>1 - A</span></span></button> ` +
                        `<button class=\"btn btn-focus btn-sm m-btn m-btn--icon btn-1-b\" data-id=\"${row.id}\"><span><i class="la la-eye"></i><span>1 - B</span></span></button> `;
                    return template;
                }
            }
        ]
    };

    var datatable = {
        init: function () {
            if (activityDatatable !== null) {
                activityDatatable.destroy();
                activityDatatable = null;
            }
            options.data.source.read.url = `/admin/format/get`.proto().parseURL();
            activityDatatable = $(".m-datatable").mDatatable(options);
            this.initEvents();
        },
        initEvents: function () {
            activityDatatable.on("click", ".btn-detail", function () {
                var id = $(this).data("id");
                window.open(`/admin/format/labors/${id}`.proto().parseURL(), "_blank");
            });
            activityDatatable.on("click", ".btn-detail2", function () {
                var id = $(this).data("id");
                window.open(`/admin/format/labors2/${id}`.proto().parseURL(), "_blank");
            });
            activityDatatable.on("click", ".btn-1-a", function () {
                var id = $(this).data("id");
                window.open(`/admin/format/1A/${id}`.proto().parseURL(), "_blank");
            });
            activityDatatable.on("click", ".btn-1-b", function () {
                var id = $(this).data("id");
                window.open(`/admin/format/1B/${id}`.proto().parseURL(), "_blank");
            });
        }
    };

    var select2 = {
        init: function () {
            this.terms.init();
            this.weeks.initEvents();
        },
        terms: {
            init: function () {
                $.ajax({
                    url: "/periodos-con-clases/get".proto().parseURL()
                }).done(function (result) {
                    $(".select2-terms").select2({
                        data: result.items,
                        minimumResultsForSearch: -1
                    }).on("change",
                        function () {
                            select2.weeks.init($(this).val());
                        }).trigger("change");
                });
            }
        },
        weeks: {
            initEvents: function () {
                $(".select2-weeks").on("change", function () {
                });
            },
            init: function (termId) {
                $.ajax({
                    url: `/semanas-pasadas/get?termId=${termId}`.proto().parseURL()
                }).done(function (result) {
                    $(".select2-weeks").empty();
                    $(".select2-weeks").select2({
                        data: result.items
                    }).val(result.items[result.items.length - 1].id).trigger("change");
                });
            }
        }
    }

    return {
        init: function () {
            //select2.init();
            datatable.init();
        }
    }
}();


$(function () {
    Activity.init();
});