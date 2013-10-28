
describe('AdRoll', function () {
  this.timeout(10000);

  var settings = {
    advId: 'LYFRCUIPPZCCTOBGRH7G32',
    pixId: 'V7TLXL5WWBA5NOU5MOJQW4'
  };

  var AdRoll = require('analytics/lib/integrations/adroll');
  var adroll = new AdRoll(settings);
  var assert = require('assert');
  var equal = require('equals');
  var sinon = require('sinon');
  var user = require('analytics/lib/user');
  var when = require('when');

  describe('#name', function () {
    it('AdRoll', function () {
      assert(adroll.name === 'AdRoll');
    });
  });

  describe('#_assumesPageview', function () {
    it('should be true', function () {
      assert(adroll._assumesPageview === true);
    });
  });

  describe('#_readyOnLoad', function () {
    it('should be true', function () {
      assert(adroll._readyOnLoad === true);
    });
  });

  describe('#defaults', function () {
    it('advId', function () {
      assert(adroll.defaults.advId === '');
    });

    it('pixId', function () {
      assert(adroll.defaults.pixId === '');
    });
  });

  describe('#exists', function () {
    after(function () {
      window.__adroll_loaded = undefined;
    });

    it('should check for window.__adroll_loaded', function () {
      window.__adroll_loaded = false;
      assert(!adroll.exists());
      window.__adroll_loaded = true;
      assert(adroll.exists());
    });
  });

  describe('#load', function () {
    before(function () {
      // required for load to work
      window.adroll_adv_id = settings.advId;
      window.adroll_pix_id = settings.pixId;
    });

    after(function () {
      window.adroll_adv_id = undefined;
      window.adroll_pix_id = undefined;
    });

    it('should create window.__adroll', function (done) {
      assert(!window.__adroll);
      adroll.load();
      when(function () { return window.__adroll; }, done);
    });

    it('should callback', function (done) {
      adroll.load(done);
    });
  });

  describe('#initialize', function () {
    var load;

    beforeEach(function () {
      load = sinon.spy(adroll, 'load');
    });

    afterEach(function () {
      user.reset();
      load.restore();
      window.__adroll_loaded = undefined;
    });

    it('should initialize the adroll variables', function () {
      adroll.initialize();
      assert(window.adroll_adv_id === settings.advId);
      assert(window.adroll_pix_id === settings.pixId);
    });

    it('should set custom data', function () {
      user.identify('id', { trait: true });
      adroll.initialize();
      assert(equal(window.adroll_custom_data, { id: 'id', trait: true }));
    });

    it('should set window.__adroll_loaded', function () {
      adroll.initialize();
      assert(window.__adroll_loaded === true);
    });

    it('should call #load', function () {
      adroll.initialize();
      assert(load.called);
    });
  });

});