
describe('Clicky', function () {

  describe('initialize', function () {

    // Clicky loads very slowly on travis, so we get smart and check it on an
    // interval so that we wait for the shortest time possible.
    it('should call ready and load library', function (done) {
      this.timeout(10000);
      expect(window.clicky).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Clicky' : test['Clicky'] });
      var interval = setInterval(function () {
        if (window.clicky) {
          clearInterval(interval);
          expect(window.clicky).not.to.be(undefined);
          expect(spy.called).to.be(true);
          done();
        }
      }, 1900);
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