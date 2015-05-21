
var assert = require('assert');
var store = window.analytics.constructor.store;

describe('store', function() {
  afterEach(function() {
    // reset to defaults
    store.options({});
    store.remove('x');
  });

  describe('#get', function() {
    it('should not not get an empty record', function() {
      assert(store.get('abc') === undefined);
    });

    it('should get an existing record', function() {
      store.set('x', { a: 'b' });
      assert.deepEqual(store.get('x'), { a: 'b' });
    });
  });

  describe('#set', function() {
    it('should be able to set a record', function() {
      store.set('x', { a: 'b' });
      assert.deepEqual(store.get('x'), { a: 'b' });
    });
  });

  describe('#remove', function() {
    it('should be able to remove a record', function() {
      store.set('x', { a: 'b' });
      assert.deepEqual(store.get('x'), { a: 'b' });
      store.remove('x');
      assert(store.get('x') === undefined);
    });
  });

  describe('#options', function() {
    it('should be able to save options', function() {
      store.options({ enabled: false });
      assert(store.options().enabled === false);
      assert(store.enabled === false);
    });
  });
});
