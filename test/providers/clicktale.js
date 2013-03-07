
describe('ClickTale', function () {

  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      expect(window.ClickTale).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'ClickTale' : test['ClickTale'] });

      // When the library loads, `ClickTale` is created.
      var interval = setInterval(function () {
        if (!window.ClickTale) return;
        expect(window.ClickTale).not.to.be(undefined);
        expect(spy.called).to.be(true);
        clearInterval(interval);
        done();
      }, 20);
    });

    it('should store options', function () {
      analytics.initialize({ 'ClickTale' : test['ClickTale'] });
      expect(analytics.providers[0].options.projectId).to.equal('19370');
      expect(analytics.providers[0].options.recordingRatio).to.equal('0.0089');
      expect(analytics.providers[0].options.partitionId).to.equal('www14');
      expect(analytics.providers[0].options.httpCdnUrl).to.not.equal(null);
      expect(analytics.providers[0].options.httpsCdnUrl).to.equal(null);
    });

  });


  describe('identify', function () {

    it('should call ClickTaleSetUID and ClickTaleField', function () {
      var spyUserId = sinon.spy(window, 'ClickTaleSetUID');
      var spyTraits = sinon.spy(window, 'ClickTaleField');

      analytics.identify(test.userId);
      expect(spyUserId.calledWith(test.userId)).to.be(true);
      spyUserId.reset();

      analytics.identify({ trait : 'test'});
      expect(spyTraits.calledWith('trait', 'test')).to.be(true);
      spyTraits.reset();

    });

  });


  describe('track', function () {

    it('should call ClickTaleEvent', function () {
      var spy = sinon.spy(window, 'ClickTaleEvent');
      analytics.track(test.event, test.properties);
      expect(spy.calledWith(test.event)).to.be(true);
      spy.restore();
    });

  });

});