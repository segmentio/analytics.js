describe('Perfect Audience', function () {


  describe('initialize', function () {

    this.timeout(10000);

    it('should call read and load library', function (done) {
      expect(window._pa).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Perfect Audience' : test['Perfect Audience'] });
      expect(window._pa).not.to.be(undefined);

      // Test to make sure the library _actually_ loads.
      var interval = setInterval(function () {
        if (!window._pa.track) return;
        expect(window._pa.track).not.to.be(undefined);
        expect(spy.called).to.be(true);
        clearInterval(interval);
        done();
      }, 20);
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
