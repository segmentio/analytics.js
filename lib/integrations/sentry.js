
var integration = require('../integration')
  , load = require('load-script');


/**
 * Expose `Sentry` integration.
 *
 * http://raven-js.readthedocs.org/en/latest/config/index.html
 */

var Sentry = module.exports = integration('Sentry');


/**
 * Required key.
 */

Sentry.prototype.key = 'config';


/**
 * Default options.
 */

Sentry.prototype.defaults = {
  // your sentry config url (required)
  config: ''
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

Sentry.prototype.initialize = function (options, ready) {
  load('//d3nslu0hdya83q.cloudfront.net/dist/1.0/raven.min.js', function () {
    // for now, raven basically requires `install` to be called
    // https://github.com/getsentry/raven-js/blob/master/src/raven.js#L113
    window.Raven.config(options.config).install();
    ready();
  });
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Sentry.prototype.identify = function (id, traits, options) {
  if (id) traits.id = id;
  window.Raven.setUser(traits);
};