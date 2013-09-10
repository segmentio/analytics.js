
var integration = require('../integration')
  , load = require('load-script');


/**
 * Expose `USERcycle` integration.
 *
 * http://docs.usercycle.com/javascript_api
 */

var USERcycle = module.exports = integration('USERcycle');


/**
 * Required key.
 */

USERcycle.prototype.key = 'key';


/**
 * Default options.
 */

USERcycle.prototype.defaults = {
  // your usercycle key (required)
  key: ''
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

USERcycle.prototype.initialize = function (options, ready) {
  window._uc || (window._uc = []);
  window._uc.push(['_key', options.key]);
  ready();
  load('//api.usercycle.com/javascripts/track.js');
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

USERcycle.prototype.identify = function (id, traits, options) {
  if (id) window._uc.push(['uid', id]);
  // there's a special `came_back` event used for retention and traits
  window._uc.push(['action', 'came_back', traits]);
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

USERcycle.prototype.track = function (event, properties, options) {
  window._uc.push(['action', event, properties]);
};