
describe('userfox', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  clientId: '4v2erxr9c5vzqsy35z9gnk6az'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ userfox: settings });
  this.integration = analytics._integrations.userfox;
  this.options = this.integration.options;
  when(function () { return window.UserfoxTracker; }, done);
});

describe('#name', function () {
  it('userfox', function () {
    assert(this.integration.name == 'userfox');
  });
});

describe('#key', function () {
  it('clientId', function () {
    assert(this.integration.key == 'clientId');
  });
});

describe('#defaults', function () {
  it('clientId', function () {
    assert(this.integration.defaults.clientId === '');
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options', function () {
    assert(this.options.clientId == settings.clientId);
  });
});

describe('#identify', function () {
  beforeEach(function () {
    analytics.user().reset();
    this.stub = sinon.stub(window._ufq, 'push');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should initialize the library with an email', function () {
    analytics.identify('id', { email: 'name@example.com' });
    assert(this.stub.calledWith(['init', {
      clientId: settings.clientId,
      email: 'name@example.com'
    }]));
  });

  it('should send traits', function () {
    analytics.identify('id', { email: 'name@example.com', trait: true });
    assert(this.stub.calledWith(['track', {
      email: 'name@example.com',
      trait: true
    }]));
  });

  it('should convert dates to a format userfox supports', function () {
    var date = new Date();
    analytics.identify('id', {
      email: 'name@example.com',
      date: date
    });
    assert(this.stub.calledWith(['track', {
      email: 'name@example.com',
      date: Math.round(date.getTime() / 1000).toString()
    }]));
  });

  it('should alias a created trait to signup_date', function () {
    var date = new Date();
    analytics.identify('id', {
      email: 'name@example.com',
      created: date
    });
    assert(this.stub.calledWith(['track', {
      email: 'name@example.com',
      signup_date: Math.round(date.getTime() / 1000).toString()
    }]));
  });
});

});