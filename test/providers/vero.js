var analytics = require('analytics');


describe('Vero', function () {

  describe('initialize', function () {

    it('should call ready and load library', function (done) {
      expect(window._veroq).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Vero' : test['Vero'] });
      expect(window._veroq).not.to.be(undefined);
      expect(window._veroq.push).to.equal(Array.prototype.push);
      expect(spy.called).to.be(true);

      // When the library loads, it will overwrite the push method.
      setTimeout(function () {
        expect(window._veroq.push).not.to.equal(Array.prototype.push);
        done();
      }, 1900);
    });

    it('should store options', function () {
      analytics.initialize({ 'Vero' : test['Vero'] });
      expect(analytics.providers[0].options.apiKey).to.equal('x');
    });

  });


  describe('identify', function () {

    // Very requires an email and traits. Check for both separately, but do
    // traits first because otherwise the userId will be cached.
    it('should push "users"', function () {
      // Vero alters passed in array, use a stub to track count
      var stub = sinon.stub(window._veroq, 'push');
      analytics.identify(test.traits);
      expect(stub.called).to.be(false);

      stub.reset();
      analytics.identify(test.userId);
      expect(stub.called).to.be(false);

      stub.reset();

      analytics.identify(test.userId, test.traits);
      expect(stub.calledWith(['user', {
        id      : test.userId,
        email   : test.traits.email,
        name    : test.traits.name,
        created : test.traits.created
      }])).to.be(true);

      stub.restore();
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