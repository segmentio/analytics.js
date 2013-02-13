// Google Analytics
// ----------------
// [Documentation](https://developers.google.com/analytics/devguides/collection/gajs/).

var Provider = require('../provider')
  , each     = require('each')
  , extend   = require('extend')
  , load     = require('load-script')
  , type     = require('type')
  , url      = require('url');


module.exports = Provider.extend({

  key : 'trackingId',

  options : {
    anonymizeIp             : false,
    enhancedLinkAttribution : false,
    siteSpeedSampleRate     : null,
    domain                  : null,
    trackingId              : null
  },


  initialize : function (options) {
    window._gaq = window._gaq || [];
    window._gaq.push(['_setAccount', options.trackingId]);

    // Apply a bunch of settings.
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
    if(options.anonymizeIp) {
      window._gaq.push(['_gat._anonymizeIp']);
    }

    // Track the initial pageview, using the canonical URL path if available.
    var canonicalPath
      , metaTags = document.getElementsByTagName('meta');
    each(metaTags, function (el) {
      if (el.getAttribute('rel') === 'canonical') {
        canonicalPath = url.parse(el.getAttribute('href')).pathname;
      }
    });
    this.pageview(canonicalPath);

    load({
      http  : 'http://www.google-analytics.com/ga.js',
      https : 'https://ssl.google-analytics.com/ga.js'
    });
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