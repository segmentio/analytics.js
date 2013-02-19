
describe('CrazyEgg', function () {

  describe('initialize', function () {

    it('should call ready and load library', function () {
      expect(window.CE2).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'CrazyEgg' : test['CrazyEgg'] });

      // CrazyEgg seems to block requesting their script from localhost, so
      // not much we can do here for now.
      //
      // expect(window.CE2).to.be(undefined);
      // setTimeout(function () {
      //     expect(window.CE2).not.to.be(undefined);
      //     expect(spy.called).to.be(true);
      //     done();
      // }, 1900);
    });

    it('should store options', function () {
      analytics.initialize({ 'CrazyEgg' : test['CrazyEgg'] });
      expect(analytics.providers[0].options.accountNumber).to.equal('00138301');
    });

  });

});