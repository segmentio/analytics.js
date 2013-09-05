
describe('Clicky', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , equal = require('equals')
  , sinon = require('sinon')
  , user = require('analytics/lib/user')
  , when = require('when');

var settings = {
  siteId: 100649848
};

before(function (done) {
  window.clicky_custom = { session: { existing: true }};
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

  it('should extend the session with an id and traits', function () {
    assert(equal(window.clicky_custom.session, {
      id: 'id',
      trait: true,
      existing: true
    }));
  });
});

describe('#identify', function () {
  beforeEach(function () {
    analytics._user.clear();
    delete window.clicky_custom;
  });

  it('should set an id', function () {
    analytics.identify('id');
    assert(equal(window.clicky_custom.session, { id: 'id' }));
  });

  it('should set traits', function () {
    analytics.identify({ trait: true });
    assert(equal(window.clicky_custom.session, { trait: true }));
  });

  it('should set an id and traits', function () {
    analytics.identify('id', { trait: true });
    assert(equal(window.clicky_custom.session, {
      id: 'id',
      trait: true
    }));
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