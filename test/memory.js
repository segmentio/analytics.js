
describe('memory', function () {

  var analytics = window.analytics;
  var Analytics = analytics.constructor;
  var assert = require('assert');
  var equal = require('equals');
  var memory = Analytics.memory;

  afterEach(function () {
    memory.remove('x');
  });

  describe('#get', function () {
    it('should not not get an empty record', function () {
      assert(memory.get('abc') === undefined);
    });

    it('should get an existing record', function () {
      memory.set('x', { a : 'b' });
      assert(equal(memory.get('x'), { a : 'b' }));
    });
  });

  describe('#set', function () {
    it('should be able to set a record', function () {
      memory.set('x', { a : 'b' });
      assert(equal(memory.get('x'), { a : 'b' }));
    });
  });

  describe('#remove', function () {
    it('should be able to remove a record', function () {
      memory.set('x', { a : 'b' });
      assert(equal(memory.get('x'), { a : 'b' }));
      memory.remove('x');
      assert(memory.get('x') === undefined);
    });
  });
});
