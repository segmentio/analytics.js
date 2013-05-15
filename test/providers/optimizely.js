describe('Optimizely', function () {


  describe('initialize', function () {

    it('should call ready', function () {
      var spy  = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Optimizely' : test['Optimizely'] });
      expect(spy.called).to.be(true);
    });

    it('should replay variation traits', function () {
      // Set up the fake Optimizely data.
      window.optimizely.data = {
        experiments : { 0 : { name : 'Test' } },
        state : { variationNamesMap : { 0 : 'Variation' } }
      };

      var spy = sinon.spy(analytics, 'identify');
      analytics.initialize({ 'Optimizely' : test['Optimizely'] });
      expect(spy.calledWith({'Experiment: Test' : 'Variation'})).to.be(true);
    });

  });


  describe('track', function () {

    var clone = require('component-clone');

    it('should push "trackEvent"', function () {
      var stub = sinon.stub(window.optimizely, 'push');
      analytics.track(test.event, test.properties);

      // Adjust properties for what Optimizely needs.
      var properties = clone(test.properties);
      properties.revenue = properties.revenue * 100;

      expect(stub.calledWith(['trackEvent', test.event, properties])).to.be(true);
      stub.restore();
    });

  });

});
