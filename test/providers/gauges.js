describe('Gauges', function () {


  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      var spy  = sinon.spy()
        , push = Array.prototype.push;

      expect(window._gauges).to.be(undefined);

      analytics.ready(spy);
      analytics.initialize({ 'Gauges' : test['Gauges'] });

      // Gauges creates a queue, so it's ready immediately.
      expect(window._gauges).not.to.be(undefined);
      expect(window._gauges.push).to.eql(push);
      expect(spy.called).to.be(true);

      // Once the library loads, push will be overwritten.
      var interval = setInterval(function () {
        if (window._gauges.push === push) return;
        expect(window._gauges.push).not.to.eql(push);
        clearInterval(interval);
        done();
      }, 20);
    });

    it('should store options', function () {
      analytics.initialize({ 'Gauges' : test['Gauges'] });
      expect(analytics.providers[0].options.siteId).to.equal(test['Gauges']);
    });

  });


  describe('pageview', function () {

    it('should push "track"', function () {
      var stub = sinon.stub(window._gauges, 'push');

      analytics.pageview();
      expect(stub.calledWith(['track'])).to.be(true);

      stub.restore();
    });

  });

});
