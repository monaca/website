(function () {
  function moveToContactForm() {
    $([document.documentElement, document.body]).animate({
      scrollTop: $("#contact_us").offset().top - window.HEADER_HEIGHT
    }, 2000);
  }

  function hideInquiryButton() {
    $("#scroll_to_form").fadeOut(500);
  }

  window.monacaPages = window.monacaPages || [];

  monacaPages["/dev-support/index.html"] = function () {
    $("#scroll_to_form").click(function () {
      moveToContactForm();
      hideInquiryButton();
    });

    $(".seikyoren").click(function () {
      window.location.href = "/showcase/seikyoren.html";
    });

    $(".naganobank").click(function () {
      window.location.href = "/showcase/naganobank.html";
    });

    $(".smbc").click(function () {
      window.location.href = "/showcase/smbc.html";
    });

    $(".monex").click(function () {
      window.location.href = "/showcase/monex.html";
    });

    $(".showcase_mobile_button").click(function () {
      window.location.href = "/showcase/";
    });

    $(".logos_button_mobile").click(function () {
      window.location.href = "/showcase/";
    });

    $(".logos_link").click(function () {
      window.location.href = "/showcase/";
    });

    $(".showcase_link").click(function () {
      window.location.href = "/showcase/";
    });

    var initFormData;
    displayBody();
    showLoading("support-inquiry", "loading");

    $("#contact_us input, #contact_us textarea").on('focus', function() {
      hideInquiryButton();
    });

    $("#contact_us").submit(function (e) {
      e.preventDefault();
      formUtil.disableAllInput();
      var sendData = createSendData();
      
      if (isFreeMail($('#email').val())) {
        $('#contact_us input[name="email"] ~ p.form-error')
        .html("独自ドメインメールをご入力ください。").show();
        formUtil.enableAllInput();
        return;
      }
      
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
