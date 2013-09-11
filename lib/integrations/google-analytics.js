
var canonical = require('canonical')
  , each = require('each')
  , integration = require('../integration')
  , is = require('is')
  , load = require('load-script')
  , type = require('type')
  , url = require('url');


/**
 * Expose `GA` integration.
 *
 * https://developers.google.com/analytics/devguides/collection/gajs/
 */

var GA = module.exports = integration('Google Analytics');


/**
 * Required key.
 */

GA.prototype.key = 'trackingId';


/**
 * Default options.
 */

GA.prototype.defaults = {
  // whether to anonymize the IP address collected for the user
  anonymizeIp : false,
  // restrict analytics to only come from the a single `domain`
  domain : 'none',
  // whether to enable google's doubleclick remarketing feature
  doubleClick : false,
  // whether to enabled enhanced link attribution
  // http://support.google.com/analytics/bin/answer.py?hl=en&answer=2558867
  enhancedLinkAttribution : false,
  // a list of domains to ignore referrals from
  ignoreReferrer : null,
  // whether or not to track and initial pageview on load
  initialPageview : true,
  // the ratio to show in site speed samples
  // https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiBasicConfiguration#_gat.GA_Tracker_._setSiteSpeedSampleRate
  siteSpeedSampleRate : null,
  // your google analytics tracking id (required)
  trackingId: '',
  // whether you're using the new universal analytics or not
  universalClient: false
};


/**
 * Initialize.
 *
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/advanced
 *
 * @param {Object} options
 * @param {Function} ready
 */

GA.prototype.initialize = function (options, ready) {
  if (!options.universalClient) {
    this.track = this.trackClassic;
    this.pageview = this.pageviewClassic;
    return this.initializeClassic(options, ready);
  }

  // setup the tracker globals
  window.GoogleAnalyticsObject = 'ga';
  window.ga || (window.ga = function () {
    window.ga.q || (window.ga.q = []);
    window.ga.q.push(arguments);
  });
  window.ga.l = new Date().getTime();

  // anonymize before initializing
  if (options.anonymizeIp) window.ga('set', 'anonymizeIp', true);

  // initialize
  window.ga('create', options.trackingId, {
    cookieDomain: options.domain,
    siteSpeedSampleRate: options.siteSpeedSampleRate
  });

  // track a pageview with the canonical url
  if (options.initialPageview) {
    var path, canon = canonical();
    if (canon) path = url.parse(canon).pathname;
    this.pageview(path);
  }

  ready();
  load('//www.google-analytics.com/analytics.js');
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
  options || (options = {});
  window.ga('send', 'event', {
    eventAction: event,
    eventCategory: properties.category || 'All',
    eventLabel: properties.label,
    eventValue: formatValue(properties.value || properties.revenue),
    nonInteraction: properties.noninteraction || options.noninteraction
  });
};


/**
 * Pageview.
 *
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/pages
 *
 * @param {String} url (optional)
 */

GA.prototype.pageview = function (url) {
  window.ga('send', 'pageview', {
    page: url
  });
};


/**
 * Initialize (classic).
 *
 * https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiBasicConfiguration
 *
 * @param {Object} options
 * @param {Function} ready
 */

GA.prototype.initializeClassic = function (options, ready) {
  window._gaq || (window._gaq = []);
  push('_setAccount', options.trackingId);

  var anonymize = options.anonymizeIp;
  var db = options.doubleClick;
  var domain = options.domain;
  var enhanced = options.enhancedLinkAttribution;
  var ignore = options.ignoreReferrer;
  var initial = options.initialPageview;
  var sample = options.siteSpeedSampleRate;

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

  if (initial) {
    var path, canon = canonical();
    if (canon) path = url.parse(canon).pathname;
    this.pageview(path);
  }

  if (db) {
    load('//stats.g.doubleclick.net/dc.js', ready);
  } else {
    load({
      http: 'http://www.google-analytics.com/ga.js',
      https: 'https://ssl.google-analytics.com/ga.js'
    }, ready);
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
  options || (options = {});
  var category = properties.category || 'All';
  var label = properties.label;
  var value = formatValue(properties.revenue || properties.value);
  var noninteraction = properties.noninteraction || options.noninteraction;

  push('_trackEvent', category, event, label, value, noninteraction);
};


/**
 * Pageview (classic).
 *
 * https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiBasicConfiguration
 *
 * @param {String} url (optional)
 */

GA.prototype.pageviewClassic = function (url) {
  push('_trackPageview', url);
};


/**
 * Helper to push onto the classic Google Analytics queue.
 *
 * @param {Mixed} args...
 */

function push (args) {
  args = [].slice.call(arguments);
  window._gaq.push.call(window._gaq, args);
}


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