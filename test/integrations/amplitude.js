
describe('Amplitude', function () {

  var Amplitude = require('analytics/lib/integrations/amplitude');
  var assert = require('assert');
  var equal = require('equals');
  var sinon = require('sinon');
  var when = require('when');
  var user = require('analytics/lib/user');
  var noop = function () {};
  var amplitude;

  this.timeout(10000);

  var settings = {
    apiKey: '07808866adb2510adf19ee69e8fc2201'
  };

  beforeEach(function () {
    amplitude = new Amplitude(settings, noop);
  });

  describe('#name', function () {
    it('Amplitude', function () {
      assert(amplitude.name == 'Amplitude');
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

  describe('#load', function () {
    it('should load the window.amplitude object', function (done) {
      assert(!window.amplitude);
      amplitude.load();
      when(function () {
        return window.amplitude &&
          window.amplitude.prototype !== Array.prototype;
      }, done);
    });

    it('should call the callback', function (done) {
      amplitude.load(done);
    });
  });

  describe('#initialize', function () {
    it('should call ready', function (done) {
      var spy = sinon.spy();
      amplitude = new Amplitude(settings, spy);
      amplitude.initialize();
      when(function () { return spy.called; }, done);
    });

    it('should store options with defaults', function () {
      amplitude.initialize();
      assert(amplitude.options.apiKey === settings.apiKey);
      assert(amplitude.options.trackAllPages === false);
      assert(amplitude.options.trackNamedPages === true);
    });

    it('should call #load if window.amplitude is not defined', function () {
      var original = window.amplitude;
      delete window.amplitude;
      var spy = sinon.spy(amplitude, 'load');
      amplitude.initialize();
      assert(spy.called);
      window.amplitude = original; // have to replace the stup
    });

    it('should not call #load if window.amplitude is defined', function () {
      window.amplitude = window.amplitude || true;
      var spy = sinon.spy(amplitude, 'load');
      amplitude.initialize();
      assert(!spy.called);
    });
  });

  describe('#identify', function () {
    var idSpy, traitSpy;

    beforeEach(function () {
      user.reset();
      amplitude.initialize();
      idSpy = sinon.spy(window.amplitude, 'setUserId');
      traitSpy = sinon.spy(window.amplitude, 'setGlobalUserProperties');
    });

    afterEach(function () {
      idSpy.restore();
      traitSpy.restore();
    });

    it('should send an id', function () {
      amplitude.identify('id');
      assert(idSpy.calledWith('id'));
    });

    it('should send traits', function () {
      amplitude.identify(null, { trait: true });
      assert(traitSpy.calledWith({ trait: true }));
    });

    it('should send an id and traits', function () {
      amplitude.identify('id', { trait: true });
      assert(idSpy.calledWith('id'));
      assert(traitSpy.calledWith({ trait: true }));
    });
  });

  describe('#track', function () {
    var spy;

    beforeEach(function () {
      spy = sinon.spy(window.amplitude, 'logEvent');
    });

    afterEach(function () {
      spy.restore();
    });

    it('should send an event', function () {
      amplitude.track('event');
      assert(spy.calledWith('event'));
    });

    it('should send an event and properties', function () {
      amplitude.track('event', { property: true });
      assert(spy.calledWith('event', { property: true }));
    });
  });

  describe('#page', function () {
    var spy;

    beforeEach(function () {
      spy = sinon.spy(window.amplitude, 'logEvent');
    });

    afterEach(function () {
      spy.restore();
    });

    it('shouldnt track unnamed pages by default', function () {
      amplitude.page();
      assert(!spy.called);
    });

    it('should track unnamed pages if enabled', function () {
      amplitude.options.trackAllPages = true;
      amplitude.page();
      assert(spy.calledWith('Loaded a Page'));
    });

    it('should track unnamed pages with args', function () {
      amplitude.options.trackAllPages = true;
      amplitude.page('Signup', { url: window.location.href });
      assert(spy.calledWith('Loaded a Page', { url: window.location.href }));
    });

    it('should track named pages by default', function () {
      amplitude.page('Signup', {
        url: window.location.href
      });
      assert(spy.calledWith('Viewed Signup Page', {
        url: window.location.href
      }));
    });

    it('should not track named pages if disabled', function () {
      amplitude.options.trackNamedPages = false;
      amplitude.page('Signup', {
        url: window.location.href
      });
      assert(!spy.called);
    });
  });
});