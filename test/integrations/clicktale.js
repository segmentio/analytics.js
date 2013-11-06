
describe('ClickTale', function () {

  var assert = require('assert');
  var ClickTale = require('analytics/lib/integrations/clicktale');
  var date = require('load-date');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var when = require('when');

  var clicktale;
  var settings = {
    partitionId: 'www14',
    projectId: '19370',
    recordingRatio: '0.0089'
  };

  beforeEach(function () {
    clicktale = new ClickTale(settings);
    clicktale.initialize(); // noop
  });

  afterEach(function () {
    clicktale.reset();
  });

  it('should have the right settings', function () {
    test(clicktale)
      .name('ClickTale')
      .assumesPageview()
      .readyOnLoad()
      .global('WRInitTime')
      .option('httpCdnUrl', 'http://s.clicktale.net/WRe0.js')
      .option('httpsCdnUrl', '')
      .option('projectId', '')
      .option('recordingRatio', 0.01)
      .option('partitionId', '');
  });

  describe('#initialize', function () {
    it('should store the load time', function () {
      assert(!window.WRInitTime);
      clicktale.initialize();
      assert('number' === typeof window.WRInitTime);
    });

    it('should append the clicktale div', function () {
      clicktale.initialize();
      assert(document.getElementById('ClickTaleDiv'));
    });

    it('should call #load', function () {
      clicktale.load = sinon.spy();
      clicktale.initialize();
      assert(clicktale.load.called);
    });
  });

  describe('#load', function () {
    it('should create window.ClickTale', function (done) {
      assert(!window.ClickTale);
      clicktale.load();
      when(function () { return window.ClickTale; }, done);
    });

    it('should callback', function (done) {
      clicktale.load(done);
    });
  });

  describe('#identify', function () {
    beforeEach(function () {
      window.ClickTaleSetUID = sinon.spy();
      window.ClickTaleField = sinon.spy();
    });

    it('should send an id', function () {
      clicktale.identify('id');
      assert(window.ClickTaleSetUID.calledWith('id'));
    });

    it('should send traits', function () {
      clicktale.identify(null, { trait: true });
      assert(window.ClickTaleField.calledWith('trait', true));
    });

    it('should send an id and traits', function () {
      clicktale.identify('id', { trait: true });
      assert(window.ClickTaleSetUID.calledWith('id'));
      assert(window.ClickTaleField.calledWith('trait', true));
    });
  });

  describe('#track', function () {
    beforeEach(function () {
      window.ClickTaleEvent = sinon.spy();
    });

    it('should send an event', function () {
      clicktale.track('event');
      assert(window.ClickTaleEvent.calledWith('event'));
    });
  });

});
