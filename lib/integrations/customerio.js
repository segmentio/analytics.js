
var alias = require('alias')
  , callback = require('callback')
  , convertDates = require('convert-dates')
  , integration = require('../integration')
  , load = require('load-script')
  , user = require('../user');


/**
 * Expose `Customerio` integration.
 */

var Customerio = module.exports = integration('Customer.io');


/**
 * Required key.
 */

Customerio.prototype.key = 'siteId';


/**
 * Default options.
 */

Customerio.prototype.defaults = {
  // your customer.io site id (required)
  siteId: ''
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

Customerio.prototype.initialize = function (options, ready) {
  var _cio = window._cio = window._cio || [];
  (function() {var a,b,c; a = function (f) {return function () {_cio.push([f].concat(Array.prototype.slice.call(arguments,0))); }; }; b = ['identify', 'track']; for (c = 0; c < b.length; c++) {_cio[b[c]] = a(b[c]); } })();
  callback.async(ready);

  // add the required `id` and `data-site-id` to the script element
  var script = load('https://assets.customer.io/assets/track.js');
  script.id = 'cio-tracker';
  script.setAttribute('data-site-id', options.siteId);
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
  convertDates(traits, convertDate);
  alias(traits, { created: 'created_at' });
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
  alias(properties, function (prop) {
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
  convertDates(properties, convertDate);
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