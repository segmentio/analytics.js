
var alias = require('alias');
var callback = require('callback');
var integration = require('../integration');
var load = require('load-script-once');


/**
 * Expose `Klaviyo`.
 */

var Klaviyo = module.exports = integration('Klaviyo')
  .option('apiKey', '');


/**
 * Initialize.
 *
 * https://www.klaviyo.com/docs/getting-started
 */

Klaviyo.prototype.initialize = function () {
  window._learnq = window._learnq || [];
  push('account', this.options.apiKey);
  callback.async(this.ready);
  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Klaviyo.prototype.load = function (callback) {
  load('//a.klaviyo.com/media/js/learnmarklet.js', callback);
};


/**
 * Trait aliases.
 */

var aliases = {
  id: '$id',
  email: '$email',
  firstName: '$first_name',
  lastName: '$last_name',
  phone: '$phone_number',
  title: '$title'
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Klaviyo.prototype.identify = function (id, traits, options) {
  if (!id && !traits.email) return;
  if (id) traits.id = id;
  traits = alias(traits, aliases);
  push('identify', traits);
};


/**
 * Group.
 *
 * @param {String} id
 * @param {Object} properties (optional)
 */

Klaviyo.prototype.group = function (id, properties) {
  if (!properties.name) return;
  push('identify', { $organization: properties.name });
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Klaviyo.prototype.track = function (event, properties, options) {
  push('track', event, properties);
};


/**
 * Helper to push onto the Klaviyo queue.
 *
 * @param {Mixed} args...
 */

function push (args) {
  args = [].slice.call(arguments);
  window._learnq.push(args);
}