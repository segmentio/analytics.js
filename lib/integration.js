
var after = require('after');
var bind = require('bind');
var callback = require('callback');
var debug = require('debug');
var defaults = require('defaults');
var each = require('each');
var slug = require('slug');


/**
 * Expose `createIntegration`.
 */

module.exports = createIntegration;


/**
 * Create a new Integration constructor.
 *
 * @param {String} name
 */

function createIntegration (name) {

  /**
   * Initialize a new `Integration`.
   *
   * @param {Object} options
   * @param {Function} ready
   * @param {Object} analytics
   */

  function Integration (options, ready, analytics) {
    this.options = defaults(options || {}, this.defaults);
    this.analytics = analytics;
    this._queue = [];
    this._initialized = false;
    this._ready = false;
    this.ready = readyHandler(ready);
    this.debug = debug('analytics:integration:' + slug(name));
    bind.all(this);

    // BACKWARDS COMPATIBILITY: some providers had "initial" pageview settings
    if (false === this.options.initialPageview) {
      this.prototype.page = after(1, this.prototype.page);
    }
  }

  /**
   * Add a new option to the integration by `key` with default `value`.
   *
   * @param {String} key
   * @param {Mixed} value
   * @return {Integration}
   */

  Integration.option = function (key, value) {
    this.prototype.defaults[key] = value;
    return this;
  };

  /**
   * Mark the integration as assuming an initial pageview, so to defer loading
   * the script until the first `page` call, noop the first `initialize`.
   *
   * @return {Integration}
   */

  Integration.assumesPageview = function () {
    this.prototype._assumesPageview = true;
    this.prototype.initialize = after(1, this.prototype.initialize);
    return this;
  };

  /**
   * Name.
   */

  Integration.prototype.name = name;

  /**
   * Defaults.
   */

  Integration.prototype.defaults = {};

  /**
   * Initialize noop.
   */

  Integration.prototype.initialize = function () {
    this.load(this.ready);
  };

  /**
   * Load noop.
   */

  Integration.prototype.load = function (fn) {
    callback.async(fn);
  };

  /**
   * Invoke a `method` that may or may not exist on the prototype with `args`,
   * queueing or not depending on whether the integration is "ready". Don't
   * trust the method call, since it contains integration party code.
   *
   * @param {String} method
   * @param {Mixed} args...
   * @api private
   */

  Integration.prototype.invoke = function (method) {
    if (!this[method]) return;
    var args = [].slice.call(arguments, 1);
    if (!this._ready) return this.queue(method, args);

    try {
      this.debug('%s with %o', method, args);
      this[method].apply(this, args);
    } catch (e) {
      this.debug('error %o calling %s with %o', e, method, args);
    }
  };

  /**
   * Queue a `method` with `args`. If the integration assumes an initial
   * pageview, then let the first call to `page` pass through to `initialize`.
   *
   * @param {String} method
   * @param {Array} args
   * @api private
   */

  Integration.prototype.queue = function (method, args) {
    if ('page' == method && this._assumesPageview && !this._loaded) {
      return this.initialize();
    }

    this._queue.push({ method: method, args: args });
  };

  /**
   * Return `Integration`.
   */

  return Integration;
}


/**
 * Return a ready handler with a given `ready` callback.
 *
 * @param {Function} callback
 */

function readyHandler (callback) {
  return function () {
    var call;
    this._ready = true;
    while (call = this._queue.shift()) this.invoke(call.method, call.args);
    callback();
  };
}