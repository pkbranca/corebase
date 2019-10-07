var Table = function () {
    //var surveyId = $("#SurveyId").val();
    var datatable;
    var options = {
        data: {
            type: 'remote',
            source: {
                read: {
                    method: "POST",
                    url: ("/admin/gestion-encuestas/getsections/" + $("#select_course").val()).proto().parseURL(),
                }
            },
        },
        columns: [
            {
                field: "id",
                title: "#",
                width: 70,
                textAlign: "center",
                selector: { class: 'm-checkbox--solid m-checkbox--brand' },
            },
            {
                field: "code",
                title: "Codigo",
                width: 70,
                textAlign: "center",
            },
            {
                field: "teacherName",
                title: "Profesor",
                width: 150,
                textAlign: "center",
            },
        ]
    };

    var loadDatatable = function(){
        if (datatable !== undefined) {
            datatable.destroy();
        }
        var surveyid = $("#SurveyId").val();
        options.data.source.read.url = ("/admin/gestion-encuestas/getsections/" + $("#select_course").val()+"/"+surveyid).proto().parseURL();
        datatable = $('.m-datatable').mDatatable(options);
        console.log("RELOAD");
    };
 
    var loadCourses = function () {
        var careerId = $("#select_career").val(); 
        return $.ajax({
            url: ("/admin/gestion-encuestas/getcourses/" + careerId).proto().parseURL()
        }).done(function (data) { 
            $("#select_course").empty();
            $("#select_course").select2({
                data: data.courses
            }).on("change", function () { 
                loadDatatable();    
            });
            $("#select_course").removeAttr('disabled'); 
            var courseDefaultId = $("#CourseDefaultId").val();
            $("#select_course").val(courseDefaultId);
            $("#select_course").trigger("change");  
        });

    }

    var loadCareers = function () {
        var facultyId = $("#select_faculty").val(); 
        return $.ajax({
            url: ("/admin/gestion-encuestas/getcareers/"+facultyId).proto().parseURL()
        }).done(function (data) {   
            $("#select_career").empty();
            $("#select_career").select2({
                data: data.careers
            }).on("change", function () {
                loadCourses(); 
            });  
            $("#select_career").removeAttr('disabled'); 
            var careerDefaultId = $("#CareerDefaultId").val();
            $("#select_career").val(careerDefaultId);
            $("#select_career").trigger("change");  
        }); 
    };

    var loadSelect = function () {
        return $.ajax({
            url: ("/admin/gestion-encuestas/getfaculties").proto().parseURL()
        }).done(function (data) {
            $("#select_faculty").select2({
                data: data.faculties
            }).on("change", function () {
                loadCareers();
            });
            var facultyDefaultId = $("#FacultyDefaultId").val();
            $("#select_faculty").val(facultyDefaultId);
            $("#select_faculty").trigger("change"); 
        });
    }
    var events = {
        init: function () { 
            $('.btn-send').on('click', function () {
                var ids = datatable.checkbox().getSelectedId();
                var unselected = datatable.checkbox().unselectedRows;
                var selected = datatable.checkbox().selectedRows;
                var result = [];

                if (unselected.length > 0) {
                    for (var i = 0; i < ids.length; i++) {
                        var add = true;
                        for (var j = 0; j < unselected.length; j++) {
                            if (ids[i] == unselected[j]) {
                                add = false;
                            }
                        }
                        if (add) {
                            result.push(ids[i]);
                        }
                    }
                }
                else {
                    result = ids;
                }
                var surveyid = $("#SurveyId").val();
                console.log(result);
                $.ajax({
                    url: "/admin/gestion-encuestas/sendSurveys",
                    type: "POST",
                    data: {
                        sectionId : result,
                        surveyid: surveyid
                    },
                    success: function () {
                        toastr.success(_app.constants.toastr.message.success.task, _app.constants.toastr.title.success);
                        loadDatatable();
                    },
                    error: function () {
                        toastr.error(_app.constants.toastr.message.error.task, _app.constants.toastr.title.error);
                    }
                });
            }); 
        }
    };
    
    return {
        init: function () {  
            options.extensions = {
                checkbox: {
                    vars: {
                        selectedAllRows: 'selectedAllRows',
                        requestIds: 'requestIds',
                        rowIds: 'meta.rowIds',
                    },
                },
            }; 
            datatable = $('.m-datatable').mDatatable(options);
            datatable.on('m-datatable--on-click-checkbox m-datatable--on-layout-updated', function (e) {
                var ids = datatable.checkbox().getSelectedId();
                var count = ids.length;
                console.log("IDS" + count);
                console.log(datatable.checkbox());
            });
            loadSelect();
            events.init(); 
        }
    }

}();
jQuery(document).ready(function () {
    Table.init();
});