describe('Intercom', function () {

  describe('initialize', function () {
    this.timeout(10000);

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

    var stub;
    beforeEach(function () { stub = sinon.stub(window, 'Intercom'); });
    afterEach(function () { stub.restore(); });

    var extend = require('extend');

    // Augment `traits` to test for Intercom's special `company` property.
    var traits = extend({}, test.traits, {
      company : {
        created : new Date(),
        name : 'Segment.io',
        id : '123'
      }
    });

    // These are the settings that we expect to be sent to Intercom.
    var settings = {
      company : {
        created_at : Math.floor(traits.company.created/1000),
        name : 'Segment.io',
        id : '123'
      },
      created_at : Math.floor(traits.created/1000),
      email : traits.email,
      name : traits.name,
      increments : undefined,
      user_hash : undefined,
      widget : {
        activator : test['Intercom'].activator,
        use_counter : test['Intercom'].counter
      }
    };

    // When booted, we also expect these settings to be sent to Intercom.
    var bootSettings = {
      app_id : test['Intercom'].appId,
      user_id : test.userId
    };

    it('should do nothing with no userId', function () {
      analytics.user.clear();
      analytics.identify(traits);
      expect(stub.called).to.be(false);
    });

    it('should call boot the first time and update the second', function () {
      analytics.identify(test.userId, traits);
      expect(stub.calledWith('boot', extend({}, settings, bootSettings))).to.be(true);
      stub.reset();
      analytics.identify(test.userId, traits);
      expect(stub.calledWith('update', settings)).to.be(true);
    });

    it('should allow adding context variables to settings', function () {
      var userHash = 'sdfj38fj382r9j29dj29dj29dj29dj2d';
      analytics.identify(test.userId, traits, {
        Intercom: { userHash: userHash }
      });
      expect(stub.calledWith('update', extend(settings, { user_hash: userHash }))).to.be(true);
    });

  });


  describe('group', function () {
    var stub;
    beforeEach(function () { stub = sinon.stub(window, 'Intercom'); });
    afterEach(function () { stub.restore(); });

    it('should push call "update" with the "company"', function () {
      analytics.group('group', { name : 'Group' });
      expect(stub.calledWith('update', {
        company : {
          id : 'group',
          name : 'Group'
        }
      })).to.be(true);
    });

  });

});