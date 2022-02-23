(function () {
    // Create a dummy analytics object until real loaded
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

    // Load analytics async
    analytics.load = function (apiKey) {
        if (document.getElementById('dreamdata-analytics')) return;

        // We make a copy if our dummy object
        window.a = window.analytics;
        var script = document.createElement('script');
        script.async = true;
        script.id = 'dreamdata-analytics';
        script.type = 'text/javascript';
        script.src = 'https://cdn.dreamdata.cloud/scripts/analytics/v1/dreamdata.min.js';

        var onAnalyticsLoad = function () {
            if (analytics && analytics.initialize) {
                analytics.initialize({ 'Dreamdata.io': { apiKey: apiKey } });
                // Now copy whatever we applied to our dummy object to the real analytics
                while (window.a.length > 0) {
                    var item = window.a.shift();
                    var method = item.shift();
                    if (analytics[method]) analytics[method].apply(analytics, item);
                }
            }
        };

        if (script.addEventListener) {
            script.addEventListener(
                'load',
                function () {
                    onAnalyticsLoad();
                },
                false
            );
        } else {
            //IE8
            script.onreadystatechange = function () {
                if (this.readyState == 'complete' || this.readyState == 'loaded') {
                    onAnalyticsLoad();
                }
            };
        }
        var first = document.getElementsByTagName('script')[0];
        first.parentNode.insertBefore(script, first);
    };

    analytics.load('<API_KEY>');

    analytics.page();
})();
