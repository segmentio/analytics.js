
describe('AdRoll', function () {

  var AdRoll = require('analytics/lib/integrations/adroll');
  var assert = require('assert');
  var equal = require('equals');
  var sinon = require('sinon');
  var tick = require('next-tick');
  var user = require('analytics/lib/user');
  var when = require('when');

  this.timeout(10000);

  var adroll;
  var settings = {
    advId: 'LYFRCUIPPZCCTOBGRH7G32',
    pixId: 'V7TLXL5WWBA5NOU5MOJQW4'
  };

  beforeEach(function () {
    adroll = new AdRoll(settings);
  });

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

  describe('#defaults', function () {
    it('advId', function () {
      assert(adroll.defaults.advId === '');
    });

    it('pixId', function () {
      assert(adroll.defaults.pixId === '');
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

    it('should load window.__adroll', function (done) {
      adroll.load();
      when(function () { return window.__adroll; }, done);
    });

    it('should emit ready', function (done) {
      adroll.once('ready', done);
      adroll.load();
    });

    it('should callback', function (done) {
      adroll.load(done);
    });
  });

  describe('#exists', function () {
    it('should check for __adroll_loaded', function () {
      window.__adroll_loaded = true;
      assert(adroll.exists());
      window.__adroll_loaded = false;
      assert(!adroll.exists());
    });
  });

  describe('#initialize', function () {
    var load, emit;

    beforeEach(function () {
      load = sinon.spy(adroll, 'load');
      emit = sinon.spy(adroll, 'emit');
    });

    afterEach(function () {
      user.reset();
      load.restore();
      emit.restore();
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

    it('should set __adroll_loaded', function () {
      adroll.initialize();
      assert(window.__adroll_loaded === true);
    });

    it('should call #load', function () {
      adroll.initialize();
      assert(load.called);
    });
  });

});