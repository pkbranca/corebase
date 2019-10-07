var Form = function () {
    var formValidate = $("#add-form").validate();


    var select2 = {
        dependencies: {
            init: function () {
                $.ajax({
                    url: ('/dependencias/get').proto().parseURL()
                }).done(function (data) {
                    $('.select2-dependencies').select2({
                        minimumInputLength: 0,
                        placeholder: 'Roles',
                        data: data.items
                    });
                });
            }
        },
        roles: {
            init: function () {
                $.ajax({
                    url: ('/roles/get').proto().parseURL()
                }).done(function (data) {
                    $('.select2-roles').select2({
                        placeholder: 'Dependencias',
                        minimumInputLength: 0,
                        data: data.items
                    });
                });
            }
        }
    }

    var form = {
        begin: function () {
            $('#add-form input').attr('disabled', true);
            $('#add-form select').attr('disabled', true);
            $('#btnSave').addLoader();
        },
        complete: function () {
            $('#add-form input').attr('disabled', false);
            $('#add-form select').attr('disabled', false);
            $('#btnSave').removeLoader();
        },
        success: function (e) {
            location.href = ('/admin/usuarios').proto().parseURL();
        },
        failure: function (e) {
            toastr.error(_app.constants.toastr.message.error.task, _app.constants.toastr.title.error);
            if (e.responseText != null) $('#alert-text').html(e.responseText);
            else $('#alert-text').html(_app.constants.toastr.message.error.task);
            $('#m-form_alert').removeClass('m--hide').show();
            mApp.scrollTop();
        }
    }

    return {
        init: function () {
            select2.dependencies.init();
            select2.roles.init();
        },
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
}();

$(function () {
    Form.init();
})