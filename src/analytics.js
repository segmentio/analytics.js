var after          = require('after')
  , bind           = require('event').bind
  , clone          = require('clone')
  , each           = require('each')
  , extend         = require('extend')
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


function Analytics (Providers) {
  this.VERSION = '0.8.8';

  var self = this;
  // Loop through and add each of our `Providers`, so they can be initialized
  // later by the user.
  each(Providers, function (key, Provider) {
    self.addProvider(key, Provider);
  });
  // Wrap any existing `onload` function with our own that will cache the
  // loaded state of the page.
  var oldonload = window.onload;
  window.onload = function () {
    self.loaded = true;
    if (type(oldonload) === 'function') oldonload();
  };
}


// Add to the `Analytics` prototype.
extend(Analytics.prototype, {

  // Providers that can be initialized. Add using `this.addProvider`.
  initializableProviders : {},

  // Store the date when the page loaded, for services that depend on it.
  date : new Date(),

  // Store window.onload state so that analytics that rely on it can be loaded
  // even after onload fires.
  loaded : false,

  // Whether analytics.js has been initialized with providers.
  initialized : false,

  // Whether all of our providers have loaded.
  isReady : false,

  // A queue for storing `ready` callback functions to get run when
  // analytics have been initialized.
  readyCallbacks : [],

  // The amount of milliseconds to wait for requests to providers to clear
  // before navigating away from the current page.
  timeout : 300,

  // Ability to access the user object.
  // TODO: Should be removed eventually
  user : user,

  providers : [],

  Provider : Provider,

  // Adds a provider to the list of available providers that can be
  // initialized.
  addProvider : function (name, Provider) {
    this.initializableProviders[name] = Provider;
    // add the provider's name so that we can later match turned
    // off providers to their context map position
    Provider.prototype.name = name;
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
  initialize : function (providers, options) {
    var self = this;

    // Reset our state.
    this.providers = [];
    this.initialized = false;
    this.isReady = false;

    // Set the user options, and load the user from our cookie.
    user.options(options);
    user.load();

    // Create a ready method that will run after all of our providers have been
    // initialized and loaded. We'll pass the function into each provider's
    // initialize method, so they can callback when they've loaded successfully.
    var ready = after(size(providers), function () {
      self.isReady = true;
      // Take each callback off the queue and call it.
      var callback;
      while(callback = self.readyCallbacks.shift()) {
        callback();
      }
    });

    // Initialize a new instance of each provider with their `options`, and
    // copy the provider into `this.providers`.
    each(providers, function (key, options) {
      var Provider = self.initializableProviders[key];
      if (!Provider) throw new Error('Could not find a provider named "'+key+'"');

      self.providers.push(new Provider(options, ready));
    });

    // Identify/track any `ajs_uid` and `ajs_event` parameters in the URL.
    var query = url.parse(window.location.href).query;
    var queries = querystring.parse(query);
    if (queries.ajs_uid) this.identify(queries.ajs_uid);
    if (queries.ajs_event) this.track(queries.ajs_event);

    // Update the initialized state that other methods rely on.
    this.initialized = true;
  },


  // Ready
  // -----
  // Ready lets you pass in a callback that will get called when your
  // analytics services have been initialized. It's like jQuery's `ready`
  // expect for analytics instead of the DOM.
  ready : function (callback) {
    if (type(callback) !== 'function') return;

    // If we're already initialized, do it right away. Otherwise, add it to the
    // queue for when we do get initialized.
    if (this.isReady) {
      callback();
    } else {
      this.readyCallbacks.push(callback);
    }
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
  // * `context` (optional) is a dictionary of options that provide more
  // information to the providers about this identify.
  //  * `providers` {optional}: a dictionary of provider names to a
  //  boolean specifying whether that provider will receive this identify.
  //
  // * `callback` (optional) is a function to call after the a small
  // timeout to give the identify requests a chance to be sent.
  identify : function (userId, traits, context, callback) {
    if (!this.initialized) return;

    // Allow for not passing context, but passing a callback.
    if (type(context) === 'function') {
      callback = context;
      context = null;
    }

    // Allow for not passing traits, but passing a callback.
    if (type(traits) === 'function') {
      callback = traits;
      traits = null;
    }

    // Allow for identifying traits without setting a `userId`, for
    // anonymous users whose traits you learn.
    if (type(userId) === 'object') {
      if (traits && type(traits) === 'function') callback = traits;
      traits = userId;
      userId = null;
    }

    // Use the saved userId.
    if (userId === null) userId = user.id();

    // Update the cookie with new userId and traits.
    var alias = user.update(userId, traits);

    // Before we manipulate traits, clone it so we don't do anything uncouth.
    traits = clone(traits);

    // Create a function to convert `created` date formats to date objects
    var convertCreatedToDate = function (created) {
      // Test for a `created` that's a valid date string
      if (type(created) === 'string' && Date.parse(created)) {
        return new Date(created);
      }
      // Test for a `created` that's a number.
      else if (type(created) === 'number') {
        // If the "created" number has units of "seconds since the epoch" then it will
        // certainly be less than 31557600000 seconds (January 7, 2970).
        if (created < 31557600000) {
          return new Date(created * 1000);
        }
        // If the "created" number has units of "milliseconds since the epoch" then it
        // will certainly be greater than 31557600000 milliseconds (December 31, 1970).
        else {
          return new Date(created);
        }
      }
      else {
        return created;
      }
    };

    // Test for a `created` that's a valid date string or number and convert it.
    if (traits && traits.created) {
      traits.created = convertCreatedToDate(traits.created);
    }

    // Test for a `created` on traits.company that's a valid date string or number and convert it
    if (traits && traits.company && traits.company.created) {
      traits.company.created = convertCreatedToDate(traits.company.created);
    }

    // Call `identify` on all of our enabled providers that support it.
    each(this.providers, function (provider) {
      if (provider.identify && utils.isEnabled(provider, context)) {
        var args = [userId, clone(traits), clone(context)];

        if (provider.ready) provider.identify.apply(provider, args);
        else provider.enqueue('identify', args);
      }
    });

    // TODO: auto-alias once mixpanel API doesn't error
    // If we should alias, go ahead and do it.
    // if (alias) this.alias(userId);

    if (callback && type(callback) === 'function') {
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
  // * `context` (optional) is a dictionary of options that provide more
  // information to the providers about this track.
  //  * `providers` {optional}: a dictionary of provider names to a
  //  boolean specifying whether that provider will receive this track.
  //
  // * `callback` (optional) is a function to call after the a small
  // timeout to give the track requests a chance to be sent.
  track : function (event, properties, context, callback) {
    if (!this.initialized) return;

    // Allow for not passing context, but passing a callback.
    if (type(context) === 'function') {
      callback = context;
      context = null;
    }

    // Allow for not passing properties, but passing a callback.
    if (type(properties) === 'function') {
      callback = properties;
      properties = null;
    }

    // Call `track` on all of our enabled providers that support it.
    each(this.providers, function (provider) {
      if (provider.track && utils.isEnabled(provider, context)) {
        var args = [event, clone(properties), clone(context)];

        if (provider.ready) provider.track.apply(provider, args);
        else provider.enqueue('track', args);
      }
    });

    if (callback && type(callback) === 'function') {
      setTimeout(callback, this.timeout);
    }
  },


  // ### trackLink
  // A helper for tracking outbound links that would normally leave the
  // page before the track calls went out. It works by wrapping the calls
  // in as short of a timeout as possible to fire the track call, because
  // [response times matter](http://theixdlibrary.com/pdf/Miller1968.pdf).
  //
  // * `links` is either a single link DOM element, or an array of link
  // elements like jQuery gives you.
  //
  // * `event` and `properties` are passed directly to `analytics.track`
  // and take the same options. `properties` can also be a function that
  // will get passed the link that was clicked, and should return a
  // dictionary of event properties.
  trackLink : function (links, event, properties) {
    if (!links) return;

    // Turn a single link into an array so that we're always handling
    // arrays, which allows for passing jQuery objects.
    if (utils.isElement(links)) links = [links];

    var self       = this
      , isFunction = 'function' === type(properties);

    // Bind to all the links in the array.
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
        // than miss a case that breaks the experience.
        if (el.href && el.target !== '_blank' && !utils.isMeta(e)) {

          preventDefault(e);

          // Navigate to the url after a small timeout, giving the providers
          // time to track the event.
          setTimeout(function () {
            window.location.href = el.href;
          }, self.timeout);
        }
      });
    });
  },


  // ### trackForm
  // Similar to `trackClick`, this is a helper for tracking form
  // submissions that would normally leave the page before a track call
  // can be sent. It works by preventing the default submit, sending a
  // track call, and then submitting the form programmatically.
  //
  // * `forms` is either a single form DOM element, or an array of
  // form elements like jQuery gives you.
  //
  // * `event` and `properties` are passed directly to `analytics.track`
  // and take the same options. `properties` can also be a function that
  // will get passed the form that was submitted, and should return a
  // dictionary of event properties.
  trackForm : function (form, event, properties) {
    if (!form) return;

    // Turn a single element into an array so that we're always handling arrays,
    // which allows for passing jQuery objects.
    if (utils.isElement(form)) form = [form];

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
      // fire submit handlers, which is what jQuery has to user internally. >_<
      var dom = window.jQuery || window.Zepto;
      if (dom)
        dom(el).submit(handler);
      else
        bind(el, 'submit', handler);
    });
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
    each(this.providers, function (provider) {
      if (provider.pageview) {
        if (provider.ready) provider.pageview(url);
        else provider.enqueue('pageview', [url]);
      }
    });
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
    each(this.providers, function (provider) {
      if (provider.alias) {
        if (provider.ready) provider.alias(newId, originalId);
        else provider.enqueue('alias', [newId, originalId]);
      }
    });
  }

});


// Alias `trackClick` and `trackSubmit` for backwards compatibility.
Analytics.prototype.trackClick = Analytics.prototype.trackLink;
Analytics.prototype.trackSubmit = Analytics.prototype.trackForm;
