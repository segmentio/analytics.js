describe('Customer.io', function () {

  var analytics = require('analytics')
    , tick = require('next-tick');


  describe('initialize', function () {

    this.timeout(10000);

    // Customer.io can't be loaded twice, so we do all this in one test.
    it('should call ready and load libarary', function (done) {
      expect(window._cio).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Customer.io' :  test['Customer.io'] });
      expect(analytics._providers[0].options.siteId).to.equal('x');

      // Customer.io sets up a queue, so spy's called.
      expect(window._cio).not.to.be(undefined);
      expect(window._cio.pageHasLoaded).to.be(undefined);

      tick(function () {
        expect(spy.called).to.be(true);
      });

      // When the library is actually loaded `pageHasLoaded` is set.
      var interval = setInterval(function () {
        if (!window._cio.pageHasLoaded) return;
        expect(window._cio.pageHasLoaded).not.to.be(undefined);
        clearInterval(interval);
        done();
      }, 20);
    });

  });


  describe('identify', function () {

    beforeEach(analytics._user.clear);

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

    it('should convert dates to millis', function () {
      var spy = sinon.spy(window._cio, 'identify');
      var date = new Date();
      analytics.identify('id', {
        date: date
      });
      expect(spy.calledWith({
        id: 'id',
        date: date.getTime()/1000
      })).to.be(true);
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