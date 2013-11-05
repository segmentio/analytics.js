
describe('Errorception', function () {

  var assert = require('assert');
  var equal = require('equals');
  var Errorception = require('analytics/lib/integrations/errorception');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var when = require('when');

  var errorception;
  var settings = {
    projectId: '506b76b52f52c3f662000140'
  };

  beforeEach(function () {
    errorception = new Errorception(settings);
    errorception.initialize(); // noop
  });

  afterEach(function () {
    errorception.reset();
  });

  it('should have the right settings', function () {
    test(errorception)
      .name('Errorception')
      .assumesPageview()
      .readyOnInitialize()
      .global('_errs')
      .option('projectId', '')
      .option('meta', true);
  });

  describe('#initialize', function () {
    beforeEach(function () {
      errorception.load = sinon.spy(); // prevent loading
    });

    it('should initialize the errorception queue', function () {
      errorception.initialize();
      assert(equal(window._errs, [settings.projectId]));
    });

    it('should setup an onerror handler', function () {
      window._errs.push = sinon.spy();
      errorception.initialize();
      window.onerror('event');
      assert(window._errs.push.calledWith('event'));
    });

    it('should call #load', function () {
      errorception.initialize();
      assert(errorception.load.called);
    });
  });

  describe('#load', function () {
    beforeEach(function () {
      // required for load to work
      window.adroll_adv_id = settings.advId;
      window.adroll_pix_id = settings.pixId;
    });

    it('should create window._errs', function (done) {
      assert(!window._errs);
      adroll.load();
      when(function () { return window._errs; }, done);
    });

    it('should callback', function (done) {
      adroll.load(done);
    });
  });

  describe('#identify', function () {
    it('should add an id to metadata', function () {
      errorception.identify('id');
      assert(equal(window._errs.meta, { id: 'id' }));
    });

    it('should add traits to metadata', function () {
      errorception.identify(null, { trait: true });
      assert(equal(window._errs.meta, { trait: true }));
    });

    it('should add an id and traits to metadata', function () {
      errorception.identify('id', { trait: true });
      assert(equal(window._errs.meta, { id: 'id', trait: true }));
    });

    it('should not add to metadata when meta option is false', function () {
      this.options.meta = false;
      errorception.identify('id');
      assert(!window._errs.meta);
    });
  });

});