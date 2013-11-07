
var callback = require('callback');
var canonical = require('canonical');
var each = require('each');
var integration = require('integration');
var is = require('is');
var load = require('load-script');
var push = require('global-queue')('_gaq');
var type = require('type');
var url = require('url');


/**
 * Expose `GA`.
 *
 * http://support.google.com/analytics/bin/answer.py?hl=en&answer=2558867
 * https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiBasicConfiguration#_gat.GA_Tracker_._setSiteSpeedSampleRate
 */

var GA = module.exports = integration('Google Analytics')
  .readyOnLoad()
  .global('ga')
  .global('gaplugins')
  .global('_gaq')
  .global('GoogleAnalyticsObject')
  .option('anonymizeIp', false)
  .option('classic', false)
  .option('domain', 'none')
  .option('doubleClick', false)
  .option('enhancedLinkAttribution', false)
  .option('ignoreReferrer', null)
  .option('siteSpeedSampleRate', null)
  .option('trackingId', '')
  .option('trackNamedPages', true);


/**
 * Initialize.
 *
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/advanced
 */

GA.prototype.initialize = function () {
  var options = this.options;

  if (options.classic) {
    this.load = this.loadClassic;
    this.track = this.trackClassic;
    this.page = this.pageClassic;
    return this.initializeClassic();
  }

  // setup the tracker globals
  window.GoogleAnalyticsObject = 'ga';
  window.ga || (window.ga = function () {
    window.ga.q || (window.ga.q = []);
    window.ga.q.push(arguments);
  });
  window.ga.l = new Date().getTime();

  window.ga('create', options.trackingId, {
    cookieDomain: options.domain || GA.prototype.defaults.domain, // to protect against empty string
    siteSpeedSampleRate: options.siteSpeedSampleRate,
    allowLinker: true
  });

  // anonymize after initializing, otherwise a warning is shown
  // in google analytics debugger
  if (options.anonymizeIp) window.ga('set', 'anonymizeIp', true);

  this.load();
};


/**
 * Load the Google Analytics library.
 *
 * @param {Function} callback
 */

GA.prototype.load = function (callback) {
  load('//www.google-analytics.com/analytics.js', callback);
};


/**
 * Track.
 *
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/events
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

GA.prototype.track = function (event, properties, options) {
  properties = properties || {};
  options = options || {};

  window.ga('send', 'event', {
    eventAction: event,
    eventCategory: properties.category || 'All',
    eventLabel: properties.label,
    eventValue: formatValue(properties.value || properties.revenue),
    nonInteraction: properties.noninteraction || options.noninteraction
  });
};


/**
 * Page.
 *
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/pages
 *
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

GA.prototype.page = function (name, properties, options) {
  properties = properties || {};

  window.ga('send', 'pageview', {
    page: properties.path,
    title: name || properties.title,
    url: properties.url
  });

  if (name && this.options.trackNamedPages) {
    this.track('Viewed ' + name + ' Page', properties);
  }
};


/**
 * Initialize (classic).
 *
 * https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiBasicConfiguration
 */

GA.prototype.initializeClassic = function () {
  var options = this.options;
  var anonymize = options.anonymizeIp;
  var db = options.doubleClick;
  var domain = options.domain;
  var enhanced = options.enhancedLinkAttribution;
  var ignore = options.ignoreReferrer;
  var sample = options.siteSpeedSampleRate;

  window._gaq = window._gaq || [];
  push('_setAccount', options.trackingId);
  push('_setAllowLinker', true);

  if (anonymize) push('_gat._anonymizeIp');
  if (domain) push('_setDomainName', domain);
  if (sample) push('_setSiteSpeedSampleRate', sample);

  if (enhanced) {
    var protocol = 'https:' === document.location.protocol ? 'https:' : 'http:';
    var pluginUrl = protocol + '//www.google-analytics.com/plugins/ga/inpage_linkid.js';
    push('_require', 'inpage_linkid', pluginUrl);
  }

  if (ignore) {
    if (!is.array(ignore)) ignore = [ignore];
    each(ignore, function (domain) {
      push('_addIgnoredRef', domain);
    });
  }

  this.load();
};


/**
 * Load the classic Google Analytics library.
 *
 * @param {Function} callback
 */

GA.prototype.loadClassic = function (callback) {
  if (this.options.doubleClick) {
    load('//stats.g.doubleclick.net/dc.js', callback);
  } else {
    load({
      http: 'http://www.google-analytics.com/ga.js',
      https: 'https://ssl.google-analytics.com/ga.js'
    }, callback);
  }
};


/**
 * Track (classic).
 *
 * https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiEventTracking
 *
 * @param {String} event
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

GA.prototype.trackClassic = function (event, properties, options) {
  properties = properties || {};
  options = options || {};

  var category = properties.category || 'All';
  var label = properties.label;
  var value = formatValue(properties.revenue || properties.value);
  var noninteraction = properties.noninteraction || options.noninteraction;

  push('_trackEvent', category, event, label, value, noninteraction);
};


/**
 * Page (classic).
 *
 * https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiBasicConfiguration
 *
 * @param {String} name (optional)
 * @param {Object} properties (optional)
 * @param {Object} options (optional)
 */

GA.prototype.pageClassic = function (name, properties, options) {
  properties = properties || {};
  options = options || {};

  push('_trackPageview', properties.path);

  if (name && this.options.trackNamedPages) {
    this.track('Viewed ' + name + ' Page', properties, { noninteraction: true });
  }
};


/**
 * Format the value property to Google's liking.
 *
 * @param {Number} value
 * @return {Number}
 */

function formatValue (value) {
  if (!value || value < 0) return 0;
  return Math.round(value);
}