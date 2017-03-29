(function () {
  window.monacaPages = window.monacaPages || [];

  monacaPages["/index.html"] = function () {
    if (window.LANG == 'en') return;
    
    var limit = 3;
    getHeadline({lang: window.LANG, type: "news_and_release", limit: limit, all: false},
      function (data) {
        appendHeadline($(".headline-entries"), data);
      }
    );

    getEventList({lang: window.LANG, limit: limit, all: true},
      function (data) {
        appendEvent($(".events-entries"), data);
      }
    );
  };

  /**
   * Get News and release list
   * @param options
   * @param success
   * @param fail
   */
  function getHeadline(options, success, fail) {
    var lang = options.lang || 'en';
    var news_type = options.type || 'news_and_release';
    var limit = options.limit || 3;
    var all = options.all || false; // false means that get only Mongoinformation $show_home is true

    $.ajax({
      type: "GET",
      url: monacaApi.getBaseUrl() + "/" + lang + "/api/news/list",
      dataType: "JSON",
      contentType: "text/plain",
      data: {type: news_type, limit: limit, all: all, referer: 'monaca-io-top'},
      xhrFields: {
        withCredentials: true
      },
      success: success,
      fail: fail
    });
  }

  /**
   * Append element to HeadLine
   * @param element
   * @param data
   */
  function appendHeadline(element, data) {
    var result = data.result;

    if (result.length == 0) {
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
        '      <span class="headline-entry-comment-news">' +
        '<a href="/headline/index.html#entry_' + entry.id + '" target="_blank">' + entry.title + '</a></span>' +
        '    </dd>' +
        '  </dl>' +
        '</div>'
      );
    }
  }

  /**
   * Get Events and Trainings
   * @param options
   * @param success
   * @param fail
   */
  function getEventList(options, success, fail) {
    var lang = options.lang || 'en';
    var limit = options.limit || 50;
    var all = options.all || true;

    $.ajax({
      type: "GET",
      url: monacaApi.getBaseUrl() + "/" + lang + "/api/event-training-list",
      dataType: "JSON",
      contentType: "text/plain",
      data: {limit: limit, all: all, referer: 'monaca-io-top'},
      xhrFields: {
        withCredentials: true
      },
      success: success,
      fail: fail
    });
  }

  /**
   * Append element to event-list
   * @param element
   * @param data
   */
  function appendEvent(element, data) {
    var result = data.result;
    if (result.length == 0) {
      $("#events-list").hide();
      return;
    }

    var list = element.html();
    for (var i = 0; i < result.length; i++) {
      var entry = result[i];
      var categoryTag = createCategoryTag(entry);

      var text = '<tr id="entry_' + entry.id + '" class="events-entry">' +
        '<th><span>' + entry.date + '</span></th>' +
        '<td class="status_column">' + categoryTag + '</td>' +
        '<td class="events-entry-comment">' +
        '<span class="event-entry-comment-body"><a href="' + entry.url + '" target="_blank">' + entry.title + '</a></span>' +
        '</td>' +
        '</tr>';

      list += text;
    }

    element.html(list);
  }

  /**
   * Create category tag
   * @param entry
   * @returns {string}
   */
  function createCategoryTag(entry) {
    var categoryTag = '';
    var today = new Date();

    if ((new Date(entry.date)).getTime() < today.getTime()) {
      categoryTag = '<span class="category-finished">';
    } else {
      categoryTag = '<span class="category-on">';
    }

    if(entry.category === ""){
      categoryTag += 'トレーニング</span>';
    } else if (entry.category == 0) {
      categoryTag += 'セミナー</span>';
    } else if (entry.category == 1) {
      categoryTag += '展示会</span>';
    } else if (entry.category == 2) {
      categoryTag += 'ワークショップ</span>';
    }
    
    return categoryTag;
  }
})();
