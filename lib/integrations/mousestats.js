
var integration = require('../integration')
  , load = require('load-script');


/**
 * Expose `MouseStats` integration.
 *
 * // http://www.mousestats.com
 * // http://blog.mousestats.com
 */

var MouseStats = module.exports = integration('MouseStats');


/**
 * Required key.
 */

MouseStats.prototype.key = 'accountNumber';


/**
 * Default options.
 */

MouseStats.prototype.defaults = {
  accountNumber: ''
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

MouseStats.prototype.initialize = function (options, ready) {
  var number = options.accountNumber;
  var path = number.slice(0,1) + '/' + number.slice(1,2) + '/' + number;
  var cache = Math.floor(new Date().getTime() / 60000);
  load({
    http: 'http://www2.mousestats.com/js/' + path + '.js?' + cache,
    https: 'https://ssl.mousestats.com/js/' + path + '.js?' + cache
  }, ready);
};