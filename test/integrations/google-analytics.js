
describe('Google Analytics', function () {

  var assert = require('assert');
  var GA = require('analytics/lib/integrations/google-analytics');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var when = require('when');

  it('should have the right settings', function () {
    var ga = new GA();
    test(ga)
      .name('Google Analytics')
      .readyOnLoad()
      .global('ga')
      .global('_gaq')
      .global('GoogleAnalyticsObject')
      .option('anonymizeIp', false)
      .option('classic', false)
      .option('domain', 'none')
      .option('doubleClick', false)
      .option('enhancedLinkAttribution', false)
      .option('ignoreReferrer', null)
      .option('siteSpeedSampleRate', null)
      .option('trackingId', '')
      .option('trackNamedPages', true);
  });

  describe('Universal', function () {

    var ga;
    var settings = {
      anonymizeIp: true,
      domain: 'none',
      siteSpeedSampleRate: 42,
      trackingId: 'UA-27033709-12'
    };

    beforeEach(function () {
      ga = new GA(settings);
    });

    afterEach(function () {
      ga.reset();
    });

    describe('#initialize', function () {
      it('should create window.GoogleAnalyticsObject', function () {
        assert(!window.GoogleAnalyticsObject);
        ga.initialize();
        assert('ga' === window.GoogleAnalyticsObject);
      });

      it('should create window.ga', function () {
        assert(!window.ga);
        ga.initialize();
        assert('function' === typeof window.ga);
      });

      it('should create window.ga.l', function () {
        assert(!window.ga);
        ga.initialize();
        assert('number' === typeof window.ga.l);
      });

      it('should anonymize the ip', function () {
        window.ga = sinon.spy();
        ga.initialize();
        assert(window.ga.calledWith('set', 'anonymizeIp', true));
      });

      it('should call window.ga.create with options', function () {
        window.ga = sinon.spy();
        ga.initialize();
        assert(window.ga.calledWith('create', settings.trackingId, {
          cookieDomain: settings.domain,
          siteSpeedSampleRate: settings.siteSpeedSampleRate,
          allowLinker: true
        }));
      });

      it('should call #load', function () {
        ga.load = sinon.spy();
        ga.initialize();
        assert(ga.load.called);
      });
    });

    describe('#load', function () {
      it('should create window.gaplugins', function (done) {
        assert(!window.gaplugins);
        ga.load();
        when(function () { return window.gaplugins; }, done);
      });

      it('should callback', function (done) {
        ga.load(done);
      });
    });

    describe('#track', function () {
      beforeEach(function () {
        ga.initialize();
        window.ga = sinon.spy();
      });

      it('should send an event', function () {
        ga.track('event');
        assert(window.ga.calledWith('send', 'event', {
          eventCategory: 'All',
          eventAction: 'event',
          eventLabel: undefined,
          eventValue: 0,
          nonInteraction: undefined
        }));
      });

      it('should send a category property', function () {
        ga.track('event', { category: 'Category' });
        assert(window.ga.calledWith('send', 'event', {
          eventCategory: 'Category',
          eventAction: 'event',
          eventLabel: undefined,
          eventValue: 0,
          nonInteraction: undefined
        }));
      });

      it('should send a label property', function () {
        ga.track('event', { label: 'label' });
        assert(window.ga.calledWith('send', 'event', {
          eventCategory: 'All',
          eventAction: 'event',
          eventLabel: 'label',
          eventValue: 0,
          nonInteraction: undefined
        }));
      });

      it('should send a rounded value property', function () {
        ga.track('event', { value: 1.1 });
        assert(window.ga.calledWith('send', 'event', {
          eventCategory: 'All',
          eventAction: 'event',
          eventLabel: undefined,
          eventValue: 1,
          nonInteraction: undefined
        }));
      });

      it('should prefer a rounded revenue property', function () {
        ga.track('event', { revenue: 9.99 });
        assert(window.ga.calledWith('send', 'event', {
          eventCategory: 'All',
          eventAction: 'event',
          eventLabel: undefined,
          eventValue: 10,
          nonInteraction: undefined
        }));
      });

      it('should send a non-interaction property', function () {
        ga.track('event', { noninteraction: true });
        assert(window.ga.calledWith('send', 'event', {
          eventCategory: 'All',
          eventAction: 'event',
          eventLabel: undefined,
          eventValue: 0,
          nonInteraction: true
        }));
      });

      it('should send a non-interaction option', function () {
        ga.track('event', {}, { noninteraction: true });
        assert(window.ga.calledWith('send', 'event', {
          eventCategory: 'All',
          eventAction: 'event',
          eventLabel: undefined,
          eventValue: 0,
          nonInteraction: true
        }));
      });
    });

    describe('#page', function () {
      beforeEach(function () {
        ga.initialize();
        window.ga = sinon.spy();
      });

      it('should send a page view', function () {
        ga.page();
        assert(window.ga.calledWith('send', 'pageview', {
          page: undefined,
          title: undefined,
          url: undefined
        }));
      });

      it('should send a page properties', function () {
        ga.page('name', { url: 'url', path: '/path' });
        assert(window.ga.calledWith('send', 'pageview', {
          page: '/path',
          title: 'name',
          url: 'url'
        }));
      });
    });

  });

  describe('Classic', function () {

    var ga;
    var settings = {
      anonymizeIp: true,
      classic: true,
      domain: 'none',
      enhancedLinkAttribution: true,
      ignoreReferrer: ['domain.com', 'www.domain.com'],
      siteSpeedSampleRate: 42,
      trackingId: 'UA-27033709-5'
    };

    beforeEach(function () {
      ga = new GA(settings);
    });

    afterEach(function () {
      ga.reset();
    });

    describe('#initializeClassic', function () {
      it('should create window._gaq', function () {
        assert(!window._gaq);
        ga.initialize();
        assert(window._gaq instanceof Array);
      });

      it('should push the tracking id', function () {
        window._gaq = [];
        window._gaq.push = sinon.spy();
        ga.initialize();
        assert(window._gaq.push.calledWith(['_setAccount', settings.trackingId]));
      });

      it('should set allow linker', function () {
        window._gaq = [];
        window._gaq.push = sinon.spy();
        ga.initialize();
        assert(window._gaq.push.calledWith(['_setAllowLinker', true]));
      });

      it('should set anonymize ip', function () {
        window._gaq = [];
        window._gaq.push = sinon.spy();
        ga.initialize();
        assert(window._gaq.push.calledWith(['_gat._anonymizeIp']));
      });

      it('should set domain name', function () {
        window._gaq = [];
        window._gaq.push = sinon.spy();
        ga.initialize();
        assert(window._gaq.push.calledWith(['_setDomainName', settings.domain]));
      });

      it('should set site speed sample rate', function () {
        window._gaq = [];
        window._gaq.push = sinon.spy();
        ga.initialize();
        assert(window._gaq.push.calledWith(['_setSiteSpeedSampleRate', settings.siteSpeedSampleRate]));
      });

      it('should set enhanced link attribution', function () {
        window._gaq = [];
        window._gaq.push = sinon.spy();
        ga.initialize();
        assert(window._gaq.push.calledWith(['_require', 'inpage_linkid', 'http://www.google-analytics.com/plugins/ga/inpage_linkid.js']));
      });

      it('should set ignored referrers', function () {
        window._gaq = [];
        window._gaq.push = sinon.spy();
        ga.initialize();
        assert(window._gaq.push.calledWith(['_addIgnoredRef', settings.ignoreReferrer[0]]));
        assert(window._gaq.push.calledWith(['_addIgnoredRef', settings.ignoreReferrer[1]]));
      });

      it('should call #load', function () {
        ga.loadClassic = sinon.spy();
        ga.initialize();
        assert(ga.load.called);
      });
    });

    describe('#loadClassic', function () {
      it('should replace window._gaq.push', function (done) {
        window._gaq = [];
        var push = window._gaq.push;
        ga.loadClassic();
        when(function () { return window._gaq.push !== push; }, done);
      });

      it('should callback', function (done) {
        ga.loadClassic(done);
      });
    });

    describe('#trackClassic', function () {
      beforeEach(function () {
        ga.initialize();
        window._gaq.push = sinon.spy();
      });

      it('should send an event', function () {
        ga.trackClassic('event');
        assert(window._gaq.push.calledWith(['_trackEvent', 'All', 'event', undefined, 0, undefined]));
      });

      it('should send a category property', function () {
        ga.trackClassic('event', { category: 'Category' });
        assert(window._gaq.push.calledWith(['_trackEvent', 'Category', 'event', undefined, 0, undefined]));
      });

      it('should send a label property', function () {
        ga.trackClassic('event', { label: 'label' });
        assert(window._gaq.push.calledWith(['_trackEvent', 'All', 'event', 'label', 0, undefined]));
      });

      it('should send a rounded value property', function () {
        ga.trackClassic('event', { value: 1.1 });
        assert(window._gaq.push.calledWith(['_trackEvent', 'All', 'event', undefined, 1, undefined]));
      });

      it('should prefer a rounded revenue property', function () {
        ga.trackClassic('event', { revenue: 9.99 });
        assert(window._gaq.push.calledWith(['_trackEvent', 'All', 'event', undefined, 10, undefined]));
      });

      it('should send a non-interaction property', function () {
        ga.trackClassic('event', { noninteraction: true });
        assert(window._gaq.push.calledWith(['_trackEvent', 'All', 'event', undefined, 0, true]));
      });

      it('should send a non-interaction option', function () {
        ga.trackClassic('event', {}, { noninteraction: true });
        assert(window._gaq.push.calledWith(['_trackEvent', 'All', 'event', undefined, 0, true]));
      });
    });

    describe('#pageClassic', function () {
      beforeEach(function () {
        ga.initialize();
        window._gaq.push = sinon.spy();
      });

      it('should send a page view', function () {
        ga.pageClassic();
        assert(window._gaq.push.calledWith(['_trackPageview', undefined]));
      });

      it('should send a path', function () {
        ga.pageClassic(null, { path: '/path' });
        assert(window._gaq.push.calledWith(['_trackPageview', '/path']));
      });

      it('should send a named page event', function () {
        ga.options.trackNamedPages = true;
        ga.pageClassic('Name');
        assert(window._gaq.push.calledWith(['_trackEvent', 'All', 'Viewed Name Page', undefined, 0, true]));
      });
    });

  });

});