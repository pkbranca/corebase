jQuery(document).ready(function () {
    $("#Type").select2({
        minimumResultsForSearch: -1,
        dropdownParent: $("#question_modal")
    });
});