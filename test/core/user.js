
describe('User', function () {

var assert = require('assert')
  , cookie = require('analytics/lib/cookie')
  , equal = require('equals')
  , json = require('segmentio-json')
  , store = require('analytics/lib/store')
  , user = require('analytics/lib/user');

before(function () {
  user.clear();
  user.options({});
});

afterEach(function () {
  user.clear();
  user.options({});
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

describe('#cookie', function () {
  it('should get cookie options', function () {
    var options = user.cookie();
    assert(equal(options, {
      key: 'ajs_user_id',
      oldKey: 'ajs_user'
    }));
  });

  it('should set cookie options with defaults', function () {
    user.cookie({ option: true });
    var options = user.cookieOptions;
    assert(equal(options, {
      option: true,
      key: 'ajs_user_id',
      oldKey: 'ajs_user'
    }));
  });
});

describe('#localStorage', function () {
  it('should get localStorage options', function () {
    var options = user.localStorage();
    assert(equal(options, {
      key: 'ajs_user_traits'
    }));
  });

  it('should set localStorage options with defaults', function () {
    user.localStorage({ option: true });
    var options = user.localStorageOptions;
    assert(equal(options, {
      option: true,
      key: 'ajs_user_traits'
    }));
  });
});

describe('#options', function () {
  beforeEach(function () {
    this.cookieStub = sinon.stub(user, 'cookie');
    this.localStorageStub = sinon.stub(user, 'localStorage');
  });

  afterEach(function () {
    this.cookieStub.restore();
    this.localStorageStub.restore();
  });

  it('should pass cookie options', function () {
    user.options({ cookie: { option: true }});
    assert(this.cookieStub.calledWith({ option: true }));
  });

  it('should pass local storage options', function () {
    user.options({ localStorage: { option: true }});
    assert(this.localStorageStub.calledWith({ option: true }));
  });

  it('should set persist option', function () {
    user.options({ persist: false });
    assert(!user.persist);
  });

  it('should default persist option to true', function () {
    user.options({});
    assert(user.persist);
  });
});

describe('#save', function () {
  it('should save an id to a cookie', function () {
    user.id('id');
    user.save();
    assert('id' == cookie.get(user.cookie().key));
  });

  it('should save traits to local storage', function () {
    user.traits({ trait: true });
    user.save();
    assert(equal({ trait: true }, store.get(user.localStorage().key)));
  });

  it('shouldnt save if persist is false', function () {
    user.options({ persist: false });
    user.id('id');
    user.save();
    assert(null === cookie.get(user.cookie().key));
  });
});

describe('#clear', function () {
  it('should reset an id and traits', function () {
    user.id('id');
    user.traits({ trait: true });
    user.clear();
    assert(null === user.id());
    assert(equal({}, user.traits()));
  });

  it('should clear a cookie', function () {
    user.id('id');
    user.save();
    user.clear();
    assert(null === cookie.get(user.cookie().key));
  });

  it('should clear local storage', function () {
    user.traits({ trait: true });
    user.save();
    user.clear();
    assert(undefined === store.get(user.localStorage().key));
  });
});

describe('#update', function () {
  it('should save an id', function () {
    user.update('id');
    assert('id' == user.id());
    assert('id' == cookie.get(user.cookie().key));
  });

  it('should save traits', function () {
    user.update(null, { trait: true });
    assert(equal({ trait: true }, user.traits()));
    assert(equal({ trait: true }, store.get(user.localStorage().key)));
  });

  it('should save an id and traits', function () {
    user.update('id', { trait: true });
    assert('id' == user.id());
    assert(equal({ trait: true }, user.traits()));
    assert('id' == cookie.get(user.cookie().key));
    assert(equal({ trait: true }, store.get(user.localStorage().key)));
  });

  it('should extend existing traits', function () {
    user.traits({ one: 1 });
    user.update('id', { two: 2 });
    assert(equal({ one: 1, two: 2 }, user.traits()));
    assert(equal({ one: 1, two: 2 }, store.get(user.localStorage().key)));
  });

  it('shouldnt extend existing traits for a new id', function () {
    user.id('id');
    user.traits({ one: 1 });
    user.update('new', { two: 2 });
    assert(equal({ two: 2 }, user.traits()));
    assert(equal({ two: 2 }, store.get(user.localStorage().key)));
  });

  it('should reset traits for a new id', function () {
    user.id('id');
    user.traits({ one: 1 });
    user.update('new');
    assert(equal({}, user.traits()));
    assert(equal({}, store.get(user.localStorage().key)));
  });

  it('should alias when setting an id for the first time', function () {
    var alias = user.update('id');
    assert(alias);
  });

  it('shouldnt alias when setting an id for the first time', function () {
    user.update('id');
    var alias = user.update('id');
    assert(!alias);
  });

  it('shoudnt alias without an id', function () {
    var alias = user.update(null);
    assert(!alias);
  });

  it('shouldnt alias when not persisting', function () {
    user.options({ persist: false });
    var alias = user.update('id');
    assert(!alias);
  });
});

describe('#load', function () {
  it('should load an empty user', function () {
    var loaded = user.load();
    assert(null === loaded.id);
    assert(equal({}, loaded.traits));
  });

  it('should load an id from a cookie', function () {
    cookie.set(user.cookie().key, 'id');
    var loaded = user.load();
    assert('id' == loaded.id);
  });

  it('should load traits from local storage', function () {
    store.set(user.localStorage().key, { trait: true });
    var loaded = user.load();
    assert(equal({ trait: true }, loaded.traits));
  });

  it('should load from an old cookie', function () {
    cookie.set(user.cookie().oldKey, { id: 'old', traits: { trait: true }});
    var loaded = user.load();
    assert('old' == loaded.id);
    assert(equal({ trait: true }, loaded.traits));
  });
});

});