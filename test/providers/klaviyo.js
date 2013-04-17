describe('Klaviyo', function () {


  describe('initialize', function () {

    it('should call ready and load library', function (done) {
      var spy  = sinon.spy()
        , push = Array.prototype.push;

      expect(window._learnq).to.be(undefined);

      analytics.ready(spy);
      analytics.initialize({ 'Klaviyo' : test['Klaviyo'] });

      // Creates a queue, so it's ready immediately.
      expect(window._learnq).not.to.be(undefined);
      expect(spy.called).to.be(true);

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
      expect(analytics.providers[0].options.apiKey).to.equal(test['Klaviyo']);
    });

  });


  describe('identify', function () {

    beforeEach(analytics.user.clear);

    it('should push "_identify"', function () {
      var extend = require('segmentio-extend')
        , spy    = sinon.spy(window._learnq, 'push');

      analytics.identify(test.traits);
      expect(spy.calledWith(['identify', test.traits])).to.be(true);
      spy.reset();
      analytics.user.clear();

      analytics.identify(test.userId);
      expect(spy.calledWith(['identify', { $id: test.userId }])).to.be(true);
      spy.reset();
      analytics.user.clear();

      var augmentedTraits = extend({}, test.traits, { $id: test.userId });
      analytics.identify(test.userId, test.traits);
      expect(spy.calledWith(['identify', augmentedTraits])).to.be(true);
      spy.restore();
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