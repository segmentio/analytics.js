describe('Yandex Metrica', function () {

  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      var yandex_callback = "yandex_metrika_callbacks";
      expect(window[yandex_callback]).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Yandex Metrica' : test['Yandex Metrica'] });
      expect(spy.called).to.be(true);

      expect(spy.called).to.be(true);
      expect(window[yandex_callback]).not.to.be(undefined);

      // When the library loads, push will be overriden.
      var interval = setInterval(function () {
        if (!window.yaCounter) return;
        expect(window.yaCounter).not.to.be(undefined);
        clearInterval(interval);
        done();
      }, 20);
    });
  });
});
