
var integration = require('../integration')
  , load = require('load-script');


/**
 * Expose `LeadLander` integration.
 */

var LeadLander = module.exports = integration('LeadLander');


/**
 * Required key.
 */

LeadLander.prototype.key = 'llactid';


/**
 * Default options.
 */

LeadLander.prototype.defaults = {
  // your leadlander account id (required)
  llactid: null
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

LeadLander.prototype.initialize = function (options, ready) {
  window.llactid = options.llactid;
  load('http://t6.trackalyzer.com/trackalyze-nodoc.js', ready);
};