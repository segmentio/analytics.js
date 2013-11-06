
describe('Spinnakr', function () {

  var assert = require('assert');
  var sinon = require('sinon');
  var Spinnakr = require('analytics/lib/integrations/spinnakr');
  var test = require('integration-tester');
  var when = require('when');

  var spinnakr;
  var settings = {
    siteId: '668925604'
  };

  beforeEach(function () {
    // needed for spinnakr's script to set a global we can read
    window._spinnakr_development = true;
    spinnakr = new Spinnakr(settings);
    spinnakr.initialize(); // noop
  });

  afterEach(function () {
    spinnakr.reset();
    delete window._spinnakr_development;
  });

  it('should store the right settings', function () {
    test(spinnakr)
      .name('Spinnakr')
      .assumesPageview()
      .readyOnLoad()
      .global('_spinnakr_site_id')
      .global('_spinnakr')
      .option('siteId', '');
  });

  describe('#initialize', function () {
    it('should set window._spinnakr_site_id', function () {
      assert(!window._spinnakr_site_id);
      spinnakr.initialize();
      assert(window._spinnakr_site_id === settings.siteId);
    });

    it('should call #load', function () {
      spinnakr.load = sinon.spy();
      spinnakr.initialize();
      assert(spinnakr.load.called);
    });
  });

  describe('#load', function () {
    it('should set window._spinnakr', function (done) {
      assert(!window._spinnakr);
      spinnakr.load();
      when(function () { return window._spinnakr; }, done);
    });

    it('should call the callback', function (done) {
      spinnakr.load(done);
    });
  });
});