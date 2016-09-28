/* eslint quote-props: off */
'use strict';

/*
   Add all integrations you want registered here.
   Integration repos: https://github.com/segment-integrations?utf8=%E2%9C%93&query=analytics.js
   Make sure the integrations added are also installed and saved in the package.json
   */
module.exports = {
    'taboola': require('@astronomerio/analytics.js-integration-taboola'),
    'kenshoo-infinity-pixel': require('@astronomerio/analytics.js-integration-kenshoo-infinity'),
    'acquisio': require('@astronomerio/analytics.js-integration-acquisio'),
    'bloom-reach': require('@astronomerio/analytics.js-integration-bloomreach'),
    'criteo': require('@astronomerio/analytics.js-integration-criteo'),
    'doubleclick-floodlight': require('@astronomerio/analytics.js-integration-doubleclick'),
    'retention-science': require('@astronomerio/analytics.js-integration-retention-science'),
    'rubicon': require('@astronomerio/analytics.js-integration-rubicon'),
    'marin': require('@astronomerio/analytics.js-integration-marin'),
    'adwords': require('@astronomerio/analytics.js-integration-adwords'),
    'amplitude': require('@astronomerio/analytics.js-integration-amplitude'),
    'bing-ads': require('@astronomerio/analytics.js-integration-bing-ads'),
    'clicky': require('@astronomerio/analytics.js-integration-clicky'),
    'customerio': require('@astronomerio/analytics.js-integration-customerio'),
    'facebook-pixel': require('@astronomerio/analytics.js-integration-facebook-pixel'),
    'google-analytics': require('@astronomerio/analytics.js-integration-google-analytics'),
    'google-tag-manager': require('@astronomerio/analytics.js-integration-google-tag-manager'),
    'hubspot': require('@astronomerio/analytics.js-integration-hubspot'),
    'intercom': require('@astronomerio/analytics.js-integration-intercom'),
    'keen-io': require('@astronomerio/analytics.js-integration-keen-io'),
    'kenshoo': require('@astronomerio/analytics.js-integration-kenshoo'),
    'kissmetrics': require('@astronomerio/analytics.js-integration-kissmetrics'),
    'klaviyo': require('@astronomerio/analytics.js-integration-klaviyo'),
    'lytics': require('@astronomerio/analytics.js-integration-lytics'),
    'mixpanel': require('@astronomerio/analytics.js-integration-mixpanel'),
    'optimizely': require('@astronomerio/analytics.js-integration-optimizely'),
    'twitter-ads': require('@astronomerio/analytics.js-integration-twitter-ads'),
    'vero': require('@astronomerio/analytics.js-integration-vero'),
    'visual-website-optimizer': require('@astronomerio/analytics.js-integration-visual-website-optimizer'),
    'woopra': require('@astronomerio/analytics.js-integration-woopra'),
    'heap': require('@astronomerio/analytics.js-integration-heap'),
    'pinterest-conversions': require('@astronomerio/analytics.js-integration-pinterest-conversions'),
    'resonate': require('@astronomerio/analytics.js-integration-resonate')
};
