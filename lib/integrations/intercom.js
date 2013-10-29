
var alias = require('alias')
  , convertDates = require('convert-dates')
  , integration = require('../integration')
  , each = require('each')
  , is = require('is')
  , isEmail = require('is-email')
  , load = require('load-script');


/**
 * Expose `Intercom` integration.
 *
 * http://docs.intercom.io/
 * http://docs.intercom.io/#IntercomJS
 */

var Intercom = module.exports = integration('Intercom');


/**
 * Required key.
 */

Intercom.prototype.key = 'appId';


/**
 * Default options.
 */

Intercom.prototype.defaults = {
  // an optional css selector to use for the intercom inbox widget button
  activator: '#IntercomDefaultWidget',
  // your intercom app id (required)
  appId: '',
  // whether to show the count of messages on the intercom inbox widget
  counter: true,
  // whether or not to show the intercom inbox widget
  inbox: false
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

Intercom.prototype.initialize = function (options, ready) {
  load('https://static.intercomcdn.com/intercom.v1.js', ready);
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Intercom.prototype.identify = function (id, traits, options) {
  if (!id && !traits.email) return; // one is required

  traits.app_id = this.options.appId;
  if (id) traits.user_id = id;

  // handle dates
  traits = convertDates(traits, formatDate);
  alias(traits, { created: 'created_at'});
  if (traits.company) alias(traits.company, { created: 'created_at' });

  // handle options
  options || (options = {});
  var Intercom = options.Intercom || options.intercom || {};
  if (Intercom.increments) traits.increments = Intercom.increments;
  if (Intercom.userHash) traits.user_hash = Intercom.userHash;
  if (Intercom.user_hash) traits.user_hash = Intercom.user_hash;
  if (this.options.inbox) {
    traits.widget = {
      activator: this.options.activator,
      use_counter: this.options.counter
    };
  }

  var method = this._id !== id ? 'boot': 'update';
  this._id = id; // cache for next time

  window.Intercom(method, traits);
};


/**
 * Group.
 *
 * @param {String} id
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Intercom.prototype.group = function (id, properties, options) {
  properties.id = id;
  window.Intercom('update', { company: properties });
};


/**
 * Format a date to Intercom's liking.
 *
 * @param {Date} date
 * @return {Number}
 */

function formatDate (date) {
  return Math.floor(date / 1000);
}