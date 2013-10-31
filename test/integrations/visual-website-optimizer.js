
describe('Visual Website Optimizer', function () {

  var VWO = require('analytics/lib/integrations/visual-website-optimizer');
  var assert = require('assert');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var tick = require('next-tick');
  var when = require('when');

  var vwo;
  var settings = {};

  beforeEach(function () {
    // set up fake VWO data to simulate the replay
    window._vwo_exp_ids = [1];
    window._vwo_exp = { 1: { comb_n: { 1: 'Variation' }, combination_chosen: 1 } };
    vwo = new VWO(settings);
  });

  afterEach(function () {
    vwo.reset();
  });

  it('should have the right settings', function () {
    test(vwo)
      .readyOnInitialize()
      .option('replay', true);
  });

  describe('#initialize', function () {
    it('should call replay', function () {
      vwo.replay = sinon.stub(vwo, 'replay');
      vwo.initialize();
      assert(vwo.replay.called);
      vwo.replay.restore();
    });

    it('should replay variation data', function (done) {
      throw new Error('to be implemented once analytics is removed');
    });
  });

});