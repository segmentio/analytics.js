
describe('analytics', function () {

  var analytics = require('analytics');
  var assert = require('assert');
  var createIntegration = require('integration');
  var is = require('is');

  it('should expose a .VERSION', function () {
    assert(analytics.VERSION);
  });

  it('should add integrations', function () {
    assert(analytics.Integrations.length !== 0);
  });

  it('should expose .createIntegration', function () {
    assert(is.function(analytics.createIntegration));
    assert(analytics.createIntegration === createIntegration);
  });

});