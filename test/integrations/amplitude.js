
describe('Amplitude', function () {
  this.timeout(10000);

  var settings = {
    apiKey: '07808866adb2510adf19ee69e8fc2201'
  };

  var Amplitude = require('analytics/lib/integrations/amplitude');
  var amplitude = new Amplitude(settings);
  var assert = require('assert');
  var equal = require('equals');
  var sinon = require('sinon');
  var when = require('when');
  var user = require('analytics/lib/user');

  describe('#name', function () {
    it('Amplitude', function () {
      assert(amplitude.name == 'Amplitude');
    });
  });

  describe('#_readyOnInitialize', function () {
    it('should be true', function () {
      assert(awesm._readyOnInitialize === true);
    });
  });

  describe('#defaults', function () {
    it('apiKey', function () {
      assert(amplitude.defaults.apiKey === '');
    });

    it('trackAllPages', function () {
      assert(amplitude.defaults.trackAllPages === false);
    });

    it('trackNamedPages', function () {
      assert(amplitude.defaults.trackNamedPages === true);
    });
  });

  describe('#exists', function () {
    after(function () {
      window.amplitude = undefined;
    });

    it('should check for window.amplitude', function () {
      window.amplitude = {};
      assert(amplitude.exists());
      window.amplitude = undefined;
      assert(!amplitude.exists());
    });
  });

  describe('#load', function () {
    it('should load the window.amplitude object', function (done) {
      assert(!window.amplitude);
      amplitude.load();
      when(function () {
        return window.amplitude && window.amplitude.prototype !== Array.prototype;
      }, done);
    });

    it('should callback', function (done) {
      amplitude.load(done);
    });
  });

  describe('#initialize', function () {
    var load;

    beforeEach(function () {
      window.amplitude = undefined;
      load = sinon.spy(amplitude, 'load');
    });

    afterEach(function () {
      load.restore();
    });

    it('should create the window.amplitude object', function () {
      window.amplitude = null;
      amplitude.initialize();
      assert(window.amplitude.init);
    });

    it('should emit ready', function (done) {
      amplitude.once('ready', done);
      amplitude.initialize();
    });

    it('should call #load', function () {
      amplitude.initialize();
      assert(load.called);
    });
  });

  describe('#identify', function () {
    var setUserId, setGlobalUserProperties;

    before(function () {
      amplitude.initialize();
    });

    beforeEach(function () {
      setUserId = sinon.spy(window.amplitude, 'setUserId');
      setGlobalUserProperties = sinon.spy(window.amplitude, 'setGlobalUserProperties');
    });

    afterEach(function () {
      user.reset();
      setUserId.restore();
      setGlobalUserProperties.restore();
    });

    it('should send an id', function () {
      amplitude.identify('id');
      assert(setUserId.calledWith('id'));
    });

    it('should send traits', function () {
      amplitude.identify(null, { trait: true });
      assert(setGlobalUserProperties.calledWith({ trait: true }));
    });

    it('should send an id and traits', function () {
      amplitude.identify('id', { trait: true });
      assert(setUserId.calledWith('id'));
      assert(setGlobalUserProperties.calledWith({ trait: true }));
    });
  });

  describe('#track', function () {
    var logEvent;

    beforeEach(function () {
      logEvent = sinon.spy(window.amplitude, 'logEvent');
    });

    afterEach(function () {
      logEvent.restore();
    });

    it('should send an event', function () {
      amplitude.track('event');
      assert(logEvent.calledWith('event'));
    });

    it('should send an event and properties', function () {
      amplitude.track('event', { property: true });
      assert(logEvent.calledWith('event', { property: true }));
    });
  });

  describe('#page', function () {
    var logEvent;

    beforeEach(function () {
      logEvent = sinon.spy(window.amplitude, 'logEvent');
    });

    afterEach(function () {
      logEvent.restore();
      amplitude.options.trackAllPages = false;
      amplitude.options.trackNamedPages = true;
    });

    it('should not track unnamed pages by default', function () {
      amplitude.page();
      assert(!logEvent.called);
    });

    it('should track unnamed pages if enabled', function () {
      amplitude.options.trackAllPages = true;
      amplitude.page();
      assert(logEvent.calledWith('Loaded a Page'));
    });

    it('should track unnamed pages with properties', function () {
      amplitude.options.trackAllPages = true;
      amplitude.page(null, { url: window.location.href });
      assert(logEvent.calledWith('Loaded a Page', { url: window.location.href }));
    });

    it('should track named pages by default', function () {
      amplitude.page('Signup');
      assert(logEvent.calledWith('Viewed Signup Page'));
    });

    it('should track named pages with properties', function () {
      amplitude.page('Signup', { url: window.location.href });
      assert(logEvent.calledWith('Viewed Signup Page', { url: window.location.href }));
    });

    it('should not track named pages if disabled', function () {
      amplitude.options.trackNamedPages = false;
      amplitude.page('Signup', { url: window.location.href });
      assert(!logEvent.called);
    });
  });
});