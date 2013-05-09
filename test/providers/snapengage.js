describe('SnapEngage', function () {


  describe('initialize', function () {

    this.timeout(15000);

    it('should call ready and load library', function (done) {
      expect(window.SnapABug).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'SnapEngage' : test['SnapEngage'] });

      var interval = setInterval(function () {
        if (!window.SnapABug) return;
        expect(window.SnapABug).not.to.be(undefined);
        expect(spy.called).to.be(true);
        clearInterval(interval);
        done();
      }, 20);
    });

    it('should store options', function () {
      analytics.initialize({ 'SnapEngage' : test['SnapEngage'] });
      expect(analytics.providers[0].options.apiKey).to.equal(test['SnapEngage']);
    });

  });

});