
describe('LiveChat', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  license: '1520'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ LiveChat: settings });
  this.integration = analytics._integrations.LiveChat;
  this.options = this.integration.options;
  when(function () { return window.LC_API; }, done);
});

describe('#name', function () {
  it('LiveChat', function () {
    assert(this.integration.name == 'LiveChat');
  });
});

describe('#key', function () {
  it('license', function () {
    assert(this.integration.key == 'license');
  });
});

describe('#defaults', function () {
  it('license', function () {
    assert(this.integration.defaults.license === '');
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options', function () {
    assert(this.options.license == settings.license);
  });

  it('should pass options to LiveChat', function () {
    assert(window.__lc.license == settings.license);
  });
});

describe('#identify', function () {
  beforeEach(function () {
    analytics._user.clear();
    this.stub = sinon.stub(window.LC_API, 'set_custom_variables');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should send an id', function () {
    analytics.identify('id');
    assert(this.stub.calledWith([
      { name: 'User ID', value: 'id' }
    ]));
  });

  it('should send traits', function () {
    analytics.identify({ trait: true });
    assert(this.stub.calledWith([
      { name: 'trait', value: true }
    ]));
  });

  it('should send an id and traits', function () {
    analytics.identify('id', { trait: true });
    assert(this.stub.calledWith([
      { name: 'trait', value: true },
      { name: 'User ID', value: 'id' }
    ]));
  });
});

});