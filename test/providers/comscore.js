
describe('comScore', function () {

  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library and store options', function (done) {
      expect(window._comscore).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'comScore' : test['comScore'] });
      expect(window._comscore).not.to.be(undefined);

      // Wait for the library to load for ready to be called.
      var interval = setInterval(function () {
        if (!spy.called) return;
        expect(spy.called).to.be(true);
        clearInterval(interval);
        done();
      }, 20);
    });

    // The `c1` variable is hardcoded and not passed in.
    it('should store options', function () {
      analytics.initialize({ 'comScore' : test['comScore'] });
      expect(window._comscore[0].c1).to.equal('2');
      expect(window._comscore[0].c2).to.equal(test['comScore'].c2);
      expect(analytics.providers[0].options.c1).to.equal('2');
      expect(analytics.providers[0].options.c2).to.equal(test['comScore'].c2);
    });

  });

});