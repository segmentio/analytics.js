
describe('Sentry', function () {

  var assert = require('assert');
  var Sentry = require('analytics/lib/integrations/sentry');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var when = require('when');

  var sentry;
  var settings = {
    config: 'x'
  };

  beforeEach(function () {
    sentry = new Sentry(settings);
  });

  it('should have the right settings', function () {
    test(sentry)
      .name('Sentry')
      .readyOnLoad()
      .global('Raven')
      .option('config', '');
  });

  describe('#initialize', function () {
    it('should call #load', function () {
      sentry.load = sinon.spy();
      sentry.initialize();
      assert(sentry.load.called);
    });
  });

  describe('#load', function () {
    beforeEach(function () {
      sinon.stub(sentry, 'load');
      sentry.initialize();
      sentry.load.restore();
    });

    it('should create window.Raven', function (done) {
      sentry.load(function () {
        assert(window.Raven);
        done();
      });
    });
  });

  describe('#identify', function () {
    beforeEach(function () {
      window.Raven.setUser = sinon.spy();
    });

    it('should send an id', function () {
      sentry.identify('id');
      assert(window.Raven.setUser.calledWith({ id: 'id' }));
    });

    it('should send traits', function () {
      sentry.identify(null, { trait: true });
      assert(window.Raven.setUser.calledWith({ trait: true }));
    });

    it('should send an id and traits', function () {
      sentry.identify('id', { trait: true });
      assert(window.Raven.setUser.calledWith({ id: 'id', trait: true }));
    });
  });
});