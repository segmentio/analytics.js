describe('Perfect Audience', function () {

  describe('initialize', function () {

    it('should call read and load library', function (done) {
      this.timeout(4000);
      expect(window._pa).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Perfect Audience' : test['Perfect Audience'] });
      expect(window._pa).not.to.be(undefined);

      // Test to make sure the library _actually_ loads.
      setTimeout(function () {
        expect(window._pa.track).not.to.be(undefined);
        expect(spy.called).to.be(true);
        done();
      }, 3900);
    });

    it('should call store options', function () {
      analytics.initialize({ 'Perfect Audience' : test['Perfect Audience'] });
      expect(analytics.providers[0].options.siteId).to.equal(test['Perfect Audience']);
    });

  });


  describe('track', function () {

    it('should call track', function () {
      var spy = sinon.spy(window._pa, 'track');
      analytics.track(test.event, test.properties);
      expect(spy.calledWith(test.event, sinon.match(test.properties))).to.be(true);

      spy.restore();
    });

  });

});
