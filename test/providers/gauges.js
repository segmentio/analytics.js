var analytics = require('analytics');


describe('Gauges', function () {

  describe('initialize', function () {

    it('should call ready and load library', function (done) {
      expect(window._gauges).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Gauges' : test['Gauges'] });
      expect(window._gauges).not.to.be(undefined);
      expect(window._gauges.push).to.eql(Array.prototype.push);
      expect(spy.called).to.be(true);

      setTimeout(function () {
        expect(window._gauges.push).not.to.eql(Array.prototype.push);
        done();
      }, 1900);
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