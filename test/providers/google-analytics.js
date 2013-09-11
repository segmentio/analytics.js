
describe('Google Analytics', function () {

describe('Universal', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  universalClient: true,
  trackingId: 'UA-27033709-12',
  domain: 'domain',
  siteSpeedSampleRate: 42,
  anonymizeIp: true
};

before(function (done) {
  // setup a stub to listen on
  window.ga = function () {
    window.ga.q || (window.ga.q = []);
    window.ga.q.push(arguments);
  };
  this.gaSpy = sinon.spy(window, 'ga');

  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ 'Google Analytics': settings });
  this.integration = analytics._integrations['Google Analytics'];
  this.options = this.integration.options;
  var stub = window.ga;
  when(function () { return window.ga != stub; }, done);
});

describe('#key', function () {
  it('trackingId', function () {
    assert(this.integration.key == 'trackingId');
  });
});

describe('#defaults', function () {
  it('trackingId', function () {
    assert(this.integration.defaults.trackingId === '');
  });
});

describe('#initialize', function () {
  after(function () {
    this.gaSpy.restore();
  });

  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options', function () {
    assert(this.options.trackingId == settings.trackingId);
  });

  it('should define a global tracker', function () {
    assert('function' == typeof window.ga);
    assert('ga' == window.GoogleAnalyticsObject);
  });

  it('should pass domain option to Google Analytics', function () {
    assert('domain' == this.gaSpy.args[1][2].cookieDomain);
  });

  it('should pass sample rate option to Google Analytics', function () {
    assert(42 == this.gaSpy.args[1][2].siteSpeedSampleRate);
  });

  it('should pass anonymize ip option to Google Analytics', function () {
    assert(this.gaSpy.calledWith('set', 'anonymizeIp', true));
  });
});

describe('#track', function () {
  beforeEach(function () {
    this.spy = sinon.spy(window, 'ga');
  });

  afterEach(function () {
    this.spy.restore();
  });

  it('should send an event', function () {
    analytics.track('event');
    assert(this.spy.calledWith('send', 'event', 'All', 'event', undefined, undefined, {}));
  });

  it('should send a category property', function () {
    analytics.track('event', { category: 'Category' });
    assert(this.spy.calledWith('send', 'event', 'Category', 'event', undefined, undefined, {}));
  });

  it('should send a label property', function () {
    analytics.track('event', { label: 'label' });
    assert(this.spy.calledWith('send', 'event', 'All', 'event', 'label', undefined, {}));
  });

  it('should send a value property', function () {
    analytics.track('event', { value: 1 });
    assert(this.spy.calledWith('send', 'event', 'All', 'event', undefined, 1, {}));
  });

  it('should prefer a revenue property', function () {
    analytics.track('event', { revenue: 9.99 });
    assert(this.spy.calledWith('send', 'event', 'All', 'event', undefined, 10, {}));
  });

  it('should send a non-interaction property', function () {
    analytics.track('event', { noninteraction: true });
    assert(this.spy.calledWith('send', 'event', 'All', 'event', undefined, undefined, { nonInteraction: true }));
  });

  it('should send a non-interaction option', function () {
    analytics.track('event', {}, { noninteraction: true });
    assert(this.spy.calledWith('send', 'event', 'All', 'event', undefined, undefined, { nonInteraction: true }));
  });
});

describe('#pageview', function () {
  beforeEach(function () {
    this.spy = sinon.spy(window, 'ga');
  });

  afterEach(function () {
    this.spy.restore();
  });

  it('should send a pageview', function () {
    analytics.pageview();
    assert(this.spy.calledWith('send', 'pageview', undefined));
  });

  it('should send a url', function () {
    analytics.pageview('/path');
    assert(this.spy.calledWith('send', 'pageview', '/path'));
  });
});

});

describe('Classic', function () {



});

});