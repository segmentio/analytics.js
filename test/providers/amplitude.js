
describe('Amplitude', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  apiKey: '07808866adb2510adf19ee69e8fc2201'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ Amplitude: settings });
  this.integration = analytics._integrations.Amplitude;
  this.options = this.integration.options;
  var stub = window.amplitude.logEvent;
  when(function () { return window.amplitude.logEvent != stub; }, done);
});

describe('#name', function () {
  it('Amplitude', function () {
    assert(this.integration.name == 'Amplitude');
  });
});

describe('#key', function () {
  it('apiKey', function () {
    assert(this.integration.key == 'apiKey');
  });
});

describe('#defaults', function () {
  it('apiKey', function () {
    assert(this.integration.defaults.apiKey === '');
  });

  it('pageview', function () {
    assert(this.integration.defaults.pageview === false);
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options with defaults', function () {
    assert(this.options.apiKey == settings.apiKey);
    assert(this.options.pageview === false);
  });
});

describe('#identify', function () {
  beforeEach(function () {
    analytics._user.clear();
    this.idSpy = sinon.spy(window.amplitude, 'setUserId');
    this.traitSpy = sinon.spy(window.amplitude, 'setGlobalUserProperties');
  });

  afterEach(function () {
    this.idSpy.restore();
    this.traitSpy.restore();
  });

  it('should send an id', function () {
    analytics.identify('id');
    assert(this.idSpy.calledWith('id'));
  });

  it('should send traits', function () {
    analytics.identify({ trait: true });
    assert(this.traitSpy.calledWith({ trait: true }));
  });

  it('should send an id and traits', function () {
    analytics.identify('id', { trait: true });
    assert(this.idSpy.calledWith('id'));
    assert(this.traitSpy.calledWith({ trait: true }));
  });
});

describe('#track', function () {
  beforeEach(function () {
    this.spy = sinon.spy(window.amplitude, 'logEvent');
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
    this.spy = sinon.spy(window.amplitude, 'logEvent');
  });

  afterEach(function () {
    this.spy.restore();
    this.options.pageview = false;
  });

  it('shouldnt fire by default', function () {
    analytics.pageview();
    assert(!this.spy.called);
  });

  it('should send a "Loaded a Page" event', function () {
    this.options.pageview = true;
    analytics.pageview();
    assert(this.spy.calledWith('Loaded a Page', {
      url: window.location.href,
      title: document.title
    }));
  });

  it('should send a url', function () {
    this.options.pageview = true;
    analytics.pageview('/path');
    assert(this.spy.calledWith('Loaded a Page', {
      url: '/path',
      title: document.title
    }));
  });
});

});