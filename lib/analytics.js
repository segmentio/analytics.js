
var after = require('after')
  , bind = require('event').bind
  , callback = require('callback')
  , clone = require('clone')
  , cookie = require('./cookie')
  , createIntegration = require('./integration')
  , debug = require('debug')
  , each = require('each')
  , Emitter = require('emitter')
  , group = require('./group')
  , Integrations = require('./integrations')
  , is = require('is')
  , isEmail = require('is-email')
  , isMeta = require('is-meta')
  , newDate = require('new-date')
  , prevent = require('prevent')
  , querystring = require('querystring')
  , size = require('object').length
  , store = require('./store')
  , traverse = require('isodate-traverse')
  , user = require('./user');


/**
 * Expose `Analytics`.
 */

module.exports = exports = Analytics;


/**
 * Expose `VERSION`.
 */

exports.VERSION =
Analytics.prototype.VERSION = '0.18.2';


/**
 * Expose `Integrations`.
 */

exports.Integrations =
Analytics.prototype.Integrations = Integrations;


/**
 * Expose `createIntegration`.
 */

exports.createIntegration =
Analytics.prototype.createIntegration = createIntegration;


/**
 * Define a new `Integration`.
 *
 * @param {Function} Integration
 * @return {Analytics}
 */

exports.addIntegration =
Analytics.prototype.addIntegration = function (Integration) {
  var name = Integration.prototype.name;
  Integrations[name] = Integration;
  return this;
};


/**
 * Initialize a new `Analytics` instance.
 */

function Analytics () {
  this._callbacks = [];
  this._integrations = {};
  this._readied = false;
  this._timeout = 300;
  this._user = user; // BACKWARDS COMPATIBILITY
}


/**
 * Event Emitter.
 */

Emitter(Analytics.prototype);


/**
 * Initialize with the given integration `settings` and `options`. Aliased to
 * `init` for convenience.
 *
 * @param {Object} settings
 * @param {Object} options (optional)
 * @return {Analytics}
 */

Analytics.prototype.init =
Analytics.prototype.initialize = function (settings, options) {
  settings || (settings = {});
  options || (options = {});

  this._options(options);
  this._readied = false;
  this._integrations = {};

  // load user now that options are set
  user.load();
  group.load();

  // clean unknown integrations from settings
  var self = this;
  each(settings, function (name) {
    var Integration = self.Integrations[name];
    if (!Integration) delete settings[name];
  });

  // make ready callback
  var ready = after(size(settings), function () {
    self._readied = true;
    var callback;
    while (callback = self._callbacks.shift()) callback();
    self.emit('ready');
  });

  // initialize integrations, passing ready
  each(settings, function (name, options) {
    var Integration = self.Integrations[name];
    var integration = new Integration(clone(options), ready, self);
    self._integrations[name] = integration;
  });

  // call any querystring methods if present
  this._parseQuery();

  // backwards compat with angular plugin.
  // TODO: remove
  this.initialized = true;

  this.emit('initialize');

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
  if (is.object(id)) options = traits, traits = id, id = user.id();

  user.identify(id, traits);

  // clone traits before we manipulate so we don't do anything uncouth, and take
  // from `user` so that we carryover anonymous traits
  id = user.id();
  traits = cleanTraits(id, user.traits());

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
  return user;
};


/**
 * Identify a group by optional `id` and `properties`. Or, if no arguments are
 * supplied, return the current group.
 *
 * @param {String} id (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 * @param {Function} fn (optional)
 * @return {Analytics|Object}
 */

Analytics.prototype.group = function (id, properties, options, fn) {
  if (0 === arguments.length) return group;
  if (is.fn(options)) fn = options, options = undefined;
  if (is.fn(properties)) fn = properties, properties = undefined;
  if (is.object(id)) options = properties, properties = id, id = group.id();

  group.identify(id, properties);

  // grab from group again to make sure we're taking from the source
  id = group.id();
  properties = group.properties();

  // convert a create date to a date
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

  properties = traverse(clone(properties)) || {};

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
 * Set the `timeout` (in milliseconds) used for callbacks.
 *
 * @param {Number} timeout
 */

Analytics.prototype.timeout = function (timeout) {
  this._timeout = timeout;
};

/**
 * Enable / disable debug.
 *
 * @param {String|Boolean} str
 */

Analytics.prototype.debug = function(str){
  if (0 == arguments.length || str) {
    debug.enable('analytics:' + (str || '*'));
  } else {
    debug.disable();
  }
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
  store.options(options.localStorage);
  user.options(options.user);
  group.options(options.group);
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
 * Call a `method` on all of initialized integrations, passing clones of arguments
 * along to keep each integration isolated.
 *
 * TODO: check integration enabled
 *
 * @param {String} method
 * @param {Mixed} args...
 * @return {Analytics}
 * @api private
 */

Analytics.prototype._invoke = function (method, args) {
  args = [].slice.call(arguments, 1);
  args.unshift(method);
  var options = args[args.length-1]; // always the last one
  each(this._integrations, function (name, integration) {
    if (!isEnabled(integration, options)) return;
    var clonedArgs = clone(args)
    integration.invoke.apply(integration, clonedArgs);
  });
  this.emit.apply(this, clone(args));
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
 * Determine whether a `integration` is enabled or not based on `options`.
 *
 * @param {Object} integration
 * @param {Object} options
 * @return {Boolean}
 */

function isEnabled (integration, options) {
  var enabled = true;
  if (!options || !options.providers) return enabled;

  // Default to the 'all' or 'All' setting.
  var map = options.providers;
  if (map.all !== undefined) enabled = map.all;
  if (map.All !== undefined) enabled = map.All;

  // Look for this integration's specific setting.
  var name = integration.name;
  if (map[name] !== undefined) enabled = map[name];

  return enabled;
}


/**
 * Clean up traits, default some useful things both so the user doesn't have to
 * and so we don't have to do it on a integration-basis.
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
