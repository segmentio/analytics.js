
describe('HitTail', function () {

  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      expect(window.htk).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'HitTail' : test['HitTail'] });

      // When the library loads `htk` is created.
      var interval = setInterval(function () {
        if (!window.htk) return;
        expect(window.htk).not.to.be(undefined);
        expect(spy.called).to.be(true);
        clearInterval(interval);
        done();
      }, 20);
    });

    it('should store options', function () {
      analytics.initialize({ 'HitTail' : test['HitTail'] });
      expect(analytics.providers[0].options.siteId).to.equal(test['HitTail']);
    });

  });

});
