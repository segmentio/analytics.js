'use strict';

var assert = require('chai').assert;
var integrations = require('../lib/integrations');
var intersection = require('lodash.intersection');

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
    'pebble-post'
  ];

  it('should have all the expected integrations', function () {
    var ints = Object.keys(integrations);
    var length = intersection(expectedIntegrations, ints).length;
    assert.equal(length, expectedIntegrations.length);
  });
});
