let datatable;
let section = $('#section').val();

function refresh() {
    datatable.load();
}

let initDatatable = function () {
    //== Private functions
    let table = function () {
        datatable = $('.m-datatable').mDatatable({
            data: {
                type: 'remote',
                source: {
                    read: {
                        method: 'GET',
                        url: '/profesor/notas/registrar/getalumnos/' + section,
                    },
                },
                pageSize: 10,
                saveState: {
                    cookie: true,
                    webstorage: true,
                },
            },
            layout: {
                theme: 'default', // datatable theme
                class: '', // custom wrapper class
                scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
                footer: false // display/hide footer
            },
            // column sorting
            sortable: true,
            pagination: true,
            toolbar: {
                // toolbar items
                items: {
                    // pagination
                    pagination: {
                        // page size select
                        pageSizeSelect: [10, 20, 30, 50, 100],
                    },
                    info: false
                },
            },
            columns: [
                {
                    field: 'code',
                    title: 'Código',
                    width: 70,
                    textAlign: 'center',
                },
                {
                    field: 'student',
                    title: 'Alumnos inscritos'
                },
                {
                    field: 'id',
                    title: 'No rindió',
                    sortable: false,
                    filterable: false,
                    width: 70,
                    textAlign: 'center',
                    template: function (row, index) {
                        return '<label class="m-checkbox" style="padding-left: 18px"><input data-id="' + row.id + '" type="checkbox" class="chck" name="grades[' + index + '].NotTaken" value="true">&nbsp;<span></span></label>';
                    }
                },
                {
                    field: 'grade',
                    title: 'Nota',
                    sortable: false,
                    filterable: false,
                    width: 75,
                    textAlign: 'center',
                    template: function (row, index) {
                        return '<input hidden name="grades[' + index + '].Id" value="' + row.id + '"> <div class="form-group m-form__group"><input type=number min=0 max=20 id="input_' + row.id + '" class="form-control m-input" name="grades[' + index + '].Grade" required></div>';
                    }
                }
            ],
            translate: {
                records: {
                    processing: 'Cargando...',
                    noRecords: 'No se encontraron registros'
                }
            }
        });
    };

    $('.m-datatable')
        .on('change', '.chck', function () {
            var id = $(this).data('id');

            if (this.checked) {
                $("#input_" + id).attr("disabled", true);                  
            } else { 
                $("#input_" + id).removeAttr("disabled");
            }
        })

    let validations = function () {
        $("#form-validation").validate({
            //display error alert on form submit  
            invalidHandler: function (event, validator) {
                mApp.scrollTo("#form-validation");

                swal({
                    "title": "Notas no registradas",
                    "text": "Verifique que ingreso las notas de todos los alumnos",
                    "type": "error",
                    //"confirmButtonClass": "btn btn-secondary m-btn m-btn--wide"
                });
            },
            errorPlacement: function (error, element) {
            }
        });
    }

    return {
        // public functions
        init: function () {
            table();
            validations();
        }
    };
}();

jQuery(document).ready(function () {
    initDatatable.init();


});