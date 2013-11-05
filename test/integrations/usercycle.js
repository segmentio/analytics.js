
describe('USERcycle', function () {

  var USERcycle = require('analytics/lib/integrations/usercycle');
  var assert = require('assert');
  var equal = require('equals');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var when = require('when');

  var usercycle;
  var settings = {
    key: 'x'
  };

  beforeEach(function () {
    usercycle = new USERcycle(settings);
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

  describe('#load', function () {
    it('should load the window._uc script', function (done) {
      usercycle.load();
      when(function () {
        return window._uc && window._uc.push !== Array.prototype.push;
      }, done);
    });
  });

  describe('#initialize', function () {
    it('should call #load', function () {
      usercycle.load = sinon.stub(usercycle, 'load');
      usercycle.initialize();
      assert(usercycle.load.called);
    });

    it('should set up the window._uc queue', function () {
      window._uc = [];
      window._uc.push = sinon.stub(window._uc, 'push');
      usercycle.initialize();
      assert(window._uc.push.calledWith(['_key', settings.key]));
    });
  });

  describe('#identify', function () {
    beforeEach(function () {
      usercycle.initialize();
      window._uc.push = sinon.stub(window._uc, 'push');
    });

    afterEach(function () {
      window._uc.push.restore();
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
      window._uc.push = sinon.stub(window._uc, 'push');
    });

    afterEach(function () {
      window._uc.push.restore();
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