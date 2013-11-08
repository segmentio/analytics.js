var integration = require('../integration')
  , load = require('load-script');


/**
 * Expose `Lucky Orange` integration.
 * http://www.luckyorange.com
 */

var LuckyOrange = module.exports = integration('LuckyOrange');


/**
 * Required key.
 */

LuckyOrange.prototype.key = 'site_id';


/**
 * Default options.
 */

LuckyOrange.prototype.defaults = {
  // your lucky orange site id (required)
  site_id: 0
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

LuckyOrange.prototype.initialize = function (options, ready) {
  window._loq || (window._loq = []);
  window.__wtw_lucky_site_id = options.site_id;
  window.__wtw_lucky_is_segment_io = true;
  
  var cache = Math.floor(new Date().getTime() / 60000);
  load({
    http: 'http://www.luckyorange.com/w.js?' + cache,
    https: 'https://ssl.luckyorange.com/w.js?' + cache
  }, ready);
  
};

/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

LuckyOrange.prototype.identify = function (id, traits, options) {
  if (id) window._loq.push(['identify', id]);
  if (traits) window._loq.push(['set', traits]);
};