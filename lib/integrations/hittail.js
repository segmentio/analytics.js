
var integration = require('../integration')
  , load = require('load-script');


/**
 * Expose `HitTail` integration.
 */

var HitTail = module.exports = integration('HitTail');


/**
 * Required key.
 */

HitTail.prototype.key = 'siteId';


/**
 * Default options.
 */

HitTail.prototype.defaults = {
  // your hittail site id (required)
  siteId: ''
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

HitTail.prototype.initialize = function (options, ready) {
  load('//' + options.siteId + '.hittail.com/mlt.js', ready);
};