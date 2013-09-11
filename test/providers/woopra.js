
describe('Woopra', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  domain: 'x'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ Woopra: settings });
  this.integration = analytics._integrations.Woopra;
  this.options = this.integration.options;
  when(function () { return window.woopra.loaded; }, done);
});

describe('#name', function () {
  it('Woopra', function () {
    assert(this.integration.name == 'Woopra');
  });
});

describe('#key', function () {
  it('domain', function () {
    assert(this.integration.key == 'domain');
  });
});

describe('#defaults', function () {
  it('domain', function () {
    assert(this.integration.defaults.domain === '');
    assert(this.integration.defaults.initialPageview === true);
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options with defaults', function () {
    assert(this.options.domain == settings.domain);
    assert(this.options.initialPageview == this.integration.defaults.initialPageview);
  });
});

describe('#identify', function () {
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
    analytics.identify({ trait: true });
    assert(this.spy.calledWith({ trait: true }));
  });

  it('should send an id and traits', function () {
    analytics.identify('id', { trait: true });
    assert(this.spy.calledWith({
      id: 'id',
      trait: true
    }));
  });
});

describe('#track', function () {
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

describe('#pageview', function () {
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