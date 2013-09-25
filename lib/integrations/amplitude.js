
var callback = require('callback')
  , integration = require('../integration')
  , load = require('load-script');


/**
 * Expose `Amplitude` integration.
 *
 * https://github.com/amplitude/Amplitude-Javascript
 */

var Amplitude = module.exports = integration('Amplitude');


/**
 * Required key.
 */

Amplitude.prototype.key = 'apiKey';


/**
 * Default options.
 */

Amplitude.prototype.defaults = {
  // your amplitude api key (required)
  apiKey: '',
  // whether to track `pageview` calls to amplitude
  pageview: false
};


/**
 * Initialize.
 *
 * @param {Object} options
 * @param {Function} ready
 */

Amplitude.prototype.initialize = function (options, ready) {
  (function(e,t){var r=e.amplitude||{};
  r._q=[];function i(e){r[e]=function(){r._q.push([e].concat(Array.prototype.slice.call(arguments,0)));};}
  var s=["init","logEvent","setUserId","setGlobalUserProperties","setVersionName"];
  for(var c=0;c<s.length;c++){i(s[c]);}e.amplitude=r;})(window,document);
  window.amplitude.init(options.apiKey);
  callback.async(ready);

  load('https://d24n15hnbwhuhn.cloudfront.net/libs/amplitude-1.0-min.js');
};


/**
 * Identify.
 *
 * @param {String} id (optional)
 * @param {Object} traits (optional)
 * @param {Object} options (optional)
 */

Amplitude.prototype.identify = function (id, traits, options) {
  if (id) window.amplitude.setUserId(id);
  if (traits) window.amplitude.setGlobalUserProperties(traits);
};


/**
 * Track.
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Amplitude.prototype.track = function (event, properties, options) {
  window.amplitude.logEvent(event, properties);
};


/**
 * Pageview.
 *
 * @param {String} url (optional)
 */

Amplitude.prototype.pageview = function (url) {
  if (!this.options.pageview) return;
  this.track('Loaded a Page', {
    url: url || window.location.href,
    title: document.title
  });
};