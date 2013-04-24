describe('Improvely', function () {


  describe('initialize', function () {

    it('should call ready and load library', function (done) {
      expect(window._improvely).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Improvely' : test['Improvely'] });
      expect(spy.called).to.be(true);
      expect(window._improvely).not.to.be(undefined);
      expect(window.improvely.identify).to.be(undefined);

      // When the library loads, there will be a function `window.improvely.identify`.
      var interval = setInterval(function () {
        if (!window.improvely.identify) return;
        expect(window.improvely.identify).not.to.be(undefined);
        clearInterval(interval);
        done();
      }, 100);
    });

    it('should store options', function () {
      analytics.initialize({ 'Improvely' : test['Improvely'] });
      expect(analytics.providers[0].options.im_domain).to.equal(test['Improvely'].im_domain);
      expect(analytics.providers[0].options.im_project_id).to.equal(test['Improvely'].im_project_id);
    });

  });


  describe('identify', function () {

    it('should call window.improvely.label', function () {
      var stub = sinon.stub(window.improvely, 'label');
      analytics.identify(test.userId);
      expect(stub.calledWith(test.userId)).to.be(true);

      stub.reset();
      analytics.identify(test.userId, test.traits);
      expect(stub.calledWith(test.userId)).to.be(true);

      stub.restore();
    });

  });


  describe('track', function () {

    it('should call window.improvely.goal', function () {
      var stub = sinon.stub(window.improvely, 'goal');
      analytics.track(test.event, test.properties);
      expect(stub.calledWith({
        'type'   : test.properties.type,
        'amount' : test.properties.revenue
      })).to.be(true);

      stub.restore();
    });

    it('should call window.improvely.goal with the correct `type`', function () {
      var stub = sinon.stub(window.improvely, 'goal');
      analytics.track(test.event);
      expect(stub.calledWith({
        'type'   : test.event
      })).to.be(true);

      stub.restore();
    });

  });


});
