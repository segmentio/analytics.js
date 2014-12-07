
describe('analytics', function () {

  var Integrations = require('analytics.js-integrations');
  var createIntegration = require('analytics.js-integration');
  var analytics = window.analytics;
  var assert = require('assert');
  var each = require('each');
  var is = require('is');

  it('should expose a .VERSION', function () {
    assert(analytics.VERSION);
  });

  it('should add integrations', function () {
    each(Integrations, function (name, plugin) {
      var a = analytics.Integrations[name].prototype;
      var b = (plugin.Integration || plugin).prototype;
      assert(a.name && b.name);
      assert(a.name == b.name);
    });
  });

  it('should restore original with noConflict()', function () {
    var actual = analytics.noConflict();
    assert(actual == analytics);
    assert(actual != window.analytics);
    window.analytics = actual;
  });
});
