(function() {
  window.monacaPages = window.monacaPages || [];

  monacaPages["/register/start.html"] = function(loginData) {
    formUtil.resetError();
    loginData.autoDisplay = false;
    var csrt_token;

    $.ajax({
      type: "GET",
      url: monacaApi.getBaseUrl() + "/" + window.LANG + "/api/register",
      xhrFields: {
        withCredentials: true
      },
      dataType: "json",
      success: function (msg) {
        if (msg.result && msg.result.initOK) {
          csrf_token = msg.result.initOK._csrf_token;
          displayBody();
        } else if (msg.result == 'registeredError') {
          location.href = monacaApi.getBaseUrl() + "/" + window.LANG + "/dashboard";
        } else {
          location.href = '/error500.html';
        }
      },
      error: function (msg) {
        location.href = '/error500.html';
      }
    });

    $('#form-signup-btn').click(function() {
      formUtil.resetError();
      formUtil.disableAllInput();

      var sendData = {
        'register[_csrf_token]':      csrf_token,
        'register[email]':            $('#register_email').val(),
        'register[password]':         $('#register_password').val(),
        'register[password_confirm]': $('#register_password_confirm').val()
      };

      $.ajax({
        type: "POST",
        url: monacaApi.getBaseUrl() + "/" + window.LANG + "/api/register",
        xhrFields: {
          withCredentials: true
        },
        dataType: "json",
        data: sendData,
        success: function (msg) {
          if (msg.result && msg.result.submitOK) {
            location.href = "/register/thankyou.html";
          } else if (msg.result && msg.result.formError) {
            formUtil.enableAllInput();
            formUtil.displayFormErrorForGlobal(msg.result.formError, 'signup-form-error');
          } else {
            formUtil.enableAllInput();
            $('#signup-form-unknown-error').css('display', 'block');
          }
        },
        error: function (msg) {
          formUtil.enableAllInput();
          $('#signup-form-unknown-error').css('display', 'block');
        }
      });
    });
  };



  monacaPages["/register/thankyou.html"] = function(loginData) {
    loginData.autoDisplay = false;
    var csrt_token;

    $.ajax({
      type: "GET",
      url: monacaApi.getBaseUrl() + "/" + window.LANG + "/api/resend",
      xhrFields: {
        withCredentials: true
      },
      dataType: "json",
      success: function (msg) {
        if (msg.result && msg.result.initOK) {
          $('#register-demand-email').html(msg.result.initOK.email);
          csrf_token = msg.result.initOK._csrf_token;
          displayBody();
        } else {
          dlocation.href = '/error500.html';
        }
      },
      error: function (msg) {
        location.href = '/error500.html';
      }
    });

    $('#demand-resend-btn').click(function() {
      var sendData = {
        'form[_csrf_token]': csrf_token
      };

      $.ajax({
        type: "POST",
        url: monacaApi.getBaseUrl() + "/" + window.LANG + "/api/resend",
        xhrFields: {
          withCredentials: true
        },
        dataType: "json",
        data: sendData,
        success: function (msg) {
          if (msg.result == 'submitOK') {
            location.href = '/register/resend.html';
          } else {
            location.href = '/error500.html';
          }
        },
        error: function (msg) {
          location.href = '/error500.html';
        }
      });
    });
  };

  monacaPages["/register/resend.html"] = function(loginData) {
    setTimeout(function() {
      location.href = "/register/thankyou.html";
    }, 5000);
  };
})();
