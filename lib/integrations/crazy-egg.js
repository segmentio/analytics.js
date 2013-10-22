
var integration = require('../integration');
var load = require('load-script');


/**
 * Expose `CrazyEgg` integration.
 */

var CrazyEgg = module.exports = integration('Crazy Egg');


/**
 * Default options.
 */

CrazyEgg.prototype.defaults = {
  // your crazy egg account number (required)
  accountNumber: ''
};


/**
 * Initialize.
 */

CrazyEgg.prototype.initialize = function () {
  this.load(this.ready);
};


/**
 * Load the Crazy Egg library.
 *
 * @param {Function} callback
 */

CrazyEgg.prototype.load = function (callback) {
  var number = this.options.accountNumber;
  var path = number.slice(0,4) + '/' + number.slice(4);
  var cache = Math.floor(new Date().getTime()/3600000);
  var url = '//dnn506yrbagrg.cloudfront.net/pages/scripts/' + path + '.js?' + cache;
  load(url, callback);
};