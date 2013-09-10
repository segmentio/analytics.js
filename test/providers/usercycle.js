
describe('USERcycle', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  key: 'x'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ USERcycle: settings });
  this.integration = analytics._integrations.USERcycle;
  this.options = this.integration.options;
  var stub = window._uc.push;
  when(function () { return window._uc.push != stub; }, done);
});

describe('#key', function () {
  it('key', function () {
    assert(this.integration.key == 'key');
  });
});

describe('#defaults', function () {
  it('key', function () {
    assert(this.integration.defaults.key === '');
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options', function () {
    assert(this.options.key == settings.key);
  });
});

describe('#identify', function () {
  beforeEach(function () {
    analytics._user.clear();
    this.stub = sinon.stub(window._uc, 'push');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should send an id', function () {
    analytics.identify('id');
    assert(this.stub.calledWith(['uid', 'id']));
    assert(this.stub.calledWith(['action', 'came_back', {}]));
  });

  it('should send traits', function () {
    analytics.identify({ trait: true });
    assert(this.stub.calledWith(['action', 'came_back', { trait: true }]));
  });

  it('should send an id and traits', function () {
    analytics.identify('id', { trait: true });
    assert(this.stub.calledWith(['uid', 'id']));
    assert(this.stub.calledWith(['action', 'came_back', { trait: true }]));
  });
});

describe('#track', function () {
  beforeEach(function () {
    this.stub = sinon.stub(window._uc, 'push');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should send an event', function () {
    analytics.track('event');
    assert(this.stub.calledWith(['action', 'event', {}]));
  });

  it('should send an event and properties', function () {
    analytics.track('event', { property: true });
    assert(this.stub.calledWith(['action', 'event', { property: true }]));
  });
});

});