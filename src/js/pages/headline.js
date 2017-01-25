(function() {

  window.monacaPages = window.monacaPages || [];

  var limit = 50;

  monacaPages["/headline/index.html"] = function (loginData) {

    getHeadline( { lang : window.LANG , type : "news_and_release" , limit : limit } ,
      function(data) {
        appendHeadline(
          $(".headline-entries") , data
        );

        $(".headline-entry-toggle").on("click", "img", function() {
          $img = $(this);
          $entries = $img.parent().parent().find(".headline-sub-entries");
          if ($entries.css("display") == "none") {
            $img.attr("src", "/img/headline/ico_tri_downward.png");
          } else {
            $img.attr("src", "/img/headline/ico_tri_leftward.png");
          }
          $entries.slideToggle();
        });
      }
    );
  };

  monacaPages["/headline/fault.html"] = function (loginData) {
    getIssues( { lang : window.LANG , type : "fault" , limit : limit } ,
      function(data) {
        appendIssues(
          window.LANG , $(".headline-entries") , data
        );

        $(".headline-entry-toggle").on("click", "img", function() {
          $img = $(this);
          $entries = $img.parent().parent().find(".headline-sub-entries");
          if ($entries.css("display") == "none") {
            $img.attr("src", "/img/headline/ico_tri_downward.png");
          } else {
            $img.attr("src", "/img/headline/ico_tri_leftward.png");
          }
          $entries.slideToggle();
        });
      }
    );
  };

  function getHeadline(options,success,fail) {
    var lang = options.lang || 'en';
    var news_type = options.type || 'news_and_release';
    var limit = options.limit || 50;

    $.ajax( {
      type : "GET",
      url : monacaApi.getBaseUrl() + "/" + lang + "/api/news/list",
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

  function appendHeadline( element , data ) {  
    var result = data.result;
    for (var i = 0; i < result.length; i++) {
      var entry = result[i];
      element.append(
        '<div id="entry_' + entry.id + '" class="headline-entry">' +
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

  function getIssues(options,success,fail) {
    var lang = options.lang || 'en';
    var limit = options.limit || 50;
    
    $.ajax( {
      type : "GET",
      url : monacaApi.getBaseUrl() + "/" + lang + "/api/issue/list",
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

  function appendIssues( lang, element , data ) {
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
        '<div id="entry_' + entry.id + '" class="headline-entry">' +
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


})();
