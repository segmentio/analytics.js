describe('GoSquared', function () {


  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      expect(window.GoSquared).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'GoSquared' : test['GoSquared'] });
      expect(window.GoSquared).not.to.be(undefined);
      expect(window.GoSquared.DefaultTracker).to.be(undefined);
      expect(spy.called).to.be(true);

      // When the library loads, the tracker will be available.
      var interval = setInterval(function () {
        if (!window.GoSquared.DefaultTracker) return;
        expect(window.GoSquared.DefaultTracker).not.to.be(undefined);
        clearInterval(interval);
        done();
      }, 20);
    });

    it('should store options', function () {
      analytics.initialize({ 'GoSquared' : test['GoSquared'] });
      expect(analytics.providers[0].options.siteToken).to.equal('x');
    });

  });


  describe('identify', function () {

    beforeEach(analytics.user.clear);

    it('should set user id', function () {
      window.GoSquared.UserName = undefined;
      window.GoSquared.Visitor = undefined;
      analytics.identify(test.userId);
      expect(window.GoSquared.UserName).to.equal(test.userId);
      expect(window.GoSquared.Visitor).to.eql({});
    });

    it('should set traits', function () {
      window.GoSquared.UserName = undefined;
      window.GoSquared.Visitor = undefined;
      analytics.identify(test.traits);
      expect(window.GoSquared.UserName).to.be(undefined);
      expect(window.GoSquared.Visitor).to.eql(test.traits);
    });

    it('should set user id and traits', function () {
      window.GoSquared.UserName = undefined;
      window.GoSquared.Visitor = undefined;
      analytics.identify(test.userId, test.traits);
      expect(window.GoSquared.UserName).to.equal(test.userId);
      expect(window.GoSquared.Visitor).to.eql(test.traits);
    });

  });


  describe('traits', function () {

    it('should push "TrackEvent"', function () {
      var stub = sinon.stub(window.GoSquared.q, 'push');

      analytics.track(test.event);
      expect(stub.calledWith(["TrackEvent", test.event, {}])).to.be(true);

      stub.reset();

      analytics.track(test.event, test.properties);
      expect(stub.calledWith(["TrackEvent", test.event, test.properties])).to.be(true);

      stub.restore();
    });

  });


  describe('pageview', function () {

    it('should call "TrackView"', function () {
      var stub = sinon.stub(window.GoSquared.q, 'push');

      analytics.pageview();
      expect(stub.calledWith(['TrackView', undefined])).to.be(true);

      stub.reset();

      analytics.pageview('/url');
      expect(stub.calledWith(['TrackView', '/url'])).to.be(true);

      stub.restore();
    });

  });

});