var Sylabus = function () {
    var addUnitValidate;
    var editUnitValidate;
    var addActivityValidate;
    var editActivityValidate;
    var addResourceValidate;
    var editResourceValidate;
    var addEvaluationValidate;
    var editEvaluationValidate;
    var portlet;
    var evaluationsDatatable = null;
    var datatable;

    portlet = {
        init: function () {
            portlet = new mPortlet("m_portlet_sylabus");
            portlet.on("reload",
                function (p) {
                    mApp.block(p.getSelf(), { type: "loader", message: "Cargando..." });
                    $.ajax({
                        url: `${location.pathname}/unidades/get`.proto().parseURL()
                    }).always(function () {
                        mApp.unblock(p.getSelf());
                    })
                        .done(function (result) {
                            $("#sylabus-container").html(result);

                            $(".m-unit-portlet").each(function (i) {
                                new mPortlet($(this).prop("id"));
                            });

                            $(".m-week-portlet").each(function (i) {
                                new mPortlet($(this).prop("id"));
                            });

                            $(".m-scrollable").each(function (e) {
                                var t = $(this);
                                mUtil.scrollerInit(this,
                                    {
                                        disableForMobile: true,
                                        handleWindowResize: true,
                                        height: function () {
                                            return mUtil.isInResponsiveRange("tablet-and-mobile") &&
                                                t.data("mobile-height")
                                                ? t.data("mobile-height")
                                                : t.data("height");
                                        }
                                    });
                            });
                            events.partial.init();
                        });
                });
            portlet.reload();
        }
    }

    var events = {
        init: function () {
            $(".btn-add-unit").on("click",
                function () {
                    form.load.add.unit();
                });

            $(".select2-teacher-to-faculty").select2({
                placeholder: "Seleccione Profesor"
            });
            $(".select2-teacher-to-faculty").prop("disabled", true);
            $.ajax({
                url: `${location.pathname}/profesores/get`.proto().parseURL()
            }).done(function (result) {
                $(".select2-teacher-to-faculty").each(function (index, e) {
                    if ($(e).attr("id") === "Fields_SelectedTeachers") {
                        $(e).select2({
                            placeholder: "Profesor",
                            allowClear: false,
                            minimumInputLength: 0,
                            width: "90%"
                        });
                    } else {
                        $(e).select2({
                            placeholder: "Seleccione Profesor",
                            minimumInputLength: 0,
                            data: result.items
                        });
                    }
                });
                if (result.items) {
                    $(".select2-teacher-to-faculty").prop("disabled", false);
                }

                var selected = $("#CoordinatorTeacher_Id").val();

                $(".select2-teacher-to-faculty").val(selected).trigger("change");
            });
        },
        partial: {
            init: function () {
                $(".btn-edit-unit").on("click",
                    function () {
                        var id = $(this).data("id");
                        form.load.edit.unit(id);
                    });

                $(".btn-add-activity").on("click",
                    function () {
                        var id = $(this).data("id");
                        form.load.add.activity(id);
                    });

                $(".btn-edit-activity").on("click",
                    function () {
                        var unitId = $(this).data("unitid");
                        var id = $(this).data("id");
                        form.load.edit.activity(unitId, id);
                    });

                $(".btn-add-evaluation").on("click",
                    function () {
                        form.load.add.evaluation();
                    });

                $(".btn-add-resource").on("click",
                    function () {
                        var id = $(this).data("id");
                        form.load.add.resource(id);
                    });

                $(".btn-edit-resource").on("click",
                    function () {
                        var unitId = $(this).data("unitid");
                        var id = $(this).data("id");
                        form.load.edit.resource(unitId, id);
                    });

                $(".btn-delete-unit").on("click",
                    function () {
                        var id = $(this).data("id");
                        swal({
                            title: "¿Está seguro?",
                            text: "La unidad y todo su contenido será eliminado",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonText: "Si, removerlo",
                            cancelButtonText: "Cancelar",
                            showLoaderOnConfirm: true,
                            allowOutsideClick: () => !swal.isLoading(),
                            preConfirm: () => {
                                return new Promise((resolve) => {
                                    $.ajax({
                                        url: `${location.pathname}/unidades/eliminar/post`.proto().parseURL(),
                                        type: "POST",
                                        data: {
                                            uid: id
                                        },
                                        success: function (result) {
                                            portlet.reload();
                                            swal({
                                                type: "success",
                                                title: "Completado",
                                                text: "La unidad ha sido eliminada con éxito",
                                                confirmButtonText: "Excelente"
                                            });
                                        },
                                        error: function (errormessage) {
                                            swal({
                                                type: "error",
                                                title: "Error",
                                                confirmButtonClass: "btn btn-danger m-btn m-btn--custom",
                                                confirmButtonText: "Entendido",
                                                text: "Ocurrió un error al intentar eliminar la unidad"
                                            });
                                        }
                                    });
                                });
                            }
                        });
                    });

                $(".btn-delete-activity").on("click",
                    function () {
                        var unitId = $(this).data("unitid");
                        var id = $(this).data("id");
                        swal({
                            title: "¿Está seguro?",
                            text: "La actividad será eliminada",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonText: "Si, removerlo",
                            cancelButtonText: "Cancelar",
                            showLoaderOnConfirm: true,
                            allowOutsideClick: () => !swal.isLoading(),
                            preConfirm: () => {
                                return new Promise((resolve) => {
                                    $.ajax({
                                        url: `${location.pathname}/unidades/${unitId}/actividades/eliminar/post`.proto().parseURL(),
                                        type: "POST",
                                        data: {
                                            id: id
                                        },
                                        success: function (result) {
                                            portlet.reload();
                                            swal({
                                                type: "success",
                                                title: "Completado",
                                                text: "La actividad ha sido eliminada con éxito",
                                                confirmButtonText: "Excelente"
                                            });
                                        },
                                        error: function (errormessage) {
                                            swal({
                                                type: "error",
                                                title: "Error",
                                                confirmButtonClass: "btn btn-danger m-btn m-btn--custom",
                                                confirmButtonText: "Entendido",
                                                text: "Ocurrió un error al intentar eliminar la actividad"
                                            });
                                        }
                                    });
                                });
                            }
                        });
                    });

                $(".btn-delete-resource").on("click",
                    function () {
                        var unitId = $(this).data("unitid");
                        var id = $(this).data("id");
                        swal({
                            title: "¿Está seguro?",
                            text: "El recurso será eliminado",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonText: "Si, removerlo",
                            cancelButtonText: "Cancelar",
                            showLoaderOnConfirm: true,
                            allowOutsideClick: () => !swal.isLoading(),
                            preConfirm: () => {
                                return new Promise((resolve) => {
                                    $.ajax({
                                        url: `${location.pathname}/unidades/${unitId}/recursos/eliminar/post`.proto().parseURL(),
                                        type: "POST",
                                        data: {
                                            id: id
                                        },
                                        success: function (result) {
                                            portlet.reload();
                                            swal({
                                                type: "success",
                                                title: "Completado",
                                                text: "El recurso ha sido eliminado con éxito",
                                                confirmButtonText: "Excelente"
                                            });
                                        },
                                        error: function (errormessage) {
                                            swal({
                                                type: "error",
                                                title: "Error",
                                                confirmButtonClass: "btn btn-danger m-btn m-btn--custom",
                                                confirmButtonText: "Entendido",
                                                text: "Ocurrió un error al intentar eliminar el recurso"
                                            });
                                        }
                                    });
                                });
                            }
                        });
                    });

                $("#add-evaluation").on("click", function () {
                    var id = $(this).data("id");
                    form.load.add.evaluation(id);
                });
            }
        }
    }

    var form = {
        load: {
            add: {
                unit: function () {
                    $("#add-unit-modal").modal("show");
                    $("#Add_SylabusId").val($("#Id").val());
                    $("#add-unit-modal").one("hidden.bs.modal",
                        function () {
                            form.reset.add.unit();
                        });
                },
                activity: function (unitId) {
                    select.weeks.initForUnit("#AddActivity_Week", unitId);
                    $("#add-activity-modal").modal("show");
                    $("#AddActivity_CourseUnitId").val(unitId);
                    $("#add-activity-modal").one("hidden.bs.modal",
                        function () {
                            form.reset.add.activity();
                        });
                },
                evaluation: function () {
                    //select.weeks.initForUnit("#AddEvaluation_Week", unitId);
                    $("#add-evaluation-modal").modal("show");
                    $("#AddEvaluation_SylabusId").val($("#Id").val());
                    $("#add-evaluation-modal").one("hidden.bs.modal",
                        function () {
                            form.reset.add.evaluation();
                        });
                },
                resource: function (unitId) {
                    select.weeks.initForUnit("#AddResource_Week", unitId);
                    $("#add-resource-modal").modal("show");
                    $("#AddResource_CourseUnitId").val(unitId);
                    $("#add-resource-modal").one("hidden.bs.modal",
                        function () {
                            form.reset.add.resource();
                        });
                }
            },
            edit: {
                unit: function (id) {
                    mApp.blockPage();
                    $.ajax({
                        url: `${location.pathname}/unidades/${id}/get`.proto().parseURL()
                    }).done(function (result) {
                        var formElements = $("#edit-unit-form").get(0);
                        formElements["Edit_Id"].value = result.id;
                        formElements["Edit_Name"].value = result.name;
                        formElements["Edit_SylabusId"].value = result.sylabusId;
                        $("#Edit_WeekNumberStart").val(result.weekNumberStart).trigger("change");
                        $("#Edit_WeekNumberEnd").val(result.weekNumberEnd).trigger("change");
                        mApp.unblockPage();
                        $("#edit-unit-modal").modal("show");
                        $("#edit-unit-modal").one("hidden.bs.modal",
                            function () {
                                form.reset.edit.unit();
                            });
                    });
                },
                activity: function (unitId, id) {
                    mApp.blockPage();
                    $.ajax({
                        url: `${location.pathname}/unidades/${unitId}/actividades/${id}/get`.proto().parseURL()
                    }).done(function (result) {
                        var formElements = $("#edit-activity-form").get(0);
                        formElements["EditActivity_Id"].value = result.id;
                        formElements["EditActivity_Name"].value = result.name;
                        formElements["EditActivity_Week"].value = result.week;
                        formElements["EditActivity_CourseUnitId"].value = result.unitId;
                        formElements["EditActivity_Order"].value = result.order;
                        mApp.unblockPage();
                        $("#edit-activity-modal").modal("show");
                        $("#edit-activity-modal").one("hidden.bs.modal",
                            function () {
                                form.reset.edit.activity();
                            });
                    });
                },
                evaluation: function (id) {
                    mApp.blockPage();
                    //select.weeks.initForUnitEdit("#EditEvaluation_Week", unitId, id, 2);
                    $.ajax({
                        url: `${location.pathname}/evaluaciones/${id}/get`.proto().parseURL()
                    }).done(function (result) {
                        var formElements = $("#edit-evaluation-form").get(0);
                        formElements["Evaluation_EvaluationId"].value = result.id;
                        formElements["Fields_Name"].value = result.name;
                        formElements["Fields_Percentage"].value = result.percentage;
                        formElements["Fields_Retrievable"].checked = result.retrievable;
                        
                        $("#Week").val(result.week).trigger("change");
                        mApp.unblockPage();
                        $("#edit-evaluation-modal").modal("show");
                        $("#edit-evaluation-modal").one("hidden.bs.modal",
                            function () {
                                form.reset.edit.evaluation();
                            });
                    });
                },
                resource: function (unitId, id) {
                    mApp.blockPage();
                    select.weeks.initForUnitEdit("#EditResource_Week", unitId, id, 3);
                    $.ajax({
                        url: `${location.pathname}/unidades/${unitId}/recursos/${id}/get`.proto().parseURL()
                    }).done(function (result) {
                        var formElements = $("#edit-resource-form").get(0);
                        formElements["EditResource_Id"].value = result.id;
                        formElements["EditResource_Name"].value = result.name;
                        formElements["EditResource_Week"].value = result.week;
                        formElements["EditResource_CourseUnitId"].value = result.unitId;

                        mApp.unblockPage();
                        $("#edit-resource-modal").modal("show");
                        $("#edit-resource-modal").one("hidden.bs.modal",
                            function () {
                                form.reset.edit.resource();
                            });
                    });
                }
            }
        },
        reset: {
            add: {
                unit: function () {
                    addUnitValidate.resetForm();
                    $("#add-unit-form select").prop("selectedIndex", 0).trigger("change");
                    $("#add_unit_msg").addClass("m--hide").hide();
                },
                activity: function () {
                    addActivityValidate.resetForm();
                    $("#add_activity_msg").addClass("m--hide").hide();
                },
                evaluation: function () {
                    addEvaluationValidate.resetForm();
                    $("#add-evaluation-form select").prop("selectedIndex", 0).trigger("change");
                    $("#add_evaluation_msg").addClass("m--hide").hide();
                },
                resource: function () {
                    addResourceValidate.resetForm();
                    $("#add_resource_msg").addClass("m--hide").hide();
                }
            },
            edit: {
                unit: function () {
                    editUnitValidate.resetForm();
                    $("#edit-unit-form select").prop("selectedIndex", 0).trigger("change");
                    $("#edit_unit_msg").addClass("m--hide").hide();
                },
                activity: function () {
                    editActivityValidate.resetForm();
                    $("#edit_activity_msg").addClass("m--hide").hide();
                },
                evaluation: function () {
                    editEvaluationValidate.resetForm();
                    $("#edit-evaluation-form select").prop("selectedIndex", 0).trigger("change");
                    $("#edit_evaluation_msg").addClass("m--hide").hide();
                },
                resource: function () {
                    editResourceValidate.resetForm();
                    $("#edit_resource_msg").addClass("m--hide").hide();
                }
            }
        },
        submit: {
            add: {
                unit: function (formElement) {
                    var formData = $(formElement).serialize();
                    $(formElement).find("input").prop("disabled", true);
                    $(formElement).find("select").prop("disabled", true);
                    $(formElement).find(".btn-submit").addLoader();
                    $.ajax({
                        url: `${location.pathname}/unidades/crear/post`.proto().parseURL(),
                        data: formData,
                        type: "POST"
                    }).always(function () {
                        $(formElement).find("input").prop("disabled", false);
                        $(formElement).find("select").prop("disabled", false);
                        $(formElement).find(".btn-submit").removeLoader();
                    })
                        .done(function () {
                            toastr.success(_app.constants.toastr.message.success.task,
                                _app.constants.toastr.title.success);
                            $("#add-unit-modal").modal("hide");
                            portlet.reload();
                            evaluationsDatatable.reload();
                        })
                        .fail(function (e) {
                            toastr.error(_app.constants.toastr.message.error.task, _app.constants.toastr.title.error);
                            if (e.responseText != null) $("#add_unit_msg_txt").html(e.responseText);
                            else $("#add_unit_msg_txt").html(_app.constants.ajax.message.error);
                            $("#add_unit_msg").removeClass("m--hide").show();
                        });
                },
                activity: function (formElement) {
                    var formData = $(formElement).serialize();
                    var unitId = $("#AddActivity_CourseUnitId").val();
                    $(formElement).find("input").prop("disabled", true);
                    $(formElement).find("select").prop("disabled", true);
                    $(formElement).find(".btn-submit").addLoader();
                    $.ajax({
                        url: `${location.pathname}/unidades/${unitId}/actividades/crear/post`.proto().parseURL(),
                        data: formData,
                        type: "POST"
                    }).always(function () {
                        $(formElement).find("input").prop("disabled", false);
                        $(formElement).find("select").prop("disabled", false);
                        $(formElement).find(".btn-submit").removeLoader();
                    })
                        .done(function () {
                            toastr.success(_app.constants.toastr.message.success.task,
                                _app.constants.toastr.title.success);
                            $("#add-activity-modal").modal("hide");
                            portlet.reload();
                        })
                        .fail(function (e) {
                            toastr.error(_app.constants.toastr.message.error.task, _app.constants.toastr.title.error);
                            if (e.responseText != null) $("#add_activity_msg_txt").html(e.responseText);
                            else $("#add_activity_msg_txt").html(_app.constants.ajax.message.error);
                            $("#add_activity_msg").removeClass("m--hide").show();
                        });
                },
                evaluation: function (formElement) {
                    var formData = $(formElement).serialize();
                    //var unitId = $("#AddEvaluation_CourseUnitId").val();
                    $(formElement).find("input").prop("disabled", true);
                    $(formElement).find("select").prop("disabled", true);
                    $(formElement).find(".btn-submit").addLoader();
                    $.ajax({
                        url: `${location.pathname}/evaluaciones/crear/post`.proto().parseURL(),
                        data: formData,
                        type: "POST"
                    }).always(function () {
                        $(formElement).find("input").prop("disabled", false);
                        $(formElement).find("select").prop("disabled", false);
                        $(formElement).find(".btn-submit").removeLoader();
                    })
                        .done(function () {
                            toastr.success(_app.constants.toastr.message.success.task,
                                _app.constants.toastr.title.success);
                            $("#add-evaluation-modal").modal("hide");
                            //portlet.reload();
                            evaluationsDatatable.reload();
                        })
                        .fail(function (e) {
                            toastr.error(_app.constants.toastr.message.error.task, _app.constants.toastr.title.error);
                            if (e.responseText != null) $("#add_evaluation_msg_txt").html(e.responseText);
                            else $("#add_evaluation_msg_txt").html(_app.constants.ajax.message.error);
                            $("#add_evaluation_msg").removeClass("m--hide").show();
                        });
                },
                resource: function (formElement) {
                    var formData = $(formElement).serialize();
                    //var unitId = $("#AddResource_CourseUnitId").val();
                    $(formElement).find("input").prop("disabled", true);
                    $(formElement).find("select").prop("disabled", true);
                    $(formElement).find(".btn-submit").addLoader();
                    $.ajax({
                        url: `${location.pathname}/recursos/crear/post`.proto().parseURL(),
                        data: formData,
                        type: "POST"
                    }).always(function () {
                        $(formElement).find("input").prop("disabled", false);
                        $(formElement).find("select").prop("disabled", false);
                        $(formElement).find(".btn-submit").removeLoader();
                    })
                        .done(function () {
                            toastr.success(_app.constants.toastr.message.success.task,
                                _app.constants.toastr.title.success);
                            $("#add-resource-modal").modal("hide");
                            portlet.reload();
                        })
                        .fail(function (e) {
                            toastr.error(_app.constants.toastr.message.error.task, _app.constants.toastr.title.error);
                            if (e.responseText != null) $("#add_resource_msg_txt").html(e.responseText);
                            else $("#add_resource_msg_txt").html(_app.constants.ajax.message.error);
                            $("#add_resource_msg").removeClass("m--hide").show();
                        });
                }
            },
            edit: {
                unit: function (formElement) {
                    var formData = $(formElement).serialize();
                    $(formElement).find("input").prop("disabled", true);
                    $(formElement).find("select").prop("disabled", true);
                    $(formElement).find(".btn-submit").addLoader();
                    $.ajax({
                        url: `${location.pathname}/unidades/editar/post`.proto().parseURL(),
                        data: formData,
                        type: "POST"
                    }).always(function () {
                        $(formElement).find("input").prop("disabled", false);
                        $(formElement).find("select").prop("disabled", false);
                        $(formElement).find(".btn-submit").removeLoader();
                    }).done(function () {
                        toastr.success(_app.constants.toastr.message.success.task, _app.constants.toastr.title.success);
                        $("#edit-unit-modal").modal("hide");
                        portlet.reload();
                    }).fail(function (e) {
                        toastr.error(_app.constants.toastr.message.error.task, _app.constants.toastr.title.error);
                        if (e.responseText != null) $("#edit_unit_msg_txt").html(e.responseText);
                        else $("#edit_unit_msg_txt").html(_app.constants.ajax.message.error);
                        $("#edit_unit_msg").removeClass("m--hide").show();
                    });
                },
                activity: function (formElement) {
                    var formData = $(formElement).serialize();
                    var unitId = $("#EditActivity_CourseUnitId").val();
                    $(formElement).find("input").prop("disabled", true);
                    $(formElement).find("select").prop("disabled", true);
                    $(formElement).find(".btn-submit").addLoader();
                    $.ajax({
                        url: `${location.pathname}/unidades/${unitId}/actividades/editar/post`.proto().parseURL(),
                        data: formData,
                        type: "POST"
                    }).always(function () {
                        $(formElement).find("input").prop("disabled", false);
                        $(formElement).find("select").prop("disabled", false);
                        $(formElement).find(".btn-submit").removeLoader();
                    })
                        .done(function () {
                            toastr.success(_app.constants.toastr.message.success.task,
                                _app.constants.toastr.title.success);
                            $("#edit-activity-modal").modal("hide");
                            portlet.reload();
                        })
                        .fail(function (e) {
                            toastr.error(_app.constants.toastr.message.error.task, _app.constants.toastr.title.error);
                            if (e.responseText != null) $("#edit_activity_msg_txt").html(e.responseText);
                            else $("#edit_activity_msg_txt").html(_app.constants.ajax.message.error);
                            $("#edit_activity_msg").removeClass("m--hide").show();
                        });
                },
                evaluation: function (formElement) {
                    var formData = $(formElement).serialize();
                    //var unitId = $("#EditEvaluation_CourseUnitId").val();
                    $(formElement).find("input").prop("disabled", true);
                    $(formElement).find("select").prop("disabled", true);
                    $(formElement).find(".btn-submit").addLoader();
                    $.ajax({
                        url: `${location.pathname}/evaluaciones/editar/post`.proto().parseURL(),
                        data: formData,
                        type: "POST"
                    }).always(function () {
                        $(formElement).find("input").prop("disabled", false);
                        $(formElement).find("select").prop("disabled", false);
                        $(formElement).find(".btn-submit").removeLoader();
                    })
                        .done(function () {
                            toastr.success(_app.constants.toastr.message.success.task,
                                _app.constants.toastr.title.success);
                            $("#edit-evaluation-modal").modal("hide");
                            evaluationsDatatable.reload();
                        })
                        .fail(function (e) {
                            toastr.error(_app.constants.toastr.message.error.task, _app.constants.toastr.title.error);
                            if (e.responseText != null) $("#edit_evaluation_msg_txt").html(e.responseText);
                            else $("#edit_evaluation_msg_txt").html(_app.constants.ajax.message.error);
                            $("#edit_evaluation_msg").removeClass("m--hide").show();
                        });
                },
                resource: function (formElement) {
                    var formData = $(formElement).serialize();
                    var unitId = $("#EditResource_CourseUnitId").val();
                    $(formElement).find("input").prop("disabled", true);
                    $(formElement).find("select").prop("disabled", true);
                    $(formElement).find(".btn-submit").addLoader();
                    $.ajax({
                        url: `${location.pathname}/unidades/${unitId}/recursos/editar/post`.proto().parseURL(),
                        data: formData,
                        type: "POST"
                    }).always(function () {
                        $(formElement).find("input").prop("disabled", false);
                        $(formElement).find("select").prop("disabled", false);
                        $(formElement).find(".btn-submit").removeLoader();
                    })
                        .done(function () {
                            toastr.success(_app.constants.toastr.message.success.task,
                                _app.constants.toastr.title.success);
                            $("#edit-resource-modal").modal("hide");
                            portlet.reload();
                        })
                        .fail(function (e) {
                            toastr.error(_app.constants.toastr.message.error.task, _app.constants.toastr.title.error);
                            if (e.responseText != null) $("#edit_resource_msg_txt").html(e.responseText);
                            else $("#edit_resource_msg_txt").html(_app.constants.ajax.message.error);
                            $("#edit_resource_msg").removeClass("m--hide").show();
                        });
                }
            }
        }
    }

    datatable = {
        evaluations: {
            init: function () {
                evaluationsDatatable = $("#m-evaluations-datatable").mDatatable({
                    data: {
                        type: "remote",
                        source: {
                            read: {
                                method: "GET",
                                url: `${location.pathname}/evaluaciones/get`.proto().parseURL()
                            },
                        }
                    },
                    columns: [
                        {
                            field: "name",
                            title: "Evaluación"
                        },
                        {
                            field: "percentage",
                            title: "Peso",
                            textAlign: "center"
                        },
                        {
                            field: "week",
                            title: "Semana",
                            width: 150,
                            textAlign: "center"
                        },
                        {
                            field: "management",
                            title: "Gestión",
                            sortable: false,
                            filterable: false,
                            template: function (row) {
                                return `<button data-id='${row.id}' class='btn btn-info btn-sm m-btn m-btn--icon btn-edit-evaluation'><span><i class='la la-edit'></i><span>Editar</span></span></button> ` +
                                    `<button data-id='${row.id}' class='btn btn-danger btn-sm m-btn m-btn--icon m-btn--icon-only btn-delete-evaluation'><i class='la la-trash'></i></button>`;
                            }
                        }
                    ]
                });
                this.initEvents();
            },
            initEvents: function () {

                evaluationsDatatable.on("click",
                    ".btn-edit-evaluation",
                    function () {
                        var id = $(this).data("id");
                        form.load.edit.evaluation(id);
                    });

                evaluationsDatatable.on("click",
                    ".btn-delete-evaluation",
                    function () {
                        var unitId = $(this).data("unitid");
                        var id = $(this).data("id");
                        swal({
                            title: "¿Está seguro?",
                            text: "La evaluación será eliminada",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonText: "Si, removerlo",
                            cancelButtonText: "Cancelar",
                            showLoaderOnConfirm: true,
                            allowOutsideClick: () => !swal.isLoading(),
                            preConfirm: () => {
                                return new Promise((resolve) => {
                                    $.ajax({
                                        url: `${location.pathname}/unidades/${unitId}/evaluaciones/eliminar/post`
                                            .proto().parseURL(),
                                        type: "POST",
                                        data: {
                                            id: id
                                        },
                                        success: function (result) {
                                            evaluationsDatatable.reload();
                                            swal({
                                                type: "success",
                                                title: "Completado",
                                                text: "La evaluación ha sido eliminada con éxito",
                                                confirmButtonText: "Excelente"
                                            });
                                        },
                                        error: function (errormessage) {
                                            swal({
                                                type: "error",
                                                title: "Error",
                                                confirmButtonClass: "btn btn-danger m-btn m-btn--custom",
                                                confirmButtonText: "Entendido",
                                                text: errormessage.responseText
                                            });
                                        }
                                    });
                                });
                            }
                        });
                    });
            }
        }
    };

    var select = {
        init: function () {
            this.weeks.initAll();
        },
        weeks: {
            initAll: function () {
                $.ajax({
                    url: `/periodos/${$("#TermId").val()}/semanas/get`.proto().parseURL()
                }).done(function (result) {
                    $(".select2-weeks").each(function (index, e) {
                        $(e).select2({
                            data: result.items,
                            placeholder: "Seleccione una semana",
                            dropdownParent: $(e).closest(".modal-body")
                        });
                    });
                });
            },
            initForUnit: function (id, unitId) {
                $(id).empty();
                $(id).select2({
                    placeholder: "Semana"
                });
                $(id).prop("disabled", true);
                $.ajax({
                    url: `/unidades/${unitId}/semanas/get`.proto().parseURL()
                }).done(function (result) {
                    $(id).select2({
                        data: result.items,
                        dropdownParent: $(id).closest(".modal-body")
                    });
                    if (result.items) {
                        $(id).prop("disabled", false);
                    }
                });
            },
            initForUnitEdit: function (id, unitId, activityId, type) {
                $(id).empty();
                $(id).select2({
                    placeholder: "Semana"
                });
                $(id).prop("disabled", true);
                $.ajax({
                    url: `/unidades/${unitId}/semanas/get?aid=${activityId}&type=${type}`.proto().parseURL()
                }).done(function (result) {
                    $(id).select2({
                        data: result.items,
                        dropdownParent: $(id).closest(".modal-body")
                    });
                    if (result.items) {
                        $(id).prop("disabled", false);
                    }
                    if (result.selected) {
                        $(id).val(result.selected).trigger("change");
                    }
                });
            }
        }
    }

    var validate = {
        init: function () {
            addUnitValidate = $("#add-unit-form").validate({
                submitHandler: function (formElement, e) {
                    e.preventDefault();
                    form.submit.add.unit(formElement);
                }
            });

            editUnitValidate = $("#edit-unit-form").validate({
                submitHandler: function (formElement, e) {
                    e.preventDefault();
                    form.submit.edit.unit(formElement);
                }
            });

            addActivityValidate = $("#add-activity-form").validate({
                submitHandler: function (formElement, e) {
                    e.preventDefault();
                    form.submit.add.activity(formElement);
                }
            });

            editActivityValidate = $("#edit-activity-form").validate({
                submitHandler: function (formElement, e) {
                    e.preventDefault();
                    form.submit.edit.activity(formElement);
                }
            });

            addEvaluationValidate = $("#add-evaluation-form").validate({
                submitHandler: function (formElement, e) {
                    e.preventDefault();
                    form.submit.add.evaluation(formElement);
                }
            });

            editEvaluationValidate = $("#edit-evaluation-form").validate({
                submitHandler: function (formElement, e) {
                    e.preventDefault();
                    form.submit.edit.evaluation(formElement);
                }
            });

            addResourceValidate = $("#add-resource-form").validate({
                submitHandler: function (formElement, e) {
                    e.preventDefault();
                    form.submit.add.resource(formElement);
                }
            });

            editResourceValidate = $("#edit-resource-form").validate({
                submitHandler: function (formElement, e) {
                    e.preventDefault();
                    form.submit.edit.resource(formElement);
                }
            });
        }
    }

    return {
        init: function () {
            datatable.evaluations.init();
            portlet.init();
            validate.init();
            events.init();
            select.init();
        },
        EvaluationForm: {
            Create: {
                begin: function () {
                    create.begin();
                },
                complete: function () {
                    create.complete();
                },
                success: function (e) {
                    create.success(e);
                },
                failure: function (e) {
                    create.failure(e);
                }
            },
            Edit: {
                begin: function () {
                    edit.begin();
                },
                complete: function () {
                    edit.complete();
                },
                success: function (e) {
                    edit.success(e);
                },
                failure: function (e) {
                    edit.failure(e);
                }
            }
        }
    };
}();

$(function () {
    Sylabus.init();
});