
describe('analytics', function () {

  var analytics = window.analytics;
  var require = analytics.require;
  var assert = dev('assert');
  var createIntegration = require('integration');
  var each = require('each');
  var Integrations = require('integrations');
  var is = require('is');

  it('should expose a .VERSION', function () {
    assert(analytics.VERSION);
  });

  it('should add integrations', function () {
    each(Integrations, function (name, plugin) {
      assert(analytics.Integrations[name] === plugin.Integration);
    });
  });

});
