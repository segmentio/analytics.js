var analytics = require('analytics');


describe('Klaviyo', function () {

  describe('initialize', function () {

    it('should call ready and load library', function () {
      expect(window._learnq).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Klaviyo' : test['Klaviyo'] });
      expect(window._learnq).not.to.be(undefined);
      expect(spy.called).to.be(true);
    });

    it('should store options', function () {
      analytics.initialize({ 'Klaviyo' : test['Klaviyo'] });
      expect(analytics.providers[0].options.apiKey).to.equal(test['Klaviyo']);
    });

  });


  describe('identify', function () {

    it('should push "_identify"', function () {
      var spy = sinon.spy(window._learnq, 'push');
      analytics.identify(test.traits);
      expect(spy.calledWith(['identify', test.traits])).to.be(true);

      spy.reset();
      analytics.identify(test.userId);
      expect(spy.calledWith(['identify', { $id: test.userId }])).to.be(true);

      spy.reset();
      var augmentedTraits = _.extend({}, test.traits, { $id: test.userId });
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