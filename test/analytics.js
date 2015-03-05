
describe('Analytics', function () {

  var createIntegration = require('analytics.js-integration');
  var analytics = window.analytics;
  var Analytics = analytics.constructor;
  var assert = require('assert');
  var bind = require('event').bind;
  var cookie = Analytics.cookie;
  var equal = require('equals');
  var extend = require('extend');
  var group = analytics.group();
  var is = require('is');
  var jQuery = require('jquery');
  var pageDefaults = require('../lib/pageDefaults');
  var sinon = require('sinon');
  var store = Analytics.store;
  var tick = require('next-tick');
  var trigger = require('trigger-event');
  var user = analytics.user();
  var Facade = require('facade');
  var Identify = Facade.Identify;
  var Group = Facade.Group;
  var Track = Facade.Track;
  var Alias = Facade.Alias;
  var Page = Facade.Page;

  var analytics;
  var contextPage;
  var Test;
  var settings;

  beforeEach(function(){
    settings = {
      Test: {
        key: 'key'
      }
    };

    contextPage = pageDefaults();
  });

  beforeEach(function () {
    analytics = new Analytics();
    analytics.timeout(0);
    Test = createIntegration('Test');
  });

  afterEach(function () {
    user.reset();
    group.reset();
    user.anonymousId(null);
    // clear the hash
    if (window.history && window.history.pushState) {
      window.history.pushState('', '', window.location.pathname);
    }
  });

  it('should setup an Integrations object', function () {
    assert(is.object(analytics.Integrations));
  });

  it('should setup an _integrations object', function () {
    assert(is.object(analytics._integrations));
  });

  it('should set a _readied state', function () {
    assert(false === analytics._readied);
  });

  it('should set a default timeout', function () {
    analytics = new Analytics();
    assert(300 === analytics._timeout);
  });

  it('should set the _user for backwards compatibility', function () {
    assert(analytics._user === user);
  });

  describe('#use', function () {
    it('should work', function (done) {
      analytics.use(function (singleton) {
        assert(analytics == singleton);
        done();
      });
    });
  });

  describe('#addIntegration', function () {
    it('should add an integration', function () {
      analytics.addIntegration(Test);
      assert(analytics.Integrations.Test === Test);
    });
  });

  describe('#setAnonymousId', function(){
    it('should set the user\'s anonymous id', function(){
      var prev = analytics.user().anonymousId();
      assert.equal(36, prev.length);
      analytics.setAnonymousId('new-id');
      var curr = analytics.user().anonymousId();
      assert.equal('new-id', curr);
    });
  });

  describe('#initialize', function () {
    beforeEach(function () {
      sinon.spy(user, 'load');
      sinon.spy(group, 'load');
    });

    afterEach(function () {
      user.load.restore();
      group.load.restore();
    });

    it('should not error without settings', function () {
      analytics.initialize();
    });

    it('should set options', function () {
      analytics._options = sinon.spy();
      analytics.initialize({}, { option: true });
      assert(analytics._options.calledWith({ option: true }));
    });

    it('should reset analytics._readied to false', function () {
      analytics.addIntegration(Test);
      analytics._readied = true;
      analytics.initialize(settings);
      assert(!analytics._readied);
    });

    it('should add integration instance', function(done){
      Test.readyOnInitialize();
      analytics.addIntegration(Test);
      analytics.ready(done);
      var test = new Test(settings.Test);
      analytics.add(test);
      analytics.initialize();
    });

    it('should set `.analytics` to self on integration', function(done){
      Test.readyOnInitialize();
      analytics.addIntegration(Test);
      analytics.ready(done);
      var test = new Test(settings.Test);
      analytics.add(test);
      analytics.initialize();
      assert(analytics == test.analytics);
    });

    it('should listen on integration ready events', function (done) {
      Test.readyOnInitialize();
      analytics.addIntegration(Test);
      analytics.ready(done);
      analytics.initialize(settings);
    });

    it('should still call ready with unknown integrations', function (done) {
      analytics.ready(done);
      analytics.initialize({ Unknown: { key: 'key' }});
    });

    it('should set analytics._readied to true', function (done) {
      analytics.ready(function () {
        assert(analytics._readied);
        done();
      });
      analytics.initialize();
    });

    it('should call #load on the user', function () {
      analytics.initialize();
      assert(user.load.called);
    });

    it('should call #load on the group', function () {
      analytics.initialize();
      assert(group.load.called);
    });

    it('should store enabled integrations', function (done) {
      Test.readyOnInitialize();
      analytics.addIntegration(Test);
      analytics.ready(function () {
        assert(analytics._integrations.Test instanceof Test);
        done();
      });
      analytics.initialize(settings);
    });

    it('should send settings to an integration', function (done) {
      Test = function (options) {
        assert(equal(settings.Test, options));
        done();
      };
      Test.prototype.name = 'Test';
      Test.prototype.once = Test.prototype.initialize = function(){};
      analytics.addIntegration(Test);
      analytics.initialize(settings);
    });

    it('should parse the query string', function () {
      sinon.stub(analytics, '_parseQuery');
      analytics.initialize();
      assert(analytics._parseQuery.called);
    });

    it('should set initialized state', function () {
      analytics.initialize();
      assert(analytics.initialized);
    });

    it('should emit initialize', function (done) {
      analytics.once('initialize',function () {
        done();
      });
      analytics.initialize();
    });
  });

  describe('#ready', function () {
    it('should push a handler on to the queue', function (done) {
      analytics.ready(done);
      analytics.emit('ready');
    });

    it('should callback on next tick when already ready', function (done) {
      analytics.ready(function () {
        var spy = sinon.spy();
        analytics.ready(spy);
        assert(!spy.called);
        tick(function () {
          assert(spy.called);
          done();
        });
      });
      analytics.initialize();
    });

    it('should emit ready', function (done) {
      analytics.once('ready', done);
      analytics.initialize();
    });

    it('should not error when passed a non-function', function () {
      analytics.ready('callback');
    });
  });

  describe('#_invoke', function () {
    beforeEach(function (done) {
      Test.readyOnInitialize();
      Test.prototype.invoke = sinon.spy();
      analytics.addIntegration(Test);
      analytics.ready(done);
      analytics.initialize(settings);
    });

    it('should invoke a method on integration with facade', function(){
      var a = new Identify({ userId: 'id', traits: { trait: true } });
      analytics._invoke('identify', a);
      var b = Test.prototype.invoke.args[0][1];
      assert(b == a);
      assert('id' == b.userId());
      assert(true == b.traits().trait);
    })

    it('shouldnt call a method when the `all` option is false', function () {
      var opts = { providers: { all: false } };
      var facade = new Facade({ options: opts });
      analytics._invoke('identify', facade);
      assert(!Test.prototype.invoke.called);
    });

    it('shouldnt call a method when the integration option is false', function () {
      var opts = { providers: { Test: false } };
      var facade = new Facade({ options: opts });
      analytics._invoke('identify', facade);
      assert(!Test.prototype.invoke.called);
    });

    it('should support .integrations to disable / select integrations', function(){
      var opts = { integrations: { Test: false } };
      var facade = new Facade({ options: opts });
      analytics.identify('123', {}, opts);
      assert(!Test.prototype.invoke.called);
    })

    it('should emit "invoke" with facade', function(done){
      var opts = { All: false };
      var identify = new Identify({ options: opts });
      analytics.on('invoke', function(msg){
        assert(identify == msg);
        assert('identify' == msg.action());
        done();
      });
      analytics._invoke('identify', identify);
    })
  });

  describe('#_options', function () {
    beforeEach(function () {
      sinon.stub(cookie, 'options');
      sinon.stub(store, 'options');
      sinon.stub(user, 'options');
      sinon.stub(group, 'options');
    });

    afterEach(function () {
      cookie.options.restore();
      store.options.restore();
      user.options.restore();
      group.options.restore();
    });

    it('should set cookie options', function () {
      analytics._options({ cookie: { option: true }});
      assert(cookie.options.calledWith({ option: true }));
    });

    it('should set store options', function () {
      analytics._options({ localStorage: { option: true }});
      assert(store.options.calledWith({ option: true }));
    });

    it('should set user options', function () {
      analytics._options({ user: { option: true }});
      assert(user.options.calledWith({ option: true }));
    });

    it('should set group options', function () {
      analytics._options({ group: { option: true }});
      assert(group.options.calledWith({ option: true }));
    });
  });

  describe('#_timeout', function () {
    it('should set the timeout for callbacks', function () {
      analytics.timeout(500);
      assert(500 === analytics._timeout);
    });
  });

  describe('#_callback', function () {
    it('should callback after a timeout', function (done) {
      var spy = sinon.spy();
      analytics._callback(spy);
      assert(!spy.called);
      tick(function () {
        assert(spy.called);
        done();
      });
    });
  });

  describe('#page', function () {
    var head = document.getElementsByTagName('head')[0];
    var defaults;

    beforeEach(function () {
      defaults = {
        path: window.location.pathname,
        referrer: document.referrer,
        title: document.title,
        url: window.location.href,
        search: window.location.search
      };
      sinon.spy(analytics, '_invoke');
    });

    it('should call #_invoke', function () {
      analytics.page();
      assert(analytics._invoke.calledWith('page'));
    });

    it('should default .anonymousId', function(){
      analytics.page();
      var msg = analytics._invoke.args[0][1];
      assert(36 == msg.anonymousId().length);
    });

    it('should override .anonymousId', function(){
      analytics.page('category', 'name', {}, { anonymousId: 'anon-id' });
      var msg = analytics._invoke.args[0][1];
      assert('anon-id' == msg.anonymousId());
    });

    it('should call #_invoke with Page instance', function(){
      analytics.page();
      var page = analytics._invoke.args[0][1];
      assert('page' == page.action());
    })

    it('should default .url to .location.href', function(){
      analytics.page();
      var page = analytics._invoke.args[0][1];
      var href = window.location.href;
      assert(href == page.properties().url);
    });

    it('should respect canonical', function(){
      var el = document.createElement('link');
      el.rel = 'canonical';
      el.href = 'baz.com';
      head.appendChild(el);
      analytics.page();
      var page = analytics._invoke.args[0][1];
      assert.equal('baz.com' + window.location.search, page.properties().url);
      el.parentNode.removeChild(el);
    });

    it('should accept (category, name, properties, options, callback)', function (done) {
      defaults.category = 'category';
      defaults.name = 'name';
      analytics.page('category', 'name', {}, {}, function () {
        var page = analytics._invoke.args[0][1];
        assert('category' == page.category());
        assert('name' == page.name());
        assert('object' == typeof page.properties());
        assert('object' == typeof page.options());
        done();
      });
    });

    it('should accept (category, name, properties, callback)', function (done) {
      defaults.category = 'category';
      defaults.name = 'name';
      analytics.page('category', 'name', {}, function () {
        var page = analytics._invoke.args[0][1];
        assert('category' == page.category());
        assert('name' == page.name());
        assert('object' == typeof page.properties());
        done();
      });
    });

    it('should accept (category, name, callback)', function (done) {
      defaults.category = 'category';
      defaults.name = 'name';
      analytics.page('category', 'name', function () {
        var page = analytics._invoke.args[0][1];
        assert('category' == page.category());
        assert('name' == page.name());
        done();
      });
    });

    it('should accept (name, properties, options, callback)', function (done) {
      defaults.name = 'name';
      analytics.page('name', {}, {}, function () {
        var page = analytics._invoke.args[0][1];
        assert('name' == page.name());
        assert('object' == typeof page.properties());
        assert('object' == typeof page.options());
        done();
      });
    });

    it('should accept (name, properties, callback)', function (done) {
      defaults.name = 'name';
      analytics.page('name', {}, function () {
        var page = analytics._invoke.args[0][1];
        assert('name' == page.name());
        assert('object' == typeof page.properties());
        done();
      });
    });

    it('should accept (name, callback)', function (done) {
      defaults.name = 'name';
      analytics.page('name', function () {
        var page = analytics._invoke.args[0][1];
        assert('name' == page.name());
        done();
      });
    });

    it('should accept (properties, options, callback)', function (done) {
      analytics.page({}, {}, function () {
        var page = analytics._invoke.args[0][1];
        assert(null == page.category());
        assert(null == page.name());
        assert('object' == typeof page.properties());
        assert('object' == typeof page.options());
        done();
      });
    });

    it('should accept (properties, callback)', function (done) {
      analytics.page({}, function () {
        var page = analytics._invoke.args[0][1];
        assert(null == page.category());
        assert(null == page.name());
        assert('object' == typeof page.options());
        done();
      });
    });

    it('should back properties with defaults', function () {
      defaults.property = true;
      analytics.page({ property: true });
      var page = analytics._invoke.args[0][1];
      assert.deepEqual(defaults, page.properties());
    });

    it('should accept top level option .timestamp', function(){
      var date = new Date;
      analytics.page({ prop: true }, { timestamp: date });
      var page = analytics._invoke.args[0][1];
      assert.deepEqual(date, page.timestamp());
    });

    it('should accept top level option .integrations', function(){
      analytics.page({ prop: true }, { integrations: { AdRoll: { opt: true } } });
      var page = analytics._invoke.args[0][1];
      assert.deepEqual({ opt: true }, page.options('AdRoll'));
    });

    it('should accept top level option .context', function(){
      var app = { name: 'segment' };
      analytics.page({ prop: true }, { context: { app: app } });
      var page = analytics._invoke.args[0][1];
      assert.deepEqual(app, page.obj.context.app);
    });

    it('should accept top level option .anonymousId', function(){
      var app = { name: 'segment' };
      analytics.page({ prop: true }, { anonymousId: 'id' });
      var page = analytics._invoke.args[0][1];
      assert.equal('id', page.obj.anonymousId);
    });

    it('should include context.page', function(){
      analytics.page();
      var page = analytics._invoke.args[0][1];
      assert.deepEqual(page.context(), { page: defaults });
    });

    it('should accept context.traits', function(){
      analytics.page({ prop: true }, { traits: { trait: true } });
      var page = analytics._invoke.args[0][1];
      assert.deepEqual(page.context(), {
        page: defaults,
        traits: { trait: true }
      });
    });

    it('should emit page', function (done) {
      analytics.once('page', function (category, name, props, opts) {
        assert('category' === category);
        assert('name' === name);
        assert.deepEqual(opts, { context: { page: defaults } });
        assert.deepEqual(props, extend(defaults, { category: 'category', name: 'name' }));
        done();
      });
      analytics.page('category', 'name', {}, {});
    });
  });

  describe('#pageview', function () {
    beforeEach(function () {
      analytics.initialize();
      sinon.spy(analytics, 'page');
    });

    it('should call #page with a path', function () {
      analytics.pageview('/path');
      assert(analytics.page.calledWith({ path: '/path' }));
    });
  });

  describe('#identify', function () {
    beforeEach(function () {
      sinon.spy(analytics, '_invoke');
      sinon.spy(user, 'identify');
    });

    afterEach(function () {
      user.identify.restore();
    });

    it('should call #_invoke', function () {
      analytics.identify();
      assert(analytics._invoke.calledWith('identify'));
    });

    it('should default .anonymousId', function(){
      analytics.identify('user-id');
      var msg = analytics._invoke.args[0][1];
      assert(36 == msg.anonymousId().length);
    });

    it('should override .anonymousId', function(){
      analytics.identify('user-id', {}, { anonymousId: 'anon-id' });
      var msg = analytics._invoke.args[0][1];
      assert('anon-id' == msg.anonymousId());
    });

    it('should call #_invoke with Identify', function(){
      analytics.identify();
      var identify = analytics._invoke.getCall(0).args[1];
      assert('identify' == identify.action());
    })

    it('should accept (id, traits, options, callback)', function (done) {
      analytics.identify('id', {}, {}, function () {
        var identify = analytics._invoke.getCall(0).args[1];
        assert('id' == identify.userId());
        assert('object' == typeof identify.traits());
        assert('object' == typeof identify.options());
        done();
      });
    });

    it('should accept (id, traits, callback)', function (done) {
      analytics.identify('id', { trait: true }, function () {
        var identify = analytics._invoke.getCall(0).args[1];
        assert('id' == identify.userId());
        assert('object' == typeof identify.traits());
        done();
      });
    });

    it('should accept (id, callback)', function (done) {
      analytics.identify('id', function () {
        var identify = analytics._invoke.getCall(0).args[1];
        assert('identify' == identify.action());
        assert('id' == identify.userId());
        done();
      });
    });

    it('should accept (traits, options, callback)', function (done) {
      analytics.identify({}, {}, function () {
        var identify = analytics._invoke.getCall(0).args[1];
        assert('object' == typeof identify.traits());
        assert('object' == typeof identify.options());
        done();
      });
    });

    it('should accept (traits, callback)', function (done) {
      analytics.identify({}, function () {
        var identify = analytics._invoke.getCall(0).args[1];
        assert('object' == typeof identify.traits());
        done();
      });
    });

    it('should identify the user', function () {
      analytics.identify('id', { trait: true });
      assert(user.identify.calledWith('id', { trait: true }));
    });

    it('should back traits with stored traits', function () {
      user.traits({ one: 1 });
      user.save();
      analytics.identify('id', { two: 2 });
      var call = analytics._invoke.getCall(0);
      var identify = call.args[1];
      assert('identify' == call.args[0]);
      assert('id' == identify.userId());
      assert(1 == identify.traits().one);
      assert(2 == identify.traits().two);
    });

    it('should emit identify', function (done) {
      analytics.once('identify', function (id, traits, options) {
        assert(id === 'id');
        assert(equal(traits, { a: 1 }));
        assert(equal(options, { b: 2 }));
        done();
      });
      analytics.identify('id', { a: 1 }, { b: 2 });
    });

    it('should parse a created string into a date', function () {
      var date = new Date();
      var string = date.getTime().toString();
      analytics.identify({ created: string });
      var created = analytics._invoke.args[0][1].created();
      assert(is.date(created));
      assert(created.getTime() === date.getTime());
    });

    it('should parse created milliseconds into a date', function () {
      var date = new Date();
      var milliseconds = date.getTime();
      analytics.identify({ created: milliseconds });
      var created = analytics._invoke.args[0][1].created();
      assert(is.date(created));
      assert(created.getTime() === milliseconds);
    });

    it('should parse created seconds into a date', function () {
      var date = new Date();
      var seconds = Math.floor(date.getTime() / 1000);
      analytics.identify({ created: seconds });
      var identify = analytics._invoke.args[0][1];
      var created = identify.created();
      assert(is.date(created));
      assert(created.getTime() === seconds * 1000);
    });

    it('should parse a company created string into a date', function () {
      var date = new Date();
      var string = date.getTime() + '';
      analytics.identify({ company: { created: string }});
      var identify = analytics._invoke.args[0][1];
      var created = identify.companyCreated();
      assert(is.date(created));
      assert(created.getTime() === date.getTime());
    });

    it('should parse company created milliseconds into a date', function () {
      var date = new Date();
      var milliseconds = date.getTime();
      analytics.identify({ company: { created: milliseconds }});
      var identify = analytics._invoke.args[0][1];
      var created = identify.companyCreated();
      assert(is.date(created));
      assert(created.getTime() === milliseconds);
    });

    it('should parse company created seconds into a date', function () {
      var date = new Date();
      var seconds = Math.floor(date.getTime() / 1000);
      analytics.identify({ company: { created: seconds }});
      var identify = analytics._invoke.args[0][1];
      var created = identify.companyCreated();
      assert(is.date(created));
      assert(created.getTime() === seconds * 1000);
    });

    it('should accept top level option .timestamp', function(){
      var date = new Date;
      analytics.identify(1, { trait: true }, { timestamp: date });
      var identify = analytics._invoke.args[0][1];
      assert.deepEqual(date, identify.timestamp());
    });

    it('should accept top level option .integrations', function(){
      analytics.identify(1, { trait: true }, { integrations: { AdRoll: { opt: true } } });
      var identify = analytics._invoke.args[0][1];
      assert.deepEqual({ opt: true }, identify.options('AdRoll'));
    });

    it('should accept top level option .context', function(){
      var app = { name: 'segment' };
      analytics.identify(1, { trait: true }, { context: { app: app } });
      var identify = analytics._invoke.args[0][1];
      assert.deepEqual(app, identify.obj.context.app);
    });

    it('should include context.page', function(){
      analytics.identify(1);
      var identify = analytics._invoke.args[0][1];
      assert.deepEqual(identify.context(), { page: contextPage });
    });

    it('should accept context.traits', function(){
      analytics.identify(1, { trait: 1 }, { traits: { trait: true } });
      var identify = analytics._invoke.args[0][1];
      assert.deepEqual(identify.traits(), { trait: 1, id: 1 });
      assert.deepEqual(identify.context(), {
        page: contextPage,
        traits: { trait: true }
      });
    });
  });

  describe('#user', function () {
    it('should return the user singleton', function () {
      assert(analytics.user() == user);
    });
  });

  describe('#group', function () {
    beforeEach(function () {
      sinon.spy(analytics, '_invoke');
      sinon.spy(group, 'identify');
    });

    afterEach(function () {
      group.identify.restore();
    });

    it('should return the group singleton', function () {
      assert(analytics.group() == group);
    });

    it('should call #_invoke', function () {
      analytics.group('id');
      assert(analytics._invoke.calledWith('group'));
    });

    it('should default .anonymousId', function(){
      analytics.group('group-id');
      var msg = analytics._invoke.args[0][1];
      assert(36 == msg.anonymousId().length);
    });

    it('should override .anonymousId', function(){
      analytics.group('group-id', {}, { anonymousId: 'anon-id' });
      var msg = analytics._invoke.args[0][1];
      assert('anon-id' == msg.anonymousId());
    });

    it('should call #_invoke with group facade instance', function(){
      analytics.group('id');
      var group = analytics._invoke.args[0][1];
      assert('group' == group.action());
    })

    it('should accept (id, properties, options, callback)', function (done) {
      analytics.group('id', {}, {}, function () {
        var group = analytics._invoke.args[0][1];
        assert('id' == group.groupId());
        assert('object' == typeof group.properties());
        assert('object' == typeof group.options());
        done();
      });
    });

    it('should accept (id, properties, callback)', function (done) {
      analytics.group('id', {}, function () {
        var group = analytics._invoke.args[0][1];
        assert('id' == group.groupId());
        assert('object' == typeof group.properties());
        done();
      });
    });

    it('should accept (id, callback)', function (done) {
      analytics.group('id', function () {
        var group = analytics._invoke.args[0][1];
        assert('id' == group.groupId());
        done();
      });
    });

    it('should accept (properties, options, callback)', function (done) {
      analytics.group({}, {}, function () {
        var group = analytics._invoke.args[0][1];
        assert('object' == typeof group.properties());
        assert('object' == typeof group.options());
        done();
      });
    });

    it('should accept (properties, callback)', function (done) {
      analytics.group({}, function () {
        var group = analytics._invoke.args[0][1];
        assert('object' == typeof group.properties());
        done();
      });
    });

    it('should call #identify on the group', function () {
      analytics.group('id', { property: true });
      assert(group.identify.calledWith('id', { property: true }));
    });

    it('should back properties with stored properties', function () {
      group.properties({ one: 1 });
      group.save();
      analytics.group('id', { two: 2 });
      var g = analytics._invoke.args[0][1];
      assert('id' == g.groupId());
      assert('object' == typeof g.properties());
      assert(1 == g.properties().one);
      assert(2 == g.properties().two);
    });

    it('should emit group', function (done) {
      analytics.once('group', function (groupId, traits, options) {
        assert(groupId === 'id');
        assert(equal(traits, { a: 1 }));
        assert(equal(options, { b: 2 }));
        done();
      });
      analytics.group('id', { a: 1 }, { b: 2 });
    });

    it('should parse a created string into a date', function () {
      var date = new Date();
      var string = date.getTime().toString();
      analytics.group({ created: string });
      var g = analytics._invoke.args[0][1];
      var created = g.created();
      assert(is.date(created));
      assert(created.getTime() === date.getTime());
    });

    it('should parse created milliseconds into a date', function () {
      var date = new Date();
      var milliseconds = date.getTime();
      analytics.group({ created: milliseconds });
      var g = analytics._invoke.args[0][1];
      var created = g.created();
      assert(is.date(created));
      assert(created.getTime() === milliseconds);
    });

    it('should parse created seconds into a date', function () {
      var date = new Date();
      var seconds = Math.floor(date.getTime() / 1000);
      analytics.group({ created: seconds });
      var g = analytics._invoke.args[0][1];
      var created = g.created();
      assert(is.date(created));
      assert(created.getTime() === seconds * 1000);
    });

    it('should accept top level option .timestamp', function(){
      var date = new Date;
      analytics.group(1, { trait: true }, { timestamp: date });
      var group = analytics._invoke.args[0][1];
      assert.deepEqual(date, group.timestamp());
    });

    it('should accept top level option .integrations', function(){
      analytics.group(1, { trait: true }, { integrations: { AdRoll: { opt: true } } });
      var group = analytics._invoke.args[0][1];
      assert.deepEqual({ opt: true }, group.options('AdRoll'));
    });

    it('should accept top level option .context', function(){
      var app = { name: 'segment' };
      analytics.group(1, { trait: true }, { context: { app: app } });
      var group = analytics._invoke.args[0][1];
      assert.deepEqual(app, group.obj.context.app);
    });

    it('should include context.page', function(){
      analytics.group(1);
      var group = analytics._invoke.args[0][1];
      assert.deepEqual(group.context(), { page: contextPage });
    });

    it('should accept context.traits', function(){
      analytics.group(1, { trait: 1 }, { traits: { trait: true } });
      var group = analytics._invoke.args[0][1];
      assert.deepEqual(group.traits(), { trait: 1, id: 1 });
      assert.deepEqual(group.context(), {
        page: contextPage,
        traits: { trait: true }
      });
    });
  });

  describe('#track', function () {
    beforeEach(function () {
      sinon.spy(analytics, '_invoke');
    });

    it('should call #_invoke', function () {
      analytics.track();
      assert(analytics._invoke.calledWith('track'));
    });

    it('should default .anonymousId', function(){
      analytics.track();
      var msg = analytics._invoke.args[0][1];
      assert(36 == msg.anonymousId().length);
    });

    it('should override .anonymousId', function(){
      analytics.track('event', {}, { anonymousId: 'anon-id' });
      var msg = analytics._invoke.args[0][1];
      assert('anon-id' == msg.anonymousId());
    });

    it('should transform arguments into Track', function(){
      analytics.track();
      var track = analytics._invoke.getCall(0).args[1];
      assert('track' == track.action());
    })

    it('should accept (event, properties, options, callback)', function (done) {
      analytics.track('event', {}, {}, function () {
        var track = analytics._invoke.args[0][1];
        assert('event' == track.event());
        assert('object' == typeof track.properties());
        assert('object' == typeof track.options());
        done();
      });
    });

    it('should accept (event, properties, callback)', function (done) {
      analytics.track('event', {}, function () {
        var track = analytics._invoke.args[0][1];
        assert('event' == track.event());
        assert('object' == typeof track.properties());
        done();
      });
    });

    it('should accept (event, callback)', function (done) {
      analytics.track('event', function () {
        var track = analytics._invoke.args[0][1];
        assert('event' == track.event());
        done();
      });
    });

    it('should emit track', function (done) {
      analytics.once('track', function (event, properties, options) {
        assert(event === 'event');
        assert(equal(properties, { a: 1 }));
        assert(equal(options, { b: 2 }));
        done();
      });
      analytics.track('event', { a: 1 }, { b: 2 });
    });

    it('should safely convert ISO dates to date objects', function () {
      var date = new Date(Date.UTC(2013, 9, 5));
      analytics.track('event', {
        date: '2013-10-05T00:00:00.000Z',
        nonDate: '2013'
      });
      var track = analytics._invoke.args[0][1];
      assert(track.properties().date.getTime() === date.getTime());
      assert(track.properties().nonDate === '2013');
    });

    it('should accept top level option .timestamp', function(){
      var date = new Date;
      analytics.track('event', { prop: true }, { timestamp: date });
      var track = analytics._invoke.args[0][1];
      assert.deepEqual(date, track.timestamp());
    });

    it('should accept top level option .integrations', function(){
      analytics.track('event', { prop: true }, { integrations: { AdRoll: { opt: true } } });
      var track = analytics._invoke.args[0][1];
      assert.deepEqual({ opt: true }, track.options('AdRoll'));
    });

    it('should accept top level option .context', function(){
      var app = { name: 'segment' };
      analytics.track('event', { prop: true }, { context: { app: app } });
      var track = analytics._invoke.args[0][1];
      assert.deepEqual(app, track.obj.context.app);
    });

    it('should not call #_invoke if the event is disabled', function(){
      analytics.options.plan = {
        track: {
          event: { enabled: false }
        }
      };
      analytics.track('event');
      assert(!analytics._invoke.called);
    });

    it('should call #_invoke if the event is enabled', function(){
      analytics.options.plan = {
        track: {
          event: { enabled: true }
        }
      };
      analytics.track('event');
      assert(analytics._invoke.called);
    });

    it('should call the callback even if the event is disabled', function(done){
      analytics.options.plan = {
        track: {
          event: { enabled: false }
        }
      };
      assert(!analytics._invoke.called);
      analytics.track('event', {}, {}, function(){
        done();
      });
    });

    it('should default .integrations to plan.integrations', function(){
      analytics.options.plan = {
        track: {
          event: {
            integrations: { All: true }
          }
        }
      };

      analytics.track('event', {}, { integrations: { Segment: true }});
      var msg = analytics._invoke.args[0][1];
      assert('event' == msg.event());
      assert.deepEqual(msg.integrations(), { All: true, Segment: true });
    });

    it('should not set ctx.integrations if plan.integrations is empty', function(){
      analytics.options.plan = { track: { event: {} } };
      analytics.track('event', {}, { campaign: {} });
      var msg = analytics._invoke.args[0][1];
      assert.deepEqual({}, msg.proxy('context.campaign'));
    });

    it('should include context.page', function(){
      analytics.track('event');
      var track = analytics._invoke.args[0][1];
      assert.deepEqual(track.context(), { page: contextPage });
    });

    it('should accept context.traits', function(){
      analytics.track('event', { prop: 1 }, { traits: { trait: true } });
      var track = analytics._invoke.args[0][1];
      assert.deepEqual(track.properties(), { prop: 1 });
      assert.deepEqual(track.context(), {
        page: contextPage,
        traits: { trait: true }
      });
    });
  });

  describe('#trackLink', function () {
    var link;
    var wrap;
    var svg;

    beforeEach(function(){
      // IE8 doesn't have createElementNS.
      if (!document.createElementNS) return;
      wrap = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'a');
      wrap.appendChild(svg);
      document.body.appendChild(wrap);
    });

    beforeEach(function () {
      sinon.spy(analytics, 'track');
      link = document.createElement('a');
      link.href = '#';
      document.body.appendChild(link);
    });

    afterEach(function () {
      window.location.hash = '';
      if (wrap) document.body.removeChild(wrap);
      document.body.removeChild(link);
    });

    it('should trigger a track on an element click', function () {
      analytics.trackLink(link);
      trigger(link, 'click');
      assert(analytics.track.called);
    });

    it('should accept a jquery object for an element', function () {
      var $link = jQuery(link);
      analytics.trackLink($link);
      trigger(link, 'click');
      assert(analytics.track.called);
    });

    it('should not accept a string for an element', function () {
      var str = 'a';
      assert.throws(function(){
        analytics.trackLink(str);
      }, TypeError, 'Must pass HTMLElement to `analytics.trackLink`.');
      trigger(link, 'click');
      assert(!analytics.track.called);
    });

    it('should send an event and properties', function () {
      analytics.trackLink(link, 'event', { property: true });
      trigger(link, 'click');
      assert(analytics.track.calledWith('event', { property: true }));
    });

    it('should accept an event function', function () {
      function event (el) { return el.nodeName; }
      analytics.trackLink(link, event);
      trigger(link, 'click');
      assert(analytics.track.calledWith('A'));
    });

    it('should accept a properties function', function () {
      function properties (el) { return { type: el.nodeName }; }
      analytics.trackLink(link, 'event', properties);
      trigger(link, 'click');
      assert(analytics.track.calledWith('event', { type: 'A' }));
    });

    it('should load an href on click', function (done) {
      link.href = '#test';
      analytics.trackLink(link);
      trigger(link, 'click');
      tick(function () {
        assert(window.location.hash == '#test');
        done();
      });
    });

    it('should support svg .href attribute', function(done){
      if (!svg) return done();
      svg.setAttribute('href', '#svg'); // not correct svg, but should work.
      analytics.trackLink(svg);
      trigger(svg, 'click');
      tick(function(){
        assert.equal(window.location.hash, '#svg');
        done();
      });
    });

    it('should fallback to getAttributeNS', function(done){
      if (!wrap) return done();
      svg.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#svg');
      analytics.trackLink(svg);
      trigger(svg, 'click');
      tick(function(){
        assert.equal(window.location.hash, '#svg');
        done();
      });
    });

    it('should support xlink:href', function(done){
      if (!wrap) return done();
      svg.setAttribute('xlink:href', '#svg');
      analytics.trackLink(svg);
      trigger(svg, 'click');
      tick(function(){
        assert.equal(window.location.hash, '#svg');
        done();
      });
    });

    it('should not load an href for a link with a blank target', function (done) {
      link.href = '/test/server/mock.html';
      link.target = '_blank';
      analytics.trackLink(link);
      trigger(link, 'click');
      tick(function () {
        assert(window.location.hash != '#test');
        done();
      });
    });
  });

  describe('#trackForm', function () {
    var form, submit;

    before(function () {
      window.jQuery = jQuery;
    });

    after(function () {
      window.jQuery = null;
    });

    beforeEach(function () {
      sinon.spy(analytics, 'track');
      form = document.createElement('form');
      form.action = '/test/server/mock.html';
      form.target = '_blank';
      submit = document.createElement('input');
      submit.type = 'submit';
      form.appendChild(submit);
      document.body.appendChild(form);
    });

    afterEach(function () {
      window.location.hash = '';
      document.body.removeChild(form);
    });

    it('should trigger a track on a form submit', function () {
      analytics.trackForm(form);
      submit.click();
      assert(analytics.track.called);
    });

    it('should accept a jquery object for an element', function () {
      var $form = jQuery(form);
      analytics.trackForm(form);
      submit.click();
      assert(analytics.track.called);
    });

    it('should not accept a string for an element', function () {
      var str = 'form';
      assert.throws(function(){
        analytics.trackForm(str);
      }, TypeError, 'Must pass HTMLElement to `analytics.trackForm`.');
      submit.click();
      assert(!analytics.track.called);
    });

    it('should send an event and properties', function () {
      analytics.trackForm(form, 'event', { property: true });
      submit.click();
      assert(analytics.track.calledWith('event', { property: true }));
    });

    it('should accept an event function', function () {
      function event (el) { return 'event'; }
      analytics.trackForm(form, event);
      submit.click();
      assert(analytics.track.calledWith('event'));
    });

    it('should accept a properties function', function () {
      function properties (el) { return { property: true }; }
      analytics.trackForm(form, 'event', properties);
      submit.click();
      assert(analytics.track.calledWith('event', { property: true }));
    });

    it('should call submit after a timeout', function (done) {
      var spy = form.submit = sinon.spy();
      analytics.trackForm(form);
      submit.click();
      setTimeout(function () {
        assert(spy.called);
        done();
      }, 50);
    });

    it('should trigger an existing submit handler', function (done) {
      bind(form, 'submit', function () { done(); });
      analytics.trackForm(form);
      submit.click();
    });

    it('should trigger an existing jquery submit handler', function (done) {
      var $form = jQuery(form);
      $form.submit(function () { done(); });
      analytics.trackForm(form);
      submit.click();
    });

    it('should track on a form submitted via jquery', function () {
      var $form = jQuery(form);
      analytics.trackForm(form);
      $form.submit();
      assert(analytics.track.called);
    });

    it('should trigger an existing jquery submit handler on a form submitted via jquery', function (done) {
      var $form = jQuery(form);
      $form.submit(function () { done(); });
      analytics.trackForm(form);
      $form.submit();
    });
  });

  describe('#alias', function () {
    beforeEach(function () {
      sinon.spy(analytics, '_invoke');
    });

    it('should call #_invoke', function () {
      analytics.alias();
      assert(analytics._invoke.calledWith('alias'));
    });

    it('should call #_invoke with instanceof Alias', function(){
      analytics.alias();
      var alias = analytics._invoke.args[0][1];
      assert('alias' == alias.action());
    });

    it('should default .anonymousId', function(){
      analytics.alias('previous-id', 'user-id');
      var msg = analytics._invoke.args[0][1];
      assert(36 == msg.anonymousId().length);
    });

    it('should override .anonymousId', function(){
      analytics.alias('previous-id', 'user-id', { anonymousId: 'anon-id' });
      var msg = analytics._invoke.args[0][1];
      assert('anon-id' == msg.anonymousId());
    });

    it('should accept (new, old, options, callback)', function (done) {
      analytics.alias('new', 'old', {}, function () {
        var alias = analytics._invoke.args[0][1];
        assert('old' == alias.from());
        assert('new' == alias.to());
        assert('object' == typeof alias.options());
        done();
      });
    });

    it('should accept (new, old, callback)', function (done) {
      analytics.alias('new', 'old', function () {
        var alias = analytics._invoke.args[0][1];
        assert('old' == alias.from());
        assert('new' == alias.to());
        assert('object' == typeof alias.options());
        done();
      });
    });

    it('should accept (new, callback)', function (done) {
      analytics.alias('new', function () {
        var alias = analytics._invoke.args[0][1];
        assert('new' == alias.to());
        assert('object' == typeof alias.options());
        done();
      });
    });

    it('should include context.page', function(){
      analytics.alias();
      var alias = analytics._invoke.args[0][1];
      assert.deepEqual(alias.context(), { page: contextPage });
    });

    it('should emit alias', function (done) {
      analytics.once('alias', function (newId, oldId, options) {
        assert('new' === newId);
        assert('old' === oldId);
        assert(equal(options, { opt: true }));
        done();
      });
      analytics.alias('new', 'old', { opt: true });
    });
  });

  describe('#push', function(){
    beforeEach(function(){
      analytics.track = sinon.spy();
    })

    it('should call methods with args', function(){
      analytics.push(['track', 'event', { prop: true }]);
      assert(analytics.track.calledWith('event', { prop: true }));
    })
  })

  describe('#reset', function(){
    beforeEach(function(){
      user.id('user-id');
      user.traits({ name: 'John Doe' });
      group.id('group-id');
      group.traits({ name: 'Example' });
    });

    it('should remove persisted group and user', function(){
      assert('user-id' == user.id());
      assert('John Doe' == user.traits().name);
      assert('group-id' == group.id());
      assert('Example' == group.traits().name);
      analytics.reset();
      assert(null == user.id());
      assert.deepEqual({}, user.traits());
      assert(null == group.id());
      assert.deepEqual({}, group.traits());
    });
  });
});
