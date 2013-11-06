
describe('LeadLander', function () {

  var assert = require('assert');
  var LeadLander = require('analytics/lib/integrations/leadlander');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var when = require('when');

  var leadlander;
  var settings = {
    accountId: 'x'
  };

  beforeEach(function () {
    leadlander = new LeadLander(settings);
    leadlander.initialize(); // noop
  });

  afterEach(function () {
    leadlander.reset();
  });

  it('should have the right settings', function () {
    test(leadlander)
      .name('LeadLander')
      .assumesPageview()
      .readyOnLoad()
      .global('llactid')
      .global('trackalyzer')
      .option('accountId', null);
  });

  describe('#initialize', function () {
    beforeEach(function () {
      leadlander.load = sinon.spy(); // prevent loading
    });

    it('should set window.llactid', function () {
      leadlander.initialize();
      assert(window.llactid === settings.accountId);
    });

    it('should call #load', function () {
      leadlander.initialize();
      assert(leadlander.load.called);
    });
  });

  describe('#load', function () {
    it('should create window.trackalyzer', function (done) {
      assert(!window.trackalyzer);
      leadlander.load();
      when(function () { return window.trackalyzer; }, done);
    });

    it('should callback', function (done) {
      leadlander.load(done);
    });
  });

});