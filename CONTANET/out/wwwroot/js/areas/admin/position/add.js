var NonActivity = function () { 

    var events = {
        init: function () {
            $('#File').on('change', function () {
                let fileName = $(this).val();
                console.log(fileName);
                $(this).next().next().html(fileName);
            }); 
        }
    }

    var initValues = function () {
        $("#File").prop('required', true); 
        $("#Age").val("");
    };

    var validate = function () {

        $("#form-validate").validate({
            rules: {
                File: {
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

    return {
        init: function () {
            initValues();
            validate(); 
            events.init();

        }
    }
}();

jQuery(document).ready(function () {
    NonActivity.init();
});