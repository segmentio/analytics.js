
var assert = require('assert');
var sinon = require('sinon');
var analytics = window.analytics;
var Analytics = analytics.constructor;
var cookie = Analytics.cookie;
var memory = Analytics.memory;
var store = Analytics.store;
var group = analytics.group();
var Group = group.Group;

describe('group', function() {
  var cookieKey = group._options.cookie.key;
  var localStorageKey = group._options.localStorage.key;

  beforeEach(function() {
    group = new Group();
    group.reset();
  });

  afterEach(function() {
    group.reset();
    cookie.remove(cookieKey);
    store.remove(cookieKey);
    store.remove(localStorageKey);
    group.protocol = location.protocol;
  });

  describe('()', function(){
    beforeEach(function(){
      cookie.set(cookieKey, 'gid');
      store.set(localStorageKey, { trait: true });
    });

    it('should not reset group id and traits', function(){
      var group = new Group();
      assert(group.id() === 'gid');
      assert(group.traits().trait === true);
    });
  });

  describe('#id', function() {
    describe('when cookies are disabled', function(){
      beforeEach(function(){
        sinon.stub(cookie, 'get', function(){});
        group = new Group();
      });

      afterEach(function(){
        cookie.get.restore();
      });

      it('should get an id from store', function() {
        store.set(cookieKey, 'id');
        assert(group.id() === 'id');
      });

      it('should get an id when not persisting', function() {
        group.options({ persist: false });
        group._id = 'id';
        assert(group.id() === 'id');
      });

      it('should set an id to the store', function() {
        group.id('id');
        assert(store.get(cookieKey) === 'id');
      });

      it('should set the id when not persisting', function() {
        group.options({ persist: false });
        group.id('id');
        assert(group._id === 'id');
      });

      it('should be null by default', function() {
        assert(group.id() === null);
      });
    });

    describe('when cookies and localStorage are disabled', function(){
      beforeEach(function(){
        sinon.stub(cookie, 'get', function(){});
        store.enabled = false;
        group = new Group();
      });

      afterEach(function(){
        store.enabled = true;
        cookie.get.restore();
      });

      it('should get an id from the store', function() {
        memory.set(cookieKey, 'id');
        assert(group.id() === 'id');
      });

      it('should get an id when not persisting', function() {
        group.options({ persist: false });
        group._id = 'id';
        assert(group.id() === 'id');
      });

      it('should set an id to the store', function() {
        group.id('id');
        assert(memory.get(cookieKey) === 'id');
      });

      it('should set the id when not persisting', function() {
        group.options({ persist: false });
        group.id('id');
        assert(group._id === 'id');
      });

      it('should be null by default', function() {
        assert(group.id() === null);
      });
    });

    describe('when cookies are enabled', function(){
      it('should get an id from the cookie', function() {
        cookie.set(cookieKey, 'id');

        assert(group.id() === 'id');
      });

      it('should get an id when not persisting', function() {
        group.options({ persist: false });
        group._id = 'id';
        assert(group.id() === 'id');
      });

      it('should set an id to the cookie', function() {
        group.id('id');
        assert(cookie.get(cookieKey) === 'id');
      });

      it('should set the id when not persisting', function() {
        group.options({ persist: false });
        group.id('id');
        assert(group._id === 'id');
      });

      it('should be null by default', function() {
        assert(group.id() === null);
      });
    });
  });

  describe('#properties', function() {
    it('should get properties', function() {
      store.set(localStorageKey, { property: true });
      assert.deepEqual(group.properties(), { property: true });
    });

    it('should get a copy of properties', function() {
      store.set(localStorageKey, { property: true });
      assert(group._traits !== group.properties());
    });

    it('should get properties when not persisting', function() {
      group.options({ persist: false });
      group._traits = { property: true };
      assert.deepEqual(group.properties(), { property: true });
    });

    it('should get a copy of properties when not persisting', function() {
      group.options({ persist: false });
      group._traits = { property: true };
      assert(group._traits !== group.properties());
    });

    it('should set properties', function() {
      group.properties({ property: true });
      assert.deepEqual(store.get(localStorageKey), { property: true });
    });

    it('should set the id when not persisting', function() {
      group.options({ persist: false });
      group.properties({ property: true });
      assert.deepEqual(group._traits, { property: true });
    });

    it('should default properties to an empty object', function() {
      group.properties(null);
      assert.deepEqual(store.get(localStorageKey), {});
    });

    it('should default properties to an empty object when not persisting', function() {
      group.options({ persist: false });
      group.properties(null);
      assert.deepEqual(group._traits, {});
    });

    it('should be an empty object by default', function() {
      assert.deepEqual(group.properties(), {});
    });
  });

  describe('#options', function() {
    it('should get options', function() {
      var options = group.options();
      assert(options === group._options);
    });

    it('should set options with defaults', function() {
      group.options({ option: true });
      assert.deepEqual(group._options, {
        option: true,
        persist: true,
        cookie: {
          key: 'ajs_group_id'
        },
        localStorage: {
          key: 'ajs_group_properties'
        }
      });
    });
  });

  describe('#save', function() {
    it('should save an id to a cookie', function() {
      group.id('id');
      group.save();
      assert(cookie.get(cookieKey) === 'id');
    });

    it('should save properties to local storage', function() {
      group.properties({ property: true });
      group.save();
      assert.deepEqual(store.get(localStorageKey), { property: true });
    });

    it('shouldnt save if persist is false', function() {
      group.options({ persist: false });
      group.id('id');
      group.save();
      assert(cookie.get(cookieKey) === null);
    });
  });

  describe('#logout', function() {
    it('should reset an id and properties', function() {
      group.id('id');
      group.properties({ property: true });
      group.logout();
      assert(group.id() === null);
      assert.deepEqual(group.properties(), {});
    });

    it('should clear a cookie', function() {
      group.id('id');
      group.save();
      group.logout();
      assert(cookie.get(cookieKey) === null);
    });

    it('should clear local storage', function() {
      group.properties({ property: true });
      group.save();
      group.logout();
      assert(store.get(localStorageKey) === undefined);
    });
  });

  describe('#identify', function() {
    it('should save an id', function() {
      group.identify('id');
      assert(group.id() === 'id');
      assert(cookie.get(cookieKey) === 'id');
    });

    it('should save properties', function() {
      group.identify(null, { property: true });
      assert(group.properties(), { property: true });
      assert(store.get(localStorageKey), { property: true });
    });

    it('should save an id and properties', function() {
      group.identify('id', { property: true });
      assert(group.id() === 'id');
      assert.deepEqual(group.properties(), { property: true });
      assert(cookie.get(cookieKey) === 'id');
      assert.deepEqual(store.get(localStorageKey), { property: true });
    });

    it('should extend existing properties', function() {
      group.properties({ one: 1 });
      group.identify('id', { two: 2 });
      assert.deepEqual(group.properties(), { one: 1, two: 2 });
      assert.deepEqual(store.get(localStorageKey), { one: 1, two: 2 });
    });

    it('shouldnt extend existing properties for a new id', function() {
      group.id('id');
      group.properties({ one: 1 });
      group.identify('new', { two: 2 });
      assert.deepEqual(group.properties(), { two: 2 });
      assert.deepEqual(store.get(localStorageKey), { two: 2 });
    });

    it('should reset properties for a new id', function() {
      group.id('id');
      group.properties({ one: 1 });
      group.identify('new');
      assert.deepEqual(group.properties(), {});
      assert.deepEqual(store.get(localStorageKey), {});
    });
  });

  describe('#load', function() {
    it('should load an empty group', function() {
      group.load();
      assert(group.id() === null);
      assert.deepEqual(group.properties(), {});
    });

    it('should load an id from a cookie', function() {
      cookie.set(cookieKey, 'id');
      group.load();
      assert(group.id() === 'id');
    });

    it('should load properties from local storage', function() {
      store.set(localStorageKey, { property: true });
      group.load();
      assert.deepEqual(group.properties(), { property: true });
    });
  });
});
