
describe('SnapEngage', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  apiKey: '782b737e-487f-4117-8a2b-2beb32b600e5'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ SnapEngage: settings });
  this.integration = analytics._integrations.SnapEngage;
  this.options = this.integration.options;
  when(function () { return window.SnapABug; }, done);
});

describe('#name', function () {
  it('SnapEngage', function () {
    assert(this.integration.name == 'SnapEngage');
  });
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
    analytics.user().reset();
    this.stub = sinon.stub(window.SnapABug, 'setUserEmail');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should send an email', function () {
    analytics.identify({ email: 'name@example.com' });
    assert(this.stub.calledWith('name@example.com'));
  });
});

});