
var bind = require('bind');
var debug = require('debug');
var defaults = require('defaults');
var each = require('each');
var once = require('once');
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
    this.options = defaults(options || {}, this.defaults || {});
    this.analytics = analytics;
    this._queue = [];
    this._ready = false;
    this.ready = once(readyHandler(ready));
    this.load = once(this.load);
    this.debug = debug('analytics:integration:' + slug(name));
    bind.all(this);

    this.debug('initialize with %o', this.options);
    this.initialize(this.options);
  }

  /**
   * Name.
   */

  Integration.prototype.name = name;

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

    if (!this._ready) {
      this._queue.push({ method: method, args: args });
      return;
    }

    try {
      this.debug('%s with %o', method, args);
      this[method].apply(this, args);
    } catch (e) {
      this.debug('error %o calling %s with %o', e, method, args);
    }
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