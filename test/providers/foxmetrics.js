
describe('FoxMetrics', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , equal = require('equals')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  appId: '5135085424023236bca9c08c'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ FoxMetrics: settings });
  this.integration = analytics._integrations.FoxMetrics;
  this.options = this.integration.options;
  when(function () { return window._fxm.appId; }, done);
});

describe('#name', function () {
  it('FoxMetrics', function () {
    assert(this.integration.name == 'FoxMetrics');
  });
});

describe('#key', function () {
  it('appId', function () {
    assert(this.integration.key == 'appId');
  });
});

describe('#defaults', function () {
  it('appId', function () {
    assert(this.integration.defaults.appId === '');
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options', function () {
    assert(this.options.appId == settings.appId);
  });

  it('should send options to FoxMetrics', function () {
    assert(window._fxm.appId == settings.appId);
  });
});

describe('#identify', function () {
  beforeEach(function () {
    analytics._user.clear();
    this.stub = sinon.stub(window._fxm, 'push');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should send an id', function () {
    analytics.identify('id');
    assert(this.stub.calledWith([
      '_fxm.visitor.profile',
      'id',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      {}
    ]));
  });

  it('shouldnt send just traits', function () {
    analytics.identify({ trait: true });
    assert(!this.stub.called);
  });

  it('should send an id and traits', function () {
    analytics.identify('id', {
      firstName: 'first',
      lastName: 'last',
      email: 'email@example.com',
      address: 'address',
      trait: true
    });
    assert(this.stub.calledWith([
      '_fxm.visitor.profile',
      'id',
      'first',
      'last',
      'email@example.com',
      'address',
      undefined,
      undefined,
      {
        firstName: 'first',
        lastName: 'last',
        name: 'first last',
        email: 'email@example.com',
        address: 'address',
        trait: true
      }
    ]));
  });

  it('should split a name trait', function () {
    analytics.identify('id', { name: 'first last' });
    assert(this.stub.calledWith([
      '_fxm.visitor.profile',
      'id',
      'first',
      'last',
      undefined,
      undefined,
      undefined,
      undefined,
      {
        name: 'first last'
      }
    ]));
  });
});

describe('#track', function () {
  beforeEach(function () {
    this.stub = sinon.stub(window._fxm, 'push');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should send an event', function () {
    analytics.track('event');
    assert(this.stub.calledWith([
      'event',
      undefined,
      {}
    ]));
  });

  it('should send an event and properties', function () {
    analytics.track('event', { property: true });
    assert(this.stub.calledWith([
      'event',
      undefined,
      { property: true }
    ]));
  });

  it('should send a category property', function () {
    analytics.track('event', { category: 'category' });
    assert(this.stub.calledWith([
      'event',
      'category',
      { category: 'category' }
    ]));
  });
});

describe('#pageview', function () {
  beforeEach(function () {
    this.stub = sinon.stub(window._fxm, 'push');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should send a pageview', function () {
    analytics.pageview();
    assert(this.stub.calledWith([
      '_fxm.pages.view',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    ]));
  });

  it('should send a url', function () {
    analytics.pageview('/path');
    assert(this.stub.calledWith([
      '_fxm.pages.view',
      undefined,
      undefined,
      undefined,
      '/path',
      undefined
    ]));
  });
});

});