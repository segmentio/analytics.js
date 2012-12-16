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


