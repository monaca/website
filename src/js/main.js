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

    setNotificationHeader();

});

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
