(function() {

  window.monacaPages = window.monacaPages || [];

  monacaPages["/pricing.html"] = function(loginData) {
    if (loginData.status.inJapan) {
      document.getElementById('personal-plan-box').style.display = 'block';
    } else {
      document.getElementById('developer-plan-box').style.display = 'block';
    }
    document.getElementById('pricing-container').style.display = 'block';
  };

  monacaPages["/pricing-detail.html"] = function(loginData) {
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
  };
})();
