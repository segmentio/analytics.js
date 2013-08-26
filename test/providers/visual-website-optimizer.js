describe('Visual Website Optimizer', function () {

  var analytics = require('analytics')
    , tick = require('next-tick');

// Set up fake VWO data to simulate the replay.
window._vwo_exp_ids = [1];
window._vwo_exp = {
  1 : {
    comb_n : {
      1 : 'Variation'
    },
    combination_chosen : 1
  }
};

describe('initialize', function () {
  this.timeout(10000);

  it('should call ready', function (done) {
    var spy = sinon.spy();
    analytics.ready(spy);
    analytics.initialize({ 'Visual Website Optimizer' : true });

    tick(function () {
      expect(spy.called).to.be(true);
      done();
    });
  });

  it('should replay when the library loads', function (done) {
    return done();

    var identify = sinon.spy(analytics, 'identify');
    analytics.initialize({ 'Visual Website Optimizer' : true });
    setTimeout(function () {
      expect(identify.calledWith({'Experiment: 1' : 'Variation'})).to.be(true);
      done();
    }, 9999);
  });
});

});