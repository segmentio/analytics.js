
var integration = require('../integration')
  , load = require('load-script');


/**
 * Expose `Qualaroo` integration.
 */

var Qualaroo = module.exports = integration('Qualaroo');


/**
 * Default options.
 */

Qualaroo.prototype.defaults = {
  // your qualaroo customer id (required)
  customerId: '',
  // your qualaroo site token (required)
  siteToken: '',
  // whether to track events as traits on the user
  track: false
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

Qualaroo.prototype.initialize = function (options, ready) {
  window._kiq || (window._kiq = []);
  ready();
  var path = options.customerId + '/' + options.siteToken;
  load('//s3.amazonaws.com/ki.js/' + path + '.js');
};


/**
 * Identify.
 *
 * http://help.qualaroo.com/customer/portal/articles/731085-identify-survey-nudge-takers
 * http://help.qualaroo.com/customer/portal/articles/731091-set-additional-user-properties
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Qualaroo.prototype.identify = function (id, traits, options) {
  if (traits.email) id = traits.email;
  if (id) window._kiq.push(['identify', id]);
  if (traits) window._kiq.push(['set', traits]);
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Qualaroo.prototype.track = function (event, properties, options) {
  if (!this.options.track) return;
  var traits = {};
  traits['Triggered: ' + event] = true;
  this.identify(null, traits);
};