(function() {

  window.monacaPages = window.monacaPages || [];

  var limit = 3;

  monacaPages["/index.html"] = function (loginData) {
    //Calling a function to get the list of news from the server. The false value of the "all" paramater tells the server
    //to get only the news that have permision to be showed on the top page
    getHeadline( { lang : window.LANG , type : "news_and_release" , limit : limit , all: false} , 
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

    //Caling a function to get the list of events. The number of events is defined by the limit parameter
    getEntry( { lang : window.LANG , type : "news_and_release" , limit : limit} ,
      function(data) {
        appendEntry(
          $(".events-entries") , data
        );

        $(".events-entry-toggle").on("click", "img", function() {
          $img = $(this);
          $entries = $img.parent().parent().find(".events-sub-entries");
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
    var all =options.all || true;

    $.ajax( {
      type : "GET",
      url : monacaApi.getBaseUrl() + "/" + lang + "/api/news/list",
      dataType : "JSON",
      contentType : "text/plain",
      data : { type : news_type , limit : limit, all : all },
      xhrFields: {
        withCredentials: true
      },
      success : success ,
      fail : fail
    } );
  }


  function appendHeadline( element , data ) {  
    var result = data.result;

    if(result.length == 0){
      $("#news-list").hide();
      return;
    }
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


  function getEntry(options,success,fail) {
    var lang = options.lang || 'en';
    var news_type = options.type || 'news_and_release';
    var limit = options.limit || 50;

  $.ajax( {
        type : "GET",
        url : monacaApi.getBaseUrl() + "/" + lang + "/api/event/list",
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

  function appendEntry( element , data ) {  
    var result = data.result;

    if(result.length == 0){
      $("#events-list").hide();
      return;
    }

    for (var i = 0; i < result.length; i++) {
      var entry = result[i];

     var categoryTag = '<span class="status-solved">セミナー</span>';
      if (entry.category == 1) {
        categoryTag = '<span class="status-fixing">展示会</br>カンファレンス</span>';
      } else if (entry.category == 2) {
        categoryTag = '<span class="status-reported">ワークショップ</span>';
      }   

      var d = new Date(entry.date);
      var text = '<div id="entry_' + entry.id + '" class="events-entry">' +
        '  <dl>' +
        '    <dt>' + entry.date + '</br>'+entry.location+'</dt>' +
        '    <dd>' +
               categoryTag +
        '      <span class="events-entry-comment"><a href="'+entry.url+'">' + entry.title + '</a></u></br>主催: '+entry.organizer+'</span>' +
        '    </dd>' +
        '  </dl>' + '</div>' ;
        element.append(text);
    }
  } 


})();
