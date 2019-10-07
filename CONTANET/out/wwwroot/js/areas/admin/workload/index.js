var DatatableChildDataLocalDemo = function () {
    var datatable;

    var e = function (e) {
        $("<div/>").attr("id", "child_data_local_" + e.data.RecordID).appendTo(e.detailCell).mDatatable({
            data: {
                type: "local",
                source: e.data.Sections
            },
            sortable: false,
            pagination: false,
            columns: [
                {
                    field: "Code",
                    title: "Sección",
                },
                {
                    field: "Id",
                    title: "Alumnos",
                    //width: 100
                    template: function (row) {
                        return '<button data-target="#students_modal" data-toggle="modal" class="btn btn-info btn-sm m-btn m-btn--icon edit"><span><i class="la la-edit students"></i><span> Alumnos </span></span></button>';
                    }
                },
                {
                    field: "Id2",
                    title: "Evaluaciones",
                    //width: 100
                    template: function (row) {
                        return '<button data-target="#evaluations_modal" data-toggle="modal" class="btn btn-success btn-sm m-btn m-btn--icon "><span><i class="la la-edit evaluations"></i><span> Evaluaciones </span></span></button>';
                    }
                }
            ]
        });
    };
    return {
        init: function () {
            var r;

            r = JSON.parse(
                '[{"RecordID":1,"Code":"IN-01","Course":"Matemática 1","Sections":[{"Code":"A","Id":"FR"},{"Code":"B","Id":"FasR"}]}, {"RecordID":2, "Code":"IN-02","Course":"Matemática 2","Sections": [{"Code":"A","Id":"FR"}] }]'
            );

            datatable = $("#workload_table").mDatatable({
                data: {
                    type: "local",
                    source: r
                },
                detail: {
                    title: "Cargar subtablas",
                    content: e
                },
                sortable: false,
                pagination: false,
                columns: [
                    {
                        field: "RecordID",
                        title: "",
                        sortable: !1,
                        width: 20,
                        textAlign: "center"
                    },
                    {
                        field: "Code",
                        title: "Código"
                    },
                    {
                        field: "Course",
                        title: "Curso"
                    }
                ]
            });

            datatable.on("click", ".students", function () {
                $("#students_modal").modal("show");
            })
                .on("click", ".delete", function () {
                    $("#students_modal").modal("show");
                });
        }
    }
}();

var ModalDatatables = function () {

    var students = function () {
        r = JSON.parse(
            '[{ "code": "u201810001", "name": "Flores Soto Juan" }, { "code": "u201810002", "name": "Dávila Luis" }]'
        );

        $("#students_table").mDatatable({
            data: {
                type: "local",
                source: r
            },
            sortable: false,
            pagination: false,
            columns: [
                {
                    field: "code",
                    title: "Código"
                },
                {
                    field: "name",
                    title: "Alumno"
                }
            ]
        });


    }

    var evaluations = function () {

        $("#evaluations_table").mDatatable({
            data: {
                type: "local",
                source: JSON.parse(
                    '[{ "code": "PC01", "name": "Practica Calificada 1", "taken": true }, { "code": "PC02", "name": "Practica Calificada 2", "taken": true }, { "code": "EP", "name": "Examen Parcial", "taken": false }]'
                )
            },
            sortable: false,
            pagination: false,
            columns: [
                {
                    field: "code",
                    title: "Código",
                    width: 20,
                    textAlign: "center"
                },
                {
                    field: "name",
                    title: "Evaluación"
                },
                {
                    field: "taken",
                    title: "Tomada",
                    template: function (row) {
                        if (row.taken) return "Si";
                        else return "No";
                    }
                }
            ]
        });
    }

    return {
        init: function () {
            students();
            evaluations();
        }
    }
}();

jQuery(document).ready(function () {
    DatatableChildDataLocalDemo.init();
    ModalDatatables.init();

    $("#teachers").select2();
});