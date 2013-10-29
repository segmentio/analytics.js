
describe('Crazy Egg', function () {
  this.timeout(10000);

  var settings = {
    accountNumber: '00138301'
  };

  var assert = require('assert');
  var CrazyEgg = require('analytics/lib/integrations/crazy-egg');
  var crazyegg = new CrazyEgg(settings);
  var equal = require('equals');
  var sinon = require('sinon');
  var when = require('when');

  describe('#name', function () {
    it('Crazy Egg', function () {
      assert(crazyegg.name == 'Crazy Egg');
    });
  });

  describe('#defaults', function () {
    it('accountNumber', function () {
      assert(crazyegg.defaults.accountNumber === '');
    });
  });

  describe('#exists', function () {
    after(function () {
      window.CE2 = undefined;
    });

    it('should check for window.CE2', function () {
      window.CE2 = {};
      assert(crazyegg.exists());
      window.CE2 = undefined;
      assert(!crazyegg.exists());
    });
  });

  describe('#load', function () {
    it('should create window.CE2', function (done) {
      assert(!window.CE2);
      crazyegg.load();
      when(function () { return window.CE2; }, done);
    });

    it('should callback', function (done) {
      crazyegg.load(done);
    });
  });

  describe('#initialize', function () {
    var load;

    beforeEach(function () {
      window.CE2 = undefined;
      load = sinon.spy(crazyegg, 'load');
    });

    afterEach(function () {
      load.restore();
    });

    it('should call #load', function () {
      crazyegg.initialize();
      assert(load.called);
    });
  });

});