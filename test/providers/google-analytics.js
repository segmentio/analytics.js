
describe('Google Analytics', function () {

  //
  // Classic Analytics
  //

  describe('Classic', function () {

    describe('initialize', function () {

      this.timeout(10000);

      it('should call ready and load library', function (done) {
        var spy  = sinon.spy()
          , push = Array.prototype.push;

        expect(window._gaq).to.be(undefined);

        analytics.ready(spy);
        analytics.initialize({ 'Google Analytics' : test['Google Analytics'].classic });

        // A queue is created, so it's ready immediately.
        expect(window._gaq).not.to.be(undefined);
        expect(window._gaq.push).to.eql(push);
        expect(spy.called).to.be(true);

        // When the library loads, push will be overriden.
        var interval = setInterval(function () {
          if (window._gaq.push === push) return;
          expect(window._gaq.push).not.to.eql(push);
          clearInterval(interval);
          done();
        }, 20);
      });

      it('should store options', function () {
        analytics.initialize({ 'Google Analytics' : test['Google Analytics'].classic });
        expect(analytics.providers[0].options.trackingId).to.equal('x');
      });

      it('shouldnt track an initial pageview if not enabled', function () {
        // Define `_gaq` so we can spy on it.
        window._gaq = [];

        var extend  = require('segmentio-extend')
          , spy     = sinon.spy(window._gaq, 'push')
          , options = extend({}, test['Google Analytics'].classic, { initialPageview : false });

        analytics.initialize({ 'Google Analytics' : options });
        expect(spy.calledWith(['_trackPageview', undefined])).to.be(false);

        spy.restore();
        analytics.providers[0].options.initialPageview = true;
      });

      it('should set domain', function () {
        // Define `_gaq` so we can spy on it.
        window._gaq = [];

        var extend  = require('segmentio-extend')
          , spy     = sinon.spy(window._gaq, 'push')
          , options = extend({}, test['Google Analytics'].classic, { domain : 'example.com' });

        analytics.initialize({ 'Google Analytics' : options });
        expect(spy.calledWith(['_setDomainName', 'example.com'])).to.be(true);

        spy.restore();
      });

      it('should add enhanced link attribution', function () {
        // Define `_gaq` so we can spy on it.
        window._gaq = [];

        var extend  = require('segmentio-extend')
          , spy     = sinon.spy(window._gaq, 'push')
          , options = extend({}, test['Google Analytics'].classic, { enhancedLinkAttribution : true });

        analytics.initialize({ 'Google Analytics' : options });
        expect(spy.calledWith(['_require', 'inpage_linkid', 'http://www.google-analytics.com/plugins/ga/inpage_linkid.js'])).to.be(true);

        spy.restore();
      });

      it('should add site speed sample rate', function () {
        // Define `_gaq` so we can spy on it.
        window._gaq = [];

        var extend  = require('segmentio-extend')
          , spy     = sinon.spy(window._gaq, 'push')
          , options = extend({}, test['Google Analytics'].classic, { siteSpeedSampleRate : 5 });

        analytics.initialize({ 'Google Analytics' : options });
        expect(spy.calledWith(['_setSiteSpeedSampleRate', 5])).to.be(true);

        spy.restore();
      });

      it('should add anonymize ip', function () {
        // Define `_gaq` so we can spy on it.
        window._gaq = [];

        var extend  = require('segmentio-extend')
          , spy     = sinon.spy(window._gaq, 'push')
          , options = extend({}, test['Google Analytics'].classic, { anonymizeIp : true });

        analytics.initialize({ 'Google Analytics' : options });
        expect(spy.calledWith(['_gat._anonymizeIp'])).to.be(true);

        spy.restore();
      });

      it('should add canonical url', function () {
        // Add the link tag we need.
        var $link = $('<link rel="canonical" href="http://google.com/a-thing">').appendTo('head');
        // Define `_gaq` so we can spy on it.
        window._gaq = [];
        var spy = sinon.spy(window._gaq, 'push');

        analytics.initialize({ 'Google Analytics' : test['Google Analytics'].classic });
        expect(spy.calledWith(['_trackPageview', '/a-thing'])).to.be(true);

        spy.restore();
        $link.remove();
      });

      it('shouldnt add canonical url', function () {
        window._gaq = [];
        var spy = sinon.spy(window._gaq, 'push');

        analytics.initialize({ 'Google Analytics' : 'x' });
        expect(spy.calledWith(['_trackPageview', undefined])).to.be(true);

        spy.restore();
      });

      it('should load doubleclick', function () {
        var extend  = require('segmentio-extend')
          , spy     = sinon.spy()
          , push    = Array.prototype.push
          , options = extend({}, test['Google Analytics'].classic, { doubleClick : true });

        analytics.ready(spy);
        analytics.initialize({ 'Google Analytics' : options });

        // Make sure the script gets appended to the DOM.
        var $script = $('script[src="http://stats.g.doubleclick.net/dc.js"]');
        expect($script.length).to.equal(1);
      });

      it('should add an ignored referrer', function () {
        // Define `_gaq` so we can spy on it.
        window._gaq = [];

        var extend  = require('segmentio-extend')
          , spy     = sinon.spy(window._gaq, 'push')
          , options = extend({}, test['Google Analytics'].classic, { ignoreReferrer : 'segment.io' });

        analytics.initialize({ 'Google Analytics' : options });
        expect(spy.calledWith(['_addIgnoredRef', 'segment.io'])).to.be(true);

        spy.restore();
      });

    });


    describe('track', function () {

      it('should push "_trackEvent"', function () {
        var spy = sinon.spy(window._gaq, 'push');
        analytics.track(test.event);
        expect(spy.calledWith([
          '_trackEvent',
          'All',
          test.event,
          undefined,
          undefined,
          undefined
        ])).to.be(true);

        spy.restore();
      });

      it('should push category', function () {
        var spy = sinon.spy(window._gaq, 'push');
        analytics.track(test.event, {
          category : 'Category'
        });
        expect(spy.calledWith([
          '_trackEvent',
          'Category',
          test.event,
          undefined,
          undefined,
          undefined
        ])).to.be(true);

        spy.restore();
      });

      it('should push label', function () {
        var spy = sinon.spy(window._gaq, 'push');
        analytics.track(test.event, {
          label : 'Label'
        });
        expect(spy.calledWith([
          '_trackEvent',
          'All',
          test.event,
          'Label',
          undefined,
          undefined
        ])).to.be(true);

        spy.restore();
      });

      it('should push value', function () {
        var spy = sinon.spy(window._gaq, 'push');
        analytics.track(test.event, { value : 30 });
        expect(spy.calledWith([
          '_trackEvent',
          'All',
          test.event,
          undefined,
          30,
          undefined
        ])).to.be(true);

        spy.restore();
      });

      it('should push revenue', function () {
        var spy = sinon.spy(window._gaq, 'push');
        analytics.track(test.event, { revenue : 9.99 });
        expect(spy.calledWith([
          '_trackEvent',
          'All',
          test.event,
          undefined,
          10,
          undefined
        ])).to.be(true);

        spy.restore();
      });

      it('should push noninteraction', function () {
        var spy = sinon.spy(window._gaq, 'push');
        analytics.track(test.event, { noninteraction : true });
        expect(spy.calledWith([
          '_trackEvent',
          'All',
          test.event,
          undefined,
          undefined,
          true
        ])).to.be(true);

        spy.restore();
      });

    });


    describe('pageview', function () {

      it('should push "_trackPageview"', function () {
        var spy = sinon.spy(window._gaq, 'push');
        analytics.pageview();
        expect(spy.calledWith(['_trackPageview', undefined])).to.be(true);
        spy.restore();
      });

      it('should push a url', function () {
        var spy = sinon.spy(window._gaq, 'push');
        analytics.pageview(test.url);
        expect(spy.calledWith(['_trackPageview', test.url])).to.be(true);
        spy.restore();
      });

    });
  });


  //
  // Universal Analytics
  //

  describe('Universal', function () {

    var global = 'ga';

    describe('initialize', function () {

      this.timeout(10000);

      it('should call ready and load library', function (done) {

        var spy  = sinon.spy()
          , push = Array.prototype.push;

        expect(window[global]).to.be(undefined);

        analytics.ready(spy);
        analytics.initialize({ 'Google Analytics' : test['Google Analytics'].universal });

        var initialGAFunction = window[global];

        // A queue is created, so it's ready immediately.
        expect(initialGAFunction).not.to.be(undefined);
        // expect the GA timestamp to not be undefined
        expect(initialGAFunction.l).not.to.be(undefined);
        expect(initialGAFunction.q.push).to.eql(push);
        expect(spy.called).to.be(true);

        // When the library loads, push will be overriden.
        var interval = setInterval(function () {
          if (window[global] === initialGAFunction) return;
          expect(window[global]).not.to.eql(initialGAFunction);
          clearInterval(interval);
          done();
        }, 20);
      });

      it('should store options', function () {
        analytics.initialize({ 'Google Analytics' : test['Google Analytics'].universal });
        expect(analytics.providers[0].options.trackingId).to.equal('x');
      });

      it('shouldnt track an initial pageview if not enabled', function () {

        // define the global queue so that we can spy on it
        window[global] = function () {
          (window[global].q = []).push(arguments);
        };

        var extend  = require('segmentio-extend')
          , spy     = sinon.spy(window, global)
          , options = extend({}, test['Google Analytics'].universal, { initialPageview : false });

        analytics.initialize({ 'Google Analytics' : options });
        expect(spy.calledWith('send', 'pageview')).to.be(false);

        spy.restore();
        analytics.providers[0].options.initialPageview = true;
      });

      it('should set domain', function () {

        // define the global queue so that we can spy on it
        window[global] = function () {
          (window[global].q = []).push(arguments);
        };

        var extend  = require('segmentio-extend')
          , spy     = sinon.spy(window, global)
          , options = extend({}, test['Google Analytics'].universal, { domain : 'example.com' });

        analytics.initialize({ 'Google Analytics' : options });

        var createOpts = { cookieDomain: options.domain };
        expect(spy.calledWith('create', options.trackingId, createOpts)).to.be(true);

        spy.restore();
      });


      it('should add site speed sample rate', function () {

        // define the global queue so that we can spy on it
        window[global] = function () {
          (window[global].q = window[global].q || []).push(arguments);
        };

        var extend  = require('segmentio-extend')
          , spy     = sinon.spy(window, global)
          , options = extend({}, test['Google Analytics'].universal, { siteSpeedSampleRate : 5 });

        var createOpts = { siteSpeedSampleRate: 5 };

        analytics.initialize({ 'Google Analytics' : options });
        expect(spy.calledWith('create', options.trackingId, createOpts)).to.be(true);

        spy.restore();
      });

      it('should add anonymize ip', function () {

        // define the global queue so that we can spy on it
        window[global] = function () {
          (window[global].q = window[global].q || []).push(arguments);
        };

        var extend  = require('segmentio-extend')
          , spy     = sinon.spy(window, global)
          , options = extend({}, test['Google Analytics'].universal, { anonymizeIp : true });

        analytics.initialize({ 'Google Analytics' : options });
        expect(spy.calledWith('set', 'anonymizeIp', true)).to.be(true);

        spy.restore();
      });

      it('should add canonical url', function () {
        // Add the link tag we need.
        var $link = $('<link rel="canonical" href="http://google.com/a-thing">').appendTo('head');

        // define the global queue so that we can spy on it
        window[global] = function () {
          (window[global].q = window[global].q || []).push(arguments);
        };

        var spy = sinon.spy(window, global);

        analytics.initialize({ 'Google Analytics' : test['Google Analytics'].universal });
        expect(spy.calledWith('send', 'pageview', '/a-thing')).to.be(true);

        spy.restore();
        $link.remove();
      });

      it('shouldnt add canonical url', function () {

        // define the global queue so that we can spy on it
        window[global] = function () {
          (window[global].q = window[global].q || []).push(arguments);
        };

        var spy = sinon.spy(window, global);

        analytics.initialize({ 'Google Analytics' : test['Google Analytics'].universal });
        expect(spy.calledWith('send', 'pageview', undefined)).to.be(true);

        spy.restore();
      });

    });


    describe('track', function () {

      it('should call ga(send, event)', function () {
        var spy = sinon.spy(window, global);
        analytics.track(test.event);
        expect(spy.calledWith(
          'send',
          'event',
          'All',
          test.event,
          undefined,
          undefined,
          {}
        )).to.be(true);

        spy.restore();
      });

      it('should push category', function () {
        var spy = sinon.spy(window, global);
        analytics.track(test.event, {
          category : 'Category'
        });
        expect(spy.calledWith(
          'send',
          'event',
          'Category',
          test.event,
          undefined,
          undefined,
          {}
        )).to.be(true);

        spy.restore();
      });

      it('should push label', function () {
        var spy = sinon.spy(window, global);
        analytics.track(test.event, {
          label : 'Label'
        });
        expect(spy.calledWith(
          'send',
          'event',
          'All',
          test.event,
          'Label',
          undefined,
          {}
        )).to.be(true);

        spy.restore();
      });

      it('should push value', function () {
        var spy = sinon.spy(window, global);
        analytics.track(test.event, { value : 30 });
        expect(spy.calledWith(
          'send',
          'event',
          'All',
          test.event,
          undefined,
          30,
          {}
        )).to.be(true);

        spy.restore();
      });

      it('should push revenue', function () {
        var spy = sinon.spy(window, global);
        analytics.track(test.event, { revenue : 9.99 });
        expect(spy.calledWith(
          'send',
          'event',
          'All',
          test.event,
          undefined,
          10,
          {}
        )).to.be(true);

        spy.restore();
      });

      it('should push noninteraction', function () {
        var spy = sinon.spy(window, global);
        analytics.track(test.event, { noninteraction : true });
        expect(spy.calledWith(
          'send',
          'event',
          'All',
          test.event,
          undefined,
          undefined,
          { nonInteraction: true }
        )).to.be(true);

        spy.restore();
      });

    });


    describe('pageview', function () {

      it('should push "_trackPageview"', function () {
        var spy = sinon.spy(window, global);
        analytics.pageview();
        expect(spy.calledWith('send', 'pageview', undefined)).to.be(true);
        spy.restore();
      });

      it('should push a url', function () {
        var spy = sinon.spy(window, global);
        analytics.pageview(test.url);
        expect(spy.calledWith('send', 'pageview', test.url)).to.be(true);
        spy.restore();
      });

    });
  });

});
