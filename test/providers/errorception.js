describe('Errorception', function () {


  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      var spy  = sinon.spy()
        , push = Array.prototype.push;

      expect(window._errs).to.be(undefined);

      analytics.ready(spy);
      analytics.initialize({ 'Errorception' : test['Errorception'] });

      // Errorception sets up a queue, so it's ready immediately.
      expect(window._errs).not.to.be(undefined);
      expect(window._errs.push).to.equal(push);
      expect(spy.called).to.be(true);

      // When the library loads, it will overwrite the push method.
      var interval = setInterval(function () {
        if (window._errs.push === push) return;
        expect(window._errs.push).not.to.equal(push);
        clearInterval(interval);
        done();
      }, 20);
    });

    it('should store options', function () {
      analytics.initialize({ 'Errorception' : test['Errorception'] });
      var options = analytics.providers[0].options;
      expect(options.projectId).to.equal(test['Errorception']);
    });

    it('should call the old onerror when an error happens', function () {
      var spy = sinon.spy()
      window.onerror = spy;

      analytics.initialize({ 'Errorception' : test['Errorception'] });
      window.onerror('asdf', 'asdf');

      expect(spy.called).to.be(true);
      expect(spy.calledWith('asdf', 'asdf')).to.be(true);
    });

  });


  describe('identify', function () {

    it('should add metadata', function () {
      var extend = require('segmentio-extend');

      expect(window._errs.meta).to.be(undefined);

      analytics.providers[0].options.meta = true;
      analytics.identify(test.userId, test.traits);

      expect(window._errs.meta).to.eql(extend({}, test.traits, { id : test.userId }));
    });

    it('shouldnt add metadata', function () {
      window._errs.meta = undefined;

      analytics.providers[0].options.meta = false;
      analytics.identify(test.userId, test.traits);

      expect(window._errs.meta).to.be(undefined);
    });

  });

});