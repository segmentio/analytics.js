
describe('Mixpanel', function () {

  var assert = require('assert');
  var Mixpanel = require('analytics/lib/integrations/mixpanel');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var when = require('when');

  var mixpanel;
  var settings = {
    token: 'x'
  };

  beforeEach(function () {
    mixpanel = new Mixpanel(settings);
    mixpanel.initialize(); // noop
  });

  afterEach(function () {
    mixpanel.reset();
  });

  it('should have the right settings', function () {
    test(mixpanel)
      .name('Mixpanel')
      .assumesPageview()
      .readyOnLoad()
      .global('mixpanel')
      .option('cookieName', '')
      .option('nameTag', true)
      .option('pageview', false)
      .option('people', false)
      .option('token', '')
      .option('trackAllPages', false)
      .option('trackNamedPages', true);
  });

  describe('#initialize', function () {
    beforeEach(function () {
      mixpanel.load = sinon.spy(); // prevent loading
    });

    it('should create window.mixpanel', function () {
      assert(!window.mixpanel);
      mixpanel.initialize();
      assert(window.mixpanel);
    });

    it('should call #load', function () {
      mixpanel.initialize();
      assert(mixpanel.load.called);
    });
  });

  describe('#load', function () {
    it('should create window.mixpanel.config', function (done) {
      mixpanel.initialize();
      when(function () { return window.mixpanel && window.mixpanel.config; }, done);
    });

    it('should callback', function (done) {
      mixpanel.load(done);
    });
  });

  describe('#identify', function () {
    beforeEach(function () {
      mixpanel.initialize();
      window.mixpanel.identify = sinon.spy();
      window.mixpanel.register = sinon.spy();
      window.mixpanel.name_tag = sinon.spy();
      window.mixpanel.people.set = sinon.spy();
    });

    it('should send an id', function () {
      mixpanel.identify('id');
      assert(window.mixpanel.identify.calledWith('id'));
    });

    it('should send traits', function () {
      mixpanel.identify(null, { trait: true });
      assert(window.mixpanel.register.calledWith({ trait: true }));
    });

    it('should send an id and traits', function () {
      mixpanel.identify('id', { trait: true });
      assert(window.mixpanel.identify.calledWith('id'));
      assert(window.mixpanel.register.calledWith({ trait: true }));
    });

    it('should use an id as a name tag', function () {
      mixpanel.identify('id');
      assert(window.mixpanel.name_tag.calledWith('id'));
    });

    it('should prefer a username as a name tag', function () {
      mixpanel.identify('id', { username: 'username' });
      assert(window.mixpanel.name_tag.calledWith('username'));
    });

    it('should prefer an email as a name tag', function () {
      mixpanel.identify('id', {
        username: 'username',
        email: 'name@example.com'
      });
      assert(window.mixpanel.name_tag.calledWith('name@example.com'));
    });

    it('should send traits to Mixpanel People', function () {
      mixpanel.options.people = true;
      mixpanel.identify(null, { trait: true });
      assert(window.mixpanel.people.set.calledWith({ trait: true }));
    });

    it('should alias traits', function () {
      var date = new Date();
      mixpanel.identify(null, {
        created: date,
        email: 'name@example.com',
        firstName: 'first',
        lastName: 'last',
        lastSeen: date,
        name: 'name',
        username: 'username',
        phone: 'phone'
      });
      assert(window.mixpanel.register.calledWith({
        $created: date,
        $email: 'name@example.com',
        $first_name: 'first',
        $last_name: 'last',
        $last_seen: date,
        $name: 'name',
        $username: 'username',
        $phone: 'phone'
      }));
    });

    it('should alias traits to Mixpanel People', function () {
      mixpanel.options.people = true;
      var date = new Date();
      mixpanel.identify(null, {
        created: date,
        email: 'name@example.com',
        firstName: 'first',
        lastName: 'last',
        lastSeen: date,
        name: 'name',
        username: 'username',
        phone: 'phone'
      });
      assert(window.mixpanel.people.set.calledWith({
        $created: date,
        $email: 'name@example.com',
        $first_name: 'first',
        $last_name: 'last',
        $last_seen: date,
        $name: 'name',
        $username: 'username',
        $phone: 'phone'
      }));
    });
  });

  describe('#track', function () {
    beforeEach(function () {
      mixpanel.initialize();
      window.mixpanel.track = sinon.spy();
      window.mixpanel.people.track_charge = sinon.spy();
    });

    it('should send an event', function () {
      mixpanel.track('event');
      assert(window.mixpanel.track.calledWith('event'));
    });

    it('should send an event and properties', function () {
      mixpanel.track('event', { property: true });
      assert(window.mixpanel.track.calledWith('event', { property: true }));
    });

    it('should send a revenue property to Mixpanel People', function () {
      mixpanel.options.people = true;
      mixpanel.track('event', { revenue: 9.99 });
      assert(window.mixpanel.people.track_charge.calledWith(9.99));
    });
  });

  describe('#page', function () {
    beforeEach(function () {
      mixpanel.initialize();
      window.mixpanel.track = sinon.spy();
    });

    it('should not send an event by default', function () {
      mixpanel.page();
      assert(!window.mixpanel.track.called);
    });

    it('should track named pages', function () {
      mixpanel.options.trackNamedPages = true;
      mixpanel.page('Name', { property: true });
      assert(window.mixpanel.track.calledWith('Viewed Name Page', { property: true }));
    });

    it('should track all pages', function () {
      mixpanel.options.trackAllPages = true;
      mixpanel.page(null, { property: true });
      assert(window.mixpanel.track.calledWith('Loaded a Page', { property: true }));
    });
  });

  describe('#alias', function () {
    beforeEach(function () {
      mixpanel.initialize();
      window.mixpanel.alias = sinon.spy();
    });

    it('should send a new id', function () {
      mixpanel.alias('new');
      assert(window.mixpanel.alias.calledWith('new'));
    });

    it('should send a new and old id', function () {
      mixpanel.alias('new', 'old');
      assert(window.mixpanel.alias.calledWith('new', 'old'));
    });
  });

});