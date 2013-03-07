// GoSquared
// ---------
// [Documentation](www.gosquared.com/support).
// [Tracker Functions](https://www.gosquared.com/customer/portal/articles/612063-tracker-functions)
// Will automatically [integrate with Olark](https://www.gosquared.com/support/articles/721791-setting-up-olark-live-chat).

var Provider = require('../provider')
  , user     = require('../user')
  , load     = require('load-script');


module.exports = Provider.extend({

  key : 'siteToken',

  options : {
    siteToken : null
  },


  initialize : function (options, ready) {
    var GoSquared = window.GoSquared = {};
    GoSquared.acct = options.siteToken;
    GoSquared.q = [];
    window._gstc_lt =+ (new Date());

    GoSquared.VisitorName = user.id();
    GoSquared.Visitor = user.traits();

    load('//d1l6p2sc9645hc.cloudfront.net/tracker.js');

    // GoSquared makes a queue, so it's ready immediately.
    ready();
  },


  identify : function (userId, traits) {
    // TODO figure out if this will actually work. Seems like GoSquared will
    // never know these values are updated.
    if (userId) window.GoSquared.UserName = userId;
    if (traits) window.GoSquared.Visitor = traits;
  },


  track : function (event, properties) {
    // GoSquared sets a `gs_evt_name` property with a value of the event
    // name, so it relies on properties being an object.
    window.GoSquared.q.push(['TrackEvent', event, properties || {}]);
  },


  pageview : function (url) {
    window.GoSquared.q.push(['TrackView', url]);
  }

});