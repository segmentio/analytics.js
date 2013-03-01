
describe('Errorception', function () {

  describe('initialize', function () {

    it('should call ready and load library', function () {
      expect(window._errs).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Errorception' : test['Errorception'] });
      expect(window._errs).not.to.be(undefined);
      expect(analytics.providers[0].options.projectId).to.equal('x');
      expect(spy.called).to.be(true);
    });

  });


  describe('identify', function () {

    it('should add metadata', function () {
      expect(window._errs.meta).to.be(undefined);

      analytics.providers[0].options.meta = true;
      analytics.identify(test.userId, test.traits);

      expect(window._errs.meta).to.eql(test.traits);
    });

    it('shouldnt add metadata', function () {
      window._errs.meta = undefined;

      analytics.providers[0].options.meta = false;
      analytics.identify(test.userId, test.traits);

      expect(window._errs.meta).to.be(undefined);
    });

  });

});