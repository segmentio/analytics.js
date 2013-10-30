
describe('AdRoll', function () {

  var settings = {
    advId: 'LYFRCUIPPZCCTOBGRH7G32',
    pixId: 'V7TLXL5WWBA5NOU5MOJQW4'
  };

  var AdRoll = require('analytics/lib/integrations/adroll');
  var adroll = new AdRoll(settings);
  var assert = require('assert');
  var equal = require('equals');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var user = require('analytics/lib/user');
  var when = require('when');

  afterEach(function () {
    adroll.reset();
  });

  it('should have the right settings', function () {
    test(adroll)
      .name('AdRoll')
      .assumesPageview()
      .readyOnLoad()
      .global('__adroll_loaded')
      .global('adroll_adv_id')
      .global('adroll_pix_id')
      .global('adroll_custom_data')
      .option('advId', '')
      .option('pixId', '');
  });

  describe('#load', function () {
    beforeEach(function () {
      // required for load to work
      window.adroll_adv_id = settings.advId;
      window.adroll_pix_id = settings.pixId;
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