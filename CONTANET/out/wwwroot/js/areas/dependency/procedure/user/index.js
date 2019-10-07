_app.ajax.elements = {
};
_app.datatable.elements = {
    'user-procedure-datatable': {
        selector: '#user-procedure-datatable',
        settings: {
            data: {
                source: {
                    read: {
                        method: 'GET',
                        url: '/dependencia/tramites/usuarios/get'
                    }
                }
            },
            columns: [
                {
                    field: 'procedure.name',
                    title: 'Nombre del Trámite'
                },
                {
                    field: 'user.fullName',
                    title: 'Nombre del Solicitante'
                },
                {
                    field: 'status',
                    title: 'Estado',
                    template: function (row) {
                        var template = '';
                        template += userProcedureStatusValues[row.status];

                        return template;
                    }
                },
                {
                    field: 'createdAt',
                    title: 'Fecha de Solicitud'
                },
                {
                    field: 'options',
                    title: 'Opciones',
                    sortable: false,
                    filterable: false,
                    width: 300,
                    template: function (row) {
                        var template = '';
                        template += '<span class="dropdown"><a href="#" class="btn m-btn m-btn--hover-brand m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="dropdown" aria-expanded="true"><i class="la la-ellipsis-h"></i></a><div class="dropdown-menu dropdown-menu-right">';

                        if (row.status === userProcedureStatusIndices["OBSERVED"] || row.status === userProcedureStatusIndices["IN_PROCESS"]) {
                            template += '<a class="dropdown-item" data-action="observation" data-url="';
                            template += _app.url.parse('/admin/tramites/observacion/crear/post');
                            template += '" data-value="';
                            //template += row.app().encode();
                            template += '" onclick="userProcedureObservation.swal.create.show(this, event)"><i class="la la-edit"></i> Observaciones </a>';

                            if (row.status === userProcedureStatusIndices["IN_PROCESS"]) {
                                template += '<a class="dropdown-item" data-action="derive" data-url="';
                                template += _app.url.parse('/admin/tramites/usuarios/derivar/post');
                                template += '" data-value="';
                                //template += row.app().encode();
                                template += '" onclick="userProcedure.swal.derive.show(this, event)"><i class="la la-edit"></i> Derivar </a>';
                            }

                            if (row.nextProcedureDependency === _app.constant.guid.empty) {
                                template += '<a class="dropdown-item" data-action="accept" data-url="';
                                template += _app.url.parse('/admin/tramites/usuarios/editar/post');
                                template += '" data-value="';
                                //template += row.app().encode();
                                template += '" onclick="userProcedure.swal.accept.show(this, event)"><i class="la la-edit"></i> Aceptar </a>';
                            }
                        }

                        if (row.status !== userProcedureStatusIndices["ACCEPTED"] && row.status !== userProcedureStatusIndices["NOT_APPLICABLE"]) {
                            template += '<a class="dropdown-item" data-action="deny" data-url="';
                            template += _app.url.parse('/admin/tramites/usuarios/editar/post');
                            template += '" data-value="';
                            //template += row.app().encode();
                            template += '" onclick="userProcedure.swal.deny.show(this, event)"><i class="la la-edit"></i> Denegar </a>';
                        }

                        template += '</div></span >';
                        template += '<button class="m-portlet__nav-link btn m-btn m-btn--hover-brand m-btn--icon m-btn--icon" data-action="detail" data-url="" data-value="';
                        //template += row.app().encode();
                        template += '" onclick="userProcedure.swal.detail.show(this, event)"><i class="la la-edit"></i><span> Detalle </span></button> ';

                        return template;
                    }
                }
            ]
        }
    }
};
_app.select.elements = {
    'user-procedure-derive-select2': {
        selector: '#user-procedure-derive-select2'
    }
};
_app.select2.elements = {
    'user-procedure-derive-select2': {
        selector: '#user-procedure-derive-select2',
        settings: {
            placeholder: 'Nombre de la Dependencia del Trámite'
        }
    }
};
_app.validate.elements = {
    'user-procedure-modal-form': {
        selector: '#user-procedure-modal-form',
        settings: {
            submitHandler: function (form, event) {
                var action = form.getAttribute('data-action');

                procedure.form[action].async.send(form, event);
            }
        }
    }
};

var procedure = {
    form: {
        create: {
            async: {
                send: function (element, event) {
                    var formElements = element.elements;
                    var url = element.getAttribute('data-url');

                    this.settings.data = {
                        Name: formElements['Name'].value,
                        ProcedureCategoryId: formElements['ProcedureCategoryId'].value,
                        Duration: formElements['Duration'].value,
                        Score: formElements['Score'].value
                    };
                    this.settings.url = url;
                    this.settings.beforeSend = function (jqXHR, settings) {
                        _app.form.loader.show(formElements['Send']);
                    };
                    this.settings.complete = function (jqXHR, textStatus) {
                        _app.form.loader.hide(formElements['Send']);
                    };

                    _app.form.async.send(element, event, this);
                },
                settings: {
                    error: function (jqXHR, textStatus, errorThrown) {
                        toastr.error(_app.constant.toastr.message.error.create, _app.constant.toastr.title.error);
                    },
                    success: function (data, textStatus, jqXHR) {
                        _app.datatable.reload.all();
                        $('#procedure-modal').modal('hide');
                        toastr.success(_app.constant.toastr.message.success.create, _app.constant.toastr.title.success);
                    }
                }
            }
        },
        update: {
            async: {
                send: function (element, event) {
                    var formElements = element.elements;
                    var url = element.getAttribute('data-url');

                    this.settings.data = {
                        Id: formElements['Id'].value,
                        Name: formElements['Name'].value,
                        ProcedureCategoryId: formElements['ProcedureCategoryId'].value,
                        Duration: formElements['Duration'].value,
                        Score: formElements['Score'].value
                    };
                    this.settings.url = url;
                    this.settings.beforeSend = function (jqXHR, settings) {
                        _app.form.loader.show(formElements['Send']);
                    };
                    this.settings.complete = function (jqXHR, textStatus) {
                        _app.form.loader.hide(formElements['Send']);
                    };

                    _app.form.async.send(element, event, this);
                },
                settings: {
                    error: function (jqXHR, textStatus, errorThrown) {
                        toastr.error(_app.constant.toastr.message.error.update, _app.constant.toastr.title.error);
                    },
                    success: function (data, textStatus, jqXHR) {
                        _app.datatable.reload.all();
                        $('#procedure-modal').modal('hide');
                        toastr.success(_app.constant.toastr.message.success.update, _app.constant.toastr.title.success);
                    }
                }
            }
        }
    },
    modal: {
        create: {
            selector: '#procedure-modal',
            show: function (element, event) {
                var action = element.getAttribute('data-action');
                var url = element.getAttribute('data-url');

                var data = {};

                _app.form.reset('procedure-modal-form');
                _app.form.fill('procedure-modal-form', data, action, url);
                _app.modal.show(element, event, this);
            }
        },
        update: {
            selector: '#procedure-modal',
            show: function (element, event) {
                var action = element.getAttribute('data-action');
                var url = element.getAttribute('data-url');
                var value = element.getAttribute('data-value');
                value = value.app().decode();

                var data = {
                    Id: value.id,
                    Name: value.name
                };

                _app.form.fill('procedure-modal-form', data, action, url);

                var ajaxKey = 0;
                var selectKey = 'procedure-category-select2';

                if (_app.ajax.elements[ajaxKey].status !== _app.constant.ajax.status.success) {
                    _app.select.elements[selectKey].settings = {
                        data: [
                            {
                                id: value.procedureCategoryId,
                                name: value.procedureCategory.name
                            }
                        ]
                    };
                }

                _app.select.elements['procedure-category-select2'].settings.selected = value.procedureCategoryId;
                _app.select.elements['procedure-score-select2'].settings.selected = value.score;

                _app.select.load.multiple(['procedure-category-select2', 'procedure-score-select2']);
                _app.select2.load.multiple(['procedure-category-select2', 'procedure-score-select2']);
                _app.modal.show(element, event, this);
            }
        }
    },
    swal: {
        delete: {
            promise: {},
            settings: {
                title: '¿Desea eliminar el registro?',
                type: 'warning',
                showCancelButton: true,
                showLoaderOnConfirm: true
            },
            show: function (element, event) {
                var url = element.getAttribute('data-url');
                var value = element.getAttribute('data-value');
                value = value.app().decode();

                this.settings.text = value.name;
                this.settings.preConfirm = function () {
                    return new Promise(function (resolve, reject) {
                        var tmpAjaxSettings = {
                            data: {
                                Id: value.id
                            },
                            url: url,
                            complete: function (jqXHR, textStatus) {
                                resolve();
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                toastr.error(_app.constant.toastr.message.error.delete, _app.constant.toastr.title.error);
                            },
                            success: function (data, textStatus, jqXHR) {
                                _app.datatable.reload.all();
                                toastr.success(_app.constant.toastr.message.success.delete, _app.constant.toastr.title.success);
                            }
                        };
                        var ajaxSettings = _app.ajax.settings.app().merge(tmpAjaxSettings);

                        $.ajax(ajaxSettings);
                    });
                };

                _app.swal.show(element, event, this);
            }
        }
    }
};

window.onload = function () {
    _app.datatable.load.all();
    _app.validate.load.all();
    _app.select.load.all();
    _app.select2.load.all();

    $('.nav-link.m-tabs__link').on('shown.bs.tab', function (event) {
        _app.datatable.get.all(function (key, handler) {
            handler.adjustCellsWidth();
        });
    });
};
