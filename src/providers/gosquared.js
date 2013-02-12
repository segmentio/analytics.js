// GoSquared
// ---------
// [Documentation](www.gosquared.com/support).
// [Tracker Functions](https://www.gosquared.com/customer/portal/articles/612063-tracker-functions)
// Will automatically [integrate with Olark](https://www.gosquared.com/support/articles/721791-setting-up-olark-live-chat).

var Provider = require('../../provider')
  , extend   = require('extend')
  , load     = require('load-script');


module.exports = Provider.extend({

  key : 'siteToken',

  options : {
    siteToken : null
  },


  initialize : function (options) {
    window.GoSquared = {};
    window.GoSquared.acct = options.siteToken;
    window.GoSquared.q = [];
    window._gstc_lt =+ (new Date());
    load('//d1l6p2sc9645hc.cloudfront.net/tracker.js');
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