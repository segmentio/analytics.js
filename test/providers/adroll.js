describe('AdRoll', function () {

  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      expect(window.adroll_adv_id).to.be(undefined);
      expect(window.adroll_pix_id).to.be(undefined);
      expect(window.adroll_optout).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'AdRoll' : test['AdRoll'] });

      // When the library loads, `__adroll` is created.
      var interval = setInterval(function () {
        if (!window.__adroll) return;
        expect(window.adroll_adv_id).not.to.be(undefined);
        expect(window.adroll_pix_id).not.to.be(undefined);
        expect(window.adroll_optout).not.to.be(undefined);
        expect(spy.called).to.be(true);
        clearInterval(interval);
        done();
      }, 20);
    });

    it('should store options', function () {
      analytics.initialize({ 'AdRoll' : test['AdRoll'] });
      expect(analytics.providers[0].options.advId).to.equal(test['AdRoll'].advId);
      expect(analytics.providers[0].options.pixId).to.equal(test['AdRoll'].pixId);
    });

  });

});