

describe('Local Storage tests', function () {

  var localStore = require('analytics/lib/localStore.js');

  describe('#get()', function () {
    it('should not not get an empty record', function () {
      expect(localStore.get('abc')).to.be(undefined);
    });

    it('should get an existing record', function () {
      localStore.set('x', { a : 'b' });
      expect(localStore.get('x')).to.eql({ a : 'b' });
    });
  });


  describe('#set()', function () {
    it('should be able to set a record', function () {
      localStore.set('x', { a : 'b' });
      expect(localStore.get('x')).to.eql({ a : 'b' });
      localStore.remove('x');
    });
  });


  describe('#remove()', function () {
    it('should be able to remove a record', function () {
      localStore.set('x', { a : 'b' });
      expect(localStore.get('x')).to.eql({ a : 'b' });
      localStore.remove('x');
      expect(localStore.get('x')).to.be(undefined);
    });
  });


  describe('#options()', function () {
    it('should be able to save options', function () {
      localStore.options({
        enabled : false
      });
      expect(localStore.options().enabled).to.eql(false);
      expect(localStore.enabled).to.eql(false);
    });
  });
});