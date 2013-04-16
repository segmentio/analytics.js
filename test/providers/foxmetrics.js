describe('FoxMetrics', function () {


  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      expect(window._fxm).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'FoxMetrics' : test['FoxMetrics'] });
      expect(window._fxm).not.to.be(undefined);
      expect(spy.called).to.be(true);
      expect(window._fxm.appId).to.be(undefined);

      // TODO: When the library loads, `appId` will be set.
      var interval = setInterval(function () {
        if (!window._fxm.appId) return;
        expect(window._fxm.appId).not.to.be(undefined);
        clearInterval(interval);
        done();
      }, 20);
    });

    it ('should store options', function () {
      analytics.initialize({ 'FoxMetrics' : test['FoxMetrics'] });
      expect(analytics.providers[0].options.appId).to.equal(test['FoxMetrics']);
    });

  });


  describe('identify', function () {

    beforeEach(analytics.user.clear);

    it('should push "_fxm.visitor.profile"', function () {
      var stub = sinon.stub(window._fxm, 'push');
      analytics.identify(test.traits);
      expect(stub.called).to.be(false);
      analytics.user.clear();

      stub.reset();
      analytics.identify(test.userId);
      expect(stub.calledWith(['_fxm.visitor.profile', test.userId, null, null, null, null, null, null, {}])).to.be(true);
      analytics.user.clear();

      stub.reset();
      analytics.identify(test.userId, test.traits);
      // FoxMetrics slices the name into first and last.
      var firstName = test.traits.name.split(' ')[0];
      var lastName = test.traits.name.split(' ')[1];
      expect(stub.calledWith(['_fxm.visitor.profile', test.userId, firstName, lastName, test.traits.email, null, null, null, test.traits])).to.be(true);

      stub.restore();
    });

  });


  describe('track', function () {

    it('should push custom event', function () {
      var stub = sinon.stub(window._fxm, 'push');
      analytics.track(test.event, test.properties);
      expect(stub.calledWith([test.event, null, test.properties])).to.be(true);

      stub.restore();
    });

  });


  describe('pageview', function () {

    it('calls [fxm.pages.view] on pageview', function () {
      var stub = sinon.stub(window._fxm, 'push');
      analytics.pageview();
      expect(stub.calledWith(['_fxm.pages.view', null, null, null, null, null])).to.be(true);

      stub.reset();
      analytics.pageview(test.url);
      expect(stub.calledWith(['_fxm.pages.view', null, null, null, test.url, null])).to.be(true);

      stub.restore();
    });

  });

});