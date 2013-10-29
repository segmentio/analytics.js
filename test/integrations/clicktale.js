
describe('ClickTale', function () {
  this.timeout(10000);

  var settings = {
    partitionId: 'www14',
    projectId: '19370',
    recordingRatio: '0.0089'
  };

  var assert = require('assert');
  var date = require('load-date');
  var sinon = require('sinon');
  var user = require('analytics/lib/user');
  var when = require('when');
  var ClickTale = require('analytics/lib/integrations/clicktale');
  var clicktale = new ClickTale(settings);


  describe('#name', function () {
    it('ClickTale', function () {
      assert(clicktale.name == 'ClickTale');
    });
  });

  describe('#_assumesPageview', function () {
    it('should be true', function () {
      assert(clicktale._assumesPageview === true);
    });
  });

  describe('#_readyOnLoad', function () {
    it('should be true', function () {
      assert(clicktale._readyOnLoad === true);
    });
  });

  describe('#defaults', function () {
    it('httpCdnUrl', function () {
      assert(clicktale.defaults.httpCdnUrl === 'http://s.clicktale.net/WRe0.js');
    });

    it('httpsCdnUrl', function () {
      assert(clicktale.defaults.httpsCdnUrl === '');
    });

    it('partitionId', function () {
      assert(clicktale.defaults.partitionId === '');
    });

    it('projectId', function () {
      assert(clicktale.defaults.projectId === '');
    });

    it('recordingRatio', function () {
      assert(clicktale.defaults.recordingRatio === 0.01);
    });
  });

  describe('#exists', function () {
    after(function () {
      delete window.WRInitTime;
    });

    it('should check for window.WRInitTime', function () {
      window.WRInitTime = undefined;
      assert(!clicktale.exists());
      window.WRInitTime = 1;
      assert(clicktale.exists());
    });
  });

  describe('#load', function () {
    it('should create window.ClickTale', function (done) {
      clicktale.load();
      when(function () { return window.ClickTale; }, done);
    });

    it('should callback', function (done) {
      clicktale.load(done);
    });
  });

  describe('#initialize', function () {
    var load;

    beforeEach(function () {
      load = sinon.spy(clicktale, 'load');
      window.WRInitTime = undefined;
    });

    afterEach(function () {
      load.restore();
    });

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
      clicktale.initialize();
      assert(load.called);
    });
  });

  describe('#identify', function () {
    var ClickTaleSetUID, ClickTaleField;

    beforeEach(function () {
      ClickTaleSetUID = sinon.spy(window, 'ClickTaleSetUID');
      ClickTaleField = sinon.spy(window, 'ClickTaleField');
    });

    afterEach(function () {
      user.reset();
      ClickTaleSetUID.restore();
      ClickTaleField.restore();
    });

    it('should send an id', function () {
      clicktale.identify('id');
      assert(ClickTaleSetUID.calledWith('id'));
    });

    it('should send traits', function () {
      clicktale.identify(null, { trait: true });
      assert(ClickTaleField.calledWith('trait', true));
    });

    it('should send an id and traits', function () {
      clicktale.identify('id', { trait: true });
      assert(ClickTaleSetUID.calledWith('id'));
      assert(ClickTaleField.calledWith('trait', true));
    });
  });

  describe('#track', function () {
    var ClickTaleEvent;

    beforeEach(function () {
      ClickTaleEvent = sinon.spy(window, 'ClickTaleEvent');
    });

    afterEach(function () {
      ClickTaleEvent.restore();
    });

    it('should send an event', function () {
      clicktale.track('event');
      assert(ClickTaleEvent.calledWith('event'));
    });
  });

});
