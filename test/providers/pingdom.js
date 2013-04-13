describe('Pingdom', function () {


  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      expect(window.CE2).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Pingdom' : test['Pingdom'] });

      // When the library loads, `CE2` is created.
      var interval = setInterval(function () {
        if (!window._prum) return;
        expect(window._prum).not.to.be(undefined);
        expect(window.PRUM_EPISODES).not.to.be(undefined);
        expect(spy.called).to.be(true);
        clearInterval(interval);
        done();
      }, 20);
      done();
    });

    it('should store options', function () {
      analytics.initialize({ 'Pingdom' : test['Pingdom'] });
      expect(analytics.providers[0].options.id).to.equal('00138301');
    });

  });

});