
describe('BugHerd', function () {

  var settings = {
    apiKey: '7917d741-16cc-4c2b-bb1a-bdd903d53d72'
  };

  var assert = require('assert');
  var BugHerd = require('analytics/lib/integrations/bugherd');
  var bugherd = new BugHerd(settings);
  var equal = require('equals');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var when = require('when');

  afterEach(function () {
    bugherd.reset();
  });

  it('should have the right settings', function () {
    test(bugherd)
      .name('BugHerd')
      .assumesPageview()
      .readyOnLoad()
      .global('BugHerdConfig')
      .global('_bugHerd')
      .option('apiKey', '')
      .option('showFeedbackTab', true);
  });

  describe('#load', function () {
    it('should create window._bugHerd', function (done) {
      assert(!window._bugHerd);
      bugherd.load();
      when(function () { return window._bugHerd; }, done);
    });

    it('should callback', function (done) {
      bugherd.load(done);
    });
  });

  describe('#initialize', function () {
    var load;

    beforeEach(function () {
      load = sinon.spy(bugherd, 'load');
    });

    afterEach(function () {
      load.restore();
      window.BugHerdConfig = undefined;
      bugherd.options.showFeedbackTab = true;
    });

    it('should create window.BugHerdConfig', function () {
      bugherd.initialize();
      assert(equal(window.BugHerdConfig, { feedback: { hide: false }}));
    });

    it('should be able to hide the tab', function () {
      bugherd.options.showFeedbackTab = false;
      bugherd.initialize();
      assert(equal(window.BugHerdConfig, { feedback: { hide: true }}));
    });

    it('should call #load', function () {
      bugherd.initialize();
      assert(load.called);
    });
  });

});