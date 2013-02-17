var analytics = require('analytics');


describe('Customer.io', function () {

  describe('initialize', function () {

    // Customer.io can't be loaded twice, so we do all this in one test.
    it('should call ready and load libarary', function (done) {
      expect(window._cio).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Customer.io' :  test['Customer.io'] });
      expect(analytics.providers[0].options.siteId).to.equal('x');
      expect(window._cio).not.to.be(undefined);
      expect(window._cio.pageHasLoaded).to.be(undefined);
      expect(spy.called).to.be(true);

      // When the library is actually loaded `pageHasLoaded` is set.
      setTimeout(function () {
        expect(window._cio.pageHasLoaded).not.to.be(undefined);
        done();
      }, 1900);
    });

  });


  describe('identify', function () {

    it('should call identify', function () {
      var spy = sinon.spy(window._cio, 'identify');
      analytics.identify(test.traits);
      expect(spy.called).to.be(false);

      spy.reset();
      analytics.identify(test.userId, test.traits);
      expect(spy.calledWith({
        id         : test.userId,
        name       : test.traits.name,
        email      : test.traits.email,
        created_at : Math.floor((test.traits.created).getTime() / 1000)
      })).to.be(true);

      spy.restore();
    });

  });


  describe('track', function () {

    it('should call track', function () {
      var spy = sinon.spy(window._cio, 'track');
      analytics.track(test.event, test.properties);
      expect(spy.calledWith(test.event, test.properties)).to.be(true);

      spy.restore();
    });

  });

});