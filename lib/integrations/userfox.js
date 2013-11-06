
var alias = require('alias')
  , callback = require('callback')
  , convertDates = require('convert-dates')
  , integration = require('../integration')
  , load = require('load-script');


/**
 * Expose `Userfox` integration.
 *
 * https://www.userfox.com/docs/
 */

var Userfox = module.exports = integration('userfox');


/**
 * Required key.
 */

Userfox.prototype.key = 'clientId';


/**
 * Default options.
 */

Userfox.prototype.defaults = {
  // your userfox client id (required)
  clientId: ''
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

Userfox.prototype.initialize = function (options, ready) {
  window._ufq || (window._ufq = []);
  callback.async(ready);
  load('//d2y71mjhnajxcg.cloudfront.net/js/userfox-stable.js');
};


/**
 * Identify.
 *
 * https://www.userfox.com/docs/#custom-data
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Userfox.prototype.identify = function (id, traits, options) {
  if (!traits.email) return;

  // initialize the library with the email now that we have it
  window._ufq.push(['init', {
    clientId: this.options.clientId,
    email: traits.email
  }]);

  traits = convertDates(traits, formatDate);
  alias(traits, { created: 'signup_date' });
  window._ufq.push(['track', traits]);
};


/**
 * Convert a `date` to a format userfox supports.
 *
 * @param {Date} date
 * @return {String}
 */

function formatDate (date) {
  return Math.round(date.getTime() / 1000).toString();
}