
describe('HubSpot', function () {

  describe('initialize', function () {

    it('should call ready and load library', function (done) {
      expect(window._hsq).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'HubSpot' : test['HubSpot'] });
      expect(window._hsq).not.to.be(undefined);
      expect(window._hsq.push).to.equal(Array.prototype.push);
      expect(spy.called).to.be(true);

      // Once the HubSpot library comes back, the array should be transformed.
      setTimeout(function () {
        expect(window._hsq).to.not.equal(Array.prototype.push);
        done();
      }, 1900);
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
    });

  });

});