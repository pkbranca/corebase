var SolicitudeTable = function () {
    var datatable;

    var options = {
        data: {
            type: 'remote',
            source: {
                read: {
                    method: 'GET',
                    url: ('/admin/silabo/getsolicitudes/').proto().parseURL(),
                },
            },
            pageSize: 10,
            saveState: {
                cookie: true,
                webstorage: true
            }
        },
        columns: [
            {
                field: 'name',
                title: 'Titulo de la Solicitud',
                width: 200
            },
            {
                field: 'courseName',
                title: 'Curso',
                width: 120
            }, 
            {
                field: 'term',
                title: 'Periodo',
                width: 120
            }, 
            {
                field: 'start',
                title: 'Fecha de Inicio',
                width: 70
            },  
            {
                field: 'end',
                title: 'Fecha de Fin',
                width: 200
            },
            {
                field: 'options',
                title: 'Opciones',
                width: 150,
                sortable: false,
                filterable: false,
                template: function (row) {
                    return '<button data-coursetermid="' + row.courseTermId + '" data-syllabusrequestid="' + row.syllabusRequestId + '" class="btn btn-primary btn-sm m-btn m-btn--icon btn-attach" title="Adjuntar"><span><i class="la la-edit"></i><span>Adjuntar</span></span></button>';
                }
            }
        ]
    };



    var events = {
        init: function () {
            datatable.on('click', '.btn-attach', function () {
                $("#detail_modal").modal("show");
                var coursetermid = $(this).data("coursetermid");
                var syllabusrequestid = $(this).data("syllabusrequestid");
                console.log(`${coursetermid} ${syllabusrequestid}`);

                $("#CourseTermId").val($(this).data("coursetermid"));
                $("#SyllabusRequestId").val($(this).data("syllabusrequestid"));
            });

            $('#File').on('change', function () {
                let fileName = $(this).val();
                $(this).next().next().html(fileName);
            });           

           
        }
    };
    
    var validate = {
        init: function () {
            $("#add-form").validate({
                submitHandler: function () {
                    $("#btnSaveSyllabus").addLoader();
                    return true;
                }
            }); 
        }
    }

    return {
        init: function () {
            datatable = $(".m-datatable").mDatatable(options);
            validate.init();
            events.init();
            
        }
    }
}();

$(function () {
    SolicitudeTable.init();
});