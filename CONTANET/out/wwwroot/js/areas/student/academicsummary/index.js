var Summary = function () {

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
                field: 'academicYear',
                title: 'Nivel',
                textAlign: 'center',
                width: 80,
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
                field: 'finalGrade',
                title: 'Promedio Final',
                textAlign: 'center',
                width: 120,
                sortable: false
            },
            {
                field: 'try',
                title: 'N° de Veces',
                textAlign: 'center',
                width: 120,
                sortable: false
            }
        ]
    }

    var load = {
        all: function () {
            $('.summary-detail-datatable').each(function (index, datatable) {
                var pid = $(datatable).data('pid');
                options.data.source.read.url = ('/alumno/historial/periodo/' + pid + '/get').proto().parseURL();
                datatable.id = 'summary-detail-' + index;
                $("#" + datatable.id).mDatatable(options);
            });
        }
    }

    var init = function () {
        load.all();
    }

    return {
        init: function () {
            init();
        }
    }
}();

$(function () {
    Summary.init();
});