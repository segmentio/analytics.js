
describe('Woopra', function () {

  var Woopra = require('analytics/lib/integrations/woopra');
  var assert = require('assert');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var user = require('analytics/lib/user');
  var when = require('when');

  var woopra;
  var settings = {
    domain: 'x'
  };

  beforeEach(function () {
    woopra = new Woopra(settings);
    user.reset();
  });

  afterEach(function () {
    woopra.reset();
  });

  it('should have the right settings', function () {
    test(woopra)
      .name('Woopra')
      .global('woopra')
      .assumesPageview()
      .readyOnLoad()
      .option('domain', '');
  });

  describe('#initialize', function () {
    beforeEach(function () {
      woopra.load = sinon.stub(woopra, 'load');
    });

    afterEach(function () {
      woopra.load.restore();
    });

    it('should create a woopra object', function () {
      assert(!window.woopra);
      woopra.initialize();
      assert(window.woopra);
    });

    it('should call #load', function () {
      woopra.initialize();
      assert(woopra.load.called);
    });
  });

  describe('#identify', function () {
    beforeEach(function () {
      woopra.initialize();
      window.woopra.identify = sinon.spy(window.woopra, 'identify');
    });

    afterEach(function () {
      window.woopra.identify.restore();
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
      assert(window.woopra.identify.calledWith({
        id: 'id',
        trait: true
      }));
    });
  });

  describe('#track', function () {
    beforeEach(function () {
      user.reset();
      woopra.initialize();
      window.woopra.track = sinon.spy(window.woopra, 'track');
    });

    afterEach(function () {
      window.woopra.track.restore();
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
      window.woopra.track = sinon.spy(window.woopra, 'track');
    });

    afterEach(function () {
      window.woopra.track.restore();
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

