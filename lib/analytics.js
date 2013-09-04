
var after = require('after')
  , bind = require('event').bind
  , callback = require('callback')
  , clone = require('clone')
  , cookie = require('./cookie')
  , each = require('each')
  , is = require('is')
  , isEmail = require('is-email')
  , isMeta = require('is-meta')
  , localStore = require('./localStore')
  , map = require('map')
  , newDate = require('new-date')
  , size = require('object').length
  , prevent = require('prevent')
  , Provider = require('./provider')
  , Providers = require('./providers')
  , querystring = require('querystring')
  , user = require('./user');


/**
 * Expose `Analytics`.
 */

module.exports = exports = Analytics;


/**
 * Expose `VERSION`.
 */

exports.VERSION = '0.12.0';


/**
 * Expose `Providers`.
 */

exports.Providers = Providers;


/**
 * Expose the default `Provider`.
 */

exports.Provider = Provider;


/**
 * Define a new `Provider`.
 *
 * @param {Function} Provider
 * @return {Analytics}
 */

exports.provider = function (Provider) {
  var name = Provider.prototype.name;
  Providers[name] = Provider;
  return this;
};


/**
 * Initialize a new `Analytics` instance.
 */

function Analytics () {
  this._callbacks = [];
  this._providers = [];
  this._readied = false;
  this._timeout = 300;
  this._user = user;
}


/**
 * Initialize with the given provider `settings` and `options`. Aliased to
 * `init` for convenience.
 *
 * @param {Object} settings
 * @param {Object} options
 * @return {Analytics}
 */

Analytics.prototype.init =
Analytics.prototype.initialize = function (settings, options) {
  this._options(options);
  this._readied = false;
  this._providers = [];

  // load user now that options are set
  this._user.load();

  // make ready callback
  var self = this;
  var ready = after(size(settings), function () {
    self._readied = true;
    var callback;
    while (callback = self._callbacks.shift()) callback();
  });

  // initialize providers, passing ready
  each(settings, function (name, options) {
    var Provider = self.Providers[name];
    if (!Provider) return self;
    var provider = new Provider(options, ready, self);
    self._providers.push(provider);
  });

  // call any querystring methods if present
  this._parseQuery();

  // backwards compat with angular plugin.
  // TODO: remove
  this.initialized = true;

  return this;
};


/**
 * Identify a user by optional `id` and `traits`.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 * @param {Function} fn (optional)
 * @return {Analytics}
 */

Analytics.prototype.identify = function (id, traits, options, fn) {
  if (is.fn(options)) fn = options, options = undefined;
  if (is.fn(traits)) fn = traits, traits = undefined;
  if (is.object(id)) traits = id, id = user.id();

  this._user.update(id, traits);

  // clone traits before we manipulate so we don't do anything uncouth, and take
  // from `user` so that we carryover anonymous traits
  traits = cleanTraits(id, clone(user.traits()));

  this._invoke('identify', id, traits, options);
  this._callback(fn);
  return this;
};


/**
 * Return the current user.
 *
 * @return {Object}
 */

Analytics.prototype.user = function () {
  return this._user;
};


/**
 * Identify a group by optional `id` and `properties`. Or, if no arguments are
 * supplied, return the current group.
 *
 * @param {String} id
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 * @param {Function} fn (optional)
 * @return {Analytics|Object}
 */

Analytics.prototype.group = function (id, properties, options, fn) {
  if (is.fn(options)) fn = options, options = undefined;
  if (is.fn(properties)) fn = properties, properties = undefined;

  properties = clone(properties) || {};
  if (properties.created) properties.created = newDate(properties.created);

  this._invoke('group', id, properties, options);
  this._callback(fn);
  return this;
};


/**
 * Track an `event` that a user has triggered with optional `properties`.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 * @param {Function} fn (optional)
 * @return {Analytics}
 */

Analytics.prototype.track = function (event, properties, options, fn) {
  if (is.fn(options)) fn = options, options = undefined;
  if (is.fn(properties)) fn = properties, properties = undefined;

  properties = clone(properties) || {};

  this._invoke('track', event, properties, options);
  this._callback(fn);
  return this;
};


/**
 * Helper method to track an outbound link that would normally navigate away
 * from the page before the analytics calls were sent.
 *
 * BACKWARDS COMPATIBILITY: aliased to `trackClick`.
 *
 * @param {Element|Array} links
 * @param {String|Function} event
 * @param {Object|Function} properties (optional)
 * @return {Analytics}
 */

Analytics.prototype.trackClick =
Analytics.prototype.trackLink = function (links, event, properties) {
  if (!links) return this;
  if (is.element(links)) links = [links]; // always arrays, handles jquery

  var self = this;
  each(links, function (el) {
    bind(el, 'click', function (e) {
      var ev = is.fn(event) ? event(el) : event;
      var props = is.fn(properties) ? properties(el) : properties;
      self.track(ev, props);

      if (el.href && el.target !== '_blank' && !isMeta(e)) {
        prevent(e);
        self._callback(function () {
          window.location.href = el.href;
        });
      }
    });
  });

  return this;
};


/**
 * Helper method to track an outbound form that would normally navigate away
 * from the page before the analytics calls were sent.
 *
 * BACKWARDS COMPATIBILITY: aliased to `trackSubmit`.
 *
 * @param {Element|Array} forms
 * @param {String|Function} event
 * @param {Object|Function} properties (optional)
 * @return {Analytics}
 */

Analytics.prototype.trackSubmit =
Analytics.prototype.trackForm = function (forms, event, properties) {
  if (!forms) return this;
  if (is.element(forms)) forms = [forms]; // always arrays, handles jquery

  var self = this;
  each(forms, function (el) {
    function handler (e) {
      prevent(e);

      var ev = is.fn(event) ? event(el) : event;
      var props = is.fn(properties) ? properties(el) : properties;
      self.track(ev, props);

      self._callback(function () {
        el.submit();
      });
    }

    // support the events happening through jQuery or Zepto instead of through
    // the normal DOM API, since `el.submit` doesn't bubble up events...
    var $ = window.jQuery || window.Zepto;
    if ($) {
      $(el).submit(handler);
    } else {
      bind(el, 'submit', handler);
    }
  });

  return this;
};


/**
 * Manually trigger a pageview, useful for single-page apps.
 *
 * @param {String} url (optional)
 * @param {Object} options (optional)
 * @return {Analytics}
 */

Analytics.prototype.pageview = function (url, options) {
  this._invoke('pageview', url, options);
  return this;
};


/**
 * Merge two previously unassociated user identities.
 *
 * @param {String} newId
 * @param {String} oldId
 * @param {Object} options
 * @return {Analytics}
 */

Analytics.prototype.alias = function (newId, oldId, options) {
  if (is.object(oldId)) options = oldId, oldId = undefined;

  this._invoke('alias', newId, oldId, options);
  return this;
};


/**
 * Register a `fn` to be fired when all the analytics services are ready.
 *
 * @param {Function} fn
 * @return {Analytics}
 */

Analytics.prototype.ready = function (fn) {
  if (!is.fn(fn)) return this;
  this._readied
    ? callback.async(fn)
    : this._callbacks.push(fn);
  return this;
};


/**
 * Apply options.
 *
 * @param {Object} options
 * @return {Analytics}
 * @api private
 */

Analytics.prototype._options = function (options) {
  options || (options = {});
  cookie.options(options.cookie);
  localStore.options(options.localStorage);
  user.options(options.user);
  return this;
};


/**
 * Callback a `fn` after our defined timeout period.
 *
 * @param {Function} fn
 * @return {Analytics}
 * @api private
 */

Analytics.prototype._callback = function (fn) {
  callback.async(fn, this._timeout);
  return this;
};


/**
 * Call a `method` on all of initialized providers, passing clones of arguments
 * along to keep each provider isolated.
 *
 * TODO: check provider enabled
 *
 * @param {String} method
 * @param {Mixed} args...
 * @return {Analytics}
 * @api private
 */

Analytics.prototype._invoke = function (method, args) {
  args = [].slice.call(arguments, 1);
  var options = args[args.length-1];
  each(this._providers, function (provider) {
    if (!provider[method] || !isEnabled(provider, options)) return;
    var cloned = map(args, clone);
    provider.ready
      ? provider[method].apply(provider, cloned)
      : provider.enqueue(method, cloned);
  });
  return this;
};


/**
 * Parse the query string for callable methods.
 *
 * @return {Analytics}
 * @api private
 */

Analytics.prototype._parseQuery = function () {
  // Identify and track any `ajs_uid` and `ajs_event` parameters in the URL.
  var q = querystring.parse(window.location.search);
  if (q.ajs_uid) this.identify(q.ajs_uid);
  if (q.ajs_event) this.track(q.ajs_event);
  return this;
};


/**
 * Attach exports to prototype, so they are always available to the end user.
 */

Analytics.prototype.VERSION = exports.VERSION;
Analytics.prototype.Providers = exports.Providers;
Analytics.prototype.Provider = exports.Provider;
Analytics.prototype.provider = exports.provider;


/**
 * Determine whether a `provider` is enabled or not based on `options`.
 *
 * @param {Object} provider
 * @param {Object} options
 * @return {Boolean} - wether the provider is enabled.
 */

function isEnabled (provider, options) {
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
}


/**
 * Clean up traits, default some useful things both so the user doesn't have to
 * and so we don't have to do it on a provider-basis.
 *
 * @param {Object} traits
 * @return {Object}
 */

function cleanTraits (userId, traits) {
  // Add the `email` trait if it doesn't exist and the `userId` is an email.
  if (!traits.email && isEmail(userId)) traits.email = userId;

  // Create the `name` trait if it doesn't exist and `firstName` and `lastName`
  // are both supplied.
  if (!traits.name && traits.firstName && traits.lastName) {
    traits.name = traits.firstName + ' ' + traits.lastName;
  }

  // Convert dates from more types of input into Date objects.
  if (traits.created) traits.created = newDate(traits.created);
  if (traits.company && traits.company.created) {
    traits.company.created = newDate(traits.company.created);
  }

  return traits;
}