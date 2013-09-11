
var integration = require('../integration')
  , load = require('load-script');


/**
 * Expose `SnapEngage` integration.
 *
 * http://help.snapengage.com/installation-guide-getting-started-in-a-snap/
 */

var SnapEngage = module.exports = integration('SnapEngage');


/**
 * Required key.
 */

SnapEngage.prototype.key = 'apiKey';


/**
 * Default options.
 */

SnapEngage.prototype.defaults = {
  // your snapengage api key (required)
  apiKey: ''
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

SnapEngage.prototype.initialize = function (options, ready) {
  load('//commondatastorage.googleapis.com/code.snapengage.com/js/' + options.apiKey + '.js', ready);
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

SnapEngage.prototype.identify = function (id, traits, options) {
  if (!traits.email) return;
  window.SnapABug.setUserEmail(traits.email);
};