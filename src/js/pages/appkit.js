(function() {

  window.monacaPages = window.monacaPages || [];

  monacaPages["/appkit/index.html"] = function() {
    myID = document.getElementById("myID");

    var myScrollFunc = function () {
        var y = window.scrollY;
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
