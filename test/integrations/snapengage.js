
describe('SnapEngage', function () {

  var assert = require('assert');
  var sinon = require('sinon');
  var SnapEngage = require('analytics/lib/integrations/snapengage');
  var test = require('integration-tester');
  var when = require('when');

  var snapengage;
  var settings = {
    apiKey: '782b737e-487f-4117-8a2b-2beb32b600e5'
  };

  beforeEach(function () {
    snapengage = new SnapEngage(settings);
    snapengage.initialize(); // noop
  });

  afterEach(function () {
    snapengage.reset();
  });

  it('should store the right settings', function () {
    test(snapengage)
      .name('SnapEngage')
      .assumesPageview()
      .readyOnLoad()
      .global('SnapABug')
      .option('apiKey', '');
  });

  describe('#load', function () {
    it('should create window.SnapABug', function (done) {
      assert(!window.SnapABug);
      snapengage.load();
      when(function () { return window.SnapABug; }, done);
    });

    it('should callback', function (done) {
      snapengage.load(done);
    });
  });

  describe('#initialize', function () {
    it('should call #load', function () {
      snapengage.load = sinon.spy();
      snapengage.initialize();
      assert(snapengage.load.called);
    });
  });

  describe('#identify', function () {
    beforeEach(function (done) {
      snapengage.once('ready', function () {
        window.SnapABug.setUserEmail = sinon.spy();
        done();
      });
      snapengage.initialize();
    });

    it('should send an email', function () {
      snapengage.identify(null, { email: 'name@example.com' });
      assert(window.SnapABug.setUserEmail.calledWith('name@example.com'));
    });
  });
});