
describe('Olark', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , once = require('once')
  , sinon = require('sinon')
  , when = require('when');

var settings = {
  siteId: '5798-949-10-1692'
};

function expandThen (fn) {
  window.olark('api.box.onExpand', once(fn));
  window.olark('api.box.expand');
}

function shrinkThen (fn) {
  window.olark('api.box.onShrink', once(fn));
  window.olark('api.box.shrink');
}

before(function (done) {
  this.timeout(10000);
  this.spy = sinon.spy();
  analytics.ready(this.spy);
  analytics.initialize({ Olark: settings });
  this.integration = analytics._integrations.Olark;
  this.options = this.integration.options;
  when(function () { return window.__get_olark_key; }, done);
});

describe('#name', function () {
  it('Olark', function () {
    assert(this.integration.name == 'Olark');
  });
});

describe('#key', function () {
  it('siteId', function () {
    assert(this.integration.key == 'siteId');
  });
});

describe('#defaults', function () {
  it('identify', function () {
    assert(this.integration.defaults.identify === true);
  });

  it('track', function () {
    assert(this.integration.defaults.track === false);
  });

  it('pageview', function () {
    assert(this.integration.defaults.pageview === true);
  });

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
  });
});

describe('#identify', function () {
  beforeEach(function () {
    analytics._user.clear();
    this.spy = sinon.spy(window, 'olark');
  });

  afterEach(function () {
    this.spy.restore();
  });

  it('should send an id', function () {
    analytics.identify('id');
    assert(this.spy.calledWith('api.visitor.updateCustomFields', { id: 'id' }));
  });

  it('should send traits', function () {
    analytics.identify({ trait: true });
    assert(this.spy.calledWith('api.visitor.updateCustomFields', {
      trait: true
    }));
  });

  it('should send an id and traits', function () {
    analytics.identify('id', { trait: true });
    assert(this.spy.calledWith('api.visitor.updateCustomFields', {
      id: 'id',
      trait: true
    }));
  });

  it('should send an email', function () {
    analytics.identify({ email: 'name@example.com' });
    assert(this.spy.calledWith('api.visitor.updateEmailAddress', {
      emailAddress: 'name@example.com'
    }));
  });

  it('shouldnt send an empty email', function () {
    analytics.identify('id');
    assert(!this.spy.calledWith('api.visitor.updateEmailAddress'));
  });

  it('should send a name', function () {
    analytics.identify({ name: 'first last' });
    assert(this.spy.calledWith('api.visitor.updateFullName', {
      fullName: 'first last'
    }));
  });

  it('shouldnt send an empty name', function () {
    analytics.identify('id');
    assert(!this.spy.calledWith('api.visitor.updateFullName'));
  });

  it('should fallback to sending first and last name', function () {
    analytics.identify({
      firstName: 'first',
      lastName: 'last'
    });
    assert(this.spy.calledWith('api.visitor.updateFullName', {
      fullName: 'first last'
    }));
  });

  it('should fallback to sending only a first name', function () {
    analytics.identify({ firstName: 'first' });
    assert(this.spy.calledWith('api.visitor.updateFullName', {
      fullName: 'first'
    }));
  });

  it('should send a phone number', function () {
    analytics.identify({ phone: 'phone' });
    assert(this.spy.calledWith('api.visitor.updatePhoneNumber', {
      phoneNumber: 'phone'
    }));
  });

  it('shouldnt send an empty phone number', function () {
    analytics.identify('id');
    assert(!this.spy.calledWith('api.visitor.updatePhoneNumber'));
  });

  it('should us an id as a nickname', function () {
    analytics.identify('id');
    assert(this.spy.calledWith('api.chat.updateVisitorNickname', {
      snippet: 'id'
    }));
  });

  it('should prefer a username as a nickname', function () {
    analytics.identify('id', { username: 'username' });
    assert(this.spy.calledWith('api.chat.updateVisitorNickname', {
      snippet: 'username'
    }));
  });

  it('should prefer an email as a nickname', function () {
    analytics.identify('id', {
      username: 'username',
      email: 'name@example.com'
    });
    assert(this.spy.calledWith('api.chat.updateVisitorNickname', {
      snippet: 'name@example.com'
    }));
  });

  it('should prefer a name as a nickname', function () {
    analytics.identify('id', {
      username: 'username',
      name: 'name'
    });
    assert(this.spy.calledWith('api.chat.updateVisitorNickname', {
      snippet: 'name'
    }));
  });

  it('should prefer a name and email as a nickname', function () {
    analytics.identify('id', {
      username: 'username',
      name: 'name',
      email: 'name@example.com'
    });
    assert(this.spy.calledWith('api.chat.updateVisitorNickname', {
      snippet: 'name (name@example.com)'
    }));
  });
});

describe('#track', function () {
  beforeEach(function () {
    this.spy = sinon.spy(window, 'olark');
  });

  afterEach(function (done) {
    this.spy.restore();
    this.options.track = false;
    shrinkThen(function () {
      done();
    });
  });

  it('shouldnt send an event by default', function () {
    analytics.track('event');
    assert(!this.spy.called);
  });

  it('shouldnt send an event when the chat isnt open', function () {
    this.options.track = true;
    analytics.track('event');
    assert(!this.spy.called);
  });

  it('should send an event', function (done) {
    this.options.track = true;
    var spy = this.spy;
    expandThen(function () {
      analytics.track('event');
      assert(spy.calledWith('api.chat.sendNotificationToOperator', {
        body: 'visitor triggered "event"'
      }));
      done();
    });
  });
});

describe('#pageview', function () {
  beforeEach(function () {
    this.spy = sinon.spy(window, 'olark');
  });

  afterEach(function (done) {
    this.spy.restore();
    this.options.pageview = true;
    shrinkThen(function () {
      done();
    });
  });

  it('shouldnt send an event when the chat isnt open', function () {
    analytics.pageview();
    assert(!this.spy.called);
  });

  it('should send a pageview', function (done) {
    var spy = this.spy;
    expandThen(function () {
      analytics.pageview();
      assert(spy.calledWith('api.chat.sendNotificationToOperator', {
        body: 'looking at ' + window.location.href
      }));
      done();
    });
  });

  it('shouldnt send an event when pageview is disabled', function () {
    this.options.pageview = false;
    var spy = this.spy;
    expandThen(function () {
      analytics.pageview();
      assert(!this.spy.called);
    });
  });
});

});