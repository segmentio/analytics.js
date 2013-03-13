describe('Storyberg', function () {


  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      var spy  = sinon.spy()
        , push = Array.prototype.push;

      expect(window._sbq).to.be(undefined);

      analytics.ready(spy);
      analytics.initialize({ 'Storyberg' : test['Storyberg'] });

      expect(window._sbq).not.to.be(undefined);
      expect(window._sbq.push).to.equal(Array.prototype.push);
      expect(spy.called).to.be(true);

      // When the library loads, it will overwrite the push method.
      var interval = setInterval(function () {
        if (window._sbq.push === push) return;
        expect(window._sbq.push).not.to.equal(push);
        clearInterval(interval);
        done();
      }, 20);
    });

    it('should store options', function () {
      analytics.initialize({ 'Storyberg' : test['Storyberg'] });
      expect(analytics.providers[0].options.apiKey).to.equal('x');
    });

  });


  describe('identify', function () {

    it('should push "users"', function () {
      var stub = sinon.stub(window._sbq, 'push');
      analytics.identify(test.userId);
      expect(stub.called).to.be(true);

      stub.reset();

      analytics.identify(test.userId, test.traits);
      expect(stub.calledWith(['identify', {
        email   : test.traits.email,
        name    : test.traits.name,
        created : test.traits.created,
        user_id : test.userId
      }])).to.be(true);

      stub.restore();
    });

  });


  describe('track', function () {

    var clone = require('component-clone');

    it('should push "track"', function () {
      var stub = sinon.stub(window._sbq, 'push');
      analytics.track(test.event);

      expect(stub.calledWith(['event', {
        name    : test.event
      }])).to.be(true);

      stub.restore();
    });

    it('should track with properties', function () {
      var stub = sinon.stub(window._sbq, 'push');
      analytics.track(test.event, test.properties);

      var properties = clone(test.properties);
      properties.name = test.event;

      expect(stub.calledWith(['event', properties])).to.be(true);

      stub.restore();
    });

    it('should track properties with a name field', function () {
      var stub = sinon.stub(window._sbq, 'push')
        , properties = clone(test.properties);
      properties.name = 'Some name';

      analytics.track(test.event, properties);

      properties._name = properties.name;
      properties.name = test.event;
      expect(stub.calledWith(['event', properties])).to.be(true);

      stub.restore();
    });

  });

});
