
describe('Keen IO', function () {

  describe('initialize', function () {

    it('should call ready and load library', function (done) {
      expect(window.Keen).not.to.exist;

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Keen IO' : test['Keen IO'] });
      expect(window.Keen).not.to.be(undefined);
      expect(window.Keen.setGlobalProperties).not.to.be(undefined);
      expect(window.Keen.addEvent).not.to.be(undefined);
      expect(window.Keen._pId).to.equal('KEEN_PROJECT_ID');
      expect(window.Keen._ak).to.equal('KEEN_API_KEY');
      expect(spy.called).to.be(true);

      // When the Keen IO library loads, it creates some keys we can test.
      expect(window.Keen.Base64).to.be(undefined);
      setTimeout(function () {
        expect(window.Keen.Base64).not.to.be(undefined);
        done();
      }, 1900);
    });

    it('should store options', function () {
      analytics.initialize({ 'Keen IO' : test['Keen IO'] });
      expect(analytics.providers[0].options.projectId).to.equal(test['Keen IO'].projectId);
      expect(analytics.providers[0].options.apiKey).to.equal(test['Keen IO'].apiKey);
    });

  });


  describe('identify', function () {

    it('should call setGlobalProperties', function () {
      // Reset internal `userId` state from any previous identifies.
      analytics.userId = null;

      var spy = sinon.spy(window.Keen, 'setGlobalProperties');
      analytics.identify();
      expect(spy.called).to.be(false);

      // a custom checker for code re-use. just makes sure that the function
      // passed as the globalProperties, when invoked, returns sane values.
      var customChecker = function (expectedUserId, expectedTraits) {
        expect(spy.calledWithMatch(function (value) {
          if (typeof value === "function") {
            var result = value("some event name");
            expect(result.user.userId).to.equal(expectedUserId);
            expect(result.user.traits).to.eql(expectedTraits);
            return true;
          }
          return false;
        })).to.be(true);
      };

      spy.reset();
      analytics.identify(test.userId);
      customChecker(test.userId);

      spy.reset();
      analytics.identify(test.userId, test.traits);
      customChecker(test.userId, test.traits);

      spy.restore();
    });

  });


  describe('track', function () {

    it('calls addEvent on track', function () {
      var spy = sinon.spy(window.Keen, 'addEvent');
      analytics.track(test.event, test.properties);
      // Keen IO adds custom properties, so we need to have a loose match.
      expect(spy.calledWithMatch(test.event, test.properties)).to.be(true);

      spy.restore();
    });

  });

});
