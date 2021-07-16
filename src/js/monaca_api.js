(function() {
  var monacaApi = Object.create(null);
  var isLoggedIn = false;

  var loginData = {
    preReady:     false,
    ready:        false,
    profile:      null,
    status :      null,
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

  monacaApi.popupMsec = 400;
  monacaApi.loginCheck = function(status) {
    loginData.status = status;
    loginData.setPreReady();

    if (status.isLogin) {
      // For login user
      if (window.LANG === 'en') {
        $(".navbar-nav .before-login").remove();
      } else if (window.LANG === 'ja') {
        $('#login-button-menu').hide();
        $('#trial-button-menu').hide();
      }
      this.loadLoginData();
      this.showcaseAddEnable(true);
    } else {
      // For non-login user
      if (window.LANG === 'en') {
        $(".navbar-nav .after-login").remove();
      } else if (window.LANG === 'ja') {
        $('#dashboard-button-menu').hide();
      }
      loginData.setReady();
      this.showcaseAddEnable(false);
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
    if (isIdeAvailable()) {
      $('#signup-ng').remove();
    } else {
      $('#signup-ok').remove();
    }

    $('.exec-logout').click(function() {
      $.ajax({
        type: "POST",
        url: monacaApi.getBaseUrl() + "/" + window.LANG + "/api/account/logout",
        xhrFields: {
          withCredentials: true
        },
        dataType: "json",
        success: function (msg) {
          location.reload();
        },
        error: function (msg) {
          location.reload();
        }
      });
    });

    $('.go-to-dashboard').click(function() {
      location.href = MONACA_API_URL + '/' + LANG + '/dashboard';
    });

    $('.account-page').click(function() {
      const defaultAccountPageUrl = `${MONACA_API_URL}/${LANG}/account/edit`;
      $.ajax({
        type: "GET",
        url: MONACA_IDE_API_URL + '/api/environment/configurations',
        xhrFields: {
          withCredentials: true
        },
        dataType: "json",
        success: function (msg) {
          const accountPageUrl = msg.result.client.service.use_new_monaca_frontend ? `${MONACA_API_URL}/frontend/account/edit` : defaultAccountPageUrl;
          location.href = accountPageUrl;
        },
        error: function (err) {
          location.href = defaultAccountPageUrl;
        }
      });
    });

    $('.btn-github').click(function() {
      location.href = MONACA_GITHUB_OAUTH_URL;
    });

    $('#show_loginpopup, .show_loginpopup').click(function() {
      if (isSafari()) {
        location.href=window.MONACA_API_URL + "/" + window.LANG + "/login";
        return;
      }

      // If logged in, jump to dashboard
      if (loginData.ready) {
        if (loginData.status.isLogin || JSON.stringify(loginData.status) === '{}') { // If loginData.status is broken, jump to dashboard
          location.href = MONACA_API_URL + '/' + LANG + '/dashboard';
          return;
        }
      } else {
        return; // Wait until login data is retrieved
      }

      formUtil.resetError();
      setCsrfToken("loginpopup-csrf-token", monacaApi.getBaseUrl() + "/" + window.LANG + "/api/account/login");
      $('#loginpopup').fadeIn(msec)
        .find('input#login_popup_email')
        .focus();
      $("#modal-overlay").fadeIn(msec).one('click', function() {
        closePopup(msec, 'loginpopup');
      });
    });

    $('#close_loginpopup').click(function() {
      closePopup(msec, 'loginpopup');
    });

    $('.toggle-password').click(function() {
      $('.toggle-password')
        .toggleClass('glyphicon-eye-open')
        .toggleClass('glyphicon-eye-close');
      if ($('#login_popup_password').attr('type') === 'password') {
        $('#login_popup_password').attr('type', 'text');
      } else {
        $('#login_popup_password').attr('type', 'password');
      }
    });

    $('#popup_login_btn').click(function() {
      $('#popup_login_btn').addClass('loading');
      $("#login-popup-form").attr('action', window.MONACA_API_URL + "/" + window.LANG + "/login");
      $("#login-popup-form").submit();
    });

    var f = monacaPages[path];
    if (f) {
      f(loginData);
    }

    function setCsrfToken(elementId, url) {
      getCsrfToken(url, function(token) {
        $("#"+elementId).val(token);
      });
    }

    function getCsrfToken(url, callback) {
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
          if (popup_csrf_token && callback) {
            callback(popup_csrf_token);
          }
        },
        error: function (msg) {}
      });
    }
  } , false);

  monacaApi.setCsrfToken = function(elementId, url) {
    monacaApi.getCsrfToken(url, function(token) {
      $("#"+elementId).val(token);
    });
  }

  monacaApi.getCsrfToken = function(url, callback) {
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
        if (popup_csrf_token && callback) {
          callback(popup_csrf_token);
        }
      },
      error: function (msg) {}
    });
  }

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

  monacaApi.showcaseAddEnable = function(enable) {
    var inputs = $('section#case_add input:not(#login-required)');
    var loginRequiredButton = $('section#case_add input#login-required');

    if (enable) {
      inputs.removeAttr('disabled');
      loginRequiredButton.hide();
    } else {
      inputs.attr('disabled', 'disabled');
      loginRequiredButton.show();
    }
  };

  window.monacaApi = monacaApi;
})();
