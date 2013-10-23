
var integration = require('../integration');
var load = require('load-script');
var user = require('../user');


/**
 * Expose `Awesm`.
 */

var Awesm = module.exports = integration('awe.sm')
  .option('apiKey', '')
  .option('events', {});


/**
 * Initialize.
 *
 * http://developers.awe.sm/guides/javascript/
 */

Awesm.prototype.initialize = function () {
  var options = this.options;
  window.AWESM = window.AWESM || {};
  window.AWESM.api_key = options.apiKey;
  this.load(this.ready);
};


/**
 * Load the awe.sm library.
 *
 * @param {Function} callback
 */

Awesm.prototype.load = function (callback) {
  var key = this.options.apiKey;
  load('//widgets.awe.sm/v3/widgets.js?key=' + key + '&async=true', callback);
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Awesm.prototype.track = function (event, properties, options) {
  var goal = this.options.events[event];
  if (!goal) return;
  var value = properties.value || 0;
  if (properties.revenue) value = properties.revenue * 100; // prefer revenue
  window.AWESM.convert(goal, value, null, user.id());
};