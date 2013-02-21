
describe('Intercom', function () {

  describe('initialize', function () {

    it('should call ready', function () {
      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Intercom' : test['Intercom'] });
      expect(spy.called).to.be(true);
    });

    it('should store options', function () {
      analytics.initialize({ 'Intercom' : test['Intercom'] });
      expect(analytics.providers[0].options.appId).to.equal(test['Intercom']);
    });

  });


  describe('identify', function () {

    it('should load library', function (done) {

      this.timeout(3000);

      expect(window.intercomSettings).to.be(undefined);

      expect(window.Intercom).to.be(undefined);
      analytics.identify(test.userId, test.traits);
      expect(window.intercomSettings).not.to.be(undefined);


      // Once the Intercom library comes back, the array should be transformed.
      setTimeout(function () {
        expect(window.Intercom).not.to.be(undefined);
        done();
      }, 2500);
    });

    it('shouldnt load library the second time', function () {
      // We're going to test that `window.intercomSettings` doesnt get reset
      // to identified values again.
      window.intercomSettings = undefined;

      analytics.identify(test.userId, test.traits);
      expect(window.intercomSettings).to.be(undefined);
    });

  });

});