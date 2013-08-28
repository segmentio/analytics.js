
describe('Spinnakr', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  siteId: 'x'
};

before(function () {
  var spy = this.spy = sinon.spy();
  analytics.ready(spy);
  analytics.initialize({ Spinnakr: settings });
});

describe('initialize', function () {
  it('should load library and call ready', function (done) {
    this.timeout(10000);
    when(function () { return window.Spinnakr; }, done);
  });

  it('should store options with defaults', function () {
    var options = analytics._providers[0].options;
    assert(options.siteId == settings.siteId);
  });
});

});