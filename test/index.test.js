'use strict';

var assert = require('chai').assert;
var integrations = require('../lib/integrations');
var intersection = require('lodash.intersection');
var analytics = require('../lib');

describe('analytics.js', function () {
  var expectedIntegrations = [
    'astronomer',
    'taboola',
    'kenshoo-infinity-pixel',
    'acquisio',
    'bloom-reach',
    'criteo',
    'doubleclick-floodlight',
    'retention-science',
    'rubicon',
    'marin',
    'adwords',
    'amplitude',
    'bing-ads',
    'clicky',
    'customerio',
    'facebook-pixel',
    'google-analytics',
    'google-tag-manager',
    'hubspot',
    'intercom',
    'keen-io',
    'kenshoo',
    'kissmetrics',
    'klaviyo',
    'lytics',
    'mixpanel',
    'optimizely',
    'twitter-ads',
    'vero',
    'visual-website-optimizer',
    'woopra',
    'heap',
    'pinterest-conversions',
    'resonate',
    'pebble-post',
    'hotjar'
  ];

  it('should have all the expected integrations', function () {
    var allIntegrations = Object.keys(integrations);
    var expectedLength = intersection(expectedIntegrations, allIntegrations).length;
    assert.equal(expectedLength, allIntegrations.length);
  });

  it('should initialize', function () {
      var queue = window.analytics || [];
      var snippetVersion = queue && queue.SNIPPET_VERSION ? parseFloat(queue.SNIPPET_VERSION, 10) : 0;

      analytics.initialize({}, {
          initialPageview: 0 === snippetVersion,
          plan: {
              track: {}
          }
      });

      for (; queue && queue.length > 0;) {
          var args = queue.shift();
          var method = args.shift();
          analytics[method] && analytics[method].apply(analytics, args)
      }

      window.analytics = analytics;
  });
});
