describe('USERcycle', function () {


  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      var spy  = sinon.spy()
        , push = Array.prototype.push;

      expect(window._uc).to.be(undefined);

      analytics.ready(spy);
      analytics.initialize({ 'USERcycle' : test['USERcycle'] });

      expect(window._uc).not.to.be(undefined);
      expect(window._uc.push).to.equal(push);
      expect(spy.called).to.be(true);

      // When the library loads, it will overwrite the push method.
      var interval = setInterval(function () {
        if (window._uc.push === push) return;
        expect(window._uc.push).not.to.equal(push);
        clearInterval(interval);
        done();
      }, 20);
    });

    it('should store options', function () {
      analytics.initialize({ 'USERcycle' : test['USERcycle'] });
      expect(analytics.providers[0].options.key).to.equal('x');
    });

  });


  describe('identify', function () {

    it('calls identify on identify', function () {
      var spy = sinon.spy(window._uc, 'push');
      analytics.identify(test.userId, test.traits);
      expect(spy.calledWith(['uid', test.userId])).to.be(true);
      expect(spy.calledWith(['action', 'came_back', sinon.match(test.traits)])).to.be(true);

      spy.restore();
    });

  });


  describe('track', function () {

    it('calls track on track', function () {
      var spy = sinon.spy(window._uc, 'push');
      analytics.track(test.event, test.properties);
      expect(spy.calledWith(['action', test.event, sinon.match(test.properties)])).to.be(true);

      spy.restore();
    });

  });

});