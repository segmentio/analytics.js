describe('UserVoice', function () {

var analytics = require('analytics')
  , extend = require('extend');

describe('initialize', function () {
  this.timeout(10000);

  it('should call ready and load library', function (done) {
    expect(window.UserVoice).to.be(undefined);

    var spy = sinon.spy();
    analytics.ready(spy);
    analytics.initialize({ 'UserVoice': test['UserVoice'] });
    expect(window.UserVoice).not.to.be(undefined);

    // once the library loads, `account` gets set
    var interval = setInterval(function () {
      if (!window.UserVoice.account) return;
      expect(window.UserVoice.account).not.to.be(undefined);
      expect(spy.called).to.be(true);
      clearInterval(interval);
      done();
    }, 500);
  });

  it('should store options', function () {
    expect(analytics._providers[0].options.widgetId).to.equal(test['UserVoice'].widgetId);
  });
});

describe('identify', function () {
  it('should call setCustomFields', function () {
    var stub = sinon.stub(window.UserVoice, 'push');
    analytics.identify('id', { name: 'Name' });
    expect(stub.calledWith(['setCustomFields', { id: 'id', name: 'Name' }])).to.be(true);
  });
});

});