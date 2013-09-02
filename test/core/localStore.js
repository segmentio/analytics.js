
describe('Local Store', function () {

var store = require('analytics/lib/localStore.js');

after(function () {
  store.options({}); // reset to defaults
});

describe('#get()', function () {
  it('should not not get an empty record', function () {
    expect(store.get('abc')).to.be(undefined);
  });

  it('should get an existing record', function () {
    store.set('x', { a : 'b' });
    expect(store.get('x')).to.eql({ a : 'b' });
  });
});

describe('#set()', function () {
  it('should be able to set a record', function () {
    store.set('x', { a : 'b' });
    expect(store.get('x')).to.eql({ a : 'b' });
    store.remove('x');
  });
});

describe('#remove()', function () {
  it('should be able to remove a record', function () {
    store.set('x', { a : 'b' });
    expect(store.get('x')).to.eql({ a : 'b' });
    store.remove('x');
    expect(store.get('x')).to.be(undefined);
  });
});

describe('#options()', function () {
  it('should be able to save options', function () {
    store.options({
      enabled: false
    });
    expect(store.options().enabled).to.eql(false);
    expect(store.enabled).to.eql(false);
  });
});

});