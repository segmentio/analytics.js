var analytics = require('analytics');


describe('comScore', function () {

  describe('initialize', function () {

    it('should call ready and load library', function (done) {
      expect(window._comscore).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'comScore' : test['comScore'] });
      expect(window._comscore).not.to.be(undefined);

      // Wait for the library to load for ready to be called.
      setTimeout(function () {
        expect(spy.called).to.be(true);
        done();
      }, 1900);
    });

    it('should store options', function () {
      analytics.initialize({ 'comScore' : test['comScore'] });
      expect(window._comscore[0].c1).to.equal('2');
      expect(window._comscore[0].c2).to.equal('x');
      expect(analytics.providers[0].options.c1).to.equal('2');
      expect(analytics.providers[0].options.c2).to.equal('x');
    });

  });

});