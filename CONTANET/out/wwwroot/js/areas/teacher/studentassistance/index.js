var Assistances = function () {
    var datatable;

    var options = {
        search: {
            input: $('#search'),
        },
        data: {
            type: 'remote',
            source: {
                read: {
                    method: 'GET',
                    url: ('/profesor/asistencia/get').proto().parseURL()
                }
            },
            pageSize: 10,
            saveState: {
                cookie: true,
                webstorage: true,
            },
        },
        layout: {
            footer: true
        },
        pagination: false,
        columns: [
            {
                field: 'studentName',
                title: 'Nombre',
                width: 260,
                template: function (row) {
                    var tmp = "";
                    if (row.absences > row.maxAbsences) {
                        tmp += "<p style='color:red;'>";
                        tmp += row.studentName;
                        tmp += "</p>";
                    }
                    else
                        tmp += row.studentName;
                    return tmp;
                }
            },
            {
                field: 'maxAbsences',
                title: 'Máx. Faltas',
                textAlign: 'center',
                width: 120,
                template: function (row) {
                    var tmp = "";
                    if (row.absences > row.maxAbsences) {
                        tmp += "<p style='color:red;'>";
                        tmp += row.maxAbsences;
                        tmp += "</p>";
                    }
                    else
                        tmp += row.maxAbsences;
                    return tmp;
                }
            },
            {
                field: 'absences',
                title: 'Faltas',
                textAlign: 'center',
                width: 120,
                template: function (row) {
                    var tmp = "";
                    if (row.absences > row.maxAbsences) {
                        tmp += "<p style='color:red;'>";
                        tmp += row.absences;
                        tmp += "</p>";
                    }
                    else
                        tmp += row.absences;
                    return tmp;
                }
            },
            {
                field: 'status',
                title: 'Estado',
                width: 250,
                sortable: false,
                overflow: 'inherit',
                template: function (row, index) {
                    var tmp = '';
                    var options = {
                        0: { text: _app.constants.assistance.absence.text, value: _app.constants.assistance.absence.value, selected: '', icon: 'la la-user-times' },
                        1: { text: _app.constants.assistance.assisted.text, value: _app.constants.assistance.assisted.value, selected: '', icon: 'flaticon-user-ok' },
                        2: { text: _app.constants.assistance.late.text, value: _app.constants.assistance.late.value, selected: '', icon: 'flaticon-stopwatch' }
                    };
                    options[row.status].selected = 'selected';

                    tmp += '<input hidden name="assists[' + index + '].ClassStudentId" value="' + row.id + '" />';
                    tmp += '<select id="input_' + row.id + '" class="form-control " ';
                    tmp += 'name = "assists[' + index + '].Status" value = "' + row.status + '" > ';

                    //tmp += '<option ' + options[1].selected + ' value="' + options[1].value + '" data-icon="' + options[1].icon + '">' + options[1].text + '</option>';
                    //tmp += '<option ' + options[2].selected + ' value="' + options[2].value + '" data-icon="' + options[2].icon + '">' + options[2].text + '</option>';
                    //tmp += '<option ' + options[0].selected + ' value="' + options[0].value + '" data-icon="' + options[0].icon + '">' + options[0].text + '</option>';

                    tmp += '<option ' + options[1].selected + ' value="' + options[1].value + '" >' + options[1].text + '</option>';
                    tmp += '<option ' + options[2].selected + ' value="' + options[2].value + '" >' + options[2].text + '</option>';
                    tmp += '<option ' + options[0].selected + ' value="' + options[0].value + '" >' + options[0].text + '</option>';


                    tmp += '</select>';
                    return tmp;
                }
            }
        ]
    }

    var form = {
        begin: function () {
            $('#form_msg').addClass('m--hide').hide();
            $('#form_msg_txt').html('');

            $('select').attr('disabled', true);
            $('#btnAssists').addLoader();
        },
        complete: function () {
            $('select').attr('disabled', true);
            $('#btnAssists').removeLoader();
        },
        success: function (e) {
            toastr.success(_app.constants.toastr.message.success.task, _app.constants.toastr.title.success);
            datatable.reload();
        },
        failure: function (e) {
            toastr.error(_app.constants.toastr.message.error.task, _app.constants.toastr.title.error);
            if (e.responseText != null) $('#form_msg_txt').html(e.responseText);
            else $('#form_msg_txt').html(_app.constants.toastr.message.error.task);
            $('#form_msg').removeClass('m--hide').show();
        }
    }

    return {
        init: function () {
            datatable = $("#assistance-datatable").mDatatable(options);
        },
        Form: {
            begin: function () {
                form.begin();
            },
            complete: function () {
                form.complete();
            },
            success: function (e) {
                form.success(e);
            },
            failure: function (e) {
                form.failure(e);
            }
        }
    }
}();

$(function () {
    Assistances.init();
});

var assistanceSettings = {
	
};

$('#assistance-datatable').on('m-datatable--on-init', function (e) {
	$('select').selectpicker();
	//var table = document.getElementById('assistance-datatable');
	//var table = $('table').get(0);
	//var header = table.createTHead();
	//var row1 = header.insertRow(0);
	//$(row1).addClass('m-datatable__row').append('<th colspan="4" class="m-datatable__cell m-datatable__cell--center"><span>Curso: CC01 - Programación I</span></th>')
	//var row2 = header.insertRow(1);
	//$(row2).addClass('m-datatable__row').append('<th class="m-datatable__cell m-datatable__cell--center"><span style="width:200px;">Sección: SW-01</span></th><th class="m-datatable__cell m-datatable__cell--center"><span>Intento: 1</span></th>')
});



_app.datatable.elements = {
	'assistance-datatable': {
		selector: '#assistance-datatable',
		settings: assistanceSettings
	}
};

var classassistance = {
	datatable: {
		load: function () {
			_app.datatable.load.all();
		},
		refresh: function () {
			_app.datatable.reload.all();
		}
	},
	post: {
		begin: function () {
			$('#form_msg').addClass('m--hide').hide();
			$('#form_msg_txt').html('');

			$('select').attr('disabled', true);
			$('#btnAssists').addLoader();
		},
		complete: function () {
			$('select').attr('disabled', true);
			$('#btnAssists').removeLoader();
		},
        success: function (e) {
            toastr.success(_app.constants.toastr.message.success.task, _app.constants.toastr.title.success);
			classassistance.datatable.refresh();
		},
        failure: function (e) {
            toastr.error(_app.constants.toastr.message.error.task, _app.constants.toastr.title.error);
			if (e.responseText != null) $('#form_msg_txt').html(e.responseText);
			else $('#form_msg_txt').html(_app.constants.toastr.message.error.task);
			$('#form_msg').removeClass('m--hide').show();
		}
	}
};


window.onload = function (e) {
	classassistance.datatable.load();
};