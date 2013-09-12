
describe('Group', function () {

var assert = require('assert')
  , cookie = require('analytics/lib/cookie')
  , equal = require('equals')
  , json = require('segmentio-json')
  , store = require('analytics/lib/store')
  , group = require('analytics/lib/group');

before(function () {
  group.clear();
  group.options({});
});

afterEach(function () {
  group.clear();
  group.options({});
});

it('should start with defaults', function () {
  assert(null === group._id);
  assert(equal({}, group._properties));
});

describe('#id', function () {
  it('should get an id', function () {
    group._id = 'id';
    assert('id' === group.id());
  });

  it('should set the id', function () {
    group.id('new');
    assert('new' == group._id);
  });
});

describe('#properties', function () {
  it('should get properties', function () {
    group._properties = { property: true };
    assert(equal({ property: true }, group._properties));
  });

  it('should set properties', function () {
    group.properties({ property: true });
    assert(equal({ property: true }, group._properties));
  });

  it('should default properties to an empty object', function () {
    group.properties(null);
    assert(equal({}, group._properties));
  });
});

describe('#cookie', function () {
  it('should get cookie options', function () {
    var options = group.cookie();
    assert(equal(options, {
      key: 'ajs_group_id'
    }));
  });

  it('should set cookie options with defaults', function () {
    group.cookie({ option: true });
    var options = group.cookieOptions;
    assert(equal(options, {
      option: true,
      key: 'ajs_group_id'
    }));
  });
});

describe('#localStorage', function () {
  it('should get localStorage options', function () {
    var options = group.localStorage();
    assert(equal(options, {
      key: 'ajs_group_properties'
    }));
  });

  it('should set localStorage options with defaults', function () {
    group.localStorage({ option: true });
    var options = group.localStorageOptions;
    assert(equal(options, {
      option: true,
      key: 'ajs_group_properties'
    }));
  });
});

describe('#options', function () {
  beforeEach(function () {
    this.cookieStub = sinon.stub(group, 'cookie');
    this.localStorageStub = sinon.stub(group, 'localStorage');
  });

  afterEach(function () {
    this.cookieStub.restore();
    this.localStorageStub.restore();
  });

  it('should pass cookie options', function () {
    group.options({ cookie: { option: true }});
    assert(this.cookieStub.calledWith({ option: true }));
  });

  it('should pass local storage options', function () {
    group.options({ localStorage: { option: true }});
    assert(this.localStorageStub.calledWith({ option: true }));
  });

  it('should set persist option', function () {
    group.options({ persist: false });
    assert(!group.persist);
  });

  it('should default persist option to true', function () {
    group.options({});
    assert(group.persist);
  });
});

describe('#save', function () {
  it('should save an id to a cookie', function () {
    group.id('id');
    group.save();
    assert('id' == cookie.get(group.cookie().key));
  });

  it('should save properties to local storage', function () {
    group.properties({ property: true });
    group.save();
    assert(equal({ property: true }, store.get(group.localStorage().key)));
  });

  it('shouldnt save if persist is false', function () {
    group.options({ persist: false });
    group.id('id');
    group.save();
    assert(null === cookie.get(group.cookie().key));
  });
});

describe('#clear', function () {
  it('should reset an id and properties', function () {
    group.id('id');
    group.properties({ property: true });
    group.clear();
    assert(null === group.id());
    assert(equal({}, group.properties()));
  });

  it('should clear a cookie', function () {
    group.id('id');
    group.save();
    group.clear();
    assert(null === cookie.get(group.cookie().key));
  });

  it('should clear local storage', function () {
    group.properties({ property: true });
    group.save();
    group.clear();
    assert(undefined === store.get(group.localStorage().key));
  });
});

describe('#update', function () {
  it('should save an id', function () {
    group.update('id');
    assert('id' == group.id());
    assert('id' == cookie.get(group.cookie().key));
  });

  it('should save properties', function () {
    group.update(null, { property: true });
    assert(equal({ property: true }, group.properties()));
    assert(equal({ property: true }, store.get(group.localStorage().key)));
  });

  it('should save an id and properties', function () {
    group.update('id', { property: true });
    assert('id' == group.id());
    assert(equal({ property: true }, group.properties()));
    assert('id' == cookie.get(group.cookie().key));
    assert(equal({ property: true }, store.get(group.localStorage().key)));
  });

  it('should extend existing properties', function () {
    group.properties({ one: 1 });
    group.update('id', { two: 2 });
    assert(equal({ one: 1, two: 2 }, group.properties()));
    assert(equal({ one: 1, two: 2 }, store.get(group.localStorage().key)));
  });

  it('shouldnt extend existing properties for a new id', function () {
    group.id('id');
    group.properties({ one: 1 });
    group.update('new', { two: 2 });
    assert(equal({ two: 2 }, group.properties()));
    assert(equal({ two: 2 }, store.get(group.localStorage().key)));
  });

  it('should reset properties for a new id', function () {
    group.id('id');
    group.properties({ one: 1 });
    group.update('new');
    assert(equal({}, group.properties()));
    assert(equal({}, store.get(group.localStorage().key)));
  });
});

describe('#load', function () {
  it('should load an empty group', function () {
    var loaded = group.load();
    assert(null === loaded.id);
    assert(equal({}, loaded.properties));
  });

  it('should load an id from a cookie', function () {
    cookie.set(group.cookie().key, 'id');
    var loaded = group.load();
    assert('id' == loaded.id);
  });

  it('should load properties from local storage', function () {
    store.set(group.localStorage().key, { property: true });
    var loaded = group.load();
    assert(equal({ property: true }, loaded.properties));
  });
});

});