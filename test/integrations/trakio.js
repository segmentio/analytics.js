
describe('trak-io', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  token: '740d36a79fb593bbc034a3ac934bc04f5a591c0c'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ 'trak.io': settings });
  this.integration = analytics._integrations['trak.io'];
  this.options = this.integration.options;
  when(function () { return window.trak.io.loaded; }, done);
});

describe('#name', function () {
  it('trak.io', function () {
    assert(this.integration.name == 'trak.io');
  });
});

describe('#key', function () {
  it('token', function () {
    assert(this.integration.key == 'token');
  });
});

describe('#defaults', function () {
  it('initialPageview', function () {
    assert(this.integration.defaults.initialPageview === true);
  });

  it('pageview', function () {
    assert(this.integration.defaults.pageview === true);
  });

  it('token', function () {
    assert(this.integration.defaults.token === '');
  });
});

describe('initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options with defaults', function () {
    assert(this.options.initialPageview == this.integration.defaults.initialPageview);
    assert(this.options.pageview == this.integration.defaults.pageview);
    assert(this.options.token == settings.token);
  });
});

describe('#identify', function () {
  beforeEach(function () {
    analytics.user().reset();
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

  it('should alias traits', function () {
    analytics.identify({
      avatar: 'avatar',
      firstName: 'first',
      lastName: 'last'
    });
    assert(this.spy.calledWith({
      avatar_url: 'avatar',
      first_name: 'first',
      last_name: 'last',
      name: 'first last' // gets added automatically
    }));
  });
});

describe('#track', function () {
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

describe('#pageview', function () {
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

describe('#alias', function () {
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