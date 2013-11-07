
describe('USERcycle', function () {

  var assert = require('assert');
  var equal = require('equals');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var USERcycle = require('analytics/lib/integrations/usercycle');
  var when = require('when');

  var usercycle;
  var settings = {
    key: 'x'
  };

  beforeEach(function () {
    usercycle = new USERcycle(settings);
    usercycle.initialize(); // noop
  });

  afterEach(function () {
    usercycle.reset();
  });

  it('should have the right settings', function () {
    test(usercycle)
      .name('USERcycle')
      .assumesPageview()
      .readyOnInitialize()
      .global('_uc')
      .option('key', '');
  });

  describe('#initialize', function () {
    beforeEach(function () {
      usercycle.load = sinon.spy();
    });

    it('should push a key onto window._uc', function () {
      usercycle.initialize();
      assert(equal(window._uc[0], ['_key', settings.key]));
    });

    it('should call #load', function () {
      usercycle.initialize();
      assert(usercycle.load.called);
    });
  });

  describe('#load', function () {
    beforeEach(function () {
      sinon.stub(usercycle, 'load');
      usercycle.initialize();
      usercycle.load.restore();
    });

    it('should load the window._uc script', function (done) {
      usercycle.load(function (err) {
        if (err) return done(err);
        assert(window._uc.push !== Array.prototype.push);
        done();
      });
    });
  });

  describe('#identify', function () {
    beforeEach(function () {
      usercycle.initialize();
      window._uc.push = sinon.spy();
    });

    it('should send an id', function () {
      usercycle.identify('id');
      assert(window._uc.push.calledWith(['uid', 'id']));
      assert(window._uc.push.calledWith(['action', 'came_back', undefined]));
    });

    it('should send traits', function () {
      usercycle.identify(null, { trait: true });
      assert(window._uc.push.calledWith(['action', 'came_back', {
        trait: true
      }]));
    });

    it('should send an id and traits', function () {
      usercycle.identify('id', { trait: true });
      assert(window._uc.push.calledWith(['uid', 'id']));
      assert(window._uc.push.calledWith(['action', 'came_back', {
        trait: true
      }]));
    });
  });

  describe('#track', function () {
    beforeEach(function () {
      usercycle.initialize();
      window._uc.push = sinon.spy();
    });

    it('should send an event', function () {
      usercycle.track('event');
      assert(window._uc.push.calledWith(['action', 'event', undefined]));
    });

    it('should send an event and properties', function () {
      usercycle.track('event', { property: true });
      assert(window._uc.push.calledWith(['action', 'event', {
        property: true
      }]));
    });
  });
});