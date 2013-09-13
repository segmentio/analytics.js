
describe('Keen IO', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , equal = require('equals')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  projectId: '510c82172975160344000002',
  writeKey: '1ab6cabb3be05b956d1044c67e02ae6eb2952e6801cedd8303608327c45a1308ecf5ae294e4c45c566678e6f3eefea3e685b8a789e032050b6fb228c72e22b210115f2dbd50caed0454285f37ecec4cda52832e8792d766817e0d11e7f935b92aee73c0c62770f528b8b65d5b7de24a4'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ 'Keen IO': settings });
  this.integration = analytics._integrations['Keen IO'];
  this.options = this.integration.options;
  when(function () { return window.Keen.Base64; }, done);
});

describe('#name', function () {
  it('Keen IO', function () {
    assert(this.integration.name == 'Keen IO');
  });
});

describe('#defaults', function () {
  it('initialPageview', function () {
    assert(this.integration.defaults.initialPageview === false);
  });

  it('pageview', function () {
    assert(this.integration.defaults.pageview === false);
  });

  it('projectId', function () {
    assert(this.integration.defaults.projectId === '');
  });

  it('readKey', function () {
    assert(this.integration.defaults.readKey === '');
  });

  it('writeKey', function () {
    assert(this.integration.defaults.writeKey === '');
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options with defaults', function () {
    assert(this.options.projectId == settings.projectId);
    assert(this.options.writeKey == settings.writeKey);
    assert(this.options.readKey === this.integration.defaults.readKey);
    assert(this.options.pageview === this.integration.defaults.pageview);
    assert(this.options.initialPageview === this.integration.defaults.initialPageview);
  });

  it('should pass options to keen', function () {
    assert(settings.projectId == window.Keen.client.projectId);
    assert(settings.writeKey == window.Keen.client.writeKey);
  });
});

describe('#identify', function () {
  beforeEach(function () {
    analytics._user.clear();
  });

  it('should pass an id', function () {
    analytics.identify('id');
    var props = window.Keen.client.globalProperties();
    assert(equal(props, { user: { userId: 'id', traits: {} }}));
  });

  it('should pass a traits', function () {
    analytics.identify({ trait: true });
    var props = window.Keen.client.globalProperties();
    assert(equal(props, { user: { traits: { trait: true }}}));
  });

  it('should pass an id and traits', function () {
    analytics.identify('id', { trait: true });
    var props = window.Keen.client.globalProperties();
    assert(equal(props, { user: { userId: 'id', traits: { trait: true }}}));
  });
});

describe('#track', function () {
  beforeEach(function () {
    this.spy = sinon.spy(window.Keen, 'addEvent');
  });

  afterEach(function () {
    this.spy.restore();
  });

  it('should pass an event', function () {
    analytics.track('event');
    assert(this.spy.calledWith('event'));
  });

  it('should pass an event and properties', function () {
    analytics.track('event', { property: true });
    assert(this.spy.calledWith('event', { property: true }));
  });
});

describe('#pageview', function () {
  beforeEach(function () {
    this.spy = sinon.spy(window.Keen, 'addEvent');
  });

  afterEach(function () {
    this.spy.restore();
    this.options.pageview = false;
  });

  it('shouldnt do anything by default', function () {
    analytics.pageview();
    assert(!this.spy.called);
  });

  it('should trigger a "Loaded a Page" event with a default url', function () {
    this.options.pageview = true;
    analytics.pageview();
    assert(this.spy.calledWith('Loaded a Page', {
      url: document.location.href,
      name: document.title
    }));
  });

  it('should pass a url', function () {
    this.options.pageview = true;
    analytics.pageview('/path');
    assert(this.spy.calledWith('Loaded a Page', {
      url: '/path',
      name: document.title
    }));
  });
});

});