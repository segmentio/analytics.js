
describe('HubSpot', function () {

  var assert = require('assert');
  var equal = require('equals');
  var HubSpot = require('analytics/lib/integrations/hubspot');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var when = require('when');

  var hubspot;
  var settings = {
    portalId: 62515
  };

  beforeEach(function () {
    hubspot = new HubSpot(settings);
    hubspot.initialize(); // noop
  });

  afterEach(function () {
    hubspot.reset();
  });

  it('should have the right settings', function () {
    test(hubspot)
      .name('HubSpot')
      .assumesPageview()
      .readyOnInitialize()
      .global('_hsq')
      .option('portalId', null);
  });

  describe('#initialize', function () {
    beforeEach(function () {
      hubspot.load = sinon.spy(); // prevent loading
    });

    it('should create window._hsq', function () {
      assert(!window._hsq);
      hubspot.initialize();
      assert(window._hsq instanceof Array);
    });

    it('should call #load', function () {
      hubspot.initialize();
      assert(hubspot.load.called);
    });
  });

  describe('#load', function () {
    it('should replace window._hsq.push', function (done) {
      window._hsq = [];
      var push = window._hsq.push;
      hubspot.load();
      when(function () { return window._hsq.push !== push; }, done);
    });

    it('should callback', function (done) {
      hubspot.load(done);
    });
  });

  describe('#identify', function () {
    beforeEach(function () {
      hubspot.initialize();
      window._hsq.push = sinon.spy();
    });

    it('should not send traits without an email', function () {
      hubspot.identify('id');
      assert(!window._hsq.push.called);
    });

    it('should send traits with an email', function () {
      hubspot.identify(null, { email: 'name@example.com' });
      assert(window._hsq.push.calledWith(['identify', { email: 'name@example.com' }]));
    });

    it('should send an id and traits with an email', function () {
      hubspot.identify('id', { email: 'name@example.com' });
      assert(window._hsq.push.calledWith(['identify', {
        id: 'id',
        email: 'name@example.com'
      }]));
    });
  });

  describe('#track', function () {
    beforeEach(function () {
      hubspot.initialize();
      window._hsq.push = sinon.spy();
    });

    it('should send an event', function () {
      hubspot.track('event');
      assert(window._hsq.push.calledWith(['trackEvent', 'event', undefined]));
    });

    it('should send an event and properties', function () {
      hubspot.track('event', { property: true });
      assert(window._hsq.push.calledWith(['trackEvent', 'event', { property: true }]));
    });
  });

  describe('#page', function () {
    beforeEach(function () {
      hubspot.initialize();
      window._hsq.push = sinon.spy();
    });

    it('should send a page view', function () {
      hubspot.page();
      assert(window._hsq.push.calledWith(['_trackPageview']));
    });
  });

});