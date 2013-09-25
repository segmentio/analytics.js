
var callback = require('callback')
  , extend = require('extend')
  , integration = require('../integration')
  , load = require('load-script')
  , onError = require('on-error');


/**
 * Expose `Errorception` integration.
 *
 * https://github.com/amplitude/Errorception-Javascript
 */

var Errorception = module.exports = integration('Errorception');


/**
 * Required key.
 */

Errorception.prototype.key = 'projectId';


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
 *
 * @param {Object} options
 * @param {Function} ready
 */

Errorception.prototype.initialize = function (options, ready) {
  window._errs = [options.projectId];
  onError(function() {
    window._errs.push(arguments);
  });
  load('//beacon.errorception.com/' + options.projectId + '.js');
  callback.async(ready);
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
  window._errs.meta || (window._errs.meta = {});
  if (id) traits.id = id;
  extend(window._errs.meta, traits);
};