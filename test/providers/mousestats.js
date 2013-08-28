
describe('MouseStats', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  accountNumber: '5532375730335616295'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ MouseStats: settings });
  when(function () { return window.msae; }, done);
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options with defaults', function () {
    var options = analytics._providers[0].options;
    assert(options.accountNumber == settings.accountNumber);
  });

  it('should pass options to MouseStats', function () {
    assert(window.window.mousestats_Site == settings.accountNumber);
  });
});

});