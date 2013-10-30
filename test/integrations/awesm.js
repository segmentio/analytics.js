
describe('awe.sm', function () {

  var settings = {
    apiKey: '5c8b1a212434c2153c2f2c2f2c765a36140add243bf6eae876345f8fd11045d9',
    events: { Test: 'goal_1' }
  };

  var assert = require('assert');
  var Awesm = require('analytics/lib/integrations/awesm');
  var awesm = new Awesm(settings);
  var equal = require('equals');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var when = require('when');

  afterEach(function () {
    awesm.reset();
  });

  it('should have the right settings', function () {
    test(awesm)
      .name('awe.sm')
      .assumesPageview()
      .readyOnLoad()
      .global('AWESM')
      .option('apiKey', '')
      .option('events', {});
  });

  describe('#load', function () {
    it('should set window.AWESM._exists', function (done) {
      assert(!window.AWESM);
      awesm.load();
      when(function () { return window.AWESM && window.AWESM._exists; }, done);
    });

    it('should callback', function (done) {
      awesm.load(done);
    });
  });

  describe('#initialize', function () {
    var load, global;

    beforeEach(function () {
      load = sinon.spy(awesm, 'load');
      global = window.AWESM;
      window.AWESM = undefined;
    });

    afterEach(function () {
      load.restore();
      window.AWESM = global;
    });

    it('should pass options to awe.sm', function () {
      awesm.initialize();
      assert(window.AWESM.api_key == settings.apiKey);
    });

    it('should call #load', function () {
      awesm.initialize();
      assert(load.called);
    });
  });

  describe('#track', function () {
    var convert;

    beforeEach(function () {
      convert = sinon.spy(window.AWESM, 'convert');
    });

    afterEach(function () {
      convert.restore();
    });

    it('should convert an event to a goal', function () {
      awesm.track('Test', {});
      assert(convert.calledWith('goal_1', 0));
    });

    it('should not convert an unknown event', function () {
      awesm.track('Unknown', {});
      assert(!convert.called);
    });

    it('should accept a value property', function () {
      awesm.track('Test', { value: 1 });
      assert(convert.calledWith('goal_1', 1));
    });

    it('should prefer a revenue property', function () {
      awesm.track('Test', { value: 1, revenue: 42.99 });
      assert(convert.calledWith('goal_1', 4299));
    });
  });

});