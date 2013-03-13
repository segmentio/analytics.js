describe('Intercom', function () {

  var options = {
    appId     : 'abc123',
    activator : '#someElement',
  };

  var extend = require('segmentio-extend')
    , clone  = require('component-clone');

  var userId = test.userId
    , traits = extend(clone(test.traits), {
        company : { id : '123' }
      });


  describe('initialize', function () {

    it('should call ready', function () {
      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Intercom' : test['Intercom'] });
      expect(spy.called).to.be(true);
    });

    it('should store options', function () {
      analytics.initialize({ 'Intercom' : test['Intercom'] });
      expect(analytics.providers[0].options.appId).to.equal(test['Intercom']);
    });

    it('should store expanded options', function () {
      analytics.initialize({ 'Intercom' : options });
      options.counter = true;
      expect(analytics.providers[0].options).to.eql(options);
    });
  });


  describe('identify', function () {

    this.timeout(10000);

    it('should load library', function (done) {
      expect(window.intercomSettings).to.be(undefined);
      expect(window.Intercom).to.be(undefined);

      analytics.identify(test.userId, traits);

      expect(window.intercomSettings).not.to.be(undefined);
      expect(window.intercomSettings).to.eql({
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
      });

      // Once the Intercom library comes back, `Intercom` will exist.
      var interval = setInterval(function () {
        if (!window.Intercom) return;
        expect(window.Intercom).not.to.be(undefined);
        clearInterval(interval);
        done();
      }, 20);
    });

    it('shouldnt load library the second time', function () {
      // We're going to test that `window.intercomSettings` doesnt get reset
      // to identified values again.
      window.intercomSettings = undefined;

      analytics.identify(test.userId, test.traits);
      expect(window.intercomSettings).to.be(undefined);
    });

  });

});