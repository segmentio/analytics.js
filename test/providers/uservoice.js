describe('UserVoice', function () {


  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      expect(window.UserVoice).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'UserVoice' : test['UserVoice'] });
      expect(window.UserVoice).not.to.be(undefined);
      expect(window.UserVoice.push).to.be(Array.prototype.push);

      // Once the library loads, `_uvts` gets set.
      var interval = setInterval(function () {
        if (window.UserVoice.push === Array.prototype.push) return;
        expect(window.UserVoice.push).not.to.be(Array.prototype.push);
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