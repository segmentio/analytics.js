
describe('Tapstream', function () {

  var Tapstream = require('analytics/lib/integrations/tapstream');
  var assert = require('assert');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var when = require('when');

  var tapstream;
  var settings = {
    accountName: 'tapstreamTestAccount'
  };

  beforeEach(function () {
    tapstream = new Tapstream(settings);
  });

  afterEach(function () {
    tapstream.reset();
  });

  it('should store the right settings', function () {
    test(tapstream)
      .name('Tapstream')
      .assumesPageview()
      .readyOnInitialize()
      .global('_tsq')
      .option('accountName', '')
      .option('trackAllPages', true)
      .option('trackNamedPages', true);
  });

  describe('#load', function () {
    it('should replace the window._tsq object', function (done) {
      tapstream.load();
      when(function () {
        return window._tsq && window._tsq.push !== Array.prototype.push;
      }, done);
    });

    it('should call the callback', function (done) {
      tapstream.load(done);
    });
  });

  describe('#initialize', function () {
    it('should call #load', function () {
      tapstream.load = sinon.spy();
      tapstream.initialize();
      assert(tapstream.load.called);
    });

    it('should push setAccount name onto window._tsq', function () {
      window._tsq = [];
      window._tsq.push = sinon.spy();
      tapstream.initialize();
      assert(window._tsq.push.calledWith([
        'setAccountName',
        settings.accountName
      ]));
    });
  });

  describe('#track', function () {
    beforeEach(function () {
      tapstream.initialize();
      window._tsq.push = sinon.spy();
    });

    it('should send an event as a slug', function () {
      tapstream.track('Event');
      assert(window._tsq.push.calledWith(['fireHit', 'event', [undefined]]));
    });
  });

  describe('#page', function () {
    beforeEach(function () {
      tapstream.initialize();
      window._tsq.push = sinon.spy();
    });

    it('should send a "Loaded a Page" event', function () {
      tapstream.page();
      assert(window._tsq.push.calledWith([
        'fireHit',
        'loaded-a-page',
        [undefined]
      ]));
    });

    it('should send a named page', function () {
      tapstream.page('Signup');
      assert(window._tsq.push.calledWith([
        'fireHit',
        'loaded-a-page',
        [undefined]
      ]));
      assert(window._tsq.push.calledWith([
        'fireHit',
        'viewed-signup-page',
        [undefined]
      ]));
    });

    it('should send unnamed pages', function () {
      tapstream.page(undefined, { url: 'test' });
      assert(window._tsq.push.calledWith([
        'fireHit',
        'loaded-a-page',
        ['test']
      ]));
    });
  });
});