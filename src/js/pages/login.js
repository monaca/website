(function() {
  window.monacaPages = window.monacaPages || [];

  monacaPages["/login/index.html"] = function(loginData) {
    $('#show_loginpopup_li').remove();
    formUtil.resetError();
    loginData.autoDisplay = false;
    var csrf_token;

    $.ajax({
      type: "GET",
      url: monacaApi.getBaseUrl() + "/" + window.LANG + "/api/account/login",
      xhrFields: {
        withCredentials: true
      },
      dataType: "json",
      success: function (msg) {
        if (msg.result && msg.result.initOK) {
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

    $('#form-login-btn').click(function() {
      formUtil.resetError();
      formUtil.disableAllInput();

      var sendData = {
        'form[_csrf_token]': csrf_token,
        'form[email]':       $('#form_email').val(),
        'form[password]':    $('#form_password').val()
      };

      if ($('#form_remember_email').prop('checked')) {
        sendData['form[remember_id]'] = 1;
      }

      $.ajax({
        type: "POST",
        url: monacaApi.getBaseUrl() + "/" + window.LANG + "/api/account/login",
        xhrFields: {
          withCredentials: true
        },
        dataType: "json",
        data: sendData,
        success: function (msg) {
          if (msg.result == 'loginOK') {
            location.href = MONACA_API_URL + '/' + LANG + '/dashboard';
          } else if (msg.result && msg.result.formError) {
            formUtil.enableAllInput();
            formUtil.displayFormErrorForGlobal(msg.result.formError, 'login-form-error');
          } else {
            formUtil.enableAllInput();
            $('#login-form-unknown-error').css('display', 'block');
          }
        },
        error: function (msg) {
          formUtil.enableAllInput();
          $('#login-form-unknown-error').css('display', 'block');
        }
      });
    });
  };

  monacaPages["/login/lost_password.html"] = function(loginData) {
    formUtil.resetError();
    loginData.autoDisplay = false;
    var csrf_token;

    $.ajax({
      type: "GET",
      url: monacaApi.getBaseUrl() + "/" + window.LANG + "/api/lost_password",
      xhrFields: {
        withCredentials: true
      },
      dataType: "json",
      success: function (msg) {
        if (msg.result && msg.result.initOK) {
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

    $('#lost-password-btn').click(function() {
      formUtil.resetError();
      formUtil.disableAllInput();

      var sendData = {
        'form[_csrf_token]': csrf_token,
        'form[email]':       $('#lost-password-email').val()
      };

      $.ajax({
        type: "POST",
        url: monacaApi.getBaseUrl() + "/" + window.LANG + "/api/lost_password",
        xhrFields: {
          withCredentials: true
        },
        dataType: "json",
        data: sendData,
        success: function (msg) {
          if (msg.result == 'submitOK') {
            location.href = '/login/lost_password_sent.html';
          } else if (msg.result && msg.result.formError) {
            formUtil.enableAllInput();
            formUtil.displayFormErrorForGlobal(msg.result.formError, 'lost-password-error');
          } else {
            formUtil.enableAllInput();
            $('#lost-password-unknown-error').css('display', 'block');
          }
        },
        error: function (msg) {
          formUtil.enableAllInput();
          $('#lost-password-unknown-error').css('display', 'block');
        }
      });
    });
  };


})();
