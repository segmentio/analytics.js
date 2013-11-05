
describe('Crazy Egg', function () {

  var assert = require('assert');
  var CrazyEgg = require('analytics/lib/integrations/crazy-egg');
  var equal = require('equals');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var when = require('when');

  var crazyegg;
  var settings = {
    accountNumber: '00138301'
  };

  beforeEach(function () {
    crazyegg = new CrazyEgg(settings);
    crazyegg.initialize(); // noop
  });

  afterEach(function () {
    crazyegg.reset();
  });

  it('should have the right settings', function () {
    test(crazyegg)
      .name('Crazy Egg')
      .assumesPageview()
      .readyOnLoad()
      .global('CE2')
      .option('accountNumber', '');
  });

  describe('#initialize', function () {
    beforeEach(function () {
      crazyegg.load = sinon.spy(); // prevent loading
    });

    it('should call #load', function () {
      crazyegg.initialize();
      assert(crazyegg.load.called);
    });
  });

  describe('#load', function () {
    it('should create window.__adroll', function (done) {
      assert(!window.CE2);
      crazyegg.load();
      when(function () { return window.CE2; }, done);
    });

    it('should callback', function (done) {
      crazyegg.load(done);
    });
  });

});