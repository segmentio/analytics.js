
describe('BugHerd', function () {

  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      expect(window.bugherd).to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'BugHerd' : test['BugHerd'] });
      expect(window.bugherd).not.to.be(undefined);

      // Once the library loads, `_uvts` gets set.
      var interval = setInterval(function () {
        if (!window.bugherd) return;
        expect(window.bugherd).not.to.be(undefined);
        expect(spy.called).to.be(true);
        clearInterval(interval);
        done();
      }, 20);
    });

    it('should store options', function () {
      analytics.initialize({ 'BugHerd' : test['BugHerd'] });
      expect(analytics.providers[0].options.apiKey).to.equal(test['BugHerd']);
    });

  });

});