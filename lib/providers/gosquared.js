// http://www.gosquared.com/support
// https://www.gosquared.com/customer/portal/articles/612063-tracker-functions

var Provider = require('../provider');
var user = require('../user');
var load = require('load-script');
var onBody = require('on-body');


module.exports = Provider.extend({

  name : 'GoSquared',

  key : 'siteToken',

  defaults : {
    siteToken : null
  },

  initialize : function (options, ready) {
    // GoSquared assumes a body in their script, so we need this wrapper
    var self = this;
    onBody(function () {
      window.GoSquared = {};
      window.GoSquared.acct = options.siteToken;
      window.GoSquared.q = [];
      window._gstc_lt =+ (new Date());

      // identify since GoSquared doesn't have an async identify API
      self.identify(user.id(), user.traits());

      load('//d1l6p2sc9645hc.cloudfront.net/tracker.js');
      ready();
    });
  },

  identify : function (id, traits) {
    window.GoSquared.UserName = id;
    window.GoSquared.VisitorName = traits.email || traits.username || id;
    window.GoSquared.Visitor = traits;
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