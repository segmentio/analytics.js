
describe('KISSmetrics', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  apiKey: '67f57ae9d61a6981fa07d141bec8c6c37e8b88c7'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ KISSmetrics: settings });
  this.integration = analytics._integrations.KISSmetrics;
  this.options = this.integration.options;
  when(function () { return window.KM; }, done);
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

  it('should created a queue', function () {
    assert(window._kmq instanceof Array);
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

describe('#track', function () {
  beforeEach(function () {
    this.stub = sinon.stub(window._kmq, 'push');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should send an event', function () {
    analytics.track('event');
    assert(this.stub.calledWith(['record', 'event', {}]));
  });

  it('should send an event and properties', function () {
    analytics.track('event', { property: true });
    assert(this.stub.calledWith(['record', 'event', { property: true }]));
  });

  it('should alias revenue to "Billing Amount"', function () {
    analytics.track('event', { revenue: 9.99 });
    assert(this.stub.calledWith(['record', 'event', { 'Billing Amount': 9.99 }]));
  });
});

describe('#alias', function () {
  beforeEach(function () {
    this.stub = sinon.stub(window._kmq, 'push');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should send a new id', function () {
    analytics.alias('new');
    assert(this.stub.calledWith(['alias', 'new', undefined]));
  });

  it('should send a new and old id', function () {
    analytics.alias('new', 'old');
    assert(this.stub.calledWith(['alias', 'new', 'old']));
  });
});

});