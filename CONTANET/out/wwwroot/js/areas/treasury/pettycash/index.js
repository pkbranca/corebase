var InvoiceTable = function () {
    var datatable;
    var deleteConfirmation = function (id) {
        swal({
            title: "¿Anular el recibo generado?",
            text: "Una vez anulado no podrá cambiar su estado",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, anularlo",
            confirmButtonClass: "btn btn-danger m-btn m-btn--custom",
            cancelButtonText: "Cancelar"
        }).then(function (result) {
            if (result.value) {
                $.ajax({
                    url: "/caja/recibo/anular".proto().parseURL(),
                    type: "POST",
                    data: {
                        id: id
                    }
                }).done(function() {
                    InvoiceTable.reloadTable();

                    toastr.success(_app.constants.toastr.message.success.task, _app.constants.toastr.title.success);
                }).fail(function() {
                    toastr.error(_app.constants.toastr.message.error.task, _app.constants.toastr.title.error);
                });
            
            }
        });
    };
    var showInvoiceDetail = function (id) {
        $("#detail_modal").modal("show");
        InvoiceDetailTable.loadTable(id);
    };

    var options = {
        data: {
            source: {
                read: {
                    url: "/caja/recibos/get".proto().parseURL()
                }
            }
        },
        columns: [
            {
                field: "number",
                title: "Nro. de recibo"
            },
            {
                field: "client",
                title: "Cliente"
            },
            {
                field: "amount",
                title: "Monto Total",
                textAlign: "right",
                template: function (row) {
                    return row.amount.toFixed(2);
                }
            },
            {
                field: "state",
                title: "Estado",
                template: function (row) {
                    if (row.state) return '<span class="m-badge m-badge--danger m-badge--wide">Anulado</span>';
                    else return '<span class="m-badge m-badge--success m-badge--wide">Pagado</span>';
                }
            },
            {
                field: "detail",
                title: "Detalle",
                sortable: false,
                filterable: false,
                template: function (row) {
                    return '<button data-id="' + row.id + '" class="btn btn-secondary btn-sm m-btn m-btn--icon detail"><span><i class="la la-edit"></i><span> Detalle </span></span></button>';
                }
            },
            {
                field: "anulled",
                title: "Anular",
                sortable: false,
                filterable: false,
                template: function (row) {

                    if (row.state) return "---";

                    return '<button data-id="' + row.id + '" class="btn btn-danger btn-sm m-btn m-btn--icon delete"><span><i class="la la-edit"></i><span> Anular </span></span></button>';
                }
            }
        ]
    }
    
    return {
        init: function () {
            datatable = $("#invoice_table").mDatatable(options);

            $("#invoice_table")
                .on("click", ".delete", function () {
                    var id = $(this).data("id");
                    deleteConfirmation(id);
                })
                .on("click", ".detail", function() {
                    var id = $(this).data("id");
                    showInvoiceDetail(id);
                });
        },
        reloadTable: function () {
            datatable.reload();
        }
    }
}();

var InvoiceDetailTable = function() {
    var datatable;
    var options = {
        data: {
            source: {
                read: {
                    method: "GET",
                    url: "/caja/recibo/detalle/".proto().parseURL()
                }
            }
        },
        columns: [
            {
                field: "concept",
                title: "Concepto"
            },
            {
                field: "cost",
                title: "Costo",
                textAlign: "right",
                template: function (row) {
                    return row.cost.toFixed(2);
                }
            }
        ]
    }

    return {
        loadTable: function (id) {
            if (datatable !== undefined) datatable.destroy();

            options.data.source.read.url = ("/caja/recibo/detalle/" + id).proto().parseURL();

            datatable = $("#detail_table").mDatatable(options);
        }
    }

}();

var Events = function() {
    var simulator = function () {
        swal.queue([
            {
                title: "Simular cierre",
                confirmButtonText: "Continuar",
                cancelButtonText: "Cancelar",
                text: "Este cierre de caja solo es una simulación del cierre final a partir de los pagos realizados hasta el momento",
                type: "warning",
                showLoaderOnConfirm: true,
                showCancelButton: true
            }
        ]).then((result) => {
            if (result.value) {
                swal({
                    input: "number",
                    title: "Monto recaudado",
                    text: "Ingrese el monto total recaudado",
                    showLoaderOnConfirm: true,
                    showCancelButton: true,
                    confirmButtonText: "Continuar",
                    cancelButtonText: "Cancelar"
                }).then((result) => {
                    if (result.value) {
                        if ($.isNumeric(result.value)) {
                            window.location.href = ("/caja/simulador/" + result.value).proto().parseURL();
                        } else {
                            swal({
                                type: "error",
                                title: "Valor incorrecto",
                                text: "Debe ingresar un valor númerico válido"
                            });
                        }
                    }
                });
            }
        });
    }
    var closePettyCash = function () {
        swal.queue([
            {
                title: "Cierre de caja",
                confirmButtonText: "Continuar",
                cancelButtonText: "Cancelar",
                text: "Se procederá a cerrar la caja chica, una vez cerrada no podrá registrar nuevos pagos en la misma",
                type: "warning",
                showLoaderOnConfirm: true,
                showCancelButton: true
            }
        ]).then((result) => {
            if (result.value) {
                swal({
                    input: "number",
                    title: "Monto recaudado",
                    text: "Ingrese el monto total recaudado",
                    showLoaderOnConfirm: true,
                    showCancelButton: true,
                    confirmButtonText: "Continuar",
                    cancelButtonText: "Cancelar"
                }).then((result) => {
                    if (result.value) {
                        if ($.isNumeric(result.value)) {
                            _app.modules.form.post("/caja/cierre".proto().parseURL(), { declaredAmount: result.value });
                        } else {
                            swal({
                                type: "error",
                                title: "Valor incorrecto",
                                text: "Debe ingresar un valor númerico válido"
                            });
                        }
                    }
                });
            }
        });
    }

    return {
        init: function() {
            $("#simulator").click(function () {
                simulator();
            });

            $("#close").click(function () {
                closePettyCash();
            });
        }
    }
}();

jQuery(document).ready(function () {
    InvoiceTable.init();
    Events.init();
});

