
describe('Amplitude', function () {

  var Amplitude = require('analytics/lib/integrations/amplitude');
  var assert = require('assert');
  var equal = require('equals');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var when = require('when');

  var amplitude;
  var settings = {
    apiKey: '07808866adb2510adf19ee69e8fc2201'
  };

  beforeEach(function () {
    amplitude = new Amplitude(settings);
    amplitude.initialize(); // noop
  });

  afterEach(function () {
    amplitude.reset();
  });

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
    beforeEach(function () {
      amplitude.load = sinon.spy();
    });

    it('should create window.amplitude', function () {
      assert(!window.amplitude);
      amplitude.initialize();
      assert(window.amplitude);
    });

    it('should call #load', function () {
      amplitude.initialize();
      assert(amplitude.load.called);
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
    beforeEach(function () {
      amplitude.initialize();
      window.amplitude.setUserId = sinon.spy();
      window.amplitude.setGlobalUserProperties = sinon.spy();
    });

    it('should send an id', function () {
      amplitude.identify('id');
      assert(window.amplitude.setUserId.calledWith('id'));
    });

    it('should send traits', function () {
      amplitude.identify(null, { trait: true });
      assert(window.amplitude.setGlobalUserProperties.calledWith({ trait: true }));
    });

    it('should send an id and traits', function () {
      amplitude.identify('id', { trait: true });
      assert(window.amplitude.setUserId.calledWith('id'));
      assert(window.amplitude.setGlobalUserProperties.calledWith({ trait: true }));
    });
  });

  describe('#track', function () {
    beforeEach(function () {
      amplitude.initialize();
      window.amplitude.logEvent = sinon.spy();
    });

    it('should send an event', function () {
      amplitude.track('event');
      assert(window.amplitude.logEvent.calledWith('event'));
    });

    it('should send an event and properties', function () {
      amplitude.track('event', { property: true });
      assert(window.amplitude.logEvent.calledWith('event', { property: true }));
    });
  });

  describe('#page', function () {
    beforeEach(function () {
      amplitude.initialize();
      window.amplitude.logEvent = sinon.spy();
    });

    it('should not track unnamed pages by default', function () {
      amplitude.page();
      assert(!window.amplitude.logEvent.called);
    });

    it('should track unnamed pages if enabled', function () {
      amplitude.options.trackAllPages = true;
      amplitude.page(null, { url: window.location.href });
      assert(window.amplitude.logEvent.calledWith('Loaded a Page', {
        url: window.location.href
      }));
    });

    it('should track named pages by default', function () {
      amplitude.page('Signup', { url: window.location.href });
      assert(window.amplitude.logEvent.calledWith('Viewed Signup Page', {
        url: window.location.href
      }));
    });

    it('should not track named pages if disabled', function () {
      amplitude.options.trackNamedPages = false;
      amplitude.page('Signup', { url: window.location.href });
      assert(!window.amplitude.logEvent.called);
    });
  });
});