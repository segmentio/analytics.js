describe('SnapEngage', function () {

  var analytics = require('analytics');


  describe('initialize', function () {

    this.timeout(15000);

    it('should call ready and load library', function (done) {
      expect(window.SnapABug).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'SnapEngage' : test['SnapEngage'] });

      var interval = setInterval(function () {
        if (!window.SnapABug) return;
        expect(window.SnapABug).not.to.be(undefined);
        expect(spy.called).to.be(true);
        clearInterval(interval);
        done();
      }, 20);
    });

    it('should store options', function () {
      expect(analytics._providers[0].options.apiKey).to.equal(test['SnapEngage']);
    });

  });


  describe('identify', function () {

    beforeEach(analytics._user.clear);

    it('should tag the user with their email', function () {
      var spy = sinon.spy(window.SnapABug, 'setUserEmail');
      analytics.identify(test.userId, test.traits);
      expect(spy.calledWith(test.traits.email)).to.be(true);
    });

  });

});