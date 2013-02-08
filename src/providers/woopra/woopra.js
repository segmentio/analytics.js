// Woopra
// ------
// [Documentation](http://www.woopra.com/docs/setup/javascript-tracking/).

analytics.addProvider('Woopra', {

    settings : {
        domain : null
    },


    // Initialize
    // ----------

    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'domain');
        analytics.utils.extend(this.settings, settings);

        var self = this;
        window.woopraReady = function (tracker) {
            tracker.setDomain(self.settings.domain);
            tracker.setIdleTimeout(300000);
            tracker.track();
            return false;
        };

        (function(){
            var wsc = document.createElement('script');
            wsc.type = 'text/javascript';
            var protocol = ('https:' === document.location.protocol) ? 'https:' : 'http:';
            wsc.src = protocol + '//static.woopra.com/js/woopra.js';
            wsc.async = true;
            var ssc = document.getElementsByTagName('script')[0];
            ssc.parentNode.insertBefore(wsc, ssc);
        })();
    },


    // Identify
    // --------

    identify : function (userId, traits) {
        // TODO - we need the cookie solution, because Woopra is one of those
        // that requires identify to happen before the script is requested.
    },


    // Track
    // -----

    track : function (event, properties) {
        // We aren't guaranteed a tracker.
        if (!window.woopraTracker) return;

        // Woopra takes its event as dictionaries with the `name` key.
        var settings = {};
        settings.name = event;

        // If we have properties, add them to the settings.
        if (properties) settings = analytics.utils.extend({}, properties, settings);

        window.woopraTracker.pushEvent(settings);
    }

});


