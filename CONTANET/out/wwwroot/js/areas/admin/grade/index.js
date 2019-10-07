var StudentTable = function () {

    var datatable;

    return {

        init: function (id) {
            datatable = $(".m-datatable").mDatatable({
                search: {
                    input: $("#search")
                },
                data: {
                    type: "remote",
                    source: {
                        read: {
                            method: "GET",
                            url: ("/admin/notas/alumnos/get").proto().parseURL()
                        }
                    },
                    pageSize: 50,
                    saveState: {
                        cookie: true,
                        webstorage: true
                    }
                },
                sortable: true,
                pagination: true,
                toolbar: {
                    items: {
                        pagination: {
                            pageSizeSelect: [10, 20, 30, 50, 100]
                        },
                        info: false
                    }
                },
                columns: [
                    {
                        field: "code",
                        title: "Código"
                    },
                    {
                        field: "name",
                        title: "Alumno"
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
                        field: "academicYear",
                        title: "Ciclo"
                    },
                    {
                        field: "options",
                        title: "Detalle",
                        sortable: false,
                        filterable: false,
                        template: function (row) {
                            return '<button class="btn btn-secondary btn-sm m-btn m-btn--icon detail" data-id="' + row.id + '"><span><i class="la la-edit"></i><span> Ver Detalle </span></span></a>';
                        }
                    }
                ]
            });

            //datatable
            //    .on("click", ".detail", function () {
            //        var code = $(this).closest(".m-datatable__row").find("span")[0].innerHTML;
            //        var name = $(this).closest(".m-datatable__row").find("span")[1].innerHTML;

            //        $("#code_student").val(code);
            //        $("#name_student").val(name);

            //        $("#detail_modal").modal();
            //        SectionTable.loadTable($(this).data("id"));
            //    });
        }
    }
}();

jQuery(document).ready(function () {
    StudentTable.init();
});
