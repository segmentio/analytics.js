describe('Amplitude', function () {


  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      expect(window.amplitude).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Amplitude' : test['Amplitude'] });
      expect(spy.called).to.be(true);
      expect(window.amplitude).not.to.be(undefined);
      expect(window.amplitude.sendEvents).to.be(undefined);

      // When the library loads, it will replace the `logEvent` method.
      var stub = window.amplitude.logEvent;
      var interval = setInterval(function () {
        if (window.amplitude.logEvent === stub) return;
        expect(window.amplitude.logEvent).not.to.be(stub);
        clearInterval(interval);
        done();
      }, 20);
    });

    it('should store options', function () {
      analytics.initialize({ 'Amplitude' : test['Amplitude'] });
      expect(analytics.providers[0].options.apiKey).to.equal(test['Amplitude']);
    });

  });


  describe('identify', function () {

    beforeEach(analytics.user.clear);

    it('should call setUserId', function () {
      var stub = sinon.stub(window.amplitude, 'setUserId');
      analytics.identify(test.traits);
      expect(stub.calledWith(test.userId)).to.be(false);

      stub.reset();
      analytics.identify(test.userId);
      expect(stub.calledWith(test.userId)).to.be(true);

      stub.reset();
      analytics.identify(test.userId, test.traits);
      expect(stub.calledWith(test.userId)).to.be(true);

      stub.restore();
    });

    it('should call setGlobalUserProperties', function () {
      var stub = sinon.stub(window.amplitude, 'setGlobalUserProperties');
      analytics.identify(test.userId);
      expect(stub.calledWith(test.traits)).to.be(false);

      stub.reset();
      analytics.identify(test.traits);
      expect(stub.calledWith(test.traits)).to.be(true);

      stub.reset();
      analytics.identify(test.userId, test.traits);
      expect(stub.calledWith(test.traits)).to.be(true);

      stub.restore();
    });

  });


  describe('track', function () {

    it('should call logEvent', function () {
      var stub = sinon.stub(window.amplitude, 'logEvent');
      analytics.track(test.event, test.properties);
      expect(stub.calledWith(test.event, test.properties)).to.be(true);
      stub.restore();
    });

  });


  describe('pageview', function () {

    it('shouldnt call track by default', function () {
      var spy = sinon.spy(analytics.providers[0], 'track');
      analytics.pageview();
      expect(spy.called).to.be(false);
      spy.restore();
    });

    // Mixpanel adds custom properties, so we need to have a loose match.
    it('should call track with pageview set to true', function () {
      var provider = analytics.providers[0]
        , spy      = sinon.spy(provider, 'track');

      provider.options.pageview = true;

      analytics.pageview(test.url);
      expect(spy.calledWithMatch('Loaded a Page', {
        url : test.url,
        name : document.title
      })).to.be(true);

      spy.restore();
      provider.options.pageview = false;
    });

  });

});