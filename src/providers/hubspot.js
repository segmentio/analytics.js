// http://hubspot.clarify-it.com/d/4m62hl

var Provider = require('../provider')
  , isEmail  = require('is-email')
  , load     = require('load-script');


module.exports = Provider.extend({

  name : 'HubSpot',

  key : 'portalId',

  defaults : {
    portalId : null
  },

  initialize : function (options, ready) {
    // HubSpot checks in their snippet to make sure another script with
    // `hs-analytics` isn't already in the DOM. Seems excessive, but who knows
    // if there's weird deprecation going on :p
    if (!document.getElementById('hs-analytics')) {
      window._hsq = window._hsq || [];
      var script = load('https://js.hubspot.com/analytics/' + (Math.ceil(new Date()/300000)*300000) + '/' + options.portalId + '.js');
      script.id = 'hs-analytics';
    }

    // HubSpot makes a queue, so it's ready immediately.
    ready();
  },

  // HubSpot does not use a userId, but the email address is required on
  // the traits object.
  identify : function (userId, traits) {
    // If there wasn't already an email and the userId is one, use it.
    if ((!traits || !traits.email) && isEmail(userId)) {
      traits || (traits = {});
      traits.email = userId;
    }

    // Still don't have any traits? Get out.
    if (!traits) return;

    window._hsq.push(["identify", traits]);
  },

  // Event Tracking is available to HubSpot Enterprise customers only. In
  // addition to adding any unique event name, you can also use the id of an
  // existing custom event as the event variable.
  track : function (event, properties) {
    window._hsq.push(["trackEvent", event, properties]);
  },

  // HubSpot doesn't support passing in a custom URL.
  pageview : function (url) {
    window._hsq.push(['_trackPageview']);
  }

});