
describe('cookie', function () {

  var analytics = window.analytics;
  var require = analytics.require;
  var assert = dev('assert');
  var cookie = require('./cookie.js');
  var equal = dev('equals');

  afterEach(function () {
    cookie.options({}); // reset to defaults
    cookie.remove('x');
  });

  describe('#get', function () {
    it('should not not get an empty cookie', function () {
      assert(cookie.get('abc') === null);
    });

    it('should get an existing cookie', function () {
      cookie.set('x', { a : 'b' });
      assert(equal(cookie.get('x'), { a : 'b' }));
    });

    it('should not throw an error on a malformed cookie', function () {
      document.cookie="x=y";
      assert(cookie.get('x') === null);
    });
  });

  describe('#set', function () {
    it('should set a cookie', function () {
      cookie.set('x', { a : 'b' });
      assert(equal(cookie.get('x'), { a : 'b' }));
    });
  });

  describe('#remove', function () {
    it('should remove a cookie', function () {
      cookie.set('x', { a : 'b' });
      assert(equal(cookie.get('x'), { a : 'b' }));
      cookie.remove('x');
      assert(cookie.get('x') === null);
    });
  });

  describe('#options', function () {
    it('should save options', function () {
      cookie.options({ path: '/xyz' });
      assert(equal(cookie.options().path, '/xyz'));
      assert(equal(cookie.options().maxage, 31536000000));
    });
  });

});
