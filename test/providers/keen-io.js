describe('Keen IO', function () {


  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      expect(window.Keen).not.to.exist;

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Keen IO' : test['Keen IO'] });
      expect(window.Keen).not.to.be(undefined);
      expect(window.Keen.setGlobalProperties).not.to.be(undefined);
      expect(window.Keen.addEvent).not.to.be(undefined);
      expect(window.Keen._pId).to.equal('KEEN_PROJECT_TOKEN');
      expect(spy.called).to.be(true);

      // When the Keen IO library loads, it creates some keys we can test.
      expect(window.Keen.Base64).to.be(undefined);
      var interval = setInterval(function () {
        if (!window.Keen.Base64) return;
        expect(window.Keen.Base64).not.to.be(undefined);
        clearInterval(interval);
        done();
      }, 20);
    });

    it('should store options', function () {
      analytics.initialize({ 'Keen IO' : test['Keen IO'] });
      expect(analytics.providers[0].options.projectToken).to.equal(test['Keen IO'].projectToken);
    });

    it('shouldnt track an initial pageview by default', function () {
      var provider = analytics.providers[0]
        , spy      = sinon.spy(provider, 'pageview');

      analytics.initialize({ 'Keen IO' : test['Keen IO'] });
      expect(spy.called).to.be(false);

      spy.restore();
    });

    it('should track an initial pageview with initialPageview set', function () {
      var extend  = require('segmentio-extend')
        , spy     = sinon.spy(window.Keen, 'addEvent')
        , options = extend({}, test['Keen IO'], {
            pageview        : true,
            initialPageview : true
          });

      analytics.initialize({ 'Keen IO' : options });
      expect(spy.called).to.be(true);

      spy.restore();
      analytics.providers[0].options.pageview = false;
      analytics.providers[0].options.initialPageview = false;
    });

  });


  describe('identify', function () {

    before(analytics.user.clear);

    it('should call setGlobalProperties', function () {
      // Reset internal `userId` state from any previous identifies.
      analytics.userId = null;

      // a custom checker for code re-use. just makes sure that the function
      // passed as the globalProperties, when invoked, returns sane values.
      var customChecker = function (expectedUserId, expectedTraits) {
        expect(spy.calledWithMatch(function (value) {
          if (typeof value === "function") {
            var result = value("some event name");
            expect(result.user.userId).to.be(expectedUserId);
            expect(result.user.traits).to.eql(expectedTraits);
            return true;
          }
          return false;
        })).to.be(true);
      };

      var spy = sinon.spy(window.Keen, 'setGlobalProperties');
      analytics.identify();
      customChecker(undefined, {});

      spy.reset();
      analytics.identify(test.userId);
      customChecker(test.userId, {});

      spy.reset();
      analytics.identify(test.userId, test.traits);
      customChecker(test.userId, test.traits);

      spy.restore();
    });

  });


  describe('track', function () {

    // Keen IO adds custom properties, so we need to have a loose match.
    it('calls addEvent on track', function () {
      var spy = sinon.spy(window.Keen, 'addEvent');
      analytics.track(test.event, test.properties);
      expect(spy.calledWithMatch(test.event, test.properties)).to.be(true);
      spy.restore();
    });

  });


  describe('pageview', function () {

    it('shouldnt track pageviews by default', function () {
      var provider = analytics.providers[0]
        , spy      = sinon.spy(provider, 'track');

      analytics.pageview();
      expect(spy.called).to.be(false);

      spy.restore();
    });

    it('should track pageviews with the pageview option set', function () {
      var provider = analytics.providers[0]
        , spy      = sinon.spy(provider, 'track');

      provider.options.pageview = true;
      analytics.pageview(test.url);
      expect(spy.calledWith('Loaded a Page', {
        url  : test.url,
        name : document.title
      })).to.be(true);

      spy.restore();
      provider.options.pageview = false;
    });

  });

});
