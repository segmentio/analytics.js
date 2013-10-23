
var date = require('load-date');
var integration = require('../integration');
var load = require('load-script');


/**
 * Expose `Pingdom`.
 */

var Pingdom = module.exports = integration('Pingdom')
  .option('id', '');


/**
 * Initialize.
 */

Pingdom.prototype.initialize = function () {
  window._prum = window._prum || [];
  push('id', this.options.id);
  push('mark', 'firstbyte', date.getTime());
  this.load(this.ready);
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Pingdom.prototype.load = function (callback) {
  load('//rum-static.pingdom.net/prum.min.js', callback);
};


/**
 * Helper to push onto the Pingdom queue.
 *
 * @param {Mixed} args...
 */

function push (args) {
  args = [].slice.call(arguments);
  window._prum.push(args);
}