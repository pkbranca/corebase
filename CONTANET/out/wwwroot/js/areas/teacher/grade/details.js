//== Class definition

var pageInit = function () {
    //== Private functions
    var datatable;
    var options = {
        data: {
            type: "local"
        },
        sortable: false,
        pagination: false,
        type: "local",
        columns: columns
    }

    var tableInitializer = function () {
        datatable = $(".m-datatable").mDatatable(options);       
    };

    var selectInitializer = function () {
        $("#selEvaluation").select2({
            placeholder: "Seleccione una evaluación",
            minimumResultsForSearch: -1
        });

        $("#btnRegister").click(function () {
            var url = $("#btnRegister").data("url");
            url = url.slice(0, -1);

            var evId = $("#selEvaluation").val();
            
            if (evId === "") {
                swal("Evaluación no seleccionada", "Seleccione una evaluación para registrar las notas", "warning");
            } else {
                window.location.href = url + evId;
            }
        });
    }

    return {
        //== Public functions
        init: function () {
            // init
            tableInitializer();
            selectInitializer();
        },
    };
}();

jQuery(document).ready(function () {
    pageInit.init();
});