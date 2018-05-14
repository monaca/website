(function() {
  window.monacaPages = window.monacaPages || [];

  monacaPages['/phonegap/phonegap_enterprise_notification.html'] = function(loginData) {
    formUtil.resetError();

    loginData.autoDisplay = false;
    var btnNotifyMe = '#notify_me';
    var inputFormEmail = '#form_email';
    var inputFormError= '#phonegap-enterprise-form-error';

    loginData.onReady(function() {
      $(btnNotifyMe).click(function() {
        $('html,body').css('cursor', 'progress'); //waiting
        formUtil.resetError();
        formUtil.disableAllInput();

        var email = $(inputFormEmail).val();
        email = $.trim(email);
        if (validEmail(email)) {
          var sendData = {
            'email': email,
          };
          $.ajax({
            type: 'POST',
            url: monacaApi.getBaseUrl() + '/' + window.LANG + '/api/subscribephonegapenterprise',
            xhrFields: {
              withCredentials: false
            },
            dataType: 'json',
            data: sendData,
            success: function (msg) {
              $('html,body').css('cursor', 'default');
              if (msg.status === 'success') {
                displayFinishPage();
              } else {
                displayError('Something wrong. Please try again.');
              }
            },
            error: function (msg) {
              $('html,body').css('cursor', 'default');
              location.href = '/error500.html';
            }
          });
        } else {
          $('html,body').css('cursor', 'default');
          displayError('Invalid Email Address');
        }

        formUtil.enableAllInput();
      });
    });

    $(inputFormEmail).keypress(function(e) {
      if(e.which == 13) {
        e.preventDefault();
        $(btnNotifyMe).click();
      }
    });

    function displayError (errorMessage) {
      formUtil.enableAllInput();
      $(inputFormError).text(errorMessage);
      $(inputFormError).css('display', 'block');
    }

    function validEmail (email) {
      if (!email) return false;
      var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (email.match(mailFormat)) return true;
      return false;
    }

    function displayFinishPage() {
      $(inputFormEmail).val('');
      location.href='/phonegap/thankyou.html';
    }

  };

})();