var analytics = require('analytics');


describe('HitTail', function () {

  describe('initialize', function () {

    it('should call ready and load library', function (done) {
      expect(window.htk).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'HitTail' : test['HitTail'] });

      // When the library loads `htk` is created.
      setTimeout(function () {
        expect(window.htk).not.to.be(undefined);
        expect(spy.called).to.be(true);
        done();
      }, 1900);
    });

    it('should store options', function () {
      analytics.initialize({ 'HitTail' : test['HitTail'] });
      expect(analytics.providers[0].options.siteId).to.equal(test['HitTail']);
    });

  });

});
