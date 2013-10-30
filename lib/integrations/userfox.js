
var alias = require('alias');
var callback = require('callback');
var convertDates = require('convert-dates');
var integration = require('integration');
var load = require('load-script-once');
var push = require('global-queue')('_ufq');


/**
 * Expose `Userfox`.
 */

var Userfox = module.exports = integration('userfox')
  .assumesPageview()
  .readyOnInitialize()
  .option('clientId', '');


/**
 * Exists?
 */

Userfox.prototype.exists = function () {
  return !! window._ufq;
};


/**
 * Initialize.
 *
 * https://www.userfox.com/docs/
 */

Userfox.prototype.initialize = function (options, ready) {
  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Userfox.prototype.load = function (callback) {
  load('//d2y71mjhnajxcg.cloudfront.net/js/userfox-stable.js', callback);
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
  push('init', {
    clientId: this.options.clientId,
    email: traits.email
  });

  convertDates(traits, formatDate);
  alias(traits, { created: 'signup_date' });
  push('track', traits);
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