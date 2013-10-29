
describe('Awesomatic', function () {

  var assert = require('assert');
  var Awesomatic = require('analytics/lib/integrations/awesomatic');
  var sinon = require('sinon');
  var when = require('when');
  var user = require('analytics/lib/user');

  this.timeout(10000);

  var awesomatic;
  var settings = {
    appId: 'af392af01603ca383672689241b648b2'
  };

  beforeEach(function () {
    awesomatic = new Awesomatic(settings);
  });

  describe('#name', function () {
    it('Awesomatic', function () {
      assert(awesomatic.name == 'Awesomatic');
    });
  });

  describe('#_assumesPageview', function () {
    it('should be true', function () {
      assert(awesomatic._assumesPageview === true);
    });
  });

  describe('#defaults', function () {
    it('appId', function () {
      assert(awesomatic.defaults.appId === '');
    });
  });

  describe('#exists', function () {
    after(function () {
      window.Awesomatic = undefined;
    });

    it('should check for window.Awesomatic', function () {
      window.Awesomatic = undefined;
      assert(!awesomatic.exists());
      window.Awesomatic = {};
      assert(awesomatic.exists());
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