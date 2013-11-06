
describe('Gauges', function () {

  var assert = require('assert');
  var equal = require('equals');
  var Gauges = require('analytics/lib/integrations/gauges');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var when = require('when');

  var gauges;
  var settings = {
    siteId: 'x'
  };

  beforeEach(function () {
    gauges = new Gauges(settings);
    gauges.initialize(); // noop
  });

  afterEach(function () {
    gauges.reset();
  });

  it('should have the right settings', function () {
    test(gauges)
      .name('Gauges')
      .assumesPageview()
      .readyOnInitialize()
      .global('_gauges')
      .option('siteId', '');
  });

  describe('#initialize', function () {
    it('should create the gauges queue', function () {
      assert(!window._gauges);
      gauges.initialize();
      assert(window._gauges instanceof Array);
    });

    it('should call #load', function () {
      gauges.load = sinon.spy();
      gauges.initialize();
      assert(gauges.load.called);
    });
  });

  describe('#load', function () {
    it('should replace the gauges queue', function (done) {
      window._gauges = [];
      var push = window._gauges.push;
      gauges.load();
      when(function () { return window._gauges.push !== push; }, done);
    });

    it('should callback', function (done) {
      gauges.load(done);
    });
  });

  describe('#page', function () {
    beforeEach(function () {
      gauges.initialize();
      window._gauges.push = sinon.spy();
    });

    it('should send a page view', function () {
      gauges.page();
      assert(window._gauges.push.calledWith(['track']));
    });
  });

});