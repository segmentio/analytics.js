(function () {
    // A reference to the global object.
    var root = this;
    // Whether analytics.js has been initialized.
    var initialized = false;
    // Store the date when the page loaded, for analytics that depend on that.
    var date = new Date();
    // Store window.onload state so that analytics that rely on it (ffs) can be
    // loaded even after it has happened.
    var loaded = false;
    var oldonload = window.onload;
    window.onload = function () {
        loaded = true;
        if (isFunction(oldonload)) oldonload();
    };


    var getSeconds = function (time) {
        return Math.floor((new Date(time)) / 1000);
    };

    // A helper to shallow-ly clone objects, so that they don't get mangled or
    // added to by different analytics providers because of the reference.
    var clone = function (obj) {
        if (!obj) return;
        var clone = {};
        for (var prop in obj) clone[prop] = obj[prop];
        return clone;
    };

    // Type detection helpers, copied from [underscore](https://github.com/documentcloud/underscore/blob/master/underscore.js#L928-L938).
    var isObject = function (obj) {
        return obj === Object(obj);
    };
    var isString = function (obj) {
        return Object.prototype.toString.call(obj) === '[object String]';
    };
    var isFunction = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Function]';
    };

    // Email detection helper
    var basicEmailRegex = /.+\@.+\..+/;

    // A helper to resolve a settings object. It allows for `settings` to be an
    // `fieldName` string in the case of no additional settings being needed.
    // Field name is the setting for the api key for our shorthand.
    var resolveSettings = function (settings, fieldName) {
        if (!isString(settings) && !isObject(settings))
            throw new Error('Encountered unresolvable settings value.');

        if (isString(settings)) {
            var apiKey = settings;
            settings = {};
            settings[fieldName] = apiKey;
        }
        return settings;
    };


    // The `analytics` object that will be exposed to you on the global object.
    root.analytics || (root.analytics = {

        // A list of providers that have been initialized.
        providers : [],

        // UserId to save
        userId : null,


        // Initialize
        // ==========

        // Call **initialize** to setup analytics.js before identifying or
        // tracking any users or events. It takes a list of providers that you
        // want to enable, along with settings for each provider. (Settings vary
        // depending on the provider.) Here's what a call to **initialize**
        // might look like:
        //
        //     analytics.initialize({
        //         'Google Analytics' : 'UA-XXXXXXX-X',
        //         'Segment.io'       : 'XXXXXXXXXXX',
        //         'KISSmetrics'      : 'XXXXXXXXXXX'
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
        // `userId` - [optional] the ID you recognize your user by, like an email.
        //
        // `traits` - an optional dictionary of traits to tie your user. Things
        // like *Name*, *Age* or *Friend Count*.
        identify : function (userId, traits) {
            if (!initialized) return;

            if (isObject(userId)) {
                traits = userId;
                userId = null;
            }

            // Save it for future use, or use saved userId.
            if (userId !== null)
                this.userId = userId;
            else
                userId = this.userId;

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

    });




    // Providers
    // =========

    // A list of available providers that _can_ be initialized by you.
    var availableProviders = {

        // Google Analytics
        // ----------------
        // _Last updated: October 31st, 2012_
        //
        // [Documentation](https://developers.google.com/analytics/devguides/collection/gajs/).

        'Google Analytics' : {

            // Changes to the Google Analytics snippet:
            //
            // * Added optional support for `enhancedLinkAttribution`
            //
            // * Added optional support for `siteSpeedSampleRate`
            //
            // * Add `apiKey` to call to `_setAccount`.
            initialize : function (settings) {
                this.settings = settings = resolveSettings(settings, 'trackingId');

                var _gaq = _gaq || [];
                _gaq.push(['_setAccount', settings.trackingId]);

                if (this.settings.enhancedLinkAttribution === true) {
                    var pluginUrl = (('https:' == document.location.protocol) ? 'https://ssl.' : 'http://www.') + 'google-analytics.com/plugins/ga/inpage_linkid.js';
                    _gaq.push(['_require', 'inpage_linkid', pluginUrl]);
                }
                if (this.settings.siteSpeedSampleRate != null &&
                    typeof(this.settings.siteSpeedSampleRate) === 'number') {
                    _gaq.push(['_setSiteSpeedSampleRate', this.settings.siteSpeedSampleRate]);
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
        },


        // KISSmetrics
        // -----------
        // _Last updated: September 27th, 2012_
        //
        // [Documentation](http://support.kissmetrics.com/apis/javascript).

        'KISSmetrics' : {

            // Changes to the KISSmetrics snippet:
            //
            // * Concatenate in the `apiKey`.
            initialize : function (settings) {
                this.settings = settings = resolveSettings(settings, 'apiKey');

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
                if (userId)
                  window._kmq.push(['identify', userId]);
                if (traits)
                  window._kmq.push(['set', traits]);
            },

            track : function (event, properties) {
                window._kmq.push(['record', event, properties]);
            }
        },


        // Mixpanel
        // --------
        // _Last updated: September 27th, 2012_
        //
        // [Documentation](https://mixpanel.com/docs/integration-libraries/javascript),
        // [documentation](https://mixpanel.com/docs/people-analytics/javascript),
        // [documentation](https://mixpanel.com/docs/integration-libraries/javascript-full-api).

        'Mixpanel' : {

            // Changes to the Mixpanel snippet:
            //
            // * Use window for call to `init`.
            // * Add `apiKey` and `settings` args to call to `init`.
            //
            // Also, we don't need to set the `mixpanel` object on `window` because
            // they already do that.
            initialize : function (settings) {
                this.settings = settings = resolveSettings(settings, 'token');

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
                window.mixpanel.init(settings.token, settings);
            },


            // Only identify with Mixpanel's People feature if you opt-in because
            // otherwise Mixpanel charges you for it.
            // Alias email -> $email
            identify : function (userId, traits) {
                if (userId) {
                    window.mixpanel.identify(userId);
                    window.mixpanel.name_tag(userId);

                    if (basicEmailRegex.test(userId))
                        traits.email = userId;
                }

                if (traits) {
                    this.aliasTraits(traits);
                    window.mixpanel.register(traits);
                }

                if (this.settings.people === true) {
                    if (userId)
                        window.mixpanel.people.identify(userId);
                    if (traits)
                        window.mixpanel.people.set(traits);
                }
            },


            aliasTraits : function (traits) {
                if (traits.email) {
                    traits['$email'] = traits.email;
                    delete traits.email;
                }

                if (traits.name) {
                    traits['$name']  = traits.name;
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
            },

            track : function (event, properties) {
                window.mixpanel.track(event, properties);
            }
        },


        // Intercom
        // --------
        // _Last updated: September 27th, 2012_
        //
        // [Documentation](http://docs.intercom.io/).

        'Intercom' : {

            // Intercom identifies when the script is loaded, so instead of
            // initializing in `initialize`, we have to initialize in `identify`.
            initialize: function (settings) {
                this.settings = resolveSettings(settings, 'appId');
            },

            // Changes to the Intercom snippet:
            //
            // * Add `appId` from stored `settings`.
            // * Add `userId`.
            identify: function (userId, traits) {

                if (!userId)
                  return; // don't do anything if we just have traits.

                window.intercomSettings = {
                    app_id      : this.settings.appId,
                    user_id     : userId,
                    custom_data : traits || {},
                };

                if (traits) {
                    if (traits.email)
                        window.intercomSettings.email = traits.email;
                    if (traits.name)
                        window.intercomSettings.name = traits.name;
                    if (traits.createdAt) {
                        window.intercomSettings.created_at = getSeconds(traits.createdAt);
                    }

                } else if (basicEmailRegex.test(userId))
                    window.intercomSettings.email = userId;

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
        },


        // Customer.io
        // ----------
        // _Last updated: December 6th, 2012_
        //
        // [Documentation](http://customer.io/docs/api/javascript.html).

        'Customer.io' : {

            initialize : function (settings) {
                this.settings = settings = resolveSettings(settings, 'siteId');

                var _cio = _cio || [];

                (function() {
                    var a,b,c;a=function(f){return function(){_cio.push([f].
                    concat(Array.prototype.slice.call(arguments,0)))}};b=["identify",
                    "track"];for(c=0;c<b.length;c++){_cio[b[c]]=a(b[c])};
                    var t = document.createElement('script'),
                        s = document.getElementsByTagName('script')[0];
                    t.async = true;
                    t.id    = 'cio-tracker';
                    t.setAttribute('data-site-id', settings.siteId);
                    t.src = 'https://assets.customer.io/assets/track.js';
                    s.parentNode.insertBefore(t, s);
                })();

                window._cio = _cio;
            },

            identify : function (userId, traits) {

                if (!userId) // don't do anything if we have no userId
                    return;

                traits = traits || {};
                var properties = clone(traits);
                properties.id = userId;
                if (properties.email === undefined && basicEmailRegex.test(userId))
                    properties.email = userId;
                if (properties.lastSeen)
                    properties.created_at = getSeconds(properties.lastSeen);

                window._cio.identify(properties);
            },

            track : function (event, properties) {
                window._cio.track(event, properties);
            }
        },


        // CrazyEgg.com
        // ----------
        // _Last updated: December 6th, 2012_
        // API Key is the xxxx/xxxx in "//dnn506yrbagrg.cloudfront.net/pages/scripts/xxxx/xxxx.js"
        // [Documentation](www.crazyegg.com).

        'CrazyEgg' : {

            initialize : function (settings) {
                this.settings = settings = resolveSettings(settings, 'apiKey');

                (function(){
                    var a=document.createElement("script");
                    var b=document.getElementsByTagName("script")[0];
                    a.src=document.location.protocol+"//dnn506yrbagrg.cloudfront.net/pages/scripts/"+settings.apiKey+".js?"+Math.floor(new Date().getTime()/3600000);
                    a.async=true;a.type="text/javascript";b.parentNode.insertBefore(a,b);
                })();
            }
        },



        // Olark
        // -----
        // _Last updated: October 11th, 2012_
        //
        // [Documentation](http://www.olark.com/documentation).

        'Olark' : {

            // Changes to the Olark snippet:
            //
            // * Removed `CDATA` tags.
            // * Add `siteId` from stored `settings`.
            // * Added `window.` before `olark.identify`.
            initialize : function (settings) {
                this.settings = settings = resolveSettings(settings, 'siteId');

                window.olark||(function(c){var f=window,d=document,l=f.location.protocol=="https:"?"https:":"http:",z=c.name,r="load";var nt=function(){f[z]=function(){(a.s=a.s||[]).push(arguments)};var a=f[z]._={},q=c.methods.length;while(q--){(function(n){f[z][n]=function(){f[z]("call",n,arguments)}})(c.methods[q])}a.l=c.loader;a.i=nt;a.p={0:+new Date};a.P=function(u){a.p[u]=new Date-a.p[0]};function s(){a.P(r);f[z](r)}f.addEventListener?f.addEventListener(r,s,false):f.attachEvent("on"+r,s);var ld=function(){function p(hd){hd="head";return["<",hd,"></",hd,"><",i,' onl' + 'oad="var d=',g,";d.getElementsByTagName('head')[0].",j,"(d.",h,"('script')).",k,"='",l,"//",a.l,"'",'"',"></",i,">"].join("")}var i="body",m=d[i];if(!m){return setTimeout(ld,100)}a.P(1);var j="appendChild",h="createElement",k="src",n=d[h]("div"),v=n[j](d[h](z)),b=d[h]("iframe"),g="document",e="domain",o;n.style.display="none";m.insertBefore(n,m.firstChild).id=z;b.frameBorder="0";b.id=z+"-loader";if(/MSIE[ ]+6/.test(navigator.userAgent)){b.src="javascript:false"}b.allowTransparency="true";v[j](b);try{b.contentWindow[g].open()}catch(w){c[e]=d[e];o="javascript:var d="+g+".open();d.domain='"+d.domain+"';";b[k]=o+"void(0);"}try{var t=b.contentWindow[g];t.write(p());t.close()}catch(x){b[k]=o+'d.write("'+p().replace(/"/g,String.fromCharCode(92)+'"')+'");d.close();'}a.P(2)};ld()};nt()})({loader: "static.olark.com/jsclient/loader0.js",name:"olark",methods:["configure","extend","declare","identify"]});
                window.olark.identify(settings.siteId);
            },

            identify : function (userId, traits) {
                if (!userId)
                    return;

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

        },


        // Chartbeat
        // ---------
        // _Last updated: November 27th, 2012_
        //
        // [Documentation](http://chartbeat.com/docs/adding_the_code/),
        // [documentation](http://chartbeat.com/docs/configuration_variables/),
        // [documentation](http://chartbeat.com/docs/handling_virtual_page_changes/).

        'Chartbeat' : {

            // Changes to the Chartbeat snippet:
            //
            // * Add `apiKey` and `domain` variables to config.
            // * Added conditionals for extra settings.
            // * Replaced the date with our stored `date` variable.
            // * Dealt with reliance on window.onload, so that Chartbeat can be
            //   initialized after the page has loaded.
            //
            // Also, we don't need to set the `mixpanel` object on `window` because
            // they already do that.
            initialize : function (settings) {
                this.settings = settings = resolveSettings(settings, 'uid');

                var _sf_async_config={};
                /** CONFIGURATION START **/
                _sf_async_config.uid    = settings.uid;
                _sf_async_config.domain = settings.domain || window.location.host;
                if (settings.path)         _sf_async_config.path         = settings.path;
                if (settings.title)        _sf_async_config.title        = settings.title;
                if (settings.useCanonical) _sf_async_config.useCanonical = settings.useCanonical;
                if (settings.sections)     _sf_async_config.sections     = settings.sections;
                if (settings.authors)      _sf_async_config.authors      = settings.authors;
                if (settings.noCookies)    _sf_async_config.noCookies    = settings.noCookies;
                /** CONFIGURATION END **/
                (function(){
                    window._sf_endpt = date.getTime();
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
        }
    };


}).call(this);