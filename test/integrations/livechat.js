
describe('LiveChat', function () {

  var assert = require('assert');
  var equal = require('equals');
  var LiveChat = require('analytics/lib/integrations/livechat');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var when = require('when');

  var livechat;
  var settings = {
    license: '1520'
  };

  beforeEach(function () {
    livechat = new LiveChat(settings);
    livechat.initialize(); // noop
  });

  afterEach(function () {
    livechat.reset();
  });

  it('should have the right settings', function () {
    test(livechat)
      .name('LiveChat')
      .assumesPageview()
      .readyOnLoad()
      .global('__lc')
      .option('license', '');
  });

  describe('#initialize', function () {
    beforeEach(function () {
      livechat.load = sinon.spy(); // prevent loading
    });

    it('should create window.__lc', function () {
      assert(!window.__lc);
      livechat.initialize();
      assert(equal(window.__lc, { license: settings.license }));
    });

    it('should call #load', function () {
      livechat.initialize();
      assert(livechat.load.called);
    });
  });

  describe('#load', function () {
    it('should create window.LC_API', function (done) {
      assert(!window.LC_API);
      livechat.load();
      when(function () { return window.LC_API; }, done);
    });

    it('should callback', function (done) {
      livechat.load(done);
    });
  });

  describe('#identify', function () {
    beforeEach(function () {
      livechat.initialize();
      window.LC_API.set_custom_variables = sinon.spy();
    });

    it('should send an id', function () {
      livechat.identify('id');
      assert(window.LC_API.set_custom_variables.calledWith([
        { name: 'User ID', value: 'id' }
      ]));
    });

    it('should send traits', function () {
      livechat.identify(null, { trait: true });
      assert(window.LC_API.set_custom_variables.calledWith([
        { name: 'trait', value: true }
      ]));
    });

    it('should send an id and traits', function () {
      livechat.identify('id', { trait: true });
      assert(window.LC_API.set_custom_variables.calledWith([
        { name: 'trait', value: true },
        { name: 'User ID', value: 'id' }
      ]));
    });
  });

});