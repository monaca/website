(function() {

  window.monacaPages = window.monacaPages || [];

  monacaPages["/great-apps.html"] = function (loginData) {
  
    var d1 = new $.Deferred;
    var d2 = new $.Deferred;

    showFeaturedApps( function() { d1.resolve(); } , function() { d1.reject(); } );
    showNormalApps(0 , function() { d2.resolve(); } , function() { d2.reject(); } ); 

    $.when(d1.promise(),d2.promise()).then(
      function() {
        $(window).on("scroll", function(e) {
          var scrollTop = $(window).scrollTop();
          var moreEl = $("#more").offset();
          if (!moreEl) return;
          var threshold = moreEl.top - $(window).height() + 160;
          if (scrollTop > threshold) {
            readMoreCases(e);
          }
        });
      } ,
      function() {
        alert("Network Error");
      }
    );
    
  };

  function showFeaturedApps(success,fail) {
    getApps( { lang : window.LANG, isFeature : true },
      function(data) {
        if (data.status == "ok") {
          var list = data.result;
          list.forEach( function(app) {
            var item = createFeaturedAppHtml(app);
            $('#featured').append(item);
          } );

//          $('body').on("click", ".casepopup", function(e) {
//            var $target = $($(this).attr("href"));
//            if (!$target.length) return;
//
//            $target.modal();
//            return false;
//          });
          if (success) success(list);
        } else {
          if (fail) fail();
        }
      }
    );  
  }

  function showNormalApps(page,success,fail) {
    getApps( { lang : window.LANG, isFeature : false , page : page },
      function(data) {
        if (data.status == "ok") {
          var list = data.result;
          list.forEach( function(app) {
            var item = createNormalAppHtml(app);
            $('#caseicon').append(item);
          } );
          if (success) success(list);
        } else {
          if (fail) fail();
        }
      }
    );  

  }

  readMoreCases.page = 1;
  function readMoreCases(e) {
    $(".btn-readmorecases").hide();
    $(".icn-loading-cases").css({"display": "block"});
    showNormalApps(readMoreCases.page, function(list){
      readMoreCases.page += 1;
      $(".btn-readmorecases").show();
      $(".icn-loading-cases").hide();
      if (list.length == 0) $("#case .container .more").hide();
    } , function(){
      $(".btn-readmorecases").show();
      $(".icn-loading-cases").hide();
      alert("Network error!");
    });
  }

  function getApps(options,success,fail) {
    var lang = options.lang || 'en';
    var isFeature = options.isFeature || false;
    var page = options.page || 0;
    var limit = options.limit || 10;

    $.ajax( {
      type : "GET",
      url : monacaApi.getBaseUrl() + "/" + lang + "/api/showcase/list",
      dataType : "JSON",
      contentType : "text/plain",
      data : { isFeature : isFeature , page : page , limit : limit } ,
      xhrFields: {
        withCredentials: true
      },
      success : success,
      fail : fail
    } ); 
  }

  function getApp(options,success,fail) {
    var id = options.id;
    var lang = options.lang || 'en';
    
    $.ajax( {
      type : "GET",
      url : monacaApi.getBaseUrl() + "/" + lang + "/api/showcase/" + id,
      dataType : "JSON",
      contentType : "text/plain",
      data : {},
      xhrFields: {
        withCredentials: true
      },
      success : success,
      fail : fail
    } );
  } 

  function createFeaturedAppHtml(app) {
    var item = $('<li></li>');
    if (app.filter == 'borderradius') {
      item.addClass('borderradius');
    }
    var anchor = $('<a class="casepopup"></a>');
    anchor.attr('href','#case-' + app.id);
    var figure = $('<figure></figure>');
    var img = $('<img></img>');
    img.attr('src',app.icon);
    figure.append(img);
    anchor.append(figure);
    var p1 = $('<p></p>');
    p1.text( app.title );
    var p2 = $('<p></p>');
    p2.text( app.author );
    anchor.append(p1);
    anchor.append(p2);
    item.append(anchor);
    anchor.click( function() {
      showModal(app);
      return false;
    } );
    return item;
  }

  function createNormalAppHtml(app) {
    var item = $('<li></li>');
    if (app.filter == 'borderradius') {
      item.addClass('borderradius');
    }
    var anchor = $('<a class="casepopup"></a>');
    anchor.attr('href','#case-' + app.id);
    var figure = $('<figure></figure>');
    var img = $('<img style="width: 150px;"></img>');
    img.attr('src',app.icon);
    figure.append(img);
    anchor.append(figure);
    var p1 = $('<p></p>');
    p1.text( app.title );
    var p2 = $('<p></p>');
    p2.text( app.author );
    anchor.append(p1);
    anchor.append(p2);
    item.append(anchor); 
    anchor.click( function() {
      showModal(app);
      return false;
    } );
    return item;
  }

  function showModal(app) {
    getApp( { id : app.id } , function(json) {
      alert( JSON.stringify( json ) );
    } , function () { alert("Network Error"); } );
  }



})();







