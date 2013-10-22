
var callback = require('callback');
var integration = require('../integration');
var load = require('load-script');


/**
 * Expose `Amplitude` integration.
 *
 * https://github.com/amplitude/Amplitude-Javascript
 */

var Amplitude = module.exports = integration('Amplitude');


/**
 * Default options.
 */

Amplitude.prototype.defaults = {
  // your amplitude api key (required)
  apiKey: '',
  // whether to track all `page` calls to amplitude
  trackAllPages: false,
  // whether to track named `page` calls to amplitude
  trackNamedPages: true
};


/**
 * Load the Amplitude library.
 */

Amplitude.prototype.load = function () {
  load('https://d24n15hnbwhuhn.cloudfront.net/libs/amplitude-1.0-min.js');
};


/**
 * Initialize.
 *
 * @param {Object} options
 */

Amplitude.prototype.initialize = function (options) {
  (function(e,t){var r=e.amplitude||{};
  r._q=[];function i(e){r[e]=function(){r._q.push([e].concat(Array.prototype.slice.call(arguments,0)));};}
  var s=["init","logEvent","setUserId","setGlobalUserProperties","setVersionName"];
  for(var c=0;c<s.length;c++){i(s[c]);}e.amplitude=r;})(window,document);
  window.amplitude.init(options.apiKey);
  callback.async(this.ready);
  this.load();
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
 * Page.
 *
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

Amplitude.prototype.page = function (name, properties, options) {
  // named pages
  if (this.options.trackNamedPages && name) {
    this.track('Viewed ' + name + ' Page', properties);
  }

  // all pages
  if (this.options.trackAllPages) {
    this.track('Loaded a Page', properties);
  }
};