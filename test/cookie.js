
var assert = require('assert');
var cookie = window.analytics.constructor.cookie;

describe('cookie', function() {
  before(function(){
    // Just to make sure that
    // URIError is never thrown here.
    document.cookie = 'bad=%';
  });

  afterEach(function() {
    // reset to defaults
    cookie.options({});
    cookie.remove('x');
  });

  describe('#get', function() {
    it('should not not get an empty cookie', function() {
      assert(cookie.get('abc') === null);
    });

    it('should get an existing cookie', function() {
      cookie.set('x', { a: 'b' });
      assert.deepEqual(cookie.get('x'), { a: 'b' });
    });

    it('should not throw an error on a malformed cookie', function() {
      document.cookie = 'x=y';
      assert(cookie.get('x') === null);
    });
  });

  describe('#set', function() {
    it('should set a cookie', function() {
      cookie.set('x', { a: 'b' });
      assert.deepEqual(cookie.get('x'), { a: 'b' });
    });
  });

  describe('#remove', function() {
    it('should remove a cookie', function() {
      cookie.set('x', { a: 'b' });
      assert.deepEqual(cookie.get('x'), { a: 'b' });
      cookie.remove('x');
      assert(cookie.get('x') === null);
    });
  });

  describe('#options', function() {
    it('should save options', function() {
      cookie.options({ path: '/xyz' });
      assert(cookie.options().path === '/xyz');
      assert(cookie.options().maxage === 31536000000);
    });

    it('should set the domain correctly', function(){
      cookie.options({ domain: '' });
      assert(cookie.options().domain === '');
    });

    it('should fallback to `domain=null` when it cant set the test cookie', function(){
      cookie.options({ domain: 'baz.com' });
      assert(cookie.options().domain === null);
      assert(cookie.get('ajs:test') === null);
    });

    // TODO: unskip once we don't use `window`, instead mock it :/
    it.skip('should set domain localhost to `""`', function(){
      cookie.options({});
      assert(cookie.options().domain === '');
    });
  });
});
