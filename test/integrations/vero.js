
describe('Vero', function () {

  var assert = require('assert');
  var equal = require('equals');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var Vero = require('analytics/lib/integrations/vero');
  var when = require('when');

  var vero;
  var settings = {
    apiKey: 'x'
  };

  beforeEach(function () {
    vero = new Vero(settings);
    vero.initialize(); // noop
  });

  /**
   * Add setup and reset functions so that mid-loading js won't error out,
   * only used for suites which actually load the js.
   */

  function setup () {
    vero.on('load', function () { vero._loaded = true; });
  }

  function reset (done) {
    when(function () { return vero._loaded; }, function () {
      vero.reset();
      done();
    });
  }

  it('should store the proper settings', function () {
    test(vero)
      .assumesPageview()
      .readyOnInitialize()
      .global('_veroq')
      .option('apiKey', '');
  });

  describe('#initialize', function () {
    beforeEach(setup);
    afterEach(reset);

    it('should push onto window._veroq', function () {
      window._veroq = [];
      window._veroq.push = sinon.spy();
      vero.initialize();
      assert(window._veroq.push.calledWith(['init', { api_key: settings.apiKey }]));
    });

    it('should call #load', function () {
      vero.load = sinon.spy(vero, 'load');
      vero.initialize();
      assert(vero.load.called);
    });
  });

  describe('#load', function () {
    beforeEach(setup);
    afterEach(reset);

    it('should replace window._veroq.push', function (done) {
      vero.load();
      when(function () {
        return window._veroq && window._veroq.push !== Array.prototype.push;
      }, done);
    });

    it('should callback', function (done) {
      vero.load(done);
    });
  });

  describe('#identify', function () {
    beforeEach(function () {
      setup();
      vero.initialize();
      window._veroq.push = sinon.spy();
    });

    afterEach(reset);

    it('shouldnt send just an id', function () {
      vero.identify('id');
      assert(!window._veroq.push.called);
    });

    it('shouldnt send without an id', function () {
      vero.identify(null, { trait: true });
      assert(!window._veroq.push.called);
    });

    it('should send an id and email', function () {
      vero.identify('id', { email: 'name@example.com' });
      assert(window._veroq.push.calledWith(['user', {
        id: 'id',
        email: 'name@example.com'
      }]));
    });

    it('should send an id and traits', function () {
      vero.identify('id', {
        email: 'name@example.com',
        trait: true
      });
      assert(window._veroq.push.calledWith(['user', {
        id: 'id',
        email: 'name@example.com',
        trait: true
      }]));
    });
  });

  describe('#track', function () {
    beforeEach(function () {
      setup();
      vero.initialize();
      window._veroq.push = sinon.spy();
    });

    afterEach(reset);

    it('should send an event', function () {
      vero.track('event');
      assert(window._veroq.push.calledWith(['track', 'event', undefined]));
    });

    it('should send an event and properties', function () {
      vero.track('event', { property: true });
      assert(window._veroq.push.calledWith(['track', 'event', { property: true }]));
    });
  });
});