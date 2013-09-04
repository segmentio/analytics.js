
describe('AdRoll', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , equal = require('equals')
  , sinon = require('sinon')
  , user = require('analytics/lib/user')
  , when = require('when');

var settings = {
  advId : 'LYFRCUIPPZCCTOBGRH7G32',
  pixId : 'V7TLXL5WWBA5NOU5MOJQW4'
};

before(function (done) {
  user.update('id', { trait: true });
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ AdRoll: settings });
  this.integration = analytics._integrations.AdRoll;
  this.options = this.integration.options;
  when(function () { return window.__adroll; }, done);
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options', function () {
    assert(this.options.advId == settings.advId);
    assert(this.options.pixId == settings.pixId);
  });

  it('should set custom data', function () {
    assert(equal(window.adroll_custom_data, {
      id: 'id',
      trait: true
    }));
  });
});

});