describe('Klaviyo', function () {

  var analytics = require('analytics')
    , tick = require('next-tick');


  describe('initialize', function () {

    it('should call ready and load library', function (done) {
      this.timeout(10000);
      var spy  = sinon.spy()
        , push = Array.prototype.push;

      expect(window._learnq).to.be(undefined);

      analytics.ready(spy);
      analytics.initialize({ 'Klaviyo' : test['Klaviyo'] });

      // Creates a queue, so it's ready immediately.
      expect(window._learnq).not.to.be(undefined);

      tick(function () {
        expect(spy.called).to.be(true);
      });

      // Once the library loads, push will be overwritten.
      var interval = setInterval(function () {
        if (window._learnq.push === push) return;
        expect(window._learnq.push).not.to.eql(push);
        clearInterval(interval);
        done();
      }, 20);
    });

    it('should store options', function () {
      analytics.initialize({ 'Klaviyo' : test['Klaviyo'] });
      expect(analytics._providers[0].options.apiKey).to.equal(test['Klaviyo']);
    });

  });


  describe('identify', function () {

    var extend = require('segmentio-extend');
    var spy;

    beforeEach(function () {
      analytics._user.clear();
      spy = sinon.spy(window._learnq, 'push');
    });

    afterEach(function () {
      spy.restore();
    });

    it('should push "_identify" with a userId', function () {
      analytics.identify(test.userId);
      expect(spy.calledWith(['identify', { $id: test.userId }])).to.be(true);
    });

    it('shouldnt push "_identify" with traits', function () {
      analytics.identify(test.traits);
      expect(spy.called).to.be(false);
    });

    it('should push "_identify" with a userId and traits', function () {
      var augmentedTraits = extend({}, test.traits, { $id: test.userId });
      analytics.identify(test.userId, test.traits);
      expect(spy.calledWith(['identify', augmentedTraits])).to.be(true);
    });

  });


  describe('track', function () {

    it('should push "_track"', function () {
      var spy = sinon.spy(window._learnq, 'push');
      analytics.track(test.event, test.properties);
      // Klaviyo adds extra properites to the event, so we don't want to check
      // for an exact match.
      expect(spy.calledWithMatch(['track', test.event, sinon.match(test.properties)])).to.be(true);
      spy.restore();
    });

  });

});