(function() {

  window.monacaPages = window.monacaPages || [];

  monacaPages["/appkit/index.html"] = function() {
    var myScrollFunc = function () {
        if (isElementInView($('#hero-button'))) {
          $('#inquiry-button').fadeOut();
        } else {
          $('#inquiry-button').fadeIn();
        }
    };
    window.addEventListener("scroll", myScrollFunc);
    // displayBody();
  };
})();
