
describe('SnapEngage', function () {

  describe('initialize', function () {

    it('should call ready and load library', function (done) {
      expect(window.SnapABug).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'SnapEngage' : test['SnapEngage'] });

      setTimeout(function () {
        expect(window.SnapABug).not.to.be(undefined);
        expect(spy.called).to.be(true);
        done();
      }, 1900);
    });

    it('should store options', function () {
      analytics.initialize({ 'SnapEngage' : test['SnapEngage'] });
      expect(analytics.providers[0].options.apiKey).to.equal(test['SnapEngage']);
    });

  });

});