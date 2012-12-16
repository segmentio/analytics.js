// [Documentation](https://www.klaviyo.com/docs).
// [Documentation](https://www.klaviyo.com/docs/http-api).

analytics.addProvider('Klaviyo', {

    settings : {
        apiKey : null
    },


    // Initialize
    // ----------

    // Changes to the Google Analytics snippet:
    //
    // * Added `apiKey`.
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


    // Identify
    // --------

    identify : function (userId, traits) {
        // Klaviyo takes the user ID on the traits object itself.
        traits || (traits = {});
        if (userId) traits.$id = userId;

        window._learnq.push(['identify', traits]);
    },


    // Track
    // -----

    track : function (event, properties) {
        window._learnq.push(['track', event, properties]);
    }

});


