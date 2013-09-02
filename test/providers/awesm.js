
describe('awe.sm', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , equal = require('equals')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  apiKey: 'x',
  events: {
    'Test': 'goal_1'
  }
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ 'awe.sm': settings });
  setTimeout(function () {
    debugger;
  }, 5000);
});

describe('#intialize', function () {
  it('should ready', function () {
    assert(this.spy.called);
  });

  it('should store options with defaults', function () {
    var options = analytics._providers[0].options;
    assert(options.apiKey == settings.apiKey);
    assert(equal(options.events, settings.events));
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

  it('should accept a revenue property', function () {
    analytics.track('Test', { revenue: 42.99 });
    assert(this.spy.calledWith('goal_1', 4299));
  });
});

});