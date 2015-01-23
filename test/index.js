
describe('analytics', function () {

  var Integrations = require('analytics.js-integrations');
  var createIntegration = require('analytics.js-integration');
  var analytics = window.analytics;
  var assert = require('assert');
  var each = require('each');
  var is = require('is');

  it('should expose a .VERSION', function () {
    var pkg = require('../bower.json');
    assert.equal(analytics.VERSION, pkg.version);
  });

  it('should add integrations', function () {
    each(Integrations, function (name, plugin) {
      var a = analytics.Integrations[name].prototype;
      var b = (plugin.Integration || plugin).prototype;
      assert(a.name && b.name);
      assert(a.name == b.name);
    });
  });

  describe('noConflict', function () {
    beforeEach(function () {
      analytics = window.analytics;
    });

    afterEach(function () {
      window.analytics = analytics;
    });

    it('should leave window.analytics unchanged', function () {
      var dummy = { dummy: true };
      window.analytics = dummy;
      assert(window.analytics == dummy);
      window.analytics = require('../lib/index.js');
      assert(window.analytics != dummy);
      var newAnalytics = window.analytics;
      var noConflictAnalytics = window.analytics.noConflict();
      assert(window.analytics == dummy);
      assert(newAnalytics == noConflictAnalytics);
    });
  });
});
