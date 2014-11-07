"use strict";

$(function() {
    $("[tile=2]").tile(2);
    $("[tile=3]").tile(3);
    $("[tile=4]").tile(4);
    var timer = null;
    window.addEventListener("resize", function() {
        clearTimeout(timer);
        timer = setTimeout(function() {
            $("[tile=2]").tile(2);
            $("[tile=3]").tile(3);
            $("[tile=4]").tile(4);
        }, 100);
    })
})

