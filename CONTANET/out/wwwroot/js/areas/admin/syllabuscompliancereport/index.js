var reportCompliance = function () {
    var datatable = null;
    
    var loadTermsSelect = $.ajax({
        url: "/periodos/get".proto().parseURL()
    }).done(function (data) {
        $("#select_terms").select2({
                data: data.items
            }).val(data.selected)
            .trigger("change")
            .on("change",
                function() {
                    loadDatatable();
                });
    }); 

    var loadAreaCareerSelect = $.ajax({
        url: "/areascarreras/get".proto().parseURL()
    }).done(function (data) {
        $("#select_area_careers").on("change", function() {
            loadDatatable();
        }).select2({
            data: data.items,
            placeholder: "Área o Carrera"
        });
    });

    var loadDatatable = function () {
        var pid = $("#select_terms").val();
        var acid = $("#select_area_careers").val();

        if (datatable !== null) {
            datatable.destroy();
            datatable = null;
        }
        options.data.source.read.url = `/admin/reporte_cumplimiento/periodo/${pid}/area-carrera/${acid}`.proto().parseURL();
        datatable = $(".m-datatable").mDatatable(options);
    }    

    var initializer = function () {
        $.when(loadTermsSelect, loadAreaCareerSelect).done(function () {
            loadDatatable();
        });
    };
    var options = {
        data: {
            source: {
                read: {
                    method: "GET",
                    url: ""
                }
            }
        },
        columns: [
            {
                field: "code",
                title: "Código",
                width: 90
            },
            {
                field: "name",
                title: "Nombre",
                width: 150
            },
            {
                field: "teachers",
                title: "Estado",
                width: 180,
                template: function (row) {
                    if (row.teachers > 0)
                    {
                        return '<span class="m-badge  m-badge--success m-badge--wide">Cumplido</span>';
                    }
                    else {
                        return '<span class="m-badge  m-badge--danger m-badge--wide">No cumplido</span>';
                    }
                        
                }
            },
            {
                field: "silabus",
                title: "Silabus",
                width: 180,
                template: function (row) {
                    if (row.syllabus.length > 0) {
                        return '<a href="' + row.syllabus +'" class="btn  btn-info btn-sm m-btn m-btn--icon" title="Descargar"><span><i class="la la-cloud-download"></i><span>Descargar</span></span></a>';
                    }
                    else {
                        return "No tiene sílabo";
                    }
                }
            }
        ]
    }

    return {
        load: function () {
            initializer();
        }
    }
}();

$(function () {
    reportCompliance.load();
})