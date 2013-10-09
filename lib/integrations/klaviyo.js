
var alias = require('alias')
  , callback = require('callback')
  , integration = require('../integration')
  , load = require('load-script');


/**
 * Expose `Klaviyo` integration.
 *
 * https://www.klaviyo.com/docs/getting-started
 */

var Klaviyo = module.exports = integration('Klaviyo');


/**
 * Required key.
 */

Klaviyo.prototype.key = 'apiKey';


/**
 * Default options.
 */

Klaviyo.prototype.defaults = {
  // your klaviyo api key (required)
  apiKey: ''
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

Klaviyo.prototype.initialize = function (options, ready) {
  window._learnq || (window._learnq = []);
  window._learnq.push(['account', options.apiKey]);
  callback.async(ready);
  load('//a.klaviyo.com/media/js/learnmarklet.js');
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Klaviyo.prototype.identify = function (id, traits, options) {
  if (!id && !traits.email) return; // requires an id or email

  traits.id = id;
  alias(traits, {
    id: '$id',
    email: '$email',
    firstName: '$first_name',
    lastName: '$last_name',
    phone: '$phone_number',
    title: '$title'
  });

  window._learnq.push(['identify', traits]);
};


/**
 * Group.
 *
 * @param {String} id
 * @param {Object} properties (optional)
 */

Klaviyo.prototype.group = function (id, properties) {
  if (!properties.name) return;
  window._learnq.push(['identify', { $organization: properties.name }]);
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Klaviyo.prototype.track = function (event, properties, options) {
  window._learnq.push(['track', event, properties]);
};