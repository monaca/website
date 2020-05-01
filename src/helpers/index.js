module.exports.register = function (Handlebars) {
  'use strict';

  Handlebars.registerHelper('_is', function(a, b, options) {
    return a == b;
  });

  Handlebars.registerHelper('_includes', function(a, b, options) {
    if (a != null && b != null) {
      return a.includes(b);
    } else {
      return false;
    }
  });

  Handlebars.registerHelper('_and', function() {
    var len = arguments.length - 1;
    var options = arguments[len];
  
    for (var i = 0; i < len; i++) {
      if (!arguments[i]) {
        return options.inverse(this); // = false
      }
    }
    return options.fn(this); // = true
  });

  Handlebars.registerHelper('_or', function() {
    var len = arguments.length - 1;
    var options = arguments[len];
  
    for (var i = 0; i < len; i++) {
      if (arguments[i]) {
        return options.fn(this); // = true
      }
    }
    return options.inverse(this); // = false
  });

  Handlebars.registerHelper('_nor', function() {
    var len = arguments.length - 1;
    var options = arguments[len];
  
    for (var i = 0; i < len; i++) {
      if (arguments[i]) {
        return options.inverse(this); // = false
      }
    }
    return options.fn(this); // = true
  });
};
