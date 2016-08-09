(function() {

  window.monacaPages = window.monacaPages || [];

  /*monacaPages["/ci.html"] = function(loginData) {
    loginData.autoDisplay = false;

    if (loginData.status.inJapan) {
      document.getElementById('personal-plan-box').style.display = 'block';
    } else {
      document.getElementById('developer-plan-box').style.display = 'block';
    }
    document.getElementById('pricing-container').style.display = 'block';

    $('#btn-trial').click(function(){
      if (loginData.status.isLogin) {
        location.href = monacaApi.getBaseUrl() + '/' + window.LANG + '/pricing?type=1';
      } else {
        location.href = '/register/start.html';
      }
    });

    displayBody();
  };*/

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
      $('.dev-plan').remove();
    } else {
      $('.personal-plan').remove();
    }

    displayBody();
  };
})();
