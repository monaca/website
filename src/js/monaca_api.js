(function() {

  var monacaApi = Object.create(null);

  monacaApi.baseUrl = "https://monaca.local";

  monacaApi.getHeadline = function (lang,success,fail) {
    $.ajax( {
      type : "GET",
      url : monacaApi.baseUrl + "/" + lang + "/api/news/list",
      dataType : "JSON",
      contentType : "text/plain",
      data : { type : "news_and_release" , limit : 50 },
      xhrFields: {
        withCredentials: true
      },
      success : success ,
      fail : fail
    } );
  }


  monacaApi.appendHeadline = function( element , data ) {  
    // element = $(".headline-entries").
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

  window.monacaApi = monacaApi;

})();

