/*
 * Config passed:
 *
 * 'Tapstream' : {
 *   accountName: 'tapstreamTestAccount',
 *   trackerName: 'js_tracker',
 *   tags: ['x', 'y'],
 *   initialPageview: true
 * },
*/
describe("Tapstream", function () {
  describe("initialize", function () {
    this.timeout(2000);

    it('Should load the tapstream library', function(done) {
      expect(window.__tsq).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Tapstream' : test.Tapstream });

      expect(spy.called).to.be(true);
      expect(window._tsq).not.to.be(undefined);
      expect(window._tsq[0][1]).to.be(test.Tapstream.accountName);
      expect(window._tsq[1][1]).to.be(test.Tapstream.trackerName);
      expect(window._tsq[1][2]).to.be(test.Tapstream.tags);

      var interval = setInterval(function () {
        if (!window.Tapstream) return;
        expect(window.Tapstream).not.to.be(undefined);
        clearInterval(interval);

        // _tsq is replaced with a "CommandQueue" object
        expect(window._tsq._api.accountName).to.equal(test.Tapstream.accountName);

        done();
      }, 20);
    });

    it('Should not fire an initial pageview if option is false', function(){
      window._tsq = [];

      var extend = require('segmentio-extend')
        , spy   = sinon.spy(window._tsq, 'push')
        , options = extend({}, test.Tapstream, { initialPageview : false });

      analytics.initialize({ 'Tapstream' : options });
      expect(spy.calledWith(['fireHit', options.trackerName, options.tags])).to.be(false);

      spy.restore();
    });

  });

  describe('track', function(){
    this.timeout(2000);
    it('Should fire a hit when called', function(done){

      analytics.initialize({ 'Tapstream' : test.Tapstream });


      var interval = setInterval(function () {
        if (!window.Tapstream) return;
        clearInterval(interval);

        var spy = sinon.spy(window._tsq, 'push');
        expect(spy.calledWith(['fireHit', "Some_Tracker", []])).to.be(false);
        analytics.track("Some Tracker", {});
        expect(spy.calledWith(['fireHit', "Some_Tracker", []])).to.be(true);
        done();
      }, 20);

    });
  });
});

