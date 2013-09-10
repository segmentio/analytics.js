
describe('UserVoice', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  apiKey: 'x'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ UserVoice: settings });
  this.integration = analytics._integrations.UserVoice;
  this.options = this.integration.options;
  when(function () { return window.__adroll; }, done);
});

describe('#key', function () {
  it('apiKey', function () {
    assert(this.integration.key == 'apiKey');
  });
});

describe('#defaults', function () {
  it('apiKey', function () {
    assert(this.integration.defaults.apiKey === '');
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options', function () {
    assert(this.options.apiKey == settings.apiKey);
  });
});

describe('#identify', function () {
  beforeEach(function () {
    analytics._user.clear();
    this.stub = sinon.stub(window._kmq, 'push');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should send an id', function () {
    analytics.identify('id');
    assert(this.stub.calledWith(['identify', 'id']));
  });

  it('should send traits', function () {
    analytics.identify({ trait: true });
    assert(this.stub.calledWith(['set', { trait: true }]));
  });

  it('should send an id and traits', function () {
    analytics.identify('id', { trait: true });
    assert(this.stub.calledWith(['identify', 'id']));
    assert(this.stub.calledWith(['set', { trait: true }]));
  });
});















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