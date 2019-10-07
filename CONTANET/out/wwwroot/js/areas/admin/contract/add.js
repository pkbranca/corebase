var Form = function () {
    var form = $("#add-form").validate();

    var select2 = {
        conditions: {
            init: function () {
                $.ajax({
                    url: ('/admin/docentes/select/get/').proto().parseURL(),
                }).done(function (data) {
                    $('.select2-teachers').select2({
                        minimumInputLength: 0,
                        placeholder: 'Docentes',
                        data: data.items
                    });
                });
            }
        }
    }

    var initFormDatepickers = function () {
        $("#Begin").datepicker()
            .on("changeDate", function (e) {
                $("#End").datepicker("setStartDate", e.date);
            });

        $("#End").datepicker()
            .on("changeDate", function (e) {
                $("#Begin").datepicker("setEndDate", e.date);
            });
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
            location.href = ('/admin/contratos').proto().parseURL();
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
            initFormDatepickers();
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