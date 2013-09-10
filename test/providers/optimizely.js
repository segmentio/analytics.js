
describe('Optimizely', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , sinon = require('sinon')
  , tick = require('next-tick');

var settings = {};

before(function (done) {
  // setup fake experiment data for replay
  window.optimizely.data = {
    experiments : { 0 : { name : 'Test' } },
    state : { variationNamesMap : { 0 : 'Variation' } }
  };

  this.timeout(10000);
  this.spy = sinon.spy();
  this.identifySpy = sinon.spy(analytics, 'identify');
  analytics.ready(this.spy);
  analytics.initialize({ Optimizely: settings });
  this.integration = analytics._integrations.Optimizely;
  this.options = this.integration.options;
  tick(done);
});

after(function () {
  this.identifySpy.restore();
});

describe('#defaults', function () {
  it('variations', function () {
    assert(this.integration.defaults.variations === true);
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options', function () {
    assert(this.options.variations == this.integration.defaults.variations);
  });

  it('should replay variation traits', function () {
    assert(this.identifySpy.calledWith({
      'Experiment: Test': 'Variation'
    }));
  });
});

describe('#track', function () {
  beforeEach(function () {
    this.stub = sinon.stub(window.optimizely, 'push');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should send an event', function () {
    analytics.track('event');
    assert(this.stub.calledWith(['trackEvent', 'event', {}]));
  });

  it('should send an event and properties', function () {
    analytics.track('event', { property: true });
    assert(this.stub.calledWith(['trackEvent', 'event', { property: true }]));
  });

  it('should change revenue to cents', function () {
    analytics.track('event', { revenue: 9.99 });
    assert(this.stub.calledWith(['trackEvent', 'event', { revenue: 999 }]));
  });
});

});