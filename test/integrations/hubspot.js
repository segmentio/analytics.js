
describe('HubSpot', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , equal = require('equals')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  portalId: 62515
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ HubSpot: settings });
  this.integration = analytics._integrations.HubSpot;
  this.options = this.integration.options;
  var stub = window._hsq.push;
  when(function () { return window._hsq.push != stub; }, done);
});

describe('#name', function () {
  it('HubSpot', function () {
    assert(this.integration.name == 'HubSpot');
  });
});

describe('#key', function () {
  it('portalId', function () {
    assert(this.integration.key == 'portalId');
  });
});

describe('#defaults', function () {
  it('portalId', function () {
    assert(this.integration.defaults.portalId === null);
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options', function () {
    assert(this.options.portalId == settings.portalId);
  });
});

describe('#identify', function () {
  beforeEach(function () {
    analytics.user().reset();
    this.stub = sinon.stub(window._hsq, 'push');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('shouldnt send traits without an email', function () {
    analytics.identify('id');
    assert(!this.stub.called);
  });

  it('should send traits with an email', function () {
    analytics.identify({ email: 'name@example.com' });
    assert(this.stub.calledWith(['identify', { email: 'name@example.com' }]));
  });

  it('should send an id and traits with an email', function () {
    analytics.identify('id', { email: 'name@example.com' });
    assert(this.stub.calledWith(['identify', {
      id: 'id',
      email: 'name@example.com'
    }]));
  });

  it('should send traits with an email id', function () {
    analytics.identify('name@example.com');
    assert(this.stub.calledWith(['identify', {
      id: 'name@example.com',
      email: 'name@example.com'
    }]));
  });
});

describe('#track', function () {
  beforeEach(function () {
    analytics.user().reset();
    this.stub = sinon.stub(window._hsq, 'push');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should send an event', function () {
    analytics.track('event');
    assert(this.stub.calledWith(['trackEvent', 'event', {}]));
  });

  it('should send an event and properties', function () {
    analytics.track('event', { property: true });
    assert(this.stub.calledWith(['trackEvent', 'event', { property: true }]));
  });
});

describe('#pageview', function () {
  beforeEach(function () {
    analytics.user().reset();
    this.stub = sinon.stub(window._hsq, 'push');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should send a pageview', function () {
    analytics.pageview();
    assert(this.stub.calledWith(['_trackPageview']));
  });
});

});