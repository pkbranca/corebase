var Form = function () {

   

    var form = {
        begin: function () {
            $('#edit-form input').attr('disabled', true);
            $('#edit-form select').attr('disabled', true);
            $('#btnSave').addLoader();
        },
        complete: function () {
            $('#edit-form input').attr('disabled', false);
            $('#edit-form select').attr('disabled', false);
            $('#btnSave').removeLoader();
        },
        success: function (e) {
            toastr.success(_app.constants.toastr.message.success.task, _app.constants.toastr.title.success);
        },
        failure: function (e) {
            console.log($(".password").val());
            console.log($("#edit-form"));

            if ($(".password").val() !== $(".confirmedPassword").val()) {
                toastr.error("Las contraseñas deben coincidir", _app.constants.toastr.title.error);
            } else {
                toastr.error(_app.constants.toastr.message.error.task, _app.constants.toastr.title.error);
            }

            if (e.responseText !== null) {
                $('#alert-text').html(e.responseText);
                $('#edit-form input').attr('disabled', false);
                $('#edit-form select').attr('disabled', false);
                $('#btnSave').removeLoader();
            }
            else $('#alert-text').html(_app.constants.toastr.message.error.task);
            $('#m-form_alert').removeClass('m--hide').show();

        }
    }

    return {
        init: function () {
            $("#edit-form").validate({
                rules: {
                    ConfirmedPassword: {
                        equalTo: "#Password"
                    }
                }
            }); 
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