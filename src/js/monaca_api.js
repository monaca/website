(function() {

  var monacaApi = Object.create(null);
  
  monacaApi.baseUrl = "<%= monaca_api %>";

  monacaApi.getHeadline = function (options,success,fail) {
    var lang = options.lang || 'en';
    var news_type = options.type || 'news_and_release';
    var limit = options.limit || 50;

    $.ajax( {
      type : "GET",
      url : monacaApi.baseUrl + "/" + lang + "/api/news/list",
      dataType : "JSON",
      contentType : "text/plain",
      data : { type : news_type , limit : limit },
      xhrFields: {
        withCredentials: true
      },
      success : success ,
      fail : fail
    } );
  }

  monacaApi.appendHeadline = function( element , data ) {  
    var result = data.result;
    for (var i = 0; i < result.length; i++) {
      var entry = result[i];
      element.append(
        '<div id="entry_"' + entry.id + '" class="headline-entry">' +
        '  <dl>' +
        '    <dt>' + entry.date + '</dt>' +
        '    <dd>' +
        '      <span class="headline-entry-comment-news">' + entry.body + '</span>' +
        '    </dd>' +
        '  </dl>' +
        '</div>'
      );
    }
  } 

  monacaApi.getIssues = function (options,success,fail) {
    var lang = options.lang || 'en';
    var limit = options.limit || 50;
    
    $.ajax( {
      type : "GET",
      url : monacaApi.baseUrl + "/" + lang + "/api/issue/list",
      dataType : "JSON",
      contentType : "text/plain",
      data : { limit : limit },
      xhrFields: {
        withCredentials: true
      },
      success : success ,
      fail : fail
    } );
  }

  monacaApi.appendIssues = function( lang, element , data ) {
    var result = data.result;
    var timeZone = lang == 'ja' ? 'JST' : 'UTC';
    for (var i = 0; i < result.length; i++) {
      var entry = result[i];
      var shouldOpen = entry.shouldOpen;    
      var icon = shouldOpen ? 'ico_tri_downward.png' : 'ico_tri_leftward.png' ;
      var statusTag = '<span class="status-solved">Solved</span>';
      if (entry.statusCss == "fixing") {
        statusTag = '<span class="status-fixing">Fixing</span>';
      } else if (entry.statusCss == "reported") {
        statusTag = '<span class="status-reported">Reported</span>';
      } 
      var detailsClass = shouldOpen ? '' : 'display: none;';
      element.append(
        '<div id="entry_"' + entry.id + '" class="headline-entry">' +
        '  <div class="headline-entry-toggle"><img src="/img/headline/' + icon + '" /></div>' +
        '  <dl>' +
        '    <dt>' + entry.date + '</dt>' +
        '    <dd>' +
               statusTag +
        '      <span class="headline-entry-comment">' + entry.title + '</span>' +
        '    </dd>' +
        '  </dl>' +
        '  <div class="headline-sub-entries" style="' + detailsClass + '">' +
        (function() {
          if (entry.details && entry.details.length>0) {
            var result = "";
            for (var j=0;j<entry.details.length;j++) {
              var detail = entry.details[j];
              result += '<dl>' +
                        '  <dt>' + detail.dateTime + ' ' + timeZone + '</dt>' +
                        '  <dd>' + detail.description + '</dd>' +
                        '</dl>';
            }
            return result;
          }
          return "";
        })() + 
        '  </div>' +
        '</div>' 
      );
    }
  }

  var loginData = { 
    profile : null,
    status : null,
    onElements : [] , 
    offElements : [] 
  };

  monacaApi.loadLoginData = function ( status ) {
    loginData.status = status;
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
    } else {
      loginData.onElements.forEach( function(elem) {
        elem.remove();
      } );
    }
  };

  
  monacaApi.showGravator = function ( ) {
    if (loginData.profile != null) {
      $(".user-icon").attr("src",loginData.profile.gravatar);
    }
  };

  window.addEventListener("load", function() {  

    if (! loginData.status.isLogin) {
      return;
    }

    $.ajax( {
      type : "GET",
      url : monacaApi.baseUrl + "/" + window.LANG + "/login_io_check",
            xhrFields: {
              withCredentials: true
            },
            dataType: "json",
            success: function(msg) {
              loginData.profile = msg.result;
              monacaApi.showGravator();
            },
            error: function(msg) {
             console.log( JSON.stringify( msg ) );
             // alert( JSON.stringify( msg ) );
            }
    } );
 
  } , false );

  window.monacaApi = monacaApi;

})();

