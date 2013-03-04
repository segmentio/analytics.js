
describe('FoxMetrics', function () {

  describe('initialize', function () {

    it('should call ready and load library', function () {
      expect(window._fxm).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'FoxMetrics' : test['FoxMetrics'] });
      expect(window._fxm).not.to.be(undefined);
      expect(spy.called).to.be(true);

      // TODO: When the library loads, push will be overriden.
      setTimeout(function () {
        // expect(window._fxm.push).not.to.eql(Array.prototype.push);
        // done();
      }, 3500);
    });

    it ('should store options', function () {
      analytics.initialize({ 'FoxMetrics' : test['FoxMetrics'] });
      expect(analytics.providers[0].options.appId).to.equal('4ec10e0c1542321b8c4caae7');
    });

  });


  describe('identify', function () {

    before(analytics.user.clear);

    it('should push "_fxm.visitor.profile"', function () {
      var spy = sinon.spy(window._fxm, 'push');
      analytics.identify(test.traits);
      expect(spy.called).to.be(false);

      spy.reset();
      analytics.identify(test.userId);
      expect(spy.calledWith(['_fxm.visitor.profile', test.userId, null, null, null, null, null, null, null])).to.be(true);

      spy.reset();
      analytics.identify(test.userId, test.traits);
      // FoxMetrics slices the name into first and last.
      var firstName = test.traits.name.split(' ')[0];
      var lastName = test.traits.name.split(' ')[1];
      expect(spy.calledWith(['_fxm.visitor.profile', test.userId, firstName, lastName, test.traits.email, null, null, null, test.traits])).to.be(true);

      spy.restore();
    });

  });


  describe('track', function () {

    it('should push custom event', function () {
      var spy = sinon.spy(window._fxm, 'push');
      analytics.track(test.event, test.properties);
      expect(spy.calledWith([test.event, null, test.properties])).to.be(true);

      spy.restore();
    });

  });


  describe('pageview', function () {

    it('calls [fxm.pages.view] on pageview', function () {
      var spy = sinon.spy(window._fxm, 'push');
      analytics.pageview();
      expect(spy.calledWith(['_fxm.pages.view', null, null, null, null, null])).to.be(true);

      spy.reset();
      analytics.pageview(test.url);
      expect(spy.calledWith(['_fxm.pages.view', null, null, null, test.url, null])).to.be(true);

      spy.restore();
    });

  });

});