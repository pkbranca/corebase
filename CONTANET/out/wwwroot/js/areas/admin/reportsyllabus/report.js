var Report = function() {
        
    var events = {
        init: function () {
            $("[data-toggle='m-tooltip']").tooltip();
            $("[rel='m-tooltip']").tooltip();
        }
    }

    return {
        init: function() {
            events.init();
        }
    }
}();

$(function() {
    Report.init();
})