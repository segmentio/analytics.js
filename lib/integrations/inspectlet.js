
var integration = require('../integration');
var alias = require('alias');
var clone = require('clone');
var load = require('load-script');


/**
 * Expose `Inspectlet` provider.
 *
 * https://www.inspectlet.com/dashboard/embedcode/1492461759/initial
 */

var Inspectlet = module.exports = integration('Inspectlet')
  .option('wid', '');


/**
 * Initialize.
 */

Inspectlet.prototype.initialize = function () {
  window.__insp = window.__insp || [];
  window.__insp.push(['wid', this.options.wid]);
  this.load(this.ready);
};


/**
 * Load the Inspectlet library.
 *
 * @param {Function} callback
 */

Inspectlet.prototype.load = function (callback) {
  load('//www.inspectlet.com/inspectlet.js', callback);
};