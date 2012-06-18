

window.analytics = (function () {

    //
    // TODO: add new URLs here
    //


    var GOOGLE_ANALYTICS  = {

        settings: {
            apiKey: '[ADD YOUR GA API KEY HERE UA-32715813-1]'
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


    var SEGMENT_IO = {

        settings: {
            apiKey: '[TODO ADD YOUR API KEY HERE ex. o22u6ffh81f]',
            environment: 'production'
        },

        setup: function (settings) {
            var seg=seg||[];seg.load=function(a){var b,c,d,e,f,g=document;b=g.createElement("script"),b.type="text/javascript",b.async=!0,b.src=a,c=g.getElementsByTagName("script")[0],c.parentNode.insertBefore(b,c),d=function(a){return function(){seg.push([a].concat(Array.prototype.slice.call(arguments,0)))}},e=["init","identify","track","callback","verbose"];for(f=0;f<e.length;f+=1)seg[e[f]]=d(e[f])};

            window.seg=seg;

            seg.load(document.location.protocol+'//d47xnnr8b1rki.cloudfront.net/api/js/v2/segmentio.js');

            window.seg.verbose(true);

            window.seg.init(settings.apiKey, settings.environment);
        },

        identify: function (visitorId, traits) {
            window.seg.identify(visitorId, traits);
        },

        track: function (event, properties) {
            window.seg.track(event, properties);
        }

    };



    var analytics = {

        /**
         * Determines whether analytics is enabled in this session
         * @type {Boolean}
         */
        enabled: true,

        //
        // ADD PROVIDERS HERE
        //

        providers: [

            GOOGLE_ANALYTICS,
            SEGMENT_IO

        ]
    };


    if (analytics.enabled) {

        // if we're enabled, add all the providers provided above

        for (var i = 0; i < analytics.providers.length; i += 1) {

            var provider = analytics.providers[i];

            if (provider.setup) {
                provider.setup(provider.settings);
            }
        }
    }

    /**
     * Identifying a user ties all of their actions to an ID you recognize
     * and records user traits.
     * @param  {[type]} visitorId   A visitor ID that you recognize
     * @param  {[type]} traits      a dictionary with keys like
     * { “Subscription Plan”: "Free", "Age": 22} that describes properties
     * unique to this visitor. These are not events.
    */
    analytics.identify = function (visitorId, traits) {

        if (analytics.enabled) {

            for (var i = 0; i < analytics.providers.length; i += 1) {

                var provider = analytics.providers[i];

                if (provider.identify) {
                    var cloned = $.extend({}, traits, true);
                    provider.identify(visitorId, cloned);
                }
            }
        }
    };

    /**
     * Whenever a visitor does an event on your site, you'll want to track it.
     * @param  {[type]} event      A human friendly name identifying this event
     * such as "Bought a T-Shirt" or "Zoomed-in on graph"
     * @param  {[type]} properties a dictionary with items that describe the
     * event in more detail. This argument is optional, but highly
     * recommended—you’ll find these properties extremely useful later.
     */
    analytics.track = function (event, properties) {

        if (analytics.enabled) {

            for (var i = 0; i < analytics.providers.length; i += 1) {
                var provider = analytics.providers[i];

                if (provider.track) {
                    var cloned = $.extend({}, properties, true);
                    provider.track(event, cloned);
                }

            }
        }
    };

    return analytics;

}());

