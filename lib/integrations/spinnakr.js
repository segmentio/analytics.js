
var integration = require('integration');
var load = require('load-script-once');


/**
 * Expose `Spinnakr`.
 */

var Spinnakr = module.exports = integration('Spinnakr')
  .assumesPageview()
  .readyOnLoad()
  .option('siteId', '');


/**
 * Exists?
 */

Spinnakr.prototype.exists = function () {
  return !! window._spinnakr_site_id;
};


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