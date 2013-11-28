
describe('group', function () {

  var assert = require('assert');
  var cookie = require('analytics/lib/cookie');
  var equal = require('equals');
  var json = require('segmentio-json');
  var store = require('analytics/lib/store');
  var group = require('analytics/lib/group');

  var cookieKey = group._options.cookie.key;
  var localStorageKey = group._options.localStorage.key;

  before(function () {
    group.reset();
  });

  afterEach(function () {
    group.reset();
    cookie.remove(cookieKey);
    store.remove(localStorageKey);
  });

  describe('#id', function () {
    it('should get an id from the cookie', function () {
      cookie.set(cookieKey, 'id');
      assert('id' == group.id());
    });

    it('should get an id when not persisting', function () {
      group.options({ persist: false });
      group._id = 'id';
      assert('id' == group.id());
    });

    it('should set an id to the cookie', function () {
      group.id('id');
      assert('id' === cookie.get(cookieKey));
    });

    it('should set the id when not persisting', function () {
      group.options({ persist: false });
      group.id('id');
      assert('id' == group._id);
    });

    it('should be null by default', function () {
      assert(null === group.id());
    });
  });

  describe('#properties', function () {
    it('should get properties', function () {
      store.set(localStorageKey, { property: true });
      assert(equal({ property: true }, group.properties()));
    });

    it('should get a copy of properties', function () {
      store.set(localStorageKey, { property: true });
      assert(group._traits != group.properties());
    });

    it('should get properties when not persisting', function () {
      group.options({ persist: false });
      group._traits = { property: true };
      assert(equal({ property: true }, group.properties()));
    });

    it('should get a copy of properties when not persisting', function () {
      group.options({ persist: false });
      group._traits = { property: true };
      assert(group._traits != group.properties());
    });

    it('should set properties', function () {
      group.properties({ property: true });
      assert(equal({ property: true }, store.get(localStorageKey)));
    });

    it('should set the id when not persisting', function () {
      group.options({ persist: false });
      group.properties({ property: true });
      assert(equal({ property: true }, group._traits));
    });

    it('should default properties to an empty object', function () {
      group.properties(null);
      assert(equal({}, store.get(localStorageKey)));
    });

    it('should default properties to an empty object when not persisting', function () {
      group.options({ persist: false });
      group.properties(null);
      assert(equal({}, group._traits));
    });

    it('should be an empty object by default', function () {
      assert(equal({}, group.properties()));
    });
  });

  describe('#options', function () {
    it('should get options', function () {
      var options = group.options();
      assert(options ==  group._options);
    });

    it('should set options with defaults', function () {
      group.options({ option: true });
      assert(equal(group._options, {
        option: true,
        persist: true,
        cookie: {
          key: 'ajs_group_id'
        },
        localStorage: {
          key: 'ajs_group_properties'
        }
      }));
    });
  });

  describe('#save', function () {
    it('should save an id to a cookie', function () {
      group.id('id');
      group.save();
      assert('id' == cookie.get(cookieKey));
    });

    it('should save properties to local storage', function () {
      group.properties({ property: true });
      group.save();
      assert(equal({ property: true }, store.get(localStorageKey)));
    });

    it('shouldnt save if persist is false', function () {
      group.options({ persist: false });
      group.id('id');
      group.save();
      assert(null === cookie.get(cookieKey));
    });
  });

  describe('#logout', function () {
    it('should reset an id and properties', function () {
      group.id('id');
      group.properties({ property: true });
      group.logout();
      assert(null === group.id());
      assert(equal({}, group.properties()));
    });

    it('should clear a cookie', function () {
      group.id('id');
      group.save();
      group.logout();
      assert(null === cookie.get(cookieKey));
    });

    it('should clear local storage', function () {
      group.properties({ property: true });
      group.save();
      group.logout();
      assert(undefined === store.get(localStorageKey));
    });
  });

  describe('#identify', function () {
    it('should save an id', function () {
      group.identify('id');
      assert('id' == group.id());
      assert('id' == cookie.get(cookieKey));
    });

    it('should save properties', function () {
      group.identify(null, { property: true });
      assert(equal({ property: true }, group.properties()));
      assert(equal({ property: true }, store.get(localStorageKey)));
    });

    it('should save an id and properties', function () {
      group.identify('id', { property: true });
      assert('id' == group.id());
      assert(equal({ property: true }, group.properties()));
      assert('id' == cookie.get(cookieKey));
      assert(equal({ property: true }, store.get(localStorageKey)));
    });

    it('should extend existing properties', function () {
      group.properties({ one: 1 });
      group.identify('id', { two: 2 });
      assert(equal({ one: 1, two: 2 }, group.properties()));
      assert(equal({ one: 1, two: 2 }, store.get(localStorageKey)));
    });

    it('shouldnt extend existing properties for a new id', function () {
      group.id('id');
      group.properties({ one: 1 });
      group.identify('new', { two: 2 });
      assert(equal({ two: 2 }, group.properties()));
      assert(equal({ two: 2 }, store.get(localStorageKey)));
    });

    it('should reset properties for a new id', function () {
      group.id('id');
      group.properties({ one: 1 });
      group.identify('new');
      assert(equal({}, group.properties()));
      assert(equal({}, store.get(localStorageKey)));
    });
  });

  describe('#load', function () {
    it('should load an empty group', function () {
      group.load();
      assert(null === group.id());
      assert(equal({}, group.properties()));
    });

    it('should load an id from a cookie', function () {
      cookie.set(cookieKey, 'id');
      group.load();
      assert('id' == group.id());
    });

    it('should load properties from local storage', function () {
      store.set(localStorageKey, { property: true });
      group.load();
      assert(equal({ property: true }, group.properties()));
    });
  });

});
