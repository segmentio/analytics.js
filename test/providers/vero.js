describe('Vero', function () {


  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      var spy  = sinon.spy()
        , push = Array.prototype.push;

      expect(window._veroq).to.be(undefined);

      analytics.ready(spy);
      analytics.initialize({ 'Vero' : test['Vero'] });

      expect(window._veroq).not.to.be(undefined);
      expect(window._veroq.push).to.equal(push);
      expect(spy.called).to.be(true);
      expect(analytics.providers[0].options.apiKey).to.equal('x');

      // When the library loads, it will overwrite the push method.
      var interval = setInterval(function () {
        if (window._veroq.push === push) return;
        expect(window._veroq.push).not.to.equal(push);
        clearInterval(interval);
        done();
      }, 20);
    });
  });


  describe('identify', function () {
    var stub;
    beforeEach(function () {
      analytics.user.clear();
      stub = sinon.stub(window._veroq, 'push');
    });
    afterEach(function () { stub.restore(); });

    // Very requires an email and traits. Check for both separately, but do
    // traits first because otherwise the userId will be cached.
    it('should not push "users" without a userId', function () {
      analytics.identify(test.traits);
      expect(stub.called).to.be(false);
    });

    it('should not push "users" without traits', function () {
      analytics.identify(test.userId);
      expect(stub.called).to.be(false);
    });

    it('should push "users" with traits and userId', function () {
      analytics.identify(test.userId, test.traits);
      expect(stub.calledWith(['user', {
        id      : test.userId,
        email   : test.traits.email,
        name    : test.traits.name,
        created : test.traits.created
      }])).to.be(true);
    });
  });


  describe('track', function () {

    it('should push "track"', function () {
      var stub = sinon.stub(window._veroq, 'push');
      analytics.track(test.event, test.properties);

      expect(stub.calledWith(['track', test.event, test.properties])).to.be(true);

      stub.restore();
    });
  });
});