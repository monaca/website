(function() {

  window.monacaPages = window.monacaPages || [];

  monacaPages["/ci.html"] = function(loginData) {
    loginData.autoDisplay = false;

    var tableEl = document.getElementById("compare-cont-table");
    var contEl = document.getElementById("compare-cont");

    contEl.addEventListener("scroll", setShadow);
    window.addEventListener("resize", setShadow);
    setShadow();

    $('.btn-tooltip').tooltip();

    function setShadow(event) {
      (contEl.scrollLeft > 0) ? contEl.classList.add("leftshadow") : contEl.classList.remove("leftshadow");
      (contEl.clientWidth + contEl.scrollLeft < tableEl.clientWidth) ? contEl.classList.add("rightshadow") : contEl.classList.remove("rightshadow");
    }

    if (loginData.status.inJapan) {
      $('.foreign-plan').remove();
    } else {
      $('.japan-plan').remove();
    }

    displayBody();
  };
})();
