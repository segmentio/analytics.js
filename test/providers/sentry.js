
describe('Sentry', function () {

  describe('initialize', function () {

    this.timeout(10000);

    // We do this all in one call, so that we don't get confused with multiple
    // analytics ready calls.
    it('should call ready and load library', function (done) {
      var spy  = sinon.spy()
        , push = Array.prototype.push;

      expect(window.Raven).to.be(undefined);

      analytics.ready(spy);
      analytics.initialize({ 'Sentry' : test['Sentry'] });

      // When the library loads, it will overwrite the push method.
      var interval = setInterval(function () {
        if (!window.Raven) return;
        expect(window.Raven).not.to.be(undefined);
        expect(spy.called).to.be(true);
        clearInterval(interval);
        done();
      }, 20);
    });

    it('should store options', function (done) {
      analytics.initialize({ 'Sentry' : test['Sentry'] });
      var options = analytics.providers[0].options;
      expect(options.config).to.equal(test['Sentry']);

      // Add the ready handler here so that future tests don't get screwed by
      // the script loading halfway through their test.
      analytics.ready(done);
    });

  });


  describe('identify', function () {

    it('should call `setUser`', function (done) {
      var spy    = sinon.spy(window.Raven, 'setUser')
        , traits = extend({}, test.traits, { id : test.userId});

      analytics.identify(test.userId, test.traits);

      analytics.ready(function () {
        expect(spy.calledWithMatch(traits)).to.be(true);
        done();
      });
    });

  });

});