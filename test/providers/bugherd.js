
describe('BugHerd', function () {

  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      expect(window.uvOptions).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'UserVoice' : test['UserVoice'] });
      expect(window.uvOptions).not.to.be(undefined);
      expect(window._uvts).to.be(undefined);

      // Once the library loads, `_uvts` gets set.
      var interval = setInterval(function () {
        if (!window._uvts) return;
        expect(window._uvts).not.to.be(undefined);
        expect(spy.called).to.be(true);
        clearInterval(interval);
        done();
      }, 20);
    });

    it('should store options', function () {
      analytics.initialize({ 'UserVoice' : test['UserVoice'] });
      expect(analytics.providers[0].options.widgetId).to.equal(test['UserVoice']);
    });

  });

});