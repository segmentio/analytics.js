
describe('Vero', function () {

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
  analytics.initialize({ Vero: settings });
  this.integration = analytics._integrations.Vero;
  this.options = this.integration.options;
  var stub = window._veroq.push;
  when(function () { return window._veroq.push != stub; }, done);
});

describe('#name', function () {
  it('Vero', function () {
    assert(this.integration.name == 'Vero');
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
    analytics._user.clear();
    this.stub = sinon.stub(window._veroq, 'push');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('shouldnt send just an id', function () {
    analytics.identify('id');
    assert(!this.stub.called);
  });

  it('shouldnt send without an id', function () {
    analytics.identify({ trait: true });
    assert(!this.stub.called);
  });

  it('should send an id and email', function () {
    analytics.identify('id', { email: 'name@example.com' });
    assert(this.stub.calledWith(['user', {
      id: 'id',
      email: 'name@example.com'
    }]));
  });

  it('should send an id and traits', function () {
    analytics.identify('id', {
      email: 'name@example.com',
      trait: true
    });
    assert(this.stub.calledWith(['user', {
      id: 'id',
      email: 'name@example.com',
      trait: true
    }]));
  });
});

describe('#track', function () {
  beforeEach(function () {
    this.stub = sinon.stub(window._veroq, 'push');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should send an event', function () {
    analytics.track('event');
    assert(this.stub.calledWith(['track', 'event', {}]));
  });

  it('should send an event and properties', function () {
    analytics.track('event', { property: true });
    assert(this.stub.calledWith(['track', 'event', { property: true }]));
  });
});

});