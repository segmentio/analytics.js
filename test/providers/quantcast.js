
describe('Quantcast', function () {

  describe('initialize', function () {

    it('should call ready and load library', function (done) {
      expect(window._qevents).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Quantcast' : test['Quantcast'] });

      // Make sure the library actually loads.
      setTimeout(function () {
        expect(window._qevents).not.to.be(undefined);
        expect(spy.called).to.be(true);
        done();
      }, 1900);
    });

    it('should store options', function () {
      analytics.initialize({ 'Quantcast' : test['Quantcast'] });
      expect(analytics.providers[0].options.pCode).to.equal(test['Quantcast']);
    });

  });

});