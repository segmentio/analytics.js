
describe('UserVoice', function () {

  describe('initialize', function () {

    it('should call ready and load library', function (done) {
      expect(window.uvOptions).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'UserVoice' : test['UserVoice'] });
      expect(window.uvOptions).not.to.be(undefined);
      expect(window._uvts).to.be(undefined);

      // Once the library loads, `_uvts` gets set.
      setTimeout(function () {
        expect(window._uvts).not.to.be(undefined);
        expect(spy.called).to.be(true);
        done();
      }, 1900);
    });

    it('should store options', function () {
      analytics.initialize({ 'UserVoice' : test['UserVoice'] });
      expect(analytics.providers[0].options.widgetId).to.equal(test['UserVoice']);
    });

  });

});