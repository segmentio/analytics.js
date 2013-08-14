var Provider = require('../provider')
  , load     = require('load-script');

module.exports = Provider.extend({

  name : 'Tapstream',

  key : 'accountName',

  defaults : {
    accountName : null,
    trackerName : 'javascript_tracker',
    tags : [],
    initialPageview : true
  },

  initialize : function (options, ready) {
    window._tsq = window._tsq || [];

    window._tsq.push(["setAccountName", options.accountName]);
    if (options.initialPageview)
        window._tsq.push(["fireHit", options.trackerName, options.tags || []]);

    load("//cdn.tapstream.com/static/js/tapstream.js");
    ready();
  },

  track : function (event, properties) {
    // Tapstream requires a slug for a tracker name.
    event = event.replace(' ', '_').replace(/[^a-zA-Z0-9_\-]/, '');
    window._tsq.push(["fireHit", event, []]);
  }
});
