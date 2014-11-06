"use strict";

$(function() {
    $("[tile=3]").tile(3);
    $("[tile=4]").tile(4);
    var timer = null;
    window.addEventListener("resize", function() {
        clearTimeout(timer);
        timer = setTimeout(function() {
            $("[tile=3]").tile(3);
            $("[tile=4]").tile(4);
        }, 100);
    })
})

