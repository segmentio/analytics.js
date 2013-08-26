//var sinon = require('sinon');

describe('Lytics', function () {

  var analytics = require('analytics')
    , tick = require('next-tick');

  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      expect(window.jstag).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Lytics' : test['Lytics'] });

      expect(window.jstag).not.to.be(undefined);

      tick(function () {
        expect(spy.called).to.be(true);
        done();
      });
    });

    it('should store options', function () {
      analytics.initialize({ 'Lytics' : test['Lytics'] });
      expect(analytics._providers[0].options.cid).to.equal(test['Lytics']);
    });

  });

  describe('pageview', function () {

    it('calls jstag.send on pageview', function () {
      var spy = sinon.spy(window.jstag, 'send');
      analytics.pageview();
      expect(spy.called).to.be(true);
      spy.restore();
    });

  });

  describe('track', function () {

    it('should track an event send', function (done) {
      analytics.initialize({ 'Lytics' : test['Lytics'] });
      expect(window.jstag).not.to.be(undefined);

      var interval = setInterval(function () {
        // wait for full load, bind will exist once js has loaded from cdn
        // if cdn hasn't loaded, then this test will fail for timeout
        if (!window.jstag.bind ) return;

        var spy = sinon.spy(window.jstag, 'send');

        analytics.track(test.event, test.properties);

        expect(spy.called).to.be(true);

        clearInterval(interval);
        done();

        expect(spy.calledWith(
          sinon.match({ type : test.properties.type })
        )).to.be(true);
        spy.restore();

      }, 20);

    });

  });

  describe('identify', function () {

    beforeEach(analytics._user.clear);

    it('should accept user traits', function () {
      var spy = sinon.spy(window.jstag, 'send');

      analytics.identify(test.userId, test.traits);
      expect(spy.called).to.be(true);
      expect(spy.calledWith(
        sinon.match({ email : 'zeus@segment.io'})
      )).to.be(true);

      spy.restore();
    });

  });

});
