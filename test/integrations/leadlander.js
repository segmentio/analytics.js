
describe('LeadLander', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  llactid: 'x'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ LeadLander: settings });
  this.integration = analytics._integrations.LeadLander;
  this.options = this.integration.options;
  when(function () { return window.trackalyzer; }, done);
});

describe('#name', function () {
  it('LeadLander', function () {
    assert(this.integration.name == 'LeadLander');
  });
});

describe('#key', function () {
  it('accountId', function () {
    assert(this.integration.key == 'accountId');
  });
});

describe('#defaults', function () {
  it('accountId', function () {
    assert(this.integration.defaults.accountId === null);
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options', function () {
    assert(this.options.accountId == settings.accountId);
  });

  it('should pass options to LeadLander', function () {
    assert(window.llactid == settings.accountId);
  });
});

});