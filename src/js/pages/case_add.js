(function() {
  window.monacaPages = window.monacaPages || [];

  monacaPages["/showcase/add.html"] = function (loginData) {
    var params = monacaApi.getUrlVars();
    var initFormData;

    loginData.autoDisplay = false;

    loginData.onReady(function() {
      formUtil.resetError();

      $.ajax({
        type: "GET",
        url: monacaApi.getBaseUrl() + "/" + window.LANG + "/api/case_add",
        xhrFields: {
          withCredentials: true
        },
        dataType: "json",
        success: function(msg) {
          if (msg.result && msg.result.initOK) {
            initFormData = msg.result.initOK;
            displayBody();
            return;
          }
          displayUnknownError();
        },
        error: function(msg) {
          console.log('error!');
          console.log(msg);
          displayUnknownError();
        }
      });

      $("#send").click(function() {
        formUtil.disableAllInput();
        var sendData = createSendData();

        $.ajax( {
          type: "POST",
          url: monacaApi.getBaseUrl() + "/" + window.LANG + "/api/case_add",
          xhrFields: {
            withCredentials: true
          },
          data: sendData,
          dataType: "json",
          success: function(msg) {
            console.log(msg);
            formUtil.enableAllInput();

            if (msg.result == 'submitOK') {
              displayFinishPage();
            } else if (msg.result && msg.result.formError) {
              formUtil.displayFormErrorForGlobal(msg.result.formError, "estimate-form-errors");
            } else {
              displayUnknownError();
            }
          },
          error: function(msg) {
            console.log("error!");
            console.log(msg);
            formUtil.enableAllInput();
            displayUnknownError();
          }
        });

        return false;
      });

    });

    function displayUnknownError() {
      formUtil.resetError();
      $('#unknown-error').css('display', 'block');
      displayBody();
    }

    function createSendData() {
      var sendData = {
        "form[name]":          　$('#name').val(),
        "form[url_appstore]":  　$('#url-appstore').val(),
        "form[url_googleplay]":  $('#url-googleplay').val(),
        "form[cordova_version]": $('#cordova_version').val(),
        "form[plugins]":         $('#plugins').val(),
        "form[framework]":       $('#framework').val(),
        "form[java_script]":     $('#java_script').val(),
        "form[company]":         $('#company').val(),
        "form[developer]":       $('#developer').val(),
        "form[email]":           $('#email').val(),
        "form[_csrf_token]":    initFormData['_csrf_token'],
      };
      return sendData;
    }
  };

  function displayFinishPage() {
    location.href='/showcase/thankyou.html';
  }
})();
