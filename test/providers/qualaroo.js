
describe('Qualaroo', function () {

  describe('initialize', function () {

    it('should call ready and load library', function (done) {
      expect(window._kiq).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Qualaroo' : test['Qualaroo'] });
      expect(spy.called).to.be(true);
      expect(window._kiq).not.to.be(undefined);
      expect(window.KM).to.be(undefined);

      // When the library loads, it will create a `KM` global.
      setTimeout(function () {
        expect(window.KM).not.to.be(undefined);
        done();
      }, 1900);
    });

    it('should store options', function () {
      analytics.initialize({ 'Qualaroo' : test['Qualaroo'] });
      expect(analytics.providers[0].options.apiKey).to.equal(test['Qualaroo']);
    });

  });


  describe('identify', function () {

    it('should push "_identify"', function () {
      var stub = sinon.stub(window._kiq, 'push');
      analytics.identify(test.traits);
      expect(stub.calledWith(['identify', test.userId])).to.be(false);

      stub.reset();
      analytics.identify(test.userId);
      expect(stub.calledWith(['identify', test.userId])).to.be(true);

      stub.reset();
      analytics.identify(test.userId, test.traits);
      expect(stub.calledWith(['identify', test.userId])).to.be(true);

      stub.restore();
    });

    it('should push "_set"', function () {
      var stub = sinon.stub(window._kiq, 'push');
      analytics.identify(test.traits);
      expect(stub.calledWith(['set', test.traits])).to.be(true);

      stub.reset();
      analytics.identify(test.userId);
      expect(stub.calledWith(['set', test.traits])).to.be(false);
      stub.reset();
      analytics.identify(test.userId, test.traits);
      expect(stub.calledWith(['set', test.traits])).to.be(true);

      stub.restore();
    });

  });

});