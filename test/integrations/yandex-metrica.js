
describe('Yandex Metrica', function () {

  var assert = require('assert');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var when = require('when');
  var Yandex = require('analytics/lib/integrations/yandex-metrica');

  var yandex;
  var settings = {
    counterId: 22522351
  };

  beforeEach(function () {
    yandex = new Yandex(settings);
  });

  afterEach(function () {
    yandex.reset();
    window['yaCounter' + settings.counterId] = undefined;
  });

  it('should have the right settings', function () {
    test(yandex)
      .name('Yandex Metrica')
      .assumesPageview()
      .readyOnInitialize()
      .global('yandex_metrika_callbacks')
      .global('Ya')
      .option('counterId', null);
    });

  describe('#initialize', function () {
    it('should push onto the yandex_metrica_callbacks', function () {
      assert(!window.yandex_metrika_callbacks);
      yandex.initialize();
      assert(window.yandex_metrika_callbacks.length === 1);
    });

    it('should create a yaCounter object', function (done) {
      var id = yandex.options.counterId;
      yandex.initialize();
      when(function () { return window['yaCounter' + id]; }, done);
    });

    it('should call #load', function () {
      yandex.load = sinon.spy();
      yandex.initialize();
      assert(yandex.load.called);
    });
  });

  describe('#load', function () {
    it('should create the window.Ya.Metrika variable', function (done) {
      assert(!window.Ya);
      yandex.load();
      when(function () { return window.Ya && window.Ya.Metrika; }, done);
    });

    it('should callback', function (done) {
      yandex.load(done);
    });
  });

});
