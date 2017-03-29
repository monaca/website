"use strict";

$(function() {
  var $tile2 = $("[tile=2]");
  var $tile3 = $("[tile=3]");
  var $tile4 = $("[tile=4]");
  $tile2.tile(2);
  $tile3.tile(3);
  $tile4.tile(4);

  FastClick.attach(document.querySelector("header.navbar .navbar-toggle"));

  var timer = null;
  window.addEventListener("resize", function() {
    clearTimeout(timer);
    timer = setTimeout(function() {
      $tile2.tile(2);
      $tile3.tile(3);
      $tile4.tile(4);
    }, 150);
  });

  $("header.navbar .navbar-collapse a").on({
    "touchstart": function() {
      $(this).addClass("active");
    },
    "touchend": function() {
      $("header.navbar .navbar-collapse a").removeClass("active");
    }
  });

  //setNotificationHeader();
});

function closePopup(msec, popupId) {
  $('#'+popupId).fadeOut(msec);
  $('#modal-overlay').fadeOut(msec);
}

function displayBody() {
  $('body').css('visibility', 'visible');
}

function showLoading(content_id, loading_id) {
  $('#' + content_id).css('visibility', 'hidden');
  $('#' + loading_id).css('display', 'block');
}

function hideLoading(content_id, loading_id) {
    $('#' + content_id).css('visibility', 'visible');
    $('#' + loading_id).css('display', 'none');
}

function setNotificationHeader() {
  $.ajax({
    type: 'GET',
    url: window.NOTIFICATION_MESSAGE_URL
  }).done(function (data) {
    try {
      var message = JSON.parse(data);
    }catch(e){
      return;
    }

    var lang = window.LANG;
    if (typeof message[lang] === "undefined" || message[lang] === "") return;
    
    $('#' + lang + '-notification-header-content').text(message[lang]);
    $('#notificationHeader').show();
  });
}

function isIdeAvailable() {
  var ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf('chrome') == -1 && ua.indexOf('safari') == -1 && ua.indexOf('gecko') == -1) {
    return false
  }
  return true;
}

function isSafari() {
  var ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf('chrome') === -1 && ua.indexOf('safari') !== -1) {
    return true;
  }
  return false;
}

function sendTracker(event, params) {
  $.ajax(window.MONACA_API_URL +'/' + window.LANG + '/api/tracker?event=' + event, {
    type: 'POST',
    data: params,
    xhrFields: {
      withCredentials: true
    }
  });
}

function downloadLogo(url) {
  sendTracker("downloadLogoPackage", {
    url: url
  });
  window.location.href = url;
}
