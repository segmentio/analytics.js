
describe('Intercom', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  appId: '5914a4049a0b4ff8078fde2af2e968e2b29c4d5c'
};

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ Intercom: settings });
  when(function () { return window.Intercom; }, done);
});

describe('#initialize', function () {
  it('should call ready', function () {
    assert(this.spy.called);
  });

  it('should store options with defaults', function () {
    var options = analytics._providers[0].options;
    assert(options.appId == settings.appId);
  });
});

describe('#identify', function () {
  before(function () {
    this.id = 0;
  });

  beforeEach(function () {
    analytics._user.clear();
    this.id++;
    this.stub = sinon.stub(window, 'Intercom');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should do nothing without an email', function () {
    analytics.identify(this.id);
    assert(!this.stub.called);
  });

  it('should call boot the first time and update the second', function () {
    analytics.identify(this.id, { email: 'email@example.com' });
    assert(this.stub.calledWith('boot', {
      app_id: settings.appId,
      email: 'email@example.com',
      user_id: this.id
    }));
    analytics.identify(this.id);
    assert(this.stub.calledWith('update', {
      app_id: settings.appId,
      email: 'email@example.com',
      user_id: this.id
    }));
  });

  it('should send an id and traits', function () {
    analytics.identify(this.id, { email: 'email@example.com' });
    assert(this.stub.calledWith('boot', {
      app_id: settings.appId,
      email: 'email@example.com',
      user_id: this.id
    }));
  });

  it('should convert dates', function () {
    var date = new Date();
    analytics.identify(this.id, {
      created: date,
      company: { created: date }
    });
    assert(this.stub.calledWith('boot', {
      app_id: settings.appId,
      user_id: this.id,
      created_at: Math.floor(date/1000),
      company: { created_at: Math.floor(date/1000) }
    }));
  });

  it('should allow passing a user hash', function () {
    analytics.identify(this.id, {}, {
      Intercom: {
        userHash: 'x'
      }
    });
    assert(this.stub.calledWith('boot', {
      app_id: settings.appId,
      user_id: this.id,
      user_hash: 'x'
    }));
  });

  it('should allow passing increments', function () {
    analytics.identify(this.id, {}, {
      Intercom: {
        increments: { number: 42 }
      }
    });
    assert(this.stub.calledWith('boot', {
      app_id: settings.appId,
      user_id: this.id,
      increments: { number: 42 }
    }));
  });
});

describe('group', function () {
  beforeEach(function () {
    this.stub = sinon.stub(window, 'Intercom');
  });

  afterEach(function () {
    this.stub.restore();
  });

  it('should send an id', function () {
    analytics.group('id');
    assert(this.stub.calledWith('update', { company: { id: 'id' }}));
  });

  it('should send an id and properties', function () {
    analytics.group('id', { name: 'Name' });
    assert(this.stub.calledWith('update', {
      company: {
        id: 'id',
        name: 'Name'
      }
    }));
  });
});

});