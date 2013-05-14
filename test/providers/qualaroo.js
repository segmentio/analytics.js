describe('Qualaroo', function () {


  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      expect(window._kiq).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Qualaroo' : test['Qualaroo'] });
      expect(spy.called).to.be(true);
      expect(window._kiq).not.to.be(undefined);
      expect(window.KI).to.be(undefined);

      // When the library loads, it will create a `KI` global.
      var interval = setInterval(function () {
        if (!window.KI) return;
        expect(window.KI).not.to.be(undefined);
        clearInterval(interval);
        done();
      }, 20);
    });

    it('should store options', function () {
      analytics.initialize({ 'Qualaroo' : test['Qualaroo'] });
      expect(analytics.providers[0].options.customerId).to.equal(test['Qualaroo'].customerId);
      expect(analytics.providers[0].options.siteToken).to.equal(test['Qualaroo'].siteToken);
    });

  });


  describe('identify', function () {
    var stub;
    beforeEach(function () {
      stub = sinon.stub(window._kiq, 'push');
      analytics.user.clear();
    });
    afterEach(function () { stub.restore(); });

    it('should push "_identify" with email traits', function () {
      analytics.identify(test.traits);
      expect(stub.calledWith(['identify', test.traits.email])).to.be(true);
    });

    it('should push "_identify" with userId', function () {
      analytics.identify(test.userId);
      expect(stub.calledWith(['identify', test.userId])).to.be(true);
    });

    it('should prefer email to userId', function () {
      analytics.identify(test.userId, test.traits);
      expect(stub.calledWith(['identify', test.traits.email])).to.be(true);
    });

    it('should push "_set" with all traits', function () {
      analytics.identify(test.traits);
      expect(stub.calledWith(['set', test.traits])).to.be(true);
    });

    it('should not call set without traits', function () {
      analytics.identify(test.userId);
      expect(stub.calledWith(['set', test.traits])).to.be(false);
    });

    it('should call identify with traits and userId', function () {
      analytics.identify(test.userId, test.traits);
      expect(stub.calledWith(['set', test.traits])).to.be(true);
    });

  });


  describe('track', function () {

    it('should push "_set" with the event trait', function () {
      var stub   = sinon.stub(window._kiq, 'push')
        , traits = {};

      // Setup the augmented event name that our Qualaroo provider uses.
      traits['Triggered: ' + test.event] = true;

      // Enable the track option.
      analytics.providers[0].options.track = true;

      analytics.track(test.event, test.properties);
      expect(stub.calledWith(['set', traits])).to.be(true);

      stub.restore();
      analytics.providers[0].options.track = false;
    });

  });

});