(function() {
  var monacaApi = Object.create(null);
  monacaApi.executedLoginCheck = false;

  var loginData = {
    preReady:     false,
    ready:        false,
    profile:      null,
    status :      null,
    onElements:   [],
    offElements:  [],
    preListeners: [],
    listeners:    [],
    autoDisplay:  true,

    setReady: function() {
      this.ready = true; 
      this.listeners.forEach(function(f) {
        f(this);
      });
      this.listeners = [];
      if (this.autoDisplay) {
        displayBody();
      }
    },

    onReady: function(f) {
      if (this.ready == true) {
        f(this);
      } else {
        this.listeners.push(f);
      }
    },

    setPreReady: function() {
      this.preReady = true;
      this.preListeners.forEach(function(f) {
        f(this);
      });
      this.preListeners = [];
    },

    onPreReady: function(f) {
      if (this.preReady == true) {
        f(this);
      } else {
        this.preListeners.push(f);
      }
    },

    getProfileColumn: function(col) {
      if (this.profile && this.profile[col]) {
        return this.profile[col];
      }
      return '';
    }
  };

  monacaApi.loginCheck = function(status) {
    this.executedLoginCheck = true;
    loginData.status = status;
    loginData.setPreReady();

    if (!status.isLogin) {
      loginData.setReady();
    }

    var el = document.querySelector(".navbar-nav");
    var children = $(el).children();
    var n = children.size();

    for (var i = n - 8; i < n - 5; i++) {
      loginData.offElements.push(children[i]);
    }

    for (var i = n - 5; i < n; i++) {
      loginData.onElements.push(children[i]);
    }

    if (status.isLogin) {
      loginData.offElements.forEach(function(elem) {
        elem.remove();
      });
      this.loadLoginData();
    } else {
      loginData.onElements.forEach(function(elem) {
        elem.remove();
      });
    }
  };
  
  monacaApi.getBaseUrl = function() {
    return window.MONACA_API_URL;
  };

  monacaApi.loadLoginData = function() {
    if (!loginData.status.isLogin) {
      loginData.setReady();
      return;
    }

    $.ajax({
      type: "GET",
      url: monacaApi.getBaseUrl() + "/" + window.LANG + "/login_io_check",
      xhrFields: {
        withCredentials: true
      },
      dataType: "json",
      success: function(msg) {
        loginData.profile = msg.result;
        monacaApi.showGravator();
        loginData.setReady();
      },
      error: function(msg) {
        loginData.setReady();
      }
    });
 
  };

  monacaApi.showGravator = function ( ) {
    if (loginData.profile != null) {
      $(".user-icon").attr("src",loginData.profile.gravatar);
    }
  };

  // Page Initialization;
  window.addEventListener('DOMContentLoaded', function() {
    var path = location.pathname;
    var popup_csrf_token = '';
    var msec = 400;

    if (path.slice(-1) == '/') {
      path += "index.html";
    }

    $('#show_signuppopup').click(function() {
      getCsrfToken(monacaApi.getBaseUrl() + "/" + window.LANG + "/api/register");

      $('#signuppopup').fadeIn(msec)
        .find('input#form_email')
        .focus();
      $("#modal-overlay").fadeIn(msec).one('click', function() {
        closePopup(msec, 'signuppopup');
      });
    });

    $('#show_loginpopup').click(function() {
      getCsrfToken(monacaApi.getBaseUrl() + "/" + window.LANG + "/api/csrf_token");

      $('#loginpopup').fadeIn(msec)
        .find('input#form_email')
        .focus();
      $("#modal-overlay").fadeIn(msec).one('click', function() {
        closePopup(msec, 'loginpopup');
      });
    });

    $('#close_signupbackpopup').click(function() {
      closePopup(msec, 'signuppopup');
    });

    $('#close_loginpopup').click(function() {
      closePopup(msec, 'loginpopup');
    });

    $('#popup_login_btn').click(function() {

    });

    $('#popup_signup_btn').click(function() {
      formUtil.disableAllInput();
      var sendData = {
        'register[email]':       $('#signup_popup_email').val(),
        'register[password]':    $('#signup_popup_password').val(),
        'register[_csrf_token]': popup_csrf_token
      };

      $.ajax({
        type: "POST",
        url: monacaApi.getBaseUrl() + "/" + window.LANG + "/api/register",
        xhrFields: {
          withCredentials: true
        },
        data: sendData,
        dataType: "json",
        success: function (msg) {
          formUtil.enableAllInput();

          if (msg.result == 'submitOK') {
            console.log('register success!');
            location.href="/register/thankyou.html"
          } else if (msg.result && msg.result.formError) {
            formUtil.displayFormErrorForGlobal(msg.result.formError, 'signup-popup-error');
          } else {
            formUtil.displayFormErrorFor
          }
        },
        error: function (msg) {
          formUtil.enableAllInput();
          //displayUnknownError();
        }
      });

    });


    var f = monacaPages[path];
    if (f) {
      f(loginData);
    }

    function getCsrfToken(url) {
      $.ajax({
        type: "GET",
        url: url,
        xhrFields: {
          withCredentials: true
        },
        dataType: "json",
        success: function (msg) {
          if (msg.result && msg.result.initOK) {
            popup_csrf_token = msg.result.initOK._csrf_token;
          } else if (msg.result && msg.result._csrf_token) {
            popup_csrf_token = msg.result._csrf_token;
          }
        },
        error: function (msg) {}
      });
    }
  } , false);

  monacaApi.getUrlVars = function() {
    var vars = [], hash;

    if (window.location.href.indexOf('?') == -1) {
      return vars;
    }

    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

    for(var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars[hash[0]] = hash[1];
    }
    return vars;
  };

  window.monacaApi = monacaApi;
})();