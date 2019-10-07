$("#sDni").on("click",
                function () {

                    var doc = $("#Dni").val();

                    $.ajax({
                        type: "GET",
                        url: `http://sistemas.unam.edu.pe:99/api/reniec/dni/get/` + doc
                    })
                        .always(function () {
                        })
                        .done(function (result) {

                            console.log(result);
                            var formElements = $("#create-form").get(0).elements;

                            formElements["Name"].value = result.datosPersona.prenombres;
                            formElements["PaternalSurname"].value = result.datosPersona.apPrimer;
                            formElements["MaternalSurname"].value = result.datosPersona.apSegundo;

                            document.getElementById('sImg').setAttribute('src', 'data:image/png;base64,' + result.datosPersona.foto);
                        })
                        .fail(function (e) {
                            toastr.error(_app.constants.toastr.message.error.task, _app.constants.toastr.title.error);
                        });
                });

$("#Dni").change(function () {
    if ($(this).val().length == 8) {
        $("#sDni").attr("disabled", false)
    } else {
        $("#sDni").attr("disabled", true)
    }
});

$("#Dni").keypress(function () {
    if ($(this).val().length == 7) {
        $("#sDni").attr("disabled", false)
    }
});
