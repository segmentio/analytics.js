var analytics = require('analytics');


describe('USERcycle', function () {

  describe('initialize', function () {

    it('should call ready and load library', function () {
      expect(window._uc).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'USERcycle' : test['USERcycle'] });
      expect(window._uc).not.to.be(undefined);
      expect(spy.called).to.be(true);
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
      expect(spy.calledWith(['uid', test.userId, sinon.match(test.traits)])).to.be(true);

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