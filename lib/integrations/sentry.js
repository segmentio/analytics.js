
var integration = require('integration');
var load = require('load-script');


/**
 * Expose `Sentry`.
 */

var Sentry = module.exports = integration('Sentry')
  .readyOnLoad()
  .global('Raven')
  .option('config', '');


/**
 * Initialize.
 *
 * http://raven-js.readthedocs.org/en/latest/config/index.html
 */

Sentry.prototype.initialize = function () {
  var config = this.options.config;
  this.load(function () {
    // for now, raven basically requires `install` to be called
    // https://github.com/getsentry/raven-js/blob/master/src/raven.js#L113
    window.Raven.config(config).install();
  });
};


/**
 * Load.
 *
 * @param {Function} callback
 */

Sentry.prototype.load = function (callback) {
  load('//d3nslu0hdya83q.cloudfront.net/dist/1.0/raven.min.js', callback);
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Sentry.prototype.identify = function (id, traits, options) {
  traits || (traits = {});
  if (id) traits.id = id;
  window.Raven.setUser(traits);
};