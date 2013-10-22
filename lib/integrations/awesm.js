
var integration = require('../integration');
var load = require('load-script');
var user = require('../user');


/**
 * Expose `Awesm` integration.
 */

var Awesm = module.exports = integration('awe.sm');


/**
 * Default options.
 */

Awesm.prototype.defaults = {
  // your awe.sm api key (required)
  apiKey: '',
  // a dictionary of event names to awe.sm events
  events: {}
};


/**
 * Load the awe.sm library.
 */

Awesm.prototype.load = function () {
  var key = this.options.apiKey;
  load('//widgets.awe.sm/v3/widgets.js?key=' + key + '&async=true', this.ready);
};


/**
 * Initialize.
 *
 * @param {Object} options
 */

Awesm.prototype.initialize = function (options) {
  window.AWESM = window.AWESM || {};
  window.AWESM.api_key = options.apiKey;
  this.load();
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