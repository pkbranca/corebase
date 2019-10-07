
var TeacherTable = function () {
    var datatable;

    var options =
        {
            search: {
                input: $('#search')
            },
            data: {
                type: 'remote',
                source: {
                    read: {
                        method: 'GET',
                        url: '/admin/secretarios-academicos/list'.proto().parseURL(),
                    },
                },
                pageSize: 10
            },
            columns: [
                {
                    field: 'teacherName',
                    title: 'Profesor',
                    width: 200
                },
                {
                    field: 'facultyName',
                    title: 'Facultad',
                    width: 70
                },
                {
                    field: 'options',
                    title: 'Opciones',
                    width: 200,
                    sortable: false,
                    filterable: false,
                    template: function (row) {
                        return '<button data-id="' + row.id + '" class="btn btn-primary btn-sm m-btn m-btn--icon btn-edit" title="Editar"><span><i class="la la-edit"></i><span>Editar</span></span></button> <button data-id="' + row.id + '" class="btn btn-danger btn-sm m-btn m-btn--icon btn-delete" title="Eliminar"><span><i class="la la-trash"></i><span>Eliminar</span></span></button>'
                    }
                }
            ]
        };

    var events = {
        init: function () {
            datatable.on('click', '.btn-edit', function () {
                var aux = $(this);
                var id = aux.data('id');

                $.ajax({
                    url: "/admin/secretarios-academicos/get?id=" + id,
                    type: "get"
                })
                    .done((data) => {
                        $("#uId").val(data.id);
                        $("#uTeacherName").text(data.teacherName);
                        $("#uTeacherId").val(data.teacherId);
                        $("#uFacultyId").val(data.facultyId).trigger("change");

                        $("#edit_modal").modal("show");
                    });

            });

            datatable.on('click', '.btn-delete', function () {
                var id = $(this).data('id');
                swal({
                    title: '¿Está seguro?',
                    text: "El secretario académico será eliminado",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, eliminarlo',
                    confirmButtonClass: 'btn btn-danger m-btn m-btn--custom',
                    cancelButtonText: 'Cancelar',
                    showLoaderOnConfirm: true,
                    allowOutsideClick: () => !swal.isLoading(),
                    preConfirm: () => {
                        return new Promise((resolve) => {
                            $.ajax({
                                url: "/admin/secretarios-academicos/eliminar",
                                type: "POST",
                                data: {
                                    id: id
                                },
                                success: function (result) {
                                    datatable.reload();
                                    swal({
                                        type: 'success',
                                        title: 'Completado',
                                        text: 'El secretario académico ha sido eliminado con éxito',
                                        confirmButtonText: 'Excelente'
                                    });
                                },
                                error: function (errormessage) {
                                    swal({
                                        type: 'error',
                                        title: 'Error',
                                        confirmButtonClass: 'btn btn-danger m-btn m-btn--custom',
                                        confirmButtonText: 'Entendido',
                                        text: 'Al parecer el secretario académico tiene información relacionada'
                                    });
                                }
                            });
                        })
                    }
                });
            });
        }
    }

    var selects = {
        teacherSelect: {
            init: function () {
                $.ajax({
                    url: "/admin/secretarios-academicos/profesores/get",
                    type: "get"
                }).done((data) => {
                    var newHtml = "";

                    $.each(data, function (i, v) {
                        newHtml += `<option value="${v.id}">${v.name}</option>`;
                    });

                    $("#cTeacherId").html(newHtml);
                    $("#cTeacherId").select2({
                        dropdownParent: $("#create_modal")
                    });

                });
            }
        },
        facultySelect: {
            init: function () {
                $.ajax({
                    url: "/admin/secretarios-academicos/facultades/get",
                    type: "get"
                }).done((data) => {
                    var newHtml = "";

                    $.each(data, function (i, v) {
                        newHtml += `<option value="${v.id}">${v.name}</option>`;
                    });

                    $("#cFacultyId").html(newHtml);
                    $("#cFacultyId").select2({
                        dropdownParent: $("#create_modal")
                    });
                    $("#uFacultyId").html(newHtml);
                    $("#uFacultyId").select2({
                        dropdownParent: $("#edit_modal")
                    });
                });
            }
        },
        init: function () {
            selects.teacherSelect.init();
            selects.facultySelect.init();
        }
    };

    var forms = {
        create: {
            init: function () {
                $("#create-form").validate({
                    rules: {
                        TeacherId: {
                            required: true
                        },
                        FacultyId: {
                            required: true
                        }
                    },
                    submitHandler: function (form, e) {
                        e.preventDefault();
                        mApp.block(form);
                        $(form).ajaxSubmit({
                            success: function (data) {
                                toastr.success(data);
                                $("#create_modal").modal("hide");
                                datatable.reload();
                            },
                            error: function (jqXhr) {
                                toastr.error(jqXhr.responseText);
                            },
                            complete: function () {
                                mApp.unblock(form);
                            }
                        });
                    }
                });
            }
        },
        edit: {
            init: function () {
                $("#edit-form").validate({
                    rules: {
                        FacultyId: {
                            required: true
                        }
                    },
                    submitHandler: function (form, e) {
                        e.preventDefault();
                        mApp.block(form);
                        $(form).ajaxSubmit({
                            success: function (data) {
                                toastr.success(data);
                                $("#edit_modal").modal("hide");
                                datatable.reload();
                            },
                            error: function (jqXhr) {
                                toastr.error(jqXhr.responseText);
                            },
                            complete: function () {
                                mApp.unblock(form);
                            }
                        });
                    }
                });
            }
        },
        init: function () {
            forms.create.init();
            forms.edit.init();
        }
    };

    return {
        init: function () {
            datatable = $(".m-datatable").mDatatable(options);
            events.init();
            selects.init();
            forms.init();
        }
    }
}();

$(function () {
    TeacherTable.init();
});
