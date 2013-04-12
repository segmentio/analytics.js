describe('KISSmetrics', function () {


  describe('initialize', function () {

    it('should call ready and load library', function (done) {
      expect(window._kmq).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'KISSmetrics' : test['KISSmetrics'] });
      expect(spy.called).to.be(true);
      expect(window._kmq).not.to.be(undefined);
      expect(window.KM).to.be(undefined);

      // When the library loads, it will create a `KM` global.
      var interval = setInterval(function () {
        if (!window.KM) return;
        expect(window.KM).not.to.be(undefined);
        clearInterval(interval);
        done();
      }, 20);
    });

    it('should store options', function () {
      analytics.initialize({ 'KISSmetrics' : test['KISSmetrics'] });
      expect(analytics.providers[0].options.apiKey).to.equal(test['KISSmetrics']);
    });

  });


  describe('identify', function () {

    beforeEach(analytics.user.clear);

    it('should push "_identify"', function () {
      var stub = sinon.stub(window._kmq, 'push');
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
      var stub = sinon.stub(window._kmq, 'push');
      analytics.identify(test.traits);
      expect(stub.calledWith(['set', test.traits])).to.be(true);
      analytics.user.clear();

      stub.reset();
      analytics.identify(test.userId);
      expect(stub.calledWith(['set', {}])).to.be(true);
      analytics.user.clear();

      stub.reset();
      analytics.identify(test.userId, test.traits);
      expect(stub.calledWith(['set', test.traits])).to.be(true);

      stub.restore();
    });

  });


  describe('track', function () {

    it('should push "_record"', function () {
      var stub = sinon.stub(window._kmq, 'push');
      analytics.track(test.event, test.properties);
      expect(stub.calledWith(['record', test.event, {
        type             : 'uncouth',
        'Billing Amount' : 29.99
      }])).to.be(true);

      stub.restore();
    });

  });


  describe('alias', function () {

    it('should call alias', function () {
      var stub = sinon.stub(window._kmq, 'push');
      analytics.alias(test.newUserId, test.oldUserId);
      expect(stub.calledWith(['alias', test.newUserId, test.oldUserId])).to.be(true);

      stub.restore();
    });

  });

});