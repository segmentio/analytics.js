
describe('Woopra', function () {

  var assert = require('assert');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var when = require('when');
  var Woopra = require('analytics/lib/integrations/woopra');

  var woopra;
  var settings = {
    domain: 'x'
  };

  beforeEach(function () {
    woopra = new Woopra(settings);
    woopra.initialize(); // noop
  });

  afterEach(function () {
    woopra.reset();
  });

  it('should have the right settings', function () {
    test(woopra)
      .name('Woopra')
      .assumesPageview()
      .readyOnLoad()
      .global('woopra')
      .option('domain', '');
  });

  describe('#initialize', function () {
    it('should create a woopra object', function () {
      assert(!window.woopra);
      woopra.initialize();
      assert(window.woopra);
    });

    it('should call #load', function () {
      woopra.load = sinon.spy();
      woopra.initialize();
      assert(woopra.load.called);
    });
  });

  describe('#identify', function () {
    beforeEach(function () {
      woopra.initialize();
      // woopra identify has other methods on it
      window.woopra.identify = sinon.spy(window.woopra, 'identify');
    });

    it('should send an id', function () {
      woopra.identify('id');
      assert(window.woopra.identify.calledWith({ id: 'id' }));
    });

    it('should send traits', function () {
      woopra.identify(null, { trait: true });
      assert(window.woopra.identify.calledWith({ trait: true }));
    });

    it('should send an id and traits', function () {
      woopra.identify('id', { trait: true });
      assert(window.woopra.identify.calledWith({ id: 'id', trait: true }));
    });
  });

  describe('#track', function () {
    beforeEach(function () {
      woopra.initialize();
      window.woopra.track = sinon.spy();
    });

    it('should send an event', function () {
      woopra.track('event');
      assert(window.woopra.track.calledWith('event'));
    });

    it('should send properties', function () {
      woopra.track('event', { property: 'Property' });
      assert(window.woopra.track.calledWith('event', { property: 'Property' }));
    });
  });

  describe('#page', function () {
    beforeEach(function () {
      woopra.initialize();
      window.woopra.track = sinon.spy();
    });

    it('should send a "pv" event with default properties', function () {
      woopra.page();
      assert(window.woopra.track.calledWith('pv', {
        title: undefined,
        url: undefined
      }));
    });

    it('should send a "pv" event with the specified name', function () {
      woopra.page('Signup');
      assert(window.woopra.track.calledWith('pv', {
        title: 'Signup',
        url: undefined
      }));
    });

    it('should pass a title', function () {
      woopra.page(null, { title: 'x' });
      assert(window.woopra.track.calledWith('pv', {
        title: 'x',
        url: undefined
      }));
    });

    it('should pass a url', function () {
      woopra.page('Signup', { url: '/signup' });
      assert(window.woopra.track.calledWith('pv', {
        url: '/signup',
        title: 'Signup'
      }));
    });
  });
});

