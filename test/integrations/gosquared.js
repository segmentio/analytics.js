
describe('GoSquared', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , equal = require('equals')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  siteToken: 'x'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ GoSquared: settings });
  this.integration = analytics._integrations.GoSquared;
  this.options = this.integration.options;
  when(function () { return window.GoSquared.DefaultTracker; }, done);
});

describe('#name', function () {
  it('GoSquared', function () {
    assert(this.integration.name == 'GoSquared');
  });
});

describe('#key', function () {
  it('siteToken', function () {
    assert(this.integration.key == 'siteToken');
  });
});

describe('#defaults', function () {
  it('siteToken', function () {
    assert(this.integration.defaults.siteToken === '');
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options', function () {
    assert(this.options.siteToken == settings.siteToken);
  });

  it('should pass options to GoSquared', function () {
    assert(window.GoSquared.acct == settings.siteToken);
  });

  it('should add a page load time', function () {
    assert('number' == typeof window._gstc_lt);
  });
});

describe('#identify', function () {
  beforeEach(function () {
    analytics.user().reset();
  });

  afterEach(function () {
    window.GoSquared.UserName = undefined;
    window.GoSquared.VisitorName = undefined;
    window.GoSquared.Visitor = undefined;
  });

  it('should set an id', function () {
    analytics.identify('id');
    assert(window.GoSquared.UserName == 'id');
    assert(window.GoSquared.VisitorName == 'id');
  });

  it('should set traits', function () {
    analytics.identify({ trait: true });
    assert(equal(window.GoSquared.Visitor, { trait: true }));
  });

  it('should set an id and traits', function () {
    analytics.identify('id', { trait: true });
    assert(window.GoSquared.UserName == 'id');
    assert(window.GoSquared.VisitorName == 'id');
    assert(equal(window.GoSquared.Visitor, { userID: 'id', trait: true }));
  });

  it('should prefer an email for visitor name', function () {
    analytics.identify('id', {
      email: 'email@example.com',
      username: 'username'
    });
    assert(window.GoSquared.VisitorName == 'email@example.com');
  });

  it('should also prefer a username for visitor name', function () {
    analytics.identify('id', {
      username: 'username'
    });
    assert(window.GoSquared.VisitorName == 'username');
  });
});

describe('#track', function () {
  beforeEach(function () {
    this.stub = sinon.stub(window.GoSquared.q, 'push');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should send an event', function () {
    analytics.track('event');
    assert(this.stub.calledWith(['TrackEvent', 'event', {}]));
  });

  it('should send an event and properties', function () {
    analytics.track('event', { property: true });
    assert(this.stub.calledWith(['TrackEvent', 'event', { property: true }]));
  });
});

describe('#pageview', function () {
  beforeEach(function () {
    this.stub = sinon.stub(window.GoSquared.q, 'push');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should send a pageview', function () {
    analytics.pageview();
    assert(this.stub.calledWith(['TrackView', undefined]));
  });

  it('should send a url', function () {
    analytics.pageview('/path');
    assert(this.stub.calledWith(['TrackView', '/path']));
  });
});

});