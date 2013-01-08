//     Analytics.js 0.2.5

//     (c) 2013 Segment.io Inc.
//     Analytics.js may be freely distributed under the MIT license.

(function () {

    // Setup
    // -----

    // The `analytics` object that will be exposed to you on the global object.
    var analytics = {

        // Cache the `userId` when a user is identified.
        userId : null,

        // Store the date when the page loaded, for services that depend on it.
        date : new Date(),

        // Store window.onload state so that analytics that rely on it can be loaded
        // even after onload fires.
        loaded : false,

        // Whether analytics.js has been initialized with providers.
        initialized : false,


        // Providers
        // ---------

        // A dictionary of analytics providers that _can_ be initialized.
        initializableProviders : {},

        // An array of analytics providers that are initialized.
        providers : [],

        // Adds a provider to the list of available providers that can be
        // initialized.
        addProvider : function (name, provider) {
            this.initializableProviders[name] = provider;
        },


        // Initialize
        // ----------

        // Call **initialize** to setup analytics.js before identifying or
        // tracking any users or events. Here's what a call to **initialize**
        // might look like:
        //
        //     analytics.initialize({
        //         'Google Analytics' : 'UA-XXXXXXX-X',
        //         'Segment.io'       : 'XXXXXXXXXXX',
        //         'KISSmetrics'      : 'XXXXXXXXXXX'
        //     });
        //
        // * `providers` is a dictionary of the providers you want to enabled.
        // The keys are the names of the providers and their values are either
        // an api key, or dictionary of extra settings (including the api key).
        initialize : function (providers) {
            // Reset our state.
            this.providers = [];
            this.userId = null;

            // Initialize each provider with the proper settings, and copy the
            // provider into `this.providers`.
            for (var key in providers) {
                var provider = this.initializableProviders[key];
                var settings = providers[key];
                if (!provider) throw new Error('Could not find a provider named "'+key+'"');
                provider.initialize(settings);
                this.providers.push(provider);
            }

            // Update the initialized state that other methods rely on.
            this.initialized = true;

            // Try to use id and event parameters from the url
            var userId = this.utils.getUrlParameter(window.location.search, 'ajs_uid');
            if (userId) this.identify(userId);
            var event = this.utils.getUrlParameter(window.location.search, 'ajs_event');
            if (event) this.track(event);
        },


        // Identify
        // --------

        // Identifying a user ties all of their actions to an ID you recognize
        // and records properties about a user. An example identify:
        //
        //     analytics.identify('4d3ed089fb60ab534684b7e0', {
        //         name  : 'Achilles',
        //         email : 'achilles@segment.io',
        //         age   : 23
        //     });
        //
        // * `userId` (optional) is the ID you know the user by. Ideally this
        // isn't an email, because the user might be able to change their email
        // and you don't want that to affect your analytics.
        // * `traits` (optional) is a dictionary of traits to tie your user.
        // Things like `name`, `age` or `friendCount`. If you have them, you
        // should always store a `name` and `email`.
        identify : function (userId, traits) {
            if (!this.initialized) return;

            // Allow for identifying traits without setting a `userId`, for
            // anonymous users whose traits you learn.
            if (this.utils.isObject(userId)) {
                traits = userId;
                userId = null;
            }

            // Cache the `userId`, or use saved one.
            if (userId !== null)
                this.userId = userId;
            else
                userId = this.userId;

            // Call `identify` on all of our enabled providers that support it.
            for (var i = 0, provider; provider = this.providers[i]; i++) {
                if (!provider.identify) continue;
                provider.identify(userId, this.utils.clone(traits));
            }
        },


        // Track
        // -----

        // Whenever a visitor triggers an event on your site that you're
        // interested in, you'll want to track it. An example track:
        //
        //     analytics.track('Added a Friend', {
        //         level  : 'hard',
        //         volume : 11
        //     });
        //
        // * `event` is the name of the event. The best names are human-readable
        // so that your whole team knows what they mean when they analyze your
        // data.
        // * `properties` (optional) is a dictionary of properties of the event.
        // Property keys are all camelCase (we'll alias to non-camelCase for
        // you automatically for providers that require it).
        track : function (event, properties) {
            if (!this.initialized) return;

            // Call `track` on all of our enabled providers that support it.
            for (var i = 0, provider; provider = this.providers[i]; i++) {
                if (!provider.track) continue;
                provider.track(event, this.utils.clone(properties));
            }
        },


        // Pageview
        // --------

        // For single-page applications where real page loads don't happen, the
        // **pageview** method simulates a page loading event for all providers
        // that track pageviews and support it. This is the equivalent of
        // calling `_gaq.push(['trackPageview'])` in Google Analytics.
        //
        // **pageview** is _not_ for sending events about which pages in your
        // app the user has loaded. For that, use a regular track call like:
        // `analytics.track('View Signup Page')`. Or, if you think you've come
        // up with a badass abstraction, submit a pull request!
        pageview : function () {
            if (!this.initialized) return;

            // Call `pageview` on all of our enabled providers that support it.
            for (var i = 0, provider; provider = this.providers[i]; i++) {
                if (!provider.pageview) continue;
                provider.pageview();
            }
        },


        // Utils
        // -----

        utils : {

            // Given a timestamp, return its value in seconds. For providers
            // that rely on Unix time instead of millis.
            getSeconds : function (time) {
                return Math.floor((new Date(time)) / 1000);
            },

            // A helper to shallow-ly clone objects, so that they don't get
            // mangled by different analytics providers because of the
            // reference.
            clone : function (obj) {
                if (!obj) return;
                var clone = {};
                for (var prop in obj) clone[prop] = obj[prop];
                return clone;
            },

            // A helper to extend objects with properties from other objects.
            // Based off of the [underscore](https://github.com/documentcloud/underscore/blob/master/underscore.js#L763)
            // method.
            extend : function (obj) {
                var args = Array.prototype.slice.call(arguments, 1);
                for (var i = 0, source; source = args[i]; i++) {
                    for (var property in source) {
                        obj[property] = source[property];
                    }
                }
                return obj;
            },

            // A helper to alias certain object's keys to different key names.
            // Useful for abstracting over providers that require specific key
            // names.
            alias : function (obj, aliases) {
                for (var prop in aliases) {
                    var alias = aliases[prop];
                    if (obj[prop] !== undefined) {
                        obj[alias] = obj[prop];
                        delete obj[prop];
                    }
                }
            },

            // Type detection helpers, copied from
            // [underscore](https://github.com/documentcloud/underscore/blob/master/underscore.js#L928-L938).
            isObject : function (obj) {
                return obj === Object(obj);
            },
            isString : function (obj) {
                return Object.prototype.toString.call(obj) === '[object String]';
            },
            isFunction : function (obj) {
                return Object.prototype.toString.call(obj) === '[object Function]';
            },
            isNumber : function (obj) {
                return Object.prototype.toString.call(obj) === '[object Number]';
            },

            // Email detection helper to loosely validate emails.
            isEmail : function (string) {
                return (/.+\@.+\..+/).test(string);
            },

            // A helper to resolve a settings object. It allows for `settings`
            // to be a string in the case of using the shorthand where just an
            // api key is passed. `fieldName` is what the provider calls their
            // api key.
            resolveSettings : function (settings, fieldName) {
                if (!this.isString(settings) && !this.isObject(settings))
                    throw new Error('Could not resolve settings.');
                if (!fieldName)
                    throw new Error('You must provide an api key field name.');

                // Allow for settings to just be an API key, for example:
                //
                //     { 'Google Analytics : 'UA-XXXXXXX-X' }
                if (this.isString(settings)) {
                    var apiKey = settings;
                    settings = {};
                    settings[fieldName] = apiKey;
                }

                return settings;
            },

            // A helper to track events based on the 'anjs' url parameter
            getUrlParameter : function (urlSearchParameter, paramKey) {
                var params = urlSearchParameter.replace('?', '').split('&');
                for (var i = 0; i < params.length; i += 1) {
                    var param = params[i].split('=');
                    if (param.length === 2 && param[0] === paramKey) {
                        return decodeURIComponent(param[1]);
                    }
                }
            }
        }

    };

    // Wrap any existing `onload` function with our own that will cache the
    // loaded state of the page.
    var oldonload = window.onload;
    window.onload = function () {
        analytics.loaded = true;
        if (analytics.utils.isFunction(oldonload)) oldonload();
    };

    window.analytics = analytics;
})();


// Chartbeat
// ---------
// [Documentation](http://chartbeat.com/docs/adding_the_code/),
// [documentation](http://chartbeat.com/docs/configuration_variables/),
// [documentation](http://chartbeat.com/docs/handling_virtual_page_changes/).

analytics.addProvider('Chartbeat', {

    settings : {
        domain : null,
        uid    : null
    },


    // Initialize
    // ----------

    // Changes to the Chartbeat snippet:
    //
    // * Pass `settings` directly as the config object.
    // * Replaced the date with our stored `date` variable.
    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'uid');
        analytics.utils.extend(this.settings, settings);

        // Since all the custom settings just get passed through, update the
        // Chartbeat `_sf_async_config` variable with settings.
        window._sf_async_config = this.settings || {};

        (function(){
            // Use the stored date from when we were loaded.
            window._sf_endpt = analytics.date.getTime();
            var e = document.createElement("script");
            e.setAttribute("language", "javascript");
            e.setAttribute("type", "text/javascript");
            e.setAttribute("src",
                (("https:" == document.location.protocol) ?
                    "https://a248.e.akamai.net/chartbeat.download.akamai.com/102508/" :
                    "http://static.chartbeat.com/") +
                "js/chartbeat.js");
            document.body.appendChild(e);
        })();
    },


    // Pageview
    // --------

    pageview : function () {
        window.pSUPERFLY.virtualPage(window.location.pathname);
    }

});


// CrazyEgg
// --------
// [Documentation](www.crazyegg.com).

analytics.addProvider('CrazyEgg', {

    settings : {
        apiKey : null
    },


    // Initialize
    // ----------

    // Changes to the CrazyEgg snippet:
    //
    // * Concatenate `apiKey` into the URL.
    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'apiKey');
        analytics.utils.extend(this.settings, settings);

        (function(){
            var a=document.createElement("script");
            var b=document.getElementsByTagName("script")[0];
            a.src=document.location.protocol+"//dnn506yrbagrg.cloudfront.net/pages/scripts/"+this.settings.apiKey+".js?"+Math.floor(new Date().getTime()/3600000);
            a.async=true;a.type="text/javascript";b.parentNode.insertBefore(a,b);
        })();
    }

});


// Customer.io
// -----------
// [Documentation](http://customer.io/docs/api/javascript.html).

analytics.addProvider('Customer.io', {

    settings : {
        siteId : null
    },


    // Initialize
    // ----------

    // Changes to the Chartbeat snippet:
    //
    // * Add `siteId`.
    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'siteId');
        analytics.utils.extend(this.settings, settings);

        var self = this;

        var _cio = window._cio = _cio || [];
        (function() {
            var a,b,c;a=function(f){return function(){_cio.push([f].
            concat(Array.prototype.slice.call(arguments,0)))}};b=["identify",
            "track"];for(c=0;c<b.length;c++){_cio[b[c]]=a(b[c])};
            var t = document.createElement('script'),
                s = document.getElementsByTagName('script')[0];
            t.async = true;
            t.id    = 'cio-tracker';
            t.setAttribute('data-site-id', self.settings.siteId);
            t.src = 'https://assets.customer.io/assets/track.js';
            s.parentNode.insertBefore(t, s);
        })();

    },


    // Identify
    // --------

    identify : function (userId, traits) {
        // Don't do anything if we just have traits, because Customer.io
        // requires a `userId`.
        if (!userId) return;

        traits || (traits = {});

        // Customer.io takes the `userId` as part of the traits object.
        traits.id = userId;

        // If there wasn't already an email and the userId is one, use it.
        if (!traits.email && analytics.utils.isEmail(userId)) {
            traits.email = userId;
        }

        // Swap the `created` trait to the `created_at` that Customer.io needs
        // (in seconds).
        if (traits.created) {
            traits.created_at = analytics.utils.getSeconds(traits.created);
            delete traits.created;
        }

        window._cio.identify(traits);
    },


    // Track
    // -----

    track : function (event, properties) {
        window._cio.track(event, properties);
    }

});


// Errorception
// ------------
// [Documentation](http://errorception.com/).

analytics.addProvider('Errorception', {

    settings : {
        projectId : null
    },


    // Initialize
    // ----------

    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'projectId');
        analytics.utils.extend(this.settings, settings);

        var self = this;

        var _errs = window._errs = _errs || [settings.projectId];
        (function(a,b){
            a.onerror = function () {
                _errs.push(arguments);
            };
            var d = function () {
                var a = b.createElement("script"),
                    c = b.getElementsByTagName("script")[0];
                a.src = "//d15qhc0lu1ghnk.cloudfront.net/beacon.js";
                a.async = true;
                c.parentNode.insertBefore(a,c);
            };
            a.addEventListener ? a.addEventListener("load",d,!1) : a.attachEvent("onload",d);
        })(window,document);
    }

});


// Google Analytics
// ----------------
// [Documentation](https://developers.google.com/analytics/devguides/collection/gajs/).

analytics.addProvider('Google Analytics', {

    settings : {
        anonymizeIp             : false,
        enhancedLinkAttribution : false,
        siteSpeedSampleRate     : null,
        domain                  : null,
        trackingId              : null
    },


    // Initialize
    // ----------

    // Changes to the Google Analytics snippet:
    //
    // * Added `trackingId`.
    // * Added optional support for `enhancedLinkAttribution`
    // * Added optional support for `siteSpeedSampleRate`
    // * Added optional support for `anonymizeIp`
    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'trackingId');
        analytics.utils.extend(this.settings, settings);

        var _gaq = window._gaq || [];
        _gaq.push(['_setAccount', this.settings.trackingId]);
        if (this.settings.enhancedLinkAttribution) {
            var pluginUrl = (('https:' == document.location.protocol) ? 'https://www.' : 'http://www.') + 'google-analytics.com/plugins/ga/inpage_linkid.js';
            _gaq.push(['_require', 'inpage_linkid', pluginUrl]);
        }
        if (analytics.utils.isNumber(this.settings.siteSpeedSampleRate)) {
            _gaq.push(['_setSiteSpeedSampleRate', this.settings.siteSpeedSampleRate]);
        }
        if(this.settings.domain) {
            _gaq.push(['_setDomainName', this.settings.domain]);
        }
        if(this.settings.anonymizeIp) {
            _gaq.push(['_gat._anonymizeIp']);
        }
        _gaq.push(['_trackPageview']);
        window._gaq = _gaq;

        (function() {
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        })();
    },


    // Track
    // -----

    track : function (event, properties) {
        window._gaq.push(['_trackEvent', 'All', event]);
    },


    // Pageview
    // --------

    pageview : function () {
        window._gaq.push(['_trackPageview']);
    }

});


// HubSpot
// -------
// [Documentation](http://hubspot.clarify-it.com/d/4m62hl)

analytics.addProvider('HubSpot', {

    settings : {
        portalId : null
    },


    // Initialize
    // ----------

    // Changes to the HubSpot snippet:
    //
    // * Concatenate `portalId` into the URL.
    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'portalId');
        analytics.utils.extend(this.settings, settings);

        var self = this;

        (function(d,s,i,r) {
            if (d.getElementById(i)){return;}
            window._hsq = window._hsq || []; // for calls pre-load
            var n=d.createElement(s),e=d.getElementsByTagName(s)[0];
            n.id=i;n.src='https://js.hubspot.com/analytics/'+(Math.ceil(new Date()/r)*r)+'/' + self.settings.portalId + '.js';
            e.parentNode.insertBefore(n, e);
        })(document,"script","hs-analytics",300000);
    },


    // Identify
    // --------

    identify : function (userId, traits) {
        // HubSpot does not use a userId, but the email address is required on
        // the traits object.
        if (!traits) return;

        window._hsq.push(["identify", traits]);
    },


    // Track
    // -----

    // Event Tracking is available to HubSpot Enterprise customers only. In
    // addition to adding any unique event name, you can also use the id of an
    // existing custom event as the event variable.
    track : function (event, properties) {
        window._hsq.push(["trackEvent", event, properties]);
    },


    // Pageview
    // --------

    pageview : function () {
        // TODO http://performabledoc.hubspot.com/display/DOC/JavaScript+API
    }

});


// GoSquared
// ---------
// [Documentation](www.gosquared.com/support).
// Will automatically [integrate with Olark](https://www.gosquared.com/support/articles/721791-setting-up-olark-live-chat).

analytics.addProvider('GoSquared', {

    settings : {
        siteToken : null
    },


    // Initialize
    // ----------

    // Changes to the GoSquared tracking code:
    //
    // * Use `siteToken` from settings.
    // * No longer need to wait for pageload, removed unnecessary functions.
    // * Attach `GoSquared` to `window`.

    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'siteToken');
        analytics.utils.extend(this.settings, settings);

        var GoSquared = window.GoSquared = {};
        GoSquared.acct = this.settings.siteToken;
        window._gstc_lt=+(new Date); var d=document;
        var g = d.createElement("script"); g.type = "text/javascript"; g.async = true; g.src = "//d1l6p2sc9645hc.cloudfront.net/tracker.js";
        var s = d.getElementsByTagName("script")[0]; s.parentNode.insertBefore(g, s);
    },


    // Identify
    // --------

    identify : function (userId, traits) {
        // TODO figure out if this will actually work. Seems like GoSquared will
        // never know these values are updated.
        if (userId) window.GoSquared.UserName = userId;
        if (traits) window.GoSquared.Visitor = traits;
    },


    // Track
    // -----

    track : function (event, properties) {
        // The queue isn't automatically created by the snippet.
        if (!window.GoSquared.q) window.GoSquared.q = [];

        // GoSquared sets a `gs_evt_name` property with a value of the event
        // name, so it relies on properties being an object.
        properties || (properties = {});

        window.GoSquared.q.push(['TrackEvent', event, properties]);
    },


    // Pageview
    // --------

    pageview : function () {
        window.GoSquared.DefaultTracker.TrackView();
    }

});


// Intercom
// --------
// [Documentation](http://docs.intercom.io/).

analytics.addProvider('Intercom', {

    settings : {
        appId : null
    },


    // Initialize
    // ----------

    // Intercom identifies when the script is loaded, so instead of initializing
    // in `initialize`, we store the settings for later and initialize in
    // `identify`.
    initialize: function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'appId');
        analytics.utils.extend(this.settings, settings);
    },


    // Identify
    // --------

    // Changes to the Intercom snippet:
    //
    // * Add `appId` from stored `settings`.
    // * Add `userId`.
    // * Add `userHash` for secure mode
    identify: function (userId, traits) {
        // Don't do anything if we just have traits.
        if (!userId) return;

        // Pass traits directly in to Intercom's `custom_data`.
        window.intercomSettings = {
            app_id      : this.settings.appId,
            user_id     : userId,
            user_hash   : this.settings.userHash,
            custom_data : traits || {}
        };

        // Augment `intercomSettings` with some of the special traits.
        if (traits) {
            window.intercomSettings.email = traits.email;
            window.intercomSettings.name = traits.name;
            window.intercomSettings.created_at = analytics.utils.getSeconds(traits.created);
        }

        // If they didn't pass an email, check to see if the `userId` qualifies.
        if (analytics.utils.isEmail(userId) && (traits && !traits.email)) {
            window.intercomSettings.email = userId;
        }

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

});


// KISSmetrics
// -----------
// [Documentation](http://support.kissmetrics.com/apis/javascript).

analytics.addProvider('KISSmetrics', {

    settings : {
        apiKey : null
    },


    // Initialize
    // ----------

    // Changes to the KISSmetrics snippet:
    //
    // * Concatenate the `apiKey` into the URL.
    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'apiKey');
        analytics.utils.extend(this.settings, settings);

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
        _kms('//doug1izaerwt3.cloudfront.net/'+this.settings.apiKey+'.1.js');
    },


    // Identify
    // --------

    // KISSmetrics uses two separate methods: `identify` for storing the
    // `userId`, and `set` for storing `traits`.
    identify : function (userId, traits) {
        if (userId) window._kmq.push(['identify', userId]);
        if (traits) window._kmq.push(['set', traits]);
    },


    // Track
    // -----

    track : function (event, properties) {
        window._kmq.push(['record', event, properties]);
    }

});


// Klaviyo
// -------
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
        window._learnq = _learnq;
        (function () {
            var b = document.createElement('script'); b.type = 'text/javascript'; b.async = true;
            b.src = ('https:' == document.location.protocol ? 'https://' : 'http://') +
                'a.klaviyo.com/media/js/learnmarklet.js';
            var a = document.getElementsByTagName('script')[0]; a.parentNode.insertBefore(b, a);
        })();
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


// Mixpanel
// --------
// [Documentation](https://mixpanel.com/docs/integration-libraries/javascript),
// [documentation](https://mixpanel.com/docs/people-analytics/javascript),
// [documentation](https://mixpanel.com/docs/integration-libraries/javascript-full-api).

analytics.addProvider('Mixpanel', {

    settings : {
        nameTag : true,
        people  : false,
        token   : null
    },


    // Initialize
    // ----------

    // Changes to the Mixpanel snippet:
    //
    // * Use window for call to `init`.
    // * Add `token` and `settings` args to call to `init`.
    //
    // We don't need to set the `mixpanel` object on `window` ourselves because
    // they already do that.
    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'token');
        analytics.utils.extend(this.settings, settings);

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

        // Pass settings directly to `init` as the second argument.
        window.mixpanel.init(this.settings.token, this.settings);
    },


    // Identify
    // --------

    identify : function (userId, traits) {
        // If we have an email and no email trait, set the email trait.
        if (userId && analytics.utils.isEmail(userId) && (traits && !traits.email)) {
            traits || (traits = {});
            traits.email = userId;
        }

        // Alias the traits' keys with dollar signs for Mixpanel's API.
        if (traits) {
            analytics.utils.alias(traits, {
                'email'    : '$email',
                'name'     : '$name',
                'username' : '$username',
                'lastSeen' : '$lastSeen',
                'created'  : '$created'
            });
        }

        // Finally, call all of the identify equivalents. Verify certain calls
        // against settings to make sure they're enabled.
        if (userId) {
            window.mixpanel.identify(userId);
            if (this.settings.nameTag) window.mixpanel.name_tag(userId);
            if (this.settings.people) window.mixpanel.people.identify(userId);
        }
        if (traits) {
            window.mixpanel.register(traits);
            if (this.settings.people) window.mixpanel.people.set(traits);
        }
    },


    // Track
    // -----

    track : function (event, properties) {
        window.mixpanel.track(event, properties);
    },


    // Pageview
    // --------

    // Mixpanel doesn't actually track the pageviews, but they do show up in the
    // Mixpanel stream.
    pageview : function () {
        window.mixpanel.track_pageview();
    }

});


// Olark
// -----
// [Documentation](http://www.olark.com/documentation).

analytics.addProvider('Olark', {

    settings : {
        siteId   : null,
        track    : false,
        pageview : true
    },


    // Initialize
    // ----------

    // Changes to the Olark snippet:
    //
    // * Removed `CDATA` tags.
    // * Add `siteId` from stored `settings`.
    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'siteId');
        analytics.utils.extend(this.settings, settings);

        window.olark||(function(c){var f=window,d=document,l=f.location.protocol=="https:"?"https:":"http:",z=c.name,r="load";var nt=function(){f[z]=function(){(a.s=a.s||[]).push(arguments)};var a=f[z]._={},q=c.methods.length;while(q--){(function(n){f[z][n]=function(){f[z]("call",n,arguments)}})(c.methods[q])}a.l=c.loader;a.i=nt;a.p={0:+new Date};a.P=function(u){a.p[u]=new Date-a.p[0]};function s(){a.P(r);f[z](r)}f.addEventListener?f.addEventListener(r,s,false):f.attachEvent("on"+r,s);var ld=function(){function p(hd){hd="head";return["<",hd,"></",hd,"><",i,' onl' + 'oad="var d=',g,";d.getElementsByTagName('head')[0].",j,"(d.",h,"('script')).",k,"='",l,"//",a.l,"'",'"',"></",i,">"].join("")}var i="body",m=d[i];if(!m){return setTimeout(ld,100)}a.P(1);var j="appendChild",h="createElement",k="src",n=d[h]("div"),v=n[j](d[h](z)),b=d[h]("iframe"),g="document",e="domain",o;n.style.display="none";m.insertBefore(n,m.firstChild).id=z;b.frameBorder="0";b.id=z+"-loader";if(/MSIE[ ]+6/.test(navigator.userAgent)){b.src="javascript:false"}b.allowTransparency="true";v[j](b);try{b.contentWindow[g].open()}catch(w){c[e]=d[e];o="javascript:var d="+g+".open();d.domain='"+d.domain+"';";b[k]=o+"void(0);"}try{var t=b.contentWindow[g];t.write(p());t.close()}catch(x){b[k]=o+'d.write("'+p().replace(/"/g,String.fromCharCode(92)+'"')+'");d.close();'}a.P(2)};ld()};nt()})({loader: "static.olark.com/jsclient/loader0.js",name:"olark",methods:["configure","extend","declare","identify"]});
        window.olark.identify(this.settings.siteId);
    },


    // Identify
    // --------

    // Olark isn't an analytics service, but we can use the `userId` and
    // `traits` to tag the user with their real name in the chat console.
    identify : function (userId, traits) {
        // Choose the best name for the user that we can get.
        var name = userId;
        if (traits && traits.email) name = traits.email;
        if (traits && traits.name) name = traits.name;
        if (traits && traits.name && traits.email) name += ' ('+traits.email+')';

        // If we ended up with no name after all that, get out of there.
        if (!name) return;

        window.olark('api.chat.updateVisitorNickname', {
            snippet : name
        });
    },


    // Track
    // -----

    // Again, all we're doing is logging events the user triggers to the chat
    // console, if you so desire it.
    track : function (event, properties) {
        // Check the `track` setting to know whether log events or not.
        if (!this.settings.track) return;

        // To stay consistent with olark's default messages, it's all lowercase.
        window.olark('api.chat.sendNotificationToOperator', {
            body : 'visitor triggered "'+event+'"'
        });
    },


    // Pageview
    // --------

    // Again, not analytics, but we can mimic the functionality Olark has for
    // normal pageviews with pseudo-pageviews, telling the operator when a
    // visitor changes pages.
    pageview : function () {
        // Check the `pageview` settings to know whether they want this or not.
        if (!this.settings.pageview) return;

        // To stay consistent with olark's default messages, it's all lowercase.
        window.olark('api.chat.sendNotificationToOperator', {
            body : 'looking at ' + window.location.href
        });
    }

});


