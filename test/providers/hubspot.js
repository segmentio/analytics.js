
describe('HubSpot', function () {

  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      var spy  = sinon.spy()
        , push = Array.prototype.push;

      expect(window._hsq).to.be(undefined);

      analytics.ready(spy);
      analytics.initialize({ 'HubSpot' : test['HubSpot'] });
      expect(window._hsq).not.to.be(undefined);
      expect(window._hsq.push).to.equal(push);
      expect(spy.called).to.be(true);

      // Once the HubSpot library comes back, the array should be transformed.
      var interval = setInterval(function () {
        if (window._hsq === push) return;
        expect(window._hsq).to.not.equal(push);
        clearInterval(interval);
        done();
      }, 20);
    });

    it('should store options', function () {
      analytics.initialize({ 'HubSpot' : test['HubSpot'] });
      expect(analytics.providers[0].options.portalId).to.equal(test['HubSpot']);
    });

  });


  describe('identify', function () {

    it('should push "identify"', function () {
      var spy = sinon.spy(window._hsq, 'push');
      analytics.identify(test.traits);
      expect(spy.calledWith(['identify', test.traits])).to.be(true);

      spy.reset();
      analytics.identify(test.userId);
      expect(spy.calledWith(['identify', test.userId])).to.be(false);

      spy.reset();
      analytics.identify(test.userId, test.traits);
      expect(spy.calledWith(['identify', test.traits])).to.be(true);

      spy.restore();
    });

  });


  describe('track', function () {

    it('should push "trackEvent"', function () {
      var spy = sinon.spy(window._hsq, 'push');
      analytics.track(test.event, test.properties);
      expect(spy.calledWith(['trackEvent', test.event, test.properties])).to.be(true);
      spy.restore();
    });

  });


  describe('pageview', function () {

    it('should push "_trackPageview"', function () {
      var stub = sinon.stub(window._hsq, 'push');
      analytics.pageview();
      expect(stub.calledWith(['_trackPageview'])).to.be(true);
      stub.restore();
    });

  });

});