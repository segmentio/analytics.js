
describe('Sentry', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  config: 'x'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ Sentry: settings });
  this.integration = analytics._integrations.Sentry;
  this.options = this.integration.options;
  when(function () { return window.Raven; }, done);
});

describe('#key', function () {
  it('config', function () {
    assert(this.integration.key == 'config');
  });
});

describe('#defaults', function () {
  it('config', function () {
    assert(this.integration.defaults.config === '');
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options', function () {
    assert(this.options.config == settings.config);
  });
});

describe('#identify', function () {
  beforeEach(function () {
    analytics._user.clear();
    this.spy = sinon.spy(window.Raven, 'setUser');
  });

  afterEach(function () {
    this.spy.restore();
  });

  it('should send an id', function () {
    analytics.identify('id');
    assert(this.spy.calledWith({ id: 'id' }));
  });

  it('should send traits', function () {
    analytics.identify({ trait: true });
    assert(this.spy.calledWith({ trait: true }));
  });

  it('should send an id and traits', function () {
    analytics.identify('id', { trait: true });
    assert(this.spy.calledWith({
      id: 'id',
      trait: true
    }));
  });
});

});