
describe('Clicky', function () {

  var settings = {
    siteId: 100649848
  };

  var assert = require('assert');
  var Clicky = require('analytics/lib/integrations/clicky');
  var clicky = new Clicky(settings);
  var equal = require('equals');
  var sinon = require('sinon');
  var user = require('analytics/lib/user');
  var when = require('when');

  describe('#name', function () {
    it('Clicky', function () {
      assert(clicky.name == 'Clicky');
    });
  });

  describe('#defaults', function () {
    it('siteId', function () {
      assert(clicky.defaults.siteId === null);
    });
  });

  describe('#exists', function () {
    after(function () {
      window.clicky_site_ids = undefined;
    });

    it('should check for window.clicky_site_ids', function () {
      window.clicky_site_ids = undefined;
      assert(!clicky.exists());
      window.clicky_site_ids = [];
      assert(clicky.exists());
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

  describe('#initialize', function () {
    var load;

    beforeEach(function () {
      load = sinon.spy(clicky, 'load');
    });

    afterEach(function () {
      user.reset();
      load.restore();
      window.clicky_site_ids = undefined;
      window.clicky_custom = undefined;
    });

    it('should create window.clicky_site_ids', function () {
      assert(!window.clicky_site_ids);
      clicky.initialize();
      assert(window.clicky_site_ids instanceof Array);
    });

    it('should extend the window.clicky_custom.session', function () {
      window.clicky_custom = { session: { existing: true }};
      user.identify('id', { trait: true });
      clicky.initialize();
      assert(equal(window.clicky_custom.session, {
        id: 'id',
        trait: true,
        existing: true
      }));
    });

    it('should call #load', function () {
      clicky.initialize();
      assert(load.called);
    });
  });

  describe('#identify', function () {
    before(function (done) {
      clicky.initialize();
      clicky.on('ready', done);
    });

    afterEach(function () {
      user.reset();
      window.clicky_custom.session = undefined;
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
    var goal;

    beforeEach(function () {
      goal = sinon.spy(window.clicky, 'goal');
    });

    afterEach(function () {
      goal.restore();
    });

    it('should send an event', function () {
      clicky.track('event', {});
      assert(goal.calledWith('event'));
    });

    it('should send revenue', function () {
      clicky.track('event', { revenue: 42.99 });
      assert(goal.calledWith('event', 42.99));
    });
  });

  describe('#pageview', function () {
    var log;

    beforeEach(function () {
      log = sinon.spy(window.clicky, 'log');
    });

    afterEach(function () {
      log.restore();
    });

    it('should send a path and name', function () {
      clicky.page('Page', { path: '/path' });
      assert(log.calledWith('/path', 'Page'));
    });

    it('should fallback to title', function () {
      clicky.page(null, { title: 'Title', path: '/path' });
      assert(log.calledWith('/path', 'Title'));
    });
  });

});