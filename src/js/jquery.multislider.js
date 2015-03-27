"use strict";

/**
 * MultiSlider by K.Hitomi
 * License: MIT
 *
 * var slider = new MultiSlider(document.getElementById("keyvisual"));
 * slider.start();
 */
var MultiSlider = (function() {
    function MultiSlider(thisEl) {
        if (!thisEl) {
            console.error("MultiSlider needs target DOM");
        }
        this.el = thisEl;

        this.containerEl = this.el.getElementsByClassName("carousel-container");
        if (!this.containerEl.length) {
            console.error("target DOM has no .container");
        }
        this.containerEl = this.containerEl[0];

        this.itemWrapEl = this.containerEl.getElementsByClassName("carousel-items");
        if (!this.itemWrapEl.length) {
            console.error("carousel has no itemWrapper");
        }
        this.itemWrapEl = this.itemWrapEl[0];

        this.itemsEl = this.el.querySelectorAll(".carousel-items .item");
        if (!this.itemsEl || !this.itemsEl.length) {
            console.error("carousel has no items");
        }
        $(this.itemsEl[this.itemsEl.length -1]).addClass("loopend");

        this.indicatorsEl = this.el.querySelectorAll(".indicator");
        if (!this.indicatorsEl || !this.indicatorsEl.length) {
            this.indicatorsEl = null;
        }

        this.maxItemWidth = 1170;
        this.isLeaping = false;
        this.interval = 8000;
        this.timer = null;
        this.resizeTimer = null;
        this.defaultItemsNum = this.itemsEl.length;

        //dummy nodes
        //TODO bigger screen need more than 1 set of dummy node
        for (var preNum = 0; preNum < this.defaultItemsNum; preNum++) {
            var node = this.itemsEl[this.itemsEl.length - 1 - preNum];
            this.itemWrapEl.insertBefore(node.cloneNode(true), this.itemsEl[0]);
            this.itemsEl = this.itemWrapEl.getElementsByClassName("item");
        }

        this.onResize();

        for (var j = 0; j < this.defaultItemsNum; j++) {
            var node = this.itemsEl[preNum + j];
            this.itemWrapEl.appendChild(node.cloneNode(true));
        }
        this.itemsEl = this.itemWrapEl.getElementsByClassName("item");

        this.setIndex(preNum);
        this.leap(preNum);

        var self = this;
        this.itemsEl[0].addEventListener("webkitTransitionEnd", function(el) {
            self.onTransitionEnd.call(self, el);
        }, false);
        this.itemsEl[0].addEventListener("mozTransitionEnd", function(el) {
            self.onTransitionEnd.call(self, el);
        }, false);
        this.itemsEl[0].addEventListener("oTransitionEnd", function(el) {
            self.onTransitionEnd.call(self, el);
        }, false);
        this.itemsEl[0].addEventListener("transitionend", function(el) {
            self.onTransitionEnd.call(self, el);
        }, false);
        window.addEventListener("resize", function(e) {
            clearTimeout(self.resizeTimer);
            self.resizeTimer = setTimeout(function() {
                self.onResize.apply(self, [e]);
            }, 150);
        });
    }

    MultiSlider.prototype.onResize = function(e) {
        $(this.itemsEl).css({width: Math.min(this.maxItemWidth, this.getWindowWidth())});
        this.containerEl.scrollLeft = (this.getItemWidth() * this.idx) + (this.getItemWidth() * 0.5) - (this.getWindowWidth() * 0.5);
    };

    MultiSlider.prototype.onTransitionEnd = function() {
        this.isLeaping = false;

    };

    MultiSlider.prototype.getItemWidth = function() {
        return $(this.itemsEl[0]).width();
    };

    MultiSlider.prototype.getWindowWidth = function() {
        /*
        if ((window.innerWidth < 480) || (window.innerWidth > 940)) {
            return window.innerWidth;
        } else {
            return 940;
        }
        */
        return window.innerWidth;
    };

    /**
     * @param Number num number of leap ... can be minus
     */
    MultiSlider.prototype.leap = function(num) {
        var self = this;

        if (this.isLeaping) {
            //console.log("I'm leaping now, no disturb");
        }

        this.setIndex(num);

        $(this.itemsEl).removeClass("on");
        $(this.itemsEl[this.idx]).addClass("on");

        for (var i = 0; i < this.itemsEl.length; i++) {
            var percentage = 500 * (i - this.idx);
            $(this.itemsEl[i]).css("transform", "translateX(" + percentage + "%)");
        }

        if (this.indicatorsEl) {
            $(this.indicatorsEl).text("○");
            $(this.indicatorsEl[this.idx % this.defaultItemsNum]).text("●");
        }

        $(this.el).attr("data-index", this.idx % this.defaultItemsNum);

        this.isLeaping = true;
    };

    MultiSlider.prototype.leapBy = function(num) {
        this.leap(this.idx + num);
    };

    MultiSlider.prototype.startTransition = function() {
        $(this.el).addClass("transition");
    };

    MultiSlider.prototype.stopTransition = function() {
        $(this.el).removeClass("transition");
    };

    MultiSlider.prototype.leapOverBorder = function() {
        this.stopTransition();

        this.idx -= this.defaultItemsNum;

        for (var i = 0; i < this.defaultItemsNum; i++) {
            this.itemWrapEl.appendChild(this.itemsEl[0]);
        }

        this.itemsEl = this.itemWrapEl.getElementsByClassName("item");

        for (var i = 0; i < this.itemsEl.length; i++) {
            var percentage = 500 * (i - this.idx);
            $(this.itemsEl[i]).css("transform", "translateX(" + percentage + "%)");
        }

        this.startTransition();
        this.leapBy(1);
    };

    MultiSlider.prototype.getIndex = function(idx) {
        return this.idx;
    };

    MultiSlider.prototype.setIndex = function(idx) {
        if (idx >= this.itemsEl.length) {
            this.idx = 0;
        }
        else if (idx < 0) {
            this.idx = this.itemsEl.length -1;
        }
        else {
            this.idx = idx;
        }
    }

    MultiSlider.prototype.leapTo = function(idx) {
        var preNum = this.defaultItemsNum * (((this.itemsEl.length / this.defaultItemsNum) - 1) / 2);
        var leapNum = (idx - this.idx) + preNum;
        if (leapNum === 0) return;

        this.leapBy(parseInt(leapNum));
        this.start();
    }

    MultiSlider.prototype.next = function() {
        var self = this;
        var leapNum = 1;

        if (this.itemsEl[this.idx].className.indexOf("loopend") >= 0) {
            self.leapOverBorder();
        } else {
            self.leapBy(leapNum);
        }
    }

    MultiSlider.prototype.prev = function() {
        var self = this;

        self.leapBy(-1);
    }

    MultiSlider.prototype.start = function() {
        var self = this;

        setTimeout(function() {
            self.startTransition.call(self);
        }, 200);

        if (this.timer) clearTimeout(this.timer);
        this.timer = setInterval(function() {
            self.next();
        }, this.interval);
    }

    return MultiSlider;
})();

