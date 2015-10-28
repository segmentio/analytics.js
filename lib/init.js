var queue = window.analytics || [];
var analytics = require('./');
var snippetVersion = analytics && analytics.SNIPPET_VERSION ? parseFloat(analytics.SNIPPET_VERSION, 10) : 0;

analytics.initialize({
    'Clicky': {
        'siteId': '100564589'
    },
    'Facebook Conversion Tracking': {
        'events': {
            'Bid on Item': '6028518646866',
            'New User Sign Up': '6021964307866',
            'Invoice Paid': '6021964312866',
            'Email Sign Up': '6029480783666'
        }
    },
    'Facebook Custom Audiences': {
        'pixelId': '316895615167684',
        'events': {}
    },
    'Google Analytics': {
        'dimensions': {
            'role': 'dimension1'
        },
        'reportUncaughtExceptions': false,
        'sendUserId': false,
        'siteSpeedSampleRate': 1,
        'nonInteraction': false,
        'enhancedLinkAttribution': false,
        'anonymizeIp': false,
        'includeSearch': false,
        'trackCategorizedPages': true,
        'trackNamedPages': true,
        'ignoredReferrers': [''],
        'enhancedEcommerce': false,
        'domain': '',
        'mobileTrackingId': '',
        'doubleClick': false,
        'classic': false,
        'trackingId': 'UA-61238648-1',
        'initialPageview': true,
        'metrics': {}
    },
    'Optimizely': {
        'listen': false,
        'trackCategorizedPages': true,
        'trackNamedPages': true,
        'variations': true,
        'projectId': 1503693194,
        'accountId': 1503693194
    },
    'Segment.io': {
        'apiKey': 'K4hUTtxzMmPILkGJhL9VjcYGhQH3r1nS'
    }
}, {
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
