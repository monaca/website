(function() {
  window.monacaPages = window.monacaPages || [];

  monacaPages["/phonegap/phonegap_enterprise_notification.html"] = function() {
    formUtil.resetError();

    var btnNotifyMe = '#notify_me';
    var inputFormEmail = '#form_email';

    $(btnNotifyMe).click(function() {
      formUtil.resetError();
      formUtil.disableAllInput();

      var email = $(inputFormEmail).val();
      email = $.trim(email);
      if (validEmail(email)) {
        //do something
        alert(email);
        $(inputFormEmail).val('');
      } else {
        alert('invalid email');
      }

      formUtil.enableAllInput();
    });

    $(inputFormEmail).keypress(function(e) {
      if(e.which == 13) {
        e.preventDefault();
        $(btnNotifyMe).click();
      }
    });

    function validEmail (email) {
      if (!email) return false;
      var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (email.match(mailFormat)) return true;
      return false;
    }

  };

})();