
var integration = require('../integration')
  , load = require('load-script');


/**
 * Expose `CrazyEgg` integration.
 */

var CrazyEgg = module.exports = integration('CrazyEgg');


/**
 * Required key.
 */

CrazyEgg.prototype.key = 'accountNumber';


/**
 * Default options.
 */

CrazyEgg.prototype.defaults = {
  // your crazy egg account number (required)
  accountNumber: ''
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

CrazyEgg.prototype.initialize = function (options, ready) {
  var account = options.accountNumber;
  var accountPath = account.slice(0,4) + '/' + account.slice(4);
  var cacheBust = Math.floor(new Date().getTime()/3600000);
  load('//dnn506yrbagrg.cloudfront.net/pages/scripts/' + accountPath + '.js?' + cacheBust, ready);
};