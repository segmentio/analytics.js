
var integration = require('../integration')
  , load = require('load-script');


/**
 * Expose `Quantcast` integration.
 */

var Quantcast = module.exports = integration('Quantcast');


/**
 * Required key.
 */

Quantcast.prototype.key = 'pCode';


/**
 * Default options.
 */

Quantcast.prototype.defaults = {
  // your quantcast p code (required)
  pCode: null
};


/**
 * Initialize.
 *
 * https://www.quantcast.com/learning-center/guides/using-the-quantcast-asynchronous-tag/
 *
 * @param {Object} options
 * @param {Function} ready
 */

Quantcast.prototype.initialize = function (options, ready) {
  window._qevents || (window._qevents = []);
  window._qevents.push({ qacct: options.pCode });
  load({
    http: 'http://edge.quantserve.com/quant.js',
    https: 'https://secure.quantserve.com/quant.js'
  }, ready);
};