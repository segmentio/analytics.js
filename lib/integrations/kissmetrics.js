
var alias = require('alias')
  , callback = require('callback')
  , integration = require('../integration')
  , load = require('load-script');


/**
 * Expose `KISSmetrics` integration.
 *
 * http://support.kissmetrics.com/apis/javascript
 */

var KISSmetrics = module.exports = integration('KISSmetrics');


/**
 * Required key.
 */

KISSmetrics.prototype.key = 'apiKey';


/**
 * Default options.
 */

KISSmetrics.prototype.defaults = {
  // your kissmetrics api key (required)
  apiKey: ''
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

KISSmetrics.prototype.initialize = function (options, ready) {
  window._kmq || (window._kmq = []);
  callback.async(ready);
  load('//i.kissmetrics.com/i.js');
  load('//doug1izaerwt3.cloudfront.net/' + options.apiKey + '.1.js');
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

KISSmetrics.prototype.identify = function (id, traits, options) {
  if (id) window._kmq.push(['identify', id]);
  if (traits) window._kmq.push(['set', traits]);
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

KISSmetrics.prototype.track = function (event, properties, options) {
  alias(properties, { revenue: 'Billing Amount' });
  window._kmq.push(['record', event, properties]);
};


/**
 * Alias.
 *
 * @param {String} newId
 * @param {String} originalId (optional)
 */

KISSmetrics.prototype.alias = function (newId, originalId) {
  window._kmq.push(['alias', newId, originalId]);
};