(function() {

  window.monacaPages = window.monacaPages || [];

  monacaPages["/pricing.html"] = function(loginData) {
    loginData.autoDisplay = false;

    $('.plan-type-col-2').removeClass('logindata-status-inen');
    $('.plan-type-col-2').addClass('logindata-status-injapan');

    $('body.pricing article.main .container ul.other-plan .box-1:nth-child(1)').css('margin-right', '0');

    $('.btn-trial').click(function(){
      location.href = monacaApi.getBaseUrl() + '/' + window.LANG + '/signup';
    });

    displayNewPlanInfo();
    displayBody();
  };

  monacaPages["/pricing-detail.html"] = function(loginData) {
    loginData.autoDisplay = false;
    var tableEl;
    var contEl;

    tableEl = document.getElementById("compare-cont-table-ja");
    contEl = document.getElementById("compare-cont-ja");

    if (loginData.status.isLogin) {
      $('.btn-trial').html(getProPlanTrialButtonLabel());
    }

    contEl.addEventListener("scroll", setShadow);
    window.addEventListener("resize", setShadow);
    setShadow();

    $('.btn-tooltip').tooltip();

    function setShadow(event) {
      (contEl.scrollLeft > 0) ? contEl.classList.add("leftshadow") : contEl.classList.remove("leftshadow");
      (contEl.clientWidth + contEl.scrollLeft < tableEl.clientWidth) ? contEl.classList.add("rightshadow") : contEl.classList.remove("rightshadow");
    }

    $('.dev-plan').remove();

    $('.btn-trial').click(function(){
      location.href = monacaApi.getBaseUrl() + '/' + window.LANG + '/signup';
    });

    displayNewPlanInfo();
    displayBody();
  };

  monacaPages["/pricing-detail-old.html"] = function(loginData) {
    loginData.autoDisplay = false;
    var tableEl;
    var contEl;

    // If accessed from Japanese network
    if (loginData.status.inJapan) {
      $('.plan-ja').css('display', 'block');
      tableEl = document.getElementById("compare-cont-table-ja");
      contEl = document.getElementById("compare-cont-ja");

      if (loginData.status.isLogin) {
        $('.btn-trial').html(getProPlanTrialButtonLabel());
      }

    } else {
      $('.plan-en').css('display', 'block');
      tableEl = document.getElementById("compare-cont-table");
      contEl = document.getElementById("compare-cont");
    }

    //contEl.addEventListener("scroll", setShadow);
    //window.addEventListener("resize", setShadow);
    //setShadow();

    $('.btn-tooltip').tooltip();

    function setShadow(event) {
      (contEl.scrollLeft > 0) ? contEl.classList.add("leftshadow") : contEl.classList.remove("leftshadow");
      (contEl.clientWidth + contEl.scrollLeft < tableEl.clientWidth) ? contEl.classList.add("rightshadow") : contEl.classList.remove("rightshadow");
    }

    // If accessed from Japanese network
    if (loginData.status.inJapan) {
      $('.dev-plan').remove();
    } else {
      $('.personal-plan').remove();
    }

    displayNewPlanInfo();
    displayBody();
  };



  function displayNewPlanInfo() {
    var importantInfoJaEl = '<div class="cmn-important-info"><a href="/important-info/info-new-plan.html" target="_blamk"><h2>';
    importantInfoJaEl += '<span class="cmn-label color-red">重要</span>';
    importantInfoJaEl += 'Monacaの一部のプランを対象に';
    importantInfoJaEl += '<br class="visible-xs"> ';
    importantInfoJaEl += '<span class="cmn-ipt-udt-linktext">料金プランの変更</span>';
    importantInfoJaEl += ' をさせて頂きます。';
    importantInfoJaEl += '</h2></a></div>';

    var display = 'none';
  
    if (document.getElementById('important-info-ja-el')) {
      document.getElementById('important-info-ja-el').style.display = display;
    }

  }

  function getProPlanTrialButtonLabel() {
    if (window.LANG == 'ja') {
      return '14日間無料トライアル開始';
    }

    return 'Start a 14 day Free Trial';
  }
})();
