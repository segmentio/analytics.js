
describe('Awesomatic', function () {

  var Awesomatic = require('analytics/lib/integrations/awesomatic');
  var assert = require('assert');
  var sinon = require('sinon');
  var when = require('when');
  var user = require('analytics/lib/user');
  var awesomatic;

  this.timeout(10000);

  var settings = {
    appId: 'af392af01603ca383672689241b648b2'
  };

  beforeEach(function () {
    awesomatic = new Awesomatic(settings, function () {});
  });

  describe('#name', function () {
    it('Awesomatic', function () {
      assert(awesomatic.name == 'Awesomatic');
    });
  });

  describe('#defaults', function () {
    it('appId', function () {
      assert(awesomatic.defaults.appId === '');
    });
  });

  describe('#load', function () {
    it('should create window.AwesomaticSettings', function (done) {
      awesomatic.load();
      when(function () { return window.Awesomatic; }, done);
    });

    it('should call the callback', function (done) {
      awesomatic.load(done);
    });
  });

  describe('#initialize', function () {
    it('should call load', function () {
      var spy = sinon.spy(awesomatic, 'load');
      awesomatic.initialize();
      assert(spy.called);
    });

    it('should call ready', function (done) {
      var spy = sinon.spy();
      awesomatic = new Awesomatic(settings, spy);
      awesomatic.initialize();
      when(function () { return spy.called; }, done);
    });

    it('should store options', function () {
      assert(awesomatic.options.appId == settings.appId);
    });
  });

  describe('#identify', function () {
    var stub;

    beforeEach(function () {
      user.reset();
      stub = sinon.stub(window.Awesomatic, 'load');
    });

    afterEach(function () {
      stub.restore();
    });

    it('should call load()', function () {
      awesomatic.identify('x', {});
      assert(stub.called);
    });

    it('should set email', function () {
      awesomatic.identify('x', { email: 'email@example.com' });
      assert(stub.calledWith({
        userId: 'x',
        email: 'email@example.com'
      }));
    });
  });
});