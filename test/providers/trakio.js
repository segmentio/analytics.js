
describe('trak-io', function () {

var assert = require('assert')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  token : '740d36a79fb593bbc034a3ac934bc04f5a591c0c'
};

before(function () {
  var spy = this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ 'trak.io': settings });
});

describe('initialize', function () {
  it('should load library and call ready', function (done) {
    this.timeout(10000);
    var spy = this.spy;
    when(function () { return window.trak.io.loaded; }, function () {
      assert(spy.called);
      done();
    });
  });

  it('should store options with defaults', function () {
    var options = analytics._providers[0].options;
    assert(options.initialPageview);
    assert(options.pageview);
    assert(options.token === settings.token);
  });
});

describe('identify', function () {
  beforeEach(function () {
    analytics._user.clear();
    this.spy = sinon.spy(window.trak.io, 'identify');
  });

  afterEach(function () {
    this.spy.restore();
  });

  it('should send id', function () {
    analytics.identify('id');
    assert(this.spy.calledWith('id'));
  });

  it('should send traits', function () {
    analytics.identify({ trait: true });
    assert(this.spy.calledWith({ trait: true }));
  });

  it('should send an id and traits', function () {
    analytics.identify('id', { trait: true });
    assert(this.spy.calledWith('id', { trait: true }));
  });
});

describe('track', function () {
  beforeEach(function () {
    this.spy = sinon.spy(window.trak.io, 'track');
  });

  afterEach(function () {
    this.spy.restore();
  });

  it('should send an event', function () {
    analytics.track('event');
    assert(this.spy.calledWith('event'));
  });

  it('should send an event and properties', function () {
    analytics.track('event', { property: true });
    assert(this.spy.calledWith('event', { property: true }));
  });
});

describe('pageview', function () {
  beforeEach(function () {
    this.spy = sinon.spy(window.trak.io, 'page_view');
  });

  afterEach(function () {
    this.spy.restore();
  });

  it('should call pageview', function () {
    analytics.pageview();
    assert(this.spy.called);
  });

  it('should send a url', function () {
    analytics.pageview('url');
    assert(this.spy.calledWith('url'));
  });
});

describe('alias', function () {
  beforeEach(function () {
    this.spy = sinon.spy(window.trak.io, 'alias');
  });

  afterEach(function () {
    this.spy.restore();
  });

  it('should send a new id', function () {
    analytics.alias('new');
    assert(this.spy.calledWith('new'));
  });

  it('should send a new id and an original id', function () {
    analytics.alias('another', 'original');
    assert(this.spy.calledWith('original', 'another'));
  });
});

});