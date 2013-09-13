
describe('User', function () {

var assert = require('assert')
  , cookie = require('analytics/lib/cookie')
  , equal = require('equals')
  , json = require('segmentio-json')
  , store = require('analytics/lib/store')
  , user = require('analytics/lib/user');

before(function () {
  user.reset();
});

afterEach(function () {
  user.reset();
});

it('should start with defaults', function () {
  assert(null === user._id);
  assert(equal({}, user._traits));
});

describe('#id', function () {
  it('should get an id', function () {
    user._id = 'id';
    assert('id' === user.id());
  });

  it('should set the id', function () {
    user.id('new');
    assert('new' == user._id);
  });
});

describe('#traits', function () {
  it('should get traits', function () {
    user._traits = { trait: true };
    assert(equal({ trait: true }, user._traits));
  });

  it('should set traits', function () {
    user.traits({ trait: true });
    assert(equal({ trait: true }, user._traits));
  });

  it('should default traits to an empty object', function () {
    user.traits(null);
    assert(equal({}, user._traits));
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
    assert('id' == cookie.get(user._options.cookie.key));
  });

  it('should save traits to local storage', function () {
    user.traits({ trait: true });
    user.save();
    assert(equal({ trait: true }, store.get(user._options.localStorage.key)));
  });

  it('shouldnt save if persist is false', function () {
    user.options({ persist: false });
    user.id('id');
    user.save();
    assert(null === cookie.get(user._options.cookie.key));
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
    assert(null === cookie.get(user._options.cookie.key));
  });

  it('should clear local storage', function () {
    user.traits({ trait: true });
    user.save();
    user.logout();
    assert(undefined === store.get(user._options.localStorage.key));
  });
});

describe('#identify', function () {
  it('should save an id', function () {
    user.identify('id');
    assert('id' == user.id());
    assert('id' == cookie.get(user._options.cookie.key));
  });

  it('should save traits', function () {
    user.identify(null, { trait: true });
    assert(equal({ trait: true }, user.traits()));
    assert(equal({ trait: true }, store.get(user._options.localStorage.key)));
  });

  it('should save an id and traits', function () {
    user.identify('id', { trait: true });
    assert('id' == user.id());
    assert(equal({ trait: true }, user.traits()));
    assert('id' == cookie.get(user._options.cookie.key));
    assert(equal({ trait: true }, store.get(user._options.localStorage.key)));
  });

  it('should extend existing traits', function () {
    user.traits({ one: 1 });
    user.identify('id', { two: 2 });
    assert(equal({ one: 1, two: 2 }, user.traits()));
    assert(equal({ one: 1, two: 2 }, store.get(user._options.localStorage.key)));
  });

  it('shouldnt extend existing traits for a new id', function () {
    user.id('id');
    user.traits({ one: 1 });
    user.identify('new', { two: 2 });
    assert(equal({ two: 2 }, user.traits()));
    assert(equal({ two: 2 }, store.get(user._options.localStorage.key)));
  });

  it('should reset traits for a new id', function () {
    user.id('id');
    user.traits({ one: 1 });
    user.identify('new');
    assert(equal({}, user.traits()));
    assert(equal({}, store.get(user._options.localStorage.key)));
  });
});

describe('#load', function () {
  it('should load an empty user', function () {
    user.load();
    assert(null === user.id());
    assert(equal({}, user.traits()));
  });

  it('should load an id from a cookie', function () {
    cookie.set(user._options.cookie.key, 'id');
    user.load();
    assert('id' == user.id());
  });

  it('should load traits from local storage', function () {
    store.set(user._options.localStorage.key, { trait: true });
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