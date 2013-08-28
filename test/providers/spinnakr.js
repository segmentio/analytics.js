
describe('Spinnakr', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  siteId: 'x'
};

before(function (done) {
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ Spinnakr: settings });
  when(function () { return window.Spinnakr; }, done);
});

describe('initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options with defaults', function () {
    var options = analytics._providers[0].options;
    assert(options.siteId == settings.siteId);
  });
});

});