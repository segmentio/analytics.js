
describe('Perfect Audience', function () {

  var PerfectAudience = require('analytics/lib/integrations/perfect-audience');
  var assert = require('assert');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var when = require('when');

  var pa;
  var settings = {
    siteId: '4ff6ade4361ed500020000a5'
  };

  beforeEach(function () {
    pa = new PerfectAudience(settings);
  });

  afterEach(function () {
    pa.reset();
  });

  it('should have the right settings', function () {
    test(pa)
      .name('Perfect Audience')
      .assumesPageview()
      .readyOnLoad()
      .global('_pa')
      .option('siteId', '');
  });

  describe('#load', function () {
    it('should create window._pa.track', function (done) {
      pa.load();
      when(function () { return window._pa && window._pa.track; }, done);
    });

    it('should callback', function (done) {
      pa.load(done);
    });
  });

  describe('#initialize', function () {
    it('should call #load', function () {
      pa.load = sinon.spy();
      pa.initialize();
      assert(pa.load.called);
    });

    it('should create the window._pa object', function () {
      assert(!window._pa);
      pa.initialize();
      assert(window._pa);
    });
  });

  describe('#track', function () {
    beforeEach(function (done) {
      pa.initialize();
      // wait for ready to ensure that calls aren't queued
      pa.on('ready', function () {
        window._pa.track = sinon.spy();
        done();
      });
    });

    it('should send an event', function () {
      pa.track('event');
      assert(window._pa.track.calledWith('event', undefined));
    });

    it('should send an event and properties', function () {
      pa.track('event', { property: true });
      assert(window._pa.track.calledWith('event', { property: true }));
    });
  });
});