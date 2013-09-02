
describe('Cookie', function () {

var cookie = require('analytics/lib/cookie.js');

after(function () {
  cookie.options({}); // reset to defaults
});

describe('#get()', function () {
  it('should not not get an empty cookie', function () {
    expect(cookie.get('abc')).to.be(null);
  });

  it('should get an existing cookie', function () {
    cookie.set('x', { a : 'b' });
    expect(cookie.get('x')).to.eql({ a : 'b' });
    cookie.remove('x');
  });

  it('should not throw an error on a malformed cookie', function () {
    document.cookie="x=y";
    expect(cookie.get('x')).to.be(null);
    cookie.remove('x');
  });
});


describe('#set()', function () {
  it('should be able to set a cookie', function () {
    cookie.set('x', { a : 'b' });
    expect(cookie.get('x')).to.eql({ a : 'b' });
    cookie.remove('x');
  });
});


describe('#remove()', function () {
  it('should be able to remove a cookie', function () {
    cookie.set('x', { a : 'b' });
    expect(cookie.get('x')).to.eql({ a : 'b' });
    cookie.remove('x');
    expect(cookie.get('x')).to.be(null);
  });
});


describe('#options()', function () {
  it('should be able to save options', function () {
    cookie.options({
      path: '/xyz'
    });

    expect(cookie.options().path).to.eql('/xyz');
    expect(cookie.options().maxage).to.eql(31536000000);
  });
});

});