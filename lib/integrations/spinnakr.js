
var integration = require('../integration')
  , load = require('load-script');


/**
 * Expose `Spinnakr` integration.
 */

var Spinnakr = module.exports = integration('Spinnakr');


/**
 * Required key.
 */

Spinnakr.prototype.key = 'siteId';


/**
 * Default options.
 */

Spinnakr.prototype.defaults = {
  // your spinakkr site id key (required)
  siteId: ''
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

Spinnakr.prototype.initialize = function (options, ready) {
  window._spinnakr_site_id = options.siteId;
  load('//d3ojzyhbolvoi5.cloudfront.net/js/so.js', ready);
};