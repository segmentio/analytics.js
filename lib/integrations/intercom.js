
var alias = require('alias');
var convertDates = require('convert-dates');
var integration = require('integration');
var each = require('each');
var is = require('is');
var isEmail = require('is-email');
var load = require('load-script');


/**
 * Expose `Intercom`.
 */

var Intercom = module.exports = integration('Intercom')
  .assumesPageview()
  .readyOnLoad()
  .global('Intercom')
  .option('activator', '#IntercomDefaultWidget')
  .option('appId', '')
  .option('counter', true)
  .option('inbox', false);


/**
 * Initialize.
 *
 * http://docs.intercom.io/
 * http://docs.intercom.io/#IntercomJS
 *
 * @param {Object} page
 */

Intercom.prototype.initialize = function (page) {
  this.load();
};


/**
 * Load the Intercom library.
 *
 * @param {Function} callback
 */

Intercom.prototype.load = function (callback) {
  load('https://static.intercomcdn.com/intercom.v1.js', callback);
};


/**
 * Identify.
 *
 * http://docs.intercom.io/#IntercomJS
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Intercom.prototype.identify = function (id, traits, options) {
  traits = traits || {};
  options = options || {};

  if (!id && !traits.email) return; // one is required

  traits.app_id = this.options.appId;
  if (id) traits.user_id = id;

  // handle dates
  traits = convertDates(traits, formatDate);
  traits = alias(traits, { created: 'created_at'});
  if (traits.company) {
    traits.company = alias(traits.company, { created: 'created_at' });
  }

  // handle options
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
 * @param {String} id (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Intercom.prototype.group = function (id, properties, options) {
  properties = properties || {};
  if (id) properties.id = id;
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