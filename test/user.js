
describe('user', function () {

  var analytics = window.analytics;
  var Analytics = analytics.constructor;
  var assert = require('assert');
  var cookie = Analytics.cookie;
  var equal = require('equals');
  var json = require('json');
  var store = Analytics.store;
  var memory = Analytics.memory;
  var user = analytics.user();
  var rawCookie = require('cookie');
  var sinon = require('sinon');
  var User = user.User;

  var cookieKey = user._options.cookie.key;
  var localStorageKey = user._options.localStorage.key;

  beforeEach(function () {
    user = new User
    user.reset();
  });

  afterEach(function () {
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
    })

    it('should not reset user id and traits', function(){
      var user = new User;
      assert('my id' == user.id());
      assert(true == user.traits().trait);
    })

    it('should pick the old "_sio" anonymousId', function(){
      rawCookie('_sio', 'anonymous-id----user-id');
      var user = new User;
      assert('anonymous-id' == user.anonymousId());
    });

    it('should not pick the old "_sio" if anonymous id is present', function(){
      rawCookie('_sio', 'old-anonymous-id----user-id');
      cookie.set('ajs_anonymous_id', 'new-anonymous-id');
      assert('new-anonymous-id' == new User().anonymousId());
    });

    it('should create anonymous id if missing', function(){
      var user = new User;
      assert.equal(36, user.anonymousId().length);
    });

    it('should not overwrite anonymous id', function(){
      cookie.set('ajs_anonymous_id', 'anonymous');
      assert('anonymous' == new User().anonymousId());
    });
  })

  describe('#id', function () {
    describe('when cookies are disabled', function(){
      beforeEach(function(){
        sinon.stub(cookie, 'get', function(){});
        user = new User;
      });

      afterEach(function(){
        cookie.get.restore();
      })

      it('should get an id from the store', function () {
        store.set(cookieKey, 'id');
        assert('id' == user.id());
      });

      it('should get an id when not persisting', function () {
        user.options({ persist: false });
        user._id = 'id';
        assert('id' == user.id());
      });

      it('should set an id to the store', function () {
        user.id('id');
        assert('id' === store.get(cookieKey));
      });

      it('should set the id when not persisting', function () {
        user.options({ persist: false });
        user.id('id');
        assert('id' == user._id);
      });

      it('should be null by default', function () {
        assert(null === user.id());
      });

      it('should not reset anonymousId if the user didnt have previous id', function(){
        var prev = user.anonymousId();
        user.id('foo');
        user.id('foo');
        user.id('foo');
        assert.equal(prev, user.anonymousId());
      });

      it('should reset anonymousId if the user id changed', function(){
        var prev = user.anonymousId();
        user.id('foo');
        user.id('baz');
        assert.notEqual(prev, user.anonymousId());
        assert.equal(36, user.anonymousId().length);
      });

      it('should not reset anonymousId if the user id changed to null', function(){
        var prev = user.anonymousId();
        user.id('foo');
        user.id(null);
        assert.equal(prev, user.anonymousId());
        assert.equal(36, user.anonymousId().length);
      });
    });

    describe('when cookies and localStorage are disabled', function(){
      beforeEach(function(){
        sinon.stub(cookie, 'get', function(){});
        store.enabled = false;
        user = new User;
      });

      afterEach(function(){
        store.enabled = true;
        cookie.get.restore();
      })

      it('should get an id from the memory', function () {
        memory.set(cookieKey, 'id');
        assert('id' == user.id());
      });

      it('should get an id when not persisting', function () {
        user.options({ persist: false });
        user._id = 'id';
        assert('id' == user.id());
      });

      it('should set an id to the memory', function () {
        user.id('id');
        assert('id' === memory.get(cookieKey));
      });

      it('should set the id when not persisting', function () {
        user.options({ persist: false });
        user.id('id');
        assert('id' == user._id);
      });

      it('should be null by default', function () {
        assert(null === user.id());
      });

      it('should not reset anonymousId if the user didnt have previous id', function(){
        var prev = user.anonymousId();
        user.id('foo');
        user.id('foo');
        user.id('foo');
        assert.equal(prev, user.anonymousId());
      });

      it('should reset anonymousId if the user id changed', function(){
        var prev = user.anonymousId();
        user.id('foo');
        user.id('baz');
        assert.notEqual(prev, user.anonymousId());
        assert.equal(36, user.anonymousId().length);
      });

      it('should not reset anonymousId if the user id changed to null', function(){
        var prev = user.anonymousId();
        user.id('foo');
        user.id(null);
        assert.equal(prev, user.anonymousId());
        assert.equal(36, user.anonymousId().length);
      });
    });

    describe('when cookies are enabled', function(){
      it('should get an id from the cookie', function () {
        cookie.set(cookieKey, 'id');
        assert('id' == user.id());
      });

      it('should get an id when not persisting', function () {
        user.options({ persist: false });
        user._id = 'id';
        assert('id' == user.id());
      });

      it('should set an id to the cookie', function () {
        user.id('id');
        assert('id' === cookie.get(cookieKey));
      });

      it('should set the id when not persisting', function () {
        user.options({ persist: false });
        user.id('id');
        assert('id' == user._id);
      });

      it('should be null by default', function () {
        assert(null === user.id());
      });

      it('should not reset anonymousId if the user didnt have previous id', function(){
        var prev = user.anonymousId();
        user.id('foo');
        user.id('foo');
        user.id('foo');
        assert.equal(prev, user.anonymousId());
      });

      it('should reset anonymousId if the user id changed', function(){
        var prev = user.anonymousId();
        user.id('foo');
        user.id('baz');
        assert.notEqual(prev, user.anonymousId());
        assert.equal(36, user.anonymousId().length);
      });
    });
  });

  describe('#anonymousId', function () {
    var noop = { set: function(){}, get: function(){} };
    var storage = user.storage;

    afterEach(function(){
      user.storage = storage;
    });

    describe('when cookies are disabled', function(){
      beforeEach(function(){
        sinon.stub(cookie, 'get', function(){});
        user = new User;
      });

      afterEach(function(){
        cookie.get.restore();
      });

      it('should get an id from the store', function () {
        store.set('ajs_anonymous_id', 'anon-id');
        assert('anon-id' == user.anonymousId());
      });

      it('should set an id to the store', function () {
        user.anonymousId('anon-id');
        assert('anon-id' === store.get('ajs_anonymous_id'));
      });

      it('should return anonymousId using the store', function(){
        user.storage = function(){ return noop; };
        assert(null == user.anonymousId());
      });
    });

    describe('when cookies and localStorage are disabled', function(){
      beforeEach(function(){
        sinon.stub(cookie, 'get', function(){});
        store.enabled = false;
        user = new User;
      });

      afterEach(function(){
        store.enabled = true;
        cookie.get.restore();
      });

      it('should get an id from the memory', function () {
        memory.set('ajs_anonymous_id', 'anon-id');
        assert('anon-id' == user.anonymousId());
      });

      it('should set an id to the memory', function () {
        user.anonymousId('anon-id');
        assert('anon-id' === memory.get('ajs_anonymous_id'));
      });

      it('should return anonymousId using the store', function(){
        user.storage = function(){ return noop; };
        assert(null == user.anonymousId());
      });
    });

    describe('when cookies are enabled', function(){
      it('should get an id from the cookie', function () {
        cookie.set('ajs_anonymous_id', 'anon-id');
        assert('anon-id' == user.anonymousId());
      });

      it('should set an id to the cookie', function () {
        user.anonymousId('anon-id');
        assert('anon-id' === cookie.get('ajs_anonymous_id'));
      });

      it('should return anonymousId using the store', function(){
        user.storage = function(){ return noop; };
        assert(null == user.anonymousId());
      });
    });
  });

  describe('#traits', function () {
    it('should get traits', function () {
      store.set(localStorageKey, { trait: true });
      assert(equal({ trait: true }, user.traits()));
    });

    it('should get a copy of traits', function () {
      store.set(localStorageKey, { trait: true });
      assert(user._traits != user.traits());
    });

    it('should get traits when not persisting', function () {
      user.options({ persist: false });
      user._traits = { trait: true };
      assert(equal({ trait: true }, user.traits()));
    });

    it('should get a copy of traits when not persisting', function () {
      user.options({ persist: false });
      user._traits = { trait: true };
      assert(user._traits != user.traits());
    });

    it('should set traits', function () {
      user.traits({ trait: true });
      assert(equal({ trait: true }, store.get(localStorageKey)));
    });

    it('should set the id when not persisting', function () {
      user.options({ persist: false });
      user.traits({ trait: true });
      assert(equal({ trait: true }, user._traits));
    });

    it('should default traits to an empty object', function () {
      user.traits(null);
      assert(equal({}, store.get(localStorageKey)));
    });

    it('should default traits to an empty object when not persisting', function () {
      user.options({ persist: false });
      user.traits(null);
      assert(equal({}, user._traits));
    });

    it('should be an empty object by default', function () {
      assert(equal({}, user.traits()));
    });
  });

  describe('#options', function () {
    it('should get options', function () {
      var options = user.options();
      assert(options ==  user._options);
    });

    it('should set options with defaults', function () {
      user.options({ option: true });
      assert(equal(user._options, {
        option: true,
        persist: true,
        cookie: {
          key: 'ajs_user_id',
          oldKey: 'ajs_user'
        },
        localStorage: {
          key: 'ajs_user_traits'
        }
      }));
    });
  });

  describe('#save', function () {
    it('should save an id to a cookie', function () {
      user.id('id');
      user.save();
      assert('id' == cookie.get(cookieKey));
    });

    it('should save traits to local storage', function () {
      user.traits({ trait: true });
      user.save();
      assert(equal({ trait: true }, store.get(localStorageKey)));
    });

    it('shouldnt save if persist is false', function () {
      user.options({ persist: false });
      user.id('id');
      user.save();
      assert(null === cookie.get(cookieKey));
    });
  });

  describe('#logout', function () {
    it('should reset an id and traits', function () {
      user.id('id');
      user.anonymousId('anon-id');
      user.traits({ trait: true });
      user.logout();
      assert(null === cookie.get('ajs_anonymous_id'));
      assert(null === user.id());
      assert(equal({}, user.traits()));
    });

    it('should clear a cookie', function () {
      user.id('id');
      user.save();
      user.logout();
      assert(null === cookie.get(cookieKey));
    });

    it('should clear local storage', function () {
      user.traits({ trait: true });
      user.save();
      user.logout();
      assert(undefined === store.get(localStorageKey));
    });
  });

  describe('#identify', function () {
    it('should save an id', function () {
      user.identify('id');
      assert('id' == user.id());
      assert('id' == cookie.get(cookieKey));
    });

    it('should save traits', function () {
      user.identify(null, { trait: true });
      assert(equal({ trait: true }, user.traits()));
      assert(equal({ trait: true }, store.get(localStorageKey)));
    });

    it('should save an id and traits', function () {
      user.identify('id', { trait: true });
      assert('id' == user.id());
      assert(equal({ trait: true }, user.traits()));
      assert('id' == cookie.get(cookieKey));
      assert(equal({ trait: true }, store.get(localStorageKey)));
    });

    it('should extend existing traits', function () {
      user.traits({ one: 1 });
      user.identify('id', { two: 2 });
      assert(equal({ one: 1, two: 2 }, user.traits()));
      assert(equal({ one: 1, two: 2 }, store.get(localStorageKey)));
    });

    it('shouldnt extend existing traits for a new id', function () {
      user.id('id');
      user.traits({ one: 1 });
      user.identify('new', { two: 2 });
      assert(equal({ two: 2 }, user.traits()));
      assert(equal({ two: 2 }, store.get(localStorageKey)));
    });

    it('should reset traits for a new id', function () {
      user.id('id');
      user.traits({ one: 1 });
      user.identify('new');
      assert(equal({}, user.traits()));
      assert(equal({}, store.get(localStorageKey)));
    });
  });

  describe('#load', function () {
    it('should load an empty user', function () {
      user.load();
      assert(null === user.id());
      assert(equal({}, user.traits()));
    });

    it('should load an id from a cookie', function () {
      cookie.set(cookieKey, 'id');
      user.load();
      assert('id' == user.id());
    });

    it('should load traits from local storage', function () {
      store.set(localStorageKey, { trait: true });
      user.load();
      assert(equal({ trait: true }, user.traits()));
    });

    it('should load from an old cookie', function () {
      cookie.set(user._options.cookie.oldKey, { id: 'old', traits: { trait: true }});
      user.load();
      assert('old' == user.id());
      assert(equal({ trait: true }, user.traits()));
    });
  });

});
