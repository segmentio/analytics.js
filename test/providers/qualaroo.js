
describe('Qualaroo', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  customerId: '47517',
  siteToken: '9Fd'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ Qualaroo: settings });
  this.integration = analytics._integrations.Qualaroo;
  this.options = this.integration.options;
  when(function () { return window.KI; }, done);
});

describe('#name', function () {
  it('Qualaroo', function () {
    assert(this.integration.name == 'Qualaroo');
  });
});

describe('#defaults', function () {
  it('customerId', function () {
    assert(this.integration.defaults.customerId === '');
  });

  it('siteToken', function () {
    assert(this.integration.defaults.siteToken === '');
  });

  it('track', function () {
    assert(this.integration.defaults.track === false);
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options with defaults', function () {
    assert(this.options.customerId == settings.customerId);
    assert(this.options.siteToken == settings.siteToken);
    assert(this.options.track == this.integration.defaults.track);
  });
});

describe('#identify', function () {
  beforeEach(function () {
    analytics._user.clear();
    this.stub = sinon.stub(window._kiq, 'push');
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

  it('should prefer an email', function () {
    analytics.identify('id', { email: 'name@example.com' });
    assert(this.stub.calledWith(['identify', 'name@example.com']));
  });
});

describe('#track', function () {
  beforeEach(function () {
    this.stub = sinon.stub(window._kiq, 'push');
  });

  afterEach(function () {
    this.stub.restore();
    this.options.track = false;
  });

  it('shouldnt send anything by default', function () {
    analytics.track('event');
    assert(!this.stub.called);
  });

  it('should set an event trait', function () {
    this.options.track = true;
    analytics.track('event');
    assert(this.stub.calledWith(['set', { 'Triggered: event': true }]));
  });
});

});