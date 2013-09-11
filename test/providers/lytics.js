
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

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ Lytics: settings });
  this.integration = analytics._integrations.Lytics;
  this.options = this.integration.options;
  when(function () { return window.jstag.bind; }, done);
});

describe('#name', function () {
  it('Lytics', function () {
    assert(this.integration.name == 'Lytics');
  });
});

describe('#key', function () {
  it('cid', function () {
    assert(this.integration.key == 'cid');
  });
});

describe('#defaults', function () {
  it('cid', function () {
    assert(this.integration.defaults.cid === '');
  });

  it('cookie', function () {
    assert(this.integration.defaults.cookie === 'seerid');
  });

  it('delay', function () {
    assert(this.integration.defaults.delay === 200);
  });

  it('initialPageview', function () {
    assert(this.integration.defaults.initialPageview === true);
  });

  it('sessionTimeout', function () {
    assert(this.integration.defaults.sessionTimeout === 1800);
  });

  it('url', function () {
    assert(this.integration.defaults.url === '//c.lytics.io');
  });
});

describe('#initialize', function () {
  it('should load library and call ready', function () {
    assert(this.spy.called);
  });

  it('should store options with defaults', function () {
    assert(this.options.cid == settings.cid);
    assert(this.options.cookie == settings.cookie);
    assert(this.options.delay == 200);
    assert(this.options.initialPageview);
    assert(this.options.sessionTimeout == 1800);
    assert(this.options.url == '//c.lytics.io');
  });

  it('should pass options to lytics', function () {
    assert(this.options.cid == settings.cid);
    assert(this.options.cookie == settings.cookie);
  });
});

describe('#identify', function () {
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

describe('#track', function () {
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

describe('#pageview', function () {
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