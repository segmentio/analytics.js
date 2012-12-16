//     Analytics.js 0.2.0

//     (c) 2012 Segment.io Inc.
//     Analytics.js may be freely distributed under the MIT license.

(function () {

    // A reference to the global object, `window` in the browser, `global` on
    // the server.
    var root = this;

    // The `analytics` object that will be exposed to you on the global object.
    root.analytics || (root.analytics = {

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
        // =========

        // A dictionary of analytics providers that _can_ be initialized.
        availableProviders : {},

        // A list of analytics providers that are initialized.
        providers : [],

        // Adds a provider to the list of available providers that can be
        // initialized.
        addProvider : function (name, provider) {
            this.availableProviders[name] = provider;
        },


        // Initialize
        // ==========

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
        // `providers` - a dictionary of the providers you want to enabled. The
        // keys are the names of the providers and their values are either an
        // api key, or dictionary of extra settings (including the api key).
        initialize : function (providers) {
            // Reset our state.
            this.providers = [];
            this.userId = null;

            // Initialize each provider with the proper settings, and copy the
            // provider into `this.providers`.
            for (var key in providers) {
                var provider = this.availableProviders[key];
                if (!provider) throw new Error('Could not find a provider named "'+key+'"');
                provider.initialize(providers[key]);
                this.providers.push(provider);
            }

            // Update the initialized state that other methods rely on.
            this.initialized = true;
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
        // `userId` - [optional] the ID you know the user by, like an email.
        //
        // `traits` - [optional] a dictionary of traits to tie your user. Things
        // like *Name*, *Age* or *Friend Count*.
        identify : function (userId, traits) {
            if (!this.initialized) return;

            // Allow for identifying traits without setting a `userId`, for
            // anonymous users whose trait you know.
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
        // `properties` - [optional] a dictionary of properties of the event.
        track : function (event, properties) {
            if (!this.initialized) return;

            // Call `track` on all of our enabled providers that support it.
            for (var i = 0, provider; provider = this.providers[i]; i++) {
                if (!provider.track) continue;
                provider.track(event, this.utils.clone(properties));
            }
        },


        // Utils
        // =====

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
            }
        }

    });

    // Wrap any existing `onload` function with our own that will cache the
    // loaded state of the page.
    var oldonload = window.onload;
    window.onload = function () {
        root.analytics.loaded = true;
        if (root.analytics.utils.isFunction(oldonload)) oldonload();
    };

}).call(this);


// Chartbeat
// ---------
// Last updated: November 27th, 2012
// [Documentation](http://chartbeat.com/docs/adding_the_code/),
// [documentation](http://chartbeat.com/docs/configuration_variables/),
// [documentation](http://chartbeat.com/docs/handling_virtual_page_changes/).

analytics.addProvider('Chartbeat', {

    settings : {
        domain : null,
        uid    : null
    },

    // Changes to the Chartbeat snippet:
    //
    // * Add `apiKey` and `domain` variables to config.
    // * Replaced the date with our stored `date` variable.
    //
    // Also, we don't need to set the `mixpanel` object on `window` because
    // they already do that.
    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'uid');
        analytics.utils.extend(this.settings, settings);

        // Since all the custom settings just get passed through, update the
        // Chartbeat `_sf_async_config` variable with settings.
        var _sf_async_config = this.settings || {};

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
    }

    // TODO: Add virtual page API.

});


// CrazyEgg.com
// ----------
// Last updated: December 6th, 2012
// [Documentation](www.crazyegg.com).

analytics.addProvider('CrazyEgg', {

    settings : {
        apiKey : null
    },

    // Changes to the CrazyEgg snippet:
    //
    // * Concatenate the API key into the URL.
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
// ----------
// Last updated: December 6th, 2012
// [Documentation](http://customer.io/docs/api/javascript.html).

analytics.addProvider('Customer.io', {

    settings : {
        siteId : null
    },

    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'siteId');
        analytics.utils.extend(this.settings, settings);

        var self = this;

        var _cio = _cio || [];
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
        window._cio = _cio;
    },

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

        // Swap the `createdAt` trait to the `created_at` that Customer.io
        // needs (in seconds).
        if (traits.createdAt) {
            traits.created_at = analytics.utils.getSeconds(traits.createdAt);
            delete traits.createdAt;
        }

        window._cio.identify(traits);
    },

    track : function (event, properties) {
        window._cio.track(event, properties);
    }

});


// Google Analytics
// ----------------
// Last updated: October 31st, 2012
// [Documentation](https://developers.google.com/analytics/devguides/collection/gajs/).

analytics.addProvider('Google Analytics', {

    settings : {
        anonymizeIp             : false,
        enhancedLinkAttribution : false,
        siteSpeedSampleRate     : null,
        trackingId              : null
    },

    // Changes to the Google Analytics snippet:
    //
    // * Added `trackingId`.
    // * Added optional support for `enhancedLinkAttribution`
    // * Added optional support for `siteSpeedSampleRate`
    // * Added optional support for `anonymizeIp`
    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'trackingId');
        analytics.utils.extend(this.settings, settings);

        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', this.settings.trackingId]);
        if (this.settings.enhancedLinkAttribution) {
            var pluginUrl = (('https:' == document.location.protocol) ? 'https://ssl.' : 'http://www.') + 'google-analytics.com/plugins/ga/inpage_linkid.js';
            _gaq.push(['_require', 'inpage_linkid', pluginUrl]);
        }
        if (analytics.utils.isNumber(this.settings.siteSpeedSampleRate)) {
            _gaq.push(['_setSiteSpeedSampleRate', this.settings.siteSpeedSampleRate]);
        }
        if(this.settings.anonymizeIp) {
            _gaq.push(['_gat._anonymizeIp']);
        }
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

});


// HubSpot
// -------
// Last updated: December 13th, 2012
// [Documentation](http://hubspot.clarify-it.com/d/4m62hl)

analytics.addProvider('HubSpot', {

    settings : {
        portalId : null
    },

    // Changes to the HubSpot snippet:
    //
    // * Adding HubSpot snippet

    // Use the `portalId` to setup the HubSpot tracking code.
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

    identify : function (userId, traits) {
        // HubSpot does not use a userId, but the email address is required on
        // the traits object.
        if (!traits) return;

        window._hsq.push(["identify", traits]);
    },

    // Event Tracking is available to HubSpot Enterprise customers only. In
    // addition to adding any unique event name, you can also use the id of an
    // existing custom event as the event variable.
    track : function (event, properties) {
        window._hsq.push(["trackEvent", event, properties]);
    }

});


// Intercom
// --------
// Last updated: December 12th, 2012
// [Documentation](http://docs.intercom.io/).

analytics.addProvider('Intercom', {

    settings : {
        appId : null
    },

    // Intercom identifies when the script is loaded, so instead of initializing
    // in `initialize`, we have to store the settings for later and initialize
    // in `identify`.
    initialize: function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'appId');
        analytics.utils.extend(this.settings, settings);
    },

    // Changes to the Intercom snippet:
    //
    // * Add `appId` from stored `settings`.
    // * Add `userId`.
    identify: function (userId, traits) {
        // Don't do anything if we just have traits.
        if (!userId) return;

        window.intercomSettings = {
            app_id      : this.settings.appId,
            user_id     : userId,
            custom_data : traits || {},
        };

        if (traits) {
            window.intercomSettings.email = traits.email;
            window.intercomSettings.name = traits.name;
            window.intercomSettings.created_at = analytics.utils.getSeconds(traits.createdAt);
        }
        if (analytics.utils.isEmail(userId) && !traits.email) {
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
// Last updated: December 12th, 2012
// [Documentation](http://support.kissmetrics.com/apis/javascript).

analytics.addProvider('KISSmetrics', {

    settings : {
        apiKey : null
    },

    // Changes to the KISSmetrics snippet:
    //
    // * Concatenate the `apiKey` into the URL.
    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'apiKey');
        analytics.utils.extend(this.settings, settings);

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
        _kms('//doug1izaerwt3.cloudfront.net/'+this.settings.apiKey+'.1.js');

        window._kmq = _kmq;
    },

    // KISSmetrics uses two separate methods: `identify` for storing the
    // `userId` and `set` for storing `traits`.
    identify : function (userId, traits) {
        if (userId) window._kmq.push(['identify', userId]);
        if (traits) window._kmq.push(['set', traits]);
    },

    track : function (event, properties) {
        window._kmq.push(['record', event, properties]);
    }

});


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


// Mixpanel
// --------
// Last updated: September 27th, 2012
// [Documentation](https://mixpanel.com/docs/integration-libraries/javascript),
// [documentation](https://mixpanel.com/docs/people-analytics/javascript),
// [documentation](https://mixpanel.com/docs/integration-libraries/javascript-full-api).

analytics.addProvider('Mixpanel', {

    settings : {
        nameTag : true,
        people  : false,
        token   : null
    },

    // Changes to the Mixpanel snippet:
    //
    // * Use window for call to `init`.
    // * Add `apiKey` and `settings` args to call to `init`.
    //
    // Also, we don't need to set the `mixpanel` object on `window` because
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

        // Directly pass in settings to Mixpanel as the second argument.
        window.mixpanel.init(this.settings.token, this.settings);
    },

    identify : function (userId, traits) {
        if (userId) {
            window.mixpanel.identify(userId);
            if (this.settings.nameTag) window.mixpanel.name_tag(userId);
            if (analytics.utils.isEmail(userId)) {
                traits || (traits = {});
                traits.email = userId;
            }
        }

        if (traits) {
            // Properly alias the traits for Mixpanel's API.
            this.aliasTraits(traits);
            window.mixpanel.register(traits);
        }

        // Only use people if they have it turned on, because it's charged
        // separately.
        if (this.settings.people === true) {
            if (userId) window.mixpanel.people.identify(userId);
            if (traits) window.mixpanel.people.set(traits);
        }
    },

    track : function (event, properties) {
        window.mixpanel.track(event, properties);
    },

    // Mixpanel takes special traits with dollar signs in front of them, so we
    // convert normal trait keys into their special keys.
    aliasTraits : function (traits) {
        if (traits.email) {
            traits['$email'] = traits.email;
            delete traits.email;
        }
        if (traits.name) {
            traits['$name'] = traits.name;
            delete traits.name;
        }
        if (traits.username) {
            traits['$username'] = traits.username;
            delete traits.username;
        }
        if (traits.lastSeen) {
            traits['$last_login'] = traits.lastSeen;
            delete traits.lastSeen;
        }
        if (traits.createdAt) {
            traits['$created'] = traits.createdAt;
            delete traits.createdAt;
        }
    }

});


// Olark
// -----
// Last updated: October 11th, 2012
// [Documentation](http://www.olark.com/documentation).

analytics.addProvider('Olark', {

    settings : {
        siteId : null,
        track  : false
    },

    // Changes to the Olark snippet:
    //
    // * Removed `CDATA` tags.
    // * Add `siteId` from stored `settings`.
    // * Added `window.` before `olark.identify`.
    initialize : function (settings) {
        settings = analytics.utils.resolveSettings(settings, 'siteId');
        analytics.utils.extend(this.settings, settings);

        window.olark||(function(c){var f=window,d=document,l=f.location.protocol=="https:"?"https:":"http:",z=c.name,r="load";var nt=function(){f[z]=function(){(a.s=a.s||[]).push(arguments)};var a=f[z]._={},q=c.methods.length;while(q--){(function(n){f[z][n]=function(){f[z]("call",n,arguments)}})(c.methods[q])}a.l=c.loader;a.i=nt;a.p={0:+new Date};a.P=function(u){a.p[u]=new Date-a.p[0]};function s(){a.P(r);f[z](r)}f.addEventListener?f.addEventListener(r,s,false):f.attachEvent("on"+r,s);var ld=function(){function p(hd){hd="head";return["<",hd,"></",hd,"><",i,' onl' + 'oad="var d=',g,";d.getElementsByTagName('head')[0].",j,"(d.",h,"('script')).",k,"='",l,"//",a.l,"'",'"',"></",i,">"].join("")}var i="body",m=d[i];if(!m){return setTimeout(ld,100)}a.P(1);var j="appendChild",h="createElement",k="src",n=d[h]("div"),v=n[j](d[h](z)),b=d[h]("iframe"),g="document",e="domain",o;n.style.display="none";m.insertBefore(n,m.firstChild).id=z;b.frameBorder="0";b.id=z+"-loader";if(/MSIE[ ]+6/.test(navigator.userAgent)){b.src="javascript:false"}b.allowTransparency="true";v[j](b);try{b.contentWindow[g].open()}catch(w){c[e]=d[e];o="javascript:var d="+g+".open();d.domain='"+d.domain+"';";b[k]=o+"void(0);"}try{var t=b.contentWindow[g];t.write(p());t.close()}catch(x){b[k]=o+'d.write("'+p().replace(/"/g,String.fromCharCode(92)+'"')+'");d.close();'}a.P(2)};ld()};nt()})({loader: "static.olark.com/jsclient/loader0.js",name:"olark",methods:["configure","extend","declare","identify"]});
        window.olark.identify(this.settings.siteId);
    },

    identify : function (userId, traits) {
        // Choose the best name for the user that we can get.
        var name = userId;
        if (traits && traits.email) name = traits.email;
        if (traits && traits.name) name = traits.name;

        // If we ended up with no name after all that, get out of there.
        if (!name) return;

        window.olark('api.chat.updateVisitorNickname', {
            snippet : name
        });
    },

    track : function (event, properties) {
        // Check the `track` setting to know whether log events or not.
        if (!this.settings.track) return;

        window.olark('api.chat.sendNotificationToOperator', {
            body : 'Visitor triggered "'+event+'".'
        });
    }

});


