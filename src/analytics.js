//     Analytics.js 0.5.1

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

        // The amount of milliseconds to wait for requests to providers to clear
        // before navigating away from the current page.
        timeout : 300,


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
        //
        // * `traits` (optional) is a dictionary of traits to tie your user.
        // Things like `name`, `age` or `friendCount`. If you have them, you
        // should always store a `name` and `email`.
        //
        // * `callback` (optional) is a function to call after the a small
        // timeout to give the identify requests a chance to be sent.
        identify : function (userId, traits, callback) {
            if (!this.initialized) return;

            // Allow for not passing traits, but passing a callback.
            if (this.utils.isFunction(traits)) {
                callback = traits;
                traits = null;
            }

            // Allow for identifying traits without setting a `userId`, for
            // anonymous users whose traits you learn.
            if (this.utils.isObject(userId)) {
                if (traits && this.utils.isFunction(traits)) callback = traits;
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

            if (callback && this.utils.isFunction(callback)) {
                setTimeout(callback, this.timeout);
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
        //
        // * `properties` (optional) is a dictionary of properties of the event.
        // Property keys are all camelCase (we'll alias to non-camelCase for
        // you automatically for providers that require it).
        //
        // * `callback` (optional) is a function to call after the a small
        // timeout to give the track requests a chance to be sent.
        track : function (event, properties, callback) {
            if (!this.initialized) return;

            // Allow for not passing properties, but passing a callback.
            if (this.utils.isFunction(properties)) {
                callback = properties;
                properties = null;
            }

            // Call `track` on all of our enabled providers that support it.
            for (var i = 0, provider; provider = this.providers[i]; i++) {
                if (!provider.track) continue;
                provider.track(event, this.utils.clone(properties));
            }

            if (callback && this.utils.isFunction(callback)) {
                setTimeout(callback, this.timeout);
            }
        },


        // ### trackLink

        // A helper for tracking outbound links that would normally leave the
        // page before the track calls went out. It works by wrapping the calls
        // in as short of a timeout as possible to fire the track call, because
        // [response times matter](http://theixdlibrary.com/pdf/Miller1968.pdf).
        //
        // * `link` is either a single link DOM element, or an array of link
        // elements like jQuery gives you.
        //
        // * `event` and `properties` are passed directly to `analytics.track`
        // and take the same options. `properties` can also be a function that
        // will get passed the link that was clicked, and should return a
        // dictionary of event properties.
        trackLink : function (link, event, properties) {
            if (!link) return;

            // Turn a single link into an array so that we're always handling
            // arrays, which allows for passing jQuery objects.
            if (this.utils.isElement(link)) link = [link];

            var self = this;

            // Bind to all the links in the array.
            for (var i = 0; i < link.length; i++) {
                (function (el) {
                    self.utils.bind(el, 'click', function (e) {

                        // Allow for properties to be a function. And pass it the
                        // link element that was clicked.
                        if (self.utils.isFunction(properties)) properties = properties(el);

                        // Fire a normal track call.
                        self.track(event, properties);

                        // To justify us preventing the default behavior we must:
                        //
                        // * Have an `href` to use.
                        // * Not have a `target="_blank"` attribute.
                        // * Not have any special keys pressed, because they might
                        // be trying to open in a new tab, or window, or download
                        // the asset.
                        //
                        // This might not cover all cases, but we'd rather throw out
                        // an event than miss a case that breaks the experience.
                        if (el.href && el.target !== '_blank' && !self.utils.isMeta(e)) {

                            // Prevent the link's default redirect in all the sane
                            // browsers, and also IE.
                            if (e.preventDefault)
                                e.preventDefault();
                            else
                                e.returnValue = false;

                            // Navigate to the url after a small timeout, giving the
                            // providers time to track the event.
                            setTimeout(function () {
                                window.location.href = el.href;
                            }, self.timeout);
                        }
                    });
                })(link[i]);
            }
        },


        // ### trackForm

        // Similar to `trackClick`, this is a helper for tracking form
        // submissions that would normally leave the page before a track call
        // can be sent. It works by preventing the default submit, sending a
        // track call, and then submitting the form programmatically.
        //
        // * `form` is either a single form DOM element, or an array of
        // form elements like jQuery gives you.
        //
        // * `event` and `properties` are passed directly to `analytics.track`
        // and take the same options. `properties` can also be a function that
        // will get passed the form that was submitted, and should return a
        // dictionary of event properties.
        trackForm : function (form, event, properties) {
            if (!form) return;

            // Turn a single element into an array so that we're always handling
            // arrays, which allows for passing jQuery objects.
            if (this.utils.isElement(form)) form = [form];

            var self = this;

            // Bind to all the forms in the array.
            for (var i = 0; i < form.length; i++) {
                (function (el) {
                    self.utils.bind(el, 'submit', function (e) {

                        // Allow for properties to be a function. And pass it the
                        // form element that was submitted.
                        if (self.utils.isFunction(properties)) properties = properties(el);

                        // Fire a normal track call.
                        self.track(event, properties);

                        // Prevent the form's default submit in all the sane
                        // browsers, and also IE.
                        if (e.preventDefault)
                            e.preventDefault();
                        else
                            e.returnValue = false;

                        // Submit the form after a small timeout, giving the event
                        // time to get fired.
                        setTimeout(function () {
                            el.submit();
                        }, self.timeout);
                    });
                })(form[i]);
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
        //
        // * `url` (optional) is the url path that you want to be associated
        // with the page. You only need to pass this argument if the URL hasn't
        // changed but you want to register a new pageview.
        pageview : function (url) {
            if (!this.initialized) return;

            // Call `pageview` on all of our enabled providers that support it.
            for (var i = 0, provider; provider = this.providers[i]; i++) {
                if (!provider.pageview) continue;
                provider.pageview(url);
            }
        },


        // Alias
        // -----

        // Alias combines two previously unassociated user identities. This
        // comes in handy if the same user visits from two different devices and
        // you want to combine their history. Some providers also don't alias
        // automatically for you when an anonymous user signs up (like
        // Mixpanel), so you need to call `alias` manually right after sign up
        // with their brand new `userId`.
        //
        // * `newId` is the new ID you want to associate the user with.
        //
        // * `originalId` (optional) is the original ID that the user was
        // recognized by. This defaults to the currently identified user's ID if
        // there is one. In most cases you don't need to pass this argument.
        alias : function (newId, originalId) {
            if (!this.initialized) return;

            // Call `alias` on all of our enabled providers that support it.
            for (var i = 0, provider; provider = this.providers[i]; i++) {
                if (!provider.alias) continue;
                provider.alias(newId, originalId);
            }
        },


        // Utils
        // -----

        utils : {

            // Attach an event handler to a DOM element, even in IE.
            bind : function (el, event, callback) {
                if (el.addEventListener) {
                    el.addEventListener(event, callback, false);
                } else if (el.attachEvent) {
                    el.attachEvent('on' + event, callback);
                }
            },

            // Given a DOM event, tell us whether a meta key or button was
            // pressed that would make a link open in a new tab, window,
            // start a download, or anything else that wouldn't take the user to
            // a new page.
            isMeta : function (e) {
                if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return true;

                // Logic that handles checks for the middle mouse button, based
                // on [jQuery](https://github.com/jquery/jquery/blob/master/src/event.js#L466).
                var which = e.which, button = e.button;
                if (!which && button !== undefined) {
                    return (!button & 1) && (!button & 2) && (button & 4);
                } else if (which === 2) {
                    return true;
                }

                return false;
            },

            // Given a timestamp, return its value in seconds. For providers
            // that rely on Unix time instead of millis.
            getSeconds : function (time) {
                return Math.floor((new Date(time)) / 1000);
            },

            // A helper to extend objects with properties from other objects.
            // Based off of the [underscore](https://github.com/documentcloud/underscore/blob/master/underscore.js#L763)
            // method.
            extend : function (obj) {
                if (!this.isObject(obj)) return;

                var args = Array.prototype.slice.call(arguments, 1);
                for (var i = 0, source; source = args[i]; i++) {
                    if (!this.isObject(source)) return;

                    for (var property in source) {
                        obj[property] = source[property];
                    }
                }
                return obj;
            },

            // A helper to shallow-ly clone objects, so that they don't get
            // mangled by different analytics providers because of the
            // reference.
            clone : function (obj) {
                if (!obj) return;
                return this.extend({}, obj);
            },

            // A helper to alias certain object's keys to different key names.
            // Useful for abstracting over providers that require specific key
            // names.
            alias : function (obj, aliases) {
                if (!this.isObject(obj)) return;

                for (var prop in aliases) {
                    var alias = aliases[prop];
                    if (obj[prop] !== undefined) {
                        obj[alias] = obj[prop];
                        delete obj[prop];
                    }
                }
            },

            // Type detection helpers, copied from
            // [underscore](https://github.com/documentcloud/underscore/blob/master/underscore.js#L926-L946).
            isElement : function(obj) {
                return !!(obj && obj.nodeType === 1);
            },
            isArray : Array.isArray || function (obj) {
                return Object.prototype.toString.call(obj) === '[object Array]';
            },
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
            },

            // Takes a url and parses out all of the pieces of it. Pulled from
            // [Component's url module](https://github.com/component/url).
            parseUrl : function (url) {
                var a = document.createElement('a');
                a.href = url;
                return {
                    href     : a.href,
                    host     : a.host || location.host,
                    port     : a.port || location.port,
                    hash     : a.hash,
                    hostname : a.hostname || location.hostname,
                    pathname : a.pathname,
                    protocol : !a.protocol || ':' === a.protocol ? location.protocol : a.protocol,
                    search   : a.search,
                    query    : a.search.slice(1)
                };
            },

            // A helper to get cookies
            getCookie : function (name) {
                if (document.cookie.length > 0) {
                    var start = document.cookie.indexOf(name + '=');
                    if (start !== -1) {
                        start = start + name.length + 1;
                        var end = document.cookie.indexOf(";", start);
                        if (end === -1)
                            end = document.cookie.length;
                        return unescape(document.cookie.substring(start, end));
                    }
                }
            },

            // A helper to set cookies
            setCookie : function (name, value, expirationDays) {
                var expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + expirationDays);
                var expirationAndPath = (expirationDays === null ? '' : ';expires=' + expirationDate.toGMTString() + ';path=' + escape('/'));
                document.cookie = name + '=' + escape(value) + expirationAndPath;
            }
        }

    };

    // Add `trackClick` and `trackSubmit` for backwards compatibility.
    analytics.trackClick = analytics.trackLink;
    analytics.trackSubmit = analytics.trackForm;

    // Wrap any existing `onload` function with our own that will cache the
    // loaded state of the page.
    var oldonload = window.onload;
    window.onload = function () {
        analytics.loaded = true;
        if (analytics.utils.isFunction(oldonload)) oldonload();
    };

    window.analytics = analytics;
})();


