var Form = function () {
    var formValidate = $("#add-form").validate({
        rules: {
            Password: "required",
            ConfirmedPassword: {
                equalTo: "#Password"
            }
        }
    });

     
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
            location.href = ('/admin/docentes').proto().parseURL();
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
            select2.conditions.init();
        },
        begin: function () {
            form.begin();
        },
        complete: function () {
            form.complete();
        },
        success: function () {
            form.success();
        },
        failure: function (e) {
            form.failure(e);
        }
    }
}();

$(function () {
    Form.init();
});