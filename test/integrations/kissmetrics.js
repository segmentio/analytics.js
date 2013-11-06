
describe('KISSmetrics', function () {

  var assert = require('assert');
  var KISSmetrics = require('analytics/lib/integrations/kissmetrics');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var when = require('when');

  var kissmetrics;
  var settings = {
    apiKey: '67f57ae9d61a6981fa07d141bec8c6c37e8b88c7'
  };

  beforeEach(function () {
    kissmetrics = new KISSmetrics(settings);
    kissmetrics.initialize(); // noop
    window.KM_DNT = true;
    window.KMDNTH = true;
  });

  afterEach(function () {
    kissmetrics.reset();
  });

  it('should have the right settings', function () {
    test(kissmetrics)
      .name('KISSmetrics')
      .assumesPageview()
      .readyOnInitialize()
      .global('_kmq')
      .global('KM')
      .global('_kmil')
      .option('apiKey', '')
      .option('trackNamedPages', true);
  });

  describe('#initialize', function () {
    beforeEach(function () {
      kissmetrics.load = sinon.spy();
    });

    it('should create window._kmq', function () {
      assert(!window._kmq);
      kissmetrics.initialize();
      assert(window._kmq instanceof Array);
    });

    it('should call #load', function () {
      kissmetrics.initialize();
      assert(kissmetrics.load.called);
    });
  });

  describe('#load', function () {
    beforeEach(function () {
      sinon.stub(kissmetrics, 'load');
      kissmetrics.initialize();
      kissmetrics.load.restore();
    });

    it('should create window.KM', function (done) {
      kissmetrics.load(function () {
        assert(window.KM_KEY);
        setTimeout(done, 1001);
      });
    });
  });

  describe('#identify', function () {
    beforeEach(function (done) {
      kissmetrics.once('load', function () {
        window._kmq.push = sinon.spy();
        setTimeout(done, 1001);
      });
      kissmetrics.initialize();
    });

    it('should send an id', function () {
      kissmetrics.identify('id');
      assert(window._kmq.push.calledWith(['identify', 'id']));
    });

    it('should send traits', function () {
      kissmetrics.identify(null, { trait: true });
      assert(window._kmq.push.calledWith(['set', { trait: true }]));
    });

    it('should send an id and traits', function () {
      kissmetrics.identify('id', { trait: true });
      assert(window._kmq.push.calledWith(['identify', 'id']));
      assert(window._kmq.push.calledWith(['set', { trait: true }]));
    });
  });

  describe('#track', function () {
    beforeEach(function (done) {
      kissmetrics.once('load', function () {
        window._kmq.push = sinon.spy();
        setTimeout(done, 1001);
      });
      kissmetrics.initialize();
    });

    it('should send an event', function () {
      kissmetrics.track('event');
      assert(window._kmq.push.calledWith(['record', 'event', {}]));
    });

    it('should send an event and properties', function () {
      kissmetrics.track('event', { property: true });
      assert(window._kmq.push.calledWith(['record', 'event', { property: true }]));
    });

    it('should alias revenue to "Billing Amount"', function () {
      kissmetrics.track('event', { revenue: 9.99 });
      assert(window._kmq.push.calledWith(['record', 'event', { 'Billing Amount': 9.99 }]));
    });
  });

  describe('#alias', function () {
    beforeEach(function (done) {
      kissmetrics.once('load', function () {
        window._kmq.push = sinon.spy();
        setTimeout(done, 1001);
      });
      kissmetrics.initialize();
    });

    it('should send a new id', function () {
      kissmetrics.alias('new');
      assert(window._kmq.push.calledWith(['alias', 'new', undefined]));
    });

    it('should send a new and old id', function () {
      kissmetrics.alias('new', 'old');
      assert(window._kmq.push.calledWith(['alias', 'new', 'old']));
    });
  });

});