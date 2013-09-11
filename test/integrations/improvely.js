
describe('Improvely', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  domain: 'demo',
  projectId: 1
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ Improvely: settings });
  this.integration = analytics._integrations.Improvely;
  this.options = this.integration.options;
  when(function () { return window.improvely.identify; }, done);
});

describe('#name', function () {
  it('Improvely', function () {
    assert(this.integration.name == 'Improvely');
  });
});

describe('#defaults', function () {
  it('domain', function () {
    assert(this.integration.defaults.domain === '');
  });

  it('projectId', function () {
    assert(this.integration.defaults.projectId === null);
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options', function () {
    assert(this.options.domain == settings.domain);
    assert(this.options.projectId == settings.projectId);
  });
});

describe('#identify', function () {
  beforeEach(function () {
    analytics._user.clear();
    this.spy = sinon.spy(window.improvely, 'label');
  });

  afterEach(function () {
    this.spy.restore();
  });

  it('should send an id', function () {
    analytics.identify('id');
    assert(this.spy.calledWith('id'));
  });
});

describe('#track', function () {
  beforeEach(function () {
    this.spy = sinon.spy(window.improvely, 'goal');
  });

  afterEach(function () {
    this.spy.restore();
  });

  it('should send an event', function () {
    analytics.track('event');
    assert(this.spy.calledWith({ type: 'event' }));
  });

  it('should send an event and properties', function () {
    analytics.track('event', { property: true });
    assert(this.spy.calledWith({
      type: 'event',
      property: true
    }));
  });

  it('should alias revenue to amount', function () {
    analytics.track('event', { revenue: 42.99 });
    assert(this.spy.calledWith({
      type: 'event',
      amount: 42.99
    }));
  });
});

});