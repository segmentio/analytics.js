
describe('Inspectlet', function () {

  var assert = require('assert');
  var equal = require('equals');
  var Inspectlet = require('analytics/lib/integrations/inspectlet');
  var sinon = require('sinon');
  var test = require('integration-tester');

  var inspectlet;
  var open = XMLHttpRequest.prototype.open;
  var settings = {
    wid: 'x'
  };

  beforeEach(function () {
    inspectlet = new Inspectlet(settings);
    inspectlet.initialize(); // noop
  });

  afterEach(function () {
    inspectlet.reset();
  });

  after(function () {
    XMLHttpRequest.prototype.open = open; // inspectlet clobbers it
  });

  it('should have the right settings', function () {
    test(inspectlet)
      .name('Inspectlet')
      .assumesPageview()
      .readyOnLoad()
      .global('__insp')
      .global('__insp_')
      .option('wid', '');
  });

  describe('#initialize', function () {
    beforeEach(function () {
      inspectlet.load = sinon.spy();
    });

    it('should create the inspectlet queue', function () {
      assert(!window.__insp);
      inspectlet.initialize();
      assert(window.__insp);
    });

    it('should push the wid', function () {
      inspectlet.initialize();
      assert(equal(window.__insp, [['wid', settings.wid]]));
    });

    it('should call #load', function () {
      inspectlet.initialize();
      assert(inspectlet.load.called);
    });
  });

  describe('#load', function () {
    beforeEach(function () {
      sinon.stub(inspectlet, 'load');
      inspectlet.initialize();
      inspectlet.load.restore();
    });

    it('should create window.__insp_', function (done) {
      assert(!window.__insp_);
      inspectlet.load(function () {
        assert(window.__insp_);
        done();
      });
    });
  });

});