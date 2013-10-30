
describe('Yandex Metrica', function () {
  this.timeout(10000);

  var settings = {
    counterId: 22522351
  };

  var Yandex = require('analytics/lib/integrations/yandex-metrica');
  var yandex = new Yandex(settings);
  var assert = require('assert');
  var sinon = require('sinon');
  var when = require('when');

  describe('#name', function () {
    it('Yandex Metrica', function () {
      assert(yandex.name === 'Yandex Metrica');
    });
  });

  describe('#_assumesPageview', function () {
    it('should be true', function () {
      assert(yandex._assumesPageview === true);
    });
  });

  describe('#_readyOnInitialize', function () {
    it('should be true', function () {
      assert(yandex._readyOnInitialize === true);
    });
  });

  describe('#defaults', function () {
    it('counterId', function () {
      assert(yandex.defaults.counterId === null);
    });
  });

  describe('#exists', function () {
    afterEach(function () {
      window.yandex_metrika_callbacks = undefined;
      window.Ya = undefined;
    });

    it('should check for window.yandex_metrika_callbacks', function () {
      window.yandex_metrika_callbacks = false;
      assert(!yandex.exists());
      window.yandex_metrika_callbacks = true;
      assert(yandex.exists());
    });

    it('should check for window.Ya.Metrika', function () {
      window.Ya = { Metrika: false };
      assert(!yandex.exists());
      window.Ya.Metrika = true;
      assert(yandex.exists());
    })
  });

  describe('#load', function () {
    it('should create the window.Ya.Metrika variable', function (done) {
      yandex.load();
      when(function () { return window.Ya && window.Ya.Metrika; }, done);
    });

    it('should callback', function (done) {
      yandex.load(done);
    });
  });

  describe('#initialize', function () {
    var load;

    beforeEach(function () {
      load = sinon.spy(yandex, 'load');
      delete window.Ya;
      delete window.yandex_metrika_callbacks;
    });

    afterEach(function () {
      load.restore();
    });

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
      yandex.initialize();
      assert(load.called);
    });
  });
});
