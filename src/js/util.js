"use strict";

$(function() {
});

var getQueryString = function ( field, url ) {
  var href = url ? url : window.location.href;
  var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
  var string = reg.exec(href);
  return string ? string[1] : null;
};

var isElementInView = function (elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();
    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
};

var isFreeMail = function (email) {
  var _dmains = freeMailDomains.join('|');
  var regexp = '^(?=.*@(' + _dmains + ')).+$'; //stop free mail domain
  return (new RegExp(regexp)).test(email);
}

var freeMailDomains = [
  'gmail.com',
  'yahoo',
  'hotmail',
  'aol.com',
  'msn.com',
  'live.com',
  'mac.com',
  'facebook.com',
  'icloud',
  'outlook',
  'ezweb.ne.jp',
  'ido.ne.jp',
  'biz.ezweb.ne.jp',
  'augps.ezweb.ne.jp',
  'uqmobile.jp',
  'docomo.ne.jp',
  'mopera.net',
  'dwmail.jp',
  'pdx.ne.jp',
  'wcm.ne.jp',
  'willcom.com',
  'y-mobile.ne.jp',
  'emnet.ne.jp',
  'emobile-s.ne.jp',
  'emobile.ne.jp',
  'ymobile1.ne.jp',
  'ymobile.ne.jp',
  'jp-c.ne.jp',
  'jp-d.ne.jp',
  'jp-h.ne.jp',
  'jp-k.ne.jp',
  'jp-n.ne.jp',
  'jp-q.ne.jp',
  'jp-r.ne.jp',
  'jp-s.ne.jp',
  'jp-t.ne.jp',
  'sky.tkc.ne.jp',
  'sky.tkk.ne.jp',
  'sky.tu-ka.ne.jp',
  'disney.ne.jp',
  'i.softbank.jp',
  'softbank.ne.jp',
];