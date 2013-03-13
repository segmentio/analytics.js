describe('Intercom', function () {


  describe('initialize', function () {

    it('should load library and call ready', function (done) {
      var spy = sinon.spy();
      analytics.ready(spy);

      expect(window.intercomSettings).to.be(undefined);
      expect(window.Intercom).to.be(undefined);

      analytics.initialize({ 'Intercom' : test['Intercom'] });

      // Once the Intercom library comes back, `Intercom` will exist.
      var interval = setInterval(function () {
        if (!window.Intercom) return;
        expect(window.Intercom).not.to.be(undefined);
        expect(spy.called).to.be(true);
        clearInterval(interval);
        done();
      }, 20);
    });

    it('should store options', function () {
      analytics.initialize({ 'Intercom' : test['Intercom'] });
      expect(analytics.providers[0].options.appId).to.equal(test['Intercom'].appId);
      expect(analytics.providers[0].options.activator).to.equal(test['Intercom'].activator);
      expect(analytics.providers[0].options.counter).to.equal(test['Intercom'].counter);
    });

  });


  describe('identify', function () {

    var extend = require('segmentio-extend');

    var traits = extend({}, test.traits, {
      company : {
        name : 'Segment.io',
        id   : '123'
      }
    });

    var settings = {
      company     : traits.company,
      created_at  : Math.floor(traits.created/1000),
      custom_data : {},
      email       : traits.email,
      name        : traits.name,
      widget      : {
        activator   : test['Intercom'].activator,
        use_counter : test['Intercom'].counter
      }
    };

    var bootSettings = {
      app_id    : test['Intercom'].appId,
      user_id   : test.userId,
      user_hash : undefined
    };

    it('should do nothing with no userId', function () {
      var stub = sinon.stub(window, 'Intercom');
      analytics.user.clear();
      analytics.identify(traits);
      expect(stub.called).to.be(false);
      stub.restore();
    });

    it('should call boot the first time and update the second', function () {
      var stub = sinon.stub(window, 'Intercom');

      analytics.identify(test.userId, traits);
      expect(stub.calledWith('boot', extend({}, settings, bootSettings))).to.be(true);
      stub.reset();

      analytics.identify(test.userId, traits);
      expect(stub.calledWith('update', settings)).to.be(true);
      stub.restore();
    });

  });

});