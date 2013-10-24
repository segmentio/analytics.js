
describe('AdRoll', function () {

  var AdRoll = require('analytics/lib/integrations/adroll');
  var assert = require('assert');
  var equal = require('equals');
  var sinon = require('sinon');
  var user = require('analytics/lib/user');
  var when = require('when');
  var noop = function () {};
  var adroll;
  this.timeout(10000);

  var settings = {
    advId: 'LYFRCUIPPZCCTOBGRH7G32',
    pixId: 'V7TLXL5WWBA5NOU5MOJQW4'
  };

  beforeEach(function () {
    adroll = new AdRoll(settings);
  });

  describe('#name', function () {
    it('AdRoll', function () {
      assert(adroll.name == 'AdRoll');
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
    beforeEach(function () {
      // AdRoll js requires these vars to be set for loading
      window.adroll_adv_id = settings.advId;
      window.adroll_pix_id = settings.pixId;
    });

    it('should load window.__adroll', function (done) {
      adroll.load();
      when(function () { return window.__adroll; }, done);
    });

    it('should callback', function (done) {
      adroll.load(done);
    });
  });

  describe('#initialize', function () {
    beforeEach(function () {
      adroll = new AdRoll(settings, noop);
      delete window.adroll_adv_id;
      delete window.adroll_pix_id;
    });

    it('should initialize the adroll variables', function () {
      adroll.initialize();
      assert(window.adroll_adv_id === settings.advId);
      assert(window.adroll_pix_id === settings.pixId);
    });

    it('should call #load', function () {
      var spy = sinon.spy(adroll, 'load');
      adroll.initialize();
      assert(spy.called);
    });

    it('should set custom data', function () {
      user.identify('id', { trait: true });
      adroll.initialize();
      assert(equal(window.adroll_custom_data, {
        id: 'id',
        trait: true
      }));
    });
  });
});