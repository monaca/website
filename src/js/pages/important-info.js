(function() {

  window.monacaPages = window.monacaPages || [];

  monacaPages["/important-info/info-new-plan.html"] = function(loginData) {
    loginData.autoDisplay = false;

    if (!loginData.status.inJapan) {
      location.href="/";
      return;
    }
    displayBody();
  };
})();
