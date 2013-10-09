
var debug = require('debug')('analytics:integration');

/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

exports.initialize = function (options, ready) {
  ready();
};


/**
 * Invoke a method, queueing or not depending on our ready state.
 *
 * @param {String} method
 * @param {Mixed} args...
 */

exports.invoke = function (method, args) {
  if (!this[method]) return;
  args = [].slice.call(arguments, 1);
  if (this.ready) {
    debug('%s %s %o', this.name, method, args);
    this[method].apply(this, args);
  } else {
    this.queue.push({
      method: method,
      args: args
    });
  }
};
