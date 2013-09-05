
var integration = require('../integration')
  , load = require('load-script')
  , user = require('../user');


/**
 * Expose `Awesm` integration.
 */

var Awesm = module.exports = integration('awe.sm');


/**
 * Required key.
 */

Awesm.prototype.key = 'apiKey';


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
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

Awesm.prototype.initialize = function (options, ready) {
  window.AWESM = window.AWESM || {};
  window.AWESM.api_key = options.apiKey;
  load('//widgets.awe.sm/v3/widgets.js?key=' + options.apiKey + '&async=true', ready);
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
  var value = 0;
  if (!goal) return;
  if (properties.revenue) value = properties.revenue * 100; // prefer revenue
  window.AWESM.convert(goal, value, null, user.id());
};