(function() {

  window.monacaPages = window.monacaPages || [];

  monacaPages["/pricing.html"] = function(loginData) {
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

    displayNewPlanInfo(loginData.status.inJapan);
    displayBody();
  };

  monacaPages["/pricing-detail.html"] = function(loginData) {
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
    displayNewPlanInfo(loginData.status.inJapan);
    displayBody();
  };


  function displayNewPlanInfo(inJapan) {
    var importantInfoJaEl = '<div class="cmn-important-info"><a href="/important-info/info-new-plan.html" target="_blamk"><h2>';
    importantInfoJaEl += '<span class="cmn-label color-red">重要</span>';
    importantInfoJaEl += 'Monacaの一部のプランを対象に';
    importantInfoJaEl += '<br class="visible-xs"> ';
    importantInfoJaEl += '<span class="cmn-ipt-udt-linktext">料金プランの変更</span>';
    importantInfoJaEl += ' をさせて頂きます。';
    importantInfoJaEl += '</h2></a></div>';

    var display = 'none';
  
    if (inJapan) {
      // ja
      $('#important-info-ja-el').append(importantInfoJaEl);
  
      // Change CSS
      $('html[lang=ja] body.pricing article.main .container').css('padding-top', '50px');
      $('html[lang=ja] body.ci .subfeatures').css('margin-bottom', '24px');
      display = 'block';
    }

    if (document.getElementById('important-info-ja-el')) {
      document.getElementById('important-info-ja-el').style.display = display;
    }
  }
})();
