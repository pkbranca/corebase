var NonActivity = function () {

    var loadDatapicker = function () {           
        $("#IssueDate").datepicker().datepicker("setDate", new Date()); 
    }

    var events = {
        init: function(){
            $('#ResolutionFile').on('change', function () {
                let fileName = $(this).val();
                console.log(fileName);
                $(this).next().next().html(fileName);
            });

            $('#NormativeFile').on('change', function () {
                let fileName = $(this).val();
                console.log(fileName);
                $(this).next().next().html(fileName);
            });
        }
    }

    var initValues = function () {
        $("#NormativeFile").prop('required', true);
        $("#ResolutionFile").prop('required', true);
        $("#MandatoryHours").val("");
        $("#MinHours").val("");
        $("#MaxHours").val("");
    };
    
    var validate = function () { 

        $("#form-validate").validate({  
            rules: {
                NormativeFile: {
                    required: true,
                    extension: "pdf"
                },
                ResolutionFile: {
                    required: true,
                    extension: "pdf"
                }
            },
            submitHandler: function (form) {
                $(".btn-submit").addLoader();
                form.submit();
            }
        });

    }
    var loadDependencies = function () {
        return $.ajax({
            url: ("/admin/actividades-no-lectivas/getDependencies").proto().parseURL()
        }).done(function (data) {
            $("#DependencyId").select2({
                data: data.result
            });
        })
    }

    return {
        init: function () {
            initValues();
            validate();
            loadDependencies();
            loadDatapicker();
            events.init();
            
        }
    }
}();

jQuery(document).ready(function () { 
    NonActivity.init();
});