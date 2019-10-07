var Questions = (function () {
    var private = {
        ajax: {
            objects: {}
        }
    }
    var loadQuestions = function () {
        var surveyUserId = $("#SurveyUserId").val();
        $.ajax({
            url: ("/admin/gestion-encuestas/getquestions/" + surveyUserId).proto().parseURL(),
            type: "POST",
            success: function (result) {
                var div = "";
                if (result.length > 0) {
                    for (var i = 0; i < result.length; i++) {
                        div += "<div class=\"row\">";
                        div += "    <div class=\"col-md-6\">";
                        div += "    <div class=\"form-group m-form__group\">";
                        div += "        <label>" + (i + 1) + ".- " + result[i].description + "</label>";
                         if (result[i].type === _app.constants.survey.unique_selection_question) {
                            if (result[i].answers !== null && result[i].answers.length > 0) {
                                div += "<div class=\"m-radio-inline\">";
                                for (var j = 0; j < result[i].answers.length; j++) {
                                    div += "<label class=\"m-radio\">";
                                    console.log(result[i].answers[j].selected);
                                   
                                    if (result[i].answers[j].selected) {
                                        div += "    <input disabled=\"disabled\" id=" + result[i].answers[j].id + " value=" + result[i].answers[j].id + " name='" + result[i].description+i + "' data-questionid=" + result[i].id + " checked";
                                        div += " type=\"radio\" >" + result[i].answers[j].description;
                                        div += "    <span></span>";
                                        div += "</label>";
                                    }
                                    else{
                                        div += "    <input disabled=\"disabled\" id=" + result[i].answers[j].id + " value=" + result[i].answers[j].id + " name='" + result[i].description+i + "' data-questionid=" + result[i].id + "";
                                        div += " type=\"radio\" >" + result[i].answers[j].description;
                                        div += "    <span></span>";
                                        div += "</label>";
                                    }
                                }
                                div += "</div>";
                            }
                        } 
                        div += "        </div> ";
                        div += "    </div>";
                        div += "    </div>";
                    }

                }
                else {
                    div += "<h5>La encuesta aún no ha sido respondida</h5>"
                }
                $("#questions").append(div);
            }

        });

    };


    return {
        init: function () {
            loadQuestions();
        }
    }
}());

var DefaultAjaxFunctions = function () {
    var beginAjaxCall = function () {
        $(".btn-submit").each(function (index, element) {
            $(this).addLoader();
        });
    };
    var endAjaxCall = function () {
        $(".btn-submit").each(function (index, element) {
            $(this).removeLoader();
        });
    };
    var ajaxSuccess = function () {
        toastr.success(_app.constants.toastr.message.success.task, _app.constants.toastr.title.success);
    };
    var createFailure = function (e) {
        toastr.success(_app.constants.toastr.message.error.create, _app.constants.toastr.title.error);
    };

    return {
        beginAjaxCall: function () {
            beginAjaxCall();
        },
        endAjaxCall: function () {
            endAjaxCall();
        },
        ajaxSuccess: function () {
            ajaxSuccess();
        },
        createFailure: function (e) {
            createFailure(e);
        }
    };
}();

$(function () {
    Questions.init();
});



