(function () {
    window.monacaPages = window.monacaPages || [];

    monacaPages['/great-apps.html'] = function (loginData) {
        var loadedPage = 0;
        var isLoading = true;
        var isFinalPage = false;
        var $overlay = $('#modal-overlay');
        var $appDetail = $('#app-detail-container');

        // Populate List
        populateFeaturedApps();
        populateAppList();

        $(window).scroll(function () {
            if ($('body').height() <= ($(window).height() + $(window).scrollTop())) {
                if (!isLoading && !isFinalPage) {
                    isLoading = true;
                    populateAppList(loadedPage);
                }
            }
        });

        /*
         * Click Handlers
         */
        $('body').on('click', '.app-detail', getAppDetail);
        $('body').on('click', '.arrow', function () {
            var sign = $(this).is('.left') ? 1 : -1;
            var screen = $appDetail.find('.screen');
            var scroll = screen.scrollLeft();

            scroll -= sign * 200;
            screen.animate({scrollLeft: scroll}, 'slow', 'swing');

            return false;
        });

        $appDetail.on('click', 'a.close', function () {
            $appDetail.fadeOut();
            $overlay.fadeOut();
        });
        $overlay.on('click', function () {
            $appDetail.fadeOut();
            $overlay.fadeOut();
        });

        /*
         * Fetch App List
         */
        function getAppList(data) {
            var lang = window.LANG;
            var url = monacaApi.getBaseUrl() + '/' + lang + '/api/showcase/list';

            var $xhr = $.ajax(url, {
                type: 'GET',
                dataType: 'json',
                contentType: 'text/plain',
                data: data,
                xhrFields: {
                    withCredentials: true
                }
            });

            return $xhr;
        }

        function populateFeaturedApps() {
            var $xhr = getAppList({
                isFeature: true,
                page: 0,
                limit: 3
            });

            var $location = $('#featured');

            $xhr.success(function (response) {
                buildAppList(response, $location);
            });
        }

        function populateAppList(page) {
            var limit = 16;

            var $loading = $('.icn-loading-cases');
            $loading.show();

            var $xhr = getAppList({
                isFeature: false,
                page: page || 0,
                limit: limit
            });

            var $location = $('.app-list');

            $xhr.success(function (response) {
                buildAppList(response, $location);
                loadedPage++;
                isLoading = false;

                if (response.result.length < limit) {
                    isFinalPage = true;
                }

                $loading.hide();
            });
        }

        function buildAppList(response, $location) {
            var apps = response.result;

            apps.forEach(function (app) {
                var $li = $('<li>');
                var $a = $('<a>');
                var $figure = $('<figure>');
                var $img = $('<img>');
                var $pTitle = $('<p>');
                var $pAuthor = $('<p>');

                $li.addClass('borderradius');

                $a.attr({'class': 'casepopup app-detail'});
                $a.data('id', app.id);

                $img.attr('src', app.icon);

                $pTitle.text(app.title);
                $pAuthor.text(app.author);

                $figure.append($img);
                $a.append($figure);
                $a.append($pTitle);
                $a.append($pAuthor);

                $li.append($a);

                $location.append($li);
            });
        }

        /*
         * App Detail Methods
         */
        /**
         *
         * @param evt
         */
        function getAppDetail(evt) {
            if (evt && !evt.target) {
                return;
            }

            var $a = $(evt.target);

            if (evt.target.tagName !== 'A') {
                $a = $(evt.target).closest('a');
            }

            var appId = $a.data('id');
            var lang = window.LANG;
            var url = monacaApi.getBaseUrl() + '/' + lang + '/api/showcase/' + appId;

            var $xhr = $.ajax(url, {
                type: 'GET',
                dataType: 'json',
                contentType: 'text/plain',
                xhrFields: {
                    withCredentials: true
                }
            });

            $xhr.success(function (response) {
                var app = response.result;

                var $detail = $('#app-detail-container');

                $detail.find('.app-icon').attr('src', app.icon);
                $detail.find('.app-title').text(app.title);
                $detail.find('.app-author').text(app.author);
                $detail.find('.app-description').text(app.description);

                createScreenshotList($detail, app.images);
                createAppStoreList($detail, app.store);

                $detail.fadeIn();
                $overlay.fadeIn();
            });

            return $xhr;
        }

        /**
         *
         * @param $detailContainer
         * @param images
         */
        function createScreenshotList($detailContainer, images) {
            $detailContainer.find('.app-screenshots').empty();

            images.forEach(function (url) {
                var $li = $('<li>');
                var $img = $('<img>');

                $img.attr({
                    'class': 'screenshot',
                    src: url,
                    alt: ''
                });

                $li.append($img);
                $detailContainer.find('.app-screenshots').append($li);
            });
        }

        /**
         *
         * @param $detailContainer
         * @param stores
         */
        function createAppStoreList($detailContainer, stores) {
            $detailContainer.find('.app-stores').empty();

            for (var store in stores) {
                var url = stores[store];

                if (url === '') {
                    continue;
                }

                var $li = $('<li>');
                var $a = $('<a>');
                var $img = $('<img>');

                $a = $a.attr({
                    href: url,
                    target: '_blank'
                });

                var storeData = getAppStoreData(store);

                $img.attr({
                    src: storeData.badge,
                    alt: storeData.label
                });

                $a.append($img);
                $li.append($a);
                $detailContainer.find('.app-stores').append($li);
            }
        }

        /**
         *
         * @param store
         * @returns {*}
         */
        function getAppStoreData(store) {
            var data;

            switch (store) {
                case 'apple':
                    data = {
                        label: 'App Store',
                        badge: '/img/great-apps/badge_appstore.png'
                    };
                    break;

                case 'google':
                    data = {
                        label: 'Google Play',
                        badge: '/img/great-apps/badge_googleplay.png'
                    };
                    break;

                default:
                    data = {
                        label: '',
                        badge: ''
                    };
            }

            return data;
        }
    };
})();
