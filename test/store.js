
describe('store', function () {

  var analytics = window.analytics;
  var Analytics = analytics.constructor;
  var assert = require('assert');
  var equal = require('equals');
  var store = Analytics.store;

  afterEach(function () {
    store.options({}); // reset to defaults
    store.remove('x');
  });

  describe('#get', function () {
    it('should not not get an empty record', function () {
      assert(store.get('abc') === undefined);
    });

    it('should get an existing record', function () {
      store.set('x', { a : 'b' });
      assert(equal(store.get('x'), { a : 'b' }));
    });
  });

  describe('#set', function () {
    it('should be able to set a record', function () {
      store.set('x', { a : 'b' });
      assert(equal(store.get('x'), { a : 'b' }));
    });
  });

  describe('#remove', function () {
    it('should be able to remove a record', function () {
      store.set('x', { a : 'b' });
      assert(equal(store.get('x'), { a : 'b' }));
      store.remove('x');
      assert(store.get('x') === undefined);
    });
  });

  describe('#options', function () {
    it('should be able to save options', function () {
      store.options({ enabled: false  });
      assert(equal(store.options().enabled, false));
      assert(equal(store.enabled, false));
    });
  });

});
