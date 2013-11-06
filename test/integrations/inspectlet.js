
describe('Inspectlet', function () {

  var assert = require('assert');
  var Inspectlet = require('analytics/lib/integrations/inspectlet');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var when = require('when');

  var inspectlet;
  var settings = {
    wid: 'x'
  };

  beforeEach(function () {
    inspectlet = new Inspectlet(settings);
    inspectlet.initialize(); // noop
  });

  afterEach(function () {
    var global = window.__insp;
    inspectlet.reset();
    window.__insp = global; // keep around for jsonp callbacks
  });

  it('should have the right settings', function () {
    test(inspectlet)
      .name('Inspectlet')
      .assumesPageview()
      .readyOnLoad()
      .global('__insp')
      .option('wid', '');
  });

  describe('#initialize', function () {
    beforeEach(function () {
      inspectlet.load = sinon.spy(); // prevent loading
    });

    it('should create the inspectlet queue', function () {
      assert(!window.__insp);
      inspectlet.initialize();
      assert(window.__insp);
    });

    it('should push the wid', function () {
      window.__insp = [];
      window.__insp.push = sinon.spy();
      inspectlet.initialize();
      assert(window.__insp.push.calledWith(['wid', settings.wid]));
    });

    it('should call #load', function () {
      inspectlet.initialize();
      assert(inspectlet.load.called);
    });
  });

  describe('#load', function () {
    it('should create window.__insp_', function (done) {
      assert(!window.__insp_);
      inspectlet.load();
      when(function () { return window.__insp_; }, done);
    });

    it('should callback', function (done) {
      inspectlet.load(done);
    });
  });

});