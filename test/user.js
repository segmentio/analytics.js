
var assert = require('assert');
var rawCookie = require('cookie');
var sinon = require('sinon');
var analytics = window.analytics;
var Analytics = analytics.constructor;
var cookie = Analytics.cookie;
var store = Analytics.store;
var memory = Analytics.memory;
var user = analytics.user();
var User = user.User;

describe('user', function() {
  var cookieKey = user._options.cookie.key;
  var localStorageKey = user._options.localStorage.key;

  beforeEach(function() {
    user = new User();
    user.reset();
  });

  afterEach(function() {
    user.reset();
    cookie.remove(cookieKey);
    store.remove(cookieKey);
    store.remove(localStorageKey);
    store.remove('_sio');
    cookie.remove('_sio');
    rawCookie('_sio', null);
  });

  describe('()', function(){
    beforeEach(function(){
      cookie.set(cookieKey, 'my id');
      store.set(localStorageKey, { trait: true });
    });

    it('should not reset user id and traits', function(){
      var user = new User();
      assert(user.id() === 'my id');
      assert(user.traits().trait === true);
    });

    it('should pick the old "_sio" anonymousId', function(){
      rawCookie('_sio', 'anonymous-id----user-id');
      var user = new User();
      assert(user.anonymousId() === 'anonymous-id');
    });

    it('should not pick the old "_sio" if anonymous id is present', function(){
      rawCookie('_sio', 'old-anonymous-id----user-id');
      cookie.set('ajs_anonymous_id', 'new-anonymous-id');
      assert(new User().anonymousId() === 'new-anonymous-id');
    });

    it('should create anonymous id if missing', function(){
      var user = new User();
      assert(user.anonymousId().length === 36);
    });

    it('should not overwrite anonymous id', function(){
      cookie.set('ajs_anonymous_id', 'anonymous');
      assert(new User().anonymousId() === 'anonymous');
    });
  });

  describe('#id', function() {
    describe('when cookies are disabled', function(){
      beforeEach(function(){
        sinon.stub(cookie, 'get', function(){});
        user = new User();
      });

      afterEach(function(){
        cookie.get.restore();
      });

      it('should get an id from the store', function() {
        store.set(cookieKey, 'id');
        assert(user.id() === 'id');
      });

      it('should get an id when not persisting', function() {
        user.options({ persist: false });
        user._id = 'id';
        assert(user.id() === 'id');
      });

      it('should set an id to the store', function() {
        user.id('id');
        assert(store.get(cookieKey) === 'id');
      });

      it('should set the id when not persisting', function() {
        user.options({ persist: false });
        user.id('id');
        assert(user._id === 'id');
      });

      it('should be null by default', function() {
        assert(user.id() === null);
      });

      it('should not reset anonymousId if the user didnt have previous id', function(){
        var prev = user.anonymousId();
        user.id('foo');
        user.id('foo');
        user.id('foo');
        assert(user.anonymousId() === prev);
      });

      it('should reset anonymousId if the user id changed', function(){
        var prev = user.anonymousId();
        user.id('foo');
        user.id('baz');
        assert(user.anonymousId() !== prev);
        assert(user.anonymousId().length === 36);
      });

      it('should not reset anonymousId if the user id changed to null', function(){
        var prev = user.anonymousId();
        user.id('foo');
        user.id(null);
        assert(user.anonymousId() === prev);
        assert(user.anonymousId().length === 36);
      });
    });

    describe('when cookies and localStorage are disabled', function(){
      beforeEach(function(){
        sinon.stub(cookie, 'get', function(){});
        store.enabled = false;
        user = new User();
      });

      afterEach(function(){
        store.enabled = true;
        cookie.get.restore();
      });

      it('should get an id from the memory', function() {
        memory.set(cookieKey, 'id');
        assert(user.id() === 'id');
      });

      it('should get an id when not persisting', function() {
        user.options({ persist: false });
        user._id = 'id';
        assert(user.id() === 'id');
      });

      it('should set an id to the memory', function() {
        user.id('id');
        assert(memory.get(cookieKey) === 'id');
      });

      it('should set the id when not persisting', function() {
        user.options({ persist: false });
        user.id('id');
        assert(user._id === 'id');
      });

      it('should be null by default', function() {
        assert(user.id() === null);
      });

      it('should not reset anonymousId if the user didnt have previous id', function(){
        var prev = user.anonymousId();
        user.id('foo');
        user.id('foo');
        user.id('foo');
        assert(user.anonymousId() === prev);
      });

      it('should reset anonymousId if the user id changed', function(){
        var prev = user.anonymousId();
        user.id('foo');
        user.id('baz');
        assert(user.anonymousId() !== prev);
        assert(user.anonymousId().length === 36);
      });

      it('should not reset anonymousId if the user id changed to null', function(){
        var prev = user.anonymousId();
        user.id('foo');
        user.id(null);
        assert(user.anonymousId() === prev);
        assert(user.anonymousId().length === 36);
      });
    });

    describe('when cookies are enabled', function(){
      it('should get an id from the cookie', function() {
        cookie.set(cookieKey, 'id');
        assert(user.id() === 'id');
      });

      it('should get an id when not persisting', function() {
        user.options({ persist: false });
        user._id = 'id';
        assert(user.id() === 'id');
      });

      it('should set an id to the cookie', function() {
        user.id('id');
        assert(cookie.get(cookieKey) === 'id');
      });

      it('should set the id when not persisting', function() {
        user.options({ persist: false });
        user.id('id');
        assert(user._id === 'id');
      });

      it('should be null by default', function() {
        assert(user.id() === null);
      });

      it('should not reset anonymousId if the user didnt have previous id', function(){
        var prev = user.anonymousId();
        user.id('foo');
        user.id('foo');
        user.id('foo');
        assert(user.anonymousId() === prev);
      });

      it('should reset anonymousId if the user id changed', function(){
        var prev = user.anonymousId();
        user.id('foo');
        user.id('baz');
        assert(user.anonymousId() !== prev);
        assert(user.anonymousId().length === 36);
      });
    });
  });

  describe('#anonymousId', function() {
    var noop = { set: function(){}, get: function(){} };
    var storage = user.storage;

    afterEach(function(){
      user.storage = storage;
    });

    describe('when cookies are disabled', function(){
      beforeEach(function(){
        sinon.stub(cookie, 'get', function(){});
        user = new User();
      });

      afterEach(function(){
        cookie.get.restore();
      });

      it('should get an id from the store', function() {
        store.set('ajs_anonymous_id', 'anon-id');
        assert(user.anonymousId() === 'anon-id');
      });

      it('should set an id to the store', function() {
        user.anonymousId('anon-id');
        assert(store.get('ajs_anonymous_id') === 'anon-id');
      });

      it('should return anonymousId using the store', function(){
        user.storage = function(){ return noop; };
        assert(user.anonymousId() === undefined);
      });
    });

    describe('when cookies and localStorage are disabled', function(){
      beforeEach(function(){
        sinon.stub(cookie, 'get', function(){});
        store.enabled = false;
        user = new User();
      });

      afterEach(function(){
        store.enabled = true;
        cookie.get.restore();
      });

      it('should get an id from the memory', function() {
        memory.set('ajs_anonymous_id', 'anon-id');
        assert(user.anonymousId() === 'anon-id');
      });

      it('should set an id to the memory', function() {
        user.anonymousId('anon-id');
        assert(memory.get('ajs_anonymous_id') === 'anon-id');
      });

      it('should return anonymousId using the store', function(){
        user.storage = function(){ return noop; };
        assert(user.anonymousId() === undefined);
      });
    });

    describe('when cookies are enabled', function(){
      it('should get an id from the cookie', function() {
        cookie.set('ajs_anonymous_id', 'anon-id');
        assert(user.anonymousId() === 'anon-id');
      });

      it('should set an id to the cookie', function() {
        user.anonymousId('anon-id');
        assert(cookie.get('ajs_anonymous_id') === 'anon-id');
      });

      it('should return anonymousId using the store', function(){
        user.storage = function(){ return noop; };
        assert(user.anonymousId() === undefined);
      });
    });
  });

  describe('#traits', function() {
    it('should get traits', function() {
      store.set(localStorageKey, { trait: true });
      assert.deepEqual(user.traits(), { trait: true });
    });

    it('should get a copy of traits', function() {
      store.set(localStorageKey, { trait: true });
      assert(user.traits() !== user._traits);
    });

    it('should get traits when not persisting', function() {
      user.options({ persist: false });
      user._traits = { trait: true };
      assert.deepEqual(user.traits(), { trait: true });
    });

    it('should get a copy of traits when not persisting', function() {
      user.options({ persist: false });
      user._traits = { trait: true };
      assert(user.traits() !== user._traits);
    });

    it('should set traits', function() {
      user.traits({ trait: true });
      assert(store.get(localStorageKey), { trait: true });
    });

    it('should set the id when not persisting', function() {
      user.options({ persist: false });
      user.traits({ trait: true });
      assert.deepEqual(user._traits, { trait: true });
    });

    it('should default traits to an empty object', function() {
      user.traits(null);
      assert.deepEqual(store.get(localStorageKey), {});
    });

    it('should default traits to an empty object when not persisting', function() {
      user.options({ persist: false });
      user.traits(null);
      assert.deepEqual(user._traits, {});
    });

    it('should be an empty object by default', function() {
      assert.deepEqual(user.traits(), {});
    });
  });

  describe('#options', function() {
    it('should get options', function() {
      assert(user.options() === user._options);
    });

    it('should set options with defaults', function() {
      user.options({ option: true });
      assert.deepEqual(user._options, {
        option: true,
        persist: true,
        cookie: {
          key: 'ajs_user_id',
          oldKey: 'ajs_user'
        },
        localStorage: {
          key: 'ajs_user_traits'
        }
      });
    });
  });

  describe('#save', function() {
    it('should save an id to a cookie', function() {
      user.id('id');
      user.save();
      assert(cookie.get(cookieKey) === 'id');
    });

    it('should save traits to local storage', function() {
      user.traits({ trait: true });
      user.save();
      assert(store.get(localStorageKey), { trait: true });
    });

    it('shouldnt save if persist is false', function() {
      user.options({ persist: false });
      user.id('id');
      user.save();
      assert(cookie.get(cookieKey) === null);
    });
  });

  describe('#logout', function() {
    it('should reset an id and traits', function() {
      user.id('id');
      user.anonymousId('anon-id');
      user.traits({ trait: true });
      user.logout();
      assert(cookie.get('ajs_anonymous_id') === null);
      assert(user.id() === null);
      assert(user.traits(), {});
    });

    it('should clear a cookie', function() {
      user.id('id');
      user.save();
      user.logout();
      assert(cookie.get(cookieKey) === null);
    });

    it('should clear local storage', function() {
      user.traits({ trait: true });
      user.save();
      user.logout();
      assert(store.get(localStorageKey) === undefined);
    });
  });

  describe('#identify', function() {
    it('should save an id', function() {
      user.identify('id');
      assert(user.id() === 'id');
      assert(cookie.get(cookieKey) === 'id');
    });

    it('should save traits', function() {
      user.identify(null, { trait: true });
      assert.deepEqual(user.traits(), { trait: true });
      assert.deepEqual(store.get(localStorageKey), { trait: true });
    });

    it('should save an id and traits', function() {
      user.identify('id', { trait: true });
      assert(user.id() === 'id');
      assert.deepEqual(user.traits(), { trait: true });
      assert(cookie.get(cookieKey) === 'id');
      assert.deepEqual(store.get(localStorageKey), { trait: true });
    });

    it('should extend existing traits', function() {
      user.traits({ one: 1 });
      user.identify('id', { two: 2 });
      assert.deepEqual(user.traits(), { one: 1, two: 2 });
      assert.deepEqual(store.get(localStorageKey), { one: 1, two: 2 });
    });

    it('shouldnt extend existing traits for a new id', function() {
      user.id('id');
      user.traits({ one: 1 });
      user.identify('new', { two: 2 });
      assert.deepEqual(user.traits(), { two: 2 });
      assert.deepEqual(store.get(localStorageKey), { two: 2 });
    });

    it('should reset traits for a new id', function() {
      user.id('id');
      user.traits({ one: 1 });
      user.identify('new');
      assert.deepEqual(user.traits(), {});
      assert.deepEqual(store.get(localStorageKey), {});
    });
  });

  describe('#load', function() {
    it('should load an empty user', function() {
      user.load();
      assert(user.id() === null);
      assert.deepEqual(user.traits(), {});
    });

    it('should load an id from a cookie', function() {
      cookie.set(cookieKey, 'id');
      user.load();
      assert(user.id() === 'id');
    });

    it('should load traits from local storage', function() {
      store.set(localStorageKey, { trait: true });
      user.load();
      assert.deepEqual(user.traits(), { trait: true });
    });

    it('should load from an old cookie', function() {
      cookie.set(user._options.cookie.oldKey, { id: 'old', traits: { trait: true }});
      user.load();
      assert(user.id() === 'old');
      assert.deepEqual(user.traits(), { trait: true });
    });
  });
});
