
var integration = require('integration');
var load = require('load-script');


/**
 * Expose `Spinnakr`.
 */

var Spinnakr = module.exports = integration('Spinnakr')
  .assumesPageview()
  .readyOnLoad()
  .global('_spinnakr_site_id')
  .global('_spinnakr')
  .option('siteId', '');


/**
 * Initialize.
 */

Spinnakr.prototype.initialize = function () {
  window._spinnakr_site_id = this.options.siteId;
  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Spinnakr.prototype.load = function (callback) {
  load('//d3ojzyhbolvoi5.cloudfront.net/js/so.js', callback);
};