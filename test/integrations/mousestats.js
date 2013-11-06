
describe('MouseStats', function () {

  var analytics = window.analytics || require('analytics');
  var assert = require('assert');
  var MouseStats = require('analytics/lib/integrations/mousestats');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var when = require('when');

  var mousestats;
  var settings = {
    accountNumber: '5532375730335616295'
  };

  beforeEach(function () {
    mousestats = new MouseStats(settings);
    mousestats.initialize(); // noop
  });

  afterEach(function () {
    mousestats.reset();
  });

  it('should have the right settings', function () {
    test(mousestats)
      .name('MouseStats')
      .assumesPageview()
      .readyOnLoad()
      .global('msaa')
      .option('accountNumber', '');
  });

  describe('#initialize', function () {
    it('should call #load', function () {
      mousestats.load = sinon.spy();
      mousestats.initialize();
      assert(mousestats.load.called);
    });
  });

  describe('#load', function () {
    it('should create window.msaa', function (done) {
      assert(!window.msaa);
      mousestats.load();
      when(function () { return window.msaa; }, done);
    });

    it('should callback', function (done) {
      mousestats.load(done);
    });
  });

});