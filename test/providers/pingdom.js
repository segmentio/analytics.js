describe('Pingdom', function () {


  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      expect(window._prum).to.be(undefined);
      expect(window.PRUM_EPISODES).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Pingdom' : test['Pingdom'] });
      expect(window._prum).not.to.be(undefined);

      // When the library loads, `_prum` is created.
      var interval = setInterval(function () {
        if (!window.PRUM_EPISODES) return;
        expect(window.PRUM_EPISODES).not.to.be(undefined);
        expect(spy.called).to.be(true);
        clearInterval(interval);
        done();
      }, 20);
    });

    it('should store options', function () {
      analytics.initialize({ 'Pingdom' : test['Pingdom'] });
      expect(analytics.providers[0].options.id).to.equal(test['Pingdom']);
    });

  });

});