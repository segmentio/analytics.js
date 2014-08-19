
describe('user', function () {

  var analytics = window.analytics;
  var Analytics = analytics.constructor;
  var assert = require('assert');
  var cookie = Analytics.cookie;
  var equal = require('equals');
  var json = require('json');
  var store = Analytics.store;
  var user = analytics.user();
  var User = user.User;

  var cookieKey = user._options.cookie.key;
  var localStorageKey = user._options.localStorage.key;

  before(function () {
    assert.equal(location.protocol, user.protocol);
    user.reset();
  });

  afterEach(function () {
    user.reset();
    cookie.remove(cookieKey);
    store.remove(cookieKey);
    store.remove(localStorageKey);
    user.protocol = location.protocol;
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
  })

  describe('#id', function () {
    describe('when file:', function(){
      beforeEach(function(){
        user.protocol = 'file:';
      });

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
    });

    describe('when chrome-extension:', function(){
      beforeEach(function(){
        user.protocol = 'chrome-extension:';
      });

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
    });

    describe('when http:', function(){
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
      user.traits({ trait: true });
      user.logout();
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
