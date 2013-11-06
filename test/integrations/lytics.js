
describe('Lytics', function () {

  var assert = require('assert');
  var Lytics = require('analytics/lib/integrations/lytics');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var tick = require('next-tick');
  var when = require('when');

  var lytics;
  var settings = {
    cid: 'x',
    cookie: 'lytics_cookie'
  };

  beforeEach(function () {
    lytics = new Lytics(settings);
    lytics.initialize(); // noop
  });

  afterEach(function () {
    lytics.reset();
  });

  it('should have the right settings', function () {
    test(lytics)
      .name('Lytics')
      .assumesPageview()
      .readyOnInitialize()
      .global('jstag')
      .option('cid', '')
      .option('cookie', 'seerid')
      .option('delay', 200)
      .option('initialPageview', true)
      .option('sessionTimeout', 1800)
      .option('url', '//c.lytics.io');
  });

  describe('#initialize', function () {
    it('should create window.jstag', function () {
      assert(!window.jstag);
      lytics.initialize();
      assert(window.jstag);
    });

    it('should call #load', function () {
      lytics.load = sinon.spy();
      lytics.initialize();
      assert(lytics.load.called);
    });
  });

  describe('#load', function () {
    it('should create window.jstag.bind', function (done) {
      assert(!window.jstag);
      lytics.load();
      when(function () { return window.jstag && window.jstag.bind; }, done);
    });

    it('should callback', function (done) {
      lytics.load(done);
    });
  });

  describe('#identify', function () {
    beforeEach(function () {
      lytics.initialize();
      window.jstag.send = sinon.spy();
    });

    it('should send an id', function () {
      lytics.identify('id');
      assert(window.jstag.send.calledWith({ _uid: 'id' }));
    });

    it('should send traits', function () {
      lytics.identify(null, { trait: true });
      assert(window.jstag.send.calledWith({ trait: true }));
    });

    it('should send an id and traits', function () {
      lytics.identify('id', { trait: true });
      assert(window.jstag.send.calledWith({ _uid: 'id', trait: true }));
    });
  });

  describe('#track', function () {
    beforeEach(function () {
      lytics.initialize();
      window.jstag.send = sinon.spy();
    });

    it('should send an event', function () {
      lytics.track('event');
      assert(window.jstag.send.calledWith({ _e: 'event' }));
    });

    it('should send an event and properties', function () {
      lytics.track('event', { property: true });
      assert(window.jstag.send.calledWith({ _e: 'event', property: true }));
    });
  });

  describe('#page', function () {
    beforeEach(function () {
      lytics.initialize();
      window.jstag.send = sinon.spy();
    });

    it('should call send', function () {
      lytics.page(null, { property: true });
      assert(window.jstag.send.calledWith({ property: true }));
    });
  });

});