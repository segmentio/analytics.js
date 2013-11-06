
var callback = require('callback');
var clone = require('clone');
var extend = require('extend');
var integration = require('integration');
var load = require('load-script');
var onError = require('on-error');


/**
 * Expose `Rollbar`.
 */

var Rollbar = module.exports = integration('Rollbar')
  .readyOnInitialize()
  .assumesPageview()
  .global('_rollbar')
  .option('accessToken', '')
  .option('identify', true);


/**
 * Initialize.
 *
 * https://rollbar.com/docs/notifier/rollbar.js/
 */

Rollbar.prototype.initialize = function () {
  var options = this.options;
  window._rollbar = window._rollbar || window._ratchet || [options.accessToken, options];
  onError(function() { window._rollbar.push.apply(window._rollbar, arguments); });
  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Rollbar.prototype.load = function (callback) {
  load('//d37gvrvc0wt4s1.cloudfront.net/js/1/rollbar.min.js', callback);
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Rollbar.prototype.identify = function (id, traits, options) {
  if (!this.options.identify) return;
  traits || (traits = {});
  if (id) traits.id = id;

  // rollbar keeps extra params as the second item in their array until loaded
  var rollbar = window._rollbar;
  var params = rollbar.shift
    ? rollbar[1] = rollbar[1] || {}
    : rollbar.extraParams = rollbar.extraParams || {};
  params.person = params.person || {};
  extend(params.person, traits);
};
