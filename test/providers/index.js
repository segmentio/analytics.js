
describe('Providers', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert');

it('should be a list of all our providers', function () {
  var Providers = analytics.Providers;
  assert(Providers['AdRoll']);
  assert(Providers['Amplitude']);
  assert(Providers['BugHerd']);
  assert(Providers['Chartbeat']);
  assert(Providers['ClickTale']);
  assert(Providers['comScore']);
  assert(Providers['CrazyEgg']);
  assert(Providers['Customer.io']);
  assert(Providers['Errorception']);
  assert(Providers['FoxMetrics']);
  assert(Providers['Gauges']);
  assert(Providers['Get Satisfaction']);
  assert(Providers['Google Analytics']);
  assert(Providers['GoSquared']);
  assert(Providers['Heap']);
  assert(Providers['HitTail']);
  assert(Providers['HubSpot']);
  assert(Providers['Improvely']);
  assert(Providers['Intercom']);
  assert(Providers['Keen IO']);
  assert(Providers['KISSmetrics']);
  assert(Providers['Klaviyo']);
  assert(Providers['LeadLander']);
  assert(Providers['LiveChat']);
  assert(Providers['Lytics']);
  assert(Providers['Mixpanel']);
  assert(Providers['MouseStats']);
  assert(Providers['Olark']);
  assert(Providers['Optimizely']);
  assert(Providers['Perfect Audience']);
  assert(Providers['Pingdom']);
  assert(Providers['Preact']);
  assert(Providers['Qualaroo']);
  assert(Providers['Quantcast']);
  assert(Providers['Sentry']);
  assert(Providers['SnapEngage']);
  assert(Providers['Spinnakr']);
  assert(Providers['Tapstream']);
  assert(Providers['trak.io']);
  assert(Providers['USERcycle']);
  assert(Providers['userfox']);
  assert(Providers['UserVoice']);
  assert(Providers['Vero']);
  assert(Providers['Visual Website Optimizer']);
  assert(Providers['Woopra']);
});

});