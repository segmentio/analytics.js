
describe('AdRoll', function () {

  var AdRoll = require('analytics/lib/integrations/adroll');
  var assert = require('assert');
  var equal = require('equals');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var user = require('analytics/lib/user');
  var when = require('when');

  var adroll;
  var settings = {
    advId: 'LYFRCUIPPZCCTOBGRH7G32',
    pixId: 'V7TLXL5WWBA5NOU5MOJQW4'
  };

  beforeEach(function () {
    adroll = new AdRoll(settings);
    adroll.initialize(); // noop
  });

  afterEach(function () {
    adroll.reset();
    user.reset();
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

  describe('#initialize', function () {
    beforeEach(function () {
      adroll.load = sinon.spy();
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
      assert(adroll.load.called);
    });
  });

  describe('#load', function () {
    beforeEach(function () {
      sinon.stub(adroll, 'load');
      adroll.initialize();
      adroll.load.restore();
    });

    it('should create window.__adroll', function (done) {
      assert(!window.__adroll);
      adroll.load(function (err) {
        if (err) return done(err);
        assert(window.__adroll);
        done();
      });
    });
  });

});