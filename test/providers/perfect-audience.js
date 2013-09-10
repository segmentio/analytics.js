
describe('Perfect Audience', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  siteId: '4ff6ade4361ed500020000a5'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ 'Perfect Audience': settings });
  this.integration = analytics._integrations['Perfect Audience'];
  this.options = this.integration.options;
  when(function () { return window._pa.track; }, done);
});

describe('#key', function () {
  it('siteId', function () {
    assert(this.integration.key == 'siteId');
  });
});

describe('#defaults', function () {
  it('siteId', function () {
    assert(this.integration.defaults.siteId === '');
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options', function () {
    assert(this.options.siteId == settings.siteId);
  });
});

describe('#track', function () {
  beforeEach(function () {
    this.spy = sinon.spy(window._pa, 'track');
  });

  afterEach(function () {
    this.spy.restore();
  });

  it('should send an event', function () {
    analytics.track('event');
    assert(this.spy.calledWith('event', {}));
  });

  it('should send an event and properties', function () {
    analytics.track('event', { property: true });
    assert(this.spy.calledWith('event', { property: true }));
  });
});

});