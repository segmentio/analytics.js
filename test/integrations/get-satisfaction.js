
describe('Get Satisfaction', function () {

  var assert = require('assert');
  var equal = require('equals');
  var GetSatisfaction = require('analytics/lib/integrations/get-satisfaction');
  var jquery = require('jquery');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var when = require('when');

  var getsatisfaction;
  var settings = {
    widgetId: 5005
  };

  beforeEach(function () {
    getsatisfaction = new GetSatisfaction(settings);
    getsatisfaction.initialize(); // noop
  });

  afterEach(function () {
    getsatisfaction.reset();
  });

  it('should have the right settings', function () {
    test(getsatisfaction)
      .name('Get Satisfaction')
      .assumesPageview()
      .readyOnLoad()
      .global('GSFN')
      .option('widgetId', '');
  });

  describe('#initialize', function () {
    it('should add the get satisfaction widget to the dom', function () {
      getsatisfaction.initialize();
      assert(document.getElementById('getsat-widget-' + settings.widgetId));
    });

    it('should call #load', function () {
      getsatisfaction.load = sinon.spy();
      getsatisfaction.initialize();
      assert(getsatisfaction.load.called);
    });
  });

  describe('#load', function () {
    it('should create window.GSFN', function (done) {
      assert(!window.GSFN);
      getsatisfaction.load();
      when(function () { return window.GSFN; }, done);
    });

    it('should callback', function (done) {
      getsatisfaction.load(done);
    });
  });

});