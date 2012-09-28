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
        // ==========

        // Call **initialize** to setup analytics.js before identifying or
        // tracking any users or events. It takes a list of providers that you
        // want to enable, along with settings for each provider. (Settings vary
        // depending on the provider.) Here's what a call to **initialize**
        // might look like:
        //
        //     analytics.initialize({
        //         'Google Analytics' : {
        //             apiKey : 'TEST'
        //         },
        //         'Segment.io' : {
        //             apiKey      : 'TEST',
        //             environment : 'production'
        //         }
        //     });
        //
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
        // ========

        // Identifying a user ties all of their actions to an ID you recognize
        // and records properties about a user. An example identify:
        //
        //     analytics.identify('user', {
        //         name : 'Achilles',
        //         age  : 23
        //     });
        //
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
        // =====

        // Whenever a visitor triggers an event on your site that you're
        // interested in, you'll want to track it. An example track:
        //
        //     analytics.track('party', {
        //         level  : 'hard',
        //         volume : 11
        //     });
        //
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
        }

    };




    // Providers
    // =========

    // **Remove** the providers you don't want to use.


    // Google Analytics
    // ----------------
    // https://developers.google.com/analytics/devguides/collection/gajs/
    // Last updated: September 27th, 2012

    availableProviders['Google Analytics'] = {

        initialize : function (settings) {
            this.settings = settings;

            // Start Google Analytics snippet. Changes:
            // * Add API to `_setAccount`.
            var _gaq = _gaq || [];
            _gaq.push(['_setAccount', settings.apiKey]);
            _gaq.push(['_trackPageview']);

            (function() {
                var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
                ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
            })();
            // End Google Analytics snippet.

            window._gaq = _gaq;
        },

        track : function (event, properties) {
            window._gaq.push(['_trackEvent', 'All', event]);
        }
    };


    // Segment.io
    // ----------
    // https://segment.io/docs/javascript-api
    // Last updated: September 27th, 2012

    availableProviders['Segment.io'] = {

        initialize : function (settings) {
            this.settings = settings;

            // Start Segment.io snippet. Changes:
            // * Add API key and settings to init.
            var segment=segment||[];segment.load=function(a){var b=document.createElement("script");b.type="text/javascript";b.async=!0;b.src=a;a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(b,a);b=function(a){return function(){segment.push([a].concat(Array.prototype.slice.call(arguments,0)))}};a="init initialize identify track callback logLevel verbose".split(" ");for(i=0;i<a.length;i++)segment[a[i]]=b(a[i])};segment.load(("https:"===document.location.protocol?"https://":"http://")+"d47xnnr8b1rki.cloudfront.net/api/js/v2/segmentio.js");
            segment.initialize(settings.apiKey, settings);
            // End Segment.io snippet.

            window.segment = segment;
        },

        identify : function (userId, traits) {
            window.segment.identify(userId, traits);
        },

        track : function (event, properties) {
            window.segment.track(event, properties);
        }
    };


    // KISSmetrics
    // -----------
    // http://support.kissmetrics.com/apis/javascript
    // Last updated: September 27th, 2012

    availableProviders['KISSmetrics'] = {

        initialize : function (settings) {
            this.settings = settings;

            // Start KISSmetrics snippet. Changes:
            // * Concatenate in API key.
            var _kmq = _kmq || [];
            function _kms(u){
                setTimeout(function(){
                    var d = document, f = d.getElementsByTagName('script')[0],
                    s = d.createElement('script');
                    s.type = 'text/javascript'; s.async = true; s.src = u;
                    f.parentNode.insertBefore(s, f);
                }, 1);
            }
            _kms('//i.kissmetrics.com/i.js');
            _kms('//doug1izaerwt3.cloudfront.net/'+ settings.apiKey +'.1.js'); // Add API key from settings.
            // End KISSmetrics snippet.

            window._kmq = _kmq;
        },

        // KISSmetrics uses two separate methods for storing ID and traits.
        identify : function (userId, traits) {
            window._kmq.push(['identify', userId]);
            window._kmq.push(['set', traits]);
        },

        track : function (event, properties) {
            window._kmq.push(['record', event, properties]);
        }
    };


    // Mixpanel
    // --------
    // https://mixpanel.com/docs/integration-libraries/javascript
    // https://mixpanel.com/docs/people-analytics/javascript
    // https://mixpanel.com/docs/integration-libraries/javascript-full-api
    // Last updated: September 27th, 2012

    availableProviders['Mixpanel'] = {

        initialize : function (settings) {
            this.settings = settings;

            // Start Mixpanel snippet. Changes:
            // * Use window for call to `init`.
            // * Add API key and settings to `init`.
            (function(c,a){window.mixpanel=a;var b,d,h,e;b=c.createElement("script");
            b.type="text/javascript";b.async=!0;b.src=("https:"===c.location.protocol?"https:":"http:")+
            '//cdn.mxpnl.com/libs/mixpanel-2.1.min.js';d=c.getElementsByTagName("script")[0];
            d.parentNode.insertBefore(b,d);a._i=[];a.init=function(b,c,f){function d(a,b){
            var c=b.split(".");2==c.length&&(a=a[c[0]],b=c[1]);a[b]=function(){a.push([b].concat(
            Array.prototype.slice.call(arguments,0)))}}var g=a;"undefined"!==typeof f?g=a[f]=[]:
            f="mixpanel";g.people=g.people||[];h=['disable','track','track_pageview','track_links',
            'track_forms','register','register_once','unregister','identify','name_tag',
            'set_config','people.identify','people.set','people.increment'];for(e=0;e<h.length;e++)d(g,h[e]);
            a._i.push([b,c,f])};a.__SV=1.1;})(document,window.mixpanel||[]);
            window.mixpanel.init(settings.apiKey, settings);
            // End Mixpanel Snippet
        },


        // Only use Mixpanel People if you opt-in because otherwise Mixpanel
        // charges you for it.
        identify : function (userId, traits) {
            window.mixpanel.identify(userId);
            window.mixpanel.name_tag(userId);
            window.mixpanel.register(traits);

            if (this.settings.people === true) {
                window.mixpanel.people.identify(userId);
                window.mixpanel.people.set(traits);
            }
        },

        track : function (event, properties) {
            window.mixpanel.track(event, properties);
        }
    };


    // Intercom
    // --------
    // Last updated: September 27th, 2012

    availableProviders['Intercom'] = {

        // Intercom identifies when the script is loaded, so instead of
        // initializing in `initialize`, we have to initialize in `identify`.
        initialize: function (settings) {
            this.settings = settings;
        },

        identify: function (userId, traits) {
            // Start Intercom snippet. Changes:
            // * Add apiKey from settings.
            // * Add userId.
            // * Add a unix timestamp.
            window.intercomSettings = {
                app_id     : this.settings.apiKey,
                email      : userId,
                created_at : Math.round((new Date()).getTime() / 1000)
            };

            function async_load() {
                var s = document.createElement('script');
                s.type = 'text/javascript'; s.async = true;
                s.src = 'https://api.intercom.io/api/js/library.js';
                var x = document.getElementsByTagName('script')[0];
                x.parentNode.insertBefore(s, x);
            }
            if (window.attachEvent) {
                window.attachEvent('onload', async_load);
            } else {
                window.addEventListener('load', async_load, false);
            }
            // End Intercom snippet.
        }
    };

}).call(this);