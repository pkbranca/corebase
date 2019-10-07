var Form = function () {

    var loadDatapicker = function () {
        $("#LaborFields_DateAppointment").datepicker();
        $("#LaborFields_ResolutionIssueDate").datepicker();
        $("#LaborFields_DatePromotion").datepicker();
        $("#DateAdmission").datepicker().datepicker("setDate", new Date());
    };

    var select2 = {
        careers: {
            init: function () {
                $('.select2-condition').select2({
                    placeholder: 'Condición',
                    minimumInputLength: 0,
                });
                $('.select2-listlevelstudy').select2({
                    placeholder: 'Nivel de Estudio',
                    minimumInputLength: 0,
                });
                $('.select2-liststates').select2({
                    placeholder: 'Estatal',
                    minimumInputLength: 0,
                });
                $('.select2-listlabortypes').select2({
                    placeholder: 'Tipo de Labor',
                    minimumInputLength: 0,
                });

                $('.select2-listregimes').select2({
                    placeholder: 'Regimen',
                    minimumInputLength: 0,
                });

                $('.select2-listlaborconditions').select2({
                    placeholder: 'Condición',
                    minimumInputLength: 0,
                });

                $('.select2-listcategories').select2({
                    placeholder: 'Categoría',
                    minimumInputLength: 0,
                });

                $('.select2-listdedications').select2({
                    placeholder: 'Dedicación',
                    minimumInputLength: 0,
                });

                $.ajax({
                    url: ('/admin/docentes/teachlaborselect/get').proto().parseURL()
                }).done(function (data) {
                    $(".select2-dependencies").select2({
                        minimumInputLength: 0,
                        placeholder: 'Dedicación',
                        data: data.dependencies
                    }); 
                    $(".select2-campuses").select2({
                        minimumInputLength: 0,
                        placeholder: 'Campuses',
                        data: data.campuses
                    });
                });

                $.ajax({
                    url: ('/admin/docentes/countries/get').proto().parseURL()
                }).done(function (data) {
                    $(".select2-countries").select2({
                        minimumInputLength: 0,
                        placeholder: 'País',
                        data: data.countries
                    });
                });

                $.ajax({
                    url: ('/admin/dedicationteacher/select/get').proto().parseURL()
                }).done(function (data) {
                    $('.select2-dedication').select2({
                        minimumInputLength: 0,
                        placeholder: 'Dedicación',
                        data: data.items
                    }); 
                    $('.select2-dedication').val($("#SelectedDedicationDefault").val());
                    $('.select2-dedication').trigger("change");
                });
            }
        }
    }
 
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

            if ($(".password").val() != $(".confirmedPassword").val()) {
                toastr.error("Las contraseñas deben coincidir", _app.constants.toastr.title.error);
            } else {
                toastr.error(_app.constants.toastr.message.error.task, _app.constants.toastr.title.error);
            }

            if (e.responseText != null) {
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
            loadDatapicker();
            select2.careers.init(); 
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