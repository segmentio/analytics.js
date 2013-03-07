
describe('Clicky', function () {

  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      expect(window.clicky).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Clicky' : test['Clicky'] });

      // Once the library loads, `window.clicky` is defined.
      var interval = setInterval(function () {
        if (!window.clicky) return;
        expect(window.clicky).not.to.be(undefined);
        expect(spy.called).to.be(true);
        clearInterval(interval);
        done();
      }, 20);
    });

    it('should store options', function () {
      analytics.initialize({ 'Clicky' : test['Clicky'] });
      var options = analytics.providers[0].options;
      expect(options.siteId).to.equal(test['Clicky']);
    });

  });


  describe('track', function () {

    it('should call log', function () {
      var spy = sinon.spy(window.clicky, 'log');
      analytics.track(test.event, test.properties);
      expect(spy.calledWith(window.location.href, test.event)).to.be(true);

      spy.restore();
    });

  });

});