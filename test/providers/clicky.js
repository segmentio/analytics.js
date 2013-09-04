
describe('Clicky', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , sinon = require('sinon')
  , user = require('analytics/lib/user')
  , when = require('when');

var settings = {
  siteId: 100649848
};

before(function (done) {
  user.update('id', { trait: true });
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ Clicky: settings });
  this.integration = analytics._providers[0];
  this.options = this.integration.options;
  when(function () { return window.clicky; }, done);
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options', function () {
    assert(this.options.siteId == settings.siteId);
  });

  it('should add an id and traits to the session', function () {
    var session = window.clicky_custom.session;
    assert('id' == session.id);
    assert(true === session.trait);
  });
});

describe('#track', function () {
  beforeEach(function () {
    this.spy = sinon.spy(window.clicky, 'goal');
  });

  afterEach(function () {
    this.spy.restore();
  });

  it('should send an event', function () {
    analytics.track('event');
    assert(this.spy.calledWith('event'));
  });

  it('should send revenue', function () {
    analytics.track('event', { revenue: 42.99 });
    assert(this.spy.calledWith('event', 42.99));
  });
});

describe('#pageview', function () {
  beforeEach(function () {
    this.spy = sinon.spy(window.clicky, 'log');
  });

  afterEach(function () {
    this.spy.restore();
  });

  it('should send a default url and title', function () {
    analytics.pageview();
    assert(this.spy.calledWith(window.location.pathname, document.title));
  });

  it('should send a url', function () {
    analytics.pageview('/path');
    assert(this.spy.calledWith('/path', document.title));
  });
});

});