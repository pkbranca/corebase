var Form = function () {
    var form = $("#add-form").validate({
        rules: {
            Password: "required",
            ConfirmedPassword: {
                equalTo: "#Password"
            } 
        }
    });

    var select2 = {
        conditions: {
            init: function () {
                $('.select2-condition').select2({
                    minimumInputLength: 0,
                    placeholder: 'Condición',
                });

                $.ajax({
                    url: ('/admin/dedicationteacher/select/get').proto().parseURL()
                }).done(function (data) {
                    $('.select2-dedication').select2({
                        minimumInputLength: 0,
                        placeholder: 'Dedicación',
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