var analytics = require('analytics')
  , extend    = require('segmentio-extend');


describe('Woopra', function () {

  describe('initialize', function () {

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
      setTimeout(function () {
      expect(window.woopraTracker).not.to.be(undefined);
        done();
        expect(spy.called).to.be(true);
      }, 1900);
    });

    it('should store options', function () {
      analytics.initialize({ 'Woopra' : test['Woopra'] });
      expect(analytics.providers[0].options.domain).to.equal(test['Woopra']);
    });

  });


  describe('identify', function () {

    // TODO: We're waiting on handling our own cookie.
    it('correctly identifies the user');

  });


  describe('track', function () {

    // Woopra adds the event name to the properties hash.
    it('tracks an event with pushEvent on track', function () {
      var augmentedProperties;
      var spy = sinon.spy(window.woopraTracker, 'pushEvent');
      augmentedProperties = { name : test.event };
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