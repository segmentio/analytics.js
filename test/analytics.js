
describe('Analytics', function () {

  var Analytics = require('analytics/lib/analytics');
  var assert = require('assert');
  var bind = require('event').bind;
  var cookie = require('analytics/lib/cookie');
  var equal = require('equals');
  var group = require('analytics/lib/group');
  var is = require('is');
  var jQuery = require('jquery');
  var createIntegration = require('integration');
  var sinon = require('sinon');
  var store = require('analytics/lib/store');
  var tick = require('next-tick');
  var trigger = require('trigger-event');
  var user = require('analytics/lib/user');

  var analytics;
  var Test;
  var settings = {
    Test: {
      key: 'key'
    }
  };

  beforeEach(function () {
    analytics = new Analytics();
    analytics.timeout(0);
    Test = createIntegration('Test');
  });

  afterEach(function () {
    user.reset();
    group.reset();
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

    it('should empty analytics._integrations', function () {
      analytics._integrations = { Integration: {} };
      analytics.initialize();
      assert(equal(analytics._integrations, {}));
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

    it('should invoke a method on an integration', function () {
      analytics._invoke('identify', 'id', { trait: true });
      assert(Test.prototype.invoke.calledWith('identify', 'id', { trait: true }));
    });

    it('should clone arguments before invoking each integration', function () {
      var traits = { foo: 1 };
      analytics._invoke('identify', 'id', traits);
      assert(Test.prototype.invoke.calledWith('identify', 'id', traits));
      assert(Test.prototype.invoke.args[0][2].foo == 1);
      assert(Test.prototype.invoke.args[0][2] != traits);
    });

    it('shouldnt call a method when the `all` option is false', function () {
      analytics._invoke('identify', { providers: { all: false }});
      assert(!Test.prototype.invoke.called);
    });

    it('shouldnt call a method when the integration option is false', function () {
      analytics._invoke('identify', { providers: { Test: false }});
      assert(!Test.prototype.invoke.called);
    });
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
    var defaults;

    beforeEach(function () {
      defaults = {
        path: window.location.pathname,
        referrer: document.referrer,
        title: document.title,
        url: window.location.href
      };
      sinon.spy(analytics, '_invoke');
    });

    it('should call #_invoke', function () {
      analytics.page();
      assert(analytics._invoke.calledWith('page'));
    });

    it('should back properties with defaults', function () {
      defaults.category = 'category';
      defaults.name = 'name';
      analytics.page('category', 'name', {});
      assert(analytics._invoke.calledWith('page', 'category', 'name', defaults));
    });

    it('should accept (category, name, properties, options, callback)', function (done) {
      defaults.category = 'category';
      defaults.name = 'name';
      analytics.page('category', 'name', {}, {}, function () {
        assert(analytics._invoke.calledWith('page', 'category', 'name', defaults, {}));
        done();
      });
    });

    it('should accept (category, name, properties, callback)', function (done) {
      defaults.category = 'category';
      defaults.name = 'name';
      analytics.page('category', 'name', {}, function () {
        assert(analytics._invoke.calledWith('page', 'category', 'name', defaults));
        done();
      });
    });

    it('should accept (category, name, callback)', function (done) {
      defaults.category = 'category';
      defaults.name = 'name';
      analytics.page('category', 'name', function () {
        assert(analytics._invoke.calledWith('page', 'category', 'name', defaults));
        done();
      });
    });

    it('should accept (name, properties, options, callback)', function (done) {
      defaults.name = 'name';
      analytics.page('name', {}, {}, function () {
        assert(analytics._invoke.calledWith('page', null, 'name', defaults, {}));
        done();
      });
    });

    it('should accept (name, properties, callback)', function (done) {
      defaults.name = 'name';
      analytics.page('name', {}, function () {
        assert(analytics._invoke.calledWith('page', null, 'name', defaults));
        done();
      });
    });

    it('should accept (name, callback)', function (done) {
      defaults.name = 'name';
      analytics.page('name', function () {
        assert(analytics._invoke.calledWith('page', null, 'name'));
        done();
      });
    });

    it('should accept (properties, options, callback)', function (done) {
      analytics.page({}, {}, function () {
        assert(analytics._invoke.calledWith('page', null, null, defaults, {}));
        done();
      });
    });

    it('should accept (properties, callback)', function (done) {
      analytics.page({}, function () {
        assert(analytics._invoke.calledWith('page', null, null, defaults));
        done();
      });
    });

    it('should emit page', function (done) {
      defaults.category = 'category';
      defaults.name = 'name';
      analytics.once('page', function (category, name, props, opts) {
        assert('category' === category);
        assert('name' === name);
        assert(equal(opts, {}));
        assert(equal(props, defaults));
        done();
      });
      analytics.page('category', 'name', {}, {});
    });
  });

  describe('#pageview', function () {
    beforeEach(function () {
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

    it('should accept (id, traits, options, callback)', function (done) {
      analytics.identify('id', {}, {}, function () {
        assert(analytics._invoke.calledWith('identify', 'id', {}, {}));
        done();
      });
    });

    it('should accept (id, traits, callback)', function (done) {
      analytics.identify('id', {}, function () {
        assert(analytics._invoke.calledWith('identify', 'id', {}, null));
        done();
      });
    });

    it('should accept (id, callback)', function (done) {
      analytics.identify('id', function () {
        assert(analytics._invoke.calledWith('identify', 'id', {}, null));
        done();
      });
    });

    it('should accept (traits, options, callback)', function (done) {
      analytics.identify({}, {}, function () {
        assert(analytics._invoke.calledWith('identify', null, {}, {}));
        done();
      });
    });

    it('should accept (traits, callback)', function (done) {
      analytics.identify({}, function () {
        assert(analytics._invoke.calledWith('identify', null, {}));
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
      assert(analytics._invoke.calledWith('identify', 'id', {
        one: 1,
        two: 2
      }));
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
      var created = analytics._invoke.args[0][2].created;
      assert(is.date(created));
      assert(created.getTime() === date.getTime());
    });

    it('should parse created milliseconds into a date', function () {
      var date = new Date();
      var milliseconds = date.getTime();
      analytics.identify({ created: milliseconds });
      var created = analytics._invoke.args[0][2].created;
      assert(is.date(created));
      assert(created.getTime() === milliseconds);
    });

    it('should parse created seconds into a date', function () {
      var date = new Date();
      var seconds = Math.floor(date.getTime() / 1000);
      analytics.identify({ created: seconds });
      var created = analytics._invoke.args[0][2].created;
      assert(is.date(created));
      assert(created.getTime() === seconds * 1000);
    });

    it('should parse a company created string into a date', function () {
      var date = new Date();
      var string = date.getTime() + '';
      analytics.identify({ company: { created: string }});
      var created = analytics._invoke.args[0][2].company.created;
      assert(is.date(created));
      assert(created.getTime() === date.getTime());
    });

    it('should parse company created milliseconds into a date', function () {
      var date = new Date();
      var milliseconds = date.getTime();
      analytics.identify({ company: { created: milliseconds }});
      var created = analytics._invoke.args[0][2].company.created;
      assert(is.date(created));
      assert(created.getTime() === milliseconds);
    });

    it('should parse company created seconds into a date', function () {
      var date = new Date();
      var seconds = Math.floor(date.getTime() / 1000);
      analytics.identify({ company: { created: seconds }});
      var created = analytics._invoke.args[0][2].company.created;
      assert(is.date(created));
      assert(created.getTime() === seconds * 1000);
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

    it('should accept (id, properties, options, callback)', function (done) {
      analytics.group('id', {}, {}, function () {
        assert(analytics._invoke.calledWith('group', 'id', {}, {}));
        done();
      });
    });

    it('should accept (id, properties, callback)', function (done) {
      analytics.group('id', {}, function () {
        assert(analytics._invoke.calledWith('group', 'id', {}, null));
        done();
      });
    });

    it('should accept (id, callback)', function (done) {
      analytics.group('id', function () {
        assert(analytics._invoke.calledWith('group', 'id', {}, null));
        done();
      });
    });

    it('should accept (properties, options, callback)', function (done) {
      analytics.group({}, {}, function () {
        assert(analytics._invoke.calledWith('group', null, {}, {}));
        done();
      });
    });

    it('should accept (properties, callback)', function (done) {
      analytics.group({}, function () {
        assert(analytics._invoke.calledWith('group', null, {}));
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
      assert(analytics._invoke.calledWith('group', 'id', {
        one: 1,
        two: 2
      }));
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
      var created = analytics._invoke.args[0][2].created;
      assert(is.date(created));
      assert(created.getTime() === date.getTime());
    });

    it('should parse created milliseconds into a date', function () {
      var date = new Date();
      var milliseconds = date.getTime();
      analytics.group({ created: milliseconds });
      var created = analytics._invoke.args[0][2].created;
      assert(is.date(created));
      assert(created.getTime() === milliseconds);
    });

    it('should parse created seconds into a date', function () {
      var date = new Date();
      var seconds = Math.floor(date.getTime() / 1000);
      analytics.group({ created: seconds });
      var created = analytics._invoke.args[0][2].created;
      assert(is.date(created));
      assert(created.getTime() === seconds * 1000);
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

    it('should accept (event, properties, options, callback)', function (done) {
      analytics.track('event', {}, {}, function () {
        assert(analytics._invoke.calledWith('track', 'event', {}, {}));
        done();
      });
    });

    it('should accept (event, properties, callback)', function (done) {
      analytics.track('event', {}, function () {
        assert(analytics._invoke.calledWith('track', 'event', {}, null));
        done();
      });
    });

    it('should accept (event, callback)', function (done) {
      analytics.track('event', function () {
        assert(analytics._invoke.calledWith('track', 'event', {}, null));
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
      var tracked = analytics._invoke.args[0][2];
      assert(tracked.date.getTime() === date.getTime());
      assert(tracked.nonDate === '2013');
    });
  });

  describe('#trackLink', function () {
    var link;

    beforeEach(function () {
      sinon.spy(analytics, 'track');
      link = document.createElement('a');
    });

    afterEach(function () {
      window.location.hash = '';
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
      delete window.jQuery;
    });

    beforeEach(function () {
      sinon.spy(analytics, 'track');
      form = document.createElement('form');
      form.action = '/test/server/mock.html';
      form.target = '_blank';
      submit = document.createElement('input');
      submit.type = 'submit';
      form.appendChild(submit);
    });

    afterEach(function () {
      window.location.hash = '';
    });

    it('should trigger a track on a form submit', function () {
      analytics.trackForm(form);
      trigger(submit, 'click');
      assert(analytics.track.called);
    });

    it('should accept a jquery object for an element', function () {
      var $form = jQuery(form);
      analytics.trackForm(form);
      trigger(submit, 'click');
      assert(analytics.track.called);
    });

    it('should send an event and properties', function () {
      analytics.trackForm(form, 'event', { property: true });
      trigger(submit, 'click');
      assert(analytics.track.calledWith('event', { property: true }));
    });

    it('should accept an event function', function () {
      function event (el) { return 'event'; }
      analytics.trackForm(form, event);
      trigger(submit, 'click');
      assert(analytics.track.calledWith('event'));
    });

    it('should accept a properties function', function () {
      function properties (el) { return { property: true }; }
      analytics.trackForm(form, 'event', properties);
      trigger(submit, 'click');
      assert(analytics.track.calledWith('event', { property: true }));
    });

    it('should call submit after a timeout', function (done) {
      var spy = sinon.spy(form, 'submit');
      analytics.trackForm(form);
      trigger(submit, 'click');
      setTimeout(function () {
        assert(spy.called);
        done();
      });
    });

    it('should trigger an existing submit handler', function (done) {
      bind(form, 'submit', function () { done(); });
      analytics.trackForm(form);
      trigger(submit, 'click');
    });

    it('should trigger an existing jquery submit handler', function (done) {
      var $form = jQuery(form);
      $form.submit(function () { done(); });
      analytics.trackForm(form);
      trigger(submit, 'click');
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

    it('should accept (new, old, options, callback)', function (done) {
      analytics.alias('new', 'old', {}, function () {
        assert(analytics._invoke.calledWith('alias', 'new', 'old', {}));
        done();
      });
    });

    it('should accept (new, old, callback)', function (done) {
      analytics.alias('new', 'old', function () {
        assert(analytics._invoke.calledWith('alias', 'new', 'old', null));
        done();
      });
    });

    it('should accept (new, callback)', function (done) {
      analytics.alias('new', function () {
        assert(analytics._invoke.calledWith('alias', 'new', null, null));
        done();
      });
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

});
