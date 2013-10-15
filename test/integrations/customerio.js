
describe('Customer.io', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , equal = require('equals')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  siteId: 'x'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ 'Customer.io': settings });
  this.integration = analytics._integrations['Customer.io'];
  this.options = this.integration.options;
  when(function () { return window._cio.pageHasLoaded; }, done);
});

describe('#name', function () {
  it('Customer.io', function () {
    assert(this.integration.name == 'Customer.io');
  });
});

describe('#key', function () {
  it('siteId', function () {
    assert(this.integration.key == 'siteId');
  });
});

describe('#defaults', function () {
  it('siteId', function () {
    assert(this.integration.defaults.siteId === '');
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options', function () {
    assert(this.options.siteId == settings.siteId);
    assert(this.options.pixId == settings.pixId);
  });
});

describe('#identify', function () {
  beforeEach(function () {
    analytics.user().reset();
    this.spy = sinon.spy(window._cio, 'identify');
  });

  afterEach(function () {
    this.spy.restore();
  });

  it('should send an id', function () {
    analytics.identify('id');
    assert(this.spy.calledWith({ id: 'id' }));
  });

  it('should not send only traits', function () {
    analytics.identify({ trait: true });
    assert(!this.spy.called);
  });

  it('should send an id and traits', function () {
    analytics.identify('id', { trait: true });
    assert(this.spy.calledWith({
      id: 'id',
      trait: true
    }));
  });

  it('should convert dates', function () {
    var date = new Date();
    analytics.identify('id', { date: date });
    assert(this.spy.calledWith({
      id: 'id',
      date: Math.floor(date / 1000)
    }));
  });

  it('should alias created to created_at', function () {
    var date = new Date();
    analytics.identify('id', { created: date });
    assert(this.spy.calledWith({
      id: 'id',
      created_at: Math.floor(date / 1000)
    }));
  });
});

describe('#group', function () {
  before(function () {
    analytics.user().reset();
    analytics.group().reset();
  });

  beforeEach(function () {
    analytics.identify('id');
    this.spy = sinon.spy(window._cio, 'identify');
  });

  afterEach(function () {
    this.spy.restore();
    analytics.user().reset();
    analytics.group().reset();
  });

  it('should send an id', function () {
    analytics.group('id');
    assert(this.spy.calledWith({ id: 'id', 'Group id': 'id' }));
  });

  it('should send traits', function () {
    analytics.group({ trait: true });
    assert(this.spy.calledWith({ id: 'id', 'Group trait': true }));
  });

  it('should send an id and traits', function () {
    analytics.group('id', { trait: true });
    assert(this.spy.calledWith({
      id: 'id',
      'Group id': 'id',
      'Group trait': true
    }));
  });

  it('should convert dates', function () {
    var date = new Date();
    analytics.group({ date: date });
    assert(this.spy.calledWith({
      id: 'id',
      'Group date': Math.floor(date / 1000)
    }));
  });
});

describe('#track', function () {
  beforeEach(function () {
    this.spy = sinon.spy(window._cio, 'track');
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

  it('should convert dates', function () {
    var date = new Date();
    analytics.track('event', { date: date });
    assert(this.spy.calledWith('event', {
      date: Math.floor(date / 1000)
    }));
  });
});

});