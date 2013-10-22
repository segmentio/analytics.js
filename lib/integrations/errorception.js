
var callback = require('callback');
var extend = require('extend');
var integration = require('../integration');
var load = require('load-script');
var onError = require('on-error');


/**
 * Expose `Errorception` integration.
 *
 * https://github.com/amplitude/Errorception-Javascript
 */

var Errorception = module.exports = integration('Errorception');


/**
 * Default options.
 */

Errorception.prototype.defaults = {
  // your errorception project id (required)
  projectId: '',
  // whether to store metadata about the user on `identify` calls
  // http://blog.errorception.com/2012/11/capture-custom-data-with-your-errors.html
  meta: true
};


/**
 * Initialize.
 */

Errorception.prototype.initialize = function () {
  window._errs = [this.options.projectId];
  onError(function() {
    window._errs.push(arguments);
  });
  callback.async(this.ready);
};


/**
 * Load the Errorception library.
 *
 * @param {Function} callback
 */

Errorception.prototype.load = function (callback) {
  load('//beacon.errorception.com/' + this.options.projectId + '.js', callback);
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Errorception.prototype.identify = function (id, traits, options) {
  if (!this.options.meta) return;
  if (id) traits.id = id;
  window._errs.meta = window._errs.meta || {};
  extend(window._errs.meta, traits);
};