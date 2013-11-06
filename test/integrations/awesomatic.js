
describe('Awesomatic', function () {

  var assert = require('assert');
  var Awesomatic = require('analytics/lib/integrations/awesomatic');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var when = require('when');

  var awesomatic;
  var settings = {
    appId: 'af392af01603ca383672689241b648b2'
  };

  beforeEach(function () {
    awesomatic = new Awesomatic(settings);
    awesomatic.initialize(); // noop
  });

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

  describe('#initialize', function () {
    it('should call #load', function () {
      awesomatic.load = sinon.spy();
      awesomatic.initialize();
      assert(awesomatic.load.called);
    });
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

  describe('#identify', function () {
    beforeEach(function (done) {
      awesomatic.initialize();
      awesomatic.once('ready', function () {
        window.Awesomatic.load = sinon.spy();
        done();
      });
    });

    it('should send an id', function () {
      awesomatic.identify('id', {});
      assert(window.Awesomatic.load.calledWith({ userId: 'id' }));
    });

    it('should send an id and properties', function () {
      awesomatic.identify('id', { property: true });
      assert(window.Awesomatic.load.calledWith({ userId: 'id', property: true }));
    });

    it('should require an id or email', function () {
      awesomatic.identify(null, { property: true });
      assert(!window.Awesomatic.load.called);
    });
  });
});