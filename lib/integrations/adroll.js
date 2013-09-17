
var integration = require('../integration')
  , load = require('load-script')
  , user = require('../user');


/**
 * Expose `AdRoll` integration.
 */

var AdRoll = module.exports = integration('AdRoll');


/**
 * Default options.
 */

AdRoll.prototype.defaults = {
  // your adroll advertiser id (required)
  advId: '',
  // your adroll pixel id (required)
  pixId: ''
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

AdRoll.prototype._initialize = function (options, ready) {
  window.adroll_adv_id = options.advId;
  window.adroll_pix_id = options.pixId;
  window.adroll_custom_data = user.traits();
  if (user.id()) window.adroll_custom_data.id = user.id();
  window.__adroll_loaded = true;

  load({
    http: 'http://a.adroll.com/j/roundtrip.js',
    https: 'https://s.adroll.com/j/roundtrip.js'
  }, ready);
};


/**
 * Page.
 *
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

AdRoll.prototype.page = function (name, properties, options) {
  if (!this.initialized) this.page();
};