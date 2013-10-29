
var integration = require('../integration');
var load = require('load-script-once');


/**
 * Expose `Quantcast`.
 */

var Quantcast = module.exports = integration('Quantcast')
  .assumesPageview()
  .readyOnInitialize()
  .option('pCode', null);


/**
 * Exists?
 */

Quantcast.prototype.exists = function () {
  return !! window._qevents;
};


/**
 * Initialize.
 *
 * https://www.quantcast.com/learning-center/guides/using-the-quantcast-asynchronous-tag/
 */

Quantcast.prototype.initialize = function () {
  window._qevents = [{ qacct: this.options.pCode }];
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Quantcast.prototype.load = function (callback) {
  load({
    http: 'http://edge.quantserve.com/quant.js',
    https: 'https://secure.quantserve.com/quant.js'
  }, callback);
};