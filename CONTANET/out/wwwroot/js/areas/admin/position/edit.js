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
     
    var validate = function () {

        $("#form-validate").validate({
            rules: {
                File: { 
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
            validate();
            events.init();

        }
    }
}();

jQuery(document).ready(function () {
    NonActivity.init();
});