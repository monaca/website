$(function() {
  /* 
   * Important Information for New Plan
   *
   * <div id="important-info-el"></div>
   * ・　pricing
   * ・　pricing-detail
   */

  // 0: invisible, 1: visible
  var visibleFlag = 1;

  // ja
  var importantUpdatesJaEl = '<div class="cmn-important-info"><a href="/headline/fault.html" target="_blamk"><h2>';
  importantUpdatesJaEl += '<span class="cmn-label color-red">重要</span>';
  importantUpdatesJaEl += 'Monacaの一部のプランを対象に';
  importantUpdatesJaEl += '<br class="visible-xs"> ';
  importantUpdatesJaEl += '<span class="cmn-ipt-udt-linktext">料金プランの変更</span>';
  importantUpdatesJaEl += ' をさせて頂きます。';
  importantUpdatesJaEl += '</h2></a></div>';

  // en
  var importantUpdatesEnEl = '<div class="cmn-important-info"><a href="/headline/fault.html" target="_blamk"><h2>';
  importantUpdatesEnEl += '<span class="cmn-label color-red">重要</span>';
  importantUpdatesEnEl += 'Monacaの一部のプランを対象に';
  importantUpdatesEnEl += '<br class="visible-xs"> ';
  importantUpdatesEnEl += '<span class="cmn-ipt-udt-linktext">料金プランの変更</span>';
  importantUpdatesEnEl += ' をさせて頂きます。';
  importantUpdatesEnEl += '</h2></a></div>';

  if (visibleFlag == 1) {
    // ja
    $('#important-info-ja-el').append(importantUpdatesJaEl);

    // en
    $('#important-info-en-el').append(importantUpdatesEnEl);

    // Change CSS
    $('body.pricing article.main .container').css('padding-top', '50px');
    $('body.ci .subfeatures').css('margin-bottom', '24px');
  }

});