
var clone = require('clone')
  , extend = require('extend')
  , integration = require('../integration')
  , load = require('load-script')
  , onError = require('on-error');


/**
 * Expose `Rollbar` integration.
 *
 * https://rollbar.com/docs/notifier/rollbar.js/
 */

var Rollbar = module.exports = integration('Rollbar');


/**
 * Required key.
 */

Rollbar.prototype.key = 'accessToken';


/**
 * Default options.
 */

Rollbar.prototype.defaults = {
  accessToken: '',
  identify: true
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

Rollbar.prototype.initialize = function (options, ready) {
  window._rollbar = window._rollbar || window._ratchet || [options.accessToken, clone(options)];
  onError(function() {
    window._rollbar.push(arguments);
  });
  ready();

  load('//d37gvrvc0wt4s1.cloudfront.net/js/1/rollbar.min.js');
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
  if (id) traits.id = id;

  // rollbar keeps extra params as the second item in their array until loaded
  var rollbar = window._rollbar;
  var params = rollbar.shift
    ? rollbar[1] = rollbar[1] || {}
    : rollbar.extraParams = rollbar.extraParams || {};
  params.person = params.person || {};
  extend(params.person, traits);
};
