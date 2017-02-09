(function() {

  window.monacaPages = window.monacaPages || [];

  var limit = 10;

  monacaPages["/events/index.html"] = function (loginData) {

    getEvents( { lang : window.LANG , type : "news_and_release" , limit : limit } ,
      function(data) {
        appendEvents( $(".events-entries") , data);     
      }
    ); 

    $(".events-more").click(function(){
        getEvents( { lang : window.LANG , type : "news_and_release",  limit : limit ,  entry_num: $(".events-entry").size() } ,
          function(data) {
            appendEvents( $(".events-entries")  , data);    
          }
        );      
    }); 

  };  

  monacaPages["/events/train.html"] = function (loginData) {
    getTrainings( { lang : window.LANG , type : "fault" , limit : limit } ,
      function(data) {
        appendTrainings( window.LANG , $(".events-entries") , data);     
      }
    );

    $(".events-more").click(function(){
        getTrainings( { lang : window.LANG , type : "news_and_release",  limit : limit ,  entry_num: $(".events-entry").size() } ,
          function(data) {
            appendTrainings( window.LANG ,$(".events-entries")  , data);    
          }
        );      
    }); 


  };

  function getEvents(options,success,fail) {
    var lang = options.lang || 'en';
    var news_type = options.type || 'news_and_release';
    var limit = options.limit || 50;
    var entry_num = options.entry_num || 0;

    $.ajax( {
      type : "GET",
      url : monacaApi.getBaseUrl() + "/" + lang + "/api/event/list",
      dataType : "JSON",
      contentType : "text/plain",
      data : { type : news_type , limit : limit , entry_num: entry_num},
      xhrFields: {
        withCredentials: true
      },
      success : success ,
      fail : fail
    } );
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } 

  function appendEvents( element , data ) {  
 
    var result = data.result;
  
    if(result.length < limit){
        $(".events-more").hide();  
    }

    var list= element.html();      

    for (var i = 0; i < result.length; i++) {
      var entry = result[i];
      
      var status = '<span class="status-on">申込受付中</span>'
      var categoryTag = '<span class="category-on">';
      var today = new Date();
      var d = new Date(entry.date);

      if(d.getTime()<today.getTime()){
        var status = '<span class="status-finished">終了しました</span>'
         categoryTag = '<span class="category-finished">';

      }

      if (entry.category == 0) {
        categoryTag += 'セミナー</span>';
      }else if (entry.category == 1) {
        categoryTag += '展示会カンファレンス</span>';
      } else if (entry.category == 2) {
        categoryTag += 'ワークショップ</span>';
      }

      
      var price;
      if(!entry.price){
      	price = "無料"
      }else{
      	price = '¥'+numberWithCommas(entry.price);
      }

      
      var text = '<tr id="entry_' + entry.id + '" class="events-entry">'+
      			'<th>' + entry.date + '</br>' + entry.location + '</th>' +
      			'<td class="status_column">' + categoryTag + status + '</td>' +
      			'<td class="events-entry-comment"><a href="'+entry.url+'" target="_blank">' + entry.title + '</a></br>主催: '+entry.organizer+'</td>' +
      			'<td class="price">'+price+'</td>' +
      			'</tr>';

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
      data : { limit : limit , entry_num: entry_num },
      xhrFields: {
        withCredentials: true
      },
      success : success ,
      fail : fail
    } );
  }

  function appendTrainings( lang, element , data) {

    var result = data.result;

    if(result.length < limit){
        $(".events-more").hide();
    }

    var list= element.html(); 

    for (var i = 0; i < result.length; i++) {
      var entry = result[i];

      var status = '<span class="status-on">申込受付中</span>'
      var today = new Date();
      var d = new Date(entry.date);

      if(d.getTime()<today.getTime()){
      	var status = '<span class="status-finished">終了しました</span>'
      }

      
      var text = '<tr id="entry_' + entry.id + '" class="events-entry">'+
      			'<th>' + entry.date + '</br>' + entry.location + '</th>' +
      			'<td class="status_column">' + status + '</td>' +
      			'<td class="events-entry-comment"><a href="'+entry.url+'">' + entry.title + '</a></br>主催: '+entry.organizer+'</td>' +
      			'<td class="price">¥'+numberWithCommas(entry.price)+'</td>' +
      			'</tr>';

         list+=text;  
    }

     element.html(list); 
  }

})();
