
var integration = require('../integration')
  , load = require('load-script');


/**
 * Expose `PerfectAudience` integration.
 *
 * https://www.perfectaudience.com/docs#javascript_api_autoopen
 */

var PerfectAudience = module.exports = integration('Perfect Audience');


/**
 * Required key.
 */

PerfectAudience.prototype.key = 'siteId';


/**
 * Default options.
 */

PerfectAudience.prototype.defaults = {
  // your perfect audience site id (required)
  siteId: ''
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

PerfectAudience.prototype.initialize = function (options, ready) {
  window._pa || (window._pa = {});
  load('//tag.perfectaudience.com/serve/' + options.siteId + '.js', ready);
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

PerfectAudience.prototype.track = function (event, properties, options) {
  window._pa.track(event, properties);
};