
describe('Intercom', function () {

  var options = {
    appId     : 'abc123',
    activator : '#someElement',
    counter   : true // the default
  };

  var extend = require('segmentio-extend')
    , clone  = require('component-clone');

  var userId = test.userId
    , traits = extend(clone(test.traits), {
        company : { id : '123' }
      });

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
      expect(analytics.providers[0].options.appId).to.equal(test['Intercom']);
    });

    it('should store expanded options', function () {
      analytics.initialize({ 'Intercom' : options });
      expect(analytics.providers[0].options).to.eql(options);
    });
  });


  describe('identify', function () {

    var settings = {
      created_at  : Math.floor(traits.created/1000),
      app_id      : options.appId,
      user_id     : userId,
      company     : traits.company,
      custom_data : traits,
      user_hash   : undefined,
      email       : traits.email,
      name        : traits.name,
      widget      : {
        activator   : options.activator,
        use_counter : options.counter
      }
    };


    it('should do nothing with no userId', function () {
      var stub = sinon.stub(window, 'Intercom');
      analytics.user.clear();
      analytics.identify(traits);
      expect(stub.callCount).to.equal(0);
      stub.restore();
    });

    it('should call boot the first time, update the second time', function () {
      var stub = sinon.stub(window, 'Intercom');
      analytics.identify(userId, traits);
      expect(stub.calledWith('boot', settings)).to.be(true);

      stub.reset();

      analytics.identify(userId, traits);
      expect(stub.calledWith('update', settings)).to.be(true);

      stub.restore();
    });

  });

});