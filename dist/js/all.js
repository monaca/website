/**
 * jQuery.tile.js
 * http://urin.github.io/jquery.tile.js/
 */
(function(e){e.fn.tile=function(t){var n,r,i,s,o,u,a=document.body.style,f=["height"],l=this.length-1;if(!t)t=this.length;u=a.removeProperty?a.removeProperty:a.removeAttribute;return this.each(function(){u.apply(this.style,f)}).each(function(u){s=u%t;if(s==0)n=[];r=n[s]=e(this);o=r.css("box-sizing")=="border-box"?r.outerHeight():r.innerHeight();if(s==0||o>i)i=o;if(u==l||s==t-1){e.each(n,function(){this.css("height",i)})}})}})(jQuery)
"use strict";

$(function() {
    var $tile2 = $("[tile=2]");
    var $tile3 = $("[tile=3]");
    var $tile4 = $("[tile=4]");
    $tile2.tile(2);
    $tile3.tile(3);
    $tile4.tile(4);

    var timer = null;
    window.addEventListener("resize", function() {
        clearTimeout(timer);
        timer = setTimeout(function() {
            $tile2.tile(2);
            $tile3.tile(3);
            $tile4.tile(4);
        }, 150);
    })
})

