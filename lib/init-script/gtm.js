// @ts-nocheck
(function () {
    window.analytics || (window.analytics = []);
    window.analytics.methods = [
        'identify',
        'track',
        'trackLink',
        'trackForm',
        'trackClick',
        'trackSubmit',
        'page',
        'pageview',
        'ab',
        'alias',
        'ready',
        'group',
        'on',
        'once',
        'off'
    ];

    window.analytics.factory = function (method) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            args.unshift(method);
            window.analytics.push(args);
            return window.analytics;
        };
    };

    for (var i = 0; i < window.analytics.methods.length; i++) {
        var method = window.analytics.methods[i];
        window.analytics[method] = window.analytics.factory(method);
    }

    analytics.load = (function (apiKey) {
        if (document.getElementById('dreamdata-analytics')) {
            return;
        }

        window.__DD_TEMP_ANALYTICS__ = Object.assign({}, window.analytics);
        var script = document.createElement('script');

        if (!script.addEventListener) {
            return;
        }

        script.async = true;
        script.id = 'dreamdata-analytics';
        script.type = 'text/javascript';
        script.src = 'https://cdn.dreamdata.cloud/scripts/analytics/v1/dreamdata.min.js';

        script.addEventListener(
            'load',
            function () {
                if (analytics && analytics.initialize) {
                    analytics.initialize({ 'Dreamdata.io': { apiKey: apiKey } });
                    while (window.__DD_TEMP_ANALYTICS__.length > 0) {
                        var item = window.__DD_TEMP_ANALYTICS__.shift();
                        var method = item.shift();

                        if (analytics[method]) {
                            analytics[method].apply(analytics, item);
                        }
                    }
                }
                delete window.__DD_TEMP_ANALYTICS__;
                analytics.page();
            },
            false
        );

        var first = document.getElementsByTagName('script')[0];
        first.parentNode.insertBefore(script, first);
    })('<API_KEY>');
})();
