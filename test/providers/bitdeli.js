
describe('Bitdeli', function () {

  describe('initialize', function () {

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
      setTimeout(function () {
        expect(window._bdq._version).not.to.be(undefined);
        done();
      }, 1900);
    });

    it('should store options', function (done) {
      window._bdq = [];
      analytics.initialize({ 'Bitdeli' : test['Bitdeli'] });
      var options = analytics.providers[0].options;
      expect(options.inputId).to.equal(test['Bitdeli'].inputId);
      expect(options.authToken).to.equal(test['Bitdeli'].authToken);
      setTimeout(done, 1800);
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
      var spy = sinon.spy(window._bdq, 'push');
      var options = clone(test['Bitdeli']);
      options.initialPageview = false;

      analytics.initialize({ 'Bitdeli' : options });
      expect(spy.calledWith(['trackPageview'])).to.be(false);

      spy.restore();
    });

  });

  describe('identify', function () {

    before(analytics.user.clear);

    it('should push "identify" on identify', function () {
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

    it('should push "set" on identify', function () {
      var spy = sinon.spy(window._bdq, 'push');
      analytics.identify(test.traits);
      expect(spy.calledWith(['set', test.traits])).to.be(true);

      spy.reset();
      analytics.identify(test.userId);
      expect(spy.calledWith(['set', test.traits])).to.be(false);

      spy.reset();
      analytics.identify(test.userId, test.traits);
      expect(spy.calledWith(['set', test.traits])).to.be(true);

      spy.restore();
    });

  });


  describe('track', function () {

    it('should push "track" on track', function () {
      var spy = sinon.spy(window._bdq, 'push');
      analytics.track(test.event, test.properties);
      expect(spy.calledWith(['track', test.event, test.properties])).to.be(true);

      spy.restore();
    });

  });


  describe('pageview', function () {

    it('should push "trackPageview" on pageview', function () {
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