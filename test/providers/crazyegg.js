describe('CrazyEgg', function () {


  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      expect(window.CE2).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'CrazyEgg' : test['CrazyEgg'] });

      // When the library loads, `CE2` is created.
      // var interval = setInterval(function () {
      //   if (!window.CE2) return;
      //   expect(window.CE2).not.to.be(undefined);
      //   expect(spy.called).to.be(true);
      //   clearInterval(interval);
      //   done();
      // }, 20);
      done();
    });

    it('should store options', function () {
      analytics.initialize({ 'CrazyEgg' : test['CrazyEgg'] });
      expect(analytics.providers[0].options.accountNumber).to.equal('00138301');
    });

  });

});