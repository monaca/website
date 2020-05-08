(function () {

  window.monacaPages = window.monacaPages || [];

  var limit = 20;
  var limitCounter = 1; // increase amount of data to query from database

  // Headline data
  var headlineData = [];

  var TYPE_NEWS_AND_RELEASE = 'news_and_release';
  var TYPE_TRAINING = 'training';
  var TYPE_EVENT = 'event';
  var HEADER_TYPE = 'header_type';
  var HEADER_CONTENT = 'header_content';
  var HEADER_DATE = 'header_date';

  var translations = {
    'en': {
      'news_and_release': 'Announcement',
      'training': 'Training',
      'event': 'Seminar',
      'header_type': 'Type',
      'header_content': 'Content',
      'header_date': 'Date',
    },
    'ja': {
      'news_and_release': 'お知らせ',
      'training': 'トレーニング',
      'event': 'セミナー',
      'header_type': '種別',
      'header_content': '内容',
      'header_date': '更新日',
    }
  }

  monacaPages['/headline/index.html'] = function () {

    limitCounter = 1;
    $.when(getAllHeadlinesFromDatabase(limit)).done(function(data) {
      headlineData = data;
      var headlineElement = $('.headline-entries');
      // Create Header
      appendHeadlineHeader(headlineElement);
      // Append Content
      appendHeadlineContent(headlineElement, headlineData.slice(0, limit));
    });

    $(".headlines-more").click(function () {
      if (isFetchingData()) return;
      hideHeadlineMore();
      var headlineElement = $('.headline-entries');
      var current = getCurrentShownHeadlineEntry();
      if (headlineData && headlineData.length) {
        if ((headlineData.length - current) >= limit) {
          appendHeadlineContent(headlineElement, headlineData.slice(current, current + limit));
          showHeadlineMore();
          return;
        }
      }
      // fetch more data from database
      limitCounter++;
      $.when(getAllHeadlinesFromDatabase(limit * limitCounter)).done(function(data) {
        headlineData = data;
        var headlineElement = $('.headline-entries');
        appendHeadlineContent(headlineElement, headlineData.slice(current, current + limit));
        showHeadlineMore();
      });
    });


  };

  monacaPages['/headline/fault.html'] = function () {
    var category = window.getQueryString('category');

    getIssues({ lang: window.LANG, type: 'fault', limit: limit, category: category },
      function (data) {
        appendIssues(
          window.LANG, $('.headline-entries'), data
        );

        $('.headline-entry-toggle').on('click', 'img', function () {
          $img = $(this);
          $entries = $img.parent().parent().find('.headline-sub-entries');
          if ($entries.css('display') == 'none') {
            $img.attr('src', '/img/headline/ico_tri_downward.png');
          } else {
            $img.attr('src', '/img/headline/ico_tri_leftward.png');
          }
          $entries.slideToggle();
        });
      }
    );
  };

  function getText(key) {
    var lang = window.LANG.toLowerCase();
    return translations[lang][key];
  }

  function getText(key) {
    var lang = window.LANG.toLowerCase();
    return translations[lang][key];
  }

  function getHeadline(options,success,fail) {
    var lang = options.lang || 'en';
    var news_type = options.type || TYPE_NEWS_AND_RELEASE;
    var limit = options.limit || 50;

    return $.ajax({
      type: 'GET',
      url: monacaApi.getBaseUrl() + '/' + lang + '/api/news/list',
      dataType: 'JSON',
      contentType: 'text/plain',
      data: { type: news_type, limit: limit },
      xhrFields: {
        withCredentials: true
      },
      success: success,
      fail: fail
    });
  }

  function appendHeadlineHeader(element) {
    element.append(
      '<div class="headline-entry header">' +
      '  <div class="header-item">' + getText(HEADER_TYPE) + '</div>' +
      '  <div class="header-item">' + getText(HEADER_CONTENT) + '</div>' +
      '  <div class="header-item">' + getText(HEADER_DATE) + '</div>' +
      '</div>'
    );
  }

  function getHeadlineContentBody(entry) {
    if (entry.type === TYPE_NEWS_AND_RELEASE) {
      return entry.body;
    } else if (entry.type === TYPE_EVENT || entry.type === TYPE_TRAINING) {
      return '<a href="' + entry.url + '" target="_blank">' + entry.title + '</a></br>主催：' + entry.organizer + '、開催場所：' + entry.location + '、参加費用：' + formatPrice(entry);
    }
  }

  function getAllHeadlinesFromDatabase(limit) {
    var deferred = $.Deferred();
    var lang = window.LANG;
    $.when(
      getHeadline({ lang: lang, type: TYPE_NEWS_AND_RELEASE, limit: limit }),
      getTrainings({lang: lang, limit: limit, all: true}),
      getEvents({lang: lang, limit: limit, all: true})
    ).done(function(headlineResponse, trainingResponse, eventResponse) {
      var headlines = headlineResponse[0].result;

      var trainings = [];
      if (trainingResponse) {
        trainings = trainingResponse[0].result;
        for (var i = 0; i < trainings.length; i++) {
          trainings[i].type = TYPE_TRAINING;
        }
      }

      var events = [];
      if (eventResponse) {
        events = eventResponse[0].result;
        for (var i = 0; i < events.length; i++) {
          events[i].type = TYPE_EVENT;
        }
      }

      data = [].concat(headlines, trainings, events);
      // Sort by date
      data.sort(function(a, b) {
        return (new Date(b.date)) - (new Date(a.date))
      });
      deferred.resolve(data);
    });
    return deferred.promise();
  }

  function showHeadlineMore() {
    $(".headlines-more").css('opacity', 1);
  }

  function hideHeadlineMore() {
    $(".headlines-more").css('opacity', 0.5);
  }

  function isFetchingData() {
    var status = $(".headlines-more").css('opacity');
    if (parseFloat(status) <= 0.5) return true;
    return false;
  }

  function appendHeadlineContent(element, data) {
    for (var i = 0; i < data.length; i++) {
      var entry = data[i];
      element.append(
        '<div id="entry_' + entry.id + '" class="headline-entry">' +
        '  <div class="headline-entry-type">' +
        '    <div class="headline-entry-type-badge">' + getText(entry.type) + '</div>' +
        '  </div>' +
        '  <div class="headline-entry-content">' + getHeadlineContentBody(entry) + '</div>' +
        '  <div class="headline-entry-date">' + entry.date + '</div>' +
        '</div>'
      );
    }
  }

  function getCurrentShownHeadlineEntry() {
    try {
      var nums = $(".headline-entry").size();
      if (nums > 0) nums--;
      return nums;
    } catch (e) {
      return 0;
    }
  }


  function getIssues(options, success, fail) {
    var lang = options.lang || 'en';
    var limit = options.limit || 50;
    var category = options.category || '';
    $.ajax({
      type: 'GET',
      url: monacaApi.getBaseUrl() + '/' + lang + '/api/issue/list',
      dataType: 'JSON',
      contentType: 'text/plain',
      data: { limit: limit, category: category },
      xhrFields: {
        withCredentials: true
      },
      success: success,
      fail: fail
    });
  }

  function appendIssues(lang, element, data) {
    var result = data.result;
    var timeZone = lang == 'ja' ? 'JST' : 'UTC';
    for (var i = 0; i < result.length; i++) {
      var entry = result[i];
      var shouldOpen = entry.shouldOpen;
      var icon = shouldOpen ? 'ico_tri_downward.png' : 'ico_tri_leftward.png';
      var statusTag = '<span class="status-solved">Solved</span>';
      if (entry.statusCss == 'fixing') {
        statusTag = '<span class="status-fixing">Fixing</span>';
      } else if (entry.statusCss == 'reported') {
        statusTag = '<span class="status-reported">Reported</span>';
      }
      var detailsClass = shouldOpen ? '' : 'display: none;';
      element.append(
        '<div id="entry_' + entry.id + '" class="headline-fault-entry">' +
        '  <div class="headline-entry-toggle"><img src="/img/headline/' + icon + '" /></div>' +
        '  <dl>' +
        '    <dt>' + entry.date + '</dt>' +
        '    <dd>' +
        statusTag +
        '      <span class="headline-entry-comment">' + entry.title + '</span>' +
        '    </dd>' +
        '  </dl>' +
        '  <div class="headline-sub-entries" style="' + detailsClass + '">' +
        (function () {
          if (entry.details && entry.details.length > 0) {
            var result = '';
            for (var j = 0; j < entry.details.length; j++) {
              var detail = entry.details[j];
              result += '<dl>' +
                '  <dt>' + detail.dateTime + ' ' + timeZone + '</dt>' +
                '  <dd>' + detail.description + '</dd>' +
                '</dl>';
            }
            return result;
          }
          return '';
        })() +
        '  </div>' +
        '</div>'
      );
    }
  }

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

/*  monacaPages["/service/training.html"] = function () {
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
  };*/

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

    if (lang === 'en') { return false; }

    return $.ajax({
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

    if (lang === 'en') { return false; }

    return $.ajax({
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
      var text = '<tr id="entry_' + entry.id + '" class="events-entry training-entry">' +
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
