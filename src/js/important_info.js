$(function() {
  /* 
   * Important Information for New Plan
   *
   * <div id="important-info-el"></div>
   * ・　pricing
   * ・　pricing-detail
   *
   * <div id="important-info-ja-el" class="cmn-info-middle"></div>
   * ・ ci
   */

  // 0: invisible, 1: visible
  var visibleFlag = 1;
  var jaFlag = 1;
  var enFlag = 0;

  // ja
  var importantInfoJaEl = '<div class="cmn-important-info"><a href="/important-info/info-new-plan.html" target="_blamk"><h2>';
  importantInfoJaEl += '<span class="cmn-label color-red">重要</span>';
  importantInfoJaEl += 'Monacaの一部のプランを対象に';
  importantInfoJaEl += '<br class="visible-xs"> ';
  importantInfoJaEl += '<span class="cmn-ipt-udt-linktext">料金プランの変更</span>';
  importantInfoJaEl += ' をさせて頂きます。';
  importantInfoJaEl += '</h2></a></div>';

  // en
  var importantInfoEnEl = '<div class="cmn-important-info"><a href="/important-info/info-new-plan.html" target="_blamk"><h2>';
  importantInfoEnEl += '<span class="cmn-label color-red">重要</span>';
  importantInfoEnEl += 'Monacaの一部のプランを対象に';
  importantInfoEnEl += '<br class="visible-xs"> ';
  importantInfoEnEl += '<span class="cmn-ipt-udt-linktext">料金プランの変更</span>';
  importantInfoEnEl += ' をさせて頂きます。';
  importantInfoEnEl += '</h2></a></div>';

  if (visibleFlag == 1) {
    if (jaFlag == 1) {
      // ja
      $('#important-info-ja-el').append(importantInfoJaEl);
      
      // Change CSS
      $('body.pricing article.main .container').css('padding-top', '50px');
      $('html[lang=ja] body.ci .subfeatures').css('margin-bottom', '24px');
    }

    if(enFlag == 1) {
      // en
      $('#important-info-en-el').append(importantInfoEnEl);

      // Change CSS
      $('body.pricing article.main .container').css('padding-top', '50px');
      $('html[lang=en] body.ci .subfeatures').css('margin-bottom', '24px');

    } else {

      $('body.pricing article.main .container').css('padding-top', '50px');
      $('html body.ci .subfeatures').css('margin-bottom', '90px');

    }

  }
});