var NonActivity = function () {
    var loadDatapicker = function () {
        $("#IssueDate").datepicker();
       // console.log($("#IssueDate").val());
       // $("#IssueDate").datepicker().datepicker("setDate", $("#IssueDate").val());
    };

    var validate = function () {
        $("#form-validate").validate({ 
            rules: {
                NormativeFile: { 
                    extension: "pdf", 
                },
                ResolutionFile: { 
                    extension: "pdf", 
                }
            },
            submitHandler: function (form) {
                $(".btn-submit").addLoader();
                form.submit(); 
            }
        });

    };

    var loadDependencies = function () {
        return $.ajax({
            url: ("/admin/actividades-no-lectivas/getDependencies").proto().parseURL()
        }).done(function (data) {
            $("#DependencyId").select2({
                data: data.result
            });
            var dependencyIdDefault = $("#DependencyIdDefault").val();
            $("#DependencyId").val(dependencyIdDefault);
            $("#DependencyId").trigger("change");
            
        });
    };

    return {
        init: function () {
            validate();
            loadDependencies();
            loadDatapicker();
        }
    }
}();

jQuery(document).ready(function () {
    NonActivity.init();
});