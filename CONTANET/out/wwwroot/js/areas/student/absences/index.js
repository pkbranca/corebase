var Absences = function () {
    var datatable;
    var detailDatatable = null;

    // Round
    function roundNumber(num, scale) {
        if (!("" + num).includes("e")) {
            return +(Math.round(num + "e+" + scale) + "e-" + scale);
        } else {
            var arr = ("" + num).split("e");
            var sig = ""
            if (+arr[1] + scale > 0) {
                sig = "+";
            }
            return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
        }
    }


    var options = {
        data: {
            type: 'remote',
            source: {
                read: {
                    method: 'GET',
                    url: ('/alumno/inasistencias/periodo/' + $('#select-term').val() + '/get').proto().parseURL(),
                },
            },
            pageSize: 10,
            saveState: {
                cookie: true,
                webstorage: true,
            },
        },
        columns: [
            {
                field: 'courseName',
                title: 'Curso',
                width: 200,
                sortable: false
            },
            {
                field: 'classCount',
                title: 'Total',
                textAlign: 'center',
                width: 80,
                sortable: false
            },
            {
                field: 'maxAbsences',
                title: 'Máx. Faltas',
                textAlign: 'center',
                width: 100,
                sortable: false
            },
            {
                field: 'dictated',
                title: 'Dictadas',
                textAlign: 'center',
                width: 80,
                sortable: false
            },
            {
                field: 'assisted',
                title: 'Asistidas',
                textAlign: 'center',
                width: 80,
                sortable: false
            },
            {
                field: 'tardiness',
                title: 'Tardanzas',
                textAlign: 'center',
                width: 80,
                sortable: false
            },
            {
                field: 'absences',
                title: 'Faltas',
                textAlign: 'center',
                width: 80,
                sortable: false
            },
            {
                field: 'absencePercentage',
                title: '% Faltas',
                textAlign: 'center',
                sortable: false,
                width: 80,
                template: function (row) {
                    var absencePercentage = row.absences / row.classCount * 100;
                    return roundNumber(absencePercentage, 2) + " %"; //absencePercentage.proto().round(2) + " %";
                }
            },
            {
                field: 'options',
                title: 'Opciones',
                width: 120,
                template: function (row) {
                    var tmp = '';
                    tmp += '<button class="btn btn-primary m-btn btn-sm m-btn--icon btn-detail" ';
                    tmp += 'data-id="' + row.sectionId + '" ';
                    tmp += "><span><i class='la la-eye'></i><span> Ver Detalle</span></span></button>";
                    return tmp;
                }
            }
        ]
    };

    var optionDetails = {
        data: {
            type: 'remote',
            source: {
                read: {
                    method: 'GET',
                    url: ('/alumno/inasistencias/seccion/' + $('#assistance-filter').val() + '/get').proto().parseURL(),
                },
            },
            pageSize: 10,
            saveState: {
                cookie: true,
                webstorage: true,
            },
        },
        columns: [
            {
                field: 'week',
                title: 'Semana',
                width: 80,
                sortable: false
            },
            {
                field: 'sessionNumber',
                title: 'Sesión',
                textAlign: 'center',
                width: 80,
                sortable: false
            },
            {
                field: 'date',
                title: 'Fecha',
                textAlign: 'center',
                width: 100,
                sortable: false
            },
            {
                field: 'weekDay',
                title: 'Día',
                textAlign: 'center',
                width: 100,
                sortable: false
            },
            {
                field: 'startTime',
                title: 'Inicio',
                textAlign: 'center',
                width: 100,
                sortable: false
            },
            {
                field: 'endTime',
                title: 'Fin',
                textAlign: 'center',
                width: 100,
                sortable: false
            },
            {
                field: 'status',
                title: 'Estado',
                textAlign: 'center',
                width: 100,
                sortable: false,
                template: function (row) {
                    var tmp = '';
                    var status = {
                        0: { text: _app.constants.assistance.absence.text, value: _app.constants.assistance.absence.value, icon: 'la la-user-times', class: 'm-badge--danger' },
                        1: { text: _app.constants.assistance.assisted.text, value: _app.constants.assistance.assisted.value, icon: 'flaticon-user-ok', class: 'm-badge--success' },
                        2: { text: _app.constants.assistance.late.text, value: _app.constants.assistance.late.value, icon: 'flaticon-stopwatch', class: 'm-badge--brand' }
                    };
                    return '<span class="m-badge ' + status[row.status].class + ' m-badge--wide">' + '<i class="' + status[row.status].icon + '"></i> ' + status[row.status].text + '</span>';
                }
            }
        ]
    }

    var events = {
        init: function () {
            $('#select-term').on('change', function (e) {
                loadDatatable();
            });

            datatable.on("click", ".btn-detail", function () {
                var sectionId = $(this).data("id");
                detail.show(sectionId);
            });

        }
    }

    var detail = {
        show: function (sectionId) {
            $('#absences-detail-modal').modal('toggle');
            $('#SectionId').val(sectionId);
			$('#assistance-filter').select2();
			$('#assistance-filter').val(_app.constants.assistance.absence.value).trigger('change');

            $('#assistance-filter').on('change', function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                loadDetailDatatable(sectionId);
            });

            $('#absences-detail-modal').on('shown.bs.modal', function (e) {
                $('#assistance-filter').trigger('change');
            });

            $('#absences-detail-modal').on('hidden.bs.modal', function (e) {
                if (detailDatatable !== null) {
                    detailDatatable.destroy();
                    detailDatatable = null;
                }
                $('#assistance-filter').off('change');
            });


        }
    }

    var loadDetailDatatable = function (sectionId) {
        if (detailDatatable !== null) {
            detailDatatable.destroy();
            detailDatatable = null;
        }
        optionDetails.data.source.read.url = ('/alumno/inasistencias/seccion/' + sectionId + '/get?status=' + $('#assistance-filter').val()).proto().parseURL();
        detailDatatable = $("#absences-detail-datatable").mDatatable(optionDetails);
    }

    var loadDatatable = function () {
        if (datatable !== undefined)
            datatable.destroy();
        options.data.source.read.url = ('/alumno/inasistencias/periodo/' + $('#select-term').val() + '/get').proto().parseURL();
        datatable = $(".m-datatable-absences").mDatatable(options);
    }

    return {
        init: function () {
            loadDatatable();
            events.init();
        }
    }

}();

$(function () {
    Absences.init();
});
