
var integration = require('../integration');
var load = require('load-script');


/**
 * Expose `Quantcast`.
 */

var Quantcast = module.exports = integration('Quantcast')
  .option('pCode', null);


/**
 * Initialize.
 *
 * https://www.quantcast.com/learning-center/guides/using-the-quantcast-asynchronous-tag/
 */

Quantcast.prototype.initialize = function () {
  window._qevents = window._qevents || [];
  window._qevents.push({ qacct: this.options.pCode });
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