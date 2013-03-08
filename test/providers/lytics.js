
describe('Lytics', function () {

  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      expect(window.jstag).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Lytics' : test['Lytics'] });

      // When the library loads `jstag` is created.
      var interval = setInterval(function () {
        if (!window.jstag) return;
        expect(window.jstag).not.to.be(undefined);
        expect(spy.called).to.be(true);
        clearInterval(interval);
        done();
      }, 20);
    });

    it('should store options', function () {
      analytics.initialize({ 'Lytics' : test['Lytics'] });
      expect(analytics.providers[0].options.cid).to.equal(test['Lytics']);
    });

  });

});
