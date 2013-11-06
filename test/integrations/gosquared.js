
describe('GoSquared', function () {

  var assert = require('assert');
  var equal = require('equals');
  var GoSquared = require('analytics/lib/integrations/gosquared');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var user = require('analytics/lib/user');
  var when = require('when');

  var gosquared;
  var settings = {
    siteToken: 'x'
  };

  beforeEach(function () {
    gosquared = new GoSquared(settings);
    gosquared.initialize(); // noop
  });

  afterEach(function () {
    gosquared.reset();
    user.reset();
  });

  it('should have the right settings', function () {
    test(gosquared)
      .name('GoSquared')
      .assumesPageview()
      .readyOnLoad()
      .global('GoSquared')
      .option('siteToken', '');
  });

  describe('#initialize', function () {
    it('should initialize the gosquared globals', function () {
      assert(!window.GoSquared);
      gosquared.initialize();
      assert(equal(window.GoSquared, {
        acct: settings.siteToken,
        q: [],
        Visitor: {}
      }));
    });

    it('should store the load time', function () {
      assert(!window._gstc_lt);
      gosquared.initialize();
      assert('number' === typeof window._gstc_lt);
    });

    it('should identify an existing user', function () {
      user.identify('id', { trait: true });
      gosquared.identify = sinon.spy();
      gosquared.initialize();
      assert(gosquared.identify.calledWith('id', { trait: true }));
    });

    it('should call #load', function () {
      gosquared.load = sinon.spy();
      gosquared.initialize();
      assert(gosquared.load.called);
    });
  });

  describe('#load', function () {
    it('should create window._gs', function (done) {
      assert(!window._gs);
      gosquared.load();
      when(function () { return window._gs; }, done);
    });

    it('should callback', function (done) {
      gosquared.load(done);
    });
  });

  describe('#identify', function () {
    beforeEach(function (done) {
      gosquared.once('ready', done);
      gosquared.initialize();
    });

    it('should set an id', function () {
      gosquared.identify('id');
      assert(window.GoSquared.UserName == 'id');
      assert(window.GoSquared.VisitorName == 'id');
    });

    it('should set traits', function () {
      gosquared.identify(null, { trait: true });
      assert(equal(window.GoSquared.Visitor, { trait: true }));
    });

    it('should set an id and traits', function () {
      gosquared.identify('id', { trait: true });
      assert(window.GoSquared.UserName == 'id');
      assert(window.GoSquared.VisitorName == 'id');
      assert(equal(window.GoSquared.Visitor, { userID: 'id', trait: true }));
    });

    it('should prefer an email for visitor name', function () {
      gosquared.identify('id', {
        email: 'email@example.com',
        username: 'username'
      });
      assert(window.GoSquared.VisitorName == 'email@example.com');
    });

    it('should also prefer a username for visitor name', function () {
      gosquared.identify('id', { username: 'username' });
      assert(window.GoSquared.VisitorName == 'username');
    });
  });

  describe('#track', function () {
    beforeEach(function (done) {
      gosquared.once('ready', function () {
        window.GoSquared.q.push = sinon.spy();
        done();
      });
      gosquared.initialize();
    });

    it('should send an event', function () {
      gosquared.track('event');
      assert(window.GoSquared.q.push.calledWith(['TrackEvent', 'event', undefined]));
    });

    it('should send an event and properties', function () {
      gosquared.track('event', { property: true });
      assert(window.GoSquared.q.push.calledWith(['TrackEvent', 'event', { property: true }]));
    });
  });

  describe('#page', function () {
    beforeEach(function (done) {
      gosquared.once('ready', function () {
        window.GoSquared.q.push = sinon.spy();
        done();
      });
      gosquared.initialize();
    });
    it('should send a pageview', function () {
      gosquared.page();
      assert(window.GoSquared.q.push.calledWith(['TrackView', undefined, undefined]));
    });

    it('should send page properties', function () {
      gosquared.page('name', { path: '/path' });
      assert(window.GoSquared.q.push.calledWith(['TrackView', '/path', 'name']));
    });
  });

});