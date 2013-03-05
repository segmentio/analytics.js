// Google Analytics
// ----------------
// [Documentation](https://developers.google.com/analytics/devguides/collection/gajs/).

var Provider  = require('../provider')
  , each      = require('each')
  , extend    = require('extend')
  , load      = require('load-script')
  , type      = require('type')
  , url       = require('url')
  , canonical = require('canonical');


module.exports = Provider.extend({

  key : 'trackingId',

  options : {
    // Your Google Analytics Tracking ID.
    trackingId : null,
    // Whether or not to track and initial pageview when initialized.
    initialPageview : true,
    // An optional domain setting, to restrict where events can originate from.
    domain : null,
    // Whether to anonymize the IP address collected for the user.
    anonymizeIp : false,
    // Whether to use Google Analytics's Enhanced Link Attribution feature:
    // http://support.google.com/analytics/bin/answer.py?hl=en&answer=2558867
    enhancedLinkAttribution : false,
    // The setting to use for Google Analytics's Site Speed Sample Rate feature:
    // https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiBasicConfiguration#_gat.GA_Tracker_._setSiteSpeedSampleRate
    siteSpeedSampleRate : null,
    // Whether to enable GOogle's DoubleClick remarketing feature.
    doubleClick : false
  },


  initialize : function (options, ready) {
    window._gaq = window._gaq || [];
    window._gaq.push(['_setAccount', options.trackingId]);

    // Apply a bunch of optional settings.
    if (options.domain) {
      window._gaq.push(['_setDomainName', options.domain]);
    }
    if (options.enhancedLinkAttribution) {
      var protocol = 'https:' === document.location.protocol ? 'https:' : 'http:';
      var pluginUrl = protocol + '//www.google-analytics.com/plugins/ga/inpage_linkid.js';
      window._gaq.push(['_require', 'inpage_linkid', pluginUrl]);
    }
    if (type(options.siteSpeedSampleRate) === 'number') {
      window._gaq.push(['_setSiteSpeedSampleRate', options.siteSpeedSampleRate]);
    }
    if (options.anonymizeIp) {
      window._gaq.push(['_gat._anonymizeIp']);
    }
    if (options.initialPageview) {
      var path, canon = canonical();
      if (canon) path = url.parse(canon).pathname;
      this.pageview(path);
    }

    // URLs change if DoubleClick is on.
    if (options.doubleClick) {
      load('//stats.g.doubleclick.net/dc.js');
    } else {
      load({
        http  : 'http://www.google-analytics.com/ga.js',
        https : 'https://ssl.google-analytics.com/ga.js'
      });
    }

    // Google makes a queue so it's ready immediately.
    ready();
  },


  track : function (event, properties) {
    properties || (properties = {});

    var value;

    // Since value is a common property name, ensure it is a number
    if (type(properties.value) === 'number') value = properties.value;

    // Try to check for a `category` and `label`. A `category` is required,
    // so if it's not there we use `'All'` as a default. We can safely push
    // undefined if the special properties don't exist. Try using revenue
    // first, but fall back to a generic `value` as well.
    window._gaq.push([
      '_trackEvent',
      properties.category || 'All',
      event,
      properties.label,
      Math.round(properties.revenue) || value,
      properties.noninteraction
    ]);
  },


  pageview : function (url) {
    // If there isn't a url, that's fine.
    window._gaq.push(['_trackPageview', url]);
  }

});