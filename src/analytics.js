var after          = require('after')
  , bind           = require('event').bind
  , clone          = require('clone')
  , each           = require('each')
  , extend         = require('extend')
  , isMeta         = require('is-meta')
  , newDate        = require('new-date')
  , size           = require('object').length
  , preventDefault = require('prevent')
  , Provider       = require('./provider')
  , providers      = require('./providers')
  , querystring    = require('querystring')
  , type           = require('type')
  , url            = require('url')
  , user           = require('./user')
  , utils          = require('./utils');


module.exports = Analytics;


/**
 * Analytics.
 *
 * @param {Object} Providers - Provider classes that the user can initialize.
 */

function Analytics (Providers) {
  var self = this;

  this.VERSION = '0.9.15';

  each(Providers, function (Provider) {
    self.addProvider(Provider);
  });

  // Wrap `onload` with our own that will cache the loaded state of the page.
  var oldonload = window.onload;
  window.onload = function () {
    self.loaded = true;
    if ('function' === type(oldonload)) oldonload();
  };
}


/**
 * Extend the Analytics prototype.
 */

extend(Analytics.prototype, {

  // Whether `onload` has fired.
  loaded : false,

  // Whether `analytics` has been initialized.
  initialized : false,

  // Whether all of our analytics providers are ready to accept calls. Give it a
  // real jank name since we already use `analytics.ready` for the method.
  readied : false,

  // A queue for ready callbacks to run when our `readied` state becomes `true`.
  callbacks : [],

  // Milliseconds to wait for requests to clear before leaving the current page.
  timeout : 300,

  // A reference to the current user object.
  user : user,

  // The default Provider.
  Provider : Provider,

  // Providers that can be initialized. Add using `this.addProvider`.
  _providers : {},

  // The currently initialized providers.
  providers : [],


  /**
   * Add a provider to `_providers` to be initialized later.
   *
   * @param {String} name - The name of the provider.
   * @param {Function} Provider - The provider's class.
   */

  addProvider : function (Provider) {
    this._providers[Provider.prototype.name] = Provider;
  },


  /**
   * Initialize
   *
   * Call `initialize` to setup analytics.js before identifying or
   * tracking any users or events. For example:
   *
   *     analytics.initialize({
   *         'Google Analytics' : 'UA-XXXXXXX-X',
   *         'Segment.io'       : 'XXXXXXXXXXX',
   *         'KISSmetrics'      : 'XXXXXXXXXXX'
   *     });
   *
   * @param {Object} providers - a dictionary of the providers you want to
   * enable. The keys are the names of the providers and their values are either
   * an api key, or  dictionary of extra settings (including the api key).
   *
   * @param {Object} options (optional) - extra settings to initialize with.
   */

  initialize : function (providers, options) {
    var self = this;

    // Reset our state.
    this.providers = [];
    this.initialized = false;
    this.readied = false;

    // Set the user options, and load the user from our cookie.
    user.options(options);
    user.load();

    // Create a ready method that will call all of our ready callbacks after all
    // of our providers have been initialized and loaded. We'll pass the
    // function into each provider's initialize method, so they can callback
    // after they've loaded successfully.
    var ready = after(size(providers), function () {
      self.readied = true;
      var callback;
      while(callback = self.callbacks.shift()) {
        callback();
      }
    });

    // Initialize a new instance of each provider with their `options`, and
    // copy the provider into `this.providers`.
    each(providers, function (key, options) {
      var Provider = self._providers[key];
      if (!Provider) throw new Error('Couldnt find a provider named "'+key+'"');
      self.providers.push(new Provider(options, ready));
    });

    // Identify and track any `ajs_uid` and `ajs_event` parameters in the URL.
    var query = url.parse(window.location.href).query;
    var queries = querystring.parse(query);
    if (queries.ajs_uid) this.identify(queries.ajs_uid);
    if (queries.ajs_event) this.track(queries.ajs_event);

    // Update the initialized state that other methods rely on.
    this.initialized = true;
  },


  /**
   * Ready
   *
   * Add a callback that will get called when all of the analytics services you
   * initialize are ready to be called. It's like jQuery's `ready` except for
   * analytics instead of the DOM.
   *
   * If we're already ready, it will callback immediately.
   *
   * @param {Function} callback - The callback to attach.
   */

  ready : function (callback) {
    if (type(callback) !== 'function') return;
    if (this.readied) return callback();
    this.callbacks.push(callback);
  },


  /**
   * Identify
   *
   * Identifying a user ties all of their actions to an ID you recognize
   * and records properties about a user. For example:
   *
   *     analytics.identify('4d3ed089fb60ab534684b7e0', {
   *         name  : 'Achilles',
   *         email : 'achilles@segment.io',
   *         age   : 23
   *     });
   *
   * @param {String} userId (optional) - The ID you recognize the user by.
   * Ideally this isn't an email, because that might change in the future.
   *
   * @param {Object} traits (optional) - A dictionary of traits you know about
   * the user. Things like `name`, `age`, etc.
   *
   * @param {Object} options (optional) - Settings for the identify call.
   *
   * @param {Function} callback (optional) - A function to call after a small
   * timeout, giving the identify time to make requests.
   */

  identify : function (userId, traits, options, callback) {
    if (!this.initialized) return;

    // Allow for optional arguments.
    if (type(options) === 'function') {
      callback = options;
      options = undefined;
    }
    if (type(traits) === 'function') {
      callback = traits;
      traits = undefined;
    }
    if (type(userId) === 'object') {
      if (traits && type(traits) === 'function') callback = traits;
      traits = userId;
      userId = undefined;
    }

    // Use our cookied ID if they didn't provide one.
    if (userId === undefined || user === null) userId = user.id();

    // Update the cookie with the new userId and traits.
    var alias = user.update(userId, traits);

    // Clone `traits` before we manipulate it, so we don't do anything uncouth
    // and take the user.traits() so anonymous users carry over traits.
    traits = clone(user.traits());

    // Convert dates from more types of input into Date objects.
    if (traits && traits.created) traits.created = newDate(traits.created);
    if (traits && traits.company && traits.company.created) {
      traits.company.created = newDate(traits.company.created);
    }

    // Call `identify` on all of our enabled providers that support it.
    each(this.providers, function (provider) {
      if (provider.identify && isEnabled(provider, options)) {
        var args = [userId, clone(traits), clone(options)];
        if (provider.ready) {
          provider.identify.apply(provider, args);
        } else {
          provider.enqueue('identify', args);
        }
      }
    });

    // If we should alias, go ahead and do it.
    // if (alias) this.alias(userId);

    if (callback && type(callback) === 'function') {
      setTimeout(callback, this.timeout);
    }
  },


  /**
   * Track
   *
   * Record an event (or action) that your user has triggered. For example:
   *
   *     analytics.track('Added a Friend', {
   *         level  : 'hard',
   *         volume : 11
   *     });
   *
   * @param {String} event - The name of your event.
   *
   * @param {Object} properties (optional) - A dictionary of properties of the
   * event. `properties` are all camelCase (we'll automatically conver them to
   * the proper case each provider needs).
   *
   * @param {Object} options (optional) - Settings for the track call.
   *
   * @param {Function} callback - A function to call after a small
   * timeout, giving the identify time to make requests.
   */

  track : function (event, properties, options, callback) {
    if (!this.initialized) return;

    // Allow for optional arguments.
    if (type(options) === 'function') {
      callback = options;
      options = undefined;
    }
    if (type(properties) === 'function') {
      callback = properties;
      properties = undefined;
    }

    // Call `track` on all of our enabled providers that support it.
    each(this.providers, function (provider) {
      if (provider.track && isEnabled(provider, options)) {
        var args = [event, clone(properties), clone(options)];
        if (provider.ready) {
          provider.track.apply(provider, args);
        } else {
          provider.enqueue('track', args);
        }
      }
    });

    if (callback && type(callback) === 'function') {
      setTimeout(callback, this.timeout);
    }
  },


  /**
   * Track Link
   *
   * A helper for tracking outbound links that would normally navigate away from
   * the page before the track requests were made. It works by wrapping the
   * calls in a short timeout, giving the requests time to fire.
   *
   * @param {Element|Array} links - The link element or array of link elements
   * to bind to. (Allowing arrays makes it easy to pass in jQuery objects.)
   *
   * @param {String} event - Passed directly to `track`.
   *
   * @param {Object} properties (optional) - Passed directly to `track`.
   */

  trackLink : function (links, event, properties) {
    if (!links) return;

    // Turn a single link into an array so that we're always handling
    // arrays, which allows for passing jQuery objects.
    if ('element' === type(links)) links = [links];

    var self       = this
      , isFunction = 'function' === type(properties);

    each(links, function (el) {
      bind(el, 'click', function (e) {

        // Allow for properties to be a function. And pass it the
        // link element that was clicked.
        var props = isFunction ? properties(el) : properties;

        self.track(event, props);

        // To justify us preventing the default behavior we must:
        //
        // * Have an `href` to use.
        // * Not have a `target="_blank"` attribute.
        // * Not have any special keys pressed, because they might be trying to
        //   open in a new tab, or window, or download.
        //
        // This might not cover all cases, but we'd rather throw out an event
        // than miss a case that breaks the user experience.
        if (el.href && el.target !== '_blank' && !isMeta(e)) {

          preventDefault(e);

          // Navigate to the url after just enough of a timeout.
          setTimeout(function () {
            window.location.href = el.href;
          }, self.timeout);
        }
      });
    });
  },


  /**
   * Track Form
   *
   * Similar to `trackClick`, this is a helper for tracking form submissions
   * that would normally navigate away from the page before a track request can
   * be sent. It works by preventing the default submit event, sending our
   * track requests, and then submitting the form programmatically.
   *
   * @param {Element|Array} forms - The form element or array of form elements
   * to bind to. (Allowing arrays makes it easy to pass in jQuery objects.)
   *
   * @param {String} event - Passed directly to `track`.
   *
   * @param {Object} properties (optional) - Passed directly to `track`.
   */

  trackForm : function (form, event, properties) {
    if (!form) return;

    // Turn a single element into an array so that we're always handling arrays,
    // which allows for passing jQuery objects.
    if ('element' === type(form)) form = [form];

    var self       = this
      , isFunction = 'function' === type(properties);

    each(form, function (el) {
      var handler = function (e) {

        // Allow for properties to be a function. And pass it the form element
        // that was submitted.
        var props = isFunction ? properties(el) : properties;

        self.track(event, props);

        preventDefault(e);

        // Submit the form after a timeout, giving the event time to fire.
        setTimeout(function () {
          el.submit();
        }, self.timeout);
      };

      // Support the form being submitted via jQuery instead of for real. This
      // doesn't happen automatically because `el.submit()` doesn't actually
      // fire submit handlers, which is what jQuery uses internally. >_<
      var dom = window.jQuery || window.Zepto;
      if (dom) {
        dom(el).submit(handler);
      } else {
        bind(el, 'submit', handler);
      }
    });
  },


  /**
   * Pageview
   *
   * Simulate a pageview in single-page applications, where real pageviews don't
   * occur. This isn't support by all providers.
   *
   * @param {String} url (optional) - The path of the page (eg. '/login'). Most
   * providers will default to the current pages URL, so you don't need this.
   */

  pageview : function (url) {
    if (!this.initialized) return;

    // Call `pageview` on all of our enabled providers that support it.
    each(this.providers, function (provider) {
      if (provider.pageview) {
        var args = [url];
        if (provider.ready) {
          provider.pageview.apply(provider, args);
        } else {
          provider.enqueue('pageview', args);
        }
      }
    });
  },


  /**
   * Alias
   *
   * Merges two previously unassociate user identities. This comes in handy if
   * the same user visits from two different devices and you want to combine
   * their analytics history.
   *
   * Some providers don't support merging users.
   *
   * @param {String} newId - The new ID you want to recognize the user by.
   *
   * @param {String} originalId (optional) - The original ID that the user was
   * recognized by. This defaults to the current identified user's ID if there
   * is one. In most cases you don't need to pass in the `originalId`.
   */

  alias : function (newId, originalId, options) {
    if (!this.initialized) return;

    if (type(originalId) === 'object') {
      options    = originalId;
      originalId = undefined;
    }

    // Call `alias` on all of our enabled providers that support it.
    each(this.providers, function (provider) {
      if (provider.alias && isEnabled(provider, options)) {
        var args = [newId, originalId];
        if (provider.ready) {
          provider.alias.apply(provider, args);
        } else {
          provider.enqueue('alias', args);
        }
      }
    });
  },


  /**
   * Log
   *
   * Log an error to analytics providers that support it, like Sentry.
   *
   * @param {Error|String} error - The error or string to log.
   * @param {Object} properties - Properties about the error.
   * @param {Object} options (optional) - Settings for the log call.
   */

  log : function (error, properties, options) {
    if (!this.initialized) return;

    each(this.providers, function (provider) {
      if (provider.log && isEnabled(provider, options)) {
        var args = [error, properties, options];
        if (provider.ready) {
          provider.log.apply(provider, args);
        } else {
          provider.enqueue('log', args);
        }
      }
    });
  }

});


/**
 * Backwards compatibility.
 */

// Alias `trackClick` and `trackSubmit`.
Analytics.prototype.trackClick = Analytics.prototype.trackLink;
Analytics.prototype.trackSubmit = Analytics.prototype.trackForm;


/**
 * Determine whether a provider is enabled or not based on the options object.
 *
 * @param {Object} provider - the current provider.
 * @param {Object} options - the current call's options.
 *
 * @return {Boolean} - wether the provider is enabled.
 */

var isEnabled = function (provider, options) {
  var enabled = true;
  if (!options || !options.providers) return enabled;

  // Default to the 'all' or 'All' setting.
  var map = options.providers;
  if (map.all !== undefined) enabled = map.all;
  if (map.All !== undefined) enabled = map.All;

  // Look for this provider's specific setting.
  var name = provider.name;
  if (map[name] !== undefined) enabled = map[name];

  return enabled;
};
