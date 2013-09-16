
describe('Preact', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  projectCode: 'x'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ Preact: settings });
  this.integration = analytics._integrations.Preact;
  this.options = this.integration.options;
  when(function () { return window._lnq; }, done);
});

describe('#name', function () {
  it('Preact', function () {
    assert(this.integration.name == 'Preact');
  });
});

describe('#key', function () {
  it('projectCode', function () {
    assert(this.integration.key == 'projectCode');
  });
});

describe('#defaults', function () {
  it('projectCode', function () {
    assert(this.integration.defaults.projectCode === '');
  });
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options', function () {
    assert(this.options.projectCode == settings.projectCode);
  });
});

describe('#identify', function () {
  beforeEach(function () {
    analytics.user().reset();
    this.stub = sinon.stub(window._lnq, 'push');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should send an id', function () {
    analytics.identify('id');
    assert(this.stub.calledWith(['_setPersonData', {
      uid: 'id',
      email: undefined,
      name: undefined,
      properties: {}
    }]));
  });

  it('shouldnt send just traits', function () {
    analytics.identify({ trait: true });
    assert(!this.stub.called);
  });

  it('should send an id and traits', function () {
    analytics.identify('id', { trait: true });
    assert(this.stub.calledWith(['_setPersonData', {
      uid: 'id',
      email: undefined,
      name: undefined,
      properties: { trait: true }
    }]));
  });

  it('should send an email', function () {
    analytics.identify('id', { email: 'name@example.com' });
    assert(this.stub.calledWith(['_setPersonData', {
      uid: 'id',
      email: 'name@example.com',
      name: undefined,
      properties: { email: 'name@example.com' }
    }]));
  });

  it('should send a name', function () {
    analytics.identify('id', { name: 'name' });
    assert(this.stub.calledWith(['_setPersonData', {
      uid: 'id',
      email: undefined,
      name: 'name',
      properties: { name: 'name' }
    }]));
  });
});

describe('#group', function () {
  beforeEach(function () {
    this.stub = sinon.stub(window._lnq, 'push');
    analytics.group().reset();
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should send an id', function () {
    analytics.group('id');
    assert(this.stub.calledWith(['_setAccount', { id: 'id' }]));
  });

  it('should send an id and properties', function () {
    analytics.group('id', { property: true });
    assert(this.stub.calledWith(['_setAccount', {
      id: 'id',
      property: true
    }]));
  });
});

describe('#track', function () {
  beforeEach(function () {
    this.stub = sinon.stub(window._lnq, 'push');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should send an event', function () {
    analytics.track('event');
    assert(this.stub.calledWith(['_logEvent', { name: 'event' }, {}]));
  });

  it('should send an event and properties', function () {
    analytics.track('event', { property: true });
    assert(this.stub.calledWith(['_logEvent', { name: 'event' }, { property: true }]));
  });

  it('should special case a revenue property', function () {
    analytics.track('event', { revenue: 9.99 });
    assert(this.stub.calledWith(['_logEvent', {
      name: 'event',
      revenue: 999
    }, {}]));
  });

  it('should special case a note property', function () {
    analytics.track('event', { note: 'note' });
    assert(this.stub.calledWith(['_logEvent', {
      name: 'event',
      note: 'note'
    }, {}]));
  });
});

});