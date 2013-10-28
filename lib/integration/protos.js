
var callback = require('callback');
var Emitter = require('emitter');


/**
 * Mixin emitter.
 */

Emitter(exports);


/**
 * Exists noop.
 */

exports.exists = function () {
  return false;
};

/**
 * Initialize noop.
 */

exports.initialize = function () {
  this.load();
};

/**
 * Load noop.
 */

exports.load = function (fn) {
  this.emit('ready');
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

exports.invoke = function (method) {
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

exports.queue = function (method, args) {
  if ('page' == method && this._assumesPageview && !this._initialized) {
    this._initialized = true;
    return this.initialize();
  }

  this._queue.push({ method: method, args: args });
};


/**
 * Flush the internal queue.
 *
 * @api private
 */

exports.flush = function () {
  var call;
  while (call = this._queue.shift()) this[call.method].apply(this, call.args);
};


/**
 * Wrap the initialize method in an exists check, so we don't have to do it for
 * every single integration.
 *
 * @api private
 */

exports._wrapInitialize = function () {
  var initialize = this.initialize;
  this.initialize = function () {
    if (this.exists()) {
      this.debug('already loaded');
      this.emit('ready');
      return;
    }

    initialize.apply(this, arguments);
    if (this._readyOnInitialize) this.emit('ready');
  };
};


/**
 * Wrap the load method in `debug` calls, so every integration gets them
 * automatically.
 *
 * @api private
 */

exports._wrapLoad = function () {
  var load = this.load;
  this.load = function (callback) {
    var self = this;
    this.debug('loading');
    load.call(this, function (err, e) {
      self.debug('loaded');
      self.emit('load');
      if (self._readyOnLoad) self.emit('ready');
      callback && callback(err, e);
    });
  };
};


/**
 * BACKWARDS COMPATIBILITY: Wrap the page method if the old `initialPageview`
 * option was set to `false`.
 *
 * @api private
 */

exports._wrapPage = function () {
  if (this.options.initialPageview === false) {
    this.prototype.page = after(1, this.prototype.page);
  }
};