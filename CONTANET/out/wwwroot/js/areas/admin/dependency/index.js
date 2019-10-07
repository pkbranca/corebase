var Dependency = function () {
    var datatable;
    var formCreateValidation = $("#add-form").validate();
    var formEditValidation = $("#edit-form").validate();

    var options = {
        data: {
            source: {
                read: {
                    method: 'GET',
                    url: ('/admin/dependencias/get').proto().parseURL()
                }
            }
        },
        columns: [
            {
                field: 'name',
                title: 'Nombre de la Dependencia'
            },
            {
                field: 'options',
                title: 'Opciones',
                sortable: false,
                filterable: false,
                template: function (row) {
                    var template = '';
                    template += '<button data-id="' + row.id + '" class="btn btn-primary btn-sm m-btn m-btn--icon btn-edit"><span><i class="la la-edit"></i><span>Editar</span></button>';
                    template += ' <button data-id="' + row.id + '" class="btn btn-danger btn-sm m-btn m-btn--icon btn-delete"><span><i class="la la-trash"></i><span>Eliminar</span></span></button>';
                    return template;
                }
            }
        ]
    }

    var events = {
        init: function () {
            $(".btn-add").on("click", function () {
                create.show();
            });

            datatable.on("click", ".btn-delete", function () {
                var id = $(this).data("id");
                swal({
                    title: '¿Está seguro?',
                    text: "La dependenia será eliminada permanentemente",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, eliminarla',
                    confirmButtonClass: 'btn btn-danger m-btn m-btn--custom',
                    cancelButtonText: 'Cancelar',
                    showLoaderOnConfirm: true,
                    preConfirm: () => {
                        return new Promise((resolve) => {
                            $.ajax({
                                url: "/admin/dependencias/eliminar/post",
                                type: "POST",
                                data: {
                                    id: id
                                },
                                success: function (result) {
                                    dependency.datatable.refresh();
                                    showSuccessNotification();
                                    swal({
                                        type: 'success',
                                        title: 'Completado',
                                        text: 'La dependencia ha sido eliminada con éxito',
                                        confirmButtonText: 'Excelente'
                                    });
                                },
                                error: function (errormessage) {
                                    toastr.error('La dependencia tiene información relacionada', 'Error');
                                    swal({
                                        type: 'error',
                                        title: 'Error',
                                        confirmButtonClass: 'btn btn-danger m-btn m-btn--custom',
                                        confirmButtonText: 'Entendido',
                                        text: 'Al parecer la dependencia tiene información relacionada'
                                    });
                                }
                            });
                        })
                    },
                    allowOutsideClick: () => !swal.isLoading()
                });
            });

            datatable.on("click", ".btn-edit", function () {
                var id = $(this).data("id");
                edit.show(id);
            });
        }
    }


    var create = {
        show: function () {
            $('#add_dependency_modal').modal('toggle');
            $('#add_dependency_modal').one('hidden.bs.modal', function (e) {
                create.reset();
            });
        },
        reset: function () {
            $('#add_form_msg').addClass('m--hide').hide();
            formCreateValidation.resetForm();
        },
        begin: function () {
            $('#add_dependency_modal input').attr('disabled', true);
            $('#btnCreate').addLoader();
        },
        complete: function () {
            $('#add_dependency_modal input').attr('disabled', false);
            $('#btnCreate').removeLoader();
        },
        success: function (e) {
            $('#add_dependency_modal').modal('toggle');
            toastr.success(_app.constants.toastr.message.success.task, _app.constants.toastr.title.success);
            datatable.reload();
        },
        failure: function (e) {
            toastr.error(_app.constants.toastr.message.error.task, _app.constants.toastr.title.error);
            if (e.responseText != null) $('#add_form_msg_txt').html(e.responseText);
            else $('#add_form_msg_txt').html(_app.constants.toastr.message.error.task);
            $('#add_form_msg').removeClass('m--hide').show();
        }
    }

    var edit = {
        show: function (id) {
            $('#edit_dependency_modal').modal('toggle');
            $('#edit_dependency_modal').on('shown.bs.modal', function (e) {
                mApp.block('#edit_dependency_modal .modal-content', { type: 'loader', message: 'Cargando...' });
                $.ajax({
                    url: ('/admin/dependencias/' + id + '/get').proto().parseURL(),
                    type: 'GET'
                }).done(function (result) {
                    var formElements = $('#edit-form').get(0).elements;
                    formElements['Id'].value = result.id,
                    formElements['Fields_Name'].value = result.name;
                }).fail(function (error) {
                    toastr.error(_app.constants.toastr.message.error.task, _app.constants.toastr.title.error);
                }).always(function (result) {
                    mApp.unblock('#edit_dependency_modal .modal-content');
                });
            });
            $('#edit_dependency_modal').one('hidden.bs.modal', function (e) {
                    edit.reset();
            });
        },
        reset: function () {
            $('#edit_form_msg').addClass('m--hide').hide();
            formEditValidation.resetForm();
        },
        begin: function () {
            $('#edit_dependency_modal input').attr('disabled', true);
            $('#btnSave').addLoader();
        },
        complete: function () {
            $('#edit_dependency_modal input').attr('disabled', false);
            $('#btnSave').removeLoader();
        },
        success: function (e) {
            $('#edit_dependency_modal').modal('toggle');
            toastr.success(_app.constants.toastr.message.success.task, _app.constants.toastr.title.success);
            datatable.reload();
        },
        failure: function (e) {
            toastr.error(_app.constants.toastr.message.error.task, _app.constants.toastr.title.error);
            if (e.responseText != null) $('#edit_form_msg_txt').html(e.responseText);
            else $('#edit_form_msg_txt').html(_app.constants.toastr.message.error.task);
            $('#edit_form_msg').removeClass('m--hide').show();
        }
    }
    

    return {
        init: function () {
            datatable = $("#dependenciesDatatable").mDatatable(options);
            events.init();
        },
        Form: {
            Create: {
                begin: function () {
                    create.begin();
                },
                complete: function () {
                    create.complete();
                },
                success: function (e) {
                    create.success(e);
                },
                failure: function (e) {
                    create.failure(e);
                }
            },
            Edit: {
                begin: function () {
                    edit.begin();
                },
                complete: function () {
                    edit.complete();
                },
                success: function (e) {
                    edit.success(e);
                },
                failure: function (e) {
                    edit.failure(e);
                }
            }
        }
    }
}();

$(function () {
    Dependency.init();
});

//var dependencySettings = {
    
//};

//_app.datatable.elements = {
//    'dependency-datatable': {
//        selector: '#dependenciesDatatable',
//        settings: dependencySettings 
//    }
//};

//_app.validate.elements = {
//    'add-form': {
//        selector: '#add-form',
//        settings: {}
//    },
//    'edit-form': {
//        selector: '#edit-form',
//        settings: {}
//    }
//};

//var dependency = {
//    form: {
//        add: {
//            reset: function () {
//                $('#add_form_msg').addClass('m--hide').hide();
//                _app.validate.resetForm.single('add-form');
//            }
//        },
//        edit: {
//            reset: function () {
//                $('#edit_form_msg').addClass('m--hide').hide();
//                _app.validate.resetForm.single('edit-form');
//            }
//        }
//    },
//    datatable: {
//        init: function () {
//            _app.datatable.load.all();
//        },
//        refresh: function () {
//            _app.datatable.reload.single('dependency-datatable');
//        },
//        destroy: function () {
//            _app.datatable.destroy.single('dependency-datatable');
//        }
//    },
//    load: function () {
//        dependency.datatable.init();
//    },
//    create: {
//        show: function () {
//            $('#add_dependency_modal').modal('toggle');
//            $('#add_dependency_modal').one('hidden.bs.modal', function (e) {
//                area.form.add.reset();
//            });
//        },
//        begin: function () {
//            $('#add_dependency_modal input').attr('disabled', true);
//            $('#btnCreate').addLoader();
//        },
//        complete: function () {
//            $('#add_dependency_modal input').attr('disabled', false);
//            $('#btnCreate').removeLoader();
//        },
//        success: function (e) {
//            $('#add_dependency_modal').modal('toggle');
//            showSuccessNotification();
//            dependency.datatable.refresh();
//        },
//        failure: function (e) {
//            showErrorNotification();
//            if (e.responseText != null) $('#add_form_msg_txt').html(e.responseText);
//            else $('#add_form_msg_txt').html(_app.constants.toastr.message.error.task);
//            $('#add_form_msg').removeClass('m--hide').show();
//        }
//    },
//    update: {
//        show: function (id) {
//            $('#edit_dependency_modal').modal('toggle');
//            $('#edit_dependency_modal').on('shown.bs.modal', function (e) {
//                mApp.block('#edit_dependency_modal .modal-content', { type: 'loader', message: 'Cargando...' });
//                $.ajax({
//                    url: ('/admin/dependencias/' + id + '/get').proto().parseURL(),
//                    type: 'GET'
//                }).done(function (result) {
//                    var formElements = $('#edit-form').get(0).elements;
//                    formElements['Id'].value = result.id,
//                    formElements['Fields_Name'].value = result.name;
//                }).fail(function (error) {
//                    showErrorNotification();
//                }).always(function (result) {
//                    mApp.unblock('#edit_dependency_modal .modal-content');
//                });
//            });
//            $('#edit_dependency_modal').one('hidden.bs.modal', function (e) {
//                dependency.form.edit.reset();
//            });
//        },
//        begin: function () {
//            $('#edit_dependency_modal input').attr('disabled', true);
//            $('#btnSave').addLoader();
//        },
//        complete: function () {
//            $('#edit_dependency_modal input').attr('disabled', false);
//            $('#btnSave').removeLoader();
//        },
//        success: function (e) {
//            $('#edit_dependency_modal').modal('toggle');
//            showSuccessNotification();
//            dependency.datatable.refresh();
//        },
//        failure: function (e) {
//            showErrorNotification();
//            if (e.responseText != null) $('#edit_form_msg_txt').html(e.responseText);
//            else $('#edit_form_msg_txt').html(_app.constants.toastr.message.error.task);
//            $('#edit_form_msg').removeClass('m--hide').show();
//        }
//    },
//    delete: function (id, status) {
        
//    }
//}

//window.onload = function () {
//    dependency.load();
//    _app.validate.load.all();
//}