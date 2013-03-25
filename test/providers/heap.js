describe('Heap', function () {

  describe('initialize', function () {

    it('should call ready and load library', function () {
      expect(window.heap).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Heap' : test['Heap'] });
      expect(spy.called).to.be(true);
      expect(window.heap).not.to.be(undefined);
    });

    it('should store options', function () {
      analytics.initialize({ 'Heap' : test['Heap'] });
      expect(analytics.providers[0].options.apiKey).to.equal(test['Heap']);
    });

  });


  describe('identify', function () {

    it('should call heap.identify', function () {
      var identifySpy = sinon.spy(window.heap, 'identify');
      analytics.identify(test.traits);
      expect(identifySpy.calledWith(test.traits)).to.be(true);
      identifySpy.restore();
    });
  });


  describe('track', function () {

    it('should call heap.track', function () {
      var trackSpy = sinon.spy(window.heap, 'track');
      analytics.track(test.event, test.properties);
      expect(trackSpy.calledWith(test.event, test.properties)).to.be(true);
      trackSpy.restore();
    });
  });

});