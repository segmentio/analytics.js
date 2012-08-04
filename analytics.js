(function () {
    // A reference to the global object.
    var root = this;
    // A list of available providers that _can_ be initialized by you.
    var availableProviders = {};
    // Whether analytics.js has been initialized.
    var initialized = false;

    // A helper to shallow-ly clone objects, so that they don't get mangled or
    // added to by different analytics providers because of the reference.
    var clone = function (obj) {
        if (!obj) return;
        var clone = {};
        for (var prop in obj) clone[prop] = obj[prop];
        return clone;
    };

    // The `analytics` object that will be exposed to you on the global object.
    root.analytics = {

        // A list of providers that have been initialized.
        providers : [],


        // Initialize
        // ----------

        // Call **initialize** to setup analytics.js before identifying or
        // tracking any users or events. It takes a list of providers that you
        // want to enable, along with settings for each provider. (Settings vary
        // depending on the provider.)

        // `providers` - a dictionary of the providers you want to enabled. The
        // keys are the names of the providers and their values are the settings
        // they get passed on initialization.
        initialize : function (providers) {
            var initializedProviders = [];
            for (var key in providers) {
                if (!availableProviders[key]) throw new Error('Couldn\'t find a provider named "'+key+'"');
                availableProviders[key].initialize(providers[key]);
                initializedProviders.push(availableProviders[key]);
            }
            this.providers = initializedProviders;
            initialized = true;
        },


        // Identify
        // --------

        // Identifying a user ties all of their actions to an ID you recognize
        // and records properties about a user.

        // `userId` - the ID you recognize your user by, like an email.
        //
        // `traits` - an optional dictionary of properties to tie to a user.
        identify : function (userId, traits) {
            if (!initialized) return;
            for (var i = 0, provider; provider = this.providers[i]; i++) {
                if (!provider.identify) continue;
                var clonedTraits = clone(traits);
                provider.identify(userId, clonedTraits);
            }
        },


        // Track
        // -----

        // Whenever a visitor triggers an event on your site that you're
        // interested in, you'll want to track it.

        // `event` - the name of the event.
        //
        // `properties` - an optional dictionary of properties of the event.
        track : function (event, properties) {
            if (!initialized) return;
            for (var i = 0, provider; provider = this.providers[i]; i++) {
                if (!provider.track) continue;
                var clonedProperties = clone(properties);
                provider.track(event, clonedProperties);
            }
        },


        // A/B
        // ---

        // To record which variation of an A/B test a user saw so you can figure
        // out which variation performs better.

        // `test` - the name of the test.
        //
        // `variation` - the name of the variation the user saw.
        ab : function (test, variation) {
            if (!initialized) return;
            for (var i = 0, provider; provider = this.providers[i]; i++) {
                if (!provider.ab) continue;
                provider.ab(test, variation);
            }
        }
    };












    // TODO: Add these in by build script instead.

    availableProviders['Google Analytics'] = {
        initialize : function (settings) {
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

        track : function (event, properties) {
            window._gaq.push(['_trackEvent', 'All', event]);
        }
    };

    availableProviders['Segment.io'] = {
        initialize : function (settings) {
            var seg=seg||[];seg.load=function(a){var b,c,d,e,f,g=document;b=g.createElement("script"),b.type="text/javascript",b.async=!0,b.src=a,c=g.getElementsByTagName("script")[0],c.parentNode.insertBefore(b,c),d=function(a){return function(){seg.push([a].concat(Array.prototype.slice.call(arguments,0)))}},e=["init","identify","track","callback","verbose"];for(f=0;f<e.length;f+=1)seg[e[f]]=d(e[f])};
            window.seg=seg;
            seg.load(document.location.protocol+'//d47xnnr8b1rki.cloudfront.net/api/js/v2/segmentio.js');
            window.seg.verbose(true);
            window.seg.init(settings.apiKey, settings.environment);
        },

        identify: function (userId, traits) {
            window.seg.identify(userId, traits);
        },

        track: function (event, properties) {
            window.seg.track(event, properties);
        }
    };

}).call(this);