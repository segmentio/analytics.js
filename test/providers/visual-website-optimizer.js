
describe('Visual Website Optimizer', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , sinon = require('sinon')
  , tick = require('next-tick')
  , when = require('when');

var settings = {};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  this.identifySpy = sinon.spy(analytics, 'identify');
  analytics.ready(this.spy);
  analytics.initialize({ 'Visual Website Optimizer': settings });

  // set up fake VWO data to simulate the replay
  window._vwo_exp_ids = [1];
  window._vwo_exp = { 1: { comb_n: { 1: 'Variation' }, combination_chosen: 1 } };

  this.integration = analytics._integrations['Visual Website Optimizer'];
  this.options = this.integration.options;
  tick(done);
});

after(function () {
  this.identifySpy.restore();
});

describe('#defaults', function () {
  it('replay', function () {
    assert(this.integration.defaults.replay === true);
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options with defaults', function () {
    assert(this.options.replay == this.integration.defaults.replay);
  });

  it('should replay variation data', function (done) {
    done(); // TODO

    this.timeout(10000);
    var spy = this.identifySpy;
    when(function () { return spy.called; }, function () {
      assert(spy.calledWith({
        'Experiment 1': 'Variation'
      }));
      done();
    });
  });
});

});