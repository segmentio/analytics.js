describe('trak.io', function () {

  describe('initialize', function () {

    this.timeout(10000);

    // Second load of trak.io does nothing so we'll do it all in one go
    it('should call ready and load library', function (done) {
      expect(window.trak).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'trak.io' : test['trak.io'] });

      var options = analytics.providers[0].options;
      expect(options.api_token).to.equal(test['trak.io'].api_token);
      expect(window.trak.io).not.to.be(undefined);
      expect(window.trak.io.loaded).to.be(undefined);

      // When the library loads, it sets `loaded` to true
      var interval = setInterval(function () {
        if (!window.trak.io.loaded) return;
        expect(spy.called).to.be(true);
        expect(window.trak.io.loaded).to.be(true);
        expect(window.trak.io.channel()).to.be(test['trak.io'].channel);
        expect(window.trak.io.api_token()).to.be(test['trak.io'].api_token);
        clearInterval(interval);
        done();
      }, 20);
    });

  });


  describe('identify', function () {
    var spy;

    beforeEach(function () {
      spy = sinon.spy(window.trak.io, 'identify');
      analytics.user.clear();
    });

    afterEach(function () { spy.restore(); });

    it('should call identify without a user id', function () {
      analytics.identify(test.traits);
      expect(spy.called).to.be(true);
    });

    it('should call identify with a user id', function () {
      analytics.identify(test.userId);
      expect(spy.calledWith(test.userId)).to.be(true);
    });

    it('should call identify with both user id and traits', function () {
      analytics.identify(test.userId, test.traits);
      expect(spy.calledWith(test.userId)).to.be(true);
    });
  });


  describe('track', function () {

    it('should call track', function () {
      var spy = sinon.spy(window.trak.io, 'track');
      analytics.track(test.event, test.properties);
      expect(spy.calledWith(test.event, test.properties)).to.be(true);
      spy.restore();
    });

    it('should call track without properties', function () {
      var spy = sinon.spy(window.trak.io, 'track');
      analytics.track(test.event);
      expect(spy.calledWith(test.event)).to.be(true);
      spy.restore();
    });

  });


  describe('pageview', function () {

    it('shouldnt call', function () {
      var spy = sinon.spy(window.trak.io, 'track');
      analytics.pageview();
      expect(spy.called).to.be(true);
      spy.restore();
    });

  });


  describe('alias', function () {

    it('should call alias', function () {
      var spy = sinon.spy(window.trak.io, 'alias');
      analytics.alias(test.newUserId, test.oldUserId);
      expect(spy.calledWith(test.oldUserId, test.newUserId)).to.be(true);

      spy.restore();
    });

    it('should call alias without an old user id', function () {
      var spy = sinon.spy(window.trak.io, 'alias');
      analytics.alias(test.newUserId);
      expect(spy.calledWith(test.newUserId)).to.be(true);

      spy.restore();
    });

  });

});
