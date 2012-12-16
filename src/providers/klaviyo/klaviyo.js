// Klaviyo
// --------
// Last updated: December 12th, 2012
// [Documentation](https://www.klaviyo.com/docs).
// [Documentation](https://www.klaviyo.com/docs/http-api).

analytics.addProvider('Klaviyo', {

    settings : {
        apiKey : null
    },

    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'apiKey');
        analytics.utils.extend(this.settings, settings);

        var _learnq = _learnq || [];
        _learnq.push(['account', this.settings.apiKey]);
        (function () {
            var b = document.createElement('script'); b.type = 'text/javascript'; b.async = true;
            b.src = ('https:' == document.location.protocol ? 'https://' : 'http://') +
                'a.klaviyo.com/media/js/learnmarklet.js';
            var a = document.getElementsByTagName('script')[0]; a.parentNode.insertBefore(b, a);
        })();

        window._learnq = _learnq;
    },

    identify : function (userId, traits) {
        traits || (traits = {});

        // Klaviyo takes the user ID on the traits object itself.
        if (userId) traits.$id = userId;

        window._learnq.push(['identify', traits]);
    },

    track : function (event, properties) {
        window._learnq.push(['track', event, properties]);
    }

});


