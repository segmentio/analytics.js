
var integration = require('../integration')
  , alias = require('alias')
  , clone = require('clone')
  , load = require('load-script');


/**
 * Expose `Inspectlet` provider.
 *
 * https://www.inspectlet.com/dashboard/embedcode/1492461759/initial
 */

var Inspectlet = module.exports = integration('Inspectlet');


/**
 * Required key.
 */

Inspectlet.prototype.key = 'wid';


/**
 * Default options.
 */

Inspectlet.prototype.defaults = {
  // your inspeclet site's token (required)
  wid : ''
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

Inspectlet.prototype.initialize = function (options, ready) {
  window.__insp = window.__insp || [];
  window.__insp.push(['wid', options.wid]);
  load('//www.inspectlet.com/inspectlet.js', ready);
};