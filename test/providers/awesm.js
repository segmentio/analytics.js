
describe('awe.sm', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , equal = require('equals')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  apiKey: '5c8b1a212434c2153c2f2c2f2c765a36140add243bf6eae876345f8fd11045d9',
  events: {
    'Test': 'goal_1'
  }
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ 'awe.sm': settings });
  this.integration = analytics._providers[0];
  this.options = this.integration.options;
  when(function () { return window.AWESM._exists; }, done);
});

describe('#intialize', function () {
  it('should ready', function () {
    assert(this.spy.called);
  });

  it('should store options with defaults', function () {
    assert(this.options.apiKey == settings.apiKey);
    assert(equal(this.options.events, settings.events));
  });

  it('should pass options to awe.sm', function () {
    assert(window.AWESM.api_key == settings.apiKey);
  });
});

describe('#track', function () {
  beforeEach(function () {
    this.spy = sinon.spy(window.AWESM, 'convert');
  });

  afterEach(function () {
    this.spy.restore();
  });

  it('should convert an event to a goal', function () {
    analytics.track('Test');
    assert(this.spy.calledWith('goal_1', 0));
  });

  it('shouldnt convert an unknown event', function () {
    analytics.track('Unknown');
    assert(!this.spy.called);
  });

  it('should accept a value property', function () {
    analytics.track('Test', { value: 1 });
    assert(this.spy.calledWith('goal_1', 1));
  });

  it('should prefer a revenue property', function () {
    analytics.track('Test', { value: 1, revenue: 42.99 });
    assert(this.spy.calledWith('goal_1', 4299));
  });
});

});