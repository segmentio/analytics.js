
describe('Chartbeat', function () {

  var settings = {
    uid: 'x',
    domain: 'example.com'
  };

  var assert = require('assert');
  var Chartbeat = require('analytics/lib/integrations/chartbeat');
  var chartbeat = new Chartbeat(settings);
  var equal = require('equals');
  var sinon = require('sinon');
  var when = require('when');

  afterEach(function () {
    chartbeat.reset();
  });

  it('should have the right settings', function () {
    test(chartbeat)
      .name('Chartbeat')
      .assumesPageview()
      .readyOnLoad()
      .global('_sf_async_config')
      .global('_sf_endpt')
      .global('pSUPERFLY')
      .option('domain', '')
      .option('uid', null);
  });

  describe('#initialize', function () {
    var load;

    beforeEach(function () {
      load = sinon.spy(chartbeat, 'load');
    });

    afterEach(function () {
      load.restore();
      delete window._sf_async_config;
      delete window._sf_endpt;
    });

    it('should create window._sf_async_config', function () {
      chartbeat.initialize();
      assert(equal(window._sf_async_config, settings));
    });

    it('should create window._sf_endpt', function () {
      chartbeat.initialize();
      assert('number' === typeof window._sf_endpt);
    });

    it('should call #load', function () {
      chartbeat.initialize();
      assert(load.called);
    });
  });

  describe('#load', function () {
    it('should create window.pSUPERFLY', function (done) {
      chartbeat.load();
      when(function () { return window.pSUPERFLY; }, done);
    });
  });

  describe('#page', function () {
    var virtualPage;

    before(function (done) {
      chartbeat.initialize();
      chartbeat.once('ready', done);
    });

    beforeEach(function () {
      virtualPage = sinon.spy(window.pSUPERFLY, 'virtualPage');
    });

    afterEach(function () {
      virtualPage.restore();
    });

    it('should send default url', function () {
      chartbeat.page(null, { path: '/path' });
      assert(virtualPage.calledWith('/path'));
    });

    it('should send a url', function () {
      chartbeat.page('Page', { path: '/path' });
      assert(virtualPage.calledWith('/path', 'Page'));
    });
  });

});