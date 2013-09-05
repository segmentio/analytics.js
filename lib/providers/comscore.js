
var integration = require('../integration')
  , load = require('load-script');


/**
 * Expose `comScore` integration.
 *
 * https://github.com/amplitude/comScore-Javascript
 */

var comScore = module.exports = integration('comScore');


/**
 * Required key.
 */

comScore.prototype.key = 'c2';


/**
 * Default options.
 */

comScore.prototype.defaults = {
  // your comscore `c1` id (you shouldn't need to change this)
  c1: '2',
  // your comscore `c2` id (required)
  c2: ''
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

comScore.prototype.initialize = function (options, ready) {
  window._comscore = window._comscore || [];
  window._comscore.push(options);
  load({
    http  : 'http://b.scorecardresearch.com/beacon.js',
    https : 'https://sb.scorecardresearch.com/beacon.js'
  }, ready);
};