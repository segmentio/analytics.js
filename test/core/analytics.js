
describe('analytics', function () {

var analytics = window.analytics || require('analytics')
  , assert = require('assert')
  , bind = require('event').bind
  , cookie = require('analytics/lib/cookie')
  , equal = require('equals')
  , group = require('analytics/lib/group')
  , integration = require('analytics/lib/integration')
  , is = require('is')
  , jQuery = require('jquery')
  , store = require('analytics/lib/store')
  , tick = require('next-tick')
  , trigger = require('trigger-event')
  , user = require('analytics/lib/user');

var settings = { Test: { key: 'x' }};
var timeout = 1;
var Test = integration('Test');
Test.prototype.key = 'key';
Test.prototype.defaults = {};
Test.prototype.initialize = function (options, ready) { setTimeout(ready, timeout); };
Test.prototype.identify = function (userId, traits) {};
Test.prototype.group = function (groupId, properties) {};
Test.prototype.track = function (event, properties) {};
Test.prototype.pageview = function () {};
Test.prototype.alias = function (newId, originalId) {};

before(function () {
  analytics.timeout(timeout);
  analytics.integration(Test);
});

beforeEach(function (done) {
  analytics.ready(done);
  analytics.initialize(settings);
});

afterEach(function () {
  analytics._callbacks = [];
  analytics._integrations = {};
  analytics._readied = false;
  analytics.user().reset();
  analytics.group().reset();
});

describe('#initialize', function () {
  beforeEach(function () {
    this.optionsSpy = sinon.spy(analytics, '_options');
    this.querySpy = sinon.spy(analytics, '_parseQuery');
    this.userSpy = sinon.spy(user, 'load');
    this.groupSpy = sinon.spy(group, 'load');
    this.initializeSpy = sinon.spy(Test.prototype, 'initialize');
  });

  afterEach(function () {
    this.optionsSpy.restore();
    this.querySpy.restore();
    this.userSpy.restore();
    this.groupSpy.restore();
    this.initializeSpy.restore();
  });

  it('shouldnt error without settings', function (done) {
    analytics.ready(done);
    analytics.initialize();
  });

  it('should set options', function (done) {
    analytics.ready(done);
    analytics.initialize({}, { option: true });
    assert(this.optionsSpy.calledWith({ option: true }));
  });

  it('should reset readied state', function (done) {
    analytics.ready(done);
    analytics._readied = true;
    analytics.initialize();
    analytics._readied = false;
  });

  it('should call ready handlers', function (done) {
    analytics.ready(done);
    analytics.initialize();
  });

  it('should set readied state', function (done) {
    analytics.ready(function () {
      assert(analytics._readied);
      done();
    });
  });

  it('should reset enabled integrations', function (done) {
    analytics.ready(done);
    analytics.initialize();
    assert(equal(analytics._integrations, {}));
  });

  it('should load the user', function (done) {
    analytics.ready(done);
    analytics.initialize();
    assert(this.userSpy.called);
  });

  it('should load the group', function (done) {
    analytics.ready(done);
    analytics.initialize();
    assert(this.groupSpy.called);
  });

  it('should store enabled integrations', function () {
    assert(analytics._integrations.Test instanceof Test);
  });

  it('shouldnt error with an unknown integration', function (done) {
    analytics.ready(done);
    analytics.initialize({ Unknown: 'x' });
  });

  it('should send settings to an integration', function (done) {
    analytics.ready(done);
    analytics.initialize(settings);
    expect(this.initializeSpy.calledWith(settings));
  });

  it('should parse the query string', function (done) {
    analytics.ready(done);
    analytics.initialize();
    assert(this.querySpy.called);
  });

  it('should set initialized state', function (done) {
    analytics.ready(done);
    analytics.initialize();
    assert(analytics.initialized);
  });
});

describe('#ready', function () {
  it('should push a handler on to the queue', function () {
    var handler = function(){};
    analytics.initialize(settings);
    analytics.ready(handler);
    assert(analytics._callbacks[0] == handler);
  });

  it('should callback on next tick when already ready', function (done) {
    var spy = sinon.spy();
    analytics.ready(spy);
    tick(function () {
      assert(spy.called);
      done();
    });
  });

  it('shouldnt error when passed a non-function', function () {
    analytics.ready('callback');
  });
});

describe('#_invoke', function () {
  beforeEach(function () {
    this.identifySpy = sinon.spy(Test.prototype, 'identify');
    this.enqueueSpy = sinon.spy(Test.prototype, 'enqueue');
  });

  afterEach(function () {
    this.identifySpy.restore();
    this.enqueueSpy.restore();
  });

  it('should call a method on an integration', function () {
    analytics._invoke('identify', 'id', { trait: true });
    assert(this.identifySpy.calledWith('id', { trait: true }));
  });

  it('shouldnt call a method when the `all` option is false', function () {
    analytics._invoke('identify', { providers: { all: false }});
    assert(!this.identifySpy.called);
  });

  it('shouldnt call a method when the integration option is false', function () {
    analytics._invoke('identify', { providers: { Test: false }});
    assert(!this.identifySpy.called);
  });

  it('should queue calls until the integration is ready', function (done) {
    analytics.ready(done);
    analytics.initialize(settings);
    analytics._invoke('identify', 'id');
    assert(this.enqueueSpy.calledWith('identify', ['id']));
  });
});

describe('#_options', function () {
  beforeEach(function () {
    this.cookieStub = sinon.stub(cookie, 'options');
    this.storeStub = sinon.stub(store, 'options');
    this.userStub = sinon.stub(user, 'options');
    this.groupStub = sinon.stub(group, 'options');
  });

  afterEach(function () {
    this.cookieStub.restore();
    this.storeStub.restore();
    this.userStub.restore();
    this.groupStub.restore();
  });

  it('should set cookie options', function () {
    analytics._options({ cookie: { option: true }});
    assert(this.cookieStub.calledWith({ option: true }));
  });

  it('should set store options', function () {
    analytics._options({ localStorage: { option: true }});
    assert(this.storeStub.calledWith({ option: true }));
  });

  it('should set user options', function () {
    analytics._options({ user: { option: true }});
    assert(this.userStub.calledWith({ option: true }));
  });

  it('should set group options', function () {
    analytics._options({ group: { option: true }});
    assert(this.groupStub.calledWith({ option: true }));
  });
});

describe('#_callback', function () {
  it('should callback after a timeout', function (done) {
    var spy = sinon.spy();
    analytics._callback(spy);
    assert(!spy.called);
    setTimeout(function () {
      assert(spy.called);
      done();
    }, timeout);
  });
});

describe('#_timeout', function () {
  before(function () {
    this._timeout = analytics._timeout;
  });

  after(function () {
    analytics._timeout = this._timeout;
  });

  it('should set the timeout for callbacks', function () {
    analytics.timeout(500);
    assert(500 == analytics._timeout);
  });
});

describe('#identify', function () {
  beforeEach(function () {
    this.spy = sinon.spy(analytics, '_invoke');
    this.userSpy = sinon.spy(user, 'identify');
  });

  afterEach(function () {
    this.spy.restore();
    this.userSpy.restore();
  });

  it('should invoke with an id, traits and options', function () {
    analytics.identify('id', {}, { option: true });
    assert(this.spy.calledWith('identify', 'id', {}, { option: true }));
  });

  it('should identify the user', function () {
    analytics.identify('id', { trait: true });
    assert(this.userSpy.calledWith('id', { trait: true }));
  });

  it('should back traits with stored traits', function () {
    user.traits({ one: 1 });
    user.save();
    analytics.identify('id', { two: 2 });
    assert(this.spy.calledWith('identify', 'id', {
      one: 1,
      two: 2
    }));
  });

  it('should accept a callback', function (done) {
    analytics.identify('id', {}, {}, done);
  });

  it('should have an id overload', function () {
    analytics.identify({ trait: true }, { option: true });
    assert(this.spy.calledWith('identify', null, { trait: true }, { option: true }));
  });

  it('should have a traits overload', function (done) {
    analytics.identify('id', done);
  });

  it('should have an options overload', function (done) {
    analytics.identify('id', {}, done);
  });

  it('should parse a created string into a date', function () {
    var date = new Date();
    var string = date.getTime() + '';
    analytics.identify({ created: string });
    var created = this.spy.args[0][2].created;
    assert(is.date(created));
    assert(created.getTime() == date.getTime());
  });

  it('should parse created milliseconds into a date', function () {
    var date = new Date();
    var milliseconds = date.getTime();
    analytics.identify({ created: milliseconds });
    var created = this.spy.args[0][2].created;
    assert(is.date(created));
    assert(created.getTime() == milliseconds);
  });

  it('should parse created seconds into a date', function () {
    var date = new Date();
    var seconds = Math.floor(date.getTime() / 1000);
    analytics.identify({ created: seconds });
    var created = this.spy.args[0][2].created;
    assert(is.date(created));
    assert(created.getTime() == seconds * 1000);
  });

  it('should parse a company created string into a date', function () {
    var date = new Date();
    var string = date.getTime() + '';
    analytics.identify({ company: { created: string }});
    var created = this.spy.args[0][2].company.created;
    assert(is.date(created));
    assert(created.getTime() == date.getTime());
  });

  it('should parse company created milliseconds into a date', function () {
    var date = new Date();
    var milliseconds = date.getTime();
    analytics.identify({ company: { created: milliseconds }});
    var created = this.spy.args[0][2].company.created;
    assert(is.date(created));
    assert(created.getTime() == milliseconds);
  });

  it('should parse company created seconds into a date', function () {
    var date = new Date();
    var seconds = Math.floor(date.getTime() / 1000);
    analytics.identify({ company: { created: seconds }});
    var created = this.spy.args[0][2].company.created;
    assert(is.date(created));
    assert(created.getTime() == seconds * 1000);
  });
});

describe('#user', function () {
  it('should return the user singleton', function () {
    assert(analytics.user() == user);
  });
});

describe('#group', function () {
  beforeEach(function () {
    this.spy = sinon.spy(analytics, '_invoke');
    this.groupSpy = sinon.spy(group, 'identify');
  });

  afterEach(function () {
    this.spy.restore();
    this.groupSpy.restore();
  });

  it('should return the group singleton', function () {
    assert(analytics.group() == group);
  });

  it('should invoke with an id, properties and options', function () {
    analytics.group('id', {}, { option: true });
    assert(this.spy.calledWith('group', 'id', {}, { option: true }));
  });

  it('should identify the group', function () {
    analytics.group('id', { property: true });
    assert(this.groupSpy.calledWith('id', { property: true }));
  });

  it('should back properties with stored properties', function () {
    group.properties({ one: 1 });
    group.save();
    analytics.group('id', { two: 2 });
    assert(this.spy.calledWith('group', 'id', {
      one: 1,
      two: 2
    }));
  });

  it('should accept a callback', function (done) {
    analytics.group('id', {}, {}, done);
  });

  it('should have an id overload', function () {
    analytics.group({ property: true }, { option: true });
    assert(this.spy.calledWith('group', null, { property: true }, { option: true }));
  });

  it('should have a properties overload', function (done) {
    analytics.group('id', done);
  });

  it('should have an options overload', function (done) {
    analytics.group('id', {}, done);
  });

  it('should parse a created string into a date', function () {
    var date = new Date();
    var string = date.getTime() + '';
    analytics.group({ created: string });
    var created = this.spy.args[0][2].created;
    assert(is.date(created));
    assert(created.getTime() == date.getTime());
  });

  it('should parse created milliseconds into a date', function () {
    var date = new Date();
    var milliseconds = date.getTime();
    analytics.group({ created: milliseconds });
    var created = this.spy.args[0][2].created;
    assert(is.date(created));
    assert(created.getTime() == milliseconds);
  });

  it('should parse created seconds into a date', function () {
    var date = new Date();
    var seconds = Math.floor(date.getTime() / 1000);
    analytics.group({ created: seconds });
    var created = this.spy.args[0][2].created;
    assert(is.date(created));
    assert(created.getTime() == seconds * 1000);
  });
});

describe('#track', function () {
  beforeEach(function () {
    this.spy = sinon.spy(analytics, '_invoke');
  });

  afterEach(function () {
    this.spy.restore();
  });

  it('should invoke with an event, properties and options', function () {
    analytics.track('event', { property: true }, { option: true });
    assert(this.spy.calledWith('track', 'event', { property: true }, { option: true }));
  });

  it('should accept a callback', function (done) {
    analytics.track('event', {}, {}, done);
  });

  it('should have a properties overload', function (done) {
    analytics.track('event', done);
  });

  it('should have an options overload', function (done) {
    analytics.track('event', {}, done);
  });
});

describe('#trackLink', function () {
  beforeEach(function () {
    this.spy = sinon.spy(analytics, 'track');
    this.link = document.createElement('a');
  });

  afterEach(function () {
    this.spy.restore();
    window.location.hash = '';
  });

  it('should trigger a track on an element click', function () {
    analytics.trackLink(this.link);
    trigger(this.link, 'click');
    assert(this.spy.called);
  });

  it('should accept a jquery object for an element', function () {
    var link = jQuery(this.link);
    analytics.trackLink(link);
    trigger(this.link, 'click');
    assert(this.spy.called);
  });

  it('should send an event and properties', function () {
    analytics.trackLink(this.link, 'event', { property: true });
    trigger(this.link, 'click');
    assert(this.spy.calledWith('event', { property: true }));
  });

  it('should accept an event function', function () {
    var a = document.createElement('a');
    var button = document.createElement('button');
    var event = function (el) {
      return el.nodeName;
    };

    analytics.trackLink(a, event);
    trigger(a, 'click');
    assert(this.spy.calledWith('A'));

    this.spy.reset();

    analytics.trackLink(button, event);
    trigger(button, 'click');
    assert(this.spy.calledWith('BUTTON'));
  });

  it('should accept a properties function', function () {
    var a = document.createElement('a');
    var button = document.createElement('button');
    var properties = function (el) {
      return { type: el.nodeName };
    };

    analytics.trackLink(a, 'event', properties);
    trigger(a, 'click');
    assert(this.spy.calledWith('event', { type: 'A' }));

    this.spy.reset();

    analytics.trackLink(button, 'event', properties);
    trigger(button, 'click');
    assert(this.spy.calledWith('event', { type: 'BUTTON' }));
  });

  it('should load an href on click', function (done) {
    this.link.href = '#test';
    analytics.trackLink(this.link);
    trigger(this.link, 'click');
    setTimeout(function () {
      assert(window.location.hash == '#test');
      done();
    }, timeout);
  });

  it('shouldnt load an href for a link with a blank target', function (done) {
    this.link.href = '/test/server/mock.html';
    this.link.target = '_blank';
    analytics.trackLink(this.link);
    trigger(this.link, 'click');
    setTimeout(function () {
      assert(window.location.hash != '#test');
      done();
    }, timeout);
  });

  // it('shouldnt load an href for a link with a meta click', function (done) {
  //   this.link.href = '/test/server/mock.html';
  //   analytics.trackLink(this.link);
  //   trigger(this.link, 'click', { meta: true });
  //   setTimeout(function () {
  //     assert(window.location.hash != '#test');
  //     done();
  //   }, timeout);
  // });
});

describe('#trackForm', function () {
  before(function () {
    window.jQuery = jQuery;
  });

  after(function () {
    delete window.jQuery;
  });

  beforeEach(function () {
    this.spy = sinon.spy(analytics, 'track');
    this.form = document.createElement('form');
    this.form.action = '/test/server/mock.html';
    this.form.target = '_blank';
    this.submit = document.createElement('input');
    this.submit.type = 'submit';
    this.form.appendChild(this.submit);
  });

  afterEach(function () {
    this.spy.restore();
    window.location.hash = '';
  });

  it('should trigger a track on a form submit', function () {
    analytics.trackForm(this.form);
    trigger(this.submit, 'click');
    assert(this.spy.called);
  });

  it('should accept a jquery object for an element', function () {
    var form = jQuery(this.form);
    analytics.trackForm(form);
    trigger(this.submit, 'click');
    assert(this.spy.called);
  });

  it('should send an event and properties', function () {
    analytics.trackForm(this.form, 'event', { property: true });
    trigger(this.submit, 'click');
    assert(this.spy.calledWith('event', { property: true }));
  });

  it('should accept an event function', function () {
    var event = function (el) {
      return 'event';
    };
    analytics.trackForm(this.form, event);
    trigger(this.submit, 'click');
    console.log(this.spy.args);
    assert(this.spy.calledWith('event'));
  });

  it('should accept a properties function', function () {
    var properties = function (el) {
      return { property: true };
    };
    analytics.trackForm(this.form, 'event', properties);
    trigger(this.submit, 'click');
    assert(this.spy.calledWith('event', { property: true }));
  });

  it('should call submit after a timeout', function (done) {
    var spy = sinon.spy(this.form, 'submit');
    analytics.trackForm(this.form);
    trigger(this.submit, 'click');
    setTimeout(function () {
      assert(spy.called);
      done();
    });
  });

  it('should trigger an existing submit handler', function (done) {
    bind(this.form, 'submit', function () { done(); });
    analytics.trackForm(this.form);
    trigger(this.submit, 'click');
  });

  it('should trigger an existing jquery submit handler', function (done) {
    var form = jQuery(this.form);
    form.submit(function () { done(); });
    analytics.trackForm(form);
    trigger(this.submit, 'click');
  });

  it('should track on a form submitted via jquery', function () {
    var form = jQuery(this.form);
    analytics.trackForm(form);
    form.submit();
    assert(this.spy.called);
  });

  it('should trigger an existing jquery submit handler on a form submitted via jquery', function (done) {
    var form = jQuery(this.form);
    form.submit(function () { done(); });
    analytics.trackForm(form);
    form.submit();
  });
});

describe('#pageview', function () {
  beforeEach(function () {
    this.spy = sinon.spy(analytics, '_invoke');
  });

  afterEach(function () {
    this.spy.restore();
  });

  it('should invoke with a url and options', function () {
    analytics.pageview('/path', { option: true });
    assert(this.spy.calledWith('pageview', '/path', { option: true }));
  });
});

describe('#alias', function () {
  beforeEach(function () {
    this.spy = sinon.spy(analytics, '_invoke');
  });

  afterEach(function () {
    this.spy.restore();
  });

  it('should invoke with a new id, old id and options', function () {
    analytics.alias('new', 'old', { option: true });
    assert(this.spy.calledWith('alias', 'new', 'old', { option: true }));
  });

  it('should have an old id override', function () {
    analytics.alias('new', { option: true });
    assert(this.spy.calledWith('alias', 'new', undefined, { option: true }));
  });
});

});