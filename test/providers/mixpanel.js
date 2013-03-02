
describe('Mixpanel', function () {

  // Mixpanel needs specially aliased traits.
  var aliasedTraits = {
    $name    : test.traits.name,
    $email   : test.traits.email,
    $created : test.traits.created
  };

  describe('initialize', function () {

    // Initializing Mixpanel twice breaks it, so we do it all in one.
    it('should call ready and load library', function (done) {
      expect(window.mixpanel).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Mixpanel' : test['Mixpanel'] });
      expect(analytics.providers[0].options.token).to.equal(test['Mixpanel']);
      expect(window.mixpanel).not.to.be(undefined);
      expect(window.mixpanel.config).to.be(undefined);
      expect(spy.called).to.be(true);

      // When the library loads, it sets `config`.
      setTimeout(function () {
        expect(window.mixpanel.config).not.to.be(undefined);
        done();
      }, 1900);
    });

  });


  describe('identify', function () {

    beforeEach(analytics.user.clear);

    it('should call identify with a user id', function () {

      var spy = sinon.spy(window.mixpanel, 'identify');
      analytics.identify(test.traits);
      expect(spy.called).to.be(false);

      spy.reset();
      analytics.identify(test.userId);
      expect(spy.calledWith(test.userId)).to.be(true);

      spy.reset();
      analytics.identify(test.userId, test.traits);
      expect(spy.calledWith(test.userId)).to.be(true);

      spy.restore();
    });

    it('should call register with traits', function () {

      var spy = sinon.spy(window.mixpanel, 'register');
      analytics.identify(test.traits);
      expect(spy.calledWith(aliasedTraits)).to.be(true);

      spy.reset();
      analytics.identify(test.userId);
      expect(spy.called).to.be(false);

      spy.reset();
      analytics.identify(test.userId, test.traits);
      expect(spy.calledWith(aliasedTraits)).to.be(true);

      spy.restore();
    });

    // TODO name tag with options flag

    it('should call name_tag with the optimal id', function () {

      var spy = sinon.spy(window.mixpanel, 'name_tag');
      analytics.identify(test.traits);
      expect(spy.called).to.be(false);

      spy.reset();
      analytics.identify(test.userId);
      expect(spy.calledWith(test.userId)).to.be(true);

      spy.reset();
      analytics.identify(test.userId, test.traits);
      expect(spy.calledWith(test.traits.email)).to.be(true);

      spy.restore();
    });

    it('should call people.set with traits', function () {

      analytics.providers[0].options.people = true;
      var spy = sinon.spy(window.mixpanel.people, 'set');
      analytics.identify(test.traits);
      expect(spy.calledWith(aliasedTraits)).to.be(true);

      spy.reset();
      analytics.identify(test.userId, test.traits);
      expect(spy.calledWith(aliasedTraits)).to.be(true);

      spy.restore();
    });

    it('shouldnt call people.set', function () {

      analytics.providers[0].options.people = false;
      var spy = sinon.spy(window.mixpanel.people, 'set');
      analytics.identify(test.userId, test.traits);
      expect(spy.called).to.be(false);

      spy.restore();
    });

  });


  describe('track', function () {

    it('should call track', function () {
      var spy = sinon.spy(window.mixpanel, 'track');
      analytics.track(test.event, test.properties);
      // Mixpanel adds custom properties, so we need to have a loose match.
      expect(spy.calledWith(test.event, sinon.match(test.properties))).to.be(true);

      spy.restore();
    });

    it('should call track_charge with revenue', function () {
      // The revenue feature requires `people` to be turned on.
      analytics.providers[0].options.people = true;
      var spy = sinon.spy(window.mixpanel.people, 'track_charge');

      analytics.track(test.event, { revenue : 9.99 });
      expect(spy.calledWith(9.99)).to.be(true);

      spy.restore();
      analytics.providers[0].options.people = false;
    });

  });


  describe('pageview', function () {

    it('should call track_pageview', function () {
      var spy = sinon.spy(window.mixpanel, 'track_pageview');
      analytics.pageview();
      expect(spy.called).to.be(true);

      spy.reset();
      analytics.pageview(test.url);
      expect(spy.calledWith(test.url)).to.be(true);

      spy.restore();
    });

  });


  describe('alias', function () {

    it('should call alias', function () {
      var spy = sinon.spy(window.mixpanel, 'alias');
      analytics.alias(test.newUserId, test.oldUserId);
      expect(spy.calledWith(test.newUserId, test.oldUserId)).to.be(true);

      spy.restore();
    });

  });

});
