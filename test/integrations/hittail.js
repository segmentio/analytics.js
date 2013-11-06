
describe('HitTail', function () {

  var assert = require('assert');
  var equal = require('equals');
  var HitTail = require('analytics/lib/integrations/hittail');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var when = require('when');

  var hittail;
  var settings = {
    siteId: 'x'
  };

  beforeEach(function () {
    hittal = new HitTail(settings);
    hittal.initialize(); // noop
  });

  afterEach(function () {
    hittal.reset();
  });

  it('should have the right settings', function () {
    test(hittal)
      .name('HitTail')
      .assumesPageview()
      .readyOnLoad()
      .global('htk')
      .option('siteId', '');
  });

  describe('#initialize', function () {
    beforeEach(function () {
      hittal.load = sinon.spy(); // prevent loading
    });

    it('should call #load', function () {
      hittal.initialize();
      assert(hittal.load.called);
    });
  });

  describe('#load', function () {
    it('should create window.htk', function (done) {
      assert(!window.htk);
      hittal.load();
      when(function () { return window.htk; }, done);
    });

    it('should callback', function (done) {
      hittal.load(done);
    });
  });

});