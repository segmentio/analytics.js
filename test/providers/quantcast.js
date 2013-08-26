describe('Quantcast', function () {

  var analytics = require('analytics');


  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      var spy  = sinon.spy()
        , push = Array.prototype.push;

      expect(window._qevents).to.be(undefined);

      analytics.ready(spy);
      analytics.initialize({ 'Quantcast' : test['Quantcast'] });

      expect(window._qevents).not.to.be(undefined);
      expect(window._qevents.push).to.equal(push);

      // When the library loads, it will overwrite the push method.
      var interval = setInterval(function () {
        if (window._qevents.push === push) return;
        expect(window._qevents.push).not.to.equal(push);
        expect(window.__qc).not.to.be(undefined);
        expect(spy.called).to.be(true);
        clearInterval(interval);
        done();
      }, 20);
    });

    it('should store options', function () {
      analytics.initialize({ 'Quantcast' : test['Quantcast'] });
      expect(analytics._providers[0].options.pCode).to.equal(test['Quantcast']);
    });

  });

});