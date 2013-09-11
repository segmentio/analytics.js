
describe('Klaviyo', function () {

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
  analytics.initialize({ Klaviyo: settings });
  this.integration = analytics._integrations.Klaviyo;
  this.options = this.integration.options;
  var stub = window._learnq.push;
  when(function () { return window._learnq.push != stub; }, done);
});

describe('#name', function () {
  it('Klaviyo', function () {
    assert(this.integration.name == 'Klaviyo');
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

  it('should make a queue', function () {
    assert(window._learnq instanceof Array);
  });
});

describe('#identify', function () {
  beforeEach(function () {
    analytics._user.clear();
    this.stub = sinon.stub(window._learnq, 'push');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should send an id', function () {
    analytics.identify('id');
    assert(this.stub.calledWith(['identify', { $id: 'id' }]));
  });

  it('shouldnt send just traits', function () {
    analytics.identify({ trait: true });
    assert(!this.stub.called);
  });

  it('should send an id and traits', function () {
    analytics.identify('id', { trait: true });
    assert(this.stub.calledWith(['identify', {
      $id: 'id',
      trait: true
    }]));
  });

  it('should alias traits', function () {
    analytics.identify('id', {
      email: 'name@example.com',
      firstName: 'first',
      lastName: 'last',
      phone: 'phone',
      title: 'title'
    });
    assert(this.stub.calledWith(['identify', {
      $id: 'id',
      $email: 'name@example.com',
      $first_name: 'first',
      $last_name: 'last',
      $phone_number: 'phone',
      $title: 'title',
      name: 'first last'
    }]));
  });
});

describe('#group', function () {
  beforeEach(function () {
    analytics._user.clear();
    this.stub = sinon.stub(window._learnq, 'push');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should send a name', function () {
    analytics.group('id', { name: 'name' });
    assert(this.stub.calledWith(['identify', { $organization: 'name' }]));
  });
});

describe('#track', function () {
  beforeEach(function () {
    this.stub = sinon.stub(window._learnq, 'push');
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