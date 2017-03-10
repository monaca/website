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

  // ja
  var importantInfoJaEl = '<div class="cmn-important-info"><a href="/headline/fault.html" target="_blamk"><h2>';
  importantInfoJaEl += '<span class="cmn-label color-red">重要</span>';
  importantInfoJaEl += 'Monacaの一部のプランを対象に';
  importantInfoJaEl += '<br class="visible-xs"> ';
  importantInfoJaEl += '<span class="cmn-ipt-udt-linktext">料金プランの変更</span>';
  importantInfoJaEl += ' をさせて頂きます。';
  importantInfoJaEl += '</h2></a></div>';

  // en
  var importantInfoEnEl = '<div class="cmn-important-info"><a href="/headline/fault.html" target="_blamk"><h2>';
  importantInfoEnEl += '<span class="cmn-label color-red">重要</span>';
  importantInfoEnEl += 'Monacaの一部のプランを対象に';
  importantInfoEnEl += '<br class="visible-xs"> ';
  importantInfoEnEl += '<span class="cmn-ipt-udt-linktext">料金プランの変更</span>';
  importantInfoEnEl += ' をさせて頂きます。';
  importantInfoEnEl += '</h2></a></div>';

  if (visibleFlag == 1) {
    // ja
    $('#important-info-ja-el').append(importantInfoJaEl);

    // en
    $('#important-info-en-el').append(importantInfoEnEl);

    // Change CSS
    $('body.pricing article.main .container').css('padding-top', '50px');
    $('body.ci .subfeatures').css('margin-bottom', '24px');
  }

});