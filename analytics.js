//     Analytics.js 0.2.0

//     (c) 2012 Segment.io Inc.
//     Analytics.js may be freely distributed under the MIT license.

// available providers keyed by provider id
var availableProviders = require('./providers');

var clone = require('./util').clone;

// Whether analytics.js has been initialized.
var initialized = false;

// Store window.onload state so that analytics that rely on it can be loaded
// even after onload fires.
var loaded = false;
var oldonload = window.onload;
window.onload = function () {
    loaded = true;
    if (isFunction(oldonload)) oldonload();
};

// Analytics
// =========

// The `analytics` object that will be exposed to you on the global object.
module.exports = {

    // A list of providers that have been initialized.
    providers : [],

    // A `userId` to save.
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
        this.providers = [];
        for (var key in providers) {
            var provider = availableProviders[key];

            if (!provider) throw new Error('Could not find a provider named "'+key+'"');

            provider.initialize(resolveSettings(providers[key], provider.keyField));
            this.providers.push(provider);
        }

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
            provider.identify(userId, clone(traits));
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
            provider.track(event, clone(properties));
        }
    }
};

// Helpers
// =======

// Type detection helpers, copied from
// [underscore](https://github.com/documentcloud/underscore/blob/master/underscore.js#L928-L938).
var isObject = function (obj) {
    return obj === Object(obj);
};
var isString = function (obj) {
    return Object.prototype.toString.call(obj) === '[object String]';
};
var isFunction = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Function]';
};

// A helper to resolve a settings object. It allows for `settings` to be a
// string in the case of using the shorthand where just an api key is
// passed. `fieldName` is what the provider calls their api key.
var resolveSettings = function (settings, fieldName) {
    if (!isString(settings) && !isObject(settings))
        throw new Error('Could not resolve settings.');
    if (!fieldName)
        throw new Error('You must provide an api key field name.');

    // Settings is just an api key.
    if (isString(settings)) {
        var apiKey = settings;
        settings = {};
        settings[fieldName] = apiKey;
    }

    return settings;
};

