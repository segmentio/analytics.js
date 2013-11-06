
describe('comScore', function () {

  var assert = require('assert');
  var Comscore = require('analytics/lib/integrations/comscore');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var when = require('when');

  var comscore;
  var settings = {
    c2: 'x'
  };

  beforeEach(function () {
    comscore = new Comscore(settings);
    comscore.initialize(); // noop
  });

  afterEach(function () {
    comscore.reset();
  });

  it('should have the right settings', function () {
    test(comscore)
      .name('comScore')
      .assumesPageview()
      .readyOnLoad()
      .global('_comscore')
      .option('c1', '2')
      .option('c2', '');
  });

  describe('#initialize', function () {
    it('should create window._comscore', function () {
      assert(!window._comscore);
      comscore.initialize();
      assert(window._comscore instanceof Array);
    });

    it('should call #load', function () {
      comscore.load = sinon.spy();
      comscore.initialize();
      assert(comscore.load.called);
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

});