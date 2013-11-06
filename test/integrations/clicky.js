
describe('Clicky', function () {

  var assert = require('assert');
  var Clicky = require('analytics/lib/integrations/clicky');
  var equal = require('equals');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var user = require('analytics/lib/user');
  var when = require('when');

  var clicky;
  var settings = {
    siteId: 100649848
  };

  beforeEach(function () {
    clicky = new Clicky(settings);
    clicky.initialize(); // noop
  });

  afterEach(function () {
    clicky.reset();
    user.reset();
  });

  it('should have the right settings', function () {
    test(clicky)
      .name('Clicky')
      .assumesPageview()
      .readyOnLoad()
      .global('clicky_site_ids')
      .option('siteId', null);
  });

  describe('#initialize', function () {
    it('should initialize the clicky global', function () {
      clicky.initialize();
      assert(equal(window.clicky_site_ids, [settings.siteId]));
    });

    it('should set custom data', function () {
      user.identify('id', { trait: true });
      clicky.identify = sinon.spy();
      clicky.initialize();
      assert(clicky.identify.calledWith('id', { trait: true }));
    });

    it('should call #load', function () {
      clicky.load = sinon.spy();
      clicky.initialize();
      assert(clicky.load.called);
    });
  });

  describe('#load', function () {
    it('should create window.clicky', function (done) {
      assert(!window.clicky);
      clicky.load();
      when(function () { return window.clicky; }, done);
    });

    it('should callback', function (done) {
      clicky.load(done);
    });
  });

  describe('#identify', function () {
    beforeEach(function (done) {
      clicky.initialize();
      clicky.once('ready', done);
    });

    it('should set an id', function () {
      clicky.identify('id', {});
      assert(equal(window.clicky_custom.session, { id: 'id' }));
    });

    it('should set traits', function () {
      clicky.identify(null, { trait: true });
      assert(equal(window.clicky_custom.session, { trait: true }));
    });

    it('should set an id and traits', function () {
      clicky.identify('id', { trait: true });
      assert(equal(window.clicky_custom.session, { id: 'id', trait: true }));
    });
  });

  describe('#track', function () {
    beforeEach(function (done) {
      clicky.initialize();
      clicky.once('ready', function () {
        window.clicky.goal = sinon.spy();
        done();
      });
    });

    it('should send an event', function () {
      clicky.track('event', {});
      assert(window.clicky.goal.calledWith('event'));
    });

    it('should send revenue', function () {
      clicky.track('event', { revenue: 42.99 });
      assert(window.clicky.goal.calledWith('event', 42.99));
    });
  });

  describe('#pageview', function () {
    beforeEach(function (done) {
      clicky.initialize();
      clicky.once('ready', function () {
        window.clicky.log = sinon.spy();
        done();
      });
    });

    it('should send a path and name', function () {
      clicky.page('Page', { path: '/path' });
      assert(window.clicky.log.calledWith('/path', 'Page'));
    });

    it('should fallback to title', function () {
      clicky.page(null, { title: 'Title', path: '/path' });
      assert(window.clicky.log.calledWith('/path', 'Title'));
    });
  });

});