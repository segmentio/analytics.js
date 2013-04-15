describe('Woopra', function () {


  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      expect(window.woopraReady).to.be(undefined);
      expect(window.woopraTracker).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Woopra' : test['Woopra'] });
      expect(window.woopraReady).not.to.be(undefined);
      expect(window.woopraTracker).to.be(undefined);

      // Once the library loads the tracker will be created and the spy will
      // be called.
      var interval = setInterval(function () {
        if (!window.woopraTracker) return;
        expect(window.woopraTracker).not.to.be(undefined);
        expect(spy.called).to.be(true);
        clearInterval(interval);
        done();
      }, 20);
    });

    it('should store options', function () {
      analytics.initialize({ 'Woopra' : test['Woopra'] });
      expect(analytics.providers[0].options.domain).to.equal(test['Woopra']);
    });

  });


  describe('identify', function () {

    it('correctly adds the user properties', function () {

      var spy = sinon.spy(window.woopraTracker, 'addVisitorProperty');
      analytics.identify(test.userId, test.traits);
      expect(spy.calledWith('email', test.traits.email)).to.be(true);
      expect(spy.calledWith('id', test.userId)).to.be(true);
      expect(spy.calledWith('name', test.traits.name)).to.be(true);
      expect(spy.callCount).to.be(3);
      spy.reset();
    });

  });


  describe('track', function () {

    // Woopra adds the event name to the properties hash.
    it('tracks an event with pushEvent on track', function () {
      var extend = require('segmentio-extend')
        , spy = sinon.spy(window.woopraTracker, 'pushEvent')
        , augmentedProperties = { name : test.event };

      analytics.track(test.event);
      expect(spy.calledWith(sinon.match(augmentedProperties))).to.be(true);
      spy.reset();

      augmentedProperties = extend({}, test.properties, { name : test.event });
      analytics.track(test.event, test.properties);
      expect(spy.calledWith(sinon.match(augmentedProperties))).to.be(true);

      spy.restore();
    });

  });

});