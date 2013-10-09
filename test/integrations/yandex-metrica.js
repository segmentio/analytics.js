
describe('Yandex Metrica', function () {

  var analytics = window.analytics || require('analytics')
    , assert = require('assert')
    , sinon = require('sinon')
    , when = require('when');

  var settings = {
    counterId: 22522351
  };

  before(function (done) {
    this.timeout(10000);
    this.spy = sinon.spy();
    analytics.ready(this.spy);
    analytics.initialize({ 'Yandex Metrica': settings });
    this.integration = analytics._integrations['Yandex Metrica'];
    this.options = this.integration.options;
    when(function () { return window['yaCounter' + settings.counterId]; }, done);
  });

  describe('#name', function () {
    it('Yandex Metrica', function () {
      assert(this.integration.name == 'Yandex Metrica');
    });
  });

  describe('#key', function () {
    it('counterId', function () {
      assert(this.integration.key == 'counterId');
    });
  });

  describe('#defaults', function () {
    it('counterId', function () {
      assert(this.integration.defaults.counterId === null);
    });
  });

  describe('#initialize', function () {
    it('should call ready', function () {
      assert(this.spy.called);
    });
  });
});
