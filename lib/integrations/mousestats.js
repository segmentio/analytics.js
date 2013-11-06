
var each = require('each');
var integration = require('integration');
var load = require('load-script');


/**
 * Expose `MouseStats`.
 */

var MouseStats = module.exports = integration('MouseStats')
  .assumesPageview()
  .readyOnLoad()
  .global('msaa')
  .option('accountNumber', '');


/**
 * Initialize.
 *
 * http://www.mousestats.com/docs/pages/allpages
 */

MouseStats.prototype.initialize = function () {
  this.load();
};


/**
 * Load.
 *
 * @param {Function} callback
 */

MouseStats.prototype.load = function (callback) {
  var number = this.options.accountNumber;
  var path = number.slice(0,1) + '/' + number.slice(1,2) + '/' + number;
  var cache = Math.floor(new Date().getTime() / 60000);
  var partial = '.mousestats.com/js/' + path + '.js?' + cache;
  var http = 'http://www2' + partial;
  var https = 'https://ssl' + partial;
  load({ http: http, https: https }, callback);
};


/**
 * Identify.
 *
 * http://www.mousestats.com/docs/wiki/7/how-to-add-custom-data-to-visitor-playbacks
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

MouseStats.prototype.identify = function (id, traits, options) {
  if (id) traits.id = id;
  each(traits, function (key, value) {
    window.MouseStatsVisitorPlaybacks.customVariable(key, value);
  });
};