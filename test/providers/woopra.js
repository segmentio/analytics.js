describe('Woopra', function () {

var assert = require('assert')
  , when = require('when');

var settings = {
  domain: 'x'
};

describe('initialize', function () {
  it('should load library and call ready', function (done) {
    this.timeout(10000);
    var spy = sinon.spy();
    assert(!window.woopra);
    analytics.ready(spy);
    analytics.initialize({ Woopra: settings });
    assert(window.woopra);
    when(function () { return window.woopra.loaded; }, function () {
      assert(spy.called);
      done();
    });
  });

  it('should store options with defaults', function () {
    var options = analytics._providers[0].options;
    assert(settings.domain === options.domain);
    assert(options.initialPageview);
  });
});


describe('identify', function () {
  beforeEach(function () {
    analytics._user.clear();
    this.spy = sinon.spy(window.woopra, 'identify');
  });

  afterEach(function () {
    this.spy.restore();
  });

  it('should send an id', function () {
    analytics.identify('id');
    assert(this.spy.calledWith({ id: 'id' }));
  });

  it('should send traits', function () {
    analytics.identify({ name: 'Name' });
    assert(this.spy.calledWith({ name: 'Name' }));
  });
});

describe('track', function () {
  beforeEach(function () {
    this.spy = sinon.spy(window.woopra, 'track');
  });

  afterEach(function () {
    this.spy.restore();
  });
  it('should send an event', function () {
    analytics.track('event');
    assert(this.spy.calledWith('event'));
  });

  it('should send properties', function () {
    analytics.track('event', { property: 'Property' });
    assert(this.spy.calledWith('event', { property: 'Property' }));
  });
});

describe('pageview', function () {
  beforeEach(function () {
    this.spy = sinon.spy(window.woopra, 'track');
  });

  afterEach(function () {
    this.spy.restore();
  });
  it('should send a "pv" event with default properties', function () {
    analytics.pageview();
    assert(this.spy.calledWith('pv', {
      url: window.location.pathname,
      title: document.title
    }));
  });

  it('should pass a url', function () {
    analytics.pageview('/path');
    assert(this.spy.calledWith('pv', {
      url: '/path',
      title: document.title
    }));
  });
});

});