(function () {
  window.monacaPages = window.monacaPages || [];

  monacaPages["/devops/index.html"] = function () {
    var initFormData;
    displayBody();

    $("#contact_us").submit(function (e) {
      e.preventDefault();
      formUtil.disableAllInput();
      var sendData = createSendData();

      $.ajax({
        type: "POST",
        url: monacaApi.getBaseUrl() + "/" + window.LANG + "/support/inquiry_io",
        xhrFields: {
          withCredentials: true
        },
        data: sendData,
        dataType: "json",
        success: function (msg) {
          formUtil.enableAllInput();
          if (msg.result == 'submitOK') {
            displayFinishPage();
          } else if (msg.result && msg.result.formError) {
            formUtil.displayFormError(msg.result.formError);
          } else {
            displayUnknownError();
          }
          moveToContactForm();
        },
        error: function (msg) {
          formUtil.enableAllInput();
          displayUnknownError();
          moveToContactForm();
        }
      });

      return false;
    });


    function displayUnknownError(tag) {
      formUtil.resetError();
      $('#csrf-token-error').css('display', 'block');
      displayBody();
    }

    function createSendData(with_token) {
      var sendData = {
        "inquiry[message]": $('#message').val() + "\n form " + window.location.href,
        "inquiry[name]": $('#name').val(),
        "inquiry[email]": $('#email').val(),
        "inquiry[subject]": "other",
        "inquiry[question_type]": "enterprise",
        "inquiry[product_type]": "other",
        "inquiry[company]": $('#company_name').val()
      };

      if (with_token) sendData["inquiry[_csrf_token]"] = initFormData['_csrf_token'];
      return sendData;
    }
  };

  function displayFinishPage() {
    location.href = '/support/thankyou.html';
  }
})();
