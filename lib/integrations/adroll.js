
var integration = require('integration');
var load = require('load-script');
var user = require('../user');


/**
 * Expose `AdRoll`.
 */

var AdRoll = module.exports = integration('AdRoll')
  .assumesPageview()
  .readyOnLoad()
  .option('advId', '')
  .option('pixId', '');


/**
 * Exists?
 */

AdRoll.prototype.exists = function () {
  return !! window.__adroll_loaded;
};


/**
 * Initialize.
 *
 * http://support.adroll.com/getting-started-in-4-easy-steps/#step-one
 * http://support.adroll.com/enhanced-conversion-tracking/
 */

AdRoll.prototype.initialize = function () {
  var options = this.options;
  var id = user.id();
  var traits = user.traits();
  if (id) traits.id = id;

  window.adroll_adv_id = options.advId;
  window.adroll_pix_id = options.pixId;
  window.adroll_custom_data = traits;
  window.__adroll_loaded = true;
  this.load();
};


/**
 * Load the AdRoll script.
 *
 * @param {Function} callback
 */

AdRoll.prototype.load = function (callback) {
  load({
    http: 'http://a.adroll.com/j/roundtrip.js',
    https: 'https://s.adroll.com/j/roundtrip.js'
  }, callback);
};