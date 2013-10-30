
describe('Amplitude', function () {

  var settings = {
    apiKey: '07808866adb2510adf19ee69e8fc2201'
  };

  var Amplitude = require('analytics/lib/integrations/amplitude');
  var amplitude = new Amplitude(settings);
  var assert = require('assert');
  var equal = require('equals');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var when = require('when');
  var user = require('analytics/lib/user');

  it('should have the right settings', function () {
    test(amplitude)
      .name('Amplitude')
      .assumesPageview()
      .readyOnInitialize()
      .global('amplitude')
      .option('apiKey', '')
      .option('trackAllPages', false)
      .option('trackNamedPages', true);
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

    it('should create window.amplitude', function () {
      window.amplitude = null;
      amplitude.initialize();
      assert(window.amplitude.init);
    });

    it('should call #load', function () {
      amplitude.initialize();
      assert(load.called);
    });
  });

  describe('#load', function () {
    it('should replace window.amplitude', function (done) {
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