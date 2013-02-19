
describe('Chartbeat', function () {

  describe('initialize', function () {

    it('should call ready and load library', function (done) {
      expect(window.pSUPERFLY).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Chartbeat' : test['Chartbeat'] });

      // Once the library is loaded, the global will exist and ready should have
      // been called.
      setTimeout(function () {
        expect(window.pSUPERFLY).not.to.be(undefined);
        expect(spy.called).to.be(true);
        done();
      }, 1900);
    });

    it('should store options', function () {
      analytics.initialize({ 'Chartbeat' : test['Chartbeat'] });
      var options = analytics.providers[0].options;
      expect(options.uid).to.equal(test['Chartbeat'].uid);
      expect(options.domain).to.equal(test['Chartbeat'].domain);
      // We copy over all of the options directly into Chartbeat. But,
      // Chartbeat actually adds their own options, so we can't just use `eql`.
      expect(window._sf_async_config.uid).to.equal(test['Chartbeat'].uid);
      expect(window._sf_async_config.domain).to.equal(test['Chartbeat'].domain);
    });

  });


  describe('pageview', function () {

    it('should call virtualPage', function () {
      var spy = sinon.spy(window.pSUPERFLY, 'virtualPage');
      analytics.pageview();
      expect(spy.calledWith(window.location.pathname)).to.be(true);

      spy.reset();
      analytics.pageview(test.url);
      expect(spy.calledWith(test.url)).to.be(true);

      spy.restore();
    });

  });

});