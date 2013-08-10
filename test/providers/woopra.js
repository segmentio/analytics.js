describe('Woopra', function () {


  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      expect(window.woopra).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Woopra' : test['Woopra'] });
      expect(window.woopra).to.not.be(undefined);

      // Once the library loads the tracker will be created and the spy will
      // be called.
      var interval = setInterval(function () {
        if (!window.woopra._loaded) return;
        expect(window.woopra).to.not.be(undefined);
        expect(window.woopra._loaded).to.be(true);
        expect(spy.called).to.be(true);
        clearInterval(interval);
        done();
      }, 20);
    });

    it('should store options', function () {
      analytics.initialize({ 'Woopra' : test['Woopra'] });
      expect(analytics.providers[0].options.domain).to.equal(test['Woopra']);
    });

  });


  describe('identify', function () {

    it('correctly adds the user properties', function () {
      var spy = sinon.spy(window.woopra, 'identify');
      analytics.identify(test.userId, test.traits);
      expect(spy.calledWith(sinon.match({
          id: test.userId,
          name: test.traits.name,
          email: test.traits.email
      }))).to.be(true);
      expect(spy.callCount).to.be(1);
      spy.reset();
    });

  });


  describe('track', function () {

    it('tracks an event with track', function () {
      var spy = sinon.spy(window.woopra, 'track');

      analytics.track(test.event);
      expect(spy.calledWith(test.event)).to.be(true);
      spy.reset();

      analytics.track(test.event, test.properties);
      expect(spy.calledWithMatch(test.event, test.properties)).to.be(true);

      spy.restore();
    });

  });

  describe('pageview', function() {
    it('sends a "pv" event with track', function() {
      var spy = sinon.spy(window.woopra, 'track');

      analytics.pageview(test.url);
      expect(spy.calledWithMatch('pv', {url: test.url})).to.be(true);
      spy.restore();
    });
  });

});
