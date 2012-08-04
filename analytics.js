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


    // Segment.io
    // ----------

    availableProviders['Segment.io'] = {

        initialize : function (settings) {
            var seg=seg||[];seg.load=function(a){var b,c,d,e,f,g=document;b=g.createElement("script"),b.type="text/javascript",b.async=!0,b.src=a,c=g.getElementsByTagName("script")[0],c.parentNode.insertBefore(b,c),d=function(a){return function(){seg.push([a].concat(Array.prototype.slice.call(arguments,0)))}},e=["init","identify","track","callback","verbose"];for(f=0;f<e.length;f+=1)seg[e[f]]=d(e[f])};
            window.seg=seg;
            seg.load(document.location.protocol+'//d47xnnr8b1rki.cloudfront.net/api/js/v2/segmentio.js');
            window.seg.verbose(true);
            window.seg.init(settings.apiKey, settings.environment);
        },

        identify : function (userId, traits) {
            window.seg.identify(userId, traits);
        },

        track : function (event, properties) {
            window.seg.track(event, properties);
        }
    };


    // KissMetrics
    // -----------

    availableProviders['KissMetrics'] = {

        initialize : function (settings) {
            var _kmq = _kmq || [];
            window._kmq = _kmq;
            function _kms(u){
                setTimeout(function(){
                    var d = document, f = d.getElementsByTagName('script')[0],
                    s = d.createElement('script');
                    s.type = 'text/javascript'; s.async = true; s.src = u;
                    f.parentNode.insertBefore(s, f);
                }, 1);
            }
            _kms('//i.kissmetrics.com/i.js');
            _kms('//doug1izaerwt3.cloudfront.net/' + settings.apiKey + '.1.js');
            _kmq.push(['record', 'Viewed page']);
        },

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

    availableProviders['Mixpanel'] = {

        usePeople : false,

        initialize : function (settings) {
            (function(d,c){var a,b,g,e;a=d.createElement("script");a.type="text/javascript";a.async=!0;a.src=("https:"===d.location.protocol?"https:":"http:")+'//api.mixpanel.com/site_media/js/api/mixpanel.2.js';b=d.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b);c._i=[];c.init=function(a,d,f){var b=c;"undefined"!==typeof f?b=c[f]=[]:f="mixpanel";g="disable track track_pageview track_links track_forms register register_once unregister identify name_tag set_config".split(" ");
            for(e=0;e<g.length;e++)(function(a){b[a]=function(){b.push([a].concat(Array.prototype.slice.call(arguments,0)))}})(g[e]);c._i.push([a,d,f])};window.mixpanel=c})(document,[]);
            window.mixpanel.init(settings.apiKey);
        },

        identify : function (userId, traits) {
            window.mixpanel.identify(userId);
            window.mixpanel.register(traits);
            if (this.usePeople) window.mixpanel.people.set(traits);
        },

        track : function (event, properties) {
            window.mixpanel.track(event, properties);
        }
    };


    // Intercom
    // --------

    availableProviders['Intercom'] = {

        _settings : {},

        initialize: function (settings) {
            this._settings = settings;
        },

        identify: function (visitorId, traits) {
            window.intercomSettings = {
                app_id     : this._settings.appId,
                email      : visitorId,
                created_at : (new Date()).getTime()
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
        }
    };

}).call(this);