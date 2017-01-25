(function() {

  window.monacaPages = window.monacaPages || [];

  var limit = 2;

  monacaPages["/events/index.html"] = function (loginData) {

    getEvents( { lang : window.LANG , type : "news_and_release" , limit : limit , age: "new"} ,
      function(data) {
        appendEvents( $(".events-entries") , data, "new");     
      }
    ); 

    getEvents( { lang : window.LANG , type : "news_and_release" , limit : limit , age: "old"} ,
      function(data) {
        appendEvents( $(".events-entries-old")  , data,  "old");    
      }
    );

    $(".events-more").click(function(){
        getEvents( { lang : window.LANG , type : "news_and_release",  limit : limit , age:"new", entry_num: $(".new").size() } ,
          function(data) {
            appendMoreEvents( $(".events-entries")  , data, "new");    
          }
        );      
    }); 

    $(".events-more-old").click(function(){
        getEvents( { lang : window.LANG , type : "news_and_release",  limit : limit , age:"old", entry_num: $(".old").size()} ,
          function(data) {
            appendMoreEvents( $(".events-entries-old")  , data, "old");    
          }
        );     
    }); 

  };  

  monacaPages["/events/train.html"] = function (loginData) {
    getTrainings( { lang : window.LANG , type : "fault" , limit : limit ,age: "new" } ,
      function(data) {
        appendTrainings( window.LANG , $(".events-entries") , data, "new");     
      }
    );

    getTrainings( { lang : window.LANG , type : "fault" , limit : limit ,age: "old"} ,
      function(data) {
        appendTrainings( window.LANG , $(".events-entries-old") , data, "old");     
      }
    );

    $(".events-more").click(function(){
        getTrainings( { lang : window.LANG , type : "news_and_release",  limit : limit , age:"new", entry_num: $(".new").size() } ,
          function(data) {
            appendMoreTrainings( window.LANG ,$(".events-entries")  , data, "new");    
          }
        );      
    }); 

     $(".events-more-old").click(function(){
        getTrainings( { lang : window.LANG , type : "news_and_release",  limit : limit , age:"old", entry_num: $(".old").size() } ,
          function(data) {
            appendMoreTrainings( window.LANG , $(".events-entries-old")  , data, "old");    
          }
        );      
    });


  };

  function getEvents(options,success,fail) {
    var lang = options.lang || 'en';
    var news_type = options.type || 'news_and_release';
    var limit = options.limit || 50;
    var entry_num = options.entry_num || 0;
    var age = options.age || "new";

    $.ajax( {
      type : "GET",
      url : monacaApi.getBaseUrl() + "/" + lang + "/api/event/list",
      dataType : "JSON",
      contentType : "text/plain",
      data : { type : news_type , limit : limit , age: age, entry_num: entry_num},
      xhrFields: {
        withCredentials: true
      },
      success : success ,
      fail : fail
    } );
  }

  function appendEvents( element, data , age) {  

    var result = data.result;

    
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
        '  <dl class="'+age+'">' +
        '    <dt>' + entry.date + '</br>'+entry.location+'</dt>' +
        '    <dd>' +
               categoryTag +
        '      <span class="events-entry-comment"><a href="'+entry.url+'">' + entry.title + '</a></u></br>主催: '+entry.organizer+'</span>' +
        '    </dd>' +
        '  </dl>' + '</div>' ;
      
        element.append(text);
        
    }
  } 

  function appendMoreEvents( element , data, age ) {  
 
    var result = data.result;

  
    if(result.length === 0){
      if(age === "new"){
        $(".events-more").hide();
      }else{
        $(".events-more-old").hide();
      }
      
      return;
    }

    var list= element.html();      

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
        '  <dl class="'+age+'">'+
        '    <dt>' + entry.date + '</br>'+entry.location+'</dt>' +
        '    <dd>' +
               categoryTag +
        '      <span class="events-entry-comment"><a href="'+entry.url+'">' + entry.title + '</a></br>主催: '+entry.location+'</span>' +
        '    </dd>' +
        '  </dl>' + '</div>' ;

        list+=text;  
    }

     element.html(list); 
  } 

  function getTrainings(options,success,fail) {
    var lang = options.lang || 'en';
    var limit = options.limit || 50;
    var entry_num = options.entry_num || 0;
    var age = options.age || "new";
    
    $.ajax( {
      type : "GET",
      url : monacaApi.getBaseUrl() + "/" + lang + "/api/training/list",
      dataType : "JSON",
      contentType : "text/plain",
      data : { limit : limit , age: age, entry_num: entry_num },
      xhrFields: {
        withCredentials: true
      },
      success : success ,
      fail : fail
    } );
  }

  function appendTrainings( lang, element , data , age) {

    var result = data.result;

    for (var i = 0; i < result.length; i++) {
      var entry = result[i];

      var d = new Date(entry.date);
      var text = '<div id="entry_' + entry.id + '" class="events-entry">' +
        '  <dl class="'+age+'">'+
        '    <dt>' + entry.date + '</br>'+entry.location+'</dt>' +
        '    <dd>' +
        '      <span class="events-entry-comment"><a href="'+entry.url+'">' +entry.title + '</a></u><div align="right">¥'+entry.price+'</div>主催: '+entry.organizer+'</span>' +
        '    </dd>' +
        '  </dl>' + '</div>' ;

        element.append(text);
    }   
  }

  function appendMoreTrainings( lang, element , data , age) {

    var result = data.result;

    if(result.length === 0){
      if(age === "new"){
        $(".events-more").hide();
      }else{
        $(".events-more-old").hide();
      }
      
      return;
    }

    var list= element.html(); 

    for (var i = 0; i < result.length; i++) {
      var entry = result[i];

      var d = new Date(entry.date);
      var text = '<div id="entry_' + entry.id + '" class="events-entry">' +
        '  <dl class="'+age+'">'+
        '    <dt>' + entry.date + '</br>'+entry.location+'</dt>' +
        '    <dd>' +
        '      <span class="events-entry-comment"><a href="'+entry.url+'">' +entry.title + '</a></u><div align="right">¥'+entry.price+'</div>主催: '+entry.organizer+'</span>' +
        '    </dd>' +
        '  </dl>' + '</div>' ;

         list+=text;  
    }

     element.html(list); 
  }

})();
