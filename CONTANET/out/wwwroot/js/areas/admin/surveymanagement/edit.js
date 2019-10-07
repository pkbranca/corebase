var SurveyTable = function () {
    var loadData = function (id) {
        $.ajax({
            url: ("/admin/gestion-encuestas/get/" + id).proto().parseURL(),
            type: "GET",
            data: {
                id: id
            },
            success: function (result) {
                $("#Name").val(result.name);
                $("#PublicationDate").val(result.publicationDate);
                $("#FinishDate").val(result.finishDate);
                $("#Code").val(result.code);
                $("#Description").val(result.description);
            },
            error: function () {
                toastr.error("Error al cargar la encuesta", _app.constants.toastr.title.error);
            }
        });
    }; 
    var loadEvents = function () {
        $(".btn-send").on('click', function () {
            console.log("LOG");
            $.ajax({
                url: ("/admin/gestion-encuestas/enviar/" + $("#SurveyId")).proto().parseURL(),
                type: "POST",
                success: function () {
                },
                error: function () {
                }
            });
        });

        $(".m-portlet__body").on('click', '.open-add-question', function () {
            var data = $(this).data('id'); 
            $("#SurveyItemId").val(data);
        });

        $(".m-portlet__body").on('click', '.delete-item', function () {
            var id= $(this).data('id');
            deleteItem(id);
        });
    }; 
    var loadQuestions = function (id) {
        $.ajax({
            url: ("/admin/gestion-encuestas/preguntas/get/" + id).proto().parseURL(),
            type: "GET",
            data: {
                id: id
            },
            success: function (result) {
                var div = "";
                var col = 0;
                if (result.length > 0) {
                    for (var i = 1; i < 6; i++) {
                        div += "<div class=\"row\">";
                        div += "    <div class=\"col-md-6\">";
                        div += "        <h5 class='m-portlet__head-text'>Item " + i + "</h5>";
                        div += "    </div>"; 
                        div += "</div>"; 
                        var count = 0;
                        div += "<div class=\"row\">";
                        for (var j = 0; j < result.length; j++) { 
                            if (result[j].itemType === i) {
                                if (count % 2 === 0) {
                                   
                                    div += "    <div class=\"col-md-6\">";
                                    div += "    <div class=\"form-group m-form__group m--margin-bottom-25\">";
                                    div += "        <label>" + (col + 1) + ".- " + result[j].description + "</label>";
                                    div += "        <div style=\"float: right;\">";
                                    div += '            <a style=\"color:#1b76d6;cursor: pointer;\" class=\"edit\" data-id="' + result[j].id + '"><i class=\"la la-edit\"></i></a>';
                                    div += '            <a style=\"color:#EC6248;cursor: pointer;\" class=\"delete\" data-id="' + result[j].id + '"><i class=\"la la-trash\"></i></a>';
                                    div += "        </div> ";
                                    if (result[j].type === _app.constants.survey.unique_selection_question) {
                                        if (result[j].answers !== null && result[j].answers.length > 0) {
                                            div += "<div class=\"m-radio-inline\">";
                                            for (var k = 0; k < result[j].answers.length; k++) {
                                                div += "<label class=\"m-radio\">";
                                                div += "    <input type=\"radio\" disabled=\"disabled\">" + result[j].answers[k].description;
                                                div += "    <span></span>";
                                                div += "</label>";
                                            }
                                            div += "</div>";
                                        }
                                    }
                                    div += "    </div>";
                                    div += "    </div>"; 
                                }
                                else {
                                    div += "    <div class=\"col-md-6\">";
                                    div += "    <div class=\"form-group m-form__group m--margin-bottom-25\">";
                                    div += "        <label>" + (col + 1) + ".- " + result[j].description + "</label>";
                                    div += "        <div style=\"float: right;\">";
                                    div += '            <a style=\"color:#1b76d6;cursor: pointer;\" class=\"edit\" data-id="' + result[j].id + '"><i class=\"la la-edit\"></i></a>';
                                    div += '            <a style=\"color:#EC6248;cursor: pointer;\" class=\"delete\" data-id="' + result[j].id + '"><i class=\"la la-trash\"></i></a>';
                                    div += "        </div> ";
                                    if (result[j].type === _app.constants.survey.unique_selection_question) {
                                        if (result[j].answers !== null && result[j].answers.length > 0) {
                                            div += "<div class=\"m-radio-inline\">";
                                            for (var k = 0; k < result[j].answers.length; k++) {
                                                div += "<label class=\"m-radio\">";
                                                div += "    <input type=\"radio\" disabled=\"disabled\">" + result[j].answers[k].description;
                                                div += "    <span></span>";
                                                div += "</label>";
                                            }
                                            div += "</div>";
                                        }
                                    }
                                    div += "    </div>";
                                    div += "    </div>";
                                    
                                }   
                                col = col + 1;
                                count = count + 1;
                            }
                        }
                        div += "</div>";
                    }

                }

                document.getElementById("questions").innerHTML = div;

                $(".m-portlet__body").on('click', ".delete", function () {
                    deleteConfirmation($(this).data("id"));
                });


                $(".m-portlet__body").on('click', ".edit", function () {
                    loadQuestion($(this).data("id"));
                });
            },
            error: function () {
                toastr.error("Error al cargar las preguntas", _app.constants.toastr.title.error);
            }
        });
    };

    var loadItems = function () {
        $.ajax({
            type: "GET",
            url: "/admin/gestion-encuestas/items/get/" + $("#SurveyId").val(),
            data: {
            
            },
            success: function (data) {
                $("#item_container").html(data); 
            },
            complete: function () {
               
            }
        });
    };

    var saveData = function (id) {
        $.ajax({
            url: "/admin/gestion-encuestas/editar/post",
            type: "POST",
            data: {
                id: id,
                name: $("#Name").val(),
                publicationDate: $("#PublicationDate").val(),
                finishDate: $("#FinishDate").val(),
                code: $("#Code").val(),
                description: $("#Description").val()
            },
            success: function () {
                toastr.success(_app.constants.toastr.message.success.task, _app.constants.toastr.title.success);
            },
            error: function () {
                toastr.error("No se pudo actualizar la información", _app.constants.toastr.title.error);
            }
        });
    };

    var addItem = function () {
        $("#item-form").validate({
            submitHandler: function (e) {
                $(".btn-submit").addLoader(); 
                $.ajax({
                    url: $(e).attr("action"),
                    type: "POST",
                    data: $(e).serialize()
                }).done(function () {
                    loadItems();
                    toastr.success(_app.constants.toastr.message.success.task, _app.constants.toastr.title.success);
                }).fail(function (error) {
                    toastr.error("No se pudo guardar la información", _app.constants.toastr.title.error);
                }).always(function () {
                    $(".btn-submit").removeLoader();
                });
            }
        }); 
    };

    var addQuestion = function (id) {
        var answers = [];
        var elements = document.getElementsByClassName("answer");
        var ids = document.getElementsByClassName("answerId");
        if (elements.length < 2 && parseInt($('#Type').val()) !== _app.constants.survey.text_question) {
            toastr.error("Agregue por lo menos dos respuestas", _app.constants.toastr.title.error);
            return;
        }

        if (parseInt($('#Type').val()) !== _app.constants.survey.text_question) {
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].value === "") {
                    toastr.error("Campos vacíos", _app.constants.toastr.title.error);
                    return;
                }
                var answer = { description: elements[i].value, id: ids[i].value };
                answers.push(answer);
            }
        }
        $.ajax({
            url: "/admin/gestion-encuestas/registrar/pregunta/post",
            type: "POST",
            data: {
                id: $("#questionId").val(),
                surveyId: id,
                type: parseInt($('#Type').val()),
                surveyItemId: $('#SurveyItemId').val(),
                description: $("#qDescription").val(), 
                answers: answers
            },
            beforeSend: function () {
                DefaultAjaxFunctions.beginAjaxCall();
            },
            success: function () {
                $("#question_modal").modal("hide");
                $('#qDescription').val("");
                loadItems();
                document.getElementById("question-answers").innerHTML = "";
                toastr.success(_app.constants.toastr.message.success.task, _app.constants.toastr.title.success);
            },
            error: function () {
                toastr.error("No se puedo agregar la pregunta", _app.constants.toastr.title.error);
            },
            complete: function () {
                loadQuestions(id);
                DefaultAjaxFunctions.endAjaxCall();
            }
        });
    };

    var deleteConfirmation = function (id) {
        swal({
            title: "¿Está seguro?",
            text: "La pregunta será eliminada permanentemente",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, eliminarla",
            confirmButtonClass: "btn btn-danger m-btn m-btn--custom",
            cancelButtonText: "Cancelar"
        }).then(function (result) {
            if (result.value) {
                $.ajax({
                    url: "/admin/gestion-encuestas/preguntas/eliminar",
                    type: "POST",
                    data: {
                        id: id
                    },
                    success: function () {
                        loadQuestions(window.location.href.split("/")[6]);
                        toastr.success(_app.constants.toastr.message.success.task, _app.constants.toastr.title.success);
                        loadItems();
                    },
                    error: function () {
                        toastr.error("La pregunta tiene información relacionada", _app.constants.toastr.title.error);
                    }
                });
            }
        });
    };

    var deleteItem = function (id) {
        swal({
            title: "¿Está seguro?",
            text: "El item será eliminada permanentemente",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, eliminar",
            confirmButtonClass: "btn btn-danger m-btn m-btn--custom",
            cancelButtonText: "Cancelar"
        }).then(function (result) {
            if (result.value) {
                $.ajax({
                    url: "/admin/gestion-encuestas/item/eliminar",
                    type: "POST",
                    data: {
                        id: id
                    },
                    success: function () {
                        loadQuestions(window.location.href.split("/")[6]);
                        toastr.success(_app.constants.toastr.message.success.task, _app.constants.toastr.title.success);
                        loadItems();
                    },
                    error: function () {
                        toastr.error("La pregunta tiene información relacionada", _app.constants.toastr.title.error);
                    }
                });
            }
        });
    };

    var loadQuestion = function (id) {
        $.ajax({
            url: ("/admin/gestion-encuestas/pregunta/get/" + id).proto().parseURL(),
            type: "GET",
            data: {
                id: id
            },
            success: function (result) {
                $("#questionId").val(result.id);
                $("#question_modal").modal("show");
                $('#Type').val(result.type);
                $('#qDescription').val(result.description);
                document.getElementById("question-answers").innerHTML = "";
                if (result.type !== _app.constants.survey.text_question) {
                    $("#question-text").css("display", "none");
                    $("#question-multiple").css("display", "block");
                    $("#question-answers").css("display", "block");
                    for (var i = 0; i < result.answers.length; i++) {
                        var htmldata = '<div class="form-group col-lg-12" style="display:flex;"><input class="answerId" value="' + result.answers[i].id + '" hidden/>' +
                            '<input class="form-control m-input answer" style="margin-right: 10px;" required value="' + result.answers[i].description + '" type="number" /> <button class="btn btn-danger btn-sm m-btn--icon delete-answer" type="button" onclick="this.parentNode.outerHTML = \'\';"><span><i class="la la-trash"></i></span></button></div> ';
                        var e = document.createElement('div');
                        e.innerHTML = htmldata;
                        document.getElementById("question-answers").appendChild(e.firstChild);
                    }
                }
                else {
                    $("#question-text").css("display", "block");
                    $("#question-multiple").css("display", "none");
                    $("#question-answers").css("display", "none");
                }
                
            },
            error: function () {
                toastr.error("Error al cargar la pregunta", _app.constants.toastr.title.error);
            }
        });
    };

    var initFormDatepickers = function () {
        $("#PublicationDate").datepicker()
            .on("changeDate", function (e) {
                $("#FinishDate").datepicker("setStartDate", e.date);
            });
        $("#FinishDate").datepicker()
            .on("changeDate", function (e) {
                $("#PublicationDate").datepicker("setEndDate", e.date);
            });
    };
    return {
        init: function () {
            var id = window.location.href.split("/")[6];
            initFormDatepickers();
            loadData(id);
            loadQuestions(id);
            loadEvents();
            loadItems();
            addItem();
            $("#add-answer").click(function () {
                var htmldata = '<div class="form-group col-lg-12" style="display:flex;"><input class="answerId" value="" hidden/><input class="form-control m-input answer" style="margin-right: 10px;" required type="number"><button class="btn btn-danger btn-sm m-btn--icon delete-answer" type="button" onclick="this.parentNode.outerHTML = \'\';"><span><i class="la la-trash"></i></span></button></div>';
                var e = document.createElement('div');
                e.innerHTML = htmldata;
                document.getElementById("question-answers").appendChild(e.firstChild);
            });
            $("#question_modal").on("hidden.bs.modal",
                function () {
                    $("#questionId").val("");
                    $("#qDescription").val(""); 
                }); 
            $(".back").click(function () {
                window.location = '/admin/gestion-encuestas';
            });
            $(".save").click(function () {
                saveData(id);
            });
            $(".add").click(function () {
                addQuestion(id);
            });
        }
    };
}();


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
        $("#question_modal").modal("hide");
        toastr.success(_app.constants.toastr.message.success.task, _app.constants.toastr.title.success);
    };
    var createFailure = function (e) {
        if (e.responseText !== null && e.responseText !== "") $("#create_msg_txt").html(e.responseText);
        else $("#create_msg_txt").html(_app.constant.ajax.message.error); 
        $("#create_msg").removeClass("m--hide").show();
    };
    var editFailure = function (e) {
        if (e.responseText !== null && e.responseText !== "") $("#edit_msg_txt").html(e.responseText);
        else $("#edit_msg_txt").html("asdasd"); 
        $("#edit_msg").removeClass("m--hide").show();
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
        },
        editFailure: function (e) {
            editFailure(e);
        }
    };
}();

jQuery(document).ready(function () { 
    SurveyTable.init();
});