
describe('Pingdom', function () {

  var Pingdom = require('analytics/lib/integrations/pingdom');
  var assert = require('assert');
  var date = require('load-date');
  var equal = require('equals');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var when = require('when');

  var pingdom;
  var settings = {
    id: '5168f8c6abe53db732000000'
  };

  beforeEach(function () {
    pingdom = new Pingdom(settings);
    pingdom.initialize(); // noop
  });

  afterEach(function () {
    pingdom.reset();
  });

  it('should have the right settings', function () {
    test(pingdom)
      .name('Pingdom')
      .assumesPageview()
      .readyOnLoad()
      .global('_prum')
      .option('id', '');
  });

  describe('#initialize', function () {
    it('should call #load', function () {
      pingdom.load = sinon.spy();
      pingdom.initialize();
      assert(pingdom.load.called);
    });

    it('should push the id onto window._prum', function () {
      window._prum = [];
      window._prum.push = sinon.spy();
      pingdom.initialize();
      assert(window._prum.push.calledWith(['id', settings.id]));
    });

    it('should send first byte time to Pingdom', function () {
      pingdom.initialize();
      pingdom.on('ready', function () {
        assert(date.getTime() == window.PRUM_EPISODES.marks.firstbyte);
      });
    });
  });

  describe('#load', function () {
    it('should create window._prum', function (done) {
      pingdom.load();
      when(function () { return window._prum; }, done);
    });

    it('should callback', function (done) {
      pingdom.load(done);
    });
  });
});