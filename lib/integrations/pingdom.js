
var date = require('load-date')
  , integration = require('../integration')
  , load = require('load-script');


/**
 * Expose `Pingdom` integration.
 */

var Pingdom = module.exports = integration('Pingdom');


/**
 * Required key.
 */

Pingdom.prototype.key = 'id';


/**
 * Default options.
 */

Pingdom.prototype.defaults = {
  // your pingdom id (required)
  id: ''
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

Pingdom.prototype.initialize = function (options, ready) {
  window._prum = [
    ['id', options.id],
    ['mark', 'firstbyte', date.getTime()]
  ];
  load('//rum-static.pingdom.net/prum.min.js', ready);
};