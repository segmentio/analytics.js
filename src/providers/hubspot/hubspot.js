// HubSpot
// -------
// [Documentation](http://hubspot.clarify-it.com/d/4m62hl)

var extend = require('extend')
  , load   = require('load-script')
  , utils  = require('../../utils');


module.exports = HubSpot;

function HubSpot () {
  this.settings = {
    portalId : null
  };
}


// Changes to the HubSpot snippet:
//
// * Concatenate `portalId` into the URL.
HubSpot.prototype.initialize = function (settings) {
  settings = utils.resolveSettings(settings, 'portalId');
  extend(this.settings, settings);

  // HubSpot checks in their snippet to make sure another script with
  // `hs-analytics` isn't already in the DOM. Seems excessive, but who knows
  // if there's weird deprecation going on :p
  if (!document.getElementById('hs-analytics')) {
    var script = load('https://js.hubspot.com/analytics/' + (Math.ceil(new Date()/300000)*300000) + '/' + this.settings.portalId + '.js');
    script.id = 'hs-analytics';
  }
};


HubSpot.prototype.identify = function (userId, traits) {
  // HubSpot does not use a userId, but the email address is required on
  // the traits object.
  if (!traits) return;

  window._hsq.push(["identify", traits]);
};


// Event Tracking is available to HubSpot Enterprise customers only. In
// addition to adding any unique event name, you can also use the id of an
// existing custom event as the event variable.
HubSpot.prototype.track = function (event, properties) {
  window._hsq.push(["trackEvent", event, properties]);
};


HubSpot.prototype.pageview = function () {
  // TODO http://performabledoc.hubspot.com/display/DOC/JavaScript+API
};