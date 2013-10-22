
var alias = require('alias');
var callback = require('callback');
var convertDates = require('convert-dates');
var integration = require('../integration');
var load = require('load-script');
var user = require('../user');


/**
 * Expose `Customerio` integration.
 */

var Customerio = module.exports = integration('Customer.io');


/**
 * Default options.
 */

Customerio.prototype.defaults = {
  // your customer.io site id (required)
  siteId: ''
};


/**
 * Initialize.
 */

Customerio.prototype.initialize = function () {
  var _cio = window._cio = window._cio || [];
  (function() {var a,b,c; a = function (f) {return function () {_cio.push([f].concat(Array.prototype.slice.call(arguments,0))); }; }; b = ['identify', 'track']; for (c = 0; c < b.length; c++) {_cio[b[c]] = a(b[c]); } })();
  callback.async(this.ready);
  this.load();
};


/**
 * Load the Customer.io library.
 *
 * @param {Function} callback
 */

Customerio.prototype.load = function (callback) {
  var script = load('https://assets.customer.io/assets/track.js');
  // add the required `id` and `data-site-id` to the script element
  script.id = 'cio-tracker';
  script.setAttribute('data-site-id', this.options.siteId);
};


/**
 * Trait aliases.
 */

var traitAliases = {
  created: 'created_at'
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Customerio.prototype.identify = function (id, traits, options) {
  if (!id) return; // customer.io requires an id
  traits.id = id;
  traits = convertDates(traits, convertDate);
  traits = alias(traits, traitAliases);
  window._cio.identify(traits);
};


/**
 * Group.
 *
 * @param {String} id (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Customerio.prototype.group = function (id, properties, options) {
  if (id) properties.id = id;
  properties = alias(properties, function (prop) {
    return 'Group ' + prop;
  });

  this.identify(user.id(), properties);
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Customerio.prototype.track = function (event, properties, options) {
  properties = convertDates(properties, convertDate);
  window._cio.track(event, properties);
};


/**
 * Convert a date to the format Customer.io supports.
 *
 * @param {Date} date
 * @return {Number}
 */

function convertDate (date) {
  return Math.floor(date.getTime() / 1000);
}