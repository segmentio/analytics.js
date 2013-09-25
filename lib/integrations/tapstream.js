
var callback = require('callback')
  , integration = require('../integration')
  , load = require('load-script')
  , slug = require('slug');


/**
 * Expose `Tapstream` integration.
 */

var Tapstream = module.exports = integration('Tapstream');


/**
 * Required key.
 */

Tapstream.prototype.key = 'accountName';


/**
 * Default options.
 */

Tapstream.prototype.defaults = {
  // your tapstream account name (required)
  accountName: '',
  // whether to track an initial pageview
  initialPageview: true
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

Tapstream.prototype.initialize = function (options, ready) {
  window._tsq = window._tsq || [];
  window._tsq.push(['setAccountName', options.accountName]);
  if (options.initialPageview) this.pageview();
  load('//cdn.tapstream.com/static/js/tapstream.js');
  callback.async(ready);
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Tapstream.prototype.track = function (event, properties, options) {
  event = slug(event); // tapstream needs events as slugs
  window._tsq.push(['fireHit', event, []]);
};


/**
 * Pageview.
 *
 * @param {String} url
 */

Tapstream.prototype.pageview = function (url) {
  var event = slug('Loaded a Page');
  window._tsq.push(['fireHit', event, [url]]);
};