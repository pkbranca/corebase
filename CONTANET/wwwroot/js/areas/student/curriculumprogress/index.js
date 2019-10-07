var CurriculumProgress = function () {
    var options = {
        data: {
            type: 'remote',
            source: {
                read: {
                    method: 'GET',
                    url: '',
                },
            },
            pageSize: 10,
            saveState: {
                cookie: true,
                webstorage: true,
            },
        },
        pagination: false,
        columns: [
            {
                field: 'course',
                title: 'Curso',
                width: 200,
                sortable: false
            },
            {
                field: 'credits',
                title: 'Total',
                textAlign: 'center',
                width: 80,
                sortable: false
            },
            {
                field: 'try',
                title: 'N° de Veces',
                textAlign: 'center',
                width: 120,
                sortable: false
            },
            {
                field: 'grade',
                title: 'Promedio Final',
                textAlign: 'center',
                width: 120,
                sortable: false
            },
            {
                field: 'term',
                title: 'Ciclo',
                textAlign: 'center',
                width: 80,
                sortable: false
            },
            {
                field: 'status',
                title: 'Estado',
                textAlign: 'center',
                width: 100,
                sortable: false,
                template: function (row) {
                    return row.status ? "Cumplido" : "Pendiente";
                }
            }
        ]
    }

    var datatables = {
        init: {
            all: function () {
                $('.academic-year-datatable').each(function (index, datatable) {
                    var ayid = $(datatable).data('ayid');
                    options.data.source.read.url = ('/alumno/progreso/nivel/' + ayid + '/get').proto().parseURL();
                    datatable.id = 'academic-year-' + index;
                    datatable.dataset.number = index;
                    $("#" + datatable.id).mDatatable(options);
                });
            }
        },
        events: {
            load: function () {
                $('.academic-year-datatable').on('m-datatable--on-init', function (e) {
                    var totalCredits = 0;
                    var allApproved = true;

                    $('#' + this.id + ' td[data-field="credits"]').each(function (e) {
                        var value = $(this).text();
                        if (!isNaN(value) && value.length != 0 && !isNaN(parseInt(value))) {
                            totalCredits += parseInt(value);
                        }
                    });

                    $('#' + this.id + ' td[data-field="status"').each(function (e) {
                        var value = $(this).text();
                        if (value.length != 0) {
                            allApproved = (value === 'Cumplido');
                        }
                    });

                    var num = $(this).data('number');
                    var oldTitle = $('#m-accordion-title-' + num).text();
                    $('#m-accordion-title-' + num).text(oldTitle + ' (' + totalCredits + ' créditos)');
                    var iconClass = (allApproved ? 'fa fa-check' : 'fa fa-warning');
                    $('#m-accordion-icon-' + num).html('<i class="' + iconClass + '"></i>');
                    $('#m-accordion-icon-' + num).css('color', (allApproved ? 'green' : 'red'));
                });
            }
        }
    }

    return {
        init: function () {
            datatables.init.all();
            datatables.events.load();
        }
    }
}();

$(function () {
    CurriculumProgress.init();
});