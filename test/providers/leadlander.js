
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

describe('#key', function () {
  it('llactid', function () {
    assert(this.integration.key == 'llactid');
  });
});

describe('#defaults', function () {
  it('llactid', function () {
    assert(this.integration.defaults.llactid === null);
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options', function () {
    assert(this.options.llactid == settings.llactid);
  });

  it('should pass options to LeadLander', function () {
    assert(window.llactid == settings.llactid);
  });
});

});