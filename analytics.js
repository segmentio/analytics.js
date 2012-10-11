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

    var isString = function(obj) {
        return Object.prototype.toString.call(obj) === '[object String]';
    };

    var isObject = function(obj) {
        return obj === Object(obj);
    };

    // A helper to resolve a settings object. It allows for `settings` to be an
    // `apiKey` string in the case of no additional settings being needed.
    var resolveSettings = function (settings) {
        if (!isString(settings) && !isObject(settings))
            throw new Error('Encountered unresolvable settings value.');

        if (isString(settings)) {
            var apiKey = settings;
            settings = {};
            settings.apiKey = apiKey;
        }
        return settings;
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
        //             apiKey : 'UA-XXXXXXX-X'
        //         },
        //         'Segment.io' : {
        //             apiKey : 'XXXXXXXXXXX'
        //         },
        //         'KISSmetrics' : {
        //             apiKey : 'XXXXXXXXXXX'
        //         },
        //         Mixpanel : {
        //             apiKey : 'XXXXXXXXXXX',
        //             people : true
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
        //     analytics.identify('user@example.com', {
        //         name : 'Achilles',
        //         age  : 23
        //     });
        //
        // `userId` - the ID you recognize your user by, like an email.
        //
        // `traits` - an optional dictionary of traits to tie your user. Things
        // like *Name*, *Age* or *Friend Count*.
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
        //     analytics.track('Added a Friend', {
        //         level  : 'hard',
        //         volume : 11
        //     });
        //
        // `event` - the name of the event. The best event names are human-
        // readable so that your whole team knows what they are when you analyze
        // your data.
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


    // Google Analytics
    // ----------------
    // _Last updated: September 27th, 2012_
    //
    // https://developers.google.com/analytics/devguides/collection/gajs/

    availableProviders['Google Analytics'] = {

        // Changes to the Google Analytics snippet:
        //
        // * Add `apiKey` to call to `_setAccount`.
        initialize : function (settings) {
            this.settings = resolveSettings(settings);

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
    // _Last updated: September 27th, 2012_
    //
    // https://segment.io/docs/javascript-api

    availableProviders['Segment.io'] = {

        // Changes to the Segemnt.io snippet:
        //
        // * Add `apiKey` and `settings` args to call to `initialize`.
        initialize : function (settings) {
            this.settings = resolveSettings(settings);

            var segment=segment||[];segment.load=function(a){var b=document.createElement("script");b.type="text/javascript";b.async=!0;b.src=a;a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(b,a);b=function(a){return function(){segment.push([a].concat(Array.prototype.slice.call(arguments,0)))}};a="init initialize identify track callback logLevel verbose".split(" ");for(i=0;i<a.length;i++)segment[a[i]]=b(a[i])};segment.load(("https:"===document.location.protocol?"https://":"http://")+"d47xnnr8b1rki.cloudfront.net/api/js/v2/segmentio.js");
            segment.initialize(settings.apiKey, settings);

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
    // _Last updated: September 27th, 2012_
    //
    // http://support.kissmetrics.com/apis/javascript

    availableProviders['KISSmetrics'] = {

        // Changes to the KISSmetrics snippet:
        //
        // * Concatenate in the `apiKey`.
        initialize : function (settings) {
            this.settings = resolveSettings(settings);

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

            window._kmq = _kmq;
        },

        // KISSmetrics uses two separate methods: `identify` for storing the
        // `userId` and `set` for storing `traits`.
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
    // _Last updated: September 27th, 2012_
    //
    // https://mixpanel.com/docs/integration-libraries/javascript
    // https://mixpanel.com/docs/people-analytics/javascript
    // https://mixpanel.com/docs/integration-libraries/javascript-full-api

    availableProviders['Mixpanel'] = {

        // Changes to the Mixpanel snippet:
        //
        // * Use window for call to `init`.
        // * Add `apiKey` and `settings` args to call to `init`.
        //
        // Also, we don't need to set the `mixpanel` object on `window` because
        // they already do that.
        initialize : function (settings) {
            this.settings = resolveSettings(settings);

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
        },


        // Only identify with Mixpanel's People feature if you opt-in because
        // otherwise Mixpanel charges you for it.
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
    // _Last updated: September 27th, 2012_

    availableProviders['Intercom'] = {

        // Intercom identifies when the script is loaded, so instead of
        // initializing in `initialize`, we have to initialize in `identify`.
        initialize: function (settings) {
            this.settings = resolveSettings(settings);
        },

        // Changes to the Intercom snippet:
        //
        // * Add `apiKey` from stored `settings`.
        // * Add `userId`.
        // * Add a unix timestamp.
        identify: function (userId, traits) {
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
        }
    };


    // Olark
    // -----
    // _Last updated: October 11th, 2012_

    availableProviders['Olark'] = {

        // Changes to the Olark snippet:
        //
        // * Removed `CDATA` tags.
        // * Add `apiKey` from stored `settings`.
        // * Added `window.` before `olark.identify`.
        initialize : function (settings) {
            this.settings = resolveSettings(settings);

            window.olark||(function(c){var f=window,d=document,l=f.location.protocol=="https:"?"https:":"http:",z=c.name,r="load";var nt=function(){f[z]=function(){(a.s=a.s||[]).push(arguments)};var a=f[z]._={},q=c.methods.length;while(q--){(function(n){f[z][n]=function(){f[z]("call",n,arguments)}})(c.methods[q])}a.l=c.loader;a.i=nt;a.p={0:+new Date};a.P=function(u){a.p[u]=new Date-a.p[0]};function s(){a.P(r);f[z](r)}f.addEventListener?f.addEventListener(r,s,false):f.attachEvent("on"+r,s);var ld=function(){function p(hd){hd="head";return["<",hd,"></",hd,"><",i,' onl' + 'oad="var d=',g,";d.getElementsByTagName('head')[0].",j,"(d.",h,"('script')).",k,"='",l,"//",a.l,"'",'"',"></",i,">"].join("")}var i="body",m=d[i];if(!m){return setTimeout(ld,100)}a.P(1);var j="appendChild",h="createElement",k="src",n=d[h]("div"),v=n[j](d[h](z)),b=d[h]("iframe"),g="document",e="domain",o;n.style.display="none";m.insertBefore(n,m.firstChild).id=z;b.frameBorder="0";b.id=z+"-loader";if(/MSIE[ ]+6/.test(navigator.userAgent)){b.src="javascript:false"}b.allowTransparency="true";v[j](b);try{b.contentWindow[g].open()}catch(w){c[e]=d[e];o="javascript:var d="+g+".open();d.domain='"+d.domain+"';";b[k]=o+"void(0);"}try{var t=b.contentWindow[g];t.write(p());t.close()}catch(x){b[k]=o+'d.write("'+p().replace(/"/g,String.fromCharCode(92)+'"')+'");d.close();'}a.P(2)};ld()};nt()})({loader: "static.olark.com/jsclient/loader0.js",name:"olark",methods:["configure","extend","declare","identify"]});
            window.olark.identify(settings.apiKey);
        },

        identify : function (userId, traits) {
            window.olark('api.chat.updateVisitorNickname', {
                snippet : userId
            });
        },

        track : function (event, properties) {
            if (!this.settings.track) return;

            window.olark('api.chat.sendNotificationToOperator', {
                body : 'Visitor triggered "'+event+'".'
            });
        }

    };


}).call(this);