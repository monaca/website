(function () {
  window.monacaPages = window.monacaPages || [];
  var limit = 10;

  monacaPages["/events/index.html"] = function () {
    if (window.LANG == 'en') return;

    getEvents({lang: window.LANG, limit: limit, all: true},
      function (data) {
        appendEvents($(".events-entries"), data);
      }
    );

    $(".events-more").click(function () {
      getEvents({lang: window.LANG, limit: limit, entry_num: $(".events-entry").size()},
        function (data) {
          appendEvents($(".events-entries"), data);
        }
      );
    });
  };

  monacaPages["/events/training.html"] = function () {
    if (window.LANG == 'en') return;

    getTrainings({lang: window.LANG, limit: limit, all: true},
      function (data) {
        appendTrainings(window.LANG, $(".events-entries"), data);
      }
    );
    $(".events-more").click(function () {
      getTrainings({lang: window.LANG, limit: limit, entry_num: $(".events-entry").size()},
        function (data) {
          appendTrainings(window.LANG, $(".events-entries"), data);
        }
      );
    });
  };

  /**
   * Get Event List
   * @param options
   * @param success
   * @param fail
   */
  function getEvents(options, success, fail) {
    var lang = options.lang || 'en';
    var limit = options.limit || 50;
    var entry_num = options.entry_num || 0;
    var all = options.all || true;

    $.ajax({
      type: "GET",
      url: monacaApi.getBaseUrl() + "/" + lang + "/api/event/list",
      dataType: "JSON",
      contentType: "text/plain",
      data: {limit: limit, entry_num: entry_num, all: all},
      xhrFields: {withCredentials: true},
      success: success,
      fail: fail
    });
  }

  /**
   * Append Events
   * @param element
   * @param data
   */
  function appendEvents(element, data) {
    var result = data.result;
    if (result.length < limit) {
      $(".events-more").hide();
    }

    var list = element.html();
    for (var i = 0; i < result.length; i++) {
      var entry = result[i];
      var status = createStatusTag(entry);
      var categoryTag = createCategoryTag(entry);
      var price = formatPrice(entry);

      var text = '<tr id="entry_' + entry.id + '" class="events-entry">' +
        '<th>' + entry.date + '</br>' + entry.location + '</th>' +
        '<td class="status_column">' + categoryTag + status + '</td>' +
        '<td class="events-entry-comment"><a href="' + entry.url + '" target="_blank">' + entry.title + '</a></br>主催: ' + entry.organizer + '</td>' +
        '<td class="price">' + price + '</td>' +
        '</tr>';
      list += text;
    }
    element.html(list);
  }

  /**
   * Get Training information
   * @param options
   * @param success
   * @param fail
   */
  function getTrainings(options, success, fail) {
    var lang = options.lang || 'en';
    var limit = options.limit || 50;
    var entry_num = options.entry_num || 0;
    var all = options.all || true;

    $.ajax({
      type: "GET",
      url: monacaApi.getBaseUrl() + "/" + lang + "/api/training/list",
      dataType: "JSON",
      contentType: "text/plain",
      data: {limit: limit, entry_num: entry_num, all: all},
      xhrFields: {
        withCredentials: true
      },
      success: success,
      fail: fail
    });
  }

  /**
   * Append Training information
   * @param lang
   * @param element
   * @param data
   */
  function appendTrainings(lang, element, data) {
    var result = data.result;
    if (result.length < limit) {
      $(".events-more").hide();
    }

    var list = element.html();
    for (var i = 0; i < result.length; i++) {
      var entry = result[i];
      var status = createStatusTag(entry);
      var text = '<tr id="entry_' + entry.id + '" class="events-entry">' +
        '<th>' + entry.date + '</br>' + entry.location + '</th>' +
        '<td class="status_column">' + status + '</td>' +
        '<td class="events-entry-comment"><a href="' + entry.url + '">' + entry.title + '</a></br>主催: ' + entry.organizer + '</td>' +
        '<td class="price">¥' + numberWithCommas(entry.price) + '</td>' +
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
    var today = new Date();

    if ((new Date(entry.date)).getTime() < today.getTime()) {
      var status = '<span class="status-finished">終了しました</span>';
      var categoryTag = '<span class="category-finished">';
    } else {
      var status = '<span class="status-on">申込受付中</span>';
      var categoryTag = '<span class="category-on">';
    }

    if (entry.category == 0) {
      categoryTag += 'セミナー</span>';
    } else if (entry.category == 1) {
      categoryTag += "展示会</span>";
    } else if (entry.category == 2) {
      categoryTag += 'ワークショップ</span>';
    }
    return categoryTag;
  }

  /**
   * Create Status Tag
   * @param entry
   */
  function createStatusTag(entry) {
    var today = new Date();
    if ((new Date(entry.date)).getTime() < today.getTime()) {
      return '<span class="status-finished">終了しました</span>';
    } else {
      return '<span class="status-on">申込受付中</span>';
    }
  }

  /**
   * Format price label
   * @param entry
   * @returns {*}
   */
  function formatPrice(entry) {
    if (!entry.price || Number(entry.price) === 0) {
      return "無料";
    } else {
      return '¥' + numberWithCommas(entry.price);
    }
  }

  /**
   * Format number with commas
   * @param x
   * @returns {XML|*|void|string}
   */
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

})();
