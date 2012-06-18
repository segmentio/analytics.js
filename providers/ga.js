
var GOOGLE_ANALYTICS  = {

    settings: {
        apiKey: '[YOUR API KEY HERE ex. UA-23854873-1]'
    },

    setup: function (settings) {
        var _gaq = _gaq || [];

        _gaq.push(['_setAccount', settings.apiKey]);
        _gaq.push(['_trackPageview']);
        (function() {
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        })();

        window._gaq = _gaq;
    },

    identify: function(visitorId, traits) {
        // Only identifies the first 5 traits
        var i = 1;
        for (var key in traits) {
            if (i > 5) {
                return;
            }
            window._gaq.push(['_setCustomVar', i, key, traits[key], 1]);
            i++;
        }
    },

    track: function (event, properties) {

        window._gaq.push(['_trackEvent', 'All', event]);

    }
};