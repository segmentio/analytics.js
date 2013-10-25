
describe('awe.sm', function () {

  var Awesm = require('analytics/lib/integrations/awesm');
  var assert = require('assert');
  var equal = require('equals');
  var sinon = require('sinon');
  var when = require('when');
  var awesm;

  this.timeout(10000);

  var settings = {
    apiKey: '5c8b1a212434c2153c2f2c2f2c765a36140add243bf6eae876345f8fd11045d9',
    events: {
      'Test': 'goal_1'
    }
  };

  beforeEach(function () {
    awesm = new Awesm(settings, function () {});
  });

  describe('#name', function () {
    it('awe.sm', function () {
      assert(awesm.name == 'awe.sm');
    });
  });

  describe('#defaults', function () {
    it('apiKey', function () {
      assert(awesm.defaults.apiKey === '');
    });

    it('events', function () {
      assert(equal(awesm.defaults.events, {}));
    });
  });

  describe('#load', function () {
    it('should set the `window.AWESM._exists` var', function (done) {
      awesm.load();
      when(function () { return window.AWESM && window.AWESM._exists; }, done);
    });

    it('should call the callback', function (done) {
      awesm.load(done);
    });
  });

  describe('#intialize', function () {
    it('should ready', function (done) {
      var spy = sinon.spy();
      awesm = new Awesm(settings, spy);
      awesm.initialize();
      when(function () { return spy.called; }, done);
    });

    it('should store options with defaults', function () {
      awesm.initialize();
      assert(awesm.options.apiKey == settings.apiKey);
      assert(equal(awesm.options.events, settings.events));
    });

    it('should pass options to awe.sm', function () {
      awesm.initialize();
      assert(window.AWESM.api_key == settings.apiKey);
    });
  });

  describe('#track', function () {
    var spy;

    beforeEach(function () {
      spy = sinon.spy(window.AWESM, 'convert');
    });

    afterEach(function () {
      spy.restore();
    });

    it('should convert an event to a goal', function () {
      awesm.track('Test', {});
      assert(spy.calledWith('goal_1', 0));
    });

    it('shouldnt convert an unknown event', function () {
      awesm.track('Unknown', {});
      assert(!spy.called);
    });

    it('should accept a value property', function () {
      awesm.track('Test', { value: 1 });
      assert(spy.calledWith('goal_1', 1));
    });

    it('should prefer a revenue property', function () {
      awesm.track('Test', { value: 1, revenue: 42.99 });
      assert(spy.calledWith('goal_1', 4299));
    });
  });

});