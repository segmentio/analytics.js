
describe('Inspectlet', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  wid : 'x'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ Inspectlet: settings });
  when(function () { return window.__insp_; }, done);
});

describe('initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options', function () {
    var options = analytics._providers[0].options;
    expect(options.wid == settings.wid);
  });
});

});