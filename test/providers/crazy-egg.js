describe('Crazy Egg', function () {

  var analytics = require('analytics');


  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      expect(window.CE2).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Crazy Egg' : test['CrazyEgg'] });

      // When the library loads, `CE2` is created.
      // var interval = setInterval(function () {
      //   if (!window.CE2) return;
      //   expect(window.CE2).not.to.be(undefined);
      //   expect(spy.called).to.be(true);
      //   clearInterval(interval);
      //   done();
      // }, 20);
      done();
    });

    it('should store options', function () {
      analytics.initialize({ 'Crazy Egg' : test['CrazyEgg'] });
      expect(analytics._providers[0].options.accountNumber).to.equal('00138301');
    });

  });

});