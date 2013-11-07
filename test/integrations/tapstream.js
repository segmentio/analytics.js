
describe('Tapstream', function () {

  var assert = require('assert');
  var equal = require('equals');
  var sinon = require('sinon');
  var Tapstream = require('analytics/lib/integrations/tapstream');
  var test = require('integration-tester');

  var tapstream;
  var settings = {
    accountName: 'tapstreamTestAccount'
  };

  beforeEach(function () {
    tapstream = new Tapstream(settings);
    tapstream.initialize(); // noop
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

  describe('#initialize', function () {
    beforeEach(function () {
      tapstream.load = sinon.spy();
    });

    it('should push setAccount name onto window._tsq', function () {
      tapstream.initialize();
      assert(equal(window._tsq[0] , ['setAccountName', settings.accountName]));
    });

    it('should call #load', function () {
      tapstream.initialize();
      assert(tapstream.load.called);
    });
  });

  describe('#load', function () {
    beforeEach(function () {
      sinon.stub(tapstream, 'load');
      tapstream.initialize();
      tapstream.load.restore();
    });

    it('should replace the window._tsq object', function (done) {
      tapstream.load(function (err) {
        if (err) return done(err);
        assert(window._tsq.push !== Array.prototype.push);
        done();
      });
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