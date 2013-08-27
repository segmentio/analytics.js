
describe('Lytics', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , sinon = require('sinon')
  , tick = require('next-tick')
  , when = require('when');

var settings = {
  cid: 'x',
  cookie: 'lytics_cookie'
};

before(function () {
  var spy = this.spy = sinon.spy();
  analytics.ready(spy);
  analytics.initialize({ Lytics: settings });
});

describe('initialize', function () {
  it('should load library and call ready', function (done) {
    this.timeout(10000);
    var spy = this.spy;
    when(function () { return window.jstag.bind; }, function () {
      assert(spy.called);
      done();
    });
  });

  it('should store options with defaults', function () {
    var options = analytics._providers[0].options;
    assert(options.cid == settings.cid);
    assert(options.cookie == settings.cookie);
    assert(options.delay == 200);
    assert(options.initialPageview);
    assert(options.sessionTimeout == 1800);
    assert(options.url == '//c.lytics.io');
  });

  it('should pass options to lytics', function () {
    var options = window.jstag._c;
    assert(options.cid == settings.cid);
    assert(options.cookie == settings.cookie);
  });
});

describe('identify', function () {
  beforeEach(function () {
    this.stub = sinon.stub(window.jstag, 'send');
    analytics._user.clear();
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should send an id', function () {
    analytics.identify('id');
    assert(this.stub.calledWith({ _uid: 'id' }));
  });

  it('should send traits', function () {
    analytics.identify({ trait: true });
    assert(this.stub.calledWith({ trait: true }));
  });

  it('should send an id and traits', function () {
    analytics.identify('id', { trait: true });
    assert(this.stub.calledWith({ _uid: 'id', trait: true }));
  });
});

describe('track', function () {
  beforeEach(function () {
    this.stub = sinon.stub(window.jstag, 'send');
    analytics._user.clear();
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should send an event', function () {
    analytics.track('event');
    assert(this.stub.calledWith({ _e: 'event' }));
  });

  it('should send an event and properties', function () {
    analytics.track('event', { property: true });
    assert(this.stub.calledWith({ _e: 'event', property: true }));
  });
});

describe('pageview', function () {
  beforeEach(function () {
    this.stub = sinon.stub(window.jstag, 'send');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should call send', function () {
    analytics.pageview();
    assert(this.spy.called);
  });
});

});