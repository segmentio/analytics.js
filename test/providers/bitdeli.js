describe('Bitdeli', function () {


  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      expect(window._bdq).to.be(undefined);

      // The Bitdeli provider uses a queue, so it's ready right away.
      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Bitdeli' : test['Bitdeli'] });
      expect(spy.called).to.be(true);

      // After initialize, the queue should be made, but the library isn't
      // loaded yet, so `_version` isn't defined.
      expect(window._bdq).not.to.be(undefined);
      expect(window._bdq._version).to.be(undefined);

      // Once the library loads, `_version` is defined.
      var interval = setInterval(function () {
        if (!window._bdq._version) return;
        expect(window._bdq._version).not.to.be(undefined);
        clearInterval(interval);
        done();
      }, 20);
    });

    it('should store options', function () {
      analytics.initialize({ 'Bitdeli' : test['Bitdeli'] });
      var options = analytics.providers[0].options;
      expect(options.inputId).to.equal(test['Bitdeli'].inputId);
      expect(options.authToken).to.equal(test['Bitdeli'].authToken);
    });

    it('should track a pageview', function () {
      // Create the queue before hand, so we can spy it.
      window._bdq = [];
      var spy = sinon.spy(window._bdq, 'push');

      analytics.initialize({ 'Bitdeli' : test['Bitdeli'] });
      expect(spy.calledWith(['trackPageview', undefined])).to.be(true);

      spy.restore();
    });

    it('should be able to not track a pageview', function () {
      // Create the queue before hand, so we can spy it.
      window._bdq = [];

      var clone   = require('component-clone')
        , spy     = sinon.spy(window._bdq, 'push')
        , options = clone(test['Bitdeli']);

      options.initialPageview = false;

      analytics.initialize({ 'Bitdeli' : options });
      expect(spy.calledWith(['trackPageview'])).to.be(false);

      spy.restore();
    });

  });


  describe('identify', function () {

    beforeEach(analytics.user.clear);

    it('should push "identify"', function () {
      var spy = sinon.spy(window._bdq, 'push');
      analytics.identify(test.traits);
      expect(spy.calledWith(['identify', test.userId])).to.be(false);

      spy.reset();
      analytics.identify(test.userId);
      expect(spy.calledWith(['identify', test.userId])).to.be(true);

      spy.reset();
      analytics.identify(test.userId, test.traits);
      expect(spy.calledWith(['identify', test.userId])).to.be(true);

      spy.restore();
    });

    it('should push "set"', function () {
      var spy = sinon.spy(window._bdq, 'push');
      analytics.identify(test.traits);
      expect(spy.calledWith(['set', test.traits])).to.be(true);
      analytics.user.clear();

      spy.reset();
      analytics.identify(test.userId);
      expect(spy.calledWith(['set', test.traits])).to.be(false);
      analytics.user.clear();

      spy.reset();
      analytics.identify(test.userId, test.traits);
      expect(spy.calledWith(['set', test.traits])).to.be(true);
      analytics.user.clear();

      spy.restore();
    });

  });


  describe('track', function () {

    it('should push "track"', function () {
      var spy = sinon.spy(window._bdq, 'push');
      analytics.track(test.event, test.properties);
      expect(spy.calledWith(['track', test.event, test.properties])).to.be(true);

      spy.restore();
    });

  });


  describe('pageview', function () {

    it('should push "trackPageview"', function () {
      var spy = sinon.spy(window._bdq, 'push');
      analytics.pageview();
      expect(spy.calledWith(['trackPageview', undefined])).to.be(true);

      spy.reset();
      analytics.pageview(test.url);
      expect(spy.calledWith(['trackPageview', test.url])).to.be(true);

      spy.restore();
    });

  });

});