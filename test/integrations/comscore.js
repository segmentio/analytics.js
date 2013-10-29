
describe('comScore', function () {
  this.timeout(10000);

  var settings = {
    c2: 'x'
  };

  var assert = require('assert');
  var Comscore = require('analytics/lib/integrations/comscore');
  var comscore = new Comscore(settings);
  var equal = require('equals');
  var sinon = require('sinon');
  var when = require('when');

  describe('#name', function () {
    it('comScore', function () {
      assert(comscore.name == 'comScore');
    });
  });

  describe('#defaults', function () {
    it('c1', function () {
      assert(comscore.defaults.c1 === '2');
    });

    it('c2', function () {
      assert(comscore.defaults.c2 === '');
    });
  });

  describe('#load', function () {
    it('should create window.COMSCORE', function (done) {
      assert(!window.COMSCORE);
      comscore.load();
      when(function () { return window.COMSCORE; }, done);
    });

    it('should callback', function (done) {
      comscore.load(done);
    });
  });

  describe('#initialize', function () {
    var load;

    before(function () {
      window._comscore = undefined;
    });

    beforeEach(function () {
      load = sinon.spy(comscore, 'load');
    });

    afterEach(function () {
      load.restore();
      window._comscore = undefined;
    });

    it('should create window._comscore', function () {
      window._comscore = null;
      comscore.initialize();
      assert(window._comscore instanceof Array);
    });

    it('should call #load', function () {
      comscore.initialize();
      assert(load.called);
    });
  });

});