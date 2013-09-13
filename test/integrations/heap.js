
describe('Heap', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , equal = require('equals')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  apiKey: 'x'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ Heap: settings });
  this.integration = analytics._integrations.Heap;
  this.options = this.integration.options;
  var stub = window.heap;
  when(function () { return window.heap != stub; }, done);
});

describe('#name', function () {
  it('Heap', function () {
    assert(this.integration.name == 'Heap');
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

  it('should pass options to Heap', function () {
    assert(window._heapid == settings.apiKey);
  });
});

describe('#identify', function () {
  beforeEach(function () {
    analytics.user().reset();
    this.spy = sinon.spy(window.heap, 'identify');
  });

  afterEach(function () {
    this.spy.restore();
  });

  it('should send traits', function () {
    analytics.identify({ trait: true });
    assert(this.spy.calledWith({ trait: true }));
  });

  it('should alias a username', function () {
    analytics.identify({ username: 'username' });
    assert(this.spy.calledWith({ handle: 'username' }));
  });
});

describe('#track', function () {
  beforeEach(function () {
    this.spy = sinon.spy(window.heap, 'track');
  });

  afterEach(function () {
    this.spy.restore();
  });

  it('should send an event', function () {
    analytics.track('event');
    assert(this.spy.calledWith('event'));
  });

  it('should send an event and properties', function () {
    analytics.track('event', { property: true });
    assert(this.spy.calledWith('event', { property: true }));
  });
});

});