
var alias = require('alias')
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
  activator : null,
  // your intercom app id (required)
  appId : null,
  // whether to show the count of messages on the intercom inbox widget
  counter : true
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
  var method = this._id !== id ? 'boot': 'update';
  this._id = id; // cache for next time

  // required options
  traits.app_id = this.options.appId;
  if (id) traits.user_id = id;
  if (isEmail(id) && !traits.email) traits.email = id;
  if (!traits.user_id || !traits.email) return;

  // handle dates
  each(traits, function (key, value) {
    if (is.date(value)) traits[key] = convertDate(value);
  });
  alias(traits, { created: 'created_at'});

  // company dates
  if (traits.company) {
    each(traits.company, function (key, value) {
      if (is.date(value)) traits.company[key] = convertDate(value);
    });
    alias(traits.company, { created: 'created_at' });
  }

  // handle options
  options || (options = {});
  var Intercom = options.Intercom || options.intercom || {};
  if (Intercom.increments) traits.increments = Intercom.increments;
  if (Intercom.userHash) traits.user_hash = Intercom.userHash;
  if (Intercom.user_hash) traits.user_hash = Intercom.user_hash;
  if (this.options.activator) {
    traits.widget = {
      activator: this.options.activator,
      use_counter: this.options.counter
    };
  }

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
 * Convert a date to Intercom's format.
 *
 * @param {Date} date
 * @return {Number}
 */

function convertDate (date) {
  return Math.floor(date/1000);
}