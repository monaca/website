(function() {

  window.monacaPages = window.monacaPages || [];

  monacaPages["/pricing.html"] = function(loginData) {
    loginData.autoDisplay = false;

    if (loginData.status.inJapan) {
      $('.plan-ja').css('display', 'block');
      
      $('.plan-type-col-2').removeClass('logindata-status-inen');
      $('.plan-type-col-2').addClass('logindata-status-injapan');

      $('body.pricing article.main .container ul.other-plan .box-1:nth-child(1)').css('margin-right', '0');

      if (loginData.status.isLogin) {
        $('.btn-trial').html(getProPlanTrialButtonLabel());
      }

    } else {
      $('.plan-en').css('display', 'block');

      $('.plan-type-col-2').removeClass('logindata-status-injapan');
      $('.plan-type-col-2').addClass('logindata-status-inen');
    }

    document.getElementById('pricing-container').style.display = 'block';

    $('.btn-trial').click(function(){
      if (loginData.status.isLogin) {
        location.href = monacaApi.getBaseUrl() + '/' + window.LANG + '/pricing?type=1';
      } else {
        location.href = monacaApi.getBaseUrl() + '/' + window.LANG + '/signup';
      }
    });

    $('.btn-enterprises-trial').click(function(){
      location.href = 'https://enterprise.monaca.mobi/' + window.LANG + '/register';
    });

    displayNewPlanInfo(loginData.status.inJapan);
    displayBody();
  };

  monacaPages["/pricing-detail.html"] = function(loginData) {
    loginData.autoDisplay = false;
    var tableEl;
    var contEl;

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

    $('.btn-trial').click(function(){
      if (loginData.status.isLogin) {
        location.href = monacaApi.getBaseUrl() + '/' + window.LANG + '/pricing?type=1';
      } else {
        location.href = monacaApi.getBaseUrl() + '/' + window.LANG + '/signup';
      }
    });

    $('.btn-enterprises-trial').click(function(){
      location.href = 'https://enterprise.monaca.mobi/' + window.LANG + '/register';
    });

    displayNewPlanInfo(loginData.status.inJapan);
    displayBody();
  };

  monacaPages["/pricing-detail-old.html"] = function(loginData) {
    loginData.autoDisplay = false;
    var tableEl;
    var contEl;

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
  
    /*

    if (inJapan) {
      // ja
      $('#important-info-ja-el').append(importantInfoJaEl);
  
      // Change CSS
      $('html[lang=ja] body.pricing article.main .container').css('padding-top', '50px');
      $('html[lang=ja] body.ci .subfeatures').css('margin-bottom', '24px');
      display = 'block';
    }

    */

    if (document.getElementById('important-info-ja-el')) {
      document.getElementById('important-info-ja-el').style.display = display;
    }

  }

  function getProPlanTrialButtonLabel() {
    if (window.LANG == 'ja') {
      return 'Proプラン14日間無料トライアル開始';
    }

    return 'Start a 14 day Pro Plan Free Trial';
  }
})();
