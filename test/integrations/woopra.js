
describe('Woopra', function () {
  this.timeout(10000);

  var settings = {
    domain: 'x'
  };

  var Woopra = require('analytics/lib/integrations/woopra');
  var woopra = new Woopra(settings);
  var assert = require('assert');
  var sinon = require('sinon');
  var user = require('analytics/lib/user');
  var when = require('when');

  describe('#name', function () {
    it('Woopra', function () {
      assert(woopra.name == 'Woopra');
    });
  });

  describe('#_assumesPageview', function () {
    it('should be true', function () {
      assert(woopra._assumesPageview === true);
    });
  });

  describe('#_readyOnLoad', function () {
    it('should be true', function () {
      assert(woopra._readyOnLoad === true);
    });
  });

  describe('#defaults', function () {
    it('domain', function () {
      assert(woopra.defaults.domain === '');
    });
  });

  describe('#initialize', function () {
    var load;

    beforeEach(function () {
      delete window.woopra;
      load = sinon.stub(woopra, 'load');
    });

    afterEach(function () {
      load.restore();
    });

    it('should create a woopra object', function () {
      assert(!window.woopra);
      woopra.initialize();
      assert(window.woopra);
    });

    it('should call #load', function () {
      woopra.initialize();
      assert(load.called);
    });
  });

  describe('#identify', function () {
    var identify;

    beforeEach(function () {
      user.reset();
      woopra.initialize();
      identify = sinon.spy(window.woopra, 'identify');
    });

    afterEach(function () {
      identify.restore();
    });

    it('should send an id', function () {
      woopra.identify('id', {});
      assert(identify.calledWith({ id: 'id' }));
    });

    it('should send traits', function () {
      woopra.identify(null, { trait: true });
      assert(identify.calledWith({ trait: true }));
    });

    it('should send an id and traits', function () {
      woopra.identify('id', { trait: true });
      assert(identify.calledWith({
        id: 'id',
        trait: true
      }));
    });
  });

  describe('#track', function () {
    var track;

    beforeEach(function () {
      user.reset();
      woopra.initialize();
      track = sinon.spy(window.woopra, 'track');
    });

    afterEach(function () {
      track.restore();
    });

    it('should send an event', function () {
      woopra.track('event', {});
      assert(track.calledWith('event', {}));
    });

    it('should send properties', function () {
      woopra.track('event', { property: 'Property' });
      assert(track.calledWith('event', { property: 'Property' }));
    });
  });

  describe('#page', function () {
    var track;

    beforeEach(function () {
      user.reset();
      woopra.initialize();
      track = sinon.spy(window.woopra, 'track');
    });

    afterEach(function () {
      track.restore();
    });

    it('should send a "pv" event with default properties', function () {
      woopra.page(null, {});
      assert(track.calledWith('pv', {
        title: undefined,
        url: undefined
      }));
    });

    it('should send a "pv" event with the specified name', function () {
      woopra.page('Signup', {});
      assert(track.calledWith('pv', {
        title: 'Signup',
        url: undefined
      }));
    });

    it('should pass a title', function () {
      woopra.page(null, { title: 'x' });
      assert(track.calledWith('pv', {
        title: 'x',
        url: undefined
      }));
    });

    it('should pass a url', function () {
      woopra.page('Signup', { url: '/signup' });
      assert(track.calledWith('pv', {
        url: '/signup',
        title: 'Signup'
      }));
    });
  });
});

