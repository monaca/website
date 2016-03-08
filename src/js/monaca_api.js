(function() {

  // Application Settings

  var monacaApi = Object.create(null);

  var loginData = {
    preReady: false,
    ready : false,
    profile : null,
    status : null,
    onElements : [] , 
    offElements : [] ,
    preListeners : [],
    listeners: [],
    setReady : function() { 
      this.ready = true; 
      this.listeners.forEach( function(f) {
        f(this);
      });
      this.listeners = [];
    },
    onReady : function(f) {
      if (this.ready == true) {
        f(this);
      } else {
        this.listeners.push( f );
      }
    },
    setPreReady : function() {
      this.preReady = true;
      this.preListeners.forEach( function(f) {
        f(this);
      });
      this.preListeners = [];
    },
    onPreReady : function(f) {
      if (this.preReady == true) {
        f(this);
      } else {
        this.preListeners.push( f );
      }
    }
  };

  monacaApi.loginCheck = function ( status ) {
    console.log('loginCheck called.');
    loginData.status = status;
    loginData.setPreReady();

    if (!status.isLogin) {
      loginData.setReady();
    }

    var el = document.querySelector(".navbar-nav");
    var children = $(el).children();
    var n = children.size();
    for (var i = n-8;i<n-5;i++) {
      loginData.offElements.push( children[i] );
    }
    for (var i = n-5;i<n;i++) {
      loginData.onElements.push( children[i] );
    } 
    if (status.isLogin) {
      loginData.offElements.forEach( function(elem) {
        elem.remove();
      } );
      this.loadLoginData();
    } else {
      loginData.onElements.forEach( function(elem) {
        elem.remove();
      } );
    }
  };
  
  monacaApi.getBaseUrl = function() {
    return window.MONACA_API_URL;
  };

  monacaApi.loadLoginData = function() {
    if (! loginData.status.isLogin) {
      loginData.setReady();
      return;
    }

    $.ajax( {
      type : "GET",
      url : monacaApi.getBaseUrl() + "/" + window.LANG + "/login_io_check",
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
    } );
 
  };

  monacaApi.showGravator = function ( ) {
    if (loginData.profile != null) {
      $(".user-icon").attr("src",loginData.profile.gravatar);
    }
  };

  // Page Initialization;

  window.addEventListener('DOMContentLoaded',function() {
    var path = location.pathname;
    if (path.slice(-1) == '/') {
      path += "index.html";
    }
    var f = monacaPages[path];
    if (f) {
      f( loginData );
    }
  } , false);

  // Helpers

  monacaApi.getUrlVars = function() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
  }

  // export

  window.monacaApi = monacaApi;

})();

