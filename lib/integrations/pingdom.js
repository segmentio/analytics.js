
var date = require('load-date');
var integration = require('integration');
var load = require('load-script');
var push = require('global-queue')('_prum');


/**
 * Expose `Pingdom`.
 */

var Pingdom = module.exports = integration('Pingdom')
  .assumesPageview()
  .readyOnLoad()
  .global('_prum')
  .option('id', '');


/**
 * Initialize.
 */

Pingdom.prototype.initialize = function () {
  push('id', this.options.id);
  push('mark', 'firstbyte', date.getTime());
  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Pingdom.prototype.load = function (callback) {
  load('//rum-static.pingdom.net/prum.min.js', callback);
};