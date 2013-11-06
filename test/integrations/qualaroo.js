
describe('Qualaroo', function () {

  var assert = require('assert');
  var Qualaroo = require('analytics/lib/integrations/qualaroo');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var when = require('when');

  var qualaroo;
  var settings = {
    customerId: '47517',
    siteToken: '9Fd'
  };

  beforeEach(function () {
    qualaroo = new Qualaroo(settings);
    qualaroo.initialize(); // noop
  });

  afterEach(function () {
    qualaroo.reset();
  });

  it('should have the right settings', function () {
    test(qualaroo)
      .name('Qualaroo')
      .assumesPageview()
      .readyOnInitialize()
      .global('_kiq')
      .option('customerId', '')
      .option('siteToken', '')
      .option('track', false);
  });

  describe('#load', function () {
    it('should create window._kiq', function (done) {
      assert(!window._kiq);
      qualaroo.load();
      when(function () { return window._kiq; }, done);
    });

    it('should callback', function (done) {
      qualaroo.load(done);
    });
  });

  describe('#initialize', function () {
    it('should call #load', function () {
      qualaroo.load = sinon.spy();
      qualaroo.initialize();
      assert(qualaroo.load.called);
    });
  });

  describe('#identify', function () {
    beforeEach(function () {
      qualaroo.initialize();
      window._kiq = [];
      window._kiq.push = sinon.spy();
    });

    it('should send an id', function () {
      qualaroo.identify('id');
      assert(window._kiq.push.calledWith(['identify', 'id']));
    });

    it('should send traits', function () {
      qualaroo.identify(null, { trait: true });
      assert(window._kiq.push.calledWith(['set', { trait: true }]));
    });

    it('should send an id and traits', function () {
      qualaroo.identify('id', { trait: true });
      assert(window._kiq.push.calledWith(['identify', 'id']));
      assert(window._kiq.push.calledWith(['set', { trait: true }]));
    });

    it('should prefer an email', function () {
      qualaroo.identify('id', { email: 'name@example.com' });
      assert(window._kiq.push.calledWith(['identify', 'name@example.com']));
    });
  });

  describe('#track', function () {
    beforeEach(function () {
      qualaroo.initialize();
      window._kiq = [];
      window._kiq.push = sinon.spy();
    });

    it('should not send anything by default', function () {
      qualaroo.track('event');
      assert(!window._kiq.push.called);
    });

    it('should set an event trait', function () {
      qualaroo.options.track = true;
      qualaroo.track('event');
      assert(window._kiq.push.calledWith(['set', { 'Triggered: event': true }]));
    });
  });
});