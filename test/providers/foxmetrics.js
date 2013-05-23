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

    var stub;

    beforeEach(function () {
      stub = sinon.stub(window._fxm, 'push');
      analytics.user.clear();
    });

    afterEach(function () {
      stub.restore();
    });

    it('should do nothing without a userId', function () {
      analytics.identify(test.traits);
      expect(stub.called).to.be(false);
    });

    it('should push "visitor.profile" with just a userId', function () {
      analytics.identify(test.userId);
      expect(stub.calledWith(['_fxm.visitor.profile', test.userId, undefined, undefined, undefined, undefined, undefined, undefined, {}])).to.be(true);
    });

    it('should push "visitor.profile" with traits', function () {
      analytics.identify(test.userId, test.traits);
      // FoxMetrics slices the name into first and last.
      var firstName = test.traits.name.split(' ')[0];
      var lastName = test.traits.name.split(' ')[1];
      expect(stub.calledWith(['_fxm.visitor.profile', test.userId, firstName, lastName, test.traits.email, undefined, undefined, undefined, test.traits])).to.be(true);
    });

  });


  describe('track', function () {

    it('should push custom event', function () {
      var stub = sinon.stub(window._fxm, 'push');
      analytics.track(test.event, test.properties);
      expect(stub.calledWith([test.event, undefined, test.properties])).to.be(true);

      stub.restore();
    });

  });


  describe('pageview', function () {

    it('calls [fxm.pages.view] on pageview', function () {
      var stub = sinon.stub(window._fxm, 'push');
      analytics.pageview();
      expect(stub.calledWith(['_fxm.pages.view', undefined, undefined, undefined, undefined, undefined])).to.be(true);

      stub.reset();
      analytics.pageview(test.url);
      expect(stub.calledWith(['_fxm.pages.view', undefined, undefined, undefined, test.url, undefined])).to.be(true);

      stub.restore();
    });

  });

});