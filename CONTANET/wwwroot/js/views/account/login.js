var login = (function () {
    var mLogin = $("#m_login"),
        alerter = function (element, type, message) {
            var mAlert = $('<div class="m-alert m-alert--outline alert alert-' + type + ' alert-dismissible" role="alert">\t\t\t<button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>\t\t\t<span></span>\t\t</div>');
            element.find(".alert").remove(), mAlert.prependTo(element), mUtil.animateClass(mAlert[0], "fadeIn animated"), mAlert.find("span").html(message)
        },
        cleaner = function () {
            mLogin.removeClass("m-login--forget-password"), mLogin.removeClass("m-login--signup"), mLogin.addClass("m-login--signin")
        },
        loader = function () {
            $("#m_login_forget_password").click(function (event) {
                event.preventDefault(), mLogin.removeClass("m-login--signin"), mLogin.removeClass("m-login--signup"), mLogin.addClass("m-login--forget-password")
            }), $("#m_login_forget_password_cancel").click(function (event) {
                event.preventDefault(), cleaner()
            }), $("#m_login_signup").click(function (event) {
                event.preventDefault(), mLogin.removeClass("m-login--forget-password"), mLogin.removeClass("m-login--signin"), mLogin.addClass("m-login--signup")
            }), $("#m_login_signup_cancel").click(function (event) {
                event.preventDefault(), cleaner()
            })
        };

    return {
        init: function () {
            $("#m_login_forget_password").unbind("click");
            $("#m_login_forget_password_cancel").unbind("click");
            $("#m_login_signup").unbind("click");
            $("#m_login_signup_cancel").unbind("click");
            loader();
            $("#m_login_signin_submit").unbind("click");
            $("#m_login_signin_submit").click(function (event) {
                event.preventDefault();
                var mLoginSigninSubmit = $(this),
                    closestForm = $(this).closest("form");
                closestForm.validate({
                    rules: {
                        username: {
                            required: !0
                        },
                        password: {
                            required: !0
                        }
                    }
                }), closestForm.valid() && (mLoginSigninSubmit.addClass("m-loader m-loader--right m-loader--light").attr("disabled", !0), closestForm.submit());
            });
            $("#m_login_signup_submit").unbind("click");
            $("#m_login_forget_password_submit").unbind("click");
            $("#m_login_forget_password_submit").click(function (event) {
                event.preventDefault();
                var mLoginForgetPasswordSubmit = $(this),
                    closestForm = $(this).closest("form");
                closestForm.validate({
                    rules: {
                        email: {
                            required: !0,
                            email: !0
                        }
                    }
                }), closestForm.valid() && (mLoginForgetPasswordSubmit.addClass("m-loader m-loader--right m-loader--light").attr("disabled", !0), closestForm.ajaxSubmit({
                    url: $("#ForgotPasswordForm").attr('action'),
                    success: function (event, jqXHR, ajaxOptions, data) {
                        toastr.success(_app.constants.toastr.message.mail.send, _app.constants.toastr.title.success);
                        setTimeout(function () {
                            mLoginForgetPasswordSubmit.removeClass("m-loader m-loader--right m-loader--light").attr("disabled", !1), closestForm.clearForm(), closestForm.validate().resetForm(), cleaner();
                        }, 1e1)
                    }
                }))
            })
        }
    };
})();

$(function () {
    login.init()
});
