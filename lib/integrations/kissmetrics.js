
var alias = require('alias');
var callback = require('callback');
var integration = require('../integration');
var load = require('load-script');


/**
 * Expose `KISSmetrics` integration.
 *
 * http://support.kissmetrics.com/apis/javascript
 */

var KISSmetrics = module.exports = integration('KISSmetrics')
  .option('apiKey', '');


/**
 * Initialize.
 */

KISSmetrics.prototype.initialize = function () {
  window._kmq = window._kmq || [];
  callback.async(this.ready);
  this.load();
};


/**
 * Load the Kissmetrics library.
 *
 * @param {Function} callback
 */

KISSmetrics.prototype.initialize = function () {
  var key = this.options.apiKey;
  load('//i.kissmetrics.com/i.js');
  load('//doug1izaerwt3.cloudfront.net/' + key + '.1.js');
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

KISSmetrics.prototype.identify = function (id, traits, options) {
  if (id) push('identify', id);
  if (traits) push('set', traits);
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

KISSmetrics.prototype.track = function (event, properties, options) {
  properties = alias(properties, { revenue: 'Billing Amount' });
  push('record', event, properties);
};


/**
 * Alias.
 *
 * @param {String} to
 * @param {String} from (optional)
 */

KISSmetrics.prototype.alias = function (to, from) {
  push('alias', to, from);
};


/**
 * Helper to push to the KISSmetrics queue.
 *
 * @param {Mixed} args...
 */

function push (args) {
  args = [].slice.call(arguments);
  window._kmq.push(args);
}