
describe('Klaviyo', function () {

  var assert = require('assert');
  var Klaviyo = require('analytics/lib/integrations/klaviyo');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var when = require('when');

  var klaviyo;
  var settings = {
    apiKey: 'x'
  };

  beforeEach(function () {
    klaviyo = new Klaviyo(settings);
    klaviyo.initialize(); // noop
  });

  afterEach(function () {
    klaviyo.reset();
  });

  it('should have the right settings', function () {
    test(klaviyo)
      .name('Klaviyo')
      .assumesPageview()
      .readyOnInitialize()
      .global('_learnq')
      .option('apiKey', '');
  });

  describe('#initialize', function () {
    beforeEach(function () {
      klaviyo.load = sinon.spy(); // prevent loading
    });

    it('should create window._learnq', function () {
      assert(!window._learnq);
      klaviyo.initialize();
      assert(window._learnq instanceof Array);
    });

    it('should push an api key', function () {
      window._learnq = [];
      window._learnq.push = sinon.spy();
      klaviyo.initialize();
      assert(window._learnq.push.calledWith(['account', settings.apiKey]));
    });

    it('should call #load', function () {
      klaviyo.initialize();
      assert(klaviyo.load.called);
    });
  });

  describe('#load', function () {
    it('should replace window._learnq.push', function (done) {
      window._learnq = [];
      var push = window._learnq.push;
      klaviyo.load();
      when(function () { return window._learnq.push !== push; }, done);
    });

    it('should callback', function (done) {
      klaviyo.load(done);
    });
  });

  describe('#identify', function () {
    beforeEach(function () {
      klaviyo.initialize();
      window._learnq.push = sinon.spy();
    });

    it('should send an id', function () {
      klaviyo.identify('id');
      assert(window._learnq.push.calledWith(['identify', { $id: 'id' }]));
    });

    it('shouldnt send just traits', function () {
      klaviyo.identify(null, { trait: true });
      assert(!window._learnq.push.called);
    });

    it('should send an id and traits', function () {
      klaviyo.identify('id', { trait: true });
      assert(window._learnq.push.calledWith(['identify', {
        $id: 'id',
        trait: true
      }]));
    });

    it('should alias traits', function () {
      klaviyo.identify('id', {
        email: 'name@example.com',
        firstName: 'first',
        lastName: 'last',
        phone: 'phone',
        title: 'title'
      });
      assert(window._learnq.push.calledWith(['identify', {
        $id: 'id',
        $email: 'name@example.com',
        $first_name: 'first',
        $last_name: 'last',
        $phone_number: 'phone',
        $title: 'title'
      }]));
    });
  });

  describe('#group', function () {
    beforeEach(function () {
      klaviyo.initialize();
      window._learnq.push = sinon.spy();
    });

    it('should send a name', function () {
      klaviyo.group('id', { name: 'name' });
      assert(window._learnq.push.calledWith(['identify', { $organization: 'name' }]));
    });
  });

  describe('#track', function () {
    beforeEach(function () {
      klaviyo.initialize();
      window._learnq.push = sinon.spy();
    });

    it('should send an event', function () {
      klaviyo.track('event');
      assert(window._learnq.push.calledWith(['track', 'event', {}]));
    });

    it('should send an event and properties', function () {
      klaviyo.track('event', { property: true });
      assert(window._learnq.push.calledWith(['track', 'event', { property: true }]));
    });
  });

});