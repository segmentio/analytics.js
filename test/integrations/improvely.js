
describe('Improvely', function () {

  var assert = require('assert');
  var Improvely = require('analytics/lib/integrations/improvely');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var when = require('when');

  var improvely;
  var settings = {
    domain: 'demo',
    projectId: 1
  };

  beforeEach(function () {
    improvely = new Improvely(settings);
    improvely.initialize(); // noop
  });

  afterEach(function () {
    improvely.reset();
    user.reset();
  });

  it('should have the right settings', function () {
    test(improvely)
      .name('Improvely')
      .assumesPageview()
      .readyOnInitialize()
      .global('_improvely')
      .global('improvely')
      .option('domain', '')
      .option('projectId', null);
  });

  describe('#initialize', function () {
    beforeEach(function () {
      improvely.load = sinon.spy(); // prevent loading
    });

    it('should create window._improvely', function () {
      assert(!window._improvely);
      improvely.initialize();
      assert(window._improvely instanceof Array);
    });

    it('should create window.improvely', function () {
      assert(!window.improvely);
      improvely.initialize();
      assert(window.improvely);
    });

    it('should init with a domain and project id', function () {
      improvely.initialize();
      assert(equal(window._improvely[0], ['init', settings.domain, settings.projectId]));
    });

    it('should call #load', function () {
      improvely.initialize();
      assert(improvely.load.called);
    });
  });

  describe('#load', function () {
    it('should create window.improvely', function (done) {
      assert(!window.improvely);
      improvely.load();
      when(function () { return window.improvely.identify; }, done);
    });

    it('should callback', function (done) {
      improvely.load(done);
    });
  });

  describe('#identify', function () {
    beforeEach(function () {
      improvely.initialize();
      window.improvely.label = sinon.spy();
    });

    it('should send an id', function () {
      improvely.identify('id');
      assert(window.improvely.label.calledWith('id'));
    });
  });

  describe('#track', function () {
    beforeEach(function () {
      improvely.initialize();
      window.improvely.goal = sinon.spy();
    });

    it('should send an event', function () {
      improvely.track('event');
      assert(window.improvely.goal.calledWith({ type: 'event' }));
    });

    it('should send an event and properties', function () {
      improvely.track('event', { property: true });
      assert(window.improvely.goal.calledWith({
        type: 'event',
        property: true
      }));
    });

    it('should alias revenue to amount', function () {
      improvely.track('event', { revenue: 42.99 });
      assert(window.improvely.goal.calledWith({
        type: 'event',
        amount: 42.99
      }));
    });
  });

});