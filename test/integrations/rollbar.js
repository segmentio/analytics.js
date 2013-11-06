
describe('Rollbar', function () {

  var Rollbar = require('analytics/lib/integrations/rollbar');
  var assert = require('assert');
  var equal = require('equals');
  var test = require('integration-tester');
  var sinon = require('sinon');
  var when = require('when');

  var rollbar;
  var settings = {
    accessToken: 'e1674422cbe9419987eb2e7f98adc5ec',
    'server.environment': 'testenvironment'
  };

  beforeEach(function () {
    rollbar = new Rollbar(settings);
    rollbar.initialize(); // noop
  });

  afterEach(function () {
    rollbar.reset();
  });

  it('should store the right settings', function () {
    test(rollbar)
      .name('Rollbar')
      .readyOnInitialize()
      .global('_rollbar')
      .option('accessToken', '')
      .option('identify', true);
  });

  describe('#load', function () {
    it('should call the callback', function (done) {
      rollbar.load(done);
    });

    it('should set window._rollbar', function (done) {
      window._rollbar = [settings.accessToken, settings];
      rollbar.load();
      when(function () {
        return window._rollbar.push !== Array.prototype.push;
      }, done);
    });
  });

  describe('#initialize', function () {
    var onerror;

    before(function () {
      // set up custom onerror so mocha won't complain
      onerror = window.onerror;
      window.onerror = function(){};
    });

    after(function () {
      window.onerror = onerror;
    });

    it('should add the error handler', function () {
      rollbar.initialize();
      var err = new Error('a test error');
      window._rollbar.push = sinon.spy();
      window.onerror(err);
      assert(window._rollbar.push.calledWith(err));
    });

    it('should call #load', function () {
      rollbar.load = sinon.spy();
      rollbar.initialize();
      assert(rollbar.load.called);
    });
  });

  describe('#identify', function () {
    beforeEach(function () {
      rollbar.initialize();
      window._rollbar.extraParams = {};
    });

    it('should add an id to metadata', function () {
      rollbar.identify('id');
      assert(equal(window._rollbar.extraParams, { person: { id: 'id' } }));
    });

    it('should add traits to person data', function () {
      rollbar.identify(null, { trait: true });
      assert(equal(window._rollbar.extraParams, { person: { trait: true } }));
    });

    it('should add an id and traits to person data', function () {
      rollbar.identify('id', { trait: true });
      assert(equal(window._rollbar.extraParams, {
        person: {
          id: 'id',
          trait: true
        }
      }));
    });

    it('should not add to person data when identify option is false', function () {
      rollbar.options.identify = false;
      rollbar.identify('id');
      assert(equal(window._rollbar.extraParams, {}));
    });
  });

});

