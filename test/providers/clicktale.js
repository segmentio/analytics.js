
describe('ClickTale', function () {

  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      expect(window.ClickTale).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'ClickTale' : test['ClickTale'] });

      // When the library loads, `ClickTale` is created.
      var interval = setInterval(function () {
        if (!window.ClickTale) return;
        expect(window.ClickTale).not.to.be(undefined);
        expect(spy.called).to.be(true);
        clearInterval(interval);
        done();
      }, 20);
    });

    it('should store options', function () {
      analytics.initialize({ 'ClickTale' : test['ClickTale'] });
      expect(analytics.providers[0].options.projectId).to.equal('19370');
    });

  });

});