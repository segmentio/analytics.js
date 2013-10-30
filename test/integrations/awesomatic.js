
describe('Awesomatic', function () {

  var settings = {
    appId: 'af392af01603ca383672689241b648b2'
  };

  var assert = require('assert');
  var Awesomatic = require('analytics/lib/integrations/awesomatic');
  var awesomatic = new Awesomatic(settings);
  var sinon = require('sinon');
  var test = require('integration-tester');
  var user = require('analytics/lib/user');
  var when = require('when');

  afterEach(function () {
    awesomatic.reset();
  });

  it('should have the right settings', function () {
    test(awesomatic)
      .name('Awesomatic')
      .assumesPageview()
      .global('Awesomatic')
      .option('appId', '');
  });

  describe('#load', function () {
    after(function () {
      window.Awesomatic = undefined;
    });

    it('should create window.Awesomatic', function (done) {
      awesomatic.load();
      when(function () { return window.Awesomatic; }, done);
    });

    it('should callback', function (done) {
      awesomatic.load(done);
    });
  });

  describe('#initialize', function () {
    var load;

    beforeEach(function () {
      load = sinon.spy(awesomatic, 'load');
    });

    afterEach(function () {
      load.restore();
    });

    it('should call #load', function () {
      awesomatic.initialize();
      assert(load.called);
    });
  });

  describe('#identify', function () {
    var load;

    before(function (done) {
      awesomatic.initialize();
      awesomatic.once('ready', done);
    });

    beforeEach(function () {
      load = sinon.stub(window.Awesomatic, 'load');
    });

    afterEach(function () {
      user.reset();
      load.restore();
    });

    it('should send an id', function () {
      awesomatic.identify('id', {});
      assert(load.calledWith({ userId: 'id' }));
    });

    it('should send an id and properties', function () {
      awesomatic.identify('id', { property: true });
      assert(load.calledWith({ userId: 'id', property: true }));
    });

    it('should require an id or email', function () {
      awesomatic.identify(null, { property: true });
      assert(!load.called);
    });
  });
});