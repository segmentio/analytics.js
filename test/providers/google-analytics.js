
describe('Google Analytics', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , sinon = require('sinon')
  , when = require('when');

describe('Universal', function () {

var settings = {
  universalClient: true,
  trackingId: 'UA-27033709-12',
  domain: 'none',
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
    assert(this.gaSpy.args[1][2].cookieDomain == settings.domain);
  });

  it('should pass sample rate option to Google Analytics', function () {
    assert(this.gaSpy.args[1][2].siteSpeedSampleRate == settings.siteSpeedSampleRate);
  });

  it('should pass anonymize ip option to Google Analytics', function () {
    assert(this.gaSpy.calledWith('set', 'anonymizeIp', true));
  });

  it('should track a pageview with the canonical url');
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
    assert(this.spy.calledWith('send', 'event', {
      hitType: 'event',
      eventCategory: 'All',
      eventAction: 'event',
      eventLabel: undefined,
      eventValue: 0,
      nonInteraction: undefined
    }));
  });

  it('should send a category property', function () {
    analytics.track('event', { category: 'Category' });
    assert(this.spy.calledWith('send', 'event', {
      hitType: 'event',
      eventCategory: 'Category',
      eventAction: 'event',
      eventLabel: undefined,
      eventValue: 0,
      nonInteraction: undefined
    }));
  });

  it('should send a label property', function () {
    analytics.track('event', { label: 'label' });
    assert(this.spy.calledWith('send', 'event', {
      hitType: 'event',
      eventCategory: 'All',
      eventAction: 'event',
      eventLabel: 'label',
      eventValue: 0,
      nonInteraction: undefined
    }));
  });

  it('should send a rounded value property', function () {
    analytics.track('event', { value: 1.1 });
    assert(this.spy.calledWith('send', 'event', {
      hitType: 'event',
      eventCategory: 'All',
      eventAction: 'event',
      eventLabel: undefined,
      eventValue: 1,
      nonInteraction: undefined
    }));
  });

  it('should prefer a rounded revenue property', function () {
    analytics.track('event', { revenue: 9.99 });
    assert(this.spy.calledWith('send', 'event', {
      hitType: 'event',
      eventCategory: 'All',
      eventAction: 'event',
      eventLabel: undefined,
      eventValue: 10,
      nonInteraction: undefined
    }));
  });

  it('should send a non-interaction property', function () {
    analytics.track('event', { noninteraction: true });
    assert(this.spy.calledWith('send', 'event', {
      hitType: 'event',
      eventCategory: 'All',
      eventAction: 'event',
      eventLabel: undefined,
      eventValue: 0,
      nonInteraction: true
    }));
  });

  it('should send a non-interaction option', function () {
    analytics.track('event', {}, { noninteraction: true });
    assert(this.spy.calledWith('send', 'event', {
      hitType: 'event',
      eventCategory: 'All',
      eventAction: 'event',
      eventLabel: undefined,
      eventValue: 0,
      nonInteraction: true
    }));
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
    assert(this.spy.calledWith('send', 'pageview', {
      hitType: 'pageview',
      page: undefined
    }));
  });

  it('should send a url', function () {
    analytics.pageview('/path');
    assert(this.spy.calledWith('send', 'pageview', {
      hitType: 'pageview',
      page: '/path'
    }));
  });
});

});

describe('Classic', function () {


var settings = {
  trackingId: 'UA-27033709-5',
  enhancedLinkAttribution: true,
  domain: 'none',
  siteSpeedSampleRate: 42,
  anonymizeIp: true,
  ignoreReferrer: ['domain.com', 'www.domain.com']
};

before(function (done) {
  // setup a stub to listen on
  window._gaq = [];
  this.gaStub = sinon.stub(window._gaq, 'push');

  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ 'Google Analytics': settings });
  this.integration = analytics._integrations['Google Analytics'];
  this.options = this.integration.options;
  var stub = window._gaq.push;
  when(function () { return window._gaq.push != stub; }, done);
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
    this.gaStub.restore();
  });

  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options', function () {
    assert(this.options.trackingId == settings.trackingId);
  });

  it('should define a queue', function () {
    assert(window._gaq);
  });

  it('should pass the tracking id to Google Analytics', function () {
    assert(this.gaStub.calledWith(['_setAccount', settings.trackingId]));
  });

  it('should pass domain option to Google Analytics', function () {
    assert(this.gaStub.calledWith(['_setDomainName', settings.domain]));
  });

  it('should pass enhanced link attribution option to Google Analytics', function () {
    assert(this.gaStub.calledWith(['_require', 'inpage_linkid', 'http://www.google-analytics.com/plugins/ga/inpage_linkid.js']));
  });

  it('should pass sample rate option to Google Analytics', function () {
    assert(this.gaStub.calledWith(['_setSiteSpeedSampleRate', settings.siteSpeedSampleRate]));
  });

  it('should pass anonymize ip option to Google Analytics', function () {
    assert(this.gaStub.calledWith(['_gat._anonymizeIp']));
  });

  it('should pass ignored referrers option to Google Analytics', function () {
    assert(this.gaStub.calledWith(['_addIgnoredRef', settings.ignoreReferrer[0]]));
    assert(this.gaStub.calledWith(['_addIgnoredRef', settings.ignoreReferrer[1]]));
  });

  it('should track a pageview with the canonical url');
});

describe('#track', function () {
  beforeEach(function () {
    this.stub = sinon.stub(window._gaq, 'push');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should send an event', function () {
    analytics.track('event');
    assert(this.stub.calledWith(['_trackEvent', 'All', 'event', undefined, 0, undefined]));
  });

  it('should send a category property', function () {
    analytics.track('event', { category: 'Category' });
    assert(this.stub.calledWith(['_trackEvent', 'Category', 'event', undefined, 0, undefined]));
  });

  it('should send a label property', function () {
    analytics.track('event', { label: 'label' });
    assert(this.stub.calledWith(['_trackEvent', 'All', 'event', 'label', 0, undefined]));
  });

  it('should send a rounded value property', function () {
    analytics.track('event', { value: 1.1 });
    assert(this.stub.calledWith(['_trackEvent', 'All', 'event', undefined, 1, undefined]));
  });

  it('should prefer a rounded revenue property', function () {
    analytics.track('event', { revenue: 9.99 });
    assert(this.stub.calledWith(['_trackEvent', 'All', 'event', undefined, 10, undefined]));
  });

  it('should send a non-interaction property', function () {
    analytics.track('event', { noninteraction: true });
    assert(this.stub.calledWith(['_trackEvent', 'All', 'event', undefined, 0, true]));
  });

  it('should send a non-interaction option', function () {
    analytics.track('event', {}, { noninteraction: true });
    assert(this.stub.calledWith(['_trackEvent', 'All', 'event', undefined, 0, true]));
  });
});

describe('#pageview', function () {
  beforeEach(function () {
    this.stub = sinon.stub(window._gaq, 'push');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should send a pageview', function () {
    analytics.pageview();
    assert(this.stub.calledWith(['_trackPageview', undefined]));
  });

  it('should send a url', function () {
    analytics.pageview('/path');
    assert(this.stub.calledWith(['_trackPageview', '/path']));
  });
});

});

});